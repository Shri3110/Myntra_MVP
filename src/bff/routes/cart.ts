import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();
const MOCK_SERVICES_URL = 'http://localhost:4000';

router.post('/', async (req: Request, res: Response) => {
  const { userId, sku, size } = req.body;

  try {
    const cartRes = await axios.post(`${MOCK_SERVICES_URL}/internal/cart`, { userId, sku, size });
    res.json(cartRes.data);
  } catch (error: any) {
    console.error('Error adding to cart', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { success: false });
  }
});

export default router;
