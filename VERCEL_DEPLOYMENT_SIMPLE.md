# 🚀 Deploy Frontend to Vercel - Simple Steps

## Step 1: Go to Vercel
Open your browser and go to: **https://vercel.com**

---

## Step 2: Sign Up
1. Click **"Sign Up"** (top right)
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub

---

## Step 3: Create New Project
1. Click **"Add New..."** button
2. Click **"Project"**
3. You'll see a list of your GitHub repositories
4. Find **"book-ai-project"** and click **"Import"**

---

## Step 4: Configure Project Settings

Vercel will show you a configuration page. Here's what to do:

### Framework Preset
- **Leave it as "Next.js"** (Vercel should auto-detect this)
- If it says "Other", change it to "Next.js"

### Root Directory
- Click **"Edit"** next to Root Directory
- Type: `frontend`
- Click **"Continue"**

**IMPORTANT:** This tells Vercel to deploy only the frontend folder!

### Build and Output Settings
Click **"Build and Output Settings"** to expand it:

#### Build Command
- **Leave as default:** `npm run build`
- Or if empty, type: `npm run build`

#### Output Directory
- **Leave as default:** `.next`
- Or if empty, type: `.next`

#### Install Command
- **Leave as default:** `npm install`

---

## Step 5: Add Environment Variable

This is CRITICAL! Your frontend needs to know where your backend is.

1. Scroll down to **"Environment Variables"** section
2. Click to expand it
3. Add this variable:

**Name (Key):**
```
NEXT_PUBLIC_API_URL
```

**Value:**
```
https://book-ai-project-production.up.railway.app
```

**IMPORTANT:** Replace with YOUR actual Railway URL if different!

4. Leave **"Environment"** as "Production, Preview, and Development"

---

## Step 6: Deploy!

1. Click the big **"Deploy"** button at the bottom
2. Vercel will start building your frontend
3. You'll see logs scrolling (this takes 2-3 minutes)
4. Wait for the confetti! 🎉

---

## Step 7: Get Your Live URL

After deployment succeeds:

1. You'll see a preview of your site
2. At the top, you'll see your URL like:
   ```
   https://book-ai-project-xxxx.vercel.app
   ```
3. Click **"Visit"** to open your live site!

---

## Step 8: Test Your Application

1. Open your Vercel URL in browser
2. You should see your Book AI interface
3. Try uploading a small PDF book
4. Try chatting with it!

---

## 🎉 Success Checklist

- [ ] Signed up for Vercel with GitHub
- [ ] Imported book-ai-project repository
- [ ] Set root directory to `frontend`
- [ ] Framework preset is Next.js
- [ ] Build command is `npm run build`
- [ ] Output directory is `.next`
- [ ] Added `NEXT_PUBLIC_API_URL` environment variable
- [ ] Deployment succeeded
- [ ] Got live Vercel URL
- [ ] Tested uploading a book
- [ ] Tested chatting with book

---

## 🐛 Troubleshooting

### Build Failed
**Error:** "Cannot find module" or "Module not found"

**Solution:**
1. Check that Root Directory is set to `frontend`
2. Redeploy by clicking "Redeploy" button

### Can't Upload Books
**Error:** Network error or CORS error

**Solution:**
1. Check that `NEXT_PUBLIC_API_URL` is correct
2. Make sure Railway backend is running
3. Test Railway URL directly: `https://your-railway-url/health`

### Environment Variable Not Working
**Problem:** Frontend can't connect to backend

**Solution:**
1. Go to Vercel Dashboard
2. Click on your project
3. Go to **"Settings"** tab
4. Click **"Environment Variables"**
5. Verify `NEXT_PUBLIC_API_URL` is there
6. If you change it, click **"Redeploy"** from Deployments tab

---

## 💡 Quick Tips

- **Vercel auto-deploys** when you push to GitHub
- **Environment variables** must start with `NEXT_PUBLIC_` to work in browser
- **Check browser console** (F12) for errors if something doesn't work
- **Redeploy** after changing environment variables

---

## 📝 What Each Setting Does

| Setting | Value | Why |
|---------|-------|-----|
| Framework Preset | Next.js | Tells Vercel how to build your app |
| Root Directory | `frontend` | Tells Vercel where your frontend code is |
| Build Command | `npm run build` | Compiles your Next.js app |
| Output Directory | `.next` | Where Next.js puts compiled files |
| NEXT_PUBLIC_API_URL | Railway URL | Where frontend sends API requests |

---

## 🎯 After Deployment

Your app is now LIVE on the internet! 🚀

**Share your URL with:**
- Friends and family
- On social media
- In your portfolio

**Next steps:**
- Monitor usage in Vercel dashboard
- Check Railway backend logs if issues occur
- Consider adding custom domain (optional)

---

## 🆘 Need Help?

If something doesn't work:

1. **Check Vercel logs:**
   - Dashboard → Your project → Deployments → Click latest → View Function Logs

2. **Check Railway logs:**
   - Dashboard → Your service → Deployments → View Logs

3. **Check browser console:**
   - Press F12 → Console tab → Look for errors

4. **Common fixes:**
   - Redeploy after changing environment variables
   - Clear browser cache
   - Check that Railway backend is running

---

**You're almost done! Just follow these steps and your app will be live! 🚀**