# Conversational Bot - Web UI

A modern HTML/CSS/JavaScript web interface for the Conversational Bot with speech input and output capabilities.

## Features

### 🎤 **Speech Input & Output**
- **Voice Input:** Click and hold to speak (uses browser's Web Speech API)
- **Text-to-Speech:** Automatic playback of bot responses
- **Real-time Transcription:** See your speech converted to text instantly

### 🎨 **Modern UI/UX**
- Beautiful gradient design with smooth animations
- Responsive layout (works on desktop, tablet, mobile)
- Intuitive chat interface
- Color-coded performance indicators

### 📊 **Three Conversation Scenarios**
1. **Returning a Defective Item (Polite)**
2. **Coffee Shop Conversation (Casual)**
3. **Manager-Developer Meeting (Formal)**

### 📈 **Real-time Analysis**
- Grammar scoring with pinpointed errors
- Pronunciation feedback with phonetic guides
- Professional language assessment
- Fluency analysis
- **NEW:** AI-powered detailed error analysis
- **NEW:** LLM-generated insights and explanations
- Downloadable reports (JSON, TXT, PDF)

## Setup & Installation

### 1. Install Python Dependencies

```bash
# Navigate to the conversational_bot directory
cd converstational_bot

# Install requirements
pip install flask flask-cors
```

### 2. Start the Backend Server

```bash
# From the web_ui directory
cd web_ui
python backend_api.py
```

The backend will start at `http://localhost:5000`

### 3. Open the Frontend

Simply open `index.html` in your web browser:

**Option 1:** Double-click `index.html`

**Option 2:** Use a local server (recommended):
```bash
# Using Python's built-in server
python -m http.server 8000

# Then open: http://localhost:8000
```

**Option 3:** Use VS Code Live Server extension

## Architecture

```
Frontend (HTML/CSS/JS)
    ↓
    ↓ HTTP Requests
    ↓
Backend (Flask API)
    ↓
    ↓ Python Integration
    ↓
Conversational Bot
    ↓
    ↓ LLM Integration
    ↓
Google Gemini 2.0 Flash
```

## How It Works

### 1. Speech Input Flow
```
User speaks → Browser Speech Recognition → Text
    ↓
Text sent to Backend API
    ↓
LLM generates response
    ↓
Response sent to Frontend
    ↓
Text-to-Speech plays response
```

### 2. API Endpoints

#### Start Conversation
```http
POST /api/start_conversation
Content-Type: application/json

{
  "scenario": "coffee_shop"
}
```

#### Generate Response
```http
POST /api/generate_response
Content-Type: application/json

{
  "scenario": "coffee_shop",
  "user_message": "I'd like a latte please",
  "conversation_history": [...]
}
```

#### Generate Report
```http
POST /api/generate_report
Content-Type: application/json

{
  "scenario": "coffee_shop",
  "conversation_history": [...]
}
```

## Browser Compatibility

### Speech Recognition (Voice Input)
✅ Chrome/Edge (Recommended)
✅ Safari (macOS/iOS)
❌ Firefox (not supported)

### Speech Synthesis (Voice Output)
✅ All modern browsers

**Note:** For best experience, use Chrome or Edge for full speech functionality.

## Usage Guide

### Starting a Conversation

1. **Select a Scenario**
   - Click on one of the three scenario cards
   - Read the tips and focus areas
   - Click "Start Practice"

2. **Have a Conversation**
   - **Voice Input:** Click and hold "Hold to Speak" button
   - **Text Input:** Type in the text field and press Enter
   - Listen to the bot's response (or read the transcript)
   - Continue for 3-6 exchanges

3. **View Your Report**
   - Conversation ends automatically after 6 turns
   - Or say "goodbye" / "thank you" to end early
   - View detailed analysis and scores
   - Download reports for future reference

### Features & Controls

#### Voice Input
- Click "Hold to Speak" button
- Speak clearly into your microphone
- Release when done speaking
- Text appears automatically in the input field

#### Text Input
- Type your message in the text field
- Press Enter or click send button
- Message is sent to the bot

#### Audio Controls
- ✅ **Auto-play bot responses:** Automatically speak bot messages
- ✅ **Show transcripts:** Display text of all messages

#### Message Actions
- 🔊 **Play audio:** Replay any bot message
- 📋 **Copy text:** Copy message to clipboard

## Customization

### Changing API URL

Edit `app.js` line 10:
```javascript
const API_URL = 'http://localhost:5000/api';  // Your backend URL
```

### Styling

Edit `styles.css` to customize:
- Colors (change CSS variables in `:root`)
- Fonts (update `font-family`)
- Layout (modify grid/flex properties)

### Adding Scenarios

1. Add scenario in `index.html`
2. Update `scenarioNames` in `app.js`
3. Add default greeting in `getDefaultGreeting()`
4. Configure in backend `conversation_manager.py`

## Troubleshooting

### Issue: "Speech recognition not supported"
**Solution:** Use Chrome, Edge, or Safari browser

### Issue: "Microphone not working"
**Solution:** 
- Check browser permissions
- Allow microphone access when prompted
- Check system microphone settings

### Issue: "Backend not responding"
**Solution:**
- Ensure Flask server is running (`python backend_api.py`)
- Check console for CORS errors
- Verify API_URL in `app.js` matches backend URL

### Issue: "No voice output"
**Solution:**
- Check system volume
- Ensure "Auto-play bot responses" is checked
- Click speaker icon on individual messages

### Issue: "CORS errors"
**Solution:**
- Ensure `flask-cors` is installed
- Backend should show "CORS enabled"
- Open frontend through a server (not file://)

## Performance Tips

1. **Use Chrome/Edge** for best speech recognition
2. **Speak clearly** and at moderate pace
3. **Use headphones** to avoid echo feedback
4. **Check network** for backend connectivity
5. **Clear browser cache** if experiencing issues

## File Structure

```
web_ui/
├── index.html              # Main HTML file
├── styles.css              # All styling (including enhanced error cards)
├── app.js                  # Frontend JavaScript (with LLM report display)
├── backend_api.py          # Flask backend server (LLM-enhanced)
├── README.md               # This file
├── ENHANCED_REPORTS.md     # Documentation for LLM-enhanced reports
├── QUICK_START.md          # Quick start guide
├── start_server.bat        # Windows startup script
└── start_server.sh         # Linux/Mac startup script
```

## Dependencies

### Frontend
- Web Speech API (built into browser)
- Font Awesome (icons)
- Google Fonts (Inter font)

### Backend
- Flask
- Flask-CORS
- All conversational bot dependencies

## Advanced Features

### LLM-Enhanced Detailed Reports

The web UI now includes **AI-powered error analysis** that provides:

1. **Pinpointed Grammar Errors**
   - Exact error location in your messages
   - Error type classification (subject-verb agreement, tense, etc.)
   - Original vs. corrected text comparison
   - Detailed explanations for each error

2. **Spelling Corrections**
   - Misspelled words highlighted
   - Correct spelling provided
   - Context showing where the error occurred

3. **Pronunciation Guidance**
   - Words that may be mispronounced
   - Phonetic pronunciation guides
   - Tips for correct pronunciation

4. **AI-Generated Insights**
   - Communication style observations
   - Strengths in your conversation
   - Specific areas for improvement

See [ENHANCED_REPORTS.md](ENHANCED_REPORTS.md) for detailed documentation.

### Download Reports

1. **JSON Format**
   - Complete conversation data
   - Machine-readable
   - For further processing

2. **TXT Format**
   - Human-readable summary
   - Conversation transcript
   - Quick reference

3. **PDF Format**
   - Coming soon!
   - Printable report
   - Professional formatting

### Keyboard Shortcuts

- `Enter` - Send text message
- `Esc` - Stop voice recording (future)
- `Ctrl+/` - Focus text input (future)

## Security Notes

- Never commit API keys to version control
- Use environment variables for production
- Implement proper authentication for public deployment
- Sanitize user inputs

## Future Enhancements

- [ ] PDF export functionality
- [ ] Multi-language support
- [ ] Voice selection (different accents)
- [ ] Progress tracking across sessions
- [ ] User authentication
- [ ] Mobile app version
- [ ] Offline mode

## Support

For issues or questions:
1. Check browser console for errors
2. Verify backend is running
3. Check microphone permissions
4. Review this README

## License

Part of the Conversational Bot project.
