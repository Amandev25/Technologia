"""
Streamlit UI for the Conversational Bot
Provides a web-based interface for the conversational bot with real-time analysis.
"""

import streamlit as st
import json
import os
import time
from datetime import datetime
from pathlib import Path
import threading
import queue

# Import our bot components
from conversation_manager import ConversationManager
from audio_processor import AudioProcessor
from report_generator import ReportGenerator
import config

# Page configuration
st.set_page_config(
    page_title="Conversational Bot",
    page_icon="🎙️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 2rem;
    }
    .scenario-card {
        border: 2px solid #e0e0e0;
        border-radius: 10px;
        padding: 1rem;
        margin: 1rem 0;
        background-color: #f8f9fa;
    }
    .score-card {
        border: 2px solid #28a745;
        border-radius: 10px;
        padding: 1rem;
        margin: 0.5rem 0;
        background-color: #d4edda;
    }
    .error-card {
        border: 2px solid #dc3545;
        border-radius: 10px;
        padding: 1rem;
        margin: 0.5rem 0;
        background-color: #f8d7da;
    }
    .conversation-bubble {
        border-radius: 15px;
        padding: 1rem;
        margin: 0.5rem 0;
        max-width: 80%;
    }
    .user-bubble {
        background-color: #007bff;
        color: white;
        margin-left: auto;
    }
    .bot-bubble {
        background-color: #e9ecef;
        color: black;
        margin-right: auto;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'bot' not in st.session_state:
    st.session_state.bot = None
if 'conversation_active' not in st.session_state:
    st.session_state.conversation_active = False
if 'conversation_history' not in st.session_state:
    st.session_state.conversation_history = []
if 'current_scenario' not in st.session_state:
    st.session_state.current_scenario = None
if 'audio_processor' not in st.session_state:
    st.session_state.audio_processor = None
if 'report_generator' not in st.session_state:
    st.session_state.report_generator = None

def initialize_components():
    """Initialize bot components."""
    if st.session_state.bot is None:
        # Get Gemini API key from config or user input
        gemini_api_key = config.GEMINI_API_KEY
        
        st.session_state.bot = ConversationManager(api_key=gemini_api_key)
        st.session_state.audio_processor = AudioProcessor()
        st.session_state.report_generator = ReportGenerator()

def display_scenario_selection():
    """Display scenario selection interface."""
    st.markdown('<h1 class="main-header">🎙️ Conversational Bot</h1>', unsafe_allow_html=True)
    
    st.markdown("""
    Welcome to the Conversational Bot! This tool helps you practice conversations in different scenarios 
    while providing real-time feedback on your grammar, pronunciation, and professional language usage.
    """)
    
    # Initialize components
    initialize_components()
    
    # Display available scenarios
    st.markdown("### 📋 Choose a Conversation Scenario")
    
    scenarios = st.session_state.bot.scenario_contexts
    
    for i, (key, context) in enumerate(scenarios.items(), 1):
        with st.container():
            st.markdown(f"""
            <div class="scenario-card">
                <h3>{i}. {context['name']}</h3>
                <p><strong>Context:</strong> {context['context']}</p>
                <p><strong>Focus:</strong> {', '.join(context['suggestions'][:2])}</p>
            </div>
            """, unsafe_allow_html=True)
    
    # Scenario selection
    scenario_options = {f"{i}. {context['name']}": key for i, (key, context) in enumerate(scenarios.items(), 1)}
    selected_scenario = st.selectbox(
        "Select a scenario to practice:",
        options=list(scenario_options.keys()),
        key="scenario_select"
    )
    
    if selected_scenario:
        scenario_key = scenario_options[selected_scenario]
        st.session_state.current_scenario = scenario_key
        
        # Display scenario details
        scenario_info = scenarios[scenario_key]
        st.markdown(f"""
        ### 📝 Scenario Details
        **Name:** {scenario_info['name']}
        
        **Context:** {scenario_info['context']}
        
        **Key Phrases to Use:** {', '.join(scenario_info['key_phrases'])}
        
        **Improvement Suggestions:**
        """)
        
        for suggestion in scenario_info['suggestions']:
            st.markdown(f"• {suggestion}")
        
        # Start conversation button
        if st.button("🚀 Start Conversation", type="primary", use_container_width=True):
            start_conversation(scenario_key)

def start_conversation(scenario_key):
    """Start a new conversation."""
    st.session_state.conversation_active = True
    st.session_state.conversation_history = []
    
    # Start the conversation
    initial_message = st.session_state.bot.start_conversation(scenario_key)
    
    # Add to conversation history
    st.session_state.conversation_history.append({
        "speaker": "bot",
        "message": initial_message,
        "timestamp": datetime.now().strftime("%H:%M:%S")
    })
    
    st.rerun()

def display_conversation_interface():
    """Display the conversation interface."""
    st.markdown('<h1 class="main-header">💬 Active Conversation</h1>', unsafe_allow_html=True)
    
    # Display current scenario
    scenario_info = st.session_state.bot.scenario_contexts[st.session_state.current_scenario]
    st.markdown(f"**Scenario:** {scenario_info['name']}")
    
    # Conversation history
    st.markdown("### 📜 Conversation History")
    
    if st.session_state.conversation_history:
        for msg in st.session_state.conversation_history:
            if msg["speaker"] == "user":
                st.markdown(f"""
                <div class="conversation-bubble user-bubble">
                    <strong>You ({msg['timestamp']}):</strong><br>
                    {msg['message']}
                </div>
                """, unsafe_allow_html=True)
            else:
                st.markdown(f"""
                <div class="conversation-bubble bot-bubble">
                    <strong>Bot ({msg['timestamp']}):</strong><br>
                    {msg['message']}
                </div>
                """, unsafe_allow_html=True)
    else:
        st.info("No conversation history yet. Start by speaking or typing your response.")
    
    # Input methods
    st.markdown("### 🎤 Respond to the Bot")
    
    # Text input
    user_input = st.text_input(
        "Type your response:",
        placeholder="Enter your message here...",
        key="text_input"
    )
    
    # Audio input (placeholder for now)
    st.markdown("**Audio Input:** (Coming soon - use text input for now)")
    
    # Send button
    col1, col2, col3 = st.columns([1, 1, 1])
    
    with col1:
        if st.button("📤 Send Message", type="primary", use_container_width=True):
            if user_input.strip():
                process_user_input(user_input.strip())
    
    with col2:
        if st.button("🎤 Start Listening", use_container_width=True):
            st.info("Audio input feature coming soon! Please use text input for now.")
    
    with col3:
        if st.button("📊 Generate Report", use_container_width=True):
            generate_and_display_report()
    
    # End conversation button
    if st.button("🛑 End Conversation", type="secondary", use_container_width=True):
        end_conversation()

def process_user_input(user_input):
    """Process user input and generate bot response."""
    if not user_input.strip():
        return
    
    # Add user message to history
    st.session_state.conversation_history.append({
        "speaker": "user",
        "message": user_input,
        "timestamp": datetime.now().strftime("%H:%M:%S")
    })
    
    # Generate bot response
    try:
        bot_response = st.session_state.bot.generate_response(user_input)
        
        # Add bot response to history
        st.session_state.conversation_history.append({
            "speaker": "bot",
            "message": bot_response,
            "timestamp": datetime.now().strftime("%H:%M:%S")
        })
        
        # Clear the input
        st.session_state.text_input = ""
        
        st.rerun()
        
    except Exception as e:
        st.error(f"Error generating response: {e}")

def generate_and_display_report():
    """Generate and display conversation report."""
    if not st.session_state.conversation_history:
        st.warning("No conversation to analyze. Start a conversation first!")
        return
    
    with st.spinner("Generating analysis report..."):
        try:
            # Get conversation report
            conversation_report = st.session_state.bot.get_conversation_report()
            
            # Generate detailed analysis
            detailed_report = st.session_state.report_generator.analyze_conversation(conversation_report)
            
            # Display the report
            display_report(detailed_report)
            
        except Exception as e:
            st.error(f"Error generating report: {e}")

def display_report(report):
    """Display the conversation analysis report."""
    st.markdown("### 📊 Conversation Analysis Report")
    
    metadata = report['conversation_metadata']
    
    # Overall score
    overall_score = metadata['overall_score']
    score_color = "green" if overall_score >= 80 else "orange" if overall_score >= 60 else "red"
    
    st.markdown(f"""
    <div class="score-card">
        <h3>Overall Score: <span style="color: {score_color};">{overall_score}/100</span></h3>
        <p><strong>Scenario:</strong> {metadata['scenario']}</p>
        <p><strong>Total Messages:</strong> {metadata['total_user_messages']}</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Detailed scores
    col1, col2 = st.columns(2)
    
    with col1:
        # Grammar Analysis
        grammar = report['grammar_analysis']
        st.markdown(f"""
        <div class="score-card">
            <h4>📝 Grammar Analysis</h4>
            <p><strong>Score:</strong> {grammar.get('grammar_score', 0)}/100</p>
            <p><strong>Total Errors:</strong> {grammar.get('total_errors', 0)}</p>
            <p><strong>Error Rate:</strong> {grammar.get('error_rate', 0):.2f} per message</p>
        </div>
        """, unsafe_allow_html=True)
        
        # Pronunciation Analysis
        pronunciation = report['pronunciation_analysis']
        st.markdown(f"""
        <div class="score-card">
            <h4>🗣️ Pronunciation Analysis</h4>
            <p><strong>Score:</strong> {pronunciation.get('pronunciation_score', 0)}/100</p>
            <p><strong>Total Errors:</strong> {pronunciation.get('total_pronunciation_errors', 0)}</p>
            <p><strong>Difficult Sounds:</strong> {', '.join(pronunciation.get('difficult_sounds_used', []))}</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        # Professional Language
        professional = report['professional_language_analysis']
        st.markdown(f"""
        <div class="score-card">
            <h4>💼 Professional Language</h4>
            <p><strong>Score:</strong> {professional.get('professional_score', 0)}/100</p>
            <p><strong>Casual Issues:</strong> {len(professional.get('casual_language_usage', []))}</p>
            <p><strong>Politeness Issues:</strong> {len(professional.get('politeness_issues', []))}</p>
        </div>
        """, unsafe_allow_html=True)
        
        # Fluency Analysis
        fluency = report['fluency_analysis']
        st.markdown(f"""
        <div class="score-card">
            <h4>💬 Fluency Analysis</h4>
            <p><strong>Score:</strong> {fluency.get('fluency_score', 0)}/100</p>
            <p><strong>Avg Words/Message:</strong> {fluency.get('avg_words_per_message', 0):.1f}</p>
            <p><strong>Sentence Variety:</strong> {fluency.get('sentence_structure_variety', 0):.2f}</p>
        </div>
        """, unsafe_allow_html=True)
    
    # Improvement Recommendations
    st.markdown("### 💡 Improvement Recommendations")
    recommendations = report['improvement_recommendations']
    
    if recommendations:
        for i, rec in enumerate(recommendations, 1):
            st.markdown(f"{i}. {rec}")
    else:
        st.success("Great job! No specific recommendations at this time.")
    
    # Detailed Feedback
    st.markdown("### 📋 Detailed Feedback")
    detailed_feedback = report['detailed_feedback']
    
    if detailed_feedback:
        for feedback in detailed_feedback:
            if feedback['suggestions']:
                st.markdown(f"**Message {feedback['message_index']}:** {feedback['original']}")
                for suggestion in feedback['suggestions']:
                    st.markdown(f"  • {suggestion['suggestion']}")
    
    # Download buttons
    st.markdown("### 💾 Download Reports")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        # Download detailed report as JSON
        json_data = json.dumps(report, indent=2, ensure_ascii=False)
        st.download_button(
            label="📄 Download Detailed Report (JSON)",
            data=json_data,
            file_name=f"conversation_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
            mime="application/json"
        )
    
    with col2:
        # Download summary report
        summary = st.session_state.report_generator.generate_summary_report(report)
        st.download_button(
            label="📋 Download Summary Report (TXT)",
            data=summary,
            file_name=f"conversation_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt",
            mime="text/plain"
        )
    
    with col3:
        # Download conversation history
        history_data = json.dumps(st.session_state.conversation_history, indent=2, ensure_ascii=False)
        st.download_button(
            label="💬 Download Conversation History (JSON)",
            data=history_data,
            file_name=f"conversation_history_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
            mime="application/json"
        )

def end_conversation():
    """End the current conversation."""
    st.session_state.conversation_active = False
    st.session_state.conversation_history = []
    st.session_state.current_scenario = None
    st.rerun()

def main():
    """Main application function."""
    # Sidebar
    with st.sidebar:
        st.markdown("### 🎯 Navigation")
        
        if st.session_state.conversation_active:
            st.markdown("**Current Status:** 🟢 Active Conversation")
            st.markdown(f"**Scenario:** {st.session_state.bot.scenario_contexts[st.session_state.current_scenario]['name']}")
            st.markdown(f"**Messages:** {len(st.session_state.conversation_history)}")
        else:
            st.markdown("**Current Status:** ⚪ No Active Conversation")
        
        st.markdown("---")
        
        # Quick actions
        st.markdown("### ⚡ Quick Actions")
        
        if st.button("🏠 Home", use_container_width=True):
            st.session_state.conversation_active = False
            st.rerun()
        
        if st.button("📊 View Reports", use_container_width=True):
            if st.session_state.conversation_history:
                generate_and_display_report()
            else:
                st.warning("No conversation to analyze.")
        
        st.markdown("---")
        
        # Help section
        st.markdown("### ❓ Help")
        st.markdown("""
        **How to use:**
        1. Select a conversation scenario
        2. Start the conversation
        3. Type your responses
        4. Generate reports for analysis
        
        **Features:**
        - Real-time conversation
        - Grammar analysis
        - Pronunciation feedback
        - Professional language assessment
        - Detailed improvement suggestions
        """)
    
    # Main content
    if not st.session_state.conversation_active:
        display_scenario_selection()
    else:
        display_conversation_interface()

if __name__ == "__main__":
    main()
