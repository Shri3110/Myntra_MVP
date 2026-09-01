import express from 'express';
import cors from 'cors';
import wishlistRoutes from './routes/wishlist';
import cartRoutes from './routes/cart';
import telemetryRoutes from './routes/telemetry';
import catalogRoutes from './routes/catalog';
import { connectRedis } from './services/redis';
import { connectChroma } from './services/chroma';
import { metricsRegistry } from './telemetry';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/catalog', catalogRoutes);

app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', metricsRegistry.contentType);
  res.send(await metricsRegistry.metrics());
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

const startServer = async () => {
  try {
    await connectRedis();
    await connectChroma();
    // Connect to MongoDB here eventually
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[BFF] API Gateway running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
  }
};

startServer();
