import fs from 'fs';
import path from 'path';
import { SearchResult } from '../types';

interface VectorDocument {
  id: string;
  embedding: number[];
  text: string;
  metadata: any;
}

interface Collection {
  name: string;
  documents: VectorDocument[];
}

export class SimpleVectorStore {
  private storePath: string;

  constructor() {
    this.storePath = path.join(process.cwd(), 'vector_store');
    if (!fs.existsSync(this.storePath)) {
      fs.mkdirSync(this.storePath, { recursive: true });
    }
  }

  private getCollectionPath(collectionName: string): string {
    return path.join(this.storePath, `${collectionName}.json`);
  }

  private loadCollection(collectionName: string): Collection {
    const filePath = this.getCollectionPath(collectionName);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
    return { name: collectionName, documents: [] };
  }

  private saveCollection(collection: Collection): void {
    const filePath = this.getCollectionPath(collection.name);
    fs.writeFileSync(filePath, JSON.stringify(collection, null, 2));
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Store embeddings in collection
   */
  async storeEmbeddings(
    collectionName: string,
    embeddings: number[][],
    texts: string[],
    metadatas: any[]
  ): Promise<void> {
    try {
      console.log(`💾 Storing ${embeddings.length} embeddings in collection "${collectionName}"...`);

      const collection = this.loadCollection(collectionName);

      for (let i = 0; i < embeddings.length; i++) {
        collection.documents.push({
          id: `chunk_${i}`,
          embedding: embeddings[i],
          text: texts[i],
          metadata: metadatas[i],
        });
      }

      this.saveCollection(collection);
      console.log(`✅ Successfully stored ${embeddings.length} embeddings`);
    } catch (error: any) {
      console.error(`❌ Error storing embeddings:`, error.message);
      throw error;
    }
  }

  /**
   * Search for similar chunks
   */
  async searchSimilar(
    collectionName: string,
    queryEmbedding: number[],
    topK: number = 5
  ): Promise<SearchResult[]> {
    try {
      const collection = this.loadCollection(collectionName);

      if (collection.documents.length === 0) {
        return [];
      }

      // Calculate similarities
      const results = collection.documents.map(doc => ({
        content: doc.text,
        score: this.cosineSimilarity(queryEmbedding, doc.embedding),
        metadata: doc.metadata,
      }));

      // Sort by similarity (highest first) and take top K
      results.sort((a, b) => b.score - a.score);
      const topResults = results.slice(0, topK);

      console.log(`🔍 Found ${topResults.length} similar chunks`);
      return topResults;
    } catch (error: any) {
      console.error(`❌ Error searching collection:`, error.message);
      throw error;
    }
  }

  /**
   * Get collection information
   */
  async getCollectionInfo(collectionName: string): Promise<{
    name: string;
    count: number;
  }> {
    try {
      const collection = this.loadCollection(collectionName);
      return {
        name: collectionName,
        count: collection.documents.length,
      };
    } catch (error: any) {
      console.error(`❌ Error getting collection info:`, error.message);
      throw error;
    }
  }

  /**
   * Delete a collection
   */
  async deleteBookCollection(collectionName: string): Promise<void> {
    try {
      const filePath = this.getCollectionPath(collectionName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`✅ Deleted collection "${collectionName}"`);
      }
    } catch (error: any) {
      console.error(`❌ Error deleting collection:`, error.message);
      throw error;
    }
  }

  /**
   * Check if collection exists
   */
  async collectionExists(collectionName: string): Promise<boolean> {
    const filePath = this.getCollectionPath(collectionName);
    return fs.existsSync(filePath);
  }

  /**
   * Get all documents from a collection
   */
  async getAllDocuments(collectionName: string): Promise<{
    ids: string[];
    documents: string[];
    metadatas: any[];
  }> {
    try {
      const collection = this.loadCollection(collectionName);
      return {
        ids: collection.documents.map(doc => doc.id),
        documents: collection.documents.map(doc => doc.text),
        metadatas: collection.documents.map(doc => doc.metadata),
      };
    } catch (error: any) {
      console.error(`❌ Error getting all documents:`, error.message);
      throw error;
    }
  }
}

export default SimpleVectorStore;

// Made with Bob
