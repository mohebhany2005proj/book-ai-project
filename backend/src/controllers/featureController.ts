import { Request, Response } from 'express';
import { bobChat, BobChatMessage } from '../config/llm';
import RAGService from '../services/ragService';
import MetadataExtractor from '../services/metadataExtractor';

const ragService = new RAGService();
const metadataExtractor = new MetadataExtractor();

/**
 * Get book insights (themes, characters, quotes, summary)
 */
export const getInsights = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = (req.app.locals.books as Map<string, any>)?.get(id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    console.log(`📊 Generating insights for book "${book.title}"...`);

    const metadata = book.metadata;
    
    // Get more context based on book size
    const chunkCount = metadata
      ? metadataExtractor.getOptimalChunkCount(metadata, 'insights')
      : 25;
    
    const context = await ragService.getRelevantContext(id, 'summary themes characters key concepts', chunkCount);
    const combinedContext = context.join('\n\n');

    // Calculate proportional response length
    const maxTokens = metadata
      ? metadataExtractor.calculateResponseLength(metadata, 'insights')
      : 2000;

    const author = metadata?.author ? ` by ${metadata.author}` : '';
    const pages = metadata?.pageCount ? ` (${metadata.pageCount} pages)` : '';

    // Generate comprehensive insights using AI
    const prompt = `Analyze the book "${book.title}"${author}${pages} and extract COMPREHENSIVE insights in JSON format.

Book Content:
${combinedContext}

Provide DETAILED analysis:
1. A comprehensive summary (${Math.ceil((metadata?.pageCount || 100) / 50)} paragraphs minimum)
2. Main themes (5-8 themes with detailed explanations)
3. Key characters or entities (5-10 items with descriptions)
4. Important quotes (8-12 quotes with context and significance)

Make the analysis proportional to the book's ${metadata?.pageCount || 100} pages.

Respond ONLY with valid JSON in this exact format:
{
  "summary": "Comprehensive book summary here (multiple paragraphs)",
  "themes": ["theme1: detailed explanation", "theme2: detailed explanation", ...],
  "characters": ["character1: detailed description", "character2: detailed description", ...],
  "keyQuotes": ["quote1 - context and significance", "quote2 - context and significance", ...]
}`;

    const messages: BobChatMessage[] = [
      { role: 'system', content: 'You are a book analysis expert. Provide comprehensive, detailed analysis. Respond only with valid JSON.' },
      { role: 'user', content: prompt },
    ];

    const response = await bobChat(messages, 0.3, maxTokens);
    
    // Parse JSON response
    let insights;
    try {
      insights = JSON.parse(response);
    } catch (parseError) {
      // If JSON parsing fails, provide default structure
      insights = {
        summary: 'Unable to generate summary at this time.',
        themes: ['Analysis in progress'],
        characters: [],
        keyQuotes: [],
      };
    }

    console.log(`✅ Generated insights for "${book.title}"`);
    res.json(insights);
  } catch (error: any) {
    console.error('❌ Error generating insights:', error);
    res.status(500).json({
      error: 'Failed to generate insights',
      details: error.message,
    });
  }
};

/**
 * Get summary cards for visual display
 */
export const getSummaryCards = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = (req.app.locals.books as Map<string, any>)?.get(id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    console.log(`🎴 Generating summary cards for book "${book.title}"...`);

    const metadata = book.metadata;
    
    // Get more context based on book size
    const chunkCount = metadata
      ? metadataExtractor.getOptimalChunkCount(metadata, 'summaryCards')
      : 15;
    
    const context = await ragService.getRelevantContext(id, 'main ideas key concepts chapters', chunkCount);
    const combinedContext = context.join('\n\n');

    // Calculate card count based on book size
    const cardCount = Math.min(15, Math.max(7, Math.ceil((metadata?.pageCount || 100) / 20)));
    
    // Calculate proportional response length
    const maxTokens = metadata
      ? metadataExtractor.calculateResponseLength(metadata, 'summaryCards')
      : 2000;

    // Generate cards using AI
    const prompt = `Create ${cardCount} detailed visual summary cards for the book "${book.title}" (${metadata?.pageCount || 100} pages).

Content: ${combinedContext}

Each card should have:
- A short, catchy title (3-5 words)
- A detailed, engaging description (2-4 sentences covering key points)
- An appropriate emoji icon

Create cards that cover all major aspects of the book proportional to its ${metadata?.pageCount || 100} pages.

Respond ONLY with valid JSON in this format:
{
  "cards": [
    {
      "id": 1,
      "title": "Card Title",
      "content": "Detailed engaging description with key insights",
      "icon": "📖"
    }
  ]
}`;

    const messages: BobChatMessage[] = [
      { role: 'system', content: 'You are a content summarization expert. Create comprehensive, detailed cards. Respond only with valid JSON.' },
      { role: 'user', content: prompt },
    ];

    const response = await bobChat(messages, 0.7, maxTokens);
    
    let result;
    try {
      result = JSON.parse(response);
    } catch (parseError) {
      result = {
        cards: [
          {
            id: 1,
            title: 'Book Overview',
            content: 'Explore the main ideas and concepts from this book.',
            icon: '📖',
          },
        ],
      };
    }

    console.log(`✅ Generated ${result.cards?.length || 0} summary cards`);
    res.json(result);
  } catch (error: any) {
    console.error('❌ Error generating summary cards:', error);
    res.status(500).json({
      error: 'Failed to generate summary cards',
      details: error.message,
    });
  }
};

