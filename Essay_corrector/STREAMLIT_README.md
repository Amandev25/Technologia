# 📝 Essay Corrector Streamlit App

A beautiful, user-friendly web interface for the Essay Corrector API built with Streamlit.

## 🌟 Features

### 🎨 Beautiful Interface
- **Modern Design**: Clean, responsive layout with custom CSS styling
- **Real-time Feedback**: Live statistics and progress indicators
- **Color-coded Results**: Success, error, and info boxes for better UX

### 🔧 Configuration Panel
- **API URL Settings**: Configure the backend API endpoint
- **JWT Token Management**: Secure token input with password masking
- **Health Check**: Verify API server status
- **Sample Essays**: Quick-load example essays for testing

### 📊 Comprehensive Results
- **Corrected Essay Display**: Side-by-side comparison view
- **Detailed Analysis Report**: Grammar and spelling error breakdown
- **Token Usage Metrics**: Track API consumption
- **Copy Functionality**: Easy copying of corrected text

### 🛡️ Error Handling
- **Input Validation**: Character limits and format checking
- **API Error Handling**: Graceful handling of server errors
- **Timeout Management**: Proper handling of long requests
- **Connection Issues**: Clear error messages for network problems

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the API Server
```bash
python start_server.py
```

### 3. Start the Streamlit App
```bash
python start_streamlit.py
```

The app will open automatically in your browser at `http://localhost:8501`

## 📱 How to Use

### Step 1: Configure Settings
1. Open the sidebar (⚙️ Configuration)
2. Set the API URL (default: `http://localhost:8000`)
3. Enter your JWT token
4. Click "Check API Health" to verify connection

### Step 2: Enter Your Essay
1. Type or paste your essay in the text area
2. View real-time statistics (word count, character count)
3. Ensure your essay is 10-10,000 characters

### Step 3: Get Corrections
1. Click "🔍 Correct Essay" button
2. Wait for AI analysis (progress spinner shown)
3. Review results in the right panel

### Step 4: Review Results
- **Corrected Essay**: View the AI-corrected version
- **Analysis Report**: Read detailed error analysis
- **Token Usage**: See API consumption metrics
- **Copy Results**: Use the copy button for corrected text

## 🎯 Sample Essays

The app includes sample essays with intentional errors:
- Spelling mistakes (reely → really, importent → important)
- Grammar errors (shud → should, tri → try)
- Punctuation issues
- Word choice problems

## 🔧 Configuration Options

### API Settings
- **URL**: Backend API endpoint
- **JWT Token**: Authentication token
- **Timeout**: Request timeout (30 seconds default)

### UI Settings
- **Theme**: Light/dark mode (Streamlit default)
- **Layout**: Wide layout for better readability
- **Sidebar**: Collapsible configuration panel

## 🛠️ Troubleshooting

### Common Issues

#### ❌ "Cannot connect to API server"
- **Solution**: Start the API server first with `python start_server.py`
- **Check**: Verify the API URL in the sidebar

#### ❌ "Empty response from Gemini API"
- **Solution**: Check your `GOOGLE_API_KEY` environment variable
- **Check**: Ensure the API key has proper permissions

#### ❌ "Request timeout"
- **Solution**: Try with a shorter essay
- **Check**: Verify your internet connection

#### ❌ "Invalid JWT token format"
- **Solution**: Use a properly formatted JWT token
- **Check**: Ensure the token has 3 parts separated by dots

### Debug Mode
Enable debug logging by setting the log level in the API server:
```bash
export LOG_LEVEL=DEBUG
python start_server.py
```

## 📊 Performance Metrics

The app tracks and displays:
- **Prompt Tokens**: Input text token count
- **Completion Tokens**: AI response token count
- **Processing Time**: Request duration
- **Success Rate**: API call success percentage

## 🎨 Customization

### Styling
The app uses custom CSS for enhanced appearance:
- Gradient headers
- Color-coded result boxes
- Responsive design
- Professional typography

### Configuration
Modify `streamlit_app.py` to customize:
- Default API URL
- Sample essays
- UI colors and styling
- Validation rules

## 🔒 Security Features

- **JWT Token Masking**: Passwords are hidden in the UI
- **Input Validation**: Prevents malicious input
- **Error Sanitization**: Safe error message display
- **Timeout Protection**: Prevents hanging requests

## 📈 Future Enhancements

Planned features:
- **Batch Processing**: Multiple essays at once
- **Export Options**: PDF, Word document export
- **History Tracking**: Save previous corrections
- **User Accounts**: Personal essay libraries
- **Advanced Analytics**: Detailed writing metrics

## 🤝 Contributing

To contribute to the Streamlit app:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of a hackathon submission.

---

**Made with ❤️ using Streamlit and FastAPI**
