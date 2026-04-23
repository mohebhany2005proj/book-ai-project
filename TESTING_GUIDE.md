# Testing Guide - Book AI Project

## Pre-Testing Checklist

### 1. Backend Server Status
✅ Backend is running on port 3001
✅ Health endpoint responding: `http://localhost:3001/health`
✅ No compilation errors

### 2. Files to Test With
Located in `backend/uploads/`:
- PDF files (multiple customer service books)
- DOCX files (doob1, CS Strategy Planning Template)
- Various sizes (20KB to 6.8MB)

---

## Testing Scenarios

### Scenario 1: Upload New Book (With Metadata Extraction)
**Purpose**: Test that new books get metadata extracted properly

**Steps**:
1. Start frontend: `cd frontend && npm run dev`
2. Open browser: `http://localhost:3000`
3. Click "Upload Book"
4. Select a PDF file (e.g., "The King James New Testament Holy Bible.pdf")
5. Enter custom title: "Holy Bible - Test"
6. Click "Upload"

**Expected Results**:
- ✅ Upload succeeds
- ✅ Metadata extracted (author, pages, chapters)
- ✅ Book appears in list with metadata
- ✅ Preview button available
- ✅ No errors in console

**What to Check**:
```
Backend logs should show:
📄 Processing document...
📊 Extracting metadata...
✅ Metadata extracted: { author: "...", pageCount: X, chapterCount: Y }
✅ Document processed successfully
```

---

### Scenario 2: Use Existing Book (Without Metadata)
**Purpose**: Test that system works with books that don't have metadata

**Steps**:
1. If books already exist from previous sessions, select one
2. Try to chat with it
3. Try all 5 features

**Expected Results**:
- ✅ No crashes
- ✅ Chat works (uses safe defaults)
- ✅ All features generate content
- ✅ Responses are detailed and lengthy

**What to Check**:
```
Backend logs should show:
⚠️ No metadata available, using safe defaults
✅ Using chunk count: 10
✅ Using token limit: 1500
```

---

### Scenario 3: Chat in English
**Purpose**: Test English conversation quality

**Steps**:
1. Select a book
2. Go to Chat
3. Ask: "What is this book about?"
4. Ask: "Can you explain the main themes?"
5. Ask: "Tell me more about chapter 3"

**Expected Results**:
- ✅ Responses are detailed (5-10 paragraphs for longer books)
- ✅ Well-formatted with headers and bullet points
- ✅ Accurate information from the book
- ✅ No "I don't have enough information" errors

**Sample Good Response**:
```
## Overview
This book explores... [3-5 sentences]

## Main Themes
• Theme 1: Detailed explanation... [2-3 sentences]
• Theme 2: Detailed explanation... [2-3 sentences]
• Theme 3: Detailed explanation... [2-3 sentences]

## Key Insights
[Multiple paragraphs with detailed analysis]
```

---

### Scenario 4: Chat in Arabic
**Purpose**: Test Arabic conversation quality

**Steps**:
1. Select a book
2. Go to Chat
3. Ask: "ما هو موضوع هذا الكتاب؟"
4. Ask: "اشرح لي الأفكار الرئيسية"
5. Ask: "ما هي أهم النقاط؟"

**Expected Results**:
- ✅ Responses in Arabic
- ✅ Detailed and lengthy (5-10 paragraphs)
- ✅ Well-formatted with Arabic headers
- ✅ Natural Arabic language

**Sample Good Response**:
```
## نظرة عامة
يستكشف هذا الكتاب... [3-5 جمل]

## المواضيع الرئيسية
• الموضوع الأول: شرح مفصل... [2-3 جمل]
• الموضوع الثاني: شرح مفصل... [2-3 جمل]

## الأفكار الرئيسية
[فقرات متعددة مع تحليل مفصل]
```

---

### Scenario 5: AI Asks Clarifying Questions
**Purpose**: Test that AI asks questions when needed

**Steps**:
1. Select a book
2. Ask ambiguous question: "Tell me about it"
3. Ask vague question: "What about that part?"

**Expected Results**:
- ✅ AI asks for clarification
- ✅ Natural conversational tone
- ✅ Specific questions to understand user intent

**Sample Good Response**:
```
I'd be happy to help! Could you please clarify what specific aspect 
you'd like to know about? For example:
• The main themes and ideas?
• A specific chapter or section?
• The author's arguments?
• Practical applications?
```

---

### Scenario 6: Book Preview
**Purpose**: Test preview functionality

**Steps**:
1. Find a book in the list
2. Click "Preview" button
3. Read the preview content
4. Close modal

**Expected Results**:
- ✅ Modal opens with book preview
- ✅ Shows first 2000 characters
- ✅ Formatted nicely
- ✅ Close button works

---

### Scenario 7: Book Rename During Upload
**Purpose**: Test custom title feature

**Steps**:
1. Click "Upload Book"
2. Select file
3. See default title (from filename)
4. Change title to something custom
5. Upload

