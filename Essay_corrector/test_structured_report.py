#!/usr/bin/env python3
"""
Test script for the new structured report format
"""

import json
import os
from essay_corrector import correct_essay

def test_structured_report():
    """Test the new structured report format with sample essays"""
    
    # Test essays with different types of errors
    test_essays = [
        {
            "name": "Basic Spelling and Grammar Errors",
            "text": "I have a recieve problem with my seperate files. It need to be corected. The teecher says that consistency helps."
        },
        {
            "name": "Complex Essay with Multiple Issues",
            "text": "Learning is reely importent for every one. You shud always tri to get nu knowledge, becaus it makes you smert. For exampel, I lerned how too bake a choklat kake last week. It was difikult at first, but know I practice every day! My teecher says that consistency helps. It is esential to keep your brane active, or it will become lazzy. We must nevver stop questing and exploring the world. Their is so much too see, and reading books is one way too sea it. This is why I think edjucashun is the best thing, for peeple. It gives oppertunities."
        },
        {
            "name": "Well-Written Essay (Few Errors)",
            "text": "Education is the foundation of personal and societal growth. Through learning, individuals develop critical thinking skills, expand their knowledge base, and prepare for future challenges. Schools provide structured environments where students can explore various subjects and discover their interests. Teachers play a crucial role in guiding students' educational journeys and fostering a love for learning."
        }
    ]
    
    # Sample JWT token
    jwt_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    
    print("Testing Structured Report Format")
    print("=" * 50)
    
    for i, test_case in enumerate(test_essays, 1):
        print(f"\nTest {i}: {test_case['name']}")
        print("-" * 30)
        print(f"Original: {test_case['text'][:100]}...")
        
        try:
            # Call the essay correction function
            result = correct_essay(test_case['text'], jwt_token)
            
            # Check if we got a structured report
            if isinstance(result.get('essay_report'), dict):
                report = result['essay_report']
                print(f"SUCCESS: Structured report received!")
                print(f"Overall Score: {report.get('overall_score', 'N/A')}/100")
                
                if 'categories' in report:
                    print("Categories:")
                    for category, data in report['categories'].items():
                        print(f"  - {category.title()}: {data.get('score', 'N/A')}/100")
                        if data.get('errors_found', 0) > 0:
                            print(f"    Errors found: {data['errors_found']}")
                
                if 'summary' in report:
                    summary = report['summary']
                    print(f"Summary:")
                    print(f"  - Total errors: {summary.get('total_errors', 'N/A')}")
                    print(f"  - Strengths: {len(summary.get('strengths', []))}")
                    print(f"  - Areas for improvement: {len(summary.get('areas_for_improvement', []))}")
                
                # Save detailed result to file
                filename = f"test_result_{i}_{test_case['name'].replace(' ', '_').lower()}.json"
                with open(filename, 'w') as f:
                    json.dump(result, f, indent=2)
                print(f"Detailed result saved to: {filename}")
                
            else:
                print("WARNING: Legacy string format received")
                print(f"Report: {result.get('essay_report', 'No report')[:200]}...")
            
            print(f"Test {i} completed successfully")
            
        except Exception as e:
            print(f"ERROR: Test {i} failed: {str(e)}")
    
    print("\n" + "=" * 50)
    print("Testing completed!")

if __name__ == "__main__":
    # Check if Google API key is set
    if not os.getenv("GOOGLE_API_KEY"):
        print("ERROR: GOOGLE_API_KEY environment variable not set")
        print("Please set your Google AI API key:")
        print("export GOOGLE_API_KEY='your_api_key_here'")
        exit(1)
    
    test_structured_report()
