// Mocking Redis for local dev without Docker
const inMemoryCache: Record<string, string> = {};

export const connectRedis = async () => {
  console.log('[Redis] Mock Redis initialized');
};

const redisClient = {
  get: async (key: string) => inMemoryCache[key] || null,
  set: async (key: string, value: string, options?: any) => {
    inMemoryCache[key] = value;
  }
};

export default redisClient;
