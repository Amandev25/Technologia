# Quick Start Guide - Web UI

## 🚀 Get Started in 3 Minutes!

### Step 1: Install Dependencies (1 minute)

```bash
# Navigate to conversational_bot directory
cd converstational_bot

# Install Python packages
pip install flask flask-cors

# Or install all requirements
pip install -r requirements.txt
```

### Step 2: Start the Backend (30 seconds)

```bash
# Navigate to web_ui directory
cd web_ui

# Start the Flask server
python backend_api.py
```

You should see:
```
🚀 Starting Conversational Bot Backend API...
📍 Backend URL: http://localhost:5000
✅ Running on http://127.0.0.1:5000
```

### Step 3: Open the Frontend (30 seconds)

**Option A: Direct File**
- Double-click `index.html` in the `web_ui` folder
- Or drag it to your browser

**Option B: Local Server (Recommended)**
```bash
# In a new terminal, from web_ui directory
python -m http.server 8000

# Then open: http://localhost:8000
```

## 🎤 Using Speech Input/Output

### Voice Input
1. Click the **"Hold to Speak"** button
2. Speak clearly into your microphone
3. Your speech will be converted to text automatically
4. Message is sent to the bot

### Voice Output
- Bot responses are automatically spoken (if enabled)
- Click the speaker icon 🔊 on any message to replay it
- Toggle "Auto-play bot responses" to control this feature

### Browser Requirements
- ✅ **Chrome** (Recommended) - Full speech support
- ✅ **Edge** - Full speech support  
- ✅ **Safari** - Full speech support
- ⚠️ **Firefox** - No speech recognition (use text input)

## 📝 Quick Tutorial

### 1. Select a Scenario
- **Defective Item:** Practice polite customer service
- **Coffee Shop:** Practice casual professional language
- **Manager Meeting:** Practice formal business communication

### 2. Start Conversation
- Click "Start Practice" on any scenario
- Bot greets you with an opening message
- Listen to the greeting (auto-played)

### 3. Respond
**Using Voice:**
- Click and hold "Hold to Speak"
- Say your response
- Release when done

**Using Text:**
- Type in the text field
- Press Enter or click Send

### 4. Continue Conversation
- Bot responds automatically
- Continue for 3-6 exchanges
- Say "goodbye" or "thank you" to end early

### 5. View Report
- See your performance scores
- Grammar, Pronunciation, Professional Language, Fluency
- Download reports (JSON/TXT/PDF)
- Start new conversation

## 🎯 Example Conversation

**Scenario: Coffee Shop**

```
🤖 Bot: "Good morning! Welcome to our coffee shop. 
        What can I get started for you today?"

👤 You: "I'd like a large latte please"

🤖 Bot: "Great choice! Would you like any flavor shots 
        or modifications?"

👤 You: "Just regular, thanks"

🤖 Bot: "Perfect! That'll be $5.50. Anything else?"

👤 You: "No, that's all. Thank you!"

🤖 Bot: "Thank you for visiting! Have a great day!"
```

## 🔧 Troubleshooting

### Microphone Not Working
1. Check browser permissions (click lock icon in address bar)
2. Allow microphone access
3. Try refreshing the page
4. Check system microphone settings

### Backend Not Responding
1. Ensure Flask server is running
2. Check console for errors
3. Verify port 5000 is not in use
4. Restart the backend server

### No Voice Output
1. Check system volume
2. Ensure "Auto-play" is enabled
3. Click speaker icon on messages
4. Try different browser

### CORS Errors
1. Don't open `index.html` directly (use `file://`)
2. Use a local server: `python -m http.server 8000`
3. Or use VS Code Live Server extension

## 📊 Understanding Your Scores

### Overall Score (0-100)
- **80-100:** Excellent! Great communication skills
- **60-79:** Good, with room for improvement
- **40-59:** Fair, focus on recommendations
- **0-39:** Needs practice, follow suggestions

### Individual Scores
- **Grammar:** Sentence structure, punctuation, verb agreement
- **Pronunciation:** Clear speech, correct word sounds
- **Professional Language:** Formal vs casual, politeness
- **Fluency:** Words per message, sentence variety

## 🎨 Customization

### Change Colors
Edit `styles.css`:
```css
:root {
    --primary-color: #667eea;    /* Change to your color */
    --secondary-color: #764ba2;  /* Change to your color */
}
```

### Add New Scenario
1. Add card in `index.html`
2. Update `scenarioNames` in `app.js`
3. Add greeting in `getDefaultGreeting()`
4. Configure in backend

## 💡 Tips for Best Results

1. **Use Chrome or Edge** for speech recognition
2. **Speak clearly** at moderate pace
3. **Use headphones** to avoid echo
4. **Good microphone** improves accuracy
5. **Quiet environment** reduces background noise
6. **Practice regularly** to improve scores

## 🚦 Status Indicators

- 🟢 **Green dot:** System ready
- 🔴 **Recording:** Voice input active
- ⏳ **Processing:** Generating response
- ✅ **Complete:** Conversation ended

## 📥 Download Reports

### JSON Report
- Complete conversation data
- All analysis details
- Machine-readable format
- For developers/analysis

### TXT Summary
- Human-readable
- Conversation transcript
- Key scores and recommendations
- Quick reference

### PDF Report (Coming Soon)
- Professional formatting
- Printable
- Charts and graphs
- Shareable

## 🔐 Privacy & Security

- All speech processing happens in your browser
- Conversation data sent to backend for analysis
- No data stored permanently (unless you save reports)
- API keys should be kept secure

## ⚡ Keyboard Shortcuts

- `Enter` - Send text message
- `Tab` - Navigate between fields
- (More shortcuts coming soon!)

## 📱 Mobile Support

The web UI is responsive and works on:
- 📱 Smartphones (iOS/Android)
- 📱 Tablets
- 💻 Laptops
- 🖥️ Desktops

**Note:** Speech recognition works best on mobile Chrome/Safari

## 🆘 Need Help?

1. Check this guide
2. Review browser console (F12)
3. Check backend terminal logs
4. Verify all dependencies installed
5. Read full README.md

## 🎉 You're Ready!

Open `index.html` or visit `http://localhost:8000` and start practicing!

**Quick Command:**
```bash
# Start everything
cd converstational_bot/web_ui
python backend_api.py

# In another terminal
python -m http.server 8000

# Open browser to: http://localhost:8000
```

Happy practicing! 🚀
