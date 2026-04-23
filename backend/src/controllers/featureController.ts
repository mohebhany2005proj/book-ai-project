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
    
    // Safe chunk count with fallback
    const chunkCount = metadata
      ? Math.min(metadataExtractor.getOptimalChunkCount(metadata, 'insights'), 20)
      : 15; // Safe default
    
    const context = await ragService.getRelevantContext(id, 'summary themes characters key concepts', chunkCount);
    const combinedContext = context.join('\n\n');

    // Safe token limit with cap
    const maxTokens = metadata
      ? Math.min(metadataExtractor.calculateResponseLength(metadata, 'insights'), 2500)
      : 2000; // Safe default

    const author = metadata?.author ? ` by ${metadata.author}` : '';
    const pages = metadata?.pageCount ? ` (${metadata.pageCount} pages)` : '';

    // Simplified, reliable prompt
    const prompt = `Analyze the book "${book.title}"${author}${pages} and provide insights in JSON format.

Book Content:
${combinedContext}

Provide a detailed analysis with:
1. A comprehensive summary (3-5 paragraphs covering the main ideas)
2. Main themes (3-5 key themes with explanations)
3. Key characters or entities (3-5 important ones with descriptions)
4. Important quotes (5-7 memorable quotes with brief context)

Respond ONLY with valid JSON in this exact format:
{
  "summary": "Multi-paragraph book summary here",
  "themes": ["theme1: explanation", "theme2: explanation", "theme3: explanation"],
  "characters": ["character1: description", "character2: description"],
  "keyQuotes": ["quote1 - context", "quote2 - context"]
}`;

    const messages: BobChatMessage[] = [
      { role: 'system', content: 'You are a book analysis expert. Provide detailed, comprehensive analysis. Respond only with valid JSON.' },
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
    
    // Safe chunk count with fallback
    const chunkCount = metadata
      ? Math.min(metadataExtractor.getOptimalChunkCount(metadata, 'summaryCards'), 15)
      : 10; // Safe default
    
    const context = await ragService.getRelevantContext(id, 'main ideas key concepts chapters', chunkCount);
    const combinedContext = context.join('\n\n');

    // Reasonable card count
    const cardCount = 7; // Fixed, reliable count
    
    // Safe token limit
    const maxTokens = metadata
      ? Math.min(metadataExtractor.calculateResponseLength(metadata, 'summaryCards'), 2000)
      : 1500; // Safe default

    // Simplified prompt
    const prompt = `Create ${cardCount} visual summary cards for the book "${book.title}".

Content: ${combinedContext}

Each card should have:
- A short, catchy title (3-5 words)
- A detailed description (2-3 sentences with key insights)
- An appropriate emoji icon

Cover the main aspects of the book.

Respond ONLY with valid JSON in this format:
{
  "cards": [
    {
      "id": 1,
      "title": "Card Title",
      "content": "Detailed description with key insights",
      "icon": "📖"
    }
  ]
}`;

    const messages: BobChatMessage[] = [
      { role: 'system', content: 'You are a content summarization expert. Create detailed, engaging cards. Respond only with valid JSON.' },
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
    
    // Safe chunk count with fallback
    const chunkCount = metadata
      ? Math.min(metadataExtractor.getOptimalChunkCount(metadata, 'quiz'), 15)
      : 12; // Safe default
    
    const context = await ragService.getRelevantContext(id, 'main concepts facts details key points', chunkCount);
    const combinedContext = context.join('\n\n');

    // Fixed, reliable question count
    const questionCount = 10;
    
    // Safe token limit
    const maxTokens = metadata
      ? Math.min(metadataExtractor.calculateResponseLength(metadata, 'quiz'), 2500)
      : 2000; // Safe default

    // Simplified prompt
    const prompt = `Create ${questionCount} multiple-choice quiz questions about the book "${book.title}".

Content: ${combinedContext}

Each question should have:
- A clear question
- 4 options (A, B, C, D)
- The correct answer
- A detailed explanation (2-3 sentences) explaining why the answer is correct

Respond ONLY with valid JSON in this format:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Detailed explanation with context..."
    }
  ]
}`;

    const messages: BobChatMessage[] = [
      { role: 'system', content: 'You are a quiz generator expert. Create clear questions with detailed explanations. Respond only with valid JSON.' },
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
    
    // Safe chunk count with fallback
    const chunkCount = metadata
      ? Math.min(metadataExtractor.getOptimalChunkCount(metadata, 'speedReading'), 20)
      : 15; // Safe default
    
    const context = await ragService.getRelevantContext(id, 'key points main ideas chapters concepts', chunkCount);
    const combinedContext = context.join('\n\n');

    // Fixed, reliable counts
    const sentenceCount = 15;
    const termCount = 10;
    
    // Safe token limit
    const maxTokens = metadata
      ? Math.min(metadataExtractor.calculateResponseLength(metadata, 'speedReading'), 2500)
      : 2000; // Safe default

    // Simplified prompt
    const prompt = `Extract speed reading content from the book "${book.title}".

Content: ${combinedContext}

Provide:
1. A comprehensive TL;DR summary (3-4 paragraphs)
2. ${sentenceCount} most important sentences from the book
3. ${termCount} important terms with definitions
4. Chapter summaries (3-5 main sections)

Respond ONLY with valid JSON in this format:
{
  "tldr": "Multi-paragraph summary",
  "keySentences": ["sentence1", "sentence2", ...],
  "importantTerms": [
    {"term": "term1", "definition": "definition with context"},
    ...
  ],
  "chapterSummaries": [
    {"chapter": "Chapter 1", "summary": "summary covering key points"},
    ...
  ]
}`;

    const messages: BobChatMessage[] = [
      { role: 'system', content: 'You are a speed reading expert. Provide detailed, comprehensive content. Respond only with valid JSON.' },
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