**Expected Results**:
- ✅ Default title shown from filename
- ✅ Can edit title
- ✅ Custom title saved
- ✅ Book appears with custom title in list

---

### Scenario 8: Insights Feature
**Purpose**: Test insights generation

**Steps**:
1. Select a book
2. Go to "Insights" feature
3. Wait for generation

**Expected Results**:
- ✅ Generates without errors
- ✅ Summary: 3-5 paragraphs
- ✅ Themes: 3-5 themes with explanations
- ✅ Characters: 3-5 with descriptions
- ✅ Quotes: 5-7 with context
- ✅ Content is detailed and comprehensive

---

### Scenario 9: Summary Cards Feature
**Purpose**: Test card generation

**Steps**:
1. Select a book
2. Go to "Summary Cards" feature
3. Wait for generation

**Expected Results**:
- ✅ Generates 7 cards
- ✅ Each card has title, content, icon
- ✅ Content is detailed (2-3 sentences)
- ✅ Cards cover different aspects of book

---

### Scenario 10: Quiz Feature
**Purpose**: Test quiz generation

**Steps**:
1. Select a book
2. Go to "Quiz" feature
3. Wait for generation
4. Answer questions

**Expected Results**:
- ✅ Generates 10 questions
- ✅ Each has 4 options
- ✅ Correct answer marked
- ✅ Detailed explanations (2-3 sentences)
- ✅ Questions cover book content

---

### Scenario 11: Speed Reading Feature
**Purpose**: Test speed reading content

**Steps**:
1. Select a book
2. Go to "Speed Reading" feature
3. Wait for generation

**Expected Results**:
- ✅ TL;DR: 3-4 paragraphs
- ✅ Key Sentences: 15 sentences
- ✅ Important Terms: 10 terms with definitions
- ✅ Chapter Summaries: 3-5 chapters
- ✅ All content is detailed

---

## Error Scenarios to Test

### Test 1: Missing Metadata
**Steps**: Use old book without metadata
**Expected**: Works with safe defaults, no crashes

### Test 2: Large Book
**Steps**: Upload 500+ page book
**Expected**: Processes successfully, uses appropriate chunk/token limits

### Test 3: Small Book
**Steps**: Upload 10-page document
**Expected**: Works, generates proportional content

### Test 4: Non-English Book
**Steps**: Upload Arabic book, chat in Arabic
**Expected**: Works seamlessly in Arabic

---

## Performance Checks

### Response Times
- ✅ Chat response: < 10 seconds
- ✅ Insights generation: < 30 seconds
- ✅ Summary cards: < 20 seconds
- ✅ Quiz: < 25 seconds
- ✅ Speed reading: < 30 seconds

### Quality Checks
- ✅ Responses are lengthy (not just 1-2 sentences)
- ✅ Information is accurate from book
- ✅ Formatting is clean and readable
- ✅ No JSON parsing errors
- ✅ No "undefined" or "null" in responses

---

## Common Issues and Solutions

### Issue: "Bob API connection failed"
**Solution**: Check `.env` file has correct `BOB_API_KEY`

### Issue: Features return empty or minimal content
**Solution**: Check backend logs for errors, verify prompts are working

### Issue: Metadata not extracted
**Solution**: Check if PDF/DOCX is readable, verify metadata extractor logs

### Issue: Chat not responding
**Solution**: Check if book is processed, verify vector store has embeddings

### Issue: Arabic text not displaying correctly
**Solution**: Check font support, verify UTF-8 encoding

---

## Success Criteria

### Must Pass (Critical)
- ✅ No crashes or errors
- ✅ All 5 features generate content
- ✅ Chat works in both English and Arabic
- ✅ Responses are detailed and lengthy
- ✅ Preview and rename features work

### Should Pass (Important)
- ✅ Metadata extracted for new books
- ✅ Old books work without metadata
- ✅ AI asks clarifying questions when appropriate
- ✅ Response times are reasonable
- ✅ Content quality is high

### Nice to Have (Optional)
- ✅ Very fast response times (< 5 seconds)
- ✅ Perfect metadata extraction every time
- ✅ Extremely detailed responses (10+ paragraphs)

---

## Testing Checklist

Before declaring system ready:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can upload new book with custom title
- [ ] Can preview book content
- [ ] Can chat in English (detailed responses)
- [ ] Can chat in Arabic (detailed responses)
- [ ] Insights feature works
- [ ] Summary Cards feature works
- [ ] Quiz feature works
- [ ] Speed Reading feature works
- [ ] Old books work without metadata
- [ ] No crashes or undefined errors
- [ ] All responses are lengthy and detailed
- [ ] AI asks questions when needed

---

## Next Steps After Testing

1. **If all tests pass**: Deploy to production
2. **If some tests fail**: Review logs, fix issues, re-test
3. **If major issues**: Rollback changes, investigate root cause

---

**Testing Status**: ⏳ Ready for testing
**Last Updated**: April 23, 2026
**Tester**: [Your Name]

---

*Made with Bob - Your AI Development Assistant*