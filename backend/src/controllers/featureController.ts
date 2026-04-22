import { Request, Response } from 'express';
import { bobChat, BobChatMessage } from '../config/llm';
import RAGService from '../services/ragService';

const ragService = new RAGService();

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

    // Get relevant context from the book
    const context = await ragService.getRelevantContext(id, 'summary themes characters', 10);
    const combinedContext = context.join('\n\n');

    // Generate insights using AI
    const prompt = `Analyze the following book content and extract insights in JSON format.

Book: "${book.title}"
Content: ${combinedContext}

Provide:
1. A brief summary (2-3 sentences)
2. Main themes (3-5 themes)
3. Key characters or entities (if applicable, 3-5 items)
4. Important quotes (3-5 quotes)

Respond ONLY with valid JSON in this exact format:
{
  "summary": "Brief book summary here",
  "themes": ["theme1", "theme2", "theme3"],
  "characters": ["character1", "character2"],
  "keyQuotes": ["quote1", "quote2", "quote3"]
}`;

    const messages: BobChatMessage[] = [
      { role: 'system', content: 'You are a book analysis expert. Respond only with valid JSON.' },
      { role: 'user', content: prompt },
    ];

    const response = await bobChat(messages, 0.3, 2000);
    
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

    // Get relevant context
    const context = await ragService.getRelevantContext(id, 'main ideas key concepts', 8);
    const combinedContext = context.join('\n\n');

    // Generate cards using AI
    const prompt = `Create 5-7 visual summary cards for the book "${book.title}".

Content: ${combinedContext}

Each card should have:
- A short, catchy title (3-5 words)
- A brief, engaging description (1-2 sentences)
- An appropriate emoji icon

Respond ONLY with valid JSON in this format:
{
  "cards": [
    {
      "id": 1,
      "title": "Card Title",
      "content": "Brief engaging description",
      "icon": "📖"
    }
  ]
}`;

    const messages: BobChatMessage[] = [
      { role: 'system', content: 'You are a content summarization expert. Respond only with valid JSON.' },
      { role: 'user', content: prompt },
    ];

    const response = await bobChat(messages, 0.7, 2000);
    
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

    // Get relevant context
    const context = await ragService.getRelevantContext(id, 'main concepts facts details', 10);
    const combinedContext = context.join('\n\n');

    // Generate quiz using AI
    const prompt = `Create 10 multiple-choice quiz questions about the book "${book.title}".

Content: ${combinedContext}

Each question should have:
- A clear question
- 4 options (A, B, C, D)
- The correct answer
- A brief explanation

Respond ONLY with valid JSON in this format:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Why this is correct..."
    }
  ]
}`;

    const messages: BobChatMessage[] = [
      { role: 'system', content: 'You are a quiz generator expert. Respond only with valid JSON.' },
      { role: 'user', content: prompt },
    ];

    const response = await bobChat(messages, 0.5, 3000);
    
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

    // Get relevant context
    const context = await ragService.getRelevantContext(id, 'key points main ideas', 15);
    const combinedContext = context.join('\n\n');

    // Generate speed reading content using AI
    const prompt = `Extract speed reading content from the book "${book.title}".

Content: ${combinedContext}

Provide:
1. A one-paragraph TL;DR summary
2. 10 most important sentences
3. 5-7 important terms with definitions
4. Brief summaries for main sections/chapters

Respond ONLY with valid JSON in this format:
{
  "tldr": "One paragraph summary",
  "keySentences": ["sentence1", "sentence2", ...],
  "importantTerms": [
    {"term": "term1", "definition": "definition1"},
    ...
  ],
  "chapterSummaries": [
    {"chapter": "Chapter 1", "summary": "brief summary"},
    ...
  ]
}`;

    const messages: BobChatMessage[] = [
      { role: 'system', content: 'You are a speed reading expert. Respond only with valid JSON.' },
      { role: 'user', content: prompt },
    ];

    const response = await bobChat(messages, 0.3, 3000);
    
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