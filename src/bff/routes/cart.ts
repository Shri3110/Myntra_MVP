import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();
const getMockUrl = () => process.env.MOCK_SERVICES_URL || 'http://127.0.0.1:3001';

router.post('/', async (req: Request, res: Response) => {
  const { userId, sku, size } = req.body;

  try {
    const cartRes = await axios.post(`${getMockUrl()}/internal/cart`, { userId, sku, size });
    res.json(cartRes.data);
  } catch (error: any) {
    console.error('Error adding to cart', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { success: false });
  }
});

export default router;
