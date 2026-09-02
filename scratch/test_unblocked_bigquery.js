const http = require('http');

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ statusCode: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- TEST 1: Check /api/health Endpoint ---');
  try {
    const healthRes = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      method: 'GET',
    });
    console.log('Health Check Status:', healthRes.statusCode);
    console.log('Health Check Body:', JSON.stringify(healthRes.body, null, 2));
  } catch (err) {
    console.error('Health Check Error:', err.message);
  }

  console.log('\n--- TEST 2: Ingest Analytics Events ---');
  const eventsToTest = [
    { eventType: 'login', userId: 'user_test_100', entityType: 'user' },
    { eventType: 'space_assessed', userId: 'user_test_100', entityId: 'space-999', entityType: 'space', metadata: { usableAreaSqFt: 30 } },
    { eventType: 'plant_adopted', userId: 'user_test_100', entityId: 'adopt-888', entityType: 'plant', metadata: { speciesId: 'monstera_deliciosa' } },
    { eventType: 'care_task_completed', userId: 'user_test_100', entityId: 'task-777', entityType: 'care_task', metadata: { pointsAwarded: 10 } },
    { eventType: 'health_diagnostic', userId: 'user_test_100', entityId: 'diag-666', entityType: 'diagnostic', metadata: { healthStatus: 'healthy' } },
    { eventType: 'reward_redeemed', userId: 'user_test_100', entityId: 'rw-seed-pack-01', entityType: 'reward', metadata: { pointsCost: 75 } },
  ];

  for (const evt of eventsToTest) {
    try {
      const res = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/api/analytics/events',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }, evt);
      console.log(`Event [${evt.eventType}]: Status ${res.statusCode} ->`, JSON.stringify(res.body));
    } catch (err) {
      console.error(`Event [${evt.eventType}] Error:`, err.message);
    }
  }
}

runTests();
