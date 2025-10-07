# Conversational Bot - Streamlit Web Interface

## Overview
The Streamlit web interface provides a user-friendly way to interact with the Conversational Bot. It offers a modern, responsive design with real-time conversation analysis and detailed reporting.

## Features

### 🎯 **Scenario Selection**
- **Three Conversation Scenarios:**
  - Returning a Defective Item (Polite)
  - Coffee Shop Conversation (Casual)
  - Manager and Developer Meeting (Formal)
- **Detailed scenario information** with context and improvement suggestions
- **Visual scenario cards** with key phrases and focus areas

### 💬 **Conversation Interface**
- **Real-time conversation flow** with chat-like interface
- **Text input** for immediate responses
- **Audio input placeholder** (ready for future implementation)
- **Conversation history** with timestamps
- **Visual message bubbles** (user vs. bot messages)

### 📊 **Real-time Analysis**
- **Live conversation tracking** with automatic analysis
- **Instant feedback** on grammar, pronunciation, and professional language
- **Score visualization** with color-coded performance indicators
- **Detailed error reporting** with specific suggestions

### 📋 **Comprehensive Reports**
- **Overall performance score** (0-100 scale)
- **Detailed breakdown** by category:
  - Grammar Analysis
  - Pronunciation Analysis
  - Professional Language Assessment
  - Fluency Analysis
- **Improvement recommendations** tailored to each scenario
- **Downloadable reports** in multiple formats (JSON, TXT)

### 🎨 **Modern UI/UX**
- **Responsive design** that works on desktop and mobile
- **Color-coded scoring** (green/orange/red based on performance)
- **Interactive elements** with hover effects and animations
- **Sidebar navigation** with quick actions and help
- **Professional styling** with custom CSS

## Installation & Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the Web Interface
```bash
# Option 1: Using the launcher script
python run_ui.py

# Option 2: Direct Streamlit command
streamlit run streamlit_app.py
```

### 3. Access the Interface
- The app will automatically open in your default web browser
- If not, navigate to: `http://localhost:8501`
- The interface is fully responsive and works on mobile devices

## Usage Guide

### Starting a Conversation
1. **Select a Scenario:** Choose from the three available conversation scenarios
2. **Review Details:** Read the context, key phrases, and improvement suggestions
3. **Start Conversation:** Click "Start Conversation" to begin
4. **Respond:** Type your responses in the text input field
5. **Analyze:** Generate reports to see your performance

### Understanding the Analysis

#### Overall Score (0-100)
- **80-100:** Excellent communication
- **60-79:** Good with room for improvement
- **0-59:** Needs significant improvement

#### Grammar Analysis
- **Error Detection:** Subject-verb agreement, punctuation, capitalization
- **Error Rate:** Number of errors per message
- **Specific Suggestions:** Detailed corrections for each error

#### Pronunciation Analysis
- **Mispronunciation Detection:** Common errors like "aks" → "ask"
- **Difficult Sounds:** Identification of challenging phonemes
- **STT Error Analysis:** Speech recognition error detection

#### Professional Language Assessment
- **Casual Language Detection:** "yeah" → "yes", "gimme" → "give me"
- **Politeness Enhancement:** "I want" → "I would like"
- **Scenario-Specific Suggestions:** Tailored to conversation context

#### Fluency Analysis
- **Communication Metrics:** Words per message, sentence variety
- **Flow Assessment:** Conversation coherence and effectiveness
- **Overall Scoring:** Comprehensive communication quality rating

### Downloading Reports
- **Detailed Report (JSON):** Machine-readable data for further analysis
- **Summary Report (TXT):** Human-readable improvement suggestions
- **Conversation History (JSON):** Complete conversation transcript

## Interface Components

### Main Header
- **Title:** Conversational Bot with icon
- **Description:** Brief explanation of the tool's purpose

### Scenario Selection Page
- **Scenario Cards:** Visual representation of each conversation type
- **Context Information:** Detailed scenario descriptions
- **Key Phrases:** Important vocabulary for each scenario
- **Improvement Suggestions:** Specific areas to focus on

### Conversation Interface
- **Chat History:** Scrollable conversation with timestamps
- **Input Methods:** Text input and audio input (placeholder)
- **Action Buttons:** Send message, start listening, generate report
- **End Conversation:** Clean way to finish the session

### Analysis Dashboard
- **Score Cards:** Color-coded performance indicators
- **Detailed Breakdown:** Category-specific analysis
- **Recommendations:** Actionable improvement suggestions
- **Download Options:** Multiple report formats

### Sidebar Navigation
- **Status Indicator:** Current conversation state
- **Quick Actions:** Home, view reports, help
- **Help Section:** Usage instructions and feature overview

## Technical Features

### Responsive Design
- **Mobile-friendly:** Works on phones and tablets
- **Desktop optimized:** Full feature set on larger screens
- **Cross-browser compatibility:** Works in Chrome, Firefox, Safari, Edge

### Real-time Updates
- **Live conversation tracking:** Immediate message processing
- **Dynamic scoring:** Real-time performance calculation
- **Instant feedback:** Immediate analysis and suggestions

### Data Management
- **Session state:** Maintains conversation across page interactions
- **Error handling:** Graceful handling of API errors and edge cases
- **Data persistence:** Conversation history maintained during session

### Performance Optimization
- **Efficient rendering:** Optimized for smooth user experience
- **Lazy loading:** Components loaded as needed
- **Caching:** Reduced API calls and improved response times

## Customization Options

### Styling
- **Custom CSS:** Easy to modify colors, fonts, and layout
- **Theme support:** Compatible with Streamlit themes
- **Responsive breakpoints:** Adjustable for different screen sizes

### Functionality
- **Modular design:** Easy to add new scenarios or analysis types
- **Extensible architecture:** Simple to add new features
- **API integration:** Ready for additional services

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

4. **Audio input not working:**
   - Currently using text input only
   - Audio features are placeholder for future implementation

### Performance Tips
- **Close unused browser tabs** to free up memory
- **Use Chrome or Firefox** for best performance
- **Ensure stable internet connection** for API calls

## Future Enhancements

### Planned Features
- **Real-time audio input:** Microphone integration for speech input
- **Voice selection:** Multiple TTS voice options
- **Progress tracking:** Long-term improvement monitoring
- **User accounts:** Personalized learning paths
- **Advanced analytics:** Machine learning-based insights

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
