# 📖 Book AI - User Guide

## Welcome to Book AI!

This guide will show you how to use the Book AI application to upload books and chat with AI assistants trained on their content.

---

## 🎯 What is Book AI?

Book AI allows you to:
- Upload books in PDF, TXT, or DOCX format
- Create an AI assistant for each book
- Ask questions about the book's content
- Get accurate answers based strictly on what's in the book

**Important**: The AI will ONLY answer based on the book's content. If something isn't mentioned in the book, it will tell you so.

---

## 🚀 Getting Started

### Prerequisites
Before using Book AI, make sure:
- ✅ Node.js is installed
- ✅ Backend server is running (http://localhost:3001)
- ✅ Frontend server is running (http://localhost:3000)
- ✅ Your browser is open at http://localhost:3000

---

## 📚 Part 1: Uploading Your First Book

### Step 1: Access the Upload Section

When you open http://localhost:3000, you'll see:
- A welcome message
- An "Upload a New Book" section
- Your book library (empty at first)

### Step 2: Choose a Book to Upload

Click the upload area or drag and drop a file.

**Supported Formats:**
- PDF files (.pdf)
- Text files (.txt)
- Word documents (.docx)

**File Size Limit:** 50MB maximum

**Recommended for First Test:**
- Start with a small book (10-50 pages)
- This will process faster (1-2 minutes)
- Good for testing the system

### Step 3: Upload Process

After selecting a file:

1. **Uploading** (5-10 seconds)
   - File is sent to the server
   - You'll see a progress message

2. **Processing Document** (30-60 seconds)
   - The system reads your book
   - Extracts all the text
   - Splits it into manageable chunks

3. **Generating Embeddings** (1-2 minutes)
   - This is the longest step
   - The AI creates vector representations
   - These allow semantic search

4. **Storing in Database** (5-10 seconds)
   - Embeddings are saved
   - Book is ready for chat!

**Total Time:** 2-3 minutes for a typical book

### Step 4: Success!

When complete, you'll see:
- ✅ "Book uploaded successfully!"
- Your book appears in the library
- You can now click on it to start chatting

---

## 💬 Part 2: Chatting with Your Book AI

### Step 1: Select a Book

In your library, click on any book card. This opens the chat interface.

### Step 2: Understanding the Chat Interface

You'll see:
- **Top Bar**: Book title and back button
- **Chat Area**: Where messages appear
- **Input Box**: Where you type questions
- **Send Button**: Click to send your message

### Step 3: Ask Your First Question

**Example Questions:**

For a novel:
- "What is the main theme of this book?"
- "Who are the main characters?"
- "Summarize chapter 3"
- "What happens at the end?"

For a textbook:
- "Explain the concept of [topic]"
- "What are the key points in chapter 2?"
- "Define [term] according to this book"

For a manual:
- "How do I [perform task]?"
- "What are the steps for [process]?"
- "What does the author recommend for [situation]?"

### Step 4: Reading AI Responses

The AI will:
- ✅ Answer based on book content
- ✅ Use markdown formatting (bold, lists, etc.)
- ✅ Provide detailed explanations
- ✅ Say "not mentioned" if info isn't in the book

**Response Time:** 2-5 seconds per question

### Step 5: Continue the Conversation

You can:
- Ask follow-up questions
- Request clarification
- Ask about different topics
- Scroll up to see previous messages

---

## 🎨 Part 3: Managing Your Library

### Viewing Your Books

Your library shows:
- 📖 Book title
- 📄 File name
- 💾 File size
- 🕐 Upload date
- 📊 Number of chunks processed

### Deleting a Book

1. Find the book in your library
2. Click the trash icon (🗑️)
3. Confirm deletion
4. The book and all its data are removed

**Note:** This action cannot be undone!

### Uploading Multiple Books

You can:
- Upload as many books as you want
- Each book gets its own AI assistant
- Switch between books anytime
- Chat with different books simultaneously

---

## 💡 Part 4: Tips for Best Results

### Asking Good Questions

**✅ DO:**
- Be specific: "What does chapter 3 say about climate change?"
- Ask about content: "Summarize the author's main argument"
- Request explanations: "Explain the concept of X as described in the book"

**❌ DON'T:**
- Ask about things not in the book
- Expect external knowledge
- Ask for opinions (the AI only reports what's in the book)

### Understanding AI Responses

**When the AI says "not mentioned":**
- The information truly isn't in the book
- Try rephrasing your question
- Ask about related topics that might be covered

**When responses seem incomplete:**
- The book might not have detailed information on that topic
- Try asking more specific questions
- Break complex questions into smaller parts

### Optimizing Performance

**For faster processing:**
- Upload smaller books first
- Use PDF files when possible
- Ensure good internet connection

**For better answers:**
- Ask clear, specific questions
- Reference chapters or sections if known
- Build on previous questions in the conversation

---

## 🔍 Part 5: Understanding How It Works

### The RAG Process

When you ask a question:

1. **Your Question** → Converted to a vector embedding
2. **Search** → System finds 5 most relevant book sections
3. **Context** → These sections are sent to the AI
4. **Response** → AI generates answer using only this context
5. **Display** → You see the answer

### Why "Not Mentioned" Responses?

The AI is programmed to be honest:
- It only uses information from the book
- If the answer isn't in the retrieved sections, it says so
- This ensures accuracy and prevents hallucinations

### Book Processing

Your book goes through:
1. **Parsing**: Extract text from PDF/DOCX/TXT
2. **Chunking**: Split into ~1000 character pieces
3. **Embedding**: Convert each chunk to vectors
4. **Storage**: Save in ChromaDB for fast search

---

## 📊 Part 6: Example Use Cases

### Use Case 1: Studying a Textbook

**Scenario:** You're studying a biology textbook

**Questions to Ask:**
- "What are the main topics covered in chapter 5?"
- "Explain photosynthesis as described in this book"
- "List the key terms from chapter 3"
- "What experiments are mentioned?"

### Use Case 2: Analyzing a Novel

**Scenario:** You're reading a fiction book

**Questions to Ask:**
- "Who are the main characters and their relationships?"
- "What is the setting of the story?"
- "Summarize the plot of chapter 10"
- "What themes does the author explore?"

### Use Case 3: Reference Manual

**Scenario:** You have a technical manual

**Questions to Ask:**
- "How do I configure [feature]?"
- "What are the troubleshooting steps for [problem]?"
- "List all the safety warnings mentioned"
- "What tools are required for [task]?"

### Use Case 4: Research Paper

**Scenario:** You're reviewing a research paper

**Questions to Ask:**
- "What is the main hypothesis?"
- "What methodology was used?"
- "What were the key findings?"
- "What limitations does the author mention?"

---

## 🆘 Part 7: Troubleshooting

### Upload Issues

**Problem:** Upload fails
- Check file size (max 50MB)
- Verify file format (PDF, TXT, DOCX)
- Try a different file
- Check backend console for errors

**Problem:** Processing takes too long
- Large books take longer (up to 5 minutes)
- Check your internet connection
- Wait patiently - it's working!

### Chat Issues

**Problem:** No response from AI
- Check if backend is running
- Verify internet connection
- Try refreshing the page
- Check browser console for errors

**Problem:** Incorrect answers
- The AI only knows what's in the book
- Try rephrasing your question
- Ask about different sections
- Verify the information is actually in the book

### General Issues

**Problem:** Page won't load
- Verify both servers are running
- Check http://localhost:3000
- Clear browser cache
- Try a different browser

**Problem:** Book disappeared
- Check if you accidentally deleted it
- Restart the servers
- Re-upload the book if needed

---

## 🎓 Part 8: Advanced Features

### Chat History

- All messages are saved during your session
- Scroll up to see previous questions
- Build on previous conversations
- Context is maintained within a session

### Multiple Books

- Upload different books on different topics
- Switch between them easily
- Each has independent chat history
- Compare information across books

### Book Statistics

- View number of chunks created
- See processing details
- Check file information
- Monitor upload date

---

## 🔐 Part 9: Privacy & Data

### Your Data

- Books are stored locally on your computer
- No data is sent to external servers (except Bob API for AI)
- Delete books anytime
- All data is removed when you delete a book

### AI Processing

- Questions are sent to Bob API for processing
- Responses are generated based on your book content
- No training data is collected
- Your books remain private

---

## 📝 Part 10: Best Practices

### Do's

✅ Upload books you want to learn from
✅ Ask specific, clear questions
✅ Read the full AI responses
✅ Try different phrasings if needed
✅ Delete books you no longer need
✅ Keep both servers running while using

### Don'ts

❌ Don't upload copyrighted material you don't own
❌ Don't expect answers about things not in the book
❌ Don't close the terminal windows while using
❌ Don't upload extremely large files (>50MB)
❌ Don't expect instant processing for large books

---

## 🎉 Quick Start Checklist

- [ ] Servers are running (backend and frontend)
- [ ] Browser is open at http://localhost:3000
- [ ] I have a book file ready (PDF, TXT, or DOCX)
- [ ] File is under 50MB
- [ ] I've read this user guide
- [ ] Ready to upload my first book!

---

## 📞 Need More Help?

Check these files in your project folder:
- **SETUP_GUIDE.md** - Installation and setup
- **START_HERE.md** - Quick start commands
- **PROJECT_SUMMARY.md** - Technical details
- **README.md** - Project overview

---

**Enjoy chatting with your books! 📚🤖**

*Remember: The AI only knows what's in your books. It's like having a very knowledgeable friend who has read and memorized every word!*