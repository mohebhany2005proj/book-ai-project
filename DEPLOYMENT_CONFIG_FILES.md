# 📝 Deployment Configuration Files

This document contains all the configuration files you need to create for successful deployment.

---

## 1. `.gitignore` (Project Root)

Create this file at: `book-ai-project/.gitignore`

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
frontend/.next/
frontend/out/
frontend/build/

# Production
backend/dist/
backend/build/

# Environment variables
.env
.env.local
.env.production
.env.development.local
.env.test.local
.env.production.local

# Debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Uploads and databases
backend/uploads/*
!backend/uploads/.gitkeep
backend/chroma_db/
backend/vector_store/

# Misc
*.log
.cache/
```

---

## 2. `railway.json` (Backend)

Create this file at: `book-ai-project/backend/railway.json`

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## 3. `.env.example` (Backend)

Create this file at: `book-ai-project/backend/.env.example`

This is a template for others (or for Railway setup):

```env
# Server Configuration
PORT=3001

# Bob API Configuration (Using OpenAI)
BOB_API_KEY=your_openai_api_key_here
BOB_API_URL=https://api.openai.com/v1

# Database Configuration
CHROMA_DB_PATH=./chroma_db

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800

# RAG Configuration
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
TOP_K_RESULTS=5

# Node.js Memory Configuration
NODE_OPTIONS=--max-old-space-size=4096
```

---

## 4. `vercel.json` (Frontend)

Create this file at: `book-ai-project/frontend/vercel.json`

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

---

## 5. `.env.example` (Frontend)

Create this file at: `book-ai-project/frontend/.env.example`

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 6. `cors.ts` (Backend Config)

Create this file at: `book-ai-project/backend/src/config/cors.ts`

```typescript
export const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    // Add your Vercel URL after deployment
    // 'https://your-app.vercel.app',
    /\.vercel\.app$/ // Allow all Vercel preview deployments
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

---

## 7. Update `server.ts` to use CORS config

Modify `book-ai-project/backend/src/server.ts`:

Find the line with `app.use(cors())` and replace it with:

```typescript
import { corsOptions } from './config/cors';

// Replace: app.use(cors());
// With:
app.use(cors(corsOptions));
```

---

## 8. `README.md` Update (Add Deployment Section)

Add this section to your existing `README.md`:

```markdown
## 🌐 Deployment

This project is deployed using:
- **Frontend**: Vercel
- **Backend**: Railway

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Live URLs
- Frontend: [Your Vercel URL]
- Backend API: [Your Railway URL]
```

---

## 9. `.gitkeep` files

Create empty `.gitkeep` files to preserve directory structure:

```bash
# In backend/uploads directory
touch book-ai-project/backend/uploads/.gitkeep
```

---

## 10. `Procfile` (Alternative for Railway)

Create this file at: `book-ai-project/backend/Procfile`

```
web: npm start
```

---

## 🔧 How to Create These Files

### Option 1: Manual Creation
1. Open each file path in your code editor
2. Copy the content from above
3. Save the file

### Option 2: Using Terminal (Windows PowerShell)

```powershell
# Navigate to project root
cd book-ai-project

# Create .gitignore
New-Item -Path ".gitignore" -ItemType File -Force
# Then paste the content

# Create backend railway.json
New-Item -Path "backend/railway.json" -ItemType File -Force
# Then paste the content

# Create backend .env.example
New-Item -Path "backend/.env.example" -ItemType File -Force
# Then paste the content

# Create frontend vercel.json
New-Item -Path "frontend/vercel.json" -ItemType File -Force
# Then paste the content

# Create frontend .env.example
New-Item -Path "frontend/.env.example" -ItemType File -Force
# Then paste the content

# Create backend cors config
New-Item -Path "backend/src/config/cors.ts" -ItemType File -Force
# Then paste the content

# Create .gitkeep
New-Item -Path "backend/uploads/.gitkeep" -ItemType File -Force
```

### Option 3: Using Terminal (Mac/Linux)

```bash
# Navigate to project root
cd book-ai-project

# Create .gitignore
touch .gitignore
# Then paste the content

# Create backend railway.json
touch backend/railway.json
# Then paste the content

# Create backend .env.example
touch backend/.env.example
# Then paste the content

# Create frontend vercel.json
touch frontend/vercel.json
# Then paste the content

# Create frontend .env.example
touch frontend/.env.example
# Then paste the content

# Create backend cors config
touch backend/src/config/cors.ts
# Then paste the content

# Create .gitkeep
touch backend/uploads/.gitkeep
```

---

## ✅ Verification Checklist

After creating all files, verify:

- [ ] `.gitignore` exists in project root
- [ ] `railway.json` exists in backend folder
- [ ] `.env.example` exists in backend folder
- [ ] `vercel.json` exists in frontend folder
- [ ] `.env.example` exists in frontend folder
- [ ] `cors.ts` exists in backend/src/config folder
- [ ] `.gitkeep` exists in backend/uploads folder
- [ ] `server.ts` updated to use cors config

---

## 🚀 Next Steps

After creating these files:

1. **Test locally** to ensure nothing broke
2. **Commit to Git**:
   ```bash
   git add .
   git commit -m "Add deployment configuration files"
   ```
3. **Push to GitHub**:
   ```bash
   git push origin main
   ```
4. **Proceed with deployment** following the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 📝 Notes

- **DO NOT** commit your actual `.env` file (it's in `.gitignore`)
- **DO** commit `.env.example` files (they're templates)
- The `cors.ts` file will need to be updated with your actual Vercel URL after deployment
- Railway and Vercel will use their own environment variable systems

---

**Ready to deploy!** 🎉