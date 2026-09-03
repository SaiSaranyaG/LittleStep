const http = require('http');

/**
 * BigQuery Sample Telemetry Data Ingestion Script
 * Dataset: littlestep_analytics | Table: analytics_events
 */

const sampleTelemetryEvents = [
  {
    eventId: `evt_${Date.now()}_001`,
    eventType: 'user_registered',
    userId: 'usr_maya_882',
    timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    entityId: 'usr_maya_882',
    entityType: 'user',
    metadata: {
      authProvider: 'email',
      experienceLevel: 'beginner',
      preferredStyle: 'low_maintenance',
    },
    environment: 'production',
  },
  {
    eventId: `evt_${Date.now()}_002`,
    eventType: 'space_assessed',
    userId: 'usr_maya_882',
    timestamp: new Date(Date.now() - 3600000 * 24 * 2 + 300000).toISOString(),
    entityId: 'space-balcony-01',
    entityType: 'space',
    metadata: {
      spaceType: 'balcony',
      usableAreaSqFt: 32.5,
      estimatedLengthFt: 8.5,
      estimatedWidthFt: 5.0,
      lightAssessment: 'Bright direct sun (4–6 hours daily)',
      plantCapacityEstimate: 7,
    },
    environment: 'production',
  },
  {
    eventId: `evt_${Date.now()}_003`,
    eventType: 'plant_recommended',
    userId: 'usr_maya_882',
    timestamp: new Date(Date.now() - 3600000 * 24 * 2 + 600000).toISOString(),
    entityId: 'monstera-deliciosa',
    entityType: 'plant_catalog',
    metadata: {
      matchScore: 96,
      selectedStyle: 'statement_foliage',
      careLevel: 'easy',
      sourceAgent: 'gemini_multimodal_plant_recommender',
    },
    environment: 'production',
  },
  {
    eventId: `evt_${Date.now()}_004`,
    eventType: 'plant_adopted',
    userId: 'usr_maya_882',
    timestamp: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    entityId: 'adopt-monstera-001',
    entityType: 'plant',
    metadata: {
      speciesId: 'monstera-deliciosa',
      nickname: 'Monty',
      spaceId: 'space-balcony-01',
      pointsAwarded: 50,
    },
    environment: 'production',
  },
  {
    eventId: `evt_${Date.now()}_005`,
    eventType: 'care_task_completed',
    userId: 'usr_maya_882',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    entityId: 'task-water-001',
    entityType: 'care_task',
    metadata: {
      taskType: 'water',
      plantNickname: 'Monty',
      moistureLevelBefore: 18,
      moistureLevelAfter: 75,
      pointsAwarded: 10,
    },
    environment: 'production',
  },
  {
    eventId: `evt_${Date.now()}_006`,
    eventType: 'health_diagnostic',
    userId: 'usr_maya_882',
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    entityId: 'diag-monstera-001',
    entityType: 'diagnostic',
    metadata: {
      healthStatus: 'healthy',
      confidence: 'high',
      diagnosis: 'Vibrant foliage with healthy petiole posture',
      photoUploadedToStorage: true,
      storageUrl: 'gs://gen-lang-client-0222003829.firebasestorage.app/users/usr_maya_882/diagnostics/diag-001.jpg',
    },
    environment: 'production',
  },
  {
    eventId: `evt_${Date.now()}_007`,
    eventType: 'reward_redeemed',
    userId: 'usr_maya_882',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    entityId: 'rw-organic-seed-pack',
    entityType: 'reward',
    metadata: {
      rewardName: 'Heirloom Organic Herb Seed Pack',
      pointsCost: 75,
      newPointsBalance: 35,
    },
    environment: 'production',
  },
];

function postEvent(evt) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(evt);
    const req = http.request('http://localhost:3000/api/analytics/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', err => resolve({ error: err.message }));
    req.write(postData);
    req.end();
  });
}

async function insertAllSamples() {
  console.log('====================================================');
  console.log('BIGQUERY SAMPLE TELEMETRY DATA INGESTION');
  console.log('Target Dataset: littlestep_analytics');
  console.log('Target Table:   telemetry_events');
  console.log('====================================================\n');

  let successCount = 0;
  for (const evt of sampleTelemetryEvents) {
    console.log(`Ingesting Event: [${evt.eventType}] (ID: ${evt.eventId})...`);
    console.log(`  User: ${evt.userId} | Entity: ${evt.entityId} (${evt.entityType})`);
    console.log(`  Metadata: ${JSON.stringify(evt.metadata)}`);
    const res = await postEvent(evt);
    console.log(`  Result: Status ${res.statusCode || 'N/A'} ${res.error ? `Error: ${res.error}` : '✅ Ingested'}\n`);
    if (res.statusCode === 200 || !res.error) successCount++;
  }

  console.log('====================================================');
  console.log(`BIGQUERY SAMPLE DATA INGESTION SUMMARY`);
  console.log(`Total Sample Records Prepared: ${sampleTelemetryEvents.length}`);
  console.log(`Ingestion Result: ${successCount}/${sampleTelemetryEvents.length} events processed.`);
  console.log('====================================================');
}

insertAllSamples();
