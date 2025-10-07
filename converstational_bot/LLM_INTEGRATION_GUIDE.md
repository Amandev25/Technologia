# LLM Integration Guide - Gemini 2.0 Flash

## Overview

The conversational bot now uses Google's Gemini 2.0 Flash LLM to generate dynamic, contextual responses instead of pre-programmed responses. This provides a more natural and flexible conversation experience.

## Flow Diagram

```
1. LLM generates greeting text
   ↓
2. TTS converts greeting to speech → User listens
   ↓
3. User replies with voice
   ↓
4. STT converts voice to text
   ↓
5. Text sent to LLM with conversation history
   ↓
6. LLM generates contextual response
   ↓
7. Repeat steps 2-6 for 3-6 exchanges
   ↓
8. Conversation ends → Generate comprehensive report
```

## Setup

### 1. Create .env File

Create a `.env` file in the `converstational_bot/` directory:

```env
# Google Gemini API Key
GEMINI_API_KEY=your_actual_gemini_api_key_here

# AssemblyAI API Key (for Speech-to-Text)
ASSEMBLYAI_API_KEY=0a5659ce096b4d2b9f488f9f4ecff57b

# Murf AI API Key (for Text-to-Speech)
MURF_API_KEY=ap2_d09dfb5d-d2b5-45c0-9dcc-b95b8e27e16c
```

### 2. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key
5. Paste it in the `.env` file

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- `google-generativeai` - Gemini AI SDK
- `python-dotenv` - Environment variable management
- All other required packages

## Architecture

### Key Components

#### 1. LLM Manager (`llm_manager.py`)
- Handles all Gemini API interactions
- Manages conversation history
- Generates contextual responses
- Maintains scenario-specific system prompts

#### 2. Conversation Manager (`conversation_manager.py`)
- Orchestrates the conversation flow
- Integrates LLM Manager for response generation
- Tracks errors and analytics
- Provides conversation reports

#### 3. Audio Processor (`audio_processor.py`)
- Converts speech to text (STT)
- Converts text to speech (TTS)
- Manages audio input/output

#### 4. Config (`config.py`)
- Loads API keys from .env
- Manages configuration settings
- Sets conversation parameters

## How It Works

### 1. Starting a Conversation

```python
manager = ConversationManager(api_key="your_key")
initial_greeting = manager.start_conversation("defective_item")
# LLM generates: "Hello! I understand you'd like to return an item..."
```

The LLM is given a scenario-specific system prompt that defines its role and behavior.

### 2. Generating Responses

```python
user_input = "I want to return this broken phone"
bot_response = manager.generate_response(user_input)
# LLM generates contextual response based on:
# - System prompt (scenario context)
# - Conversation history
# - Current user input
```

### 3. Conversation History

The LLM maintains context by tracking all messages:

```python
conversation_history = [
    {"role": "assistant", "content": "Hello! How can I help you?"},
    {"role": "user", "content": "I want to return this phone"},
    {"role": "assistant", "content": "I'm sorry to hear that..."},
]
```

### 4. Conversation Dictionary

All conversations are stored in a dictionary for reporting:

```python
{
    "scenario": "Returning a Defective Item (Polite)",
    "conversation_history": [
        {
            "timestamp": "2025-10-07T23:30:00",
            "speaker": "bot",
            "message": "Hello! How can I help you?"
        },
        {
            "timestamp": "2025-10-07T23:30:15",
            "speaker": "user",
            "message": "I want to return this phone"
        }
    ],
    "total_exchanges": 3
}
```

## Scenario-Specific System Prompts

### Defective Item Return (Polite)
```
Role: Professional customer service representative
Focus: Empathy, politeness, solution-oriented
Language: Professional with phrases like "I understand", "I apologize"
Flow: Greet → Ask details → Offer solutions → Provide next steps
```

### Coffee Shop (Casual)
```
Role: Friendly barista
Focus: Warm, welcoming, helpful
Language: Casual but professional
Flow: Greet → Recommend → Confirm order → Provide total → Thank
```

### Manager-Developer Meeting (Formal)
```
Role: Professional project manager
Focus: Formal, actionable, professional
Language: Formal business language
Flow: Greet → Ask status → Discuss challenges → Offer support → Summarize
```

## Conversation Control

### Turn Limits
- **Minimum turns:** 3 exchanges (configurable in `config.py`)
- **Maximum turns:** 6 exchanges (configurable in `config.py`)

### Ending Conditions
1. **Maximum turns reached:** Automatically ends after 6 exchanges
2. **End phrases detected:** "goodbye", "bye", "thank you", etc.
3. **Manual termination:** User clicks "End Conversation"

## Features

