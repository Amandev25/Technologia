#!/usr/bin/env python3
"""
Test script to verify logging functionality
"""

import os
import sys
from datetime import datetime

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_logging():
    """Test the logging functionality"""
    
    print("Testing logging functionality...")
    
    # Test essay_corrector logging
    try:
        from essay_corrector import validate_essay_input, validate_jwt_token, logger as essay_logger
        
        print("Successfully imported essay_corrector module")
        
        # Test validation functions
        print("\nTesting essay validation...")
        result1 = validate_essay_input("This is a test essay with proper length.")
        print(f"   Valid essay test: {result1}")
        
        result2 = validate_essay_input("Short")
        print(f"   Invalid essay test: {result2}")
        
        print("\nTesting JWT validation...")
        valid_jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
        result3 = validate_jwt_token(valid_jwt)
        print(f"   Valid JWT test: {result3}")
        
        result4 = validate_jwt_token("invalid.jwt")
        print(f"   Invalid JWT test: {result4}")
        
        # Test main module logging
        print("\nTesting main module logging...")
        try:
            from main import logger as main_logger
            main_logger.info("Test log message from main module")
            print("Main module logging working")
        except Exception as e:
            print(f"Main module logging error: {e}")
        
        print("\nAll logging tests completed!")
        
        # Check if log file was created
        log_file = f"logs/essay_corrector_{datetime.now().strftime('%Y%m%d')}.log"
        if os.path.exists(log_file):
            print(f"Log file created: {log_file}")
            with open(log_file, 'r') as f:
                lines = f.readlines()
                print(f"Log file contains {len(lines)} lines")
        else:
            print("Log file not found")
            
    except Exception as e:
        print(f"Error testing logging: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_logging()
