const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const password = "hello_world";
const User = require('../model/User');
const python_url_correect_essay = "http://localhost:8000/correct-essay";

// Gemini API Configuration - Use functions to get env vars at runtime
const getGeminiKey = () => process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
// Use Gemini 2.0 Flash for quiz generation
const GEMINI_FLASH_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
// used for the genrating the user id and making the schema for the user in the mongodb
router.post('/signup', async (req, res) => {
  try {
    const body = req.body;
    if (!body.username) {
      return res.json({ message: "username is missing" })
    }
    if (!body.password) {
      return res.json({ message: "password is missing" })
    }

    const data = new User({ username: body.username, password: body.password });
    await data.save();
    const token = jwt.sign({ username: body.username }, password);
    return res.json({ message: "signup done", data: token });
  } catch (error) {
    console.log("server error", error);
    return res.status(500).json({ message: "server error", error: error.message });
  }
})
router.post('/login', async (req, res) => {
  try {
    const body = req.body;
    if (!body.username) {
      return res.json({ message: "username is missing" })
    }
    if (!body.password) {
      return res.json({ message: "password is missing" })
    }
    const result = await User.findOne({ username: body.username });
    if (!result) {
      return res.json({ message: "user not found" })
    }
    if (result.password != body.password) {
      return res.json({ message: "password is wrong" })
    }
    const token = jwt.sign({ username: result.username }, password);
    return res.json({ message: "login done", data: token });
  } catch (error) {
    console.log("server error", error);
    return res.status(500).json({ message: "server error", error: error.message });
  }
})
// for evalution of the essay
router.post('/ai/evaluation', async (req, res) => {
  try {
    const body = req.body;
    if (!body.token) {
      return res.json({ message: "token is missing" })
    }
    const essay = body.essay;
    const send_data = await axios.post(
      python_url_correect_essay,
      {
        essay,
        jwt_token: body.token,
        lanuage: body.ln
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    const userid = jwt.decode(body.token, password);
    return res.json({ data: send_data.data, user: userid })
  } catch (e) {
    console.error("error in the evalution", e?.response?.data || e.message);
    return res.status(500).json({ message: "error in evaluation", detail: e?.response?.data || e.message })
  }
})
// Get pronunciation breakdown for a specific word
router.post('/pronunciation/breakdown', async (req, res) => {
  try {
    const body = req.body;
    if (!body.word) {
      return res.json({ message: "word is missing" })
    }
    const response = await axios.get(`http://localhost:8000/breakdown?word=${body.word}`)
    return res.json({ message: "success", data: response.data })
  } catch (error) {
    console.log("error in pronunciation breakdown", error.message)
    return res.status(500).json({ message: "error in pronunciation", error: error.message })
  }
})

// Get random words of the day
router.get('/pronunciation/random', async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8000/random-words")
    return res.json({ message: "success", data: response.data });
  } catch (error) {
    console.log("error getting random words", error.message);
    return res.status(500).json({ message: "error getting random words", error: error.message })
  }
})

