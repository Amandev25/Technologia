#!/bin/bash

# Deployment script for Google Cloud Run
# This script automates the deployment process

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Conversational Bot - Cloud Run Deploy${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}Error: No GCP project set${NC}"
    echo "Set it with: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo -e "${GREEN}✓ GCP Project: $PROJECT_ID${NC}"

# Get Gemini API Key
if [ -z "$GEMINI_API_KEY" ]; then
    echo -e "${RED}Error: GEMINI_API_KEY environment variable not set${NC}"
    echo "Set it with: export GEMINI_API_KEY='your_api_key_here'"
    exit 1
fi

echo -e "${GREEN}✓ Gemini API Key configured${NC}"

# Configuration
SERVICE_NAME="conversational-bot-api"
REGION="us-central1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo ""
echo -e "${BLUE}Configuration:${NC}"
echo "  Service Name: $SERVICE_NAME"
echo "  Region: $REGION"
echo "  Image: $IMAGE_NAME"
echo ""

# Confirm deployment
read -p "Deploy to Cloud Run? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 0
fi

# Enable required APIs
echo -e "${BLUE}Enabling required APIs...${NC}"
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    containerregistry.googleapis.com \
    --project=$PROJECT_ID

echo -e "${GREEN}✓ APIs enabled${NC}"

# Build and deploy using Cloud Build
echo ""
echo -e "${BLUE}Building and deploying with Cloud Build...${NC}"
gcloud builds submit \
    --config=cloudbuild.yaml \
    --substitutions=_GEMINI_API_KEY="$GEMINI_API_KEY" \
    --project=$PROJECT_ID

echo ""
echo -e "${GREEN}✓ Deployment complete!${NC}"

# Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)' --project=$PROJECT_ID)

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Deployment Successful!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}Service URL:${NC} $SERVICE_URL"
echo ""
echo -e "${BLUE}API Endpoints:${NC}"
echo "  Health Check:     $SERVICE_URL/api/health"
echo "  Start Conversation: $SERVICE_URL/api/start_conversation"
echo "  Generate Response:  $SERVICE_URL/api/generate_response"
echo "  Generate Report:    $SERVICE_URL/api/generate_report"
echo ""
echo -e "${BLUE}Test the API:${NC}"
echo "  curl $SERVICE_URL/api/health"
echo ""
echo -e "${BLUE}Update frontend API_URL in web_ui/app.js:${NC}"
echo "  const API_URL = '$SERVICE_URL/api';"
echo ""
