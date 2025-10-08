# Cloud Run Deployment - Quick Reference

## 📁 Required Directory Structure

Before deployment, your `cloud_deploy/` directory should contain:

```
conversational_bot/
└── cloud_deploy/
    ├── app.py                      # ✓ Main Flask API (created)
    ├── Dockerfile                  # ✓ Container config (created)
    ├── requirements.txt            # ✓ Dependencies (created)
    ├── config.py                   # ✓ Cloud config (created)
    ├── cloudbuild.yaml            # ✓ Build config (created)
    ├── .gcloudignore              # ✓ Ignore file (created)
    ├── .dockerignore              # ✓ Docker ignore (created)
    ├── deploy.sh                  # ✓ Deploy script (created)
    ├── deploy.bat                 # ✓ Windows deploy (created)
    ├── copy_files.py              # ✓ Helper script (created)
    ├── DEPLOYMENT_GUIDE.md        # ✓ Full guide (created)
    ├── README.md                  # ✓ This file
    │
    ├── conversation_manager.py    # ⚠️ COPY from parent directory
    ├── llm_manager.py            # ⚠️ COPY from parent directory
    └── report_generator.py       # ⚠️ COPY from parent directory
```

## 🚀 Quick Start (5 Steps)

### Step 1: Copy Required Files

**Manual Copy (Windows):**
```cmd
copy ..\conversation_manager.py .
copy ..\llm_manager.py .
copy ..\report_generator.py .
```

**Or use Python script:**
```cmd
python copy_files.py
```

**Linux/Mac:**
```bash
cp ../conversation_manager.py .
cp ../llm_manager.py .
cp ../report_generator.py .
```

### Step 2: Install Google Cloud SDK

Download and install from: https://cloud.google.com/sdk/docs/install

**Verify installation:**
```bash
gcloud --version
```

### Step 3: Set Up GCP

```bash
# Login to Google Cloud
gcloud auth login

# Create or select project
gcloud projects create my-conversational-bot  # Optional: create new project
gcloud config set project YOUR_PROJECT_ID

# Enable billing (required for Cloud Run)
# Visit: https://console.cloud.google.com/billing
```

### Step 4: Set Environment Variable

**Linux/Mac:**
```bash
export GEMINI_API_KEY="AIzaSyD8JukG-b9dYHtu7U9ffdafAOlvKm24LgY"
```

**Windows:**
```cmd
set GEMINI_API_KEY=AIzaSyD8JukG-b9dYHtu7U9ffdafAOlvKm24LgY
```

### Step 5: Deploy!

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Windows:**
```cmd
deploy.bat
```

## 📋 Pre-Deployment Checklist

- [ ] Google Cloud SDK installed
- [ ] Authenticated with `gcloud auth login`
- [ ] Project created and billing enabled
- [ ] Gemini API key obtained
- [ ] Files copied to cloud_deploy directory:
  - [ ] conversation_manager.py
  - [ ] llm_manager.py  
  - [ ] report_generator.py
- [ ] GEMINI_API_KEY environment variable set
- [ ] All deployment files present (see structure above)

## 🔍 Verify Files Before Deploy

```bash
# Check all required files exist
ls -la

# Should see:
# - app.py
# - Dockerfile
# - requirements.txt
# - config.py
# - cloudbuild.yaml
# - conversation_manager.py
# - llm_manager.py
# - report_generator.py
```

## 🌐 After Deployment

### Get Your API URL

```bash
gcloud run services describe conversational-bot-api \
  --region us-central1 \
  --format='value(status.url)'
```

Example output: `https://conversational-bot-api-xxxxx-uc.a.run.app`

### Test the API

```bash
# Test health check
curl https://your-service-url.run.app/api/health

# Test conversation (should return JSON)
curl -X POST https://your-service-url.run.app/api/start_conversation \
  -H "Content-Type: application/json" \
  -d '{"scenario":"coffee_shop","session_id":"test123"}'
```

### Update Frontend

Edit `web_ui/app.js` line 10:

```javascript
// Before:
const API_URL = 'http://localhost:5000/api';

// After:
const API_URL = 'https://your-service-url.run.app/api';
```

## 💰 Cost Information

**Free Tier (monthly):**
- 2 million requests
- 360,000 GB-seconds
- 180,000 vCPU-seconds

**For typical usage (1000 users/day):**
- ~30,000 requests/month
- **Cost: $0** (within free tier)

## 🔧 Common Issues & Solutions

### Issue: "gcloud: command not found"
**Solution:** Install Google Cloud SDK from https://cloud.google.com/sdk/docs/install

### Issue: "ERROR: (gcloud.builds.submit) PERMISSION_DENIED"
**Solution:**
```bash
# Enable required APIs
gcloud services enable cloudbuild.googleapis.com run.googleapis.com
```

### Issue: "Build failed: requirements.txt not found"
**Solution:** Ensure you're in the `cloud_deploy/` directory when running deploy script

### Issue: "API returns 500 error"
**Solution:** 
1. Check logs: `gcloud run services logs tail conversational-bot-api`
2. Verify GEMINI_API_KEY is set correctly
3. Ensure all Python files are copied

### Issue: Files not copied
**Solution:** Run from cloud_deploy directory:
```bash
python copy_files.py
```

## 📊 View Logs

```bash
# Stream logs in real-time
gcloud run services logs tail conversational-bot-api \
  --region us-central1

# View in Cloud Console
https://console.cloud.google.com/logs
```

## 🔄 Update Deployment

After making changes:

```bash
# Simply run deploy script again
./deploy.sh  # Linux/Mac
deploy.bat   # Windows
```

Cloud Run automatically handles versioning and traffic routing.

## 🛑 Delete Service (Stop Charges)

```bash
gcloud run services delete conversational-bot-api \
  --region us-central1
```

## 📚 Documentation Links

- **Full Deployment Guide:** See `DEPLOYMENT_GUIDE.md`
- **Cloud Run Docs:** https://cloud.google.com/run/docs
- **Gemini API:** https://makersuite.google.com/app/apikey
- **GCP Console:** https://console.cloud.google.com

## 🆘 Need Help?

1. Read `DEPLOYMENT_GUIDE.md` for detailed instructions
2. Check Cloud Run logs for errors
3. Verify all files are present
4. Ensure environment variables are set
5. Test locally first with Docker (optional)

## ✅ Success Indicators

After deployment, you should see:

1. ✅ "Deployment Successful!" message
2. ✅ Service URL provided
3. ✅ Health check returns `{"status": "healthy"}`
4. ✅ No errors in logs
5. ✅ Frontend can connect to API

## 🎯 Next Steps After Deployment

1. Test all API endpoints
2. Update frontend with new API_URL
3. Set up monitoring and alerts
4. Configure custom domain (optional)
5. Enable authentication (optional)
6. Set up CI/CD (optional)

---

**Questions?** Check `DEPLOYMENT_GUIDE.md` for comprehensive documentation.
