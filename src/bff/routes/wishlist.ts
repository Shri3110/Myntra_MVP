import { Router, Request, Response } from 'express';
import axios from 'axios';
import redisClient from '../services/redis';
import { aiBannerLatencyHistogram } from '../telemetry';

const router = Router();

const getMockUrl = () => process.env.MOCK_SERVICES_URL || 'http://127.0.0.1:3001';

router.get('/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  
  try {
    // 1. Fetch wishlist from existing Myntra Service
    const wishlistRes = await axios.get(`${getMockUrl()}/internal/wishlist/${userId}`);
    const { items, userProfile } = wishlistRes.data;

    // 2. Fetch AI Banner Data (Fit Score & Semantics) concurrently from Redis
    const enrichedItems = await Promise.all(items.map(async (item: any) => {
      const cacheKey = `ai_banner:${userId}:${item.sku}`;
      const cachedData = await redisClient.get(cacheKey);

      // Mock Feature Flag: Beta segment only for user IDs containing '123'
      const isBetaUser = userId.includes('123');

      if (!isBetaUser) {
        return { ...item, aiBanner: null };
      }

      let aiBannerData = null;
      if (cachedData) {
        aiBannerData = JSON.parse(cachedData);
      } else {
        // Fetch UGC for this SKU to pass to LLM
        let reviews: string[] = [];
        try {
          const ugcRes = await axios.get(`${getMockUrl()}/internal/ugc/${item.sku}`);
          const media = ugcRes.data.media || [];
          reviews = media.map((m: any) => m.reviewText).filter(Boolean);
        } catch (e) {
          console.error(`Failed to fetch UGC for ${item.sku}`, e);
        }

        const endTimer = aiBannerLatencyHistogram.startTimer();
        try {
          const fitScoreRes = await axios.post('http://127.0.0.1:8000/api/fit-score', {
            userProfile: { 
              ...userProfile,
              heightCm: userProfile?.heightCm || 160, 
              weightKg: userProfile?.weightKg || 60, 
              usualSize: userProfile?.usualSize || 'M', 
              bodyType: userProfile?.bodyType || 'Average',
              pastPurchaseHistory: ['M', 'M', 'L'],
              returnedSizes: ['S']
            },
            product: { 
              sku: item.sku, 
              availableSizes: item.product.availableSizes || [],
              category: item.product.category || 'Clothing',
              fabric: '100% Cotton',
              stretchFactor: 'Medium'
            },
            reviews
          });
          
          const engineData = fitScoreRes.data;
          
          let confidenceLevel = 'INSUFFICIENT_DATA';
          if (engineData.confidence_tier === 'HIGH_CONFIDENCE') confidenceLevel = 'HIGH';
          else if (engineData.confidence_tier === 'MEDIUM_CONFIDENCE') confidenceLevel = 'MEDIUM';

          aiBannerData = {
            confidenceLevel,
            caveatText: engineData.feedback_summary || "Runs slightly small — most reviewers recommend sizing up.",
            reasons: [
              `Analyzed ${engineData.breakdown?.sample_size_evaluated || 0} matching reviews`,
              `Sizing Consensus: ${engineData.breakdown?.consensus_percentage || 'N/A'}`,
              `Attribute Alignment: ${engineData.breakdown?.attribute_alignment_score || 'N/A'}`
            ],
            isFallback: false
          };
          
          // Asynchronously update Redis Cache
          redisClient.set(cacheKey, JSON.stringify(aiBannerData), { EX: 3600 });
          endTimer();
        } catch (e) {
          console.error('Failed to contact AI Engine', e);
          aiBannerData = {
            confidenceLevel: 'INSUFFICIENT_DATA',
            caveatText: "We don't have enough relevant fit information to confidently assess this product.",
            reasons: [],
            isFallback: true
          };
          endTimer();
        }
      }

      return {
        ...item,
        aiBanner: aiBannerData
      };
    }));

    res.json({
      userId,
      userProfile,
      items: enrichedItems
    });
  } catch (error) {
    console.error('Error fetching wishlist', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/details/:userId/:sku', async (req: Request, res: Response) => {
  const { userId, sku } = req.params;

  try {
    // 1. Fetch UGC
    const ugcRes = await axios.get(`${getMockUrl()}/internal/ugc/${sku}`);
    const media = ugcRes.data.media;

    // 2. Fetch Real-time Inventory
    const inventoryRes = await axios.get(`${getMockUrl()}/internal/inventory/${sku}`);
    const inventory = inventoryRes.data.inventory;

    // 3. Fetch Styling Recommendations (AI Engine)
    let styling = [];
    try {
      const stylingRes = await axios.post('http://127.0.0.1:8000/api/styling-recommendations', {
        sku,
        userProfile: { heightCm: 160, weightKg: 60, usualSize: 'M', bodyType: 'Average' } // Mock profile
      });
      styling = stylingRes.data.recommendations;
    } catch (e) {
      console.error('Failed to get styling recommendations', e);
    }

    res.json({
      sku,
      ugc: media,
      inventory,
      stylingRecommendations: styling
    });
  } catch (error) {
    console.error('Error fetching wishlist details', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const response = await axios.post(`${getMockUrl()}/internal/wishlist`, req.body);
    res.json(response.data);
  } catch (error: any) {
    console.error('Error adding to wishlist', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
  }
});

export default router;
