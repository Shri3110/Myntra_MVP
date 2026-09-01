import { Router, Request, Response } from 'express';
import { cartAdditionsCounter } from '../telemetry';

const router = Router();

router.post('/events', (req: Request, res: Response) => {
  const { eventName, properties } = req.body;

  if (eventName === 'WISHLIST_ADD_TO_CART') {
    cartAdditionsCounter.inc({ sku: properties.sku, status: properties.status });
  }

  res.json({ success: true });
});

export default router;