/**
 * Get quiz questions
 */
export const getQuiz = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = (req.app.locals.books as Map<string, any>)?.get(id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    console.log(`🎯 Generating quiz for book "${book.title}"...`);

    const metadata = book.metadata;
    
    // Get more context based on book size
    const chunkCount = metadata
      ? metadataExtractor.getOptimalChunkCount(metadata, 'quiz')
      : 20;
    
    const context = await ragService.getRelevantContext(id, 'main concepts facts details key points', chunkCount);
    const combinedContext = context.join('\n\n');

    // Calculate question count based on book size
    const questionCount = Math.min(30, Math.max(10, Math.ceil((metadata?.pageCount || 100) / 10)));
    
    // Calculate proportional response length
    const maxTokens = metadata
      ? metadataExtractor.calculateResponseLength(metadata, 'quiz')
      : 3000;

    // Generate comprehensive quiz using AI
    const prompt = `Create ${questionCount} comprehensive multiple-choice quiz questions about the book "${book.title}" (${metadata?.pageCount || 100} pages).

Content: ${combinedContext}

Each question should have:
- A clear, thought-provoking question
- 4 well-crafted options (A, B, C, D)
- The correct answer
- A DETAILED explanation (3-5 sentences) explaining why the answer is correct and providing context from the book

Cover all major aspects of the book proportional to its ${metadata?.pageCount || 100} pages.

Respond ONLY with valid JSON in this format:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Detailed explanation with context from the book..."
    }
  ]
}`;

    const messages: BobChatMessage[] = [
      { role: 'system', content: 'You are a quiz generator expert. Create comprehensive questions with detailed explanations. Respond only with valid JSON.' },
      { role: 'user', content: prompt },
    ];

    const response = await bobChat(messages, 0.5, maxTokens);
    
    let result;
    try {
      result = JSON.parse(response);
    } catch (parseError) {
      result = {
        questions: [
          {
            id: 1,
            question: 'What is the main theme of this book?',
            options: ['Theme A', 'Theme B', 'Theme C', 'Theme D'],
            correctAnswer: 'Theme A',
            explanation: 'This is the primary theme discussed throughout the book.',
          },
        ],
      };
    }

    console.log(`✅ Generated ${result.questions?.length || 0} quiz questions`);
    res.json(result);
  } catch (error: any) {
    console.error('❌ Error generating quiz:', error);
    res.status(500).json({
      error: 'Failed to generate quiz',
      details: error.message,
    });
  }
};

/**
 * Get speed reading content
 */
export const getSpeedReading = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = (req.app.locals.books as Map<string, any>)?.get(id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    console.log(`⚡ Generating speed reading content for book "${book.title}"...`);

    const metadata = book.metadata;
    
    // Get more context based on book size
    const chunkCount = metadata
      ? metadataExtractor.getOptimalChunkCount(metadata, 'speedReading')
      : 30;
    
    const context = await ragService.getRelevantContext(id, 'key points main ideas chapters concepts', chunkCount);
    const combinedContext = context.join('\n\n');

    // Calculate content amounts based on book size
    const sentenceCount = Math.min(50, Math.max(15, Math.ceil((metadata?.pageCount || 100) / 5)));
    const termCount = Math.min(25, Math.max(10, Math.ceil((metadata?.pageCount || 100) / 10)));
    
    // Calculate proportional response length
    const maxTokens = metadata
      ? metadataExtractor.calculateResponseLength(metadata, 'speedReading')
      : 3000;

    // Generate comprehensive speed reading content using AI
    const prompt = `Extract COMPREHENSIVE speed reading content from the book "${book.title}" (${metadata?.pageCount || 100} pages, ${metadata?.chapterCount || 1} chapters).

Content: ${combinedContext}

Provide DETAILED content proportional to the book's ${metadata?.pageCount || 100} pages:

1. A comprehensive TL;DR summary (${Math.ceil((metadata?.pageCount || 100) / 50)} paragraphs)
2. ${sentenceCount} most important sentences from throughout the book
3. ${termCount} important terms with detailed definitions
4. Detailed summaries for ALL ${metadata?.chapterCount || 1} chapters/sections

Respond ONLY with valid JSON in this format:
{
  "tldr": "Comprehensive multi-paragraph summary",
  "keySentences": ["sentence1", "sentence2", ...],
  "importantTerms": [
    {"term": "term1", "definition": "detailed definition with context"},
    ...
  ],
  "chapterSummaries": [
    {"chapter": "Chapter 1", "summary": "detailed summary covering key points"},
    ...
  ]
}`;

    const messages: BobChatMessage[] = [
      { role: 'system', content: 'You are a speed reading expert. Provide comprehensive, detailed content. Respond only with valid JSON.' },
      { role: 'user', content: prompt },
    ];

    const response = await bobChat(messages, 0.3, maxTokens);
    
    let result;
    try {
      result = JSON.parse(response);
    } catch (parseError) {
      result = {
        tldr: 'This book explores important concepts and ideas.',
        keySentences: ['Key information from the book.'],
        importantTerms: [{ term: 'Concept', definition: 'An important idea from the book.' }],
        chapterSummaries: [{ chapter: 'Overview', summary: 'Main ideas from the book.' }],
      };
    }

    console.log(`✅ Generated speed reading content`);
    res.json(result);
  } catch (error: any) {
    console.error('❌ Error generating speed reading content:', error);
    res.status(500).json({
      error: 'Failed to generate speed reading content',
      details: error.message,
    });
  }
};

// Made with Bob