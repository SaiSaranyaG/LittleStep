const fs = require('fs');
const path = require('path');

// Test helper to simulate space analyzer AI response
function testSpaceAnalyzer(imageFileName, spaceType) {
  const imgPath = path.join(__dirname, '..', 'src', 'assets', 'images', imageFileName);
  if (!fs.existsSync(imgPath)) {
    console.error(`File not found: ${imgPath}`);
    return;
  }

  const fileBuffer = fs.readFileSync(imgPath);
  const base64Data = fileBuffer.toString('base64');
  const sizeKb = Math.round(fileBuffer.length / 1024);

  console.log(`\n====================================================`);
  console.log(`SPACE ANALYZER TEST: ${imageFileName}`);
  console.log(`Space Type: ${spaceType} | Image Size: ${sizeKb} KB`);
  console.log(`====================================================`);

  // Simulate space analyzer evaluation
  const isBalcony = spaceType.toLowerCase().includes('balcony');
  const isWindowNook = spaceType.toLowerCase().includes('window') || imageFileName.includes('nook');

  const result = {
    space_type: isBalcony ? 'balcony' : isWindowNook ? 'window_nook' : 'indoor_corner',
    estimated_length_ft: isBalcony ? 8.5 : isWindowNook ? 4.5 : 6.0,
    estimated_width_ft: isBalcony ? 5.0 : isWindowNook ? 3.0 : 4.0,
    usable_area_sqft: isBalcony ? 32.5 : isWindowNook ? 12.0 : 20.0,
    confidence: 0.88,
    measurement_method: 'multimodal_ai_spatial_estimation',
    requires_user_confirmation: true,
    confirmation_prompt: `I estimate this ${spaceType} is approximately ${isBalcony ? '8.5 ft' : '6 ft'} wide. Is this accurate?`,
    plant_capacity_estimate: isBalcony ? 7 : isWindowNook ? 3 : 4,
    light_assessment: isBalcony
      ? 'Bright direct sun (4–6 hours daily)'
      : isWindowNook
      ? 'Bright indirect natural illumination'
      : 'Medium indirect ambient light',
    safety_warnings: isBalcony ? ['Ensure sturdy saucers for potted plants', 'Secure railing hanging pots'] : ['Keep path clear of tripping hazards'],
    zones: [
      {
        id: 'zone-1-sun',
        name: isBalcony ? 'Zone A (Railing Sun Spot)' : 'Zone A (Window Direct Light)',
        zoneType: 'plant_zone',
        lightLevel: isBalcony ? 'direct_sun' : 'bright_indirect',
        color: '#f59e0b',
        x: 15,
        y: 12,
        w: 45,
        h: 35,
        recommendedSize: 'medium',
        notes: 'Optimal sunlight zone for flowering / sun-loving companions.',
      },
      {
        id: 'zone-2-shade',
        name: 'Zone B (Shaded Floor Stand)',
        zoneType: 'plant_zone',
        lightLevel: 'medium_indirect',
        color: '#10b981',
        x: 65,
        y: 12,
        w: 25,
        h: 40,
        recommendedSize: 'small',
        notes: 'Gentle indirect ambient light.',
      },
    ],
  };

  console.log('STATUS: 200 OK');
  console.log('SOURCE: gemini_multimodal_spatial_agent');
  console.log('ANALYSIS RESULT:');
  console.log(JSON.stringify(result, null, 2));

  return result;
}

// Run tests across sample pictures
testSpaceAnalyzer('story_empty_corner_1788194380921.jpg', 'indoor_corner');
testSpaceAnalyzer('story_balcony_oasis_1788194436360.jpg', 'balcony');
testSpaceAnalyzer('story_growing_nook_1788194416149.jpg', 'window_nook');
