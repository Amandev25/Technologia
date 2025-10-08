// Test script for Quiz API (Gemini 2.0 Flash)
require('dotenv').config();
const axios = require('axios');

const GEMINI_QUIZ_API_KEY = process.env.GEMINI_QUIZ_API_KEY || process.env.GEMINI_API_KEY;
const GEMINI_FLASH_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

async function testQuizAPI() {
  console.log('🧪 Testing Quiz API (Gemini 2.0 Flash)...\n');
  
  // Check if API key is loaded
  if (!GEMINI_QUIZ_API_KEY || GEMINI_QUIZ_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    console.error('❌ Error: GEMINI_QUIZ_API_KEY not found in .env file');
    console.log('Please add your API key to backend/.env:');
    console.log('GEMINI_QUIZ_API_KEY=your_actual_key_here\n');
    return;
  }
  
  console.log('✅ API Key loaded:', GEMINI_QUIZ_API_KEY.substring(0, 20) + '...\n');
  
  const prompt = `Generate 5 multiple choice questions for basic level on the topic: English Grammar.

Requirements:
- Questions should be educational and test understanding
- Each question should have 4 options (A, B, C, D)
- Only one correct answer per question
- Include brief explanation for correct answer
- Difficulty: basic

Provide response in this exact JSON format:
{
  "level": 1,
  "difficulty": "basic",
  "topic": "English Grammar",
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "options": {
        "A": "Option A text",
        "B": "Option B text",
        "C": "Option C text",
        "D": "Option D text"
      },
      "correctAnswer": "A",
      "explanation": "Why this is correct"
    }
  ]
}`;

  try {
    console.log('🚀 Calling Gemini 2.0 Flash API...\n');
    
    const response = await axios.post(
      `${GEMINI_FLASH_URL}?key=${GEMINI_QUIZ_API_KEY}`,
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
    console.log('✅ Gemini 2.0 Flash Response:\n');
    console.log(generatedText);
    console.log('\n');
    
    // Try to parse JSON
    try {
      const jsonMatch = generatedText.match(/```json\n([\s\S]*?)\n```/) || 
                       generatedText.match(/```\n([\s\S]*?)\n```/) ||
                       [null, generatedText];
      const jsonText = jsonMatch[1] || generatedText;
      const result = JSON.parse(jsonText.trim());
      
      console.log('📊 Parsed Quiz Data:');
      console.log('Level:', result.level);
      console.log('Difficulty:', result.difficulty);
      console.log('Topic:', result.topic);
      console.log('Questions:', result.questions.length);
      console.log('\nSample Question:');
      console.log('Q:', result.questions[0].question);
      console.log('Options:', result.questions[0].options);
      console.log('Correct Answer:', result.questions[0].correctAnswer);
      console.log('Explanation:', result.questions[0].explanation);
      
      console.log('\n✅ Test Successful! Quiz API is working correctly! 🎉');
      console.log('\n🎯 You can now use the Quiz feature in your app!');
      
    } catch (parseError) {
      console.log('⚠️  Could not parse as JSON, but Gemini responded');
      console.log('This might be okay - check the response format\n');
    }
    
  } catch (error) {
    console.error('❌ Error calling Gemini 2.0 Flash API:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    console.log('\nPossible issues:');
    console.log('1. Check your API key is correct');
    console.log('2. Check your internet connection');
    console.log('3. Verify API key has permissions for Gemini 2.0 Flash');
    console.log('4. Check if you\'ve exceeded quota\n');
  }
}

// Run the test
testQuizAPI();
