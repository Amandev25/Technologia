# Essay Corrector - Web UI

A beautiful, modern HTML/CSS/JS interface for the Essay Corrector API.

## Features

- ✨ **Modern Gradient Design** - Beautiful UI with smooth animations
- 📝 **Real-time Statistics** - Word and character count
- 🔍 **API Health Check** - Verify API connection status
- 📋 **Copy to Clipboard** - Easy copying of corrected essays
- 🎨 **Responsive Design** - Works on desktop, tablet, and mobile
- ⌨️ **Keyboard Shortcuts** - Fast workflow with shortcuts
- 💾 **Auto-save Settings** - Remembers your API URL and JWT token
- 🌙 **Dark Mode Support** - Automatic dark mode based on system preferences
- 📊 **Structured Reports** - Detailed analysis with scores and categories
- 🎯 **Category-based Analysis** - Spelling, grammar, structure, clarity, vocabulary
- 📈 **Visual Score Bars** - Easy-to-read progress indicators
- 💡 **Detailed Error Explanations** - Learn from your mistakes

## Quick Start

### 1. Start the Essay Corrector API

First, make sure the Essay Corrector API is running:

```bash
# In the Essay_corrector directory
python main.py
```

The API should be running at `http://localhost:8000`

### 2. Open the Web UI

**Option A: Direct File Access**
- Simply open `index.html` in your web browser
- Note: Some browsers may restrict API calls when opening files directly

**Option B: Using Python HTTP Server (Recommended)**

```bash
# On Windows
run_ui.bat

# On Linux/Mac
python -m http.server 3000
```

Then open your browser to: `http://localhost:3000`

### 3. Configure Settings

1. Click the **"⚙️ Configuration"** button at the bottom
2. Verify the **API URL** (default: `http://localhost:8000`)
3. Enter your **JWT Token** (a sample token is pre-filled)
4. Click **"🔍 Check API Health"** to verify connection

### 4. Correct an Essay

1. **Enter your essay** in the text area, or click **"📚 Load Sample"** for a demo
2. Click **"🔍 Correct Essay"**
3. Wait for the AI to analyze your essay
4. View results:
   - ✏️ **Corrected Essay** - Your essay with all errors fixed
   - 📊 **Overall Score** - Visual score with progress bar
   - 📋 **Detailed Analysis** - Category-by-category breakdown:
     - ✏️ **Spelling** - Misspelled words with corrections and explanations
     - 📝 **Grammar** - Grammatical errors with detailed explanations
     - 🏗️ **Structure** - Essay organization and flow
     - 💡 **Clarity** - How clear and understandable your writing is
     - 📚 **Vocabulary** - Word choice and variety
   - 📝 **Summary** - Strengths, areas for improvement, and overall feedback
   - 📈 **Token Usage Statistics** - API usage metrics
5. Click **"📋 Copy Corrected Essay"** to copy the result

## Keyboard Shortcuts

- `Ctrl/Cmd + Enter` - Correct essay
- `Ctrl/Cmd + L` - Load sample essay
- `Ctrl/Cmd + K` - Clear essay

## Configuration

### API URL
The default API URL is `http://localhost:8000`. If your API is running on a different port or host, update it in the Configuration panel.

### JWT Token
The UI comes with a sample JWT token pre-configured. For production use, replace it with your actual JWT token.

Settings are automatically saved to your browser's localStorage and will persist across sessions.

## File Structure

```
Essay_corrector/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── app.js             # JavaScript functionality
├── run_ui.bat         # Windows batch file to start server
└── UI_README.md       # This file
```

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Opera (latest)

## Features in Detail

### Real-time Statistics
- Automatically counts words and characters as you type
- Updates instantly to help you stay within limits (10-10,000 characters)

### API Health Check
- Verifies connection to the Essay Corrector API
- Shows visual status indicator (green for success, red for error)
- Helpful for debugging connection issues

### Error Handling
- Validates essay length before submission
- Shows friendly error messages
- Handles network errors gracefully
- Provides fallback behavior for API failures

### Responsive Design
- Adapts to different screen sizes
- Mobile-friendly interface
- Touch-optimized buttons and controls

### Dark Mode
- Automatically detects system dark mode preference
- Smooth color transitions
- Easy on the eyes in low-light conditions

## Troubleshooting

### "Cannot connect to the API server"
- Make sure the API is running (`python main.py`)
- Check that the API URL in settings matches your server address
- Verify no firewall is blocking the connection

### "CORS Error"
- The API should have CORS enabled by default
- If issues persist, try using the Python HTTP server method instead of opening the file directly

### Toast notifications not showing
- Make sure JavaScript is enabled in your browser
- Check browser console for errors (F12)

## Customization

### Changing Colors
Edit `styles.css` and modify the CSS variables in the `:root` selector:

```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --success-color: #10b981;
    --error-color: #ef4444;
    /* ... more colors */
}
```

### Adding Features
The JavaScript code is well-commented and organized. Main functions are in `app.js`:
- `correctEssay()` - Main correction logic
- `displayResults()` - Render results
- `showToast()` - Show notifications

## Security Notes

- JWT tokens are stored in localStorage (clear browser data to remove)
- Always use HTTPS in production
- Never expose your API key in client-side code
- The default JWT token is for demo purposes only

## Support

For API-related issues, see the main Essay Corrector README.
For UI bugs or feature requests, check the project documentation.

---

Made with ❤️ for better writing | Powered by Gemini 2.0 Flash

