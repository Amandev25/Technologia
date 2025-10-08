"""
Cloud Run Flask API for Conversational Bot
Production-ready API for deployment on Google Cloud Run
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys

# Import bot modules
from conversation_manager import ConversationManager
from report_generator import ReportGenerator

app = Flask(__name__)

# Configure CORS for production
CORS(app, resources={
    r"/api/*": {
        "origins": ["*"],  # In production, replace with your frontend domain
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Global instances - in production, use session management or database
conversations = {}  # Store active conversations by session_id
report_generator = ReportGenerator()

def get_gemini_api_key():
    """Get Gemini API key from environment variable."""
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key or api_key == 'your_gemini_api_key_here':
        raise ValueError("GEMINI_API_KEY environment variable not set")
    return api_key

@app.route('/', methods=['GET'])
def home():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'service': 'Conversational Bot API',
        'version': '1.0.0',
        'endpoints': {
            'start_conversation': '/api/start_conversation',
            'generate_response': '/api/generate_response',
            'generate_report': '/api/generate_report',
            'health': '/api/health'
        }
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Detailed health check endpoint."""
    try:
        api_key = get_gemini_api_key()
        gemini_configured = True
    except ValueError:
        gemini_configured = False
    
    return jsonify({
        'status': 'healthy',
        'gemini_api_configured': gemini_configured,
        'active_conversations': len(conversations)
    })

@app.route('/api/start_conversation', methods=['POST'])
def start_conversation():
    """Start a new conversation with the selected scenario."""
    try:
        data = request.json
        scenario = data.get('scenario')
        session_id = data.get('session_id', 'default')
        
        if not scenario:
            return jsonify({'error': 'Scenario is required'}), 400
        
        # Get API key
        api_key = get_gemini_api_key()
        
        # Initialize conversation manager
        conversation_manager = ConversationManager(api_key=api_key)
        
        # Start conversation
        greeting = conversation_manager.start_conversation(scenario)
        
        # Store conversation in memory (in production, use database)
        conversations[session_id] = {
            'manager': conversation_manager,
            'scenario': scenario
        }
        
        return jsonify({
            'success': True,
            'greeting': greeting,
            'scenario': scenario,
            'session_id': session_id
        })
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        app.logger.error(f"Error starting conversation: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/generate_response', methods=['POST'])
def generate_response():
    """Generate a response to user input."""
    try:
        data = request.json
        user_message = data.get('user_message')
        session_id = data.get('session_id', 'default')
        
        if not user_message:
            return jsonify({'error': 'User message is required'}), 400
        
        # Get conversation from memory
        if session_id not in conversations:
            return jsonify({'error': 'Conversation not found. Please start a new conversation.'}), 404
        
        conversation_manager = conversations[session_id]['manager']
        
        # Generate response
        response = conversation_manager.generate_response(user_message)
        
        # Get turn count
        turn_count = len([msg for msg in conversation_manager.conversation_history if msg['speaker'] == 'user'])
        
        return jsonify({
            'success': True,
            'response': response,
            'turn_count': turn_count
        })
        
    except Exception as e:
        app.logger.error(f"Error generating response: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/generate_report', methods=['POST'])
def generate_report():
    """Generate conversation analysis report."""
    try:
        data = request.json
        session_id = data.get('session_id', 'default')
        
        # Get conversation from memory
        if session_id not in conversations:
            return jsonify({'error': 'Conversation not found'}), 404
        
        conversation_manager = conversations[session_id]['manager']
        
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
        
        # Clean up conversation from memory
        if session_id in conversations:
            del conversations[session_id]
        
        return jsonify(report)
        
    except Exception as e:
        app.logger.error(f"Error generating report: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)
