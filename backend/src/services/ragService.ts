import { bobChat, BobChatMessage } from '../config/llm';
import { EmbeddingService } from './embeddingService';
import SimpleVectorStore from './simpleVectorStore';
import { ChatResponse } from '../types';

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
   * Answer a question using RAG
   */
  async answerQuestion(
    bookId: string,
    bookTitle: string,
    question: string
  ): Promise<ChatResponse> {
    try {
      console.log(`🤔 Processing question for book "${bookTitle}": ${question}`);

      // Generate embedding for the question
      const queryEmbedding = await this.embeddingService.generateEmbedding(question);

      // Search for relevant chunks
      const collectionName = `book_${bookId}`;
      const searchResults = await this.vectorStore.searchSimilar(
        collectionName,
        queryEmbedding,
        this.topK
      );

      if (searchResults.length === 0) {
        return {
          answer: 'I could not find any relevant information in the book to answer this question.',
          sources: [],
          bookTitle,
        };
      }

      // Prepare context from search results
      const context = searchResults
        .map((result, index) => `[${index + 1}] ${result.content}`)
        .join('\n\n');

      // Create prompt
      const systemPrompt = this.createSystemPrompt(bookTitle);
      const userPrompt = this.createUserPrompt(context, question);

      const messages: BobChatMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ];

      // Generate answer
      const answer = await bobChat(messages, 0.7, 1000);

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
   * Create system prompt for the AI
   */
  private createSystemPrompt(bookTitle: string): string {
    return `You are an AI assistant specialized in answering questions about the book "${bookTitle}".

IMPORTANT RULES:
1. Answer questions ONLY based on the context provided from the book
2. If the answer is not in the provided context, say "This information is not mentioned in the book"
3. Be accurate and cite specific information from the context
4. Do not make up information or use external knowledge
5. Keep answers clear and concise
6. If the context is unclear or insufficient, acknowledge this limitation

Your goal is to help users understand the book's content accurately.`;
  }

  /**
   * Create user prompt with context and question
   */
  private createUserPrompt(context: string, question: string): string {
    return `Context from the book:
${context}

Question: ${question}

Please answer the question based ONLY on the context provided above. If the information is not in the context, clearly state that it is not mentioned in the book.`;
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
