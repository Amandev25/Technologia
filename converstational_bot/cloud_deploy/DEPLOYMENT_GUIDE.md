# Google Cloud Run Deployment Guide

## 📋 Prerequisites

1. **Google Cloud Account**
   - Active GCP account
   - Billing enabled
   - Project created

2. **Google Cloud SDK (gcloud)**
   - Install from: https://cloud.google.com/sdk/docs/install
   - Authenticate: `gcloud auth login`
   - Set project: `gcloud config set project YOUR_PROJECT_ID`

3. **Gemini API Key**
   - Get from: https://makersuite.google.com/app/apikey
   - Keep it ready for deployment

## 📁 Directory Structure

```
conversational_bot/
└── cloud_deploy/              # Deployment directory
    ├── app.py                 # Main Flask API (production)
    ├── Dockerfile            # Container configuration
    ├── requirements.txt      # Python dependencies
    ├── config.py            # Cloud configuration
    ├── cloudbuild.yaml      # Cloud Build config
    ├── .gcloudignore        # Files to ignore
    ├── .dockerignore        # Docker ignore
    ├── deploy.sh            # Deployment script (Linux/Mac)
    ├── deploy.bat           # Deployment script (Windows)
    ├── DEPLOYMENT_GUIDE.md  # This file
    ├── conversation_manager.py  # (copied)
    ├── llm_manager.py          # (copied)
    └── report_generator.py     # (copied)
```

## 🚀 Deployment Steps

### Step 1: Prepare Files

Copy required Python modules to `cloud_deploy/`:

```bash
# From conversational_bot directory
cd cloud_deploy

# Copy required modules
cp ../conversation_manager.py .
cp ../llm_manager.py .
cp ../report_generator.py .
```

### Step 2: Set Environment Variables

**Linux/Mac:**
```bash
export GEMINI_API_KEY="your_actual_gemini_api_key_here"
export GOOGLE_CLOUD_PROJECT="your-gcp-project-id"
```

**Windows:**
```cmd
set GEMINI_API_KEY=your_actual_gemini_api_key_here
set GOOGLE_CLOUD_PROJECT=your-gcp-project-id
```

### Step 3: Authenticate with GCP

```bash
# Login to Google Cloud
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Verify configuration
gcloud config list
```

### Step 4: Deploy to Cloud Run

**Option A: Automated Deployment (Recommended)**

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Windows:**
```cmd
deploy.bat
```

**Option B: Manual Deployment**

```bash
# 1. Enable required APIs
gcloud services enable cloudbuild.googleapis.com run.googleapis.com

# 2. Build and deploy with Cloud Build
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions=_GEMINI_API_KEY="$GEMINI_API_KEY"

# 3. Or build and deploy separately
# Build the image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/conversational-bot-api

# Deploy to Cloud Run
gcloud run deploy conversational-bot-api \
  --image gcr.io/YOUR_PROJECT_ID/conversational-bot-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="$GEMINI_API_KEY"
```

### Step 5: Get Service URL

```bash
gcloud run services describe conversational-bot-api \
  --region us-central1 \
  --format='value(status.url)'
```

You'll get a URL like: `https://conversational-bot-api-xxxxx-uc.a.run.app`

### Step 6: Test the Deployment

```bash
# Test health endpoint
curl https://your-service-url.run.app/api/health

# Test start conversation
curl -X POST https://your-service-url.run.app/api/start_conversation \
  -H "Content-Type: application/json" \
  -d '{"scenario":"coffee_shop","session_id":"test123"}'
```

### Step 7: Update Frontend

Update `web_ui/app.js` line 10:

```javascript
const API_URL = 'https://your-service-url.run.app/api';
```

## 🔧 Configuration

### Environment Variables

Set via Cloud Run console or gcloud:

```bash
gcloud run services update conversational-bot-api \
  --region us-central1 \
  --set-env-vars GEMINI_API_KEY="your_key" \
  --set-env-vars MAX_CONVERSATION_TURNS="6"
```

### Resource Limits

Configure in Cloud Run:
- **Memory:** 512MB - 2GB (recommended: 1GB)
- **CPU:** 1-4 (recommended: 2)
- **Timeout:** 60-300 seconds (recommended: 120s)
- **Concurrency:** 1-1000 (recommended: 80)

Update via gcloud:

```bash
gcloud run services update conversational-bot-api \
  --region us-central1 \
  --memory 1Gi \
  --cpu 2 \
  --timeout 120s \
  --concurrency 80
```

### Scaling

```bash
# Set min/max instances
gcloud run services update conversational-bot-api \
  --region us-central1 \
  --min-instances 0 \
  --max-instances 10
```

