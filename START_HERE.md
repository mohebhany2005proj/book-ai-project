# 🚀 Quick Start - Book AI Project

## Your Project Location
```
C:\Users\MohebTodary\Desktop\book-ai-project
```

## ⚡ Quick Commands (Copy & Paste)

### Step 1: Navigate to Project (from anywhere)
```powershell
cd C:\Users\MohebTodary\Desktop\book-ai-project
```

### Step 2: Install Backend Dependencies
```powershell
cd backend
npm install
```

### Step 3: Install Frontend Dependencies (in new terminal)
```powershell
cd C:\Users\MohebTodary\Desktop\book-ai-project\frontend
npm install
```

### Step 4: Start Backend (Terminal 1)
```powershell
cd C:\Users\MohebTodary\Desktop\book-ai-project\backend
npm run dev
```

### Step 5: Start Frontend (Terminal 2 - new terminal)
```powershell
cd C:\Users\MohebTodary\Desktop\book-ai-project\frontend
npm run dev
```

### Step 6: Open Browser
```
http://localhost:3000
```

## 📝 Important Notes

1. **You need Node.js installed first!**
   - Download from: https://nodejs.org/
   - Choose the LTS version
   - Restart your terminal after installation

2. **Use the FULL PATH** when navigating:
   ```powershell
   cd C:\Users\MohebTodary\Desktop\book-ai-project\backend
   ```
   NOT:
   ```powershell
   cd book-ai-project/backend  # This won't work from home directory
   ```

3. **Two terminals needed**:
   - Terminal 1: Backend server (port 3001)
   - Terminal 2: Frontend server (port 3000)

## ✅ Verify Installation

After installing dependencies, check if they're installed:

```powershell
# In backend directory
cd C:\Users\MohebTodary\Desktop\book-ai-project\backend
dir node_modules

# In frontend directory
cd C:\Users\MohebTodary\Desktop\book-ai-project\frontend
dir node_modules
```

## 🎯 First Time Setup Checklist

- [ ] Node.js installed (check with: `node --version`)
- [ ] Navigated to project: `cd C:\Users\MohebTodary\Desktop\book-ai-project`
- [ ] Backend dependencies installed: `cd backend && npm install`
- [ ] Frontend dependencies installed: `cd frontend && npm install`
- [ ] Backend running: `npm run dev` in backend directory
- [ ] Frontend running: `npm run dev` in frontend directory
- [ ] Browser opened: http://localhost:3000
- [ ] Test upload: Upload a small PDF or TXT file

## 🆘 Common Issues

**"npm: command not found"**
- Install Node.js from https://nodejs.org/
- Restart your terminal/PowerShell

**"Cannot find path"**
- Use the full path: `cd C:\Users\MohebTodary\Desktop\book-ai-project\backend`
- Make sure you're spelling everything correctly

**"Port already in use"**
- Close other applications using ports 3000 or 3001
- Or change the port in `.env` files

## 📚 Next Steps

Once everything is running:
1. Upload a book (PDF, TXT, or DOCX)
2. Wait for processing (1-2 minutes)
3. Click on the book to chat
4. Ask questions about the book!

---

**Need more help? Check SETUP_GUIDE.md for detailed instructions!**