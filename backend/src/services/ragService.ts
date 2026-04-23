import { bobChat, BobChatMessage } from '../config/llm';
import { EmbeddingService } from './embeddingService';
import SimpleVectorStore from './simpleVectorStore';
import { ChatResponse, ChatMessage, ReadingMode, BookMetadata } from '../types';
import MetadataExtractor from './metadataExtractor';

export class RAGService {
  private embeddingService: EmbeddingService;
  private vectorStore: SimpleVectorStore;
  private metadataExtractor: MetadataExtractor;
  private topK: number;

  constructor(topK: number = 20) { // Increased from 5 to 20 for better context
    this.embeddingService = new EmbeddingService();
    this.vectorStore = new SimpleVectorStore();
    this.metadataExtractor = new MetadataExtractor();
    this.topK = topK;
  }

  /**
   * Detect if message is a casual greeting or small talk
   */
  private isCasualConversation(message: string): boolean {
    const lowerMessage = message.toLowerCase().trim();
    const casualPatterns = [
      // English greetings
      'hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon',
      'good evening', 'how are you', 'how do you do', 'what\'s up', 'whats up',
      'sup', 'yo', 'howdy',
      // Arabic greetings
      'مرحبا', 'مرحباً', 'أهلا', 'أهلاً', 'السلام عليكم', 'سلام', 'صباح الخير',
      'مساء الخير', 'كيف حالك', 'كيف الحال', 'شلونك', 'كيفك',
      // Common questions
      'who are you', 'what are you', 'من أنت', 'ما أنت', 'شو أنت',
      'thank you', 'thanks', 'شكرا', 'شكراً', 'bye', 'goodbye', 'مع السلامة'
    ];

    return casualPatterns.some(pattern =>
      lowerMessage.includes(pattern) || lowerMessage === pattern
    );
  }

