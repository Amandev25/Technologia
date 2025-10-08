"""
Conversation Manager for the Conversational Bot
Handles three different conversation scenarios with LLM-powered responses.
"""

import json
from datetime import datetime
from typing import Dict, List, Tuple, Optional
import re
from llm_manager import LLMManager

class ConversationManager:
    def __init__(self, api_key: str = None):
        self.conversation_history = []
        self.current_scenario = None
        self.scenario_contexts = self._initialize_scenarios()
        self.pronunciation_errors = []
        self.grammar_errors = []
        
        # Initialize LLM Manager
        self.llm_manager = LLMManager(api_key=api_key)
        
    def _initialize_scenarios(self) -> Dict:
        """Initialize the three conversation scenarios with their contexts and prompts."""
        return {
            "defective_item": {
                "name": "Returning a Defective Item (Polite)",
                "context": "You are a customer service representative helping a customer return a defective item. Be polite, understanding, and helpful. Guide the customer through the return process professionally.",
                "initial_prompt": "Hello! I understand you'd like to return an item. I'm here to help you with that process. Could you please tell me what item you'd like to return and what seems to be the issue with it?",
                "key_phrases": ["thank you", "appreciate", "understand", "apologize", "help", "assist", "resolve"],
                "suggestions": [
                    "Use more polite language like 'I would appreciate' instead of 'I want'",
                    "Add phrases like 'I understand your concern' to show empathy",
                    "Use 'I apologize for the inconvenience' when appropriate",
                    "End responses with 'Is there anything else I can help you with?'"
                ]
            },
            "coffee_shop": {
                "name": "Coffee Shop Conversation (Casual)",
                "context": "You are a friendly coffee shop barista having a casual conversation with a customer. Be warm, welcoming, and use casual but professional language.",
                "initial_prompt": "Good morning! Welcome to our coffee shop. What can I get started for you today? We have some amazing seasonal drinks and fresh pastries!",
                "key_phrases": ["welcome", "great choice", "perfect", "enjoy", "delicious", "fresh", "recommend"],
                "suggestions": [
                    "Use more professional terms like 'beverage' instead of 'drink'",
                    "Add 'Would you like' before suggestions to sound more professional",
                    "Use 'I recommend' instead of 'You should try'",
                    "Include 'Thank you for choosing us' in your responses"
                ]
            },
            "manager_developer": {
                "name": "Manager and Developer Meeting (Formal)",
                "context": "You are a project manager having a formal meeting with a developer about project progress and technical requirements. Use professional, technical language.",
                "initial_prompt": "Good morning. Thank you for meeting with me today. I'd like to discuss the current status of the project and any challenges you might be facing. Could you please provide an update on your progress?",
                "key_phrases": ["status", "progress", "challenges", "requirements", "deadline", "resources", "technical"],
                "suggestions": [
                    "Use more formal language like 'I would like to discuss' instead of 'Let's talk about'",
                    "Include specific technical terms relevant to the project",
                    "Use 'I need clarification on' instead of 'I don't understand'",
                    "End with 'Please provide a detailed update' for more formality"
                ]
            }
        }
    
    def start_conversation(self, scenario: str) -> str:
        """Start a new conversation with the specified scenario using LLM."""
        if scenario not in self.scenario_contexts:
            raise ValueError(f"Invalid scenario: {scenario}")
        
        self.current_scenario = scenario
        self.conversation_history = []
        self.pronunciation_errors = []
        self.grammar_errors = []
        
        # Start conversation with LLM
        initial_message = self.llm_manager.start_conversation(scenario)
        
        # Add initial bot message to our history
        self._add_to_history("bot", initial_message)
        
        return initial_message
    
    def generate_response(self, user_input: str, stt_errors: List[str] = None) -> str:
        """Generate a contextual response using LLM based on user input and conversation history."""
        if not self.current_scenario:
            raise ValueError("No active conversation. Please start a conversation first.")
        
        # Analyze user input for errors
        if stt_errors:
            self.pronunciation_errors.extend(stt_errors)
        
        # Add user message to history
        self._add_to_history("user", user_input)
        
        # Generate response using LLM
        response = self.llm_manager.generate_response(user_input)
        
        # Add bot response to history
        self._add_to_history("bot", response)
        
        return response
    
    def _generate_contextual_response(self, user_input: str, context: Dict) -> str:
        """Generate a response based on the current scenario context."""
        scenario = self.current_scenario
        
        if scenario == "defective_item":
            return self._generate_defective_item_response(user_input, context)
        elif scenario == "coffee_shop":
            return self._generate_coffee_shop_response(user_input, context)
        elif scenario == "manager_developer":
            return self._generate_manager_developer_response(user_input, context)
        
        return "I'm not sure how to respond to that. Could you please rephrase?"
    
    def _generate_defective_item_response(self, user_input: str, context: Dict) -> str:
        """Generate responses for defective item return scenario."""
        user_lower = user_input.lower()
        
        if any(word in user_lower for word in ["defective", "broken", "not working", "damaged"]):
            return "I'm sorry to hear that the item isn't working as expected. I completely understand your frustration. Could you please provide me with your order number so I can look up your purchase details? I'll make sure we get this resolved for you right away."
        
        elif any(word in user_lower for word in ["order number", "receipt", "purchase"]):
            return "Perfect, thank you for providing that information. I can see your order in our system. Now, I'd like to offer you a few options: we can process a full refund, send you a replacement item, or provide store credit. Which option would work best for you?"
        
        elif any(word in user_lower for word in ["refund", "money back", "return"]):
            return "Excellent choice. I'll process the refund for you immediately. The amount will be credited back to your original payment method within 3-5 business days. I'll also send you a return label via email so you can easily send the item back to us. Is there anything else I can assist you with today?"
        
        elif any(word in user_lower for word in ["replacement", "new one", "exchange"]):
            return "I'd be happy to arrange a replacement for you. I'll process that right away and have a new item shipped to you within 1-2 business days. You'll receive tracking information via email once it ships. The defective item can be returned using the prepaid label I'll send you. Does this work for you?"
        
        else:
            return "I understand you'd like to return an item. To better assist you, could you please tell me what specific issue you're experiencing with the product? This will help me determine the best solution for you."
    
    def _generate_coffee_shop_response(self, user_input: str, context: Dict) -> str:
        """Generate responses for coffee shop scenario."""
        user_lower = user_input.lower()
        
        if any(word in user_lower for word in ["coffee", "latte", "cappuccino", "americano", "espresso"]):
            return "Great choice! We have some wonderful coffee options today. Our house blend is particularly popular, and we also have a seasonal pumpkin spice latte that's been a hit. Would you like to try one of those, or do you have a specific preference?"
        
        elif any(word in user_lower for word in ["size", "small", "medium", "large", "venti"]):
            return "Perfect! We have small, medium, and large sizes available. The large is our most popular size. Would you like any modifications to your drink, such as extra shots, different milk, or any flavor syrups?"
        
        elif any(word in user_lower for word in ["pastry", "muffin", "croissant", "bagel", "food"]):
            return "Excellent! We have fresh pastries baked daily. Our blueberry muffins and chocolate croissants are customer favorites. We also have a variety of bagels with cream cheese. Would you like to add one of those to your order?"
        
        elif any(word in user_lower for word in ["total", "price", "cost", "how much"]):
            return "Your total comes to $8.50. We accept cash, credit cards, and mobile payments. Would you like a receipt? And is there anything else I can get for you today?"
        
        else:
            return "That sounds wonderful! Is there anything specific you'd like to know about our menu, or would you like me to recommend something based on your preferences?"
    
    def _generate_manager_developer_response(self, user_input: str, context: Dict) -> str:
        """Generate responses for manager-developer meeting scenario."""
        user_lower = user_input.lower()
        
        if any(word in user_lower for word in ["progress", "status", "update", "completed", "finished"]):
            return "Thank you for the update. I appreciate you keeping me informed about the progress. Could you provide more specific details about what has been completed and what remains to be done? Also, are there any technical challenges or resource requirements that need to be addressed?"
        
        elif any(word in user_lower for word in ["challenge", "problem", "issue", "stuck", "difficult"]):
            return "I understand you're facing some challenges. This is exactly what we need to discuss. Could you elaborate on the specific technical issues you're encountering? I'd like to understand the scope of the problem and determine what additional resources or support you might need to resolve it."
        
        elif any(word in user_lower for word in ["deadline", "timeline", "schedule", "when", "time"]):
            return "Timeline is a critical aspect of our project management. Based on your current progress, do you anticipate any delays to our original deadline? If so, I need to understand the impact and explore options to either accelerate development or adjust our project timeline accordingly."
        
        elif any(word in user_lower for word in ["help", "support", "resource", "need", "require"]):
            return "I'm here to provide the support you need to succeed. Please specify what resources, tools, or assistance would be most helpful. Whether it's additional team members, specific software, or clarification on requirements, I want to ensure you have everything necessary to complete the project successfully."
        
        else:
            return "I appreciate your input. To ensure we're aligned on project objectives, could you provide more specific details about the current status and any concerns you have? This will help me better understand how to support you moving forward."
    
    def _add_to_history(self, speaker: str, message: str):
        """Add a message to the conversation history."""
        timestamp = datetime.now().isoformat()
        self.conversation_history.append({
            "timestamp": timestamp,
            "speaker": speaker,
            "message": message
        })
    
    def get_conversation_report(self) -> Dict:
        """Generate a comprehensive conversation report."""
        if not self.current_scenario:
            return {"error": "No active conversation to report on"}
        
        context = self.scenario_contexts[self.current_scenario]
        
        report = {
            "scenario": context["name"],
            "conversation_duration": self._calculate_duration(),
            "total_exchanges": len([msg for msg in self.conversation_history if msg["speaker"] == "user"]),
            "conversation_history": self.conversation_history,
            "pronunciation_analysis": {
                "errors_detected": len(self.pronunciation_errors),
                "errors": self.pronunciation_errors
            },
            "grammar_analysis": {
                "errors_detected": len(self.grammar_errors),
                "errors": self.grammar_errors
            },
            "improvement_suggestions": context["suggestions"],
            "overall_assessment": self._generate_overall_assessment()
        }
        
        return report
    
    def _calculate_duration(self) -> str:
        """Calculate the duration of the conversation."""
        if len(self.conversation_history) < 2:
            return "0 minutes"
        
        start_time = datetime.fromisoformat(self.conversation_history[0]["timestamp"])
        end_time = datetime.fromisoformat(self.conversation_history[-1]["timestamp"])
        duration = end_time - start_time
        
        minutes = int(duration.total_seconds() / 60)
        seconds = int(duration.total_seconds() % 60)
        
        return f"{minutes} minutes {seconds} seconds"
    
    def _generate_overall_assessment(self) -> str:
        """Generate an overall assessment of the conversation."""
        total_user_messages = len([msg for msg in self.conversation_history if msg["speaker"] == "user"])
        
        if total_user_messages == 0:
            return "No user interaction recorded."
        
        # Simple assessment based on errors and conversation length
        error_rate = (len(self.pronunciation_errors) + len(self.grammar_errors)) / total_user_messages
        
        if error_rate < 0.1:
            return "Excellent communication with minimal errors. Great job!"
        elif error_rate < 0.3:
            return "Good communication with some areas for improvement."
        else:
            return "Communication needs improvement. Focus on pronunciation and grammar."
    
    def save_report(self, filename: str = None) -> str:
        """Save the conversation report to a JSON file."""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"conversation_report_{timestamp}.json"
        
        report = self.get_conversation_report()
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        return filename
