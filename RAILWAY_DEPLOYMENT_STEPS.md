# 🚂 Railway Backend Deployment - Step-by-Step Guide

Follow these exact steps to deploy your backend to Railway.

---

## Step 1: Create Railway Account (2 minutes)

1. Open your browser and go to: **https://railway.app**

2. Click the **"Login"** button (top right corner)

3. Click **"Login with GitHub"**

4. GitHub will ask for permission - Click **"Authorize Railway"**

5. You'll be redirected to Railway dashboard

✅ **You're now logged into Railway!**

---

## Step 2: Create New Project (1 minute)

1. On Railway dashboard, click the **"New Project"** button (big purple button)

2. A menu will appear - Click **"Deploy from GitHub repo"**

3. You'll see a list of your GitHub repositories

4. Find and click on **"book-ai-project"**

5. Railway will start analyzing your repository

✅ **Railway has connected to your GitHub repo!**

---

## Step 3: Configure Root Directory (IMPORTANT!)

After Railway analyzes your repo, you'll see a deployment screen.

### 3.1 Set Root Directory

1. Look for **"Settings"** tab (left sidebar or top menu)

2. Click on **"Settings"**

3. Scroll down to find **"Root Directory"** section

4. Click on the **"Root Directory"** field

5. Type: `backend`

6. Press **Enter** or click outside the field to save

**Why?** Your project has both frontend and backend folders. Railway needs to know to deploy only the backend folder.

✅ **Root directory set to backend!**

---

## Step 4: Configure Build Command

Still in the Settings page:

1. Scroll to find **"Build Command"** section

2. Click on the **"Build Command"** field

3. Type exactly: `npm install && npm run build`

4. Press **Enter** to save

**What this does:**
- `npm install` - Installs all dependencies
- `&&` - Then (after install succeeds)
- `npm run build` - Compiles TypeScript to JavaScript

✅ **Build command configured!**

---

## Step 5: Configure Start Command

Still in the Settings page:

1. Scroll to find **"Start Command"** section

2. Click on the **"Start Command"** field

3. Type exactly: `npm start`

4. Press **Enter** to save

**What this does:**
- Runs the compiled JavaScript code from the `dist` folder

✅ **Start command configured!**

---

## Step 6: Add Environment Variables (CRITICAL!)

This is the most important step - your app won't work without these!

1. In Settings, scroll to find **"Variables"** section

2. Click **"+ New Variable"** button

3. Add each variable one by one:

### Variable 1: PORT
- **Variable Name**: `PORT`
- **Value**: `3001`
- Click **"Add"**

### Variable 2: BOB_API_KEY (YOUR OPENAI KEY!)
- **Variable Name**: `BOB_API_KEY`
- **Value**: `your_actual_openai_api_key_here`
- **IMPORTANT**: Use your REAL OpenAI API key from your `.env` file!
- Click **"Add"**

### Variable 3: BOB_API_URL
- **Variable Name**: `BOB_API_URL`
- **Value**: `https://api.openai.com/v1`
- Click **"Add"**

### Variable 4: CHROMA_DB_PATH
- **Variable Name**: `CHROMA_DB_PATH`
- **Value**: `./chroma_db`
- Click **"Add"**

### Variable 5: UPLOAD_DIR
- **Variable Name**: `UPLOAD_DIR`
- **Value**: `./uploads`
- Click **"Add"**

### Variable 6: MAX_FILE_SIZE
- **Variable Name**: `MAX_FILE_SIZE`
- **Value**: `52428800`
- Click **"Add"**

### Variable 7: CHUNK_SIZE
- **Variable Name**: `CHUNK_SIZE`
- **Value**: `1000`
- Click **"Add"**

### Variable 8: CHUNK_OVERLAP
- **Variable Name**: `CHUNK_OVERLAP`
- **Value**: `200`
- Click **"Add"**

### Variable 9: TOP_K_RESULTS
- **Variable Name**: `TOP_K_RESULTS`
- **Value**: `5`
- Click **"Add"**

