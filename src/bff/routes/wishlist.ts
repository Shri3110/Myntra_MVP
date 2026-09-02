import { Router, Request, Response } from 'express';
import axios from 'axios';
import redisClient from '../services/redis';
import { aiBannerLatencyHistogram } from '../telemetry';
import { calculateFitConfidence } from '../services/fitEngine';

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
      const cacheKey = `ai_banner_v2:${userId}:${item.sku}`;
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
        // Fallback: Calculate via Deterministic Fit Engine
        const endTimer = aiBannerLatencyHistogram.startTimer();
        try {
          // Fetch required mock data for the engine
          const [historyRes, specsRes, reviewsRes] = await Promise.all([
            axios.get(`${getMockUrl()}/internal/history/${userId}`),
            axios.get(`${getMockUrl()}/internal/specs/${item.sku}`),
            axios.get(`${getMockUrl()}/internal/reviews/${item.sku}`)
          ]);

          const userHistory = historyRes.data;
          const productSpecs = specsRes.data;
          const productReviews = reviewsRes.data;

          aiBannerData = calculateFitConfidence(
            userProfile || { heightCm: 160, weightKg: 60, usualSize: 'M', bodyType: 'Average' },
            userHistory,
            item.product,
            productSpecs,
            productReviews
          );
          
          // Asynchronously update Redis Cache
          redisClient.set(cacheKey, JSON.stringify(aiBannerData), { EX: 3600 });
          endTimer();
        } catch (e) {
          console.error('Failed to calculate Fit Confidence', e);
          aiBannerData = {
            confidenceLevel: 'LOW',
            caveatText: 'Unable to calculate sizing insights.',
            reasons: ['Error calculating insights'],
            recommendedSize: 'M',
            recommendedSizeRationale: 'Fallback size',
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

router.post('/banner/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { item } = req.body; // { sku, product }
  
  try {
    const cacheKey = `ai_banner_v2:${userId}:${item.sku}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const [historyRes, specsRes, reviewsRes] = await Promise.all([
      axios.get(`${getMockUrl()}/internal/history/${userId}`),
      axios.get(`${getMockUrl()}/internal/specs/${item.sku}`),
      axios.get(`${getMockUrl()}/internal/reviews/${item.sku}`)
    ]);

    const userProfile = { heightCm: 160, weightKg: 60, usualSize: 'M', bodyType: 'Average' };
    const aiBannerData = calculateFitConfidence(
      userProfile,
      historyRes.data,
      item.product || item,
      specsRes.data,
      reviewsRes.data
    );
    
    redisClient.set(cacheKey, JSON.stringify(aiBannerData), { EX: 3600 });
    res.json(aiBannerData);
  } catch (error) {
    console.error('Error calculating banner', error);
    res.json({
      confidenceLevel: 'LOW',
      caveatText: 'Unable to calculate sizing insights.',
      reasons: ['Error calculating insights'],
      recommendedSize: 'M',
      recommendedSizeRationale: 'Fallback size',
      isFallback: true
    });
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
