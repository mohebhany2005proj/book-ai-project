import { bobChat, BobChatMessage } from '../config/llm';
import { EmbeddingService } from './embeddingService';
import SimpleVectorStore from './simpleVectorStore';
import { ChatResponse, ChatMessage } from '../types';

export class RAGService {
  private embeddingService: EmbeddingService;
  private vectorStore: SimpleVectorStore;
  private topK: number;

  constructor(topK: number = 5) {
    this.embeddingService = new EmbeddingService();
    this.vectorStore = new SimpleVectorStore();
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
   * Answer a question using RAG with conversation history
   */
  async answerQuestion(
    bookId: string,
    bookTitle: string,
    question: string,
    conversationHistory: ChatMessage[] = []
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

      // Search for relevant chunks
      const collectionName = `book_${bookId}`;
      const searchResults = await this.vectorStore.searchSimilar(
        collectionName,
        queryEmbedding,
        this.topK
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

      // Create prompt with conversation history
      const systemPrompt = this.createSystemPrompt(bookTitle, isArabic);
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

      // Generate answer
      const answer = await bobChat(messages, 0.7, 1500);

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
   * Create system prompt for the AI with bilingual support
   */
  private createSystemPrompt(bookTitle: string, isArabic: boolean = false): string {
    if (isArabic) {
      return `أنت مساعد ذكي متخصص في الإجابة على الأسئلة حول كتاب "${bookTitle}".

القواعد المهمة:
1. أجب على الأسئلة بناءً فقط على السياق المقدم من الكتاب
2. إذا لم تكن الإجابة في السياق المقدم، قل "هذه المعلومات غير مذكورة في الكتاب"
3. كن دقيقاً واستشهد بمعلومات محددة من السياق
4. لا تختلق معلومات أو تستخدم معرفة خارجية
5. اجعل الإجابات واضحة وموجزة
6. إذا كان السياق غير واضح أو غير كافٍ، اعترف بهذا القيد
7. استخدم النقاط والفقرات لتنظيم إجاباتك بشكل واضح
8. يمكنك فهم والإجابة على الأسئلة بالعربية والإنجليزية

تنسيق الإجابة:
- استخدم النقاط (•) للقوائم والنقاط الرئيسية
- استخدم الفقرات للشروحات المفصلة
- نظم المعلومات بشكل منطقي وسهل القراءة

هدفك هو مساعدة المستخدمين على فهم محتوى الكتاب بدقة.`;
    } else {
      return `You are an AI assistant specialized in answering questions about the book "${bookTitle}".

IMPORTANT RULES:
1. Answer questions ONLY based on the context provided from the book
2. If the answer is not in the provided context, say "This information is not mentioned in the book"
3. Be accurate and cite specific information from the context
4. Do not make up information or use external knowledge
5. Keep answers clear and concise
6. If the context is unclear or insufficient, acknowledge this limitation
7. Use bullet points and paragraphs to organize your answers clearly
8. You can understand and respond to questions in both English and Arabic

Response Formatting:
- Use bullet points (•) for lists and key points
- Use paragraphs for detailed explanations
- Organize information logically and make it easy to read

Your goal is to help users understand the book's content accurately.`;
    }
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
   * Generate a summary of the book
   */
  async generateBookSummary(
    bookId: string,
    bookTitle: string,
    maxChunks: number = 10
  ): Promise<string> {
    try {
      console.log(`📝 Generating summary for book "${bookTitle}"...`);

      const collectionName = `book_${bookId}`;
      
      // Get first few chunks as they usually contain introduction
      const allDocs = await this.vectorStore.getAllDocuments(collectionName);
      
      if (allDocs.documents.length === 0) {
        return 'No content available to generate summary.';
      }

      const chunks = allDocs.documents.slice(0, Math.min(maxChunks, allDocs.documents.length));
      const context = chunks.join('\n\n');

      const messages: BobChatMessage[] = [
        {
          role: 'system',
          content: `You are a helpful assistant that creates concise summaries of books.`,
        },
        {
          role: 'user',
          content: `Based on the following excerpts from the book "${bookTitle}", provide a brief summary (2-3 paragraphs) of what the book is about:\n\n${context}`,
        },
      ];

      const summary = await bobChat(messages, 0.7, 500);
      
      console.log(`✅ Generated summary for "${bookTitle}"`);
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
