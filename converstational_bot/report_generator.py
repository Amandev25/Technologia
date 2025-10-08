"""
Report Generator for Conversation Analysis
Analyzes grammar, pronunciation, and provides improvement suggestions.
Enhanced with LLM-powered detailed analysis.
"""

import re
import json
from datetime import datetime
from typing import Dict, List, Tuple, Optional
from collections import Counter
import difflib
import google.generativeai as genai
import config

class ReportGenerator:
    def __init__(self, use_llm: bool = True):
        self.grammar_rules = self._initialize_grammar_rules()
        self.pronunciation_patterns = self._initialize_pronunciation_patterns()
        self.professional_alternatives = self._initialize_professional_alternatives()
        self.use_llm = use_llm
        
        # Initialize LLM for enhanced analysis
        if self.use_llm:
            try:
                genai.configure(api_key=config.GEMINI_API_KEY)
                self.llm_model = genai.GenerativeModel('gemini-2.0-flash-exp')
            except Exception as e:
                print(f"Warning: Could not initialize LLM for report generation: {e}")
                self.use_llm = False
        
    def _initialize_grammar_rules(self) -> Dict:
        """Initialize common grammar rules for analysis."""
        return {
            "subject_verb_agreement": [
                (r'\b(he|she|it)\s+(are|were)\b', "Use 'is' or 'was' with he/she/it"),
                (r'\b(they|we|you)\s+(is|was)\b', "Use 'are' or 'were' with they/we/you"),
                (r'\b(I)\s+(are|were)\b', "Use 'am' or 'was' with I"),
            ],
            "common_errors": [
                (r'\b(its)\s+', "Use 'it's' (contraction) or 'its' (possessive) correctly"),
                (r'\b(your)\s+(welcome)\b', "Use 'you're welcome' (you are welcome)"),
                (r'\b(there)\s+(going)\b', "Use 'they're going' (they are going)"),
                (r'\b(loose)\s+(the)\b', "Use 'lose the' (to lose something)"),
                (r'\b(affect)\s+(vs)\s+(effect)\b', "Use 'affect' (verb) vs 'effect' (noun)"),
            ],
            "punctuation": [
                (r'\b(\.|,|!|\?)\s*[a-z]', "Capitalize after punctuation"),
                (r'\b([A-Z][a-z]*)\s+([A-Z][a-z]*)\s+([A-Z][a-z]*)', "Check for proper capitalization"),
            ],
            "sentence_structure": [
                (r'\b(and|but|so|because)\s+(and|but|so|because)\b', "Avoid double conjunctions"),
                (r'\b(very|really|so)\s+(very|really|so)\b', "Avoid redundant intensifiers"),
            ]
        }
    
    def _initialize_pronunciation_patterns(self) -> Dict:
        """Initialize pronunciation error patterns."""
        return {
            "common_mispronunciations": {
                'aks': 'ask',
                'aksed': 'asked',
                'ax': 'ask',
                'fustrated': 'frustrated',
                'libary': 'library',
                'nucular': 'nuclear',
                'realtor': 'real-tor',
                'sherbert': 'sherbet',
                'supposably': 'supposedly',
                'warsh': 'wash',
                'excape': 'escape',
                'expresso': 'espresso',
                'jewlery': 'jewelry',
                'mischevious': 'mischievous',
                'perculiar': 'peculiar',
                'prescription': 'prescription',
                'probly': 'probably',
                'reconize': 'recognize',
                'tempature': 'temperature',
                'triathalon': 'triathlon'
            },
            "difficult_sounds": {
                'th': 'Place tongue between teeth for "th" sounds',
                'r': 'Roll tongue slightly for "r" sounds',
                'l': 'Touch tongue to roof of mouth for "l" sounds',
                'v': 'Bite lower lip gently for "v" sounds',
                'w': 'Round lips for "w" sounds',
                'ng': 'Use back of tongue for "ng" sounds'
            }
        }
    
    def _initialize_professional_alternatives(self) -> Dict:
        """Initialize professional language alternatives."""
        return {
            "casual_to_professional": {
                'yeah': 'yes',
                'yep': 'yes',
                'nope': 'no',
                'gonna': 'going to',
                'wanna': 'want to',
                'gotta': 'have to',
                'kinda': 'kind of',
                'sorta': 'sort of',
                'lemme': 'let me',
                'gimme': 'give me',
                'dunno': "don't know",
                'ain\'t': 'am not / is not / are not',
                'cool': 'excellent / great',
                'awesome': 'excellent / outstanding',
                'sure thing': 'certainly / of course',
                'no problem': 'you\'re welcome / my pleasure',
                'thanks': 'thank you',
                'thx': 'thank you',
                'np': 'no problem',
                'btw': 'by the way',
                'asap': 'as soon as possible',
                'fyi': 'for your information'
            },
            "polite_enhancements": {
                'i want': 'i would like',
                'i need': 'i would appreciate',
                'give me': 'could you please provide',
                'tell me': 'could you please explain',
                'i don\'t understand': 'i need clarification on',
                'that\'s wrong': 'i believe there might be a misunderstanding',
                'i disagree': 'i have a different perspective',
                'no way': 'i\'m not sure that would work',
                'whatever': 'i understand your point',
                'i don\'t care': 'i\'m flexible on that point'
            }
        }
    
    def analyze_conversation(self, conversation_data: Dict) -> Dict:
        """Generate a comprehensive analysis report for the conversation."""
        scenario = conversation_data.get('scenario', '')
        conversation_history = conversation_data.get('conversation_history', [])
        pronunciation_errors = conversation_data.get('pronunciation_analysis', {}).get('errors', [])
        
        # Extract user messages
        user_messages = [msg['message'] for msg in conversation_history if msg['speaker'] == 'user']
        
        # Perform basic analysis
        grammar_analysis = self._analyze_grammar(user_messages)
        pronunciation_analysis = self._analyze_pronunciation_detailed(user_messages, pronunciation_errors)
        professional_analysis = self._analyze_professional_language(user_messages, scenario)
        fluency_analysis = self._analyze_fluency(user_messages)
        
        # Enhanced LLM analysis if enabled
        llm_enhanced_analysis = {}
        if self.use_llm and user_messages:
            llm_enhanced_analysis = self._llm_enhanced_analysis(user_messages, scenario)
            
            # Merge LLM insights with basic analysis
            if llm_enhanced_analysis:
                grammar_analysis = self._merge_grammar_analysis(grammar_analysis, llm_enhanced_analysis.get('grammar', {}))
                pronunciation_analysis = self._merge_pronunciation_analysis(pronunciation_analysis, llm_enhanced_analysis.get('pronunciation', {}))
        
        # Generate overall assessment
        overall_score = self._calculate_overall_score(grammar_analysis, pronunciation_analysis, professional_analysis, fluency_analysis)
        
        report = {
            "conversation_metadata": {
                "scenario": scenario,
                "total_user_messages": len(user_messages),
                "analysis_timestamp": datetime.now().isoformat(),
                "overall_score": overall_score,
                "llm_enhanced": self.use_llm and bool(llm_enhanced_analysis)
            },
            "grammar_analysis": grammar_analysis,
            "pronunciation_analysis": pronunciation_analysis,
            "professional_language_analysis": professional_analysis,
            "fluency_analysis": fluency_analysis,
            "llm_insights": llm_enhanced_analysis.get('insights', []) if llm_enhanced_analysis else [],
            "improvement_recommendations": self._generate_improvement_recommendations(
                grammar_analysis, pronunciation_analysis, professional_analysis, scenario
            ),
            "detailed_feedback": self._generate_detailed_feedback(user_messages, scenario)
        }
        
        return report
    
    def _analyze_grammar(self, messages: List[str]) -> Dict:
        """Analyze grammar in user messages."""
        total_errors = 0
        error_details = []
        error_categories = Counter()
        
        for i, message in enumerate(messages):
            message_errors = []
            
            # Check each grammar rule
            for category, rules in self.grammar_rules.items():
                for pattern, suggestion in rules:
                    matches = re.finditer(pattern, message, re.IGNORECASE)
                    for match in matches:
                        error_details.append({
                            "message_index": i + 1,
                            "message": message,
                            "error": match.group(),
                            "category": category,
                            "suggestion": suggestion,
                            "position": match.span()
                        })
                        message_errors.append(category)
                        total_errors += 1
            
            error_categories.update(message_errors)
        
        return {
            "total_errors": total_errors,
            "error_rate": round(total_errors / len(messages), 2) if messages else 0,
            "error_categories": dict(error_categories),
            "error_details": error_details,
            "grammar_score": max(0, 100 - (total_errors * 10)),  # Simple scoring
            "errors": [],  # Will be populated by LLM if enabled
            "spelling_errors": [],  # Will be populated by LLM if enabled
            "insights": []  # Will be populated by LLM if enabled
        }
    
    def _analyze_pronunciation_detailed(self, messages: List[str], stt_errors: List[str]) -> Dict:
        """Detailed pronunciation analysis."""
        pronunciation_errors = []
        difficult_sounds_used = set()
        
        # Analyze each message
        for i, message in enumerate(messages):
            message_lower = message.lower()
            
            # Check for common mispronunciations
            for error, correct in self.pronunciation_patterns["common_mispronunciations"].items():
                if error in message_lower:
                    pronunciation_errors.append({
                        "message_index": i + 1,
                        "detected": error,
                        "correct": correct,
                        "message": message,
                        "type": "mispronunciation"
                    })
            
            # Check for difficult sounds
            for sound, advice in self.pronunciation_patterns["difficult_sounds"].items():
                if sound in message_lower:
                    difficult_sounds_used.add(sound)
        
        # Add STT-detected errors
        for error in stt_errors:
            pronunciation_errors.append({
                "message_index": "STT",
                "detected": "STT Error",
                "correct": "Unknown",
                "message": error,
                "type": "stt_detected"
            })
        
        return {
            "total_pronunciation_errors": len(pronunciation_errors),
            "difficult_sounds_used": list(difficult_sounds_used),
            "pronunciation_errors": pronunciation_errors,
            "pronunciation_score": max(0, 100 - (len(pronunciation_errors) * 15)),
            "errors": [],  # Will be populated by LLM if enabled
            "likely_errors": []  # Will be populated by LLM if enabled
        }
    
    def _analyze_professional_language(self, messages: List[str], scenario: str) -> Dict:
        """Analyze professional language usage."""
        casual_usage = []
        politeness_issues = []
        
        for i, message in enumerate(messages):
            message_lower = message.lower()
            
            # Check for casual language
            for casual, professional in self.professional_alternatives["casual_to_professional"].items():
                if casual in message_lower:
                    casual_usage.append({
                        "message_index": i + 1,
                        "casual": casual,
                        "professional": professional,
                        "message": message
                    })
            
            # Check for politeness (especially for defective item scenario)
            if scenario == "defective_item":
                for impolite, polite in self.professional_alternatives["polite_enhancements"].items():
                    if impolite in message_lower:
                        politeness_issues.append({
                            "message_index": i + 1,
                            "current": impolite,
                            "suggested": polite,
                            "message": message
                        })
        
        return {
            "casual_language_usage": casual_usage,
            "politeness_issues": politeness_issues,
            "professional_score": max(0, 100 - (len(casual_usage) * 5 + len(politeness_issues) * 10))
        }
    
    def _analyze_fluency(self, messages: List[str]) -> Dict:
        """Analyze conversation fluency."""
        if not messages:
            return {"fluency_score": 0, "analysis": "No messages to analyze"}
        
        total_words = sum(len(message.split()) for message in messages)
        avg_words_per_message = total_words / len(messages)
        
        # Check for sentence variety
        sentence_structures = []
        for message in messages:
            sentences = re.split(r'[.!?]+', message)
            for sentence in sentences:
                sentence = sentence.strip()
                if sentence:
                    # Simple analysis of sentence structure
                    if sentence.startswith(('I', 'You', 'We', 'They')):
                        sentence_structures.append('subject_start')
                    elif sentence.startswith(('Can', 'Could', 'Would', 'Should')):
                        sentence_structures.append('modal_start')
                    elif sentence.startswith(('What', 'How', 'Why', 'When')):
                        sentence_structures.append('question_start')
                    else:
                        sentence_structures.append('other')
        
        structure_variety = len(set(sentence_structures)) / len(sentence_structures) if sentence_structures else 0
        
        return {
            "total_words": total_words,
            "avg_words_per_message": round(avg_words_per_message, 1),
            "sentence_structure_variety": round(structure_variety, 2),
            "fluency_score": int(min(100, (avg_words_per_message * 2) + (structure_variety * 50)))
        }
    
    def _calculate_overall_score(self, grammar: Dict, pronunciation: Dict, professional: Dict, fluency: Dict) -> int:
        """Calculate overall conversation score."""
        weights = {
            'grammar': 0.3,
            'pronunciation': 0.25,
            'professional': 0.25,
            'fluency': 0.2
        }
        
        overall = (
            grammar.get('grammar_score', 0) * weights['grammar'] +
            pronunciation.get('pronunciation_score', 0) * weights['pronunciation'] +
            professional.get('professional_score', 0) * weights['professional'] +
            fluency.get('fluency_score', 0) * weights['fluency']
        )
        
        return int(overall)
    
    def _generate_improvement_recommendations(self, grammar: Dict, pronunciation: Dict, professional: Dict, scenario: str) -> List[str]:
        """Generate specific improvement recommendations."""
        recommendations = []
        
        # Grammar recommendations
        if grammar['total_errors'] > 0:
            top_category = max(grammar['error_categories'].items(), key=lambda x: x[1])[0] if grammar['error_categories'] else None
            if top_category:
                recommendations.append(f"Focus on {top_category.replace('_', ' ')} - you had {grammar['error_categories'][top_category]} errors in this area")
        
        # Pronunciation recommendations
        if pronunciation['total_pronunciation_errors'] > 0:
            recommendations.append("Practice pronunciation of commonly mispronounced words")
            if pronunciation['difficult_sounds_used']:
                recommendations.append(f"Focus on these difficult sounds: {', '.join(pronunciation['difficult_sounds_used'])}")
        
        # Professional language recommendations
        if professional['casual_language_usage']:
            recommendations.append("Use more professional language - avoid casual expressions in formal settings")
        
        if professional['politeness_issues'] and scenario == "defective_item":
            recommendations.append("Use more polite and persuasive language when making requests")
        
        # Scenario-specific recommendations
        if scenario == "coffee_shop":
            recommendations.append("Practice using more professional service language")
        elif scenario == "manager_developer":
            recommendations.append("Use more technical and formal business language")
        elif scenario == "defective_item":
            recommendations.append("Focus on being more persuasive and polite in your requests")
        
        return recommendations
    
    def _generate_detailed_feedback(self, messages: List[str], scenario: str) -> List[Dict]:
        """Generate detailed feedback for each message."""
        feedback = []
        
        for i, message in enumerate(messages):
            message_feedback = {
                "message_index": i + 1,
                "original": message,
                "suggestions": []
            }
            
            # Grammar suggestions
            for category, rules in self.grammar_rules.items():
                for pattern, suggestion in rules:
                    if re.search(pattern, message, re.IGNORECASE):
                        message_feedback["suggestions"].append({
                            "type": "grammar",
                            "suggestion": suggestion
                        })
            
            # Professional language suggestions
            message_lower = message.lower()
            for casual, professional in self.professional_alternatives["casual_to_professional"].items():
                if casual in message_lower:
                    message_feedback["suggestions"].append({
                        "type": "professional",
                        "suggestion": f"Consider using '{professional}' instead of '{casual}'"
                    })
            
            # Scenario-specific suggestions
            if scenario == "defective_item":
                for impolite, polite in self.professional_alternatives["polite_enhancements"].items():
                    if impolite in message_lower:
                        message_feedback["suggestions"].append({
                            "type": "politeness",
                            "suggestion": f"Try: '{polite}' instead of '{impolite}'"
                        })
            
            feedback.append(message_feedback)
        
        return feedback
    
    def save_detailed_report(self, report: Dict, filename: str = None) -> str:
        """Save the detailed analysis report to a JSON file."""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"detailed_conversation_analysis_{timestamp}.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        return filename
    
    def generate_summary_report(self, report: Dict) -> str:
        """Generate a human-readable summary report."""
        metadata = report['conversation_metadata']
        grammar = report['grammar_analysis']
        pronunciation = report['pronunciation_analysis']
        professional = report['professional_language_analysis']
        fluency = report['fluency_analysis']
        recommendations = report['improvement_recommendations']
        
        summary = f"""
CONVERSATION ANALYSIS SUMMARY
============================

Scenario: {metadata['scenario']}
Overall Score: {metadata['overall_score']}/100
Total Messages: {metadata['total_user_messages']}

GRAMMAR ANALYSIS
----------------
Score: {grammar.get('grammar_score', 0)}/100
Total Errors: {grammar.get('total_errors', 0)}
Error Rate: {grammar.get('error_rate', 0):.2f} errors per message

PRONUNCIATION ANALYSIS
----------------------
Score: {pronunciation.get('pronunciation_score', 0)}/100
Total Errors: {pronunciation.get('total_pronunciation_errors', 0)}
Difficult Sounds Used: {', '.join(pronunciation.get('difficult_sounds_used', []))}

PROFESSIONAL LANGUAGE
---------------------
Score: {professional.get('professional_score', 0)}/100
Casual Language Issues: {len(professional.get('casual_language_usage', []))}
Politeness Issues: {len(professional.get('politeness_issues', []))}

FLUENCY ANALYSIS
----------------
Score: {fluency.get('fluency_score', 0)}/100
Average Words per Message: {fluency.get('avg_words_per_message', 0):.1f}
Sentence Variety: {fluency.get('sentence_structure_variety', 0):.2f}

IMPROVEMENT RECOMMENDATIONS
---------------------------
"""
        
        for i, rec in enumerate(recommendations, 1):
            summary += f"{i}. {rec}\n"
        
        return summary
    
    def _llm_enhanced_analysis(self, user_messages: List[str], scenario: str) -> Dict:
        """Use LLM to provide detailed, pinpointed analysis of grammar, spelling, and errors."""
        try:
            # Combine all user messages
            combined_text = "\n".join([f"Message {i+1}: {msg}" for i, msg in enumerate(user_messages)])
            
            # Create comprehensive analysis prompt
            prompt = f"""You are an expert English language teacher analyzing a student's conversation practice.

Scenario: {scenario}

Student's Messages:
{combined_text}

Please provide a detailed analysis in the following JSON format:

{{
  "grammar": {{
    "errors": [
      {{
        "message_index": 1,
        "original_text": "exact text with error",
        "error_type": "subject-verb agreement/tense/article/etc",
        "correction": "corrected text",
        "explanation": "brief explanation"
      }}
    ],
    "spelling_errors": [
      {{
        "message_index": 1,
        "misspelled_word": "word",
        "correct_spelling": "word",
        "context": "sentence containing the error"
      }}
    ]
  }},
  "pronunciation": {{
    "likely_errors": [
      {{
        "word": "word that may be mispronounced",
        "phonetic": "correct pronunciation guide",
        "tip": "how to pronounce correctly"
      }}
    ]
  }},
  "insights": [
    "Specific insight about communication style",
    "Strength observed in the conversation",
    "Area needing improvement with example"
  ]
}}

Be specific and pinpoint exact errors. If there are no errors in a category, use an empty array.
Focus on being helpful and constructive."""

            # Get LLM response
            response = self.llm_model.generate_content(prompt)
            
            # Parse JSON response
            response_text = response.text.strip()
            
            # Debug: Print raw LLM response
            print(f"\n=== DEBUG: Raw LLM Response ===")
            print(f"Response length: {len(response_text)}")
            print(f"First 500 chars: {response_text[:500]}")
            print("===============================")
            
            # Extract JSON from response (handle markdown code blocks)
            if '```json' in response_text:
                json_start = response_text.find('```json') + 7
                json_end = response_text.find('```', json_start)
                response_text = response_text[json_start:json_end].strip()
            elif '```' in response_text:
                json_start = response_text.find('```') + 3
                json_end = response_text.find('```', json_start)
                response_text = response_text[json_start:json_end].strip()
            
            # Debug: Print extracted JSON
            print(f"\n=== DEBUG: Extracted JSON ===")
            print(f"JSON length: {len(response_text)}")
            print(f"JSON content: {response_text}")
            print("=============================")
            
            analysis = json.loads(response_text)
            
            # Debug: Print parsed analysis
            print(f"\n=== DEBUG: Parsed Analysis ===")
            print(f"Grammar errors: {analysis.get('grammar', {}).get('errors', [])}")
            print(f"Spelling errors: {analysis.get('grammar', {}).get('spelling_errors', [])}")
            print(f"Pronunciation errors: {analysis.get('pronunciation', {}).get('likely_errors', [])}")
            print(f"Insights: {analysis.get('insights', [])}")
            print("==============================")
            
            return analysis
            
        except json.JSONDecodeError as e:
            print(f"Warning: Could not parse LLM response as JSON: {e}")
            return {}
        except Exception as e:
            print(f"Warning: LLM analysis failed: {e}")
            return {}
    
    def _merge_grammar_analysis(self, basic_analysis: Dict, llm_analysis: Dict) -> Dict:
        """Merge basic grammar analysis with LLM-enhanced analysis."""
        print(f"\n=== DEBUG: Merge Grammar Analysis ===")
        print(f"LLM analysis received: {llm_analysis}")
        
        if not llm_analysis:
            print("No LLM analysis to merge")
            return basic_analysis
        
        # Add LLM-detected errors to the basic analysis
        llm_errors = llm_analysis.get('errors', [])
        llm_spelling = llm_analysis.get('spelling_errors', [])
        
        print(f"LLM errors found: {len(llm_errors)}")
        print(f"LLM spelling errors found: {len(llm_spelling)}")
        print("=====================================")
        
        # Create enhanced error details
        enhanced_errors = basic_analysis.get('error_details', []).copy()
        
        for error in llm_errors:
            enhanced_errors.append({
                "message_index": error.get('message_index', 0),
                "error": error.get('original_text', ''),
                "correction": error.get('correction', ''),
                "category": error.get('error_type', 'grammar'),
                "suggestion": error.get('explanation', ''),
                "source": "llm"
            })
        
        for spelling in llm_spelling:
            enhanced_errors.append({
                "message_index": spelling.get('message_index', 0),
                "error": spelling.get('misspelled_word', ''),
                "correction": spelling.get('correct_spelling', ''),
                "category": "spelling",
                "suggestion": f"Correct spelling: {spelling.get('correct_spelling', '')}",
                "context": spelling.get('context', ''),
                "source": "llm"
            })
        
        # Update counts
        basic_analysis['error_details'] = enhanced_errors
        basic_analysis['total_errors'] = len(enhanced_errors)
        basic_analysis['llm_detected_errors'] = len(llm_errors) + len(llm_spelling)
        
        # Add separate arrays for frontend display
        basic_analysis['errors'] = llm_errors if llm_errors else []
        basic_analysis['spelling_errors'] = llm_spelling if llm_spelling else []
        basic_analysis['insights'] = llm_analysis.get('insights', [])
        
        # Recalculate score
        total_messages = basic_analysis.get('error_rate', 0)
        if total_messages > 0:
            basic_analysis['error_rate'] = basic_analysis['total_errors'] / total_messages
        
        return basic_analysis
    
    def _merge_pronunciation_analysis(self, basic_analysis: Dict, llm_analysis: Dict) -> Dict:
        """Merge basic pronunciation analysis with LLM-enhanced analysis."""
        if not llm_analysis:
            return basic_analysis
        
        # Add LLM pronunciation insights
        llm_pronunciation = llm_analysis.get('likely_errors', [])
        
        pronunciation_errors = basic_analysis.get('pronunciation_errors', []).copy()
        
        for error in llm_pronunciation:
            pronunciation_errors.append({
                "word": error.get('word', ''),
                "phonetic": error.get('phonetic', ''),
                "tip": error.get('tip', ''),
                "type": "llm_detected",
                "source": "llm"
            })
        
        basic_analysis['pronunciation_errors'] = pronunciation_errors
        basic_analysis['llm_pronunciation_tips'] = llm_pronunciation
        
        # Add separate arrays for frontend display
        basic_analysis['errors'] = pronunciation_errors if pronunciation_errors else []
        basic_analysis['likely_errors'] = llm_pronunciation if llm_pronunciation else []
        
        return basic_analysis
