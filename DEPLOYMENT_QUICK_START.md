# ⚡ Quick Start Deployment Guide

**Goal**: Get your Book AI project live in ~30 minutes!

---

## 📋 Before You Start

✅ Ensure you have:
- Git installed
- GitHub account
- Project working locally
- OpenAI API key (already in your `.env`)

---

## 🚀 5-Step Deployment Process

### Step 1: Prepare Files (5 minutes)

1. **Create configuration files** from [`DEPLOYMENT_CONFIG_FILES.md`](./DEPLOYMENT_CONFIG_FILES.md):
   - `.gitignore` (project root)
   - `backend/railway.json`
   - `backend/src/config/cors.ts`
   - `backend/uploads/.gitkeep`

2. **Test locally** to ensure nothing broke:
   ```bash
   # Terminal 1 - Backend
   cd book-ai-project/backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd book-ai-project/frontend
   npm run dev
   ```

3. **Commit everything**:
   ```bash
   cd book-ai-project
   git add .
   git commit -m "Prepare for deployment"
   ```

---

### Step 2: Push to GitHub (3 minutes)

1. **Create GitHub repository**:
   - Go to [github.com/new](https://github.com/new)
   - Name: `book-ai-project`
   - Keep it Public
   - Don't initialize with README
   - Click "Create repository"

2. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/book-ai-project.git
   git branch -M main
   git push -u origin main
   ```

✅ **Checkpoint**: Code visible on GitHub!

---

### Step 3: Deploy Backend to Railway (10 minutes)

1. **Sign up**: [railway.app](https://railway.app) → Login with GitHub

2. **Create project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `book-ai-project`

3. **Configure service**:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

4. **Add environment variables** (Settings → Variables):
   ```
   PORT=3001
   BOB_API_KEY=your_openai_api_key_here
   BOB_API_URL=https://api.openai.com/v1
   CHROMA_DB_PATH=./chroma_db
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE=52428800
   CHUNK_SIZE=1000
   CHUNK_OVERLAP=200
   TOP_K_RESULTS=5
   NODE_OPTIONS=--max-old-space-size=4096
   ```

5. **Add persistent storage** (Settings → Volumes):
   - Volume 1: Mount path `/app/uploads`
   - Volume 2: Mount path `/app/chroma_db`

6. **Generate domain** (Settings → Networking):
   - Click "Generate Domain"
   - Copy URL (e.g., `https://book-ai-backend-production.up.railway.app`)

✅ **Checkpoint**: Test backend at `YOUR_URL/api/books` → Should see `[]`

---

### Step 4: Deploy Frontend to Vercel (8 minutes)

1. **Sign up**: [vercel.com](https://vercel.com) → Continue with GitHub

2. **Import project**:
   - Click "Add New..." → "Project"
   - Select `book-ai-project`
   - Click "Import"

3. **Configure**:
   - Framework: Next.js (auto-detected)
   - Root Directory: `frontend`
   - Build Command: `npm run build`

4. **Add environment variable**:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend-url.up.railway.app
   ```
   ⚠️ **Important**: Use YOUR actual Railway URL from Step 3!

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Click "Visit" when done

✅ **Checkpoint**: Frontend is live!

---

### Step 5: Final Configuration (4 minutes)

1. **Update CORS** in your code:
   
   Edit `backend/src/config/cors.ts`:
   ```typescript
   export const corsOptions = {
     origin: [
       'http://localhost:3000',
       'https://your-vercel-app.vercel.app', // Add your Vercel URL here
       /\.vercel\.app$/
     ],
     credentials: true,
     optionsSuccessStatus: 200
   };
   ```

2. **Commit and push**:
   ```bash
   git add .
   git commit -m "Update CORS for production"
   git push
   ```
   
   Railway will auto-redeploy (takes 2-3 minutes).

3. **Test everything**:
   - Visit your Vercel URL
   - Upload a test book
   - Ask questions
   - Verify responses

✅ **Done!** Your app is live! 🎉

---

## 🎯 Your Live URLs

After deployment, you'll have:

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.up.railway.app`

Share these with friends!

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't deploy | Check Railway logs, verify environment variables |
| Frontend can't connect | Double-check `NEXT_PUBLIC_API_URL` in Vercel |
| Books disappear | Ensure persistent volumes are mounted in Railway |
| CORS errors | Update `cors.ts` with your Vercel URL |
| Build fails | Check logs, ensure all dependencies in `package.json` |

---

## 📊 What You Get (Free Tier)

- **Railway**: $5 credit/month (~500 hours runtime)
- **Vercel**: Unlimited deployments, 100GB bandwidth
- **Total Cost**: $0-5/month (plus OpenAI API usage)

---

## 📚 Need More Details?

- **Full Guide**: [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)
- **Config Files**: [`DEPLOYMENT_CONFIG_FILES.md`](./DEPLOYMENT_CONFIG_FILES.md)
- **Project Setup**: [`README.md`](./README.md)

---

## 🎉 Success Checklist

- [ ] Code on GitHub
- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set
- [ ] Persistent storage configured
- [ ] CORS updated
- [ ] Test upload works
- [ ] Test chat works
- [ ] URLs saved

**Congratulations! Your Book AI is live! 🚀**

---

## 🔄 Future Updates

To update your deployed app:

```bash
# Make changes locally
# Test locally
git add .
git commit -m "Your update message"
git push

# Railway and Vercel will auto-deploy!
```

---

**Questions?** Check the full [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) for detailed troubleshooting and advanced configuration.