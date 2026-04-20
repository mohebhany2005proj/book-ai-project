import { Collection } from 'chromadb';
import { createCollection, deleteCollection } from '../config/database';
import { SearchResult } from '../types';

export class VectorStoreService {
  /**
   * Store embeddings in ChromaDB collection in batches to reduce memory usage
   */
  async storeEmbeddings(
    collectionName: string,
    embeddings: number[][],
    texts: string[],
    metadatas: any[]
  ): Promise<void> {
    try {
      const collection = await createCollection(collectionName);
      const batchSize = 5; // Store 5 embeddings at a time to reduce memory usage

      console.log(`💾 Storing ${embeddings.length} embeddings in collection "${collectionName}" (batch size: ${batchSize})...`);

      // Process in batches
      for (let i = 0; i < embeddings.length; i += batchSize) {
        const end = Math.min(i + batchSize, embeddings.length);
        const batchEmbeddings = embeddings.slice(i, end);
        const batchTexts = texts.slice(i, end);
        const batchMetadatas = metadatas.slice(i, end);
        const batchIds = batchEmbeddings.map((_, index) => `chunk_${i + index}`);

        // Add batch to collection
        await collection.add({
          ids: batchIds,
          embeddings: batchEmbeddings,
          documents: batchTexts,
          metadatas: batchMetadatas,
        });

        console.log(`  ✓ Stored batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(embeddings.length / batchSize)} (${end}/${embeddings.length} embeddings)`);

        // Small delay between batches to allow garbage collection
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`✅ Successfully stored all ${embeddings.length} embeddings`);
    } catch (error: any) {
      console.error(`❌ Error storing embeddings:`, error.message);
      throw error;
    }
  }

  /**
   * Search for similar chunks in the collection
   */
  async searchSimilar(
    collectionName: string,
    queryEmbedding: number[],
    topK: number = 5
  ): Promise<SearchResult[]> {
    try {
      const collection = await createCollection(collectionName);

      const results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: topK,
      });

      // Transform results
      const searchResults: SearchResult[] = [];

      if (results.documents && results.documents[0]) {
        for (let i = 0; i < results.documents[0].length; i++) {
          searchResults.push({
            content: results.documents[0][i] || '',
            score: results.distances?.[0]?.[i] || 0,
            metadata: results.metadatas?.[0]?.[i] || {},
          });
        }
      }

      console.log(`🔍 Found ${searchResults.length} similar chunks`);
      return searchResults;
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
      const collection = await createCollection(collectionName);
      const count = await collection.count();

      return {
        name: collectionName,
        count,
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
      await deleteCollection(collectionName);
      console.log(`✅ Deleted collection "${collectionName}"`);
    } catch (error: any) {
      console.error(`❌ Error deleting collection:`, error.message);
      throw error;
    }
  }

  /**
   * Check if collection exists
   */
  async collectionExists(collectionName: string): Promise<boolean> {
    try {
      await createCollection(collectionName);
      return true;
    } catch (error) {
      return false;
    }
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
      const collection = await createCollection(collectionName);
      const count = await collection.count();

      if (count === 0) {
        return { ids: [], documents: [], metadatas: [] };
      }

      const results = await collection.get({
        limit: count,
      });

      return {
        ids: results.ids || [],
        documents: results.documents || [],
        metadatas: results.metadatas || [],
      };
    } catch (error: any) {
      console.error(`❌ Error getting all documents:`, error.message);
      throw error;
    }
  }

  /**
   * Update collection metadata
   */
  async updateCollectionMetadata(
    collectionName: string,
    metadata: Record<string, any>
  ): Promise<void> {
    try {
      const collection = await createCollection(collectionName);
      await collection.modify({ metadata });
      console.log(`✅ Updated metadata for collection "${collectionName}"`);
    } catch (error: any) {
      console.error(`❌ Error updating collection metadata:`, error.message);
      throw error;
    }
  }
}

export default VectorStoreService;

// Made with Bob