// Quick grammar check using Gemini API (for clipboard monitor)
router.post('/grammar/check', async (req, res) => {
  try {
    const body = req.body;
    if (!body.text) {
      return res.json({ message: "text is missing" })
    }

    const text = body.text;
    
    // Create prompt for Gemini
    const prompt = `You are a grammar and spelling checker. Analyze the following text and provide corrections in JSON format.

Text to check: "${text}"

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

    // Call Gemini API
    const geminiResponse = await axios.post(
      `${GEMINI_API_URL}?key=${getGeminiKey()}`,
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

    // Extract response
    const generatedText = geminiResponse.data.candidates[0].content.parts[0].text;
    
    // Parse JSON from response (Gemini might wrap it in markdown)
    let result;
    try {
      // Remove markdown code blocks if present
      const jsonMatch = generatedText.match(/```json\n([\s\S]*?)\n```/) || 
                       generatedText.match(/```\n([\s\S]*?)\n```/) ||
                       [null, generatedText];
      const jsonText = jsonMatch[1] || generatedText;
      result = JSON.parse(jsonText.trim());
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      result = {
        hasErrors: false,
        errorCount: 0,
        corrections: [],
        correctedText: text,
        rawResponse: generatedText
      };
    }

    return res.json({ 
      message: "success", 
      data: result 
    });

  } catch (error) {
    console.error("error in grammar check", error.response?.data || error.message);
    return res.status(500).json({ 
      message: "error in grammar check", 
      error: error.response?.data || error.message 
    })
  }
})

// Test route to check if routes are loaded
router.get('/test-routes', (req, res) => {
  return res.json({
    message: "Routes are working!",
    availableRoutes: [
      "POST /signup",
      "POST /login",
      "POST /ai/evaluation",
      "POST /pronunciation/breakdown",
      "GET /pronunciation/random",
      "POST /grammar/check",
      "POST /quiz/generate",
      "POST /quiz/submit",
      "GET /test-routes"
    ]
  });
})

// Generate quiz questions using Gemini 2.0 Flash
router.post('/quiz/generate', async (req, res) => {
  try {
    const body = req.body;
    const level = body.level || 1; // 1, 2, or 3
    const topic = body.topic || 'general knowledge';

    const difficultyMap = {
      1: 'basic',
      2: 'intermediate',
      3: 'advanced'
    };

    const difficulty = difficultyMap[level] || 'basic';

    const prompt = `Generate 5 multiple choice questions for ${difficulty} level on the topic: ${topic}.

Requirements:
- Questions should be educational and test understanding
- Each question should have 4 options (A, B, C, D)
- Only one correct answer per question
- Include brief explanation for correct answer
- Difficulty: ${difficulty}

Provide response in this exact JSON format:
{
  "level": ${level},
  "difficulty": "${difficulty}",
  "topic": "${topic}",
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

    const apiKey = getGeminiKey();
    console.log('Using API Key:', apiKey ? apiKey.substring(0, 20) + '...' : 'NOT SET');
    console.log('API URL:', GEMINI_FLASH_URL);

    const geminiResponse = await axios.post(
      `${GEMINI_FLASH_URL}?key=${apiKey}`,
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

    const generatedText = geminiResponse.data.candidates[0].content.parts[0].text;

    let result;
    try {
      const jsonMatch = generatedText.match(/```json\n([\s\S]*?)\n```/) ||
        generatedText.match(/```\n([\s\S]*?)\n```/) ||
        [null, generatedText];
      const jsonText = jsonMatch[1] || generatedText;
      result = JSON.parse(jsonText.trim());
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      return res.status(500).json({
        message: "error parsing quiz",
        error: "Failed to generate quiz questions"
      });
    }

    return res.json({
      message: "success",
      data: result
    });

  } catch (error) {
    console.error("error generating quiz", error.response?.data || error.message);
    return res.status(500).json({
      message: "error generating quiz",
      error: error.response?.data || error.message
    })
  }
})

// Submit quiz and get detailed report
router.post('/quiz/submit', async (req, res) => {
  try {
    const body = req.body;
    const { level, answers, questions } = body;

    if (!answers || !questions) {
      return res.json({ message: "answers and questions are required" })
    }

    // Calculate score
    let correctCount = 0;
    const results = questions.map((q, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        question: q.question,
        userAnswer: userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect: isCorrect,
        explanation: q.explanation
      };
    });

    const totalQuestions = questions.length;
    const score = (correctCount / totalQuestions) * 100;
    const passed = correctCount >= 3; // Need 3 out of 5 to pass

    const report = {
      level: level,
      totalQuestions: totalQuestions,
      correctAnswers: correctCount,
      incorrectAnswers: totalQuestions - correctCount,
      score: Math.round(score),
      passed: passed,
      results: results,
      nextLevel: passed ? level + 1 : level,
      message: passed
        ? `Congratulations! You passed Level ${level}!`
        : `You need ${3 - correctCount} more correct answer${3 - correctCount > 1 ? 's' : ''} to pass.`
    };

    return res.json({
      message: "success",
      data: report
    });

  } catch (error) {
    console.error("error submitting quiz", error.message);
    return res.status(500).json({
      message: "error submitting quiz",
      error: error.message
    })
  }
})

module.exports = router;