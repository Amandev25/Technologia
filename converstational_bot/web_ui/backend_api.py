"""
Flask Backend API for Web UI
Connects the HTML/CSS/JS frontend with the Python conversational bot.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
from pathlib import Path

# Add parent directory to path to import bot modules
parent_dir = str(Path(__file__).parent.parent)
sys.path.append(parent_dir)

from conversation_manager import ConversationManager
from report_generator import ReportGenerator
import config

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Global instances
conversation_manager = None
report_generator = ReportGenerator()
current_scenario = None

@app.route('/api/start_conversation', methods=['POST'])
def start_conversation():
    """Start a new conversation with the selected scenario."""
    global conversation_manager, current_scenario
    
    try:
        data = request.json
        scenario = data.get('scenario')
        
        if not scenario:
            return jsonify({'error': 'Scenario is required'}), 400
        
        # Initialize conversation manager
        conversation_manager = ConversationManager(api_key=config.GEMINI_API_KEY)
        current_scenario = scenario
        
        # Start conversation
        greeting = conversation_manager.start_conversation(scenario)
        
        return jsonify({
            'success': True,
            'greeting': greeting,
            'scenario': scenario
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate_response', methods=['POST'])
def generate_response():
    """Generate a response to user input."""
    global conversation_manager
    
    try:
        if not conversation_manager:
            return jsonify({'error': 'Conversation not started'}), 400
        
        data = request.json
        user_message = data.get('user_message')
        
        if not user_message:
            return jsonify({'error': 'User message is required'}), 400
        
        # Generate response
        response = conversation_manager.generate_response(user_message)
        
        return jsonify({
            'success': True,
            'response': response,
            'turn_count': len([msg for msg in conversation_manager.conversation_history if msg['speaker'] == 'user'])
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate_report', methods=['POST'])
def generate_report():
    """Generate conversation analysis report."""
    global conversation_manager, report_generator
    
    try:
        if not conversation_manager:
            return jsonify({'error': 'No conversation to analyze'}), 400
        
        # Get conversation report
        conversation_report = conversation_manager.get_conversation_report()
        
        # Generate detailed analysis
        detailed_report = report_generator.analyze_conversation(conversation_report)
        
        # Extract key metrics
        report = {
            'overall_score': detailed_report['conversation_metadata']['overall_score'],
            'grammar': {
                'score': detailed_report['grammar_analysis'].get('grammar_score', 0),
                'errors': detailed_report['grammar_analysis'].get('total_errors', 0),
                'details': f"Total errors: {detailed_report['grammar_analysis'].get('total_errors', 0)}. Error rate: {detailed_report['grammar_analysis'].get('error_rate', 0):.2f} per message."
            },
            'pronunciation': {
                'score': detailed_report['pronunciation_analysis'].get('pronunciation_score', 0),
                'errors': detailed_report['pronunciation_analysis'].get('total_pronunciation_errors', 0),
                'details': f"Pronunciation errors detected: {detailed_report['pronunciation_analysis'].get('total_pronunciation_errors', 0)}. Difficult sounds: {', '.join(detailed_report['pronunciation_analysis'].get('difficult_sounds_used', []))}"
            },
            'professional': {
                'score': detailed_report['professional_language_analysis'].get('professional_score', 0),
                'casual_issues': len(detailed_report['professional_language_analysis'].get('casual_language_usage', [])),
                'details': f"Casual language issues: {len(detailed_report['professional_language_analysis'].get('casual_language_usage', []))}. Politeness issues: {len(detailed_report['professional_language_analysis'].get('politeness_issues', []))}"
            },
            'fluency': {
                'score': detailed_report['fluency_analysis'].get('fluency_score', 0),
                'avg_words': detailed_report['fluency_analysis'].get('avg_words_per_message', 0),
                'details': f"Average words per message: {detailed_report['fluency_analysis'].get('avg_words_per_message', 0):.1f}. Sentence variety: {detailed_report['fluency_analysis'].get('sentence_structure_variety', 0):.2f}"
            },
            'recommendations': detailed_report.get('improvement_recommendations', []),
            'conversation_history': conversation_report['conversation_history']
        }
        
        return jsonify(report)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'gemini_api_configured': config.GEMINI_API_KEY != 'your_gemini_api_key_here'
    })

if __name__ == '__main__':
    print("🚀 Starting Conversational Bot Backend API...")
    print("📍 Backend URL: http://localhost:5000")
    print("🔑 Gemini API Key configured:", config.GEMINI_API_KEY != 'your_gemini_api_key_here')
    print("\n💡 Make sure to update the API_URL in app.js to: http://localhost:5000/api")
    print("\n🌐 Open the frontend by opening index.html in your browser")
    print("\n🛑 Press Ctrl+C to stop the server\n")
    
    app.run(debug=True, port=5000)
