import { Router, Request, Response } from 'express';
import axios from 'axios';
import redisClient from '../services/redis';
import { aiBannerLatencyHistogram } from '../telemetry';

const router = Router();

const MOCK_SERVICES_URL = 'http://localhost:4000';

router.get('/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  
  try {
    // 1. Fetch wishlist from existing Myntra Service
    const wishlistRes = await axios.get(`${MOCK_SERVICES_URL}/internal/wishlist/${userId}`);
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
        // Fallback: Trigger async generation via Python AI Engine
        const endTimer = aiBannerLatencyHistogram.startTimer();
        try {
          const fitScoreRes = await axios.post('http://127.0.0.1:8000/api/fit-score', {
            userProfile: userProfile || { heightCm: 160, weightKg: 60, usualSize: 'M', bodyType: 'Average' },
            product: { 
              sku: item.sku, 
              availableSizes: item.product.availableSizes || [],
              category: item.product.category || 'Clothing'
            }
          });
          const fitScore = fitScoreRes.data.fitScore;
          
          const summaryRes = await axios.post('http://127.0.0.1:8000/api/summarize-reviews', {
            sku: item.sku,
            reviews: item.reviews || ["Great fit!"]
          });
          
          aiBannerData = {
            fitScore: fitScoreRes.data.fitScore,
            consensus: summaryRes.data.consensus,
            isFallback: false
          };
          
          // Asynchronously update Redis Cache
          redisClient.set(cacheKey, JSON.stringify(aiBannerData), { EX: 3600 });
          endTimer();
        } catch (e) {
          console.error('Failed to contact AI Engine', e);
          aiBannerData = {
            fitScore: null,
            consensus: 'Generating fit insights...',
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
    const ugcRes = await axios.get(`${MOCK_SERVICES_URL}/internal/ugc/${sku}`);
    const media = ugcRes.data.media;

    // 2. Fetch Real-time Inventory
    const inventoryRes = await axios.get(`${MOCK_SERVICES_URL}/internal/inventory/${sku}`);
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
    const response = await axios.post(`${MOCK_SERVICES_URL}/internal/wishlist`, req.body);
    res.json(response.data);
  } catch (error: any) {
    console.error('Error adding to wishlist', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
  }
});

export default router;
