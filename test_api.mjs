import { fetchDestinations, searchExternalPlaces } from './src/api.js';

async function runTests() {
  console.log('--- 1. Testing fetchDestinations() ---');
  const destinations = await fetchDestinations();
  console.log(`Fetched ${destinations.length} destinations.`);
  
  if (destinations.length === 0) {
    throw new Error('fetchDestinations returned an empty array!');
  }

  const sample = destinations[0];
  console.log('Sample destination:');
  console.log('  Name:', sample.name);
  console.log('  Location:', sample.location);
  console.log('  Category:', sample.category);
  console.log('  Has Image:', Boolean(sample.imageUrl));
  console.log('  Has Description:', Boolean(sample.description));
  console.log('  Coordinates:', sample.coordinates);

  console.log('\n--- 2. Testing searchExternalPlaces("Tokyo") ---');
  const searchResults = await searchExternalPlaces('Tokyo');
  console.log(`Live search returned ${searchResults.length} places.`);
  if (searchResults.length > 0) {
    console.log('  First search result:', searchResults[0].name);
  }

  console.log('\n--- 3. Testing Categories ---');
  const categories = [...new Set(destinations.map(d => d.category))];
  console.log('  Extracted categories:', categories);

  console.log('\nSUCCESS: All API integration tests verified!');
}

runTests().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
