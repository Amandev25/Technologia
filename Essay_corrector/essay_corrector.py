import json
import google.generativeai as gai
from typing import Dict, Any
import logging

# Configure logging
import os
from datetime import datetime

# Create logs directory if it doesn't exist
os.makedirs("logs", exist_ok=True)

# Configure logging with file handler
log_filename = f"logs/essay_corrector_{datetime.now().strftime('%Y%m%d')}.log"
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_filename),
        logging.StreamHandler()  # Also log to console
    ]
)
logger = logging.getLogger(__name__)

def llm_call(system_instruct: str, contents: str, model_name: str = "gemini-2.0-flash") -> Dict[str, Any]:
    """
    Calls the Gemini API and returns the content and token usage.
    """
    try:
        logger.info(f"Starting LLM call with model: {model_name}")
        logger.info(f"System instruction length: {len(system_instruct)}")
        logger.info(f"Content length: {len(contents)}")
        
        prompt = f"{system_instruct}\n\nProvided context: {contents}"
        logger.debug(f"Full prompt length: {len(prompt)}")
        
        model = gai.GenerativeModel(
            model_name=model_name,
            generation_config=gai.GenerationConfig(
                temperature=0.0,
                top_p=1.0,
                top_k=1,
                candidate_count=1,
                max_output_tokens=4096,
            )
        )
        
        logger.info("Generating content with Gemini API")
        response = model.generate_content(prompt)
        
        # Check if response is empty or blocked
        if not response.text:
            logger.error("Empty response from Gemini API")
            if hasattr(response, 'prompt_feedback') and response.prompt_feedback:
                logger.error(f"Prompt feedback: {response.prompt_feedback}")
            raise Exception("Empty response from Gemini API - possibly blocked content")
        
        prompt_tokens = len(prompt.split())
        completion_tokens = len(response.text.split()) if response.text else 0
        
        logger.info(f"LLM call successful - Prompt tokens: {prompt_tokens}, Completion tokens: {completion_tokens}")
        logger.debug(f"Response preview: {response.text[:200] if response.text else 'No response'}...")
        
        return {
            "content": response.text,
            "token_usage": {
                "prompt_tokens": prompt_tokens,
                "completion_tokens": completion_tokens
            }
        }
    except Exception as e:
        logger.error(f"Error in LLM call: {str(e)}", exc_info=True)
        raise Exception(f"Failed to call LLM: {str(e)}")

