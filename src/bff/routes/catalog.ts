import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();
const MOCK_SERVICES_URL = 'http://localhost:4000';

router.get('/', async (req: Request, res: Response) => {
  try {
    const catalogRes = await axios.get(`${MOCK_SERVICES_URL}/internal/catalog`);
    res.json(catalogRes.data);
  } catch (error) {
    console.error('Error fetching catalog', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
