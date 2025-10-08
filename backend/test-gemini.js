// Test script for Gemini API integration
require('dotenv').config();
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

async function testGemini() {
  console.log('🧪 Testing Gemini API Integration...\n');
  
  // Check if API key is loaded
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    console.error('❌ Error: GEMINI_API_KEY not found in .env file');
    console.log('Please add your API key to backend/.env:');
    console.log('GEMINI_API_KEY=your_actual_key_here\n');
    return;
  }
  
  console.log('✅ API Key loaded:', GEMINI_API_KEY.substring(0, 20) + '...\n');
  
  // Test text with errors
  const testText = "I goes to school yesterday and she don't like apples";
  console.log('📝 Testing with text:', testText);
  console.log('Expected errors: "goes" → "went", "don\'t" → "doesn\'t"\n');
  
  const prompt = `You are a grammar and spelling checker. Analyze the following text and provide corrections in JSON format.

Text to check: "${testText}"

Provide your response in this exact JSON format:
{
  "hasErrors": true/false,
  "errorCount": number,
  "corrections": [
    {
      "type": "grammar" or "spelling",
      "original": "incorrect text",
      "correction": "corrected text",
      "explanation": "brief explanation"
    }
  ],
  "correctedText": "full corrected version of the text"
}

If there are no errors, return hasErrors: false and empty corrections array.`;

  try {
    console.log('🚀 Calling Gemini API...\n');
    
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    const generatedText = response.data.candidates[0].content.parts[0].text;
    console.log('✅ Gemini Response:\n');
    console.log(generatedText);
    console.log('\n');
    
    // Try to parse JSON
    try {
      const jsonMatch = generatedText.match(/```json\n([\s\S]*?)\n```/) || 
                       generatedText.match(/```\n([\s\S]*?)\n```/) ||
                       [null, generatedText];
      const jsonText = jsonMatch[1] || generatedText;
      const result = JSON.parse(jsonText.trim());
      
      console.log('📊 Parsed Result:');
      console.log('Has Errors:', result.hasErrors);
      console.log('Error Count:', result.errorCount);
      console.log('\nCorrections:');
      result.corrections.forEach((c, i) => {
        console.log(`  ${i + 1}. ${c.original} → ${c.correction}`);
        console.log(`     Type: ${c.type}`);
        console.log(`     Explanation: ${c.explanation}\n`);
      });
      console.log('Corrected Text:', result.correctedText);
      
      console.log('\n✅ Test Successful! Gemini API is working correctly! 🎉');
      
    } catch (parseError) {
      console.log('⚠️  Could not parse as JSON, but Gemini responded');
      console.log('This is okay - the API is working!\n');
    }
    
  } catch (error) {
    console.error('❌ Error calling Gemini API:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    console.log('\nPossible issues:');
    console.log('1. Check your API key is correct');
    console.log('2. Check your internet connection');
    console.log('3. Verify API key has permissions');
    console.log('4. Check if you\'ve exceeded quota\n');
  }
}

// Run the test
testGemini();
