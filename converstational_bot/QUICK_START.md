# Quick Start Guide - LLM-Powered Conversational Bot

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd converstational_bot
pip install -r requirements.txt
```

### Step 2: Set Up Gemini API Key

1. Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. Create a `.env` file in the `converstational_bot/` directory:

```env
GEMINI_API_KEY=paste_your_api_key_here
ASSEMBLYAI_API_KEY=your_assemblyai_key_here
MURF_API_KEY=your_murf_key_here
```

Or copy the example file:
```bash
copy env.example .env
# Then edit .env and add your keys
```

### Step 3: Test the Setup
```bash
python test_llm.py
```

You should see:
```
✓ LLM Manager initialized successfully
✓ LLM Basic Test: PASSED
✓ Conversation Manager Test: PASSED
✓ All Scenarios Test: PASSED
✓ Conversation Flow Test: PASSED
```

### Step 4: Run the Bot

#### Option A: Web Interface (Recommended)
```bash
python run_ui.py
```
- Opens in your browser at `http://localhost:8501`
- Beautiful UI with chat interface
- Real-time analysis and reports

#### Option B: Command Line
```bash
python conversational_bot.py
```
- Interactive CLI experience
- Full audio integration
- Complete analysis reports

## 💬 How It Works

### The Conversation Flow

```
1. Select a scenario:
   • Returning a Defective Item (Polite)
   • Coffee Shop Conversation (Casual)
   • Manager-Developer Meeting (Formal)

2. LLM generates greeting
   ↓
3. TTS speaks greeting → You listen
   ↓
4. You respond (voice or text)
   ↓
5. STT converts voice to text
   ↓
6. LLM generates response (with full context)
   ↓
7. Repeat for 3-6 exchanges
   ↓
8. Get comprehensive analysis report
```

### Example Conversation

**Scenario:** Coffee Shop (Casual)

```
🤖 Bot (LLM): "Good morning! Welcome to our coffee shop. 
              What can I get started for you today?"

👤 You: "I'd like a large latte please"

🤖 Bot (LLM): "Great choice! Our house blend lattes are 
              really popular. Would you like any flavor 
              shots or modifications?"

👤 You: "Just regular, please"

🤖 Bot (LLM): "Perfect! One large latte coming right up. 
              That'll be $5.50. Would you like anything 
              to eat with that?"

👤 You: "No thanks, that's all"

🤖 Bot (LLM): "Sounds good! Your total is $5.50. Thank 
              you for coming in today!"
```

## 📊 What You Get

### Real-time Analysis
- **Grammar Score:** 0-100 based on errors
- **Pronunciation Score:** Mispronunciation detection
- **Professional Language:** Casual vs. formal usage
- **Fluency Score:** Communication effectiveness

### Detailed Reports
- **JSON Format:** Machine-readable data
- **Text Summary:** Human-readable feedback
- **Improvement Suggestions:** Scenario-specific tips
- **Conversation History:** Complete transcript

## 🎯 Three Scenarios Explained

### 1. Defective Item Return (Polite)
**Goal:** Practice polite, persuasive language

**Focus Areas:**
- Using "I would like" instead of "I want"
- Showing empathy and understanding
- Being solution-oriented
- Professional request language

**Example Phrases:**
- "I would appreciate..."
- "I understand your concern..."
- "Could you please..."

### 2. Coffee Shop (Casual)
**Goal:** Practice casual but professional service language

**Focus Areas:**
- Friendly, welcoming tone
- Making recommendations
- Confirming orders clearly
- Casual professionalism

**Example Phrases:**
- "Great choice!"
- "I recommend..."
- "Would you like..."
- "Thank you for choosing us"

### 3. Manager-Developer Meeting (Formal)
**Goal:** Practice formal business communication

**Focus Areas:**
- Technical discussion
- Status updates
- Professional language
- Actionable items

**Example Phrases:**
- "I would like to discuss..."
- "Could you provide an update..."
- "What resources do you need..."
- "Let's schedule a follow-up"

## 🛠️ Troubleshooting

### "Invalid API Key" Error
**Solution:**
1. Check your `.env` file exists in `converstational_bot/`
2. Verify the API key is correct (no extra spaces)
3. Make sure the key is active in Google AI Studio

### "Module not found" Errors
**Solution:**
```bash
pip install google-generativeai python-dotenv streamlit
```

### Web Interface Won't Start
**Solution:**
```bash
# Try a different port
streamlit run streamlit_app.py --server.port 8502
```

### No Audio Input/Output
**Solution:**
- Check microphone permissions
- Install PyAudio: `pip install pyaudio`
- Use text input in Streamlit as alternative

## 📚 Additional Resources

- **LLM Integration Guide:** `LLM_INTEGRATION_GUIDE.md`
- **Streamlit UI Guide:** `STREAMLIT_README.md`
- **Full README:** `README.md`
- **Integration Summary:** `LLM_INTEGRATION_SUMMARY.md`

## 💡 Tips for Best Results

1. **Speak Clearly:** Better STT accuracy = better analysis
2. **Use Natural Language:** Don't worry about perfection
3. **Complete Conversations:** Get full 3-6 exchanges for best reports
4. **Review Reports:** Learn from the improvement suggestions
5. **Practice Regularly:** Progress tracked across scenarios

## 🎉 You're Ready!

Start your first conversation:

```bash
# Web Interface
python run_ui.py

# Command Line
python conversational_bot.py
```

**Remember:** The LLM generates unique responses each time, so every conversation is different and realistic!

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review error messages in console
3. Verify API keys are set correctly
4. Ensure all dependencies are installed
5. Check internet connection for API calls

Happy practicing! 🚀
