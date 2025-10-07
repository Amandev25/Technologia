from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
import logging
from essay_corrector import correct_essay, validate_essay_input, validate_jwt_token

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

# Initialize FastAPI app
app = FastAPI(
    title="Essay Corrector API",
    description="An API for correcting essays using AI with JWT authentication",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class EssayCorrectionRequest(BaseModel):
    essay: str = Field(..., description="The essay text to be corrected", min_length=10, max_length=10000)
    jwt_token: str = Field(..., description="JWT token for authentication")

    class Config:
        json_schema_extra = {
            "example": {
                "essay": "This is a sample essay with some speling errors and gramatical mistakes. It need to be corected.",
                "jwt_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
            }
        }

class EssayCorrectionResponse(BaseModel):
    corrected_essay: str = Field(..., description="The corrected version of the essay")
    essay_report: str = Field(..., description="Detailed report of mistakes and corrections")
    jwt_token: str = Field(..., description="The JWT token that was provided")
    token_usage: Optional[Dict[str, int]] = Field(None, description="Token usage statistics from LLM")
    error: Optional[bool] = Field(False, description="Indicates if an error occurred")

    class Config:
        json_schema_extra = {
            "example": {
                "corrected_essay": "This is a sample essay with some spelling errors and grammatical mistakes. It needs to be corrected.",
                "essay_report": "Found 2 spelling errors: 'speling' should be 'spelling', 'gramatical' should be 'grammatical'. Found 1 grammatical error: 'need' should be 'needs' (subject-verb agreement). Overall essay quality: Good structure but needs attention to spelling and grammar.",
                "jwt_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
                "token_usage": {
                    "prompt_tokens": 150,
                    "completion_tokens": 200
                },
                "error": False
            }
        }

class ErrorResponse(BaseModel):
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Additional error details")

# Health check endpoint
@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint"""
    logger.info("Health check endpoint accessed")
    return {"message": "Essay Corrector API is running!", "status": "healthy"}

@app.get("/health", tags=["Health"])
async def health_check():
    """Detailed health check endpoint"""
    logger.info("Detailed health check endpoint accessed")
    return {
        "status": "healthy",
        "service": "Essay Corrector API",
        "version": "1.0.0"
    }

# Main essay correction endpoint
@app.post(
    "/correct-essay",
    response_model=EssayCorrectionResponse,
    status_code=status.HTTP_200_OK,
    tags=["Essay Correction"],
    summary="Correct an essay",
    description="Takes an essay and JWT token, returns corrected essay with detailed report"
)
async def correct_essay_endpoint(request: EssayCorrectionRequest):
    """
    Correct an essay using AI and return the corrected version with a detailed report.
    
    - **essay**: The essay text to be corrected (10-10000 characters)
    - **jwt_token**: JWT token for authentication
    
    Returns:
    - **corrected_essay**: The corrected version of the essay
    - **essay_report**: Detailed report of mistakes and corrections
    - **jwt_token**: The provided JWT token
    - **token_usage**: Token usage statistics from the LLM
    """
    try:
        logger.info(f"Received essay correction request for essay of length: {len(request.essay)}")
        logger.info(f"JWT token length: {len(request.jwt_token)}")
        logger.debug(f"Essay preview: {request.essay[:100]}...")
        
        # Validate inputs
        logger.info("Starting input validation")
        if not validate_essay_input(request.essay):
            logger.warning(f"Invalid essay input - length: {len(request.essay)}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid essay input. Essay must be between 10 and 10000 characters."
            )
        
        if not validate_jwt_token(request.jwt_token):
            logger.warning("Invalid JWT token format")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid JWT token format."
            )
        
        logger.info("Input validation passed")
        
        # Call the essay correction function
        logger.info("Calling essay correction function")
        result = correct_essay(request.essay, request.jwt_token)
        
        # Check if there was an error in the correction process
        if result.get("error", False):
            logger.warning("Essay correction completed with errors")
            logger.warning(f"Error details: {result.get('essay_report', 'No error details')}")
            return EssayCorrectionResponse(**result)
        
        logger.info("Essay correction completed successfully")
        logger.info(f"Token usage: {result.get('token_usage', 'Not available')}")
        return EssayCorrectionResponse(**result)
        
    except HTTPException as he:
        # Re-raise HTTP exceptions
        logger.warning(f"HTTP exception raised: {he.status_code} - {he.detail}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error in essay correction endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

# Debug endpoint
@app.post(
    "/debug-llm",
    tags=["Debug"],
    summary="Debug LLM response",
    description="Test LLM connection and response format"
)
async def debug_llm_endpoint():
    """
    Debug endpoint to test LLM responses.
    """
    try:
        logger.info("Debug LLM endpoint accessed")
        from essay_corrector import test_llm_connection
        result = test_llm_connection()
        logger.info(f"Debug test completed: {result}")
        return result
    except Exception as e:
        logger.error(f"Debug test failed: {str(e)}", exc_info=True)
        return {"error": str(e), "debug": True}

# Validation endpoint
@app.post(
    "/validate-inputs",
    tags=["Validation"],
    summary="Validate essay and JWT token",
    description="Validate essay text and JWT token format without processing"
)
async def validate_inputs(request: EssayCorrectionRequest):
    """
    Validate essay text and JWT token format.
    
    Returns validation results without processing the essay.
    """
    try:
        logger.info("Validation endpoint accessed")
        logger.info(f"Validating essay of length: {len(request.essay)}")
        logger.info(f"Validating JWT token of length: {len(request.jwt_token)}")
        
        essay_valid = validate_essay_input(request.essay)
        jwt_valid = validate_jwt_token(request.jwt_token)
        
        logger.info(f"Validation results - Essay valid: {essay_valid}, JWT valid: {jwt_valid}")
        
        result = {
            "essay_valid": essay_valid,
            "jwt_valid": jwt_valid,
            "all_valid": essay_valid and jwt_valid,
            "essay_length": len(request.essay) if request.essay else 0,
            "jwt_parts": len(request.jwt_token.split('.')) if request.jwt_token else 0
        }
        
        logger.info(f"Validation completed successfully: {result}")
        return result
        
    except Exception as e:
        logger.error(f"Error in validation endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Validation error: {str(e)}"
        )

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    logger.warning(f"HTTP Exception: {exc.status_code} - {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc),
            "status_code": 500
        }
    )

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting Essay Corrector API server")
    logger.info(f"Log file: {log_filename}")
    uvicorn.run(app, host="0.0.0.0", port=8000)
