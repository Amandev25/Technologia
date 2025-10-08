"""
LLM Manager for Conversational Bot
Handles interaction with Google Gemini 2.0 Flash for dynamic conversation generation.
"""

import google.generativeai as genai
from typing import List, Dict, Optional
from datetime import datetime
import config

class LLMManager:
    def __init__(self, api_key: str = None):
        """Initialize the LLM Manager with Gemini API."""
        self.api_key = api_key or config.GEMINI_API_KEY
        
        # Configure Gemini API
        genai.configure(api_key=self.api_key)
        
        # Initialize the model (Gemini 2.0 Flash)
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        # Conversation history
        self.conversation_history = []
        self.current_scenario = None
        self.scenario_prompts = self._initialize_scenario_prompts()
        
    def _initialize_scenario_prompts(self) -> Dict:
        """Initialize system prompts for each scenario."""
        return {
            "defective_item": {
                "name": "Returning a Defective Item (Polite)",
                "system_prompt": """You are a professional and empathetic customer service representative helping a customer return a defective item. 

Your role:
- Be extremely polite and understanding
- Show empathy for the customer's frustration
- Guide them through the return process step by step
- Offer solutions (refund, replacement, or store credit)
- Use professional language with phrases like "I understand", "I apologize", "I'd be happy to help"
- Keep responses concise (2-3 sentences max)
- Ask relevant questions to help resolve the issue

Conversation flow:
1. Greet and ask what item they want to return
2. Ask for order number/details
3. Offer solutions (refund, replacement, store credit)
4. Provide next steps
5. End politely

Be warm, professional, and solution-oriented. The conversation should last 3-6 exchanges.""",
                "initial_greeting": "Hello! I understand you'd like to return an item. I'm here to help you with that process. Could you please tell me what item you'd like to return and what seems to be the issue with it?"
            },
            "coffee_shop": {
                "name": "Coffee Shop Conversation (Casual)",
                "system_prompt": """You are a friendly and welcoming coffee shop barista serving a customer.

Your role:
- Be warm, friendly, and casual but professional
- Recommend drinks and food items
- Answer questions about menu items
- Take orders efficiently
- Use casual but professional language
- Keep responses concise (2-3 sentences max)
- Create a welcoming atmosphere

Conversation flow:
1. Greet warmly and ask what they'd like
2. Make recommendations or answer questions
3. Confirm order and suggest add-ons
4. Provide total and thank them
5. End with a friendly goodbye

Be enthusiastic, helpful, and make the customer feel welcome. The conversation should last 3-6 exchanges.""",
                "initial_greeting": "Good morning! Welcome to our coffee shop. What can I get started for you today? We have some amazing seasonal drinks and fresh pastries!"
            },
            "manager_developer": {
                "name": "Manager and Developer Meeting (Formal)",
                "system_prompt": """You are a professional project manager having a formal meeting with a developer about project progress.

Your role:
- Be professional and formal in your language
- Ask about project status and progress
- Inquire about technical challenges
- Discuss deadlines and resource needs
- Use formal business language
- Keep responses concise (2-3 sentences max)
- Focus on actionable items

Conversation flow:
1. Greet professionally and ask for status update
2. Discuss specific progress and challenges
3. Address timeline and deadline concerns
4. Offer support and resources
5. Summarize action items and close

Be respectful, professional, and focused on project objectives. The conversation should last 3-6 exchanges.""",
                "initial_greeting": "Good morning. Thank you for meeting with me today. I'd like to discuss the current status of the project and any challenges you might be facing. Could you please provide an update on your progress?"
            }
        }
    
    def start_conversation(self, scenario: str) -> str:
        """Start a new conversation with the specified scenario."""
        if scenario not in self.scenario_prompts:
            raise ValueError(f"Invalid scenario: {scenario}")
        
        self.current_scenario = scenario
        self.conversation_history = []
        
        # Get the initial greeting
        initial_greeting = self.scenario_prompts[scenario]["initial_greeting"]
        
        # Add to conversation history
        self._add_to_history("assistant", initial_greeting)
        
        return initial_greeting
    
    def generate_response(self, user_input: str) -> str:
        """Generate a response based on user input and conversation history."""
        if not self.current_scenario:
            raise ValueError("No active conversation. Please start a conversation first.")
        
        # Add user input to history
        self._add_to_history("user", user_input)
        
        # Build the prompt with context
        full_prompt = self._build_prompt_with_context(user_input)
        
        try:
            # Generate response using Gemini
            response = self.model.generate_content(full_prompt)
            bot_response = response.text.strip()
            
            # Add bot response to history
            self._add_to_history("assistant", bot_response)
            
            return bot_response
            
        except Exception as e:
            error_message = f"I apologize, but I'm having trouble generating a response right now. Error: {str(e)}"
            self._add_to_history("assistant", error_message)
            return error_message
    
    def _build_prompt_with_context(self, user_input: str) -> str:
        """Build a prompt with conversation context for the LLM."""
        scenario_info = self.scenario_prompts[self.current_scenario]
        system_prompt = scenario_info["system_prompt"]
        
        # Build conversation context
        context = "Conversation so far:\n"
        for msg in self.conversation_history[:-1]:  # Exclude the latest user input we just added
            speaker = "Customer" if msg["role"] == "user" else "You"
            context += f"{speaker}: {msg['content']}\n"
        
        # Add current user input
        context += f"Customer: {user_input}\n"
        
        # Build the full prompt
        full_prompt = f"""{system_prompt}

{context}

Now respond as the {scenario_info['name'].split('(')[0].strip()}. Keep your response concise (2-3 sentences max) and in character. Respond naturally to continue the conversation."""
        
        return full_prompt
    
    def _add_to_history(self, role: str, content: str):
        """Add a message to the conversation history."""
        self.conversation_history.append({
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat()
        })
    
    def get_conversation_history(self) -> List[Dict]:
        """Get the complete conversation history."""
        return self.conversation_history
    
    def get_conversation_dict(self) -> Dict:
        """Get conversation as a dictionary for reporting."""
        return {
            "scenario": self.scenario_prompts[self.current_scenario]["name"] if self.current_scenario else "Unknown",
            "conversation_history": [
                {
                    "timestamp": msg["timestamp"],
                    "speaker": "user" if msg["role"] == "user" else "bot",
                    "message": msg["content"]
                }
                for msg in self.conversation_history
            ],
            "total_exchanges": len([msg for msg in self.conversation_history if msg["role"] == "user"])
        }
    
    def should_end_conversation(self) -> bool:
        """Determine if the conversation should end based on turn count."""
        user_turns = len([msg for msg in self.conversation_history if msg["role"] == "user"])
        return user_turns >= config.MAX_CONVERSATION_TURNS
    
    def check_end_phrases(self, user_input: str) -> bool:
        """Check if user wants to end the conversation."""
        end_phrases = [
            "goodbye", "bye", "see you", "end conversation", "stop",
            "that's all", "finished", "done", "thank you"
        ]
        
        user_lower = user_input.lower()
        return any(phrase in user_lower for phrase in end_phrases)