### Variable 10: NODE_OPTIONS
- **Variable Name**: `NODE_OPTIONS`
- **Value**: `--max-old-space-size=4096`
- Click **"Add"**

✅ **All environment variables added!**

---

## Step 7: Add Persistent Storage (CRITICAL!)

Without this, your uploaded books will disappear when Railway restarts!

1. In Settings, scroll to find **"Volumes"** section

2. Click **"+ New Volume"** button

### Volume 1: Uploads
- **Mount Path**: `/app/uploads`
- Click **"Add"**

3. Click **"+ New Volume"** button again

### Volume 2: Database
- **Mount Path**: `/app/chroma_db`
- Click **"Add"**

**What this does:**
- Saves uploaded books permanently
- Saves vector database permanently
- Data persists even after redeployments

✅ **Persistent storage configured!**

---

## Step 8: Deploy!

1. Railway should automatically start deploying after you save settings

2. If not, click **"Deploy"** button (top right)

3. You'll see deployment logs scrolling

4. Wait 2-5 minutes for deployment to complete

5. Look for messages like:
   ```
   ✅ Build successful
   ✅ Deployment successful
   ```

✅ **Backend is deploying!**

---

## Step 9: Get Your Backend URL

1. Go to **"Settings"** tab

2. Scroll to **"Networking"** section

3. Click **"Generate Domain"** button

4. Railway will create a URL like:
   ```
   https://book-ai-backend-production-xxxx.up.railway.app
   ```

5. **COPY THIS URL** - You'll need it for Vercel!

6. Test it by visiting: `YOUR_URL/health`
   - You should see: `{"status":"ok",...}`

✅ **Backend is live!**

---

## Step 10: Verify Deployment

Test your backend:

1. Open browser and go to: `YOUR_RAILWAY_URL/api/books`

2. You should see: `[]` (empty array)

3. This means your backend is working!

✅ **Backend deployment complete!**

---

## 🎉 Success Checklist

- [ ] Railway account created
- [ ] Project created from GitHub
- [ ] Root directory set to `backend`
- [ ] Build command set to `npm install && npm run build`
- [ ] Start command set to `npm start`
- [ ] All 10 environment variables added
- [ ] 2 persistent volumes added
- [ ] Deployment successful
- [ ] Domain generated
- [ ] Backend URL copied
- [ ] `/health` endpoint works
- [ ] `/api/books` endpoint works

---

## 🐛 Troubleshooting

### Deployment Failed
**Problem**: Build or deployment fails

**Solution**:
1. Check Railway logs (click on deployment)
2. Look for error messages
3. Common issues:
   - Missing environment variables
   - Wrong root directory
   - Build command typo

### Can't Access Backend URL
**Problem**: URL returns error or timeout

**Solution**:
1. Check if deployment is complete (green checkmark)
2. Verify domain was generated
3. Wait 1-2 minutes after deployment
4. Check Railway logs for errors

### Books Disappear After Restart
**Problem**: Uploaded books are lost

**Solution**:
1. Verify persistent volumes are added
2. Check mount paths are correct:
   - `/app/uploads`
   - `/app/chroma_db`
3. Redeploy after adding volumes

---

## 💰 Cost Monitoring

Railway gives you $5 credit per month (FREE).

**To monitor usage:**
1. Go to Railway dashboard
2. Click on your project
3. Click "Usage" tab
4. See real-time costs

**Typical usage**: $0-3/month for personal use

---

## 📝 What's Next?

After your backend is deployed:

1. **Copy your Railway URL**
2. **Go to Vercel** to deploy frontend
3. **Use Railway URL** in Vercel environment variables

Follow the next guide: **VERCEL_DEPLOYMENT_STEPS.md**

---

## 🆘 Need Help?

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Check Logs**: Railway dashboard → Your service → Logs tab

---

**Your backend is now live on the internet! 🚀**

Next: Deploy your frontend to Vercel!