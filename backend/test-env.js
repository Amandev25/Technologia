// Quick test to check .env loading
require('dotenv').config();

console.log('='.repeat(50));
console.log('Environment Variables Test');
console.log('='.repeat(50));

console.log('\n📋 Loaded Variables:');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY || '❌ NOT SET');
console.log('GEMINI_QUIZ_API_KEY:', process.env.GEMINI_QUIZ_API_KEY || '❌ NOT SET');

console.log('\n🔍 Key Details:');
if (process.env.GEMINI_API_KEY) {
  console.log('GEMINI_API_KEY starts with:', process.env.GEMINI_API_KEY.substring(0, 20));
  console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY.length);
}

if (process.env.GEMINI_QUIZ_API_KEY) {
  console.log('GEMINI_QUIZ_API_KEY starts with:', process.env.GEMINI_QUIZ_API_KEY.substring(0, 20));
  console.log('GEMINI_QUIZ_API_KEY length:', process.env.GEMINI_QUIZ_API_KEY.length);
}

console.log('\n💡 What will be used:');
const QUIZ_KEY = process.env.GEMINI_API_KEY;
console.log('Quiz will use:', QUIZ_KEY ? QUIZ_KEY.substring(0, 20) + '...' : '❌ NOT SET');

console.log('\n✅ Expected:');
console.log('Should use: AIzaSyD8JukG-b9dYHtu...');

console.log('\n');
