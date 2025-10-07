# Essay Corrector API

A FastAPI-based service that uses Google's Gemini 2.0 Flash model to correct essays, identify spelling and grammatical errors, and provide detailed reports.

## Features

- **Essay Correction**: Automatically corrects spelling and grammatical errors
- **Detailed Reports**: Provides comprehensive analysis of mistakes and corrections
- **JWT Authentication**: Supports JWT token validation
- **FastAPI Integration**: RESTful API with automatic documentation
- **Error Handling**: Robust error handling and validation
- **Token Usage Tracking**: Monitors LLM token consumption

## Installation

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

2. Set up your Google AI API key:
```bash
export GOOGLE_API_KEY="your_api_key_here"
```

## Usage

### Starting the Server

```bash
python main.py
```

The API will be available at `http://localhost:8000`

### API Documentation

Once the server is running, you can access:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Main Endpoint

#### POST `/correct-essay`

Corrects an essay and returns the corrected version with a detailed report.

**Request Body:**
```json
{
    "essay": "This is a sample essay with some speling errors and gramatical mistakes.",
    "jwt_token": "your_jwt_token_here"
}
```

**Response:**
```json
{
    "corrected_essay": "This is a sample essay with some spelling errors and grammatical mistakes.",
    "essay_report": "Found 2 spelling errors: 'speling' should be 'spelling', 'gramatical' should be 'grammatical'. Found 1 grammatical error: 'mistakes' should be 'mistake' (subject-verb agreement). Overall essay quality: Good structure but needs attention to spelling and grammar.",
    "jwt_token": "your_jwt_token_here",
    "token_usage": {
        "prompt_tokens": 150,
        "completion_tokens": 200
    }
}
```

### Other Endpoints

#### GET `/`
Health check endpoint

#### GET `/health`
Detailed health check

#### POST `/validate-inputs`
Validate essay and JWT token format without processing

### Direct Function Usage

You can also use the correction function directly:

```python
from essay_corrector import correct_essay

result = correct_essay("Your essay text here", "your_jwt_token")
print(result['corrected_essay'])
print(result['essay_report'])
```

## Configuration

### Environment Variables

- `GOOGLE_API_KEY`: Your Google AI API key (required)

### Model Configuration

The system uses Gemini 2.0 Flash with the following configuration:
- Temperature: 0.0 (deterministic output)
- Top-p: 1.0
- Top-k: 1
- Max output tokens: 4096

## Error Handling

The API includes comprehensive error handling:

- **Input Validation**: Essay length (10-10000 characters) and JWT format validation
- **LLM Errors**: Graceful handling of API failures
- **JSON Parsing**: Fallback responses for malformed LLM outputs
- **HTTP Errors**: Proper status codes and error messages

## Example Usage

See `example_usage.py` for comprehensive examples including:
- Direct function usage
- API endpoint usage
- Validation endpoint usage
- Error handling examples

## Response Format

The API returns responses in the following format:

```json
{
    "corrected_essay": "string",
    "essay_report": "string", 
    "jwt_token": "string",
    "token_usage": {
        "prompt_tokens": "number",
        "completion_tokens": "number"
    },
    "error": "boolean (optional)"
}
```

## Development

### Running Tests

```bash
python -m pytest tests/
```

### Code Style

The code follows PEP 8 standards and includes type hints for better maintainability.

## Security Considerations

- JWT tokens are validated for format but not cryptographically verified
- For production use, implement proper JWT verification
- Configure CORS settings appropriately for your environment
- Consider rate limiting for production deployment

## License

This project is part of a hackathon submission.
