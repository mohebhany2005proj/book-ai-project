# 🔧 Railway Deployment Troubleshooting Guide

## Critical Fix Applied ✅

**Issue Found**: Server was binding to `localhost` instead of `0.0.0.0`
**Fix**: Updated `server.ts` to bind to `0.0.0.0` (required for Railway)

---

## Step-by-Step Deployment Checklist

### 1. Push Latest Code to GitHub

```bash
cd book-ai-project
git add .
git commit -m "Fix: Bind server to 0.0.0.0 for Railway deployment"
git push origin main
```

### 2. Railway Environment Variables (REQUIRED!)

Go to Railway → Your Project → **Variables** tab

Add these **9 variables**:

```
PORT=3001
BOB_API_KEY=your-openai-api-key-here
BOB_API_URL=https://api.openai.com/v1
CHROMA_DB_PATH=./chroma_db
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
TOP_K_RESULTS=5
```

⚠️ **IMPORTANT**: Replace `your-openai-api-key-here` with your actual OpenAI API key!

### 3. Railway Persistent Volumes (REQUIRED!)

Go to Railway → Your Project → **Settings** → **Volumes**

Add **2 volumes**:

1. **Volume 1**:
   - Mount Path: `/app/backend/uploads`
   - Size: 1GB (or more)

2. **Volume 2**:
   - Mount Path: `/app/backend/chroma_db`
   - Size: 1GB (or more)

### 4. Redeploy

After adding variables and volumes:
- Railway should automatically redeploy
- OR click **"Deploy"** button manually

---

## How to Check Logs in Railway

### Method 1: Deployments Tab
1. Click **"Deployments"** tab
2. Click on the **latest deployment** (top of list)
3. View logs in the deployment details

### Method 2: Logs Tab
1. Click **"Logs"** tab (if available)
2. View real-time logs

### Method 3: Service View
1. Click your service name
2. Look for **"View Logs"** button
3. Click to see logs

---

## Common Errors and Solutions

### Error: "Application failed to respond"

**Causes**:
1. ❌ Missing environment variables
2. ❌ Server binding to localhost instead of 0.0.0.0 (FIXED!)
3. ❌ Missing volumes
4. ❌ Invalid OpenAI API key

**Solutions**:
1. ✅ Add all 9 environment variables
2. ✅ Push latest code (server.ts fixed)
3. ✅ Add 2 persistent volumes
4. ✅ Verify OpenAI API key is valid

### Error: "Build failed"

**Causes**:
1. ❌ TypeScript compilation errors
2. ❌ Missing dependencies

**Solutions**:
1. ✅ Check build logs for specific errors
2. ✅ Ensure `nixpacks.toml` is in root directory
3. ✅ Verify `package.json` has all dependencies

### Error: "Port already in use"

**Solution**:
- Railway automatically assigns a PORT
- Don't hardcode port 3001
- Use `process.env.PORT` (already configured)

### Error: "Cannot find module"

**Causes**:
1. ❌ Missing npm dependencies
2. ❌ Incorrect import paths

**Solutions**:
1. ✅ Check `package.json` dependencies
2. ✅ Verify all imports use correct paths
3. ✅ Rebuild: `npm install && npm run build`

---

## Verification Steps

### 1. Check Build Success
In Railway logs, look for:
```
✓ Build completed successfully
✓ Starting application...
```

### 2. Check Server Start
In Railway logs, look for:
```
🚀 Starting Book AI Server...
✅ Server started successfully!
📍 Server running on port: 3001
```

### 3. Test Health Endpoint
Once deployed, Railway will give you a URL like:
```
https://your-app.railway.app
```

Test it:
```bash
curl https://your-app.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-20T12:00:00.000Z",
  "uptime": 123.45
}
```

---

## What Logs Should Look Like (Success)

```
[Build Phase]
Installing dependencies...
✓ Dependencies installed
Building TypeScript...
✓ Build completed

[Deploy Phase]
Starting application...
🚀 Starting Book AI Server...
🔌 Testing Bob API connection...
✅ Bob API connected
💾 Using Simple Vector Store (JSON-based)...
✅ Server started successfully!
📍 Server running on port: 3001
🏥 Health check: /health
📚 Books API: /api/books
💬 Chat API: /api/chat
📖 Ready to process books!
```

---

## Still Having Issues?

### Get Detailed Logs

1. In Railway, go to **Deployments**
2. Click latest deployment
3. Copy **ALL logs** (from start to end)
4. Look for lines with ❌ or ERROR

### Check These Files

1. `nixpacks.toml` - Build configuration
2. `backend/package.json` - Dependencies
3. `backend/tsconfig.json` - TypeScript config
4. `backend/src/server.ts` - Server startup

### Test Locally First

Before deploying, test locally:

```bash
cd book-ai-project/backend
npm install
npm run build
npm start
```

If it works locally but not on Railway:
- Check environment variables
- Check volumes
- Check logs for specific errors

---

## Next Steps After Successful Deployment

1. ✅ Get Railway URL (e.g., `https://your-app.railway.app`)
2. ✅ Test all endpoints:
   - `/health`
   - `/api/books`
   - `/api/chat`
3. ✅ Deploy frontend to Vercel
4. ✅ Configure frontend with Railway backend URL
5. ✅ Test complete application

---

## Quick Reference

### Railway Dashboard Sections
- **Deployments**: View deployment history and logs
- **Variables**: Environment variables
- **Settings**: General settings, volumes, domains
- **Logs**: Real-time application logs
- **Metrics**: CPU, memory, network usage

### Important Files
- `nixpacks.toml`: Build configuration
- `backend/src/server.ts`: Server entry point
- `backend/package.json`: Dependencies
- `.env.example`: Environment variables template

### Support
- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- GitHub Issues: Create issue in your repo

---

**Last Updated**: 2024-01-20
**Status**: Server binding fix applied ✅