## 🔐 Security

### API Authentication (Optional)

To require authentication:

```bash
# Deploy with authentication required
gcloud run deploy conversational-bot-api \
  --image gcr.io/YOUR_PROJECT_ID/conversational-bot-api \
  --platform managed \
  --region us-central1 \
  --no-allow-unauthenticated
```

Then access with:
```bash
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  https://your-service-url.run.app/api/health
```

### CORS Configuration

Update allowed origins in `app.py`:

```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://your-frontend-domain.com"],  # Your frontend URL
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})
```

### Secrets Management (Recommended)

Use Google Secret Manager for API keys:

```bash
# Create secret
echo -n "your-gemini-api-key" | gcloud secrets create gemini-api-key --data-file=-

# Grant Cloud Run access
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member=serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor

# Deploy with secret
gcloud run deploy conversational-bot-api \
  --image gcr.io/YOUR_PROJECT_ID/conversational-bot-api \
  --set-secrets=GEMINI_API_KEY=gemini-api-key:latest
```

## 📊 Monitoring

### View Logs

```bash
# Stream logs
gcloud run services logs tail conversational-bot-api --region us-central1

# View in Cloud Console
https://console.cloud.google.com/logs
```

### Metrics

View in Cloud Console:
- Request count
- Request latency
- Error rate
- CPU/Memory usage

## 💰 Cost Estimation

### Cloud Run Pricing (approximate)

**Free Tier (per month):**
- 2 million requests
- 360,000 GB-seconds
- 180,000 vCPU-seconds

**Beyond free tier:**
- Requests: $0.40 per million
- Memory: $0.0000025 per GB-second
- CPU: $0.00001 per vCPU-second

**Example cost (1000 users/day):**
- ~30,000 requests/month
- **Cost: FREE** (within free tier)

## 🔄 Updates & Redeployment

### Update Code

1. Make changes to `app.py` or other files
2. Run deployment script again:
   ```bash
   ./deploy.sh
   ```

### Rollback to Previous Version

```bash
# List revisions
gcloud run revisions list --service conversational-bot-api

# Rollback to specific revision
gcloud run services update-traffic conversational-bot-api \
  --to-revisions REVISION_NAME=100
```

## 🐛 Troubleshooting

### Issue: Build Fails

**Solution:**
- Check Dockerfile syntax
- Verify requirements.txt has all dependencies
- Check Cloud Build logs

### Issue: Deployment Succeeds but API Returns 500

**Solution:**
- Check Cloud Run logs: `gcloud run services logs tail`
- Verify GEMINI_API_KEY is set correctly
- Check all required files are copied

### Issue: CORS Errors

**Solution:**
- Ensure Flask-CORS is installed
- Update CORS origins in app.py
- Check browser console for specific errors

### Issue: Timeout Errors

**Solution:**
- Increase timeout: `--timeout 300s`
- Optimize LLM response generation
- Add caching if applicable

## 📝 Checklist

- [ ] GCP account with billing enabled
- [ ] gcloud CLI installed and authenticated
- [ ] Gemini API key obtained
- [ ] All files copied to cloud_deploy/
- [ ] Environment variables set
- [ ] APIs enabled (Cloud Build, Cloud Run)
- [ ] Deployment script executed
- [ ] Service URL obtained
- [ ] Health check successful
- [ ] Frontend API_URL updated
- [ ] CORS configured for frontend domain
- [ ] Monitoring set up

## 🚀 Production Recommendations

1. **Use Secret Manager** for API keys
2. **Enable authentication** for production
3. **Set up custom domain** for cleaner URLs
4. **Configure CORS** for specific domains only
5. **Enable logging** and monitoring
6. **Set up alerts** for errors and high latency
7. **Implement rate limiting** to prevent abuse
8. **Use CDN** for frontend static files
9. **Regular backups** of conversation data
10. **Load testing** before going live

## 📚 Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Container Registry](https://cloud.google.com/container-registry/docs)
- [Cloud Build](https://cloud.google.com/build/docs)
- [Secret Manager](https://cloud.google.com/secret-manager/docs)
- [Flask on Cloud Run](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-python-service)

## 🆘 Support

For deployment issues:
1. Check Cloud Run logs
2. Review Cloud Build history
3. Verify environment variables
4. Test locally with Docker first
5. Consult GCP documentation

## ✅ Success!

After successful deployment:
- ✅ API is live at: `https://your-service.run.app`
- ✅ Health check works: `/api/health`
- ✅ Frontend connected
- ✅ Monitoring enabled
- ✅ Ready for production! 🎉
