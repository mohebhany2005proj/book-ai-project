# ⚠️ IMPORTANT: Install Node.js First!

## 🚨 You Need Node.js Before Running This Project

Node.js is not installed on your system. You must install it before you can run the Book AI application.

## 📥 Step-by-Step Installation

### Step 1: Download Node.js

1. Open your web browser
2. Go to: **https://nodejs.org/**
3. You'll see two download buttons:
   - **LTS (Recommended)** ← Choose this one!
   - Current

4. Click the **LTS** button to download

### Step 2: Install Node.js

1. Find the downloaded file (usually in Downloads folder)
   - File name: `node-v18.x.x-x64.msi` or similar
2. Double-click to run the installer
3. Follow the installation wizard:
   - Click "Next"
   - Accept the license agreement
   - Keep default installation location
   - **IMPORTANT**: Make sure "Add to PATH" is checked ✅
   - Click "Install"
   - Wait for installation to complete
   - Click "Finish"

### Step 3: Restart PowerShell

**IMPORTANT**: You MUST restart PowerShell after installing Node.js!

1. Close all PowerShell windows
2. Open a new PowerShell window
3. Navigate back to the project:
   ```powershell
   cd C:\Users\MohebTodary\Desktop\book-ai-project\backend
   ```

### Step 4: Verify Installation

```powershell
node --version
```

You should see something like: `v18.19.0` or `v20.x.x`

```powershell
npm --version
```

You should see something like: `10.2.3` or similar

## ✅ After Node.js is Installed

Once Node.js is installed and verified, follow these steps:

### 1. Install Backend Dependencies
```powershell
cd C:\Users\MohebTodary\Desktop\book-ai-project\backend
npm install
```

This will take 2-5 minutes. You'll see a progress bar.

### 2. Install Frontend Dependencies
Open a NEW PowerShell window and run:
```powershell
cd C:\Users\MohebTodary\Desktop\book-ai-project\frontend
npm install
```

This will also take 2-5 minutes.

### 3. Start Backend Server
In the first PowerShell window (backend):
```powershell
npm run dev
```

You should see:
```
✅ Server started successfully!
📍 Server running on: http://localhost:3001
```

### 4. Start Frontend Server
In the second PowerShell window (frontend):
```powershell
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local: http://localhost:3000
```

### 5. Open Your Browser
Go to: **http://localhost:3000**

## 🎯 Quick Reference

### Node.js Download Link
```
https://nodejs.org/
```

### After Installation Commands
```powershell
# Verify Node.js
node --version
npm --version

# Install backend
cd C:\Users\MohebTodary\Desktop\book-ai-project\backend
npm install

# Install frontend (new terminal)
cd C:\Users\MohebTodary\Desktop\book-ai-project\frontend
npm install

# Run backend (terminal 1)
cd C:\Users\MohebTodary\Desktop\book-ai-project\backend
npm run dev

# Run frontend (terminal 2)
cd C:\Users\MohebTodary\Desktop\book-ai-project\frontend
npm run dev

# Open browser
http://localhost:3000
```

## 🆘 Troubleshooting

### "node: command not found" after installation
- **Solution**: Restart PowerShell (close and reopen)
- If still not working, restart your computer

### Installation fails or hangs
- **Solution**: 
  1. Check your internet connection
  2. Try running PowerShell as Administrator
  3. Delete `node_modules` folder and try again

### "npm install" shows errors
- **Solution**: 
  1. Make sure you're in the correct directory
  2. Check internet connection
  3. Try: `npm install --force`

## 📝 What is Node.js?

Node.js is a JavaScript runtime that allows you to run JavaScript code on your computer (not just in browsers). It's required for:
- Running the backend server
- Running the frontend development server
- Installing project dependencies (npm packages)

## ⏱️ Time Estimate

- Download Node.js: 1-2 minutes
- Install Node.js: 2-3 minutes
- Install backend dependencies: 3-5 minutes
- Install frontend dependencies: 3-5 minutes
- **Total: ~15 minutes**

## 🎉 After Everything is Running

1. Upload a book (PDF, TXT, or DOCX)
2. Wait for processing (1-2 minutes)
3. Click on the book to open chat
4. Ask questions about the book!

---

**Start here: https://nodejs.org/ → Download LTS version → Install → Restart PowerShell → Continue with setup!**