  /**
   * Generate casual conversation response
   */
  private async generateCasualResponse(
    message: string,
    bookTitle: string
  ): Promise<string> {
    const lowerMessage = message.toLowerCase().trim();
    
    // Detect language (simple heuristic: if contains Arabic characters)
    const isArabic = /[\u0600-\u06FF]/.test(message);
    
    if (isArabic) {
      // Arabic responses
      if (lowerMessage.includes('مرحب') || lowerMessage.includes('أهل') ||
          lowerMessage.includes('سلام')) {
        return `مرحباً! 👋 أنا مساعد ذكي متخصص في الإجابة على أسئلتك حول كتاب "${bookTitle}". كيف يمكنني مساعدتك اليوم؟`;
      }
      if (lowerMessage.includes('كيف حالك') || lowerMessage.includes('كيف الحال')) {
        return `أنا بخير، شكراً لسؤالك! 😊 أنا هنا لمساعدتك في استكشاف محتوى كتاب "${bookTitle}". ما الذي تود معرفته؟`;
      }
      if (lowerMessage.includes('من أنت') || lowerMessage.includes('ما أنت')) {
        return `أنا مساعد ذكي مصمم لمساعدتك في فهم واستكشاف كتاب "${bookTitle}". يمكنني الإجابة على أسئلتك بناءً على محتوى الكتاب. اسألني أي شيء!`;
      }
      if (lowerMessage.includes('شكر')) {
        return `العفو! 😊 سعيد بمساعدتك. هل لديك أي أسئلة أخرى حول الكتاب؟`;
      }
      if (lowerMessage.includes('مع السلامة') || lowerMessage === 'باي') {
        return `مع السلامة! 👋 أتمنى أن تكون قد استفدت من قراءة "${bookTitle}". عد في أي وقت!`;
      }
      return `مرحباً! أنا هنا لمساعدتك في فهم كتاب "${bookTitle}". اسألني أي سؤال عن محتوى الكتاب وسأجيبك بناءً على ما ورد فيه.`;
    } else {
      // English responses
      if (lowerMessage.includes('hi') || lowerMessage.includes('hello') ||
          lowerMessage.includes('hey') || lowerMessage.includes('greetings')) {
        return `Hello! 👋 I'm an AI assistant specialized in answering questions about the book "${bookTitle}". How can I help you today?`;
      }
      if (lowerMessage.includes('how are you')) {
        return `I'm doing great, thank you for asking! 😊 I'm here to help you explore the content of "${bookTitle}". What would you like to know?`;
      }
      if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you')) {
        return `I'm an AI assistant designed to help you understand and explore the book "${bookTitle}". I can answer your questions based on the book's content. Ask me anything!`;
      }
      if (lowerMessage.includes('thank')) {
        return `You're welcome! 😊 Happy to help. Do you have any other questions about the book?`;
      }
      if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
        return `Goodbye! 👋 I hope you enjoyed reading "${bookTitle}". Come back anytime!`;
      }
      return `Hello! I'm here to help you understand the book "${bookTitle}". Ask me any question about the book's content and I'll answer based on what's written in it.`;
    }
  }

  /**
   * Answer a question using RAG with conversation history and reading mode
   */
  async answerQuestion(
    bookId: string,
    bookTitle: string,
    question: string,
    conversationHistory: ChatMessage[] = [],
    readingMode?: ReadingMode,
    metadata?: BookMetadata
  ): Promise<ChatResponse> {
    try {
      console.log(`🤔 Processing question for book "${bookTitle}": ${question}`);

      // Check if this is casual conversation
      if (this.isCasualConversation(question)) {
        console.log(`💬 Detected casual conversation`);
        const casualResponse = await this.generateCasualResponse(question, bookTitle);
        return {
          answer: casualResponse,
          sources: [],
          bookTitle,
        };
      }

      // Generate embedding for the question
      const queryEmbedding = await this.embeddingService.generateEmbedding(question);

      // Search for relevant chunks (use more chunks if metadata available)
      const collectionName = `book_${bookId}`;
      const chunkCount = metadata
        ? this.metadataExtractor.getOptimalChunkCount(metadata, 'chat')
        : this.topK;
      
      const searchResults = await this.vectorStore.searchSimilar(
        collectionName,
        queryEmbedding,
        chunkCount
      );

      // Detect language
      const isArabic = /[\u0600-\u06FF]/.test(question);

      if (searchResults.length === 0) {
        const noResultMessage = isArabic
          ? 'لم أتمكن من العثور على معلومات ذات صلة في الكتاب للإجابة على هذا السؤال.'
          : 'I could not find any relevant information in the book to answer this question.';
        return {
          answer: noResultMessage,
          sources: [],
          bookTitle,
        };
      }

      // Prepare context from search results
      const context = searchResults
        .map((result, index) => `[${index + 1}] ${result.content}`)
        .join('\n\n');

      // Create prompt with conversation history, reading mode, and metadata
      const systemPrompt = this.createSystemPrompt(bookTitle, isArabic, readingMode, metadata);
      const userPrompt = this.createUserPrompt(context, question, conversationHistory, isArabic);

      const messages: BobChatMessage[] = [
        { role: 'system', content: systemPrompt },
      ];

      // Add conversation history (last 5 messages)
      const recentHistory = conversationHistory.slice(-5);
      for (const msg of recentHistory) {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      }

      // Add current question
      messages.push({ role: 'user', content: userPrompt });

      // Calculate proportional response length
      const maxTokens = metadata
        ? this.metadataExtractor.calculateResponseLength(metadata, 'chat')
        : 1500;

      // Generate answer
      const answer = await bobChat(messages, 0.7, maxTokens);

      // Extract sources
      const sources = searchResults.map(result => result.content.substring(0, 150) + '...');

      console.log(`✅ Generated answer for question`);

      return {
        answer,
        sources,
        bookTitle,
      };
    } catch (error: any) {
      console.error('❌ Error in RAG service:', error.message);
      throw error;
    }
  }

  /**
   * Create system prompt for the AI with bilingual support, reading mode, and metadata
   */
  private createSystemPrompt(
    bookTitle: string,
    isArabic: boolean = false,
    readingMode?: ReadingMode,
    metadata?: BookMetadata
  ): string {
    let basePrompt = '';
    let modeInstructions = '';
    let metadataContext = '';

    // Add metadata context if available
    if (metadata) {
      const author = metadata.author ? ` by ${metadata.author}` : '';
      const pages = metadata.pageCount ? `\n- Total Pages: ${metadata.pageCount}` : '';
      const chapters = metadata.chapterCount ? `\n- Chapters: ${metadata.chapterCount}` : '';
      const words = metadata.wordCount ? `\n- Word Count: ${metadata.wordCount.toLocaleString()}` : '';
      const toc = metadata.tableOfContents ? `\n\nTable of Contents:\n${metadata.tableOfContents}` : '';
      
      metadataContext = isArabic
        ? `\n\nمعلومات الكتاب:${author}${pages}${chapters}${words}${toc}`
        : `\n\nBook Information:${author}${pages}${chapters}${words}${toc}`;
    }

    // Get mode-specific instructions
    if (readingMode === 'quick') {
      modeInstructions = isArabic
        ? `\n\nوضع القراءة السريعة:
- قدم إجابات موجزة ومركزة (3-5 نقاط رئيسية كحد أقصى)
- استخدم النقاط (•) للأفكار الرئيسية
- اجعل الفقرات قصيرة (2-3 جمل)
- أضف قسم "## الخلاصة الرئيسية" في النهاية
- ركز على الأفكار القابلة للتطبيق`
        : `\n\nQUICK MODE:
- Provide concise, focused answers (3-5 key points maximum)
- Use bullet points (•) for main ideas
- Keep paragraphs short (2-3 sentences)
- Always include a "## Key Takeaway" section at the end
- Focus on actionable insights`;
    } else if (readingMode === 'deep') {
      modeInstructions = isArabic
        ? `\n\nوضع التحليل العميق:
- قدم شروحات شاملة ومفصلة
- أضف أمثلة وسياق من الكتاب
- اشرح الروابط بين المفاهيم
- استخدم أقسام منظمة (##، ###)
- قدم أدلة داعمة من النص`
        : `\n\nDEEP DIVE MODE:
- Provide comprehensive, detailed explanations
- Include relevant examples and context from the book
- Explain connections between concepts
- Use structured sections (##, ###)
- Provide supporting evidence from the text`;
    } else if (readingMode === 'story') {
      modeInstructions = isArabic
        ? `\n\nوضع القصة:
- استخدم أسلوب سردي جذاب ومحادثة
- أنشئ تدفقاً طبيعياً
- أضف أوصافاً حية وتشبيهات
- اجعل المحتوى لا يُنسى وجذاباً
- استخدم تقنيات سرد القصص`
        : `\n\nSTORY MODE:
- Use engaging, conversational narrative style
- Create a natural flow
- Include vivid descriptions and analogies
- Make content memorable and engaging
- Use storytelling techniques`;
    }

    if (isArabic) {
      basePrompt = `أنت مساعد ذكي متخصص في الإجابة على الأسئلة حول كتاب "${bookTitle}".${metadataContext}

القواعد المهمة:
1. أجب على الأسئلة بناءً فقط على السياق المقدم من الكتاب
2. إذا لم تكن الإجابة في السياق المقدم، قل "هذه المعلومات غير مذكورة في الكتاب"
3. كن دقيقاً واستشهد بمعلومات محددة من السياق
4. لا تختلق معلومات أو تستخدم معرفة خارجية
5. قدم إجابات شاملة ومفصلة تتناسب مع حجم الكتاب
6. إذا كان السياق غير واضح أو غير كافٍ، اعترف بهذا القيد
7. استخدم النقاط والفقرات لتنظيم إجاباتك بشكل واضح
8. يمكنك فهم والإجابة على الأسئلة بالعربية والإنجليزية

تنسيق الإجابة:
- استخدم ## للعناوين الرئيسية
- استخدم النقاط (•) للقوائم والنقاط الرئيسية
- استخدم الفقرات للشروحات المفصلة
- نظم المعلومات بشكل منطقي وسهل القراءة
- قدم إجابات طويلة ومفصلة تعكس عمق محتوى الكتاب${modeInstructions}

هدفك هو مساعدة المستخدمين على فهم محتوى الكتاب بدقة وشمولية.`;
    } else {
      basePrompt = `You are an AI assistant specialized in answering questions about the book "${bookTitle}".${metadataContext}

IMPORTANT RULES:
1. Answer questions ONLY based on the context provided from the book
2. If the answer is not in the provided context, say "This information is not mentioned in the book"
3. Be accurate and cite specific information from the context
4. Do not make up information or use external knowledge
5. Provide comprehensive, detailed answers proportional to the book's size
6. If the context is unclear or insufficient, acknowledge this limitation
7. Use bullet points and paragraphs to organize your answers clearly
8. You can understand and respond to questions in both English and Arabic

Response Formatting:
- Use ## for main headers
- Use bullet points (•) for lists and key points
- Use paragraphs for detailed explanations
- Organize information logically and make it easy to read
- Provide lengthy, detailed responses that reflect the depth of the book's content${modeInstructions}

Your goal is to help users understand the book's content accurately and comprehensively.`;
    }

    return basePrompt;
  }

  /**
   * Create user prompt with context, question, and conversation history
   */
  private createUserPrompt(
    context: string,
    question: string,
    conversationHistory: ChatMessage[] = [],
    isArabic: boolean = false
  ): string {
    if (isArabic) {
      let prompt = `السياق من الكتاب:\n${context}\n\n`;
      
      if (conversationHistory.length > 0) {
        prompt += `المحادثة السابقة:\n`;
        conversationHistory.slice(-3).forEach(msg => {
          const role = msg.role === 'user' ? 'المستخدم' : 'المساعد';
          prompt += `${role}: ${msg.content}\n`;
        });
        prompt += `\n`;
      }
      
      prompt += `السؤال: ${question}\n\n`;
      prompt += `يرجى الإجابة على السؤال بناءً فقط على السياق المقدم أعلاه. إذا لم تكن المعلومات في السياق، اذكر بوضوح أنها غير مذكورة في الكتاب. استخدم النقاط والفقرات لتنظيم إجابتك.`;
      
      return prompt;
    } else {
      let prompt = `Context from the book:\n${context}\n\n`;
      
      if (conversationHistory.length > 0) {
        prompt += `Previous conversation:\n`;
        conversationHistory.slice(-3).forEach(msg => {
          prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
        });
        prompt += `\n`;
      }
      
      prompt += `Question: ${question}\n\n`;
      prompt += `Please answer the question based ONLY on the context provided above. If the information is not in the context, clearly state that it is not mentioned in the book. Use bullet points and paragraphs to organize your answer.`;
      
      return prompt;
    }
  }

  /**
   * Generate a comprehensive summary of the book
   */
  async generateBookSummary(
    bookId: string,
    bookTitle: string,
    metadata?: BookMetadata
  ): Promise<string> {
    try {
      console.log(`📝 Generating summary for book "${bookTitle}"...`);

      const collectionName = `book_${bookId}`;
      
      // Get more chunks based on book size
      const chunkCount = metadata
        ? this.metadataExtractor.getOptimalChunkCount(metadata, 'summary')
        : 30;
      
      const allDocs = await this.vectorStore.getAllDocuments(collectionName);
      
      if (allDocs.documents.length === 0) {
        return 'No content available to generate summary.';
      }

      const chunks = allDocs.documents.slice(0, Math.min(chunkCount, allDocs.documents.length));
      const context = chunks.join('\n\n');

      // Calculate proportional summary length
      const maxTokens = metadata
        ? this.metadataExtractor.calculateResponseLength(metadata, 'summary')
        : 2500;

      const author = metadata?.author ? ` by ${metadata.author}` : '';
      const pages = metadata?.pageCount ? ` (${metadata.pageCount} pages)` : '';
      const chapters = metadata?.chapterCount ? `, ${metadata.chapterCount} chapters` : '';

      const messages: BobChatMessage[] = [
        {
          role: 'system',
          content: `You are a book analysis expert that creates comprehensive, detailed summaries.`,
        },
        {
          role: 'user',
          content: `Create a COMPREHENSIVE and DETAILED summary of the book "${bookTitle}"${author}${pages}${chapters}.

Based on the following content from the book, provide:

1. **Overview** (2-3 paragraphs): What the book is about, its main purpose and themes
2. **Key Concepts** (detailed): Main ideas and arguments presented
3. **Chapter Breakdown** (if applicable): Brief summary of major sections
4. **Important Takeaways**: Key lessons and insights
5. **Conclusion**: Overall significance and impact

Make the summary proportional to the book's length - for a ${metadata?.pageCount || 100}-page book, provide approximately ${Math.ceil((metadata?.pageCount || 100) / 20)} pages worth of summary content.

Book Content:
${context}

Provide a thorough, well-organized summary that captures the essence and depth of the book.`,
        },
      ];

      const summary = await bobChat(messages, 0.7, maxTokens);
      
      console.log(`✅ Generated comprehensive summary for "${bookTitle}" (${maxTokens} tokens)`);
      return summary;
    } catch (error: any) {
      console.error('❌ Error generating summary:', error.message);
      throw error;
    }
  }

  /**
   * Get relevant context for a question without generating an answer
   */
  async getRelevantContext(
    bookId: string,
    question: string,
    topK?: number
  ): Promise<string[]> {
    try {
      const queryEmbedding = await this.embeddingService.generateEmbedding(question);
      const collectionName = `book_${bookId}`;
      
      const searchResults = await this.vectorStore.searchSimilar(
        collectionName,
        queryEmbedding,
        topK || this.topK
      );

      return searchResults.map(result => result.content);
    } catch (error: any) {
      console.error('❌ Error getting relevant context:', error.message);
      throw error;
    }
  }

  /**
   * Validate that a book collection exists and has content
   */
  async validateBookCollection(bookId: string): Promise<boolean> {
    try {
      const collectionName = `book_${bookId}`;
      const info = await this.vectorStore.getCollectionInfo(collectionName);
      return info.count > 0;
    } catch (error) {
      return false;
    }
  }
}

export default RAGService;

// Made with Bob
