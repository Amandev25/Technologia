// Test both Gemini API keys
require('dotenv').config();
const axios = require('axios');

const KEY1 = process.env.GEMINI_API_KEY;
const KEY2 = process.env.GEMINI_QUIZ_API_KEY;

async function testKey(keyName, apiKey) {
  console.log(`\n🧪 Testing ${keyName}...`);
  console.log(`Key: ${apiKey ? apiKey.substring(0, 20) + '...' : 'NOT SET'}`);
  
  if (!apiKey) {
    console.log('❌ Key not found!\n');
    return false;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
  
  try {
    const response = await axios.post(
      url,
      {
        contents: [{
          parts: [{
            text: 'Say "Hello, I am working!" in one sentence.'
          }]
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    const text = response.data.candidates[0].content.parts[0].text;
    console.log(`✅ ${keyName} works!`);
    console.log(`Response: ${text}`);
    return true;
    
  } catch (error) {
    console.log(`❌ ${keyName} failed!`);
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Error: ${error.response.data.error.message}`);
    } else {
      console.log(`Error: ${error.message}`);
    }
    return false;
  }
}

async function main() {
  console.log('='.repeat(50));
  console.log('Testing Gemini API Keys');
  console.log('='.repeat(50));
  
  const key1Works = await testKey('GEMINI_API_KEY (Grammar)', KEY1);
  const key2Works = await testKey('GEMINI_QUIZ_API_KEY (Quiz)', KEY2);
  
  console.log('\n' + '='.repeat(50));
  console.log('Summary:');
  console.log('='.repeat(50));
  console.log(`Grammar Key: ${key1Works ? '✅ Working' : '❌ Not Working'}`);
  console.log(`Quiz Key: ${key2Works ? '✅ Working' : '❌ Not Working'}`);
  
  if (!key2Works && key1Works) {
    console.log('\n💡 Recommendation:');
    console.log('Use GEMINI_API_KEY for both features.');
    console.log('Update backend/routes/index.js to use GEMINI_API_KEY for quiz.');
  }
  
  console.log('\n');
}

main();
