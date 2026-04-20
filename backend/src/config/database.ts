import { ChromaClient } from 'chromadb';
import path from 'path';

let chromaClient: ChromaClient | null = null;

export const getChromaClient = async (): Promise<ChromaClient> => {
  if (!chromaClient) {
    const chromaPath = process.env.CHROMA_DB_PATH || './chroma_db';
    
    chromaClient = new ChromaClient({
      path: path.resolve(chromaPath),
    });
    
    console.log('✅ ChromaDB client initialized');
  }
  
  return chromaClient;
};

export const createCollection = async (collectionName: string) => {
  const client = await getChromaClient();
  
  try {
    // Try to get existing collection
    const collection = await client.getOrCreateCollection({
      name: collectionName,
      metadata: { 'hnsw:space': 'cosine' },
    });
    
    console.log(`✅ Collection "${collectionName}" ready`);
    return collection;
  } catch (error) {
    console.error(`❌ Error creating collection "${collectionName}":`, error);
    throw error;
  }
};

export const deleteCollection = async (collectionName: string) => {
  const client = await getChromaClient();
  
  try {
    await client.deleteCollection({ name: collectionName });
    console.log(`✅ Collection "${collectionName}" deleted`);
  } catch (error) {
    console.error(`❌ Error deleting collection "${collectionName}":`, error);
    throw error;
  }
};

export const listCollections = async () => {
  const client = await getChromaClient();
  
  try {
    const collections = await client.listCollections();
    return collections;
  } catch (error) {
    console.error('❌ Error listing collections:', error);
    throw error;
  }
};

// Made with Bob