def correct_essay(essay: str, jwt_token: str) -> Dict[str, Any]:
    """
    Takes an essay string and JWT token, calls LLM to check errors and returns corrected version with report.
    
    Args:
        essay (str): The essay text to be corrected
        jwt_token (str): JWT token for authentication
        
    Returns:
        Dict[str, Any]: Dictionary containing corrected essay, report, and JWT token
    """
    try:
        logger.info("Starting essay correction process")
        logger.info(f"Essay length: {len(essay)}")
        logger.info(f"JWT token length: {len(jwt_token)}")
        logger.debug(f"Essay preview: {essay[:100]}...")
        # System instruction for the LLM
        system_instruction = """You are an expert English language tutor and essay corrector. 

TASK: Correct the provided essay and provide a comprehensive, structured analysis.

REQUIREMENTS:
1. Fix ALL spelling and grammatical errors
2. Improve sentence structure and clarity
3. Maintain the original meaning and tone
4. Provide detailed, structured feedback
5. Return ONLY valid JSON format

RESPONSE FORMAT (return ONLY this JSON structure):
{
    "corrected_essay": "The fully corrected version of the essay with all errors fixed",
    "essay_report": {
        "overall_score": 85,
        "categories": {
            "spelling": {
                "score": 90,
                "errors_found": 2,
                "errors": [
                    {
                        "word": "recieve",
                        "correction": "receive",
                        "position": "line 1",
                        "explanation": "Common misspelling - 'i' before 'e' except after 'c'"
                    }
                ],
                "feedback": "Good spelling overall with minor errors"
            },
            "grammar": {
                "score": 80,
                "errors_found": 1,
                "errors": [
                    {
                        "error": "subject-verb disagreement",
                        "original": "need",
                        "correction": "needs",
                        "position": "line 1",
                        "explanation": "Third person singular requires 's' ending"
                    }
                ],
                "feedback": "Generally good grammar with room for improvement"
            },
            "structure": {
                "score": 85,
                "feedback": "Clear organization with good paragraph flow",
                "suggestions": ["Consider adding transitional phrases between paragraphs"]
            },
            "clarity": {
                "score": 90,
                "feedback": "Ideas are clearly expressed and easy to follow",
                "suggestions": []
            },
            "vocabulary": {
                "score": 75,
                "feedback": "Appropriate word choice with some opportunities for enhancement",
                "suggestions": ["Consider using more varied vocabulary in academic writing"]
            }
        },
        "summary": {
            "total_errors": 3,
            "strengths": ["Clear thesis statement", "Good use of examples"],
            "areas_for_improvement": ["Spelling accuracy", "Grammar consistency"],
            "overall_feedback": "This essay shows good understanding of the topic with clear organization. Focus on spelling and grammar for improvement."
        }
    }
}

EXAMPLE:
Input: "I have a recieve problem with my seperate files. It need to be corected."
Output: {
    "corrected_essay": "I have a receive problem with my separate files. It needs to be corrected.",
    "essay_report": {
        "overall_score": 75,
        "categories": {
            "spelling": {
                "score": 60,
                "errors_found": 2,
                "errors": [
                    {
                        "word": "recieve",
                        "correction": "receive",
                        "position": "line 1",
                        "explanation": "Common misspelling - 'i' before 'e' except after 'c'"
                    },
                    {
                        "word": "seperate",
                        "correction": "separate",
                        "position": "line 1",
                        "explanation": "Common misspelling - 'a' not 'e' in the middle"
                    }
                ],
                "feedback": "Several spelling errors need attention"
            },
            "grammar": {
                "score": 80,
                "errors_found": 1,
                "errors": [
                    {
                        "error": "subject-verb disagreement",
                        "original": "need",
                        "correction": "needs",
                        "position": "line 2",
                        "explanation": "Third person singular requires 's' ending"
                    }
                ],
                "feedback": "Good grammar overall with one error"
            },
            "structure": {
                "score": 70,
                "feedback": "Basic sentence structure is present",
                "suggestions": ["Consider combining sentences for better flow"]
            },
            "clarity": {
                "score": 85,
                "feedback": "Message is clear and understandable",
                "suggestions": []
            },
            "vocabulary": {
                "score": 80,
                "feedback": "Appropriate word choice for the context",
                "suggestions": []
            }
        },
        "summary": {
            "total_errors": 3,
            "strengths": ["Clear message", "Appropriate vocabulary"],
            "areas_for_improvement": ["Spelling accuracy", "Sentence variety"],
            "overall_feedback": "Good basic writing with clear communication. Focus on spelling and sentence structure for improvement."
        }
    }
}

CRITICAL: Return ONLY the JSON object, no other text. Ensure all scores are integers between 0-100."""
        
        # Call the LLM
        logger.info("Calling LLM for essay correction...")
        llm_response = llm_call(system_instruction, essay)
        
        # Parse the LLM response
        logger.info("Parsing LLM response")
        raw_response = llm_response["content"].strip()
        logger.info(f"Raw response length: {len(raw_response)}")
        logger.debug(f"Raw response: {raw_response[:200]}...")
        
        try:
            # Try to extract JSON from the response if it's wrapped in other text
            if raw_response.startswith('{') and raw_response.endswith('}'):
                llm_json = json.loads(raw_response)
            else:
                # Try to find JSON in the response
                start_idx = raw_response.find('{')
                end_idx = raw_response.rfind('}') + 1
                if start_idx != -1 and end_idx > start_idx:
                    json_str = raw_response[start_idx:end_idx]
                    llm_json = json.loads(json_str)
                else:
                    raise json.JSONDecodeError("No JSON found in response", raw_response, 0)
            
            logger.info("Successfully parsed LLM response as JSON")
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse LLM response as JSON: {str(e)}")
            logger.error(f"Raw LLM response: {raw_response[:500]}...")
            # Fallback response if JSON parsing fails
            llm_json = {
                "corrected_essay": essay,  # Return original if parsing fails
                "essay_report": f"Error parsing LLM response: {str(e)}. Raw response: {raw_response[:100]}..."
            }
        
        # Validate required keys
        if "corrected_essay" not in llm_json or "essay_report" not in llm_json:
            logger.error("LLM response missing required keys")
            logger.error(f"Available keys: {list(llm_json.keys())}")
            llm_json = {
                "corrected_essay": essay,
                "essay_report": "Error: LLM response format invalid. Missing required keys."
            }
        
        # Validate structured report format if it's a dict
        if isinstance(llm_json.get("essay_report"), dict):
            report = llm_json["essay_report"]
            # Ensure required fields exist in structured report
            if "overall_score" not in report or "categories" not in report or "summary" not in report:
                logger.warning("Structured report missing required fields, converting to fallback format")
                llm_json["essay_report"] = f"Structured analysis completed. Overall score: {report.get('overall_score', 'N/A')}. See detailed breakdown in categories."
        
        # Append JWT token to the response
        final_response = {
            "corrected_essay": llm_json["corrected_essay"],
            "essay_report": llm_json["essay_report"],
            "jwt_token": jwt_token,
            "token_usage": llm_response.get("token_usage", {})
        }
        
        logger.info("Essay correction completed successfully")
        logger.info(f"Corrected essay length: {len(final_response['corrected_essay'])}")
        logger.info(f"Report length: {len(final_response['essay_report'])}")
        return final_response
        
    except Exception as e:
        logger.error(f"Error in essay correction: {str(e)}", exc_info=True)
        # Return error response with original essay
        return {
            "corrected_essay": essay,
            "essay_report": f"Error occurred during correction: {str(e)}",
            "jwt_token": jwt_token,
            "error": True
        }

