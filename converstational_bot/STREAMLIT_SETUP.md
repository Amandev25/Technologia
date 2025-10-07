# Streamlit UI Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Launch the Web Interface
```bash
# Option 1: Using the launcher script (recommended)
python run_ui.py

# Option 2: Direct Streamlit command
streamlit run streamlit_app.py
```

### 3. Access the Interface
- The app will automatically open in your default web browser
- If not, navigate to: `http://localhost:8501`
- The interface is fully responsive and works on mobile devices

## Features Overview

### 🎯 **Scenario Selection**
- Visual scenario cards with detailed information
- Context, key phrases, and improvement suggestions
- Easy selection with one-click start

### 💬 **Conversation Interface**
- Chat-like interface with message bubbles
- Real-time conversation flow
- Text input for immediate responses
- Conversation history with timestamps

### 📊 **Real-time Analysis**
- Live performance scoring (0-100 scale)
- Color-coded indicators (green/orange/red)
- Instant feedback on grammar, pronunciation, and professional language
- Detailed error reporting with specific suggestions

### 📋 **Comprehensive Reports**
- Overall performance score
- Detailed breakdown by category:
  - Grammar Analysis
  - Pronunciation Analysis
  - Professional Language Assessment
  - Fluency Analysis
- Improvement recommendations tailored to each scenario
- Downloadable reports in multiple formats (JSON, TXT)

### 🎨 **Modern UI/UX**
- Responsive design for desktop and mobile
- Professional styling with custom CSS
- Sidebar navigation with quick actions
- Interactive elements with hover effects

## Usage Workflow

1. **Select Scenario:** Choose from three conversation scenarios
2. **Start Conversation:** Click "Start Conversation" to begin
3. **Respond:** Type your responses in the text input field
4. **Analyze:** Generate reports to see your performance
5. **Download:** Save reports for future reference

## Technical Details

### Architecture
- **Frontend:** Streamlit with custom CSS styling
- **Backend:** Python modules (conversation_manager, audio_processor, report_generator)
- **State Management:** Streamlit session state
- **Data Flow:** Real-time conversation processing and analysis

### Performance
- **Responsive Design:** Works on all screen sizes
- **Real-time Updates:** Immediate analysis and feedback
- **Efficient Rendering:** Optimized for smooth user experience
- **Error Handling:** Graceful handling of edge cases

### Customization
- **Easy Styling:** Modify CSS for different themes
- **Extensible:** Simple to add new scenarios or analysis types
- **Modular:** Clean separation of concerns

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   streamlit run streamlit_app.py --server.port 8502
   ```

2. **Module not found errors:**
   ```bash
   pip install -r requirements.txt
   ```

3. **API key issues:**
   - Check that AssemblyAI and Murf AI keys are correctly set
   - Verify internet connection for API calls

### Performance Tips
- Use Chrome or Firefox for best performance
- Ensure stable internet connection for API calls
- Close unused browser tabs to free up memory

## Future Enhancements

### Planned Features
- **Real-time audio input:** Microphone integration
- **Voice selection:** Multiple TTS voice options
- **Progress tracking:** Long-term improvement monitoring
- **User accounts:** Personalized learning paths

### Integration Possibilities
- **Database storage:** Persistent conversation history
- **User authentication:** Secure user accounts
- **Social features:** Sharing and comparing progress
- **Mobile app:** Native mobile application

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the console output for error messages
3. Ensure all dependencies are properly installed
4. Verify API keys are correctly configured

The Streamlit interface provides a modern, user-friendly way to interact with the Conversational Bot, making it accessible to users of all technical levels while maintaining the powerful analysis capabilities of the underlying system.
