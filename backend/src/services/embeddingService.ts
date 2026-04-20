import { bobEmbedding, bobBatchEmbeddings } from '../config/llm';
import { DocumentChunk } from '../types';

export class EmbeddingService {
  /**
   * Generate embedding for a single text
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const embedding = await bobEmbedding(text);
      return embedding;
    } catch (error: any) {
      console.error('❌ Error generating embedding:', error.message);
      throw error;
    }
  }

  /**
   * Generate embeddings for multiple texts in batches
   */
  async generateBatchEmbeddings(
    texts: string[],
    batchSize: number = 10
  ): Promise<number[][]> {
    const embeddings: number[][] = [];
    
    console.log(`🔄 Generating embeddings for ${texts.length} texts in batches of ${batchSize}...`);

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      
      try {
        const batchEmbeddings = await bobBatchEmbeddings(batch);
        embeddings.push(...batchEmbeddings);
        
        console.log(`✅ Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(texts.length / batchSize)}`);
        
        // Small delay to avoid rate limiting
        if (i + batchSize < texts.length) {
          await this.delay(100);
        }
      } catch (error: any) {
        console.error(`❌ Error in batch ${Math.floor(i / batchSize) + 1}:`, error.message);
        throw error;
      }
    }

    console.log(`✅ Generated ${embeddings.length} embeddings`);
    return embeddings;
  }

  /**
   * Generate embeddings for document chunks
   */
  async generateChunkEmbeddings(chunks: DocumentChunk[]): Promise<{
    embeddings: number[][];
    texts: string[];
    metadatas: any[];
  }> {
    const texts = chunks.map(chunk => chunk.content);
    const metadatas = chunks.map(chunk => chunk.metadata);

    console.log(`📊 Generating embeddings for ${chunks.length} chunks...`);

    const embeddings = await this.generateBatchEmbeddings(texts);

    return {
      embeddings,
      texts,
      metadatas,
    };
  }

  /**
   * Utility function to add delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Validate embedding dimensions
   */
  validateEmbedding(embedding: number[]): boolean {
    if (!Array.isArray(embedding)) {
      return false;
    }
    
    if (embedding.length === 0) {
      return false;
    }

    // Check if all elements are numbers
    return embedding.every(val => typeof val === 'number' && !isNaN(val));
  }

  /**
   * Get embedding statistics
   */
  getEmbeddingStats(embeddings: number[][]): {
    count: number;
    dimensions: number;
    avgMagnitude: number;
  } {
    if (embeddings.length === 0) {
      return { count: 0, dimensions: 0, avgMagnitude: 0 };
    }

    const dimensions = embeddings[0].length;
    
    // Calculate average magnitude
    const magnitudes = embeddings.map(emb => 
      Math.sqrt(emb.reduce((sum, val) => sum + val * val, 0))
    );
    const avgMagnitude = magnitudes.reduce((sum, mag) => sum + mag, 0) / magnitudes.length;

    return {
      count: embeddings.length,
      dimensions,
      avgMagnitude,
    };
  }
}

export default EmbeddingService;

// Made with Bob
