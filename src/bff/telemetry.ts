import client from 'prom-client';

// Enable default metrics (CPU, Memory, etc.)
client.collectDefaultMetrics();

// Define custom metrics
export const cartAdditionsCounter = new client.Counter({
  name: 'wishlist_cart_adds_total',
  help: 'Total number of items added to cart from the wishlist',
  labelNames: ['sku', 'status']
});

export const aiBannerLatencyHistogram = new client.Histogram({
  name: 'ai_banner_latency_ms',
  help: 'Latency of AI Banner fetching',
  buckets: [50, 100, 250, 500, 1000, 2500] // Custom buckets for 500ms P95 guardrail
});

export const metricsRegistry = client.register;
