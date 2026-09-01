import axios from 'axios';

const NUM_REQUESTS = 100;
const BFF_URL = 'http://localhost:3000/api/wishlist/user123';

async function runLoadTest() {
  console.log(`Starting load test: sending ${NUM_REQUESTS} concurrent requests to ${BFF_URL}...`);
  
  const start = Date.now();
  
  const promises = [];
  for (let i = 0; i < NUM_REQUESTS; i++) {
    // We append a random query parameter to bust any simple HTTP caches (though our Redis logic still applies)
    const reqStart = Date.now();
    promises.push(
      axios.get(`${BFF_URL}?nocache=${i}`)
        .then(() => Date.now() - reqStart)
        .catch(() => Date.now() - reqStart)
    );
  }

  const times = await Promise.all(promises);
  const totalTime = Date.now() - start;

  times.sort((a, b) => a - b);
  
  const p95Index = Math.floor(NUM_REQUESTS * 0.95);
  const p95Latency = times[p95Index];
  const avgLatency = times.reduce((a, b) => a + b, 0) / NUM_REQUESTS;

  console.log('--- Load Test Results ---');
  console.log(`Total Requests: ${NUM_REQUESTS}`);
  console.log(`Total Time Elapsed: ${totalTime}ms`);
  console.log(`Average Latency: ${avgLatency.toFixed(2)}ms`);
  console.log(`P95 Latency: ${p95Latency}ms`);
  
  if (p95Latency < 500) {
    console.log('✅ P95 Latency is under 500ms limit!');
  } else {
    console.log('❌ P95 Latency exceeded 500ms limit!');
  }
}

runLoadTest();
