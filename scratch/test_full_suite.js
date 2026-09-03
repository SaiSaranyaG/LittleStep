const http = require('http');

async function testHealthEndpoint() {
  return new Promise((resolve, reject) => {
    const req = http.request('http://localhost:3000/api/health', { method: 'GET' }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: json });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data });
        }
      });
    });
    req.on('error', err => resolve({ error: err.message }));
    req.end();
  });
}

async function testUnauthenticatedProtectedEndpoint() {
  return new Promise((resolve) => {
    const postData = JSON.stringify({ actionId: 'test_action', pointsToAdd: 50 });
    const req = http.request('http://localhost:3000/api/points/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: data });
      });
    });
    req.on('error', err => resolve({ error: err.message }));
    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('LITTLESTEP COMPLETE VERIFICATION SUITE');
  console.log('====================================================');

  console.log('\n[1] Testing /api/health endpoint...');
  const health = await testHealthEndpoint();
  console.log('Health Status Code:', health.statusCode);
  console.log('Health Response:', JSON.stringify(health.data, null, 2));

  console.log('\n[2] Testing Security: Unauthenticated request to /api/points/verify...');
  const sec = await testUnauthenticatedProtectedEndpoint();
  console.log('Protected Endpoint Status Code (Expected 401):', sec.statusCode);
  console.log('Response:', sec.body);

  if (sec.statusCode === 401) {
    console.log('✅ PASS: Anonymous request safely rejected with 401 Unauthorized.');
  } else {
    console.log('❌ FAIL: Anonymous request was not rejected with 401.');
  }

  console.log('\n====================================================');
  console.log('TEST SUITE COMPLETE');
  console.log('====================================================');
}

runTests();