### 1. Dynamic Response Generation
- **Context-aware:** Responses based on full conversation history
- **Natural language:** Sounds human and conversational
- **Scenario-appropriate:** Matches the tone and style of each scenario

### 2. Conversation Tracking
- **Complete history:** All messages stored with timestamps
- **Role identification:** Clear distinction between user and bot
- **Turn counting:** Automatic tracking of exchanges

### 3. Error Handling
- **API failures:** Graceful fallback messages
- **Invalid inputs:** Clear error messages
- **Network issues:** Retry logic and user notifications

### 4. Reporting Integration
- **Conversation export:** Full conversation history in JSON
- **Analysis ready:** Format compatible with report generator
- **Metrics tracking:** Turn count, duration, speaker stats

## Usage Examples

### CLI Interface

```python
from conversational_bot import ConversationalBot

# Initialize with API key
bot = ConversationalBot(gemini_api_key="your_key")

# Run conversation
bot.run_conversation("defective_item")

# The bot will:
# 1. Generate greeting with LLM
# 2. Convert to speech (TTS)
# 3. Listen for user response (STT)
# 4. Send to LLM with context
# 5. Repeat for 3-6 turns
# 6. Generate comprehensive report
```

### Streamlit Web Interface

```bash
# Launch the web interface
python run_ui.py

# The interface will:
# 1. Allow scenario selection
# 2. Display LLM-generated greeting
# 3. Accept text/audio input
# 4. Show real-time responses
# 5. Provide downloadable reports
```

### Programmatic Usage

```python
from llm_manager import LLMManager

# Initialize LLM Manager
llm = LLMManager(api_key="your_key")

# Start conversation
greeting = llm.start_conversation("coffee_shop")
print(f"Bot: {greeting}")

# Get responses
while not llm.should_end_conversation():
    user_input = input("You: ")
    response = llm.generate_response(user_input)
    print(f"Bot: {response}")
    
    if llm.check_end_phrases(user_input):
        break

# Get conversation history
history = llm.get_conversation_dict()
```

## Customization

### Adding New Scenarios

Edit `llm_manager.py` and add to `scenario_prompts`:

```python
"new_scenario": {
    "name": "Your Scenario Name",
    "system_prompt": """
    Your detailed system prompt here...
    Define role, behavior, language style, etc.
    """,
    "initial_greeting": "Your initial greeting here"
}
```

### Adjusting Response Length

Modify the system prompts to control response length:
- Current: "Keep responses concise (2-3 sentences max)"
- Longer: "Provide detailed responses (3-5 sentences)"
- Shorter: "Keep responses very brief (1-2 sentences)"

### Changing Conversation Length

Edit `config.py`:

```python
MAX_CONVERSATION_TURNS = 10  # Increase for longer conversations
MIN_CONVERSATION_TURNS = 2   # Decrease for shorter practice
```

## Best Practices

### 1. API Key Security
- **Never commit** `.env` file to version control
- **Use environment variables** in production
- **Rotate keys** regularly

### 2. Error Handling
- **Check API responses** for errors
- **Implement retry logic** for transient failures
- **Provide user feedback** for issues

### 3. Conversation Quality
- **Test system prompts** thoroughly
- **Monitor response quality** and adjust prompts
- **Gather user feedback** for improvements

### 4. Performance
- **Cache common responses** if appropriate
- **Monitor API usage** and costs
- **Implement rate limiting** if needed

## Troubleshooting

### Issue: "Invalid API Key"
**Solution:** Check that GEMINI_API_KEY in `.env` is correct

### Issue: "Module 'google.generativeai' not found"
**Solution:** Run `pip install google-generativeai`

### Issue: Responses are too long/short
**Solution:** Adjust system prompts in `llm_manager.py`

### Issue: Conversation ends too quickly
**Solution:** Increase MAX_CONVERSATION_TURNS in `config.py`

### Issue: LLM not maintaining context
**Solution:** Check conversation_history is being properly maintained

## API Costs

Gemini 2.0 Flash pricing (as of 2025):
- **Free tier:** 60 requests per minute
- **Cost:** Very affordable for testing and development
- **Usage tracking:** Monitor in Google AI Studio

## Future Enhancements

1. **Multi-language support:** Conversations in different languages
2. **Voice selection:** Different TTS voices for different scenarios
3. **Sentiment analysis:** Real-time emotion detection
4. **Adaptive difficulty:** Adjust conversation complexity based on performance
5. **Long-term memory:** Track user progress across sessions

## Conclusion

The LLM integration transforms the conversational bot into a dynamic, intelligent system that can engage in natural, contextual conversations while maintaining the analytical capabilities for language learning and improvement.