def validate_essay_input(essay: str) -> bool:
    """
    Validates the essay input.
    
    Args:
        essay (str): The essay text to validate
        
    Returns:
        bool: True if valid, False otherwise
    """
    logger.debug(f"Validating essay input - length: {len(essay) if essay else 0}")
    
    if not essay or not isinstance(essay, str):
        logger.warning("Essay validation failed: empty or not string")
        return False
    
    # Check minimum length (at least 10 characters)
    if len(essay.strip()) < 10:
        logger.warning(f"Essay validation failed: too short - {len(essay.strip())} characters")
        return False
    
    # Check maximum length (reasonable limit)
    if len(essay) > 10000:
        logger.warning(f"Essay validation failed: too long - {len(essay)} characters")
        return False
    
    logger.debug("Essay validation passed")
    return True

def validate_jwt_token(jwt_token: str) -> bool:
    """
    Basic JWT token validation.
    
    Args:
        jwt_token (str): The JWT token to validate
        
    Returns:
        bool: True if valid format, False otherwise
    """
    logger.debug(f"Validating JWT token - length: {len(jwt_token) if jwt_token else 0}")
    
    if not jwt_token or not isinstance(jwt_token, str):
        logger.warning("JWT validation failed: empty or not string")
        return False
    
    # Basic JWT format check (should have 3 parts separated by dots)
    parts = jwt_token.split('.')
    if len(parts) != 3:
        logger.warning(f"JWT validation failed: invalid format - {len(parts)} parts instead of 3")
        return False
    
    logger.debug("JWT validation passed")
    return True

def test_llm_connection():
    """
    Test function to verify LLM connection and response format.
    """
    test_essay = "This is a test essay with some speling errors."
    test_jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    
    logger.info("Testing LLM connection with simple essay...")
    result = correct_essay(test_essay, test_jwt)
    
    logger.info(f"Test result: {result}")
    return result
