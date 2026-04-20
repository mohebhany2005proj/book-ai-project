import axios from 'axios';

const BOB_API_KEY = process.env.BOB_API_KEY || '';
const BOB_API_URL = process.env.BOB_API_URL || 'https://api.bob.com/v1';

if (!BOB_API_KEY) {
  console.warn('⚠️  BOB_API_KEY not set in environment variables');
}

export interface BobChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface BobChatRequest {
  model?: string;
  messages: BobChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

export interface BobEmbeddingRequest {
  model?: string;
  input: string | string[];
}

export const bobChat = async (
  messages: BobChatMessage[],
  temperature: number = 0.7,
  maxTokens: number = 1000
): Promise<string> => {
  try {
    const response = await axios.post(
      `${BOB_API_URL}/chat/completions`,
      {
        model: 'gpt-3.5-turbo',
        messages,
        temperature,
        max_tokens: maxTokens,
      },
      {
        headers: {
          'Authorization': `Bearer ${BOB_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error('❌ Bob Chat API error:', error.response?.data || error.message);
    throw new Error(`Bob Chat API failed: ${error.response?.data?.error?.message || error.message}`);
  }
};

export const bobEmbedding = async (text: string): Promise<number[]> => {
  try {
    const response = await axios.post(
      `${BOB_API_URL}/embeddings`,
      {
        model: 'text-embedding-ada-002',
        input: text,
      },
      {
        headers: {
          'Authorization': `Bearer ${BOB_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data[0].embedding;
  } catch (error: any) {
    console.error('❌ Bob Embedding API error:', error.response?.data || error.message);
    throw new Error(`Bob Embedding API failed: ${error.response?.data?.error?.message || error.message}`);
  }
};

export const bobBatchEmbeddings = async (texts: string[]): Promise<number[][]> => {
  try {
    const response = await axios.post(
      `${BOB_API_URL}/embeddings`,
      {
        model: 'text-embedding-ada-002',
        input: texts,
      },
      {
        headers: {
          'Authorization': `Bearer ${BOB_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data.map((item: any) => item.embedding);
  } catch (error: any) {
    console.error('❌ Bob Batch Embedding API error:', error.response?.data || error.message);
    throw new Error(`Bob Batch Embedding API failed: ${error.response?.data?.error?.message || error.message}`);
  }
};

export const testBobConnection = async (): Promise<boolean> => {
  try {
    await bobEmbedding('test');
    console.log('✅ Bob API connection successful');
    return true;
  } catch (error) {
    console.error('❌ Bob API connection failed');
    return false;
  }
};

// Made with Bob
