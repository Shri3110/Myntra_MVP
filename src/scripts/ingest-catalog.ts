import { createClient } from 'redis';

const ingestData = async () => {
  const redisClient = createClient({
    url: 'redis://localhost:6379'
  });

  redisClient.on('error', err => console.log('Redis Client Error', err));
  await redisClient.connect();

  console.log('[Ingestion] Connected to Redis');

  // Seed AI Banner Data for user123 and SKU1001
  const bannerDataUser123SKU1001 = {
    fitScore: 85,
    consensus: 'Fits true to size for Hourglass body types.',
    isFallback: false
  };

  await redisClient.set(
    'ai_banner:user123:SKU1001', 
    JSON.stringify(bannerDataUser123SKU1001),
    { EX: 3600 } // expire in 1 hour
  );

  console.log('[Ingestion] Seeded AI Banner data into Redis');

  // TODO: Add MongoDB insertion for reviews/UGC later.

  await redisClient.quit();
  console.log('[Ingestion] Complete');
};

ingestData();
