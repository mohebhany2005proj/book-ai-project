# 🚀 Book AI - Complete Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for version control)

## 📦 Installation Steps

### Step 1: Install Backend Dependencies

```bash
# Navigate to backend directory
cd book-ai-project/backend

# Install all dependencies
npm install

# This will install:
# - express, cors, dotenv, multer
# - langchain, @langchain/community
# - chromadb
# - pdf-parse, mammoth
# - axios, uuid
# - TypeScript and dev dependencies
```

### Step 2: Install Frontend Dependencies

```bash
# Navigate to frontend directory (from project root)
cd ../frontend

# Install all dependencies
npm install

# This will install:
# - next, react, react-dom
# - axios, react-markdown
# - tailwindcss, postcss, autoprefixer
# - TypeScript and dev dependencies
```

## ⚙️ Configuration

### Backend Configuration

Configure your backend environment variables in `backend/.env`:

```env
PORT=3001
BOB_API_KEY=your_api_key_here
BOB_API_URL=https://api.bob.com/v1
CHROMA_DB_PATH=./chroma_db
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
TOP_K_RESULTS=5
```

**Note:** Never commit real API keys to documentation or version control. Set `BOB_API_KEY` locally in `backend/.env`.

### Frontend Configuration

The frontend is configured in `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🎯 Running the Application

### Terminal 1: Start Backend Server

```bash
# From backend directory
cd book-ai-project/backend

# Run development server
npm run dev

# You should see:
# ✅ Server started successfully!
# 📍 Server running on: http://localhost:3001
# 🏥 Health check: http://localhost:3001/health
# 📚 Books API: http://localhost:3001/api/books
# 💬 Chat API: http://localhost:3001/api/chat
```

### Terminal 2: Start Frontend Server

```bash
# From frontend directory (open a new terminal)
cd book-ai-project/frontend

# Run development server
npm run dev

# You should see:
# ▲ Next.js 14.x.x
# - Local: http://localhost:3000
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📚 Using the Application

### 1. Upload a Book

1. Click the "Upload Book" section on the home page
2. Select a file (PDF, TXT, or DOCX - max 50MB)
3. Wait for processing (1-3 minutes depending on book size)
4. The book will appear in your library

**Processing Steps:**
- ✅ Parsing document
- ✅ Generating embeddings (this takes the most time)
- ✅ Storing in vector database

### 2. Chat with Your Book

1. Click on a book card in your library
2. You'll be taken to the chat interface
3. Type your question in the input field
4. Press Enter or click Send
5. Wait for the AI response (2-5 seconds)

**Example Questions:**
- "What is the main theme of this book?"
- "Who are the main characters?"
- "Summarize chapter 3"
- "What does the author say about [specific topic]?"

### 3. Manage Books

- **View Details**: Click on a book to see its information
- **Delete Book**: Click the trash icon on a book card
- **Multiple Books**: Upload as many books as you want

## 🔧 Troubleshooting

### Backend Issues

**Problem: "npm: command not found"**
- Solution: Install Node.js from https://nodejs.org/

**Problem: "Port 3001 already in use"**
- Solution: Change the PORT in `backend/.env` to another port (e.g., 3002)
- Update `frontend/.env.local` to match the new port

**Problem: "Bob API connection failed"**
- Solution: Check your Bob API key in `backend/.env`
- Verify the API URL is correct
- Check your internet connection

**Problem: "Cannot find module 'chromadb'"**
- Solution: Run `npm install` again in the backend directory
- If it persists, try: `npm install chromadb --force`

**Problem: "File upload fails"**
- Check file size (max 50MB)
- Verify file format (PDF, TXT, DOCX only)
- Check disk space
- Look at backend console for error messages

### Frontend Issues

**Problem: "Cannot connect to backend"**
- Verify backend is running on http://localhost:3001
- Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
- Check browser console for CORS errors

**Problem: "Module not found" errors**
- Run `npm install` again in the frontend directory
- Clear Next.js cache: `rm -rf .next` (or delete .next folder)
- Restart the dev server

**Problem: "Page not found" after clicking a book**
- Make sure you're using the correct URL format
- Check browser console for errors
- Verify the book ID is valid

### Common Issues

**Problem: Slow processing**
- Large books take longer to process
- Embedding generation is the slowest step
- Be patient, it's working!

**Problem: AI gives wrong answers**
- The AI only knows what's in the book
- Try rephrasing your question
- Make sure the information is actually in the book

**Problem: "This information is not mentioned in the book"**
- This is correct behavior!
- The AI is being honest that it can't find the answer
- Try asking about different topics from the book

## 📊 System Requirements

### Minimum Requirements
- **RAM**: 4GB
- **Storage**: 2GB free space
- **CPU**: Dual-core processor
- **Internet**: Stable connection for API calls

### Recommended Requirements
- **RAM**: 8GB or more
- **Storage**: 5GB free space
- **CPU**: Quad-core processor
- **Internet**: High-speed connection

## 🔐 Security Notes

1. **API Key**: Your Bob API key should be stored only in the local `.env` file
   - Never commit `.env` files to version control
   - Keep your API key secret

2. **File Uploads**: Files are stored locally in `backend/uploads/`
   - Regularly clean up old files
   - Be cautious with sensitive documents

3. **Production Deployment**: 
   - Use HTTPS
   - Add authentication
   - Implement rate limiting
   - Use environment variables properly

## 📈 Performance Tips

1. **Optimize Book Size**: Smaller books process faster
2. **Chunk Size**: Adjust `CHUNK_SIZE` in `.env` for better results
3. **Top-K Results**: Increase `TOP_K_RESULTS` for more context (slower but more accurate)
4. **Caching**: The system caches embeddings automatically

## 🛠️ Development Commands

### Backend

```bash
# Development mode (auto-reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Clean build files
npm run clean
```

### Frontend

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

## 📝 Project Structure

```
book-ai-project/
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── config/      # Database & LLM config
│   │   ├── controllers/ # Request handlers
│   │   ├── services/    # Business logic
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Express middleware
│   │   └── types/       # TypeScript types
│   ├── uploads/         # Uploaded files
│   ├── chroma_db/       # Vector database
│   └── .env            # Environment variables
│
├── frontend/            # Next.js React app
│   ├── app/            # Next.js pages
│   ├── components/     # React components
│   ├── lib/           # Utilities & API client
│   ├── types/         # TypeScript types
│   └── .env.local     # Frontend config
│
└── Documentation files
```

## 🎓 Next Steps

1. **Upload Your First Book**: Try with a small PDF or TXT file
2. **Experiment with Questions**: See how the AI responds
3. **Upload More Books**: Build your AI library
4. **Customize**: Modify the code to fit your needs

## 📞 Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review the console logs (both backend and frontend)
3. Check the browser's developer console (F12)
4. Verify all dependencies are installed correctly

## 🎉 Success Checklist

- [ ] Node.js installed
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend server running on port 3001
- [ ] Frontend server running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Successfully uploaded a test book
- [ ] Successfully chatted with the book AI

---

**Congratulations! Your Book AI system is ready to use! 🚀📚**