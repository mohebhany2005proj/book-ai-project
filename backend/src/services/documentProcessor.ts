import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { DocumentChunk, BookMetadata } from '../types';
import MetadataExtractor from './metadataExtractor';

export class DocumentProcessor {
  private chunkSize: number;
  private chunkOverlap: number;
  private metadataExtractor: MetadataExtractor;

  constructor(chunkSize: number = 1000, chunkOverlap: number = 200) {
    this.chunkSize = chunkSize;
    this.chunkOverlap = chunkOverlap;
    this.metadataExtractor = new MetadataExtractor();
  }

  /**
   * Parse document based on file extension
   */
  async parseDocument(filepath: string): Promise<string> {
    const ext = path.extname(filepath).toLowerCase();

    try {
      switch (ext) {
        case '.pdf':
          return await this.parsePDF(filepath);
        case '.txt':
          return await this.parseTXT(filepath);
        case '.docx':
          return await this.parseDOCX(filepath);
        default:
          throw new Error(`Unsupported file format: ${ext}`);
      }
    } catch (error: any) {
      console.error(`❌ Error parsing document ${filepath}:`, error.message);
      throw error;
    }
  }

  /**
   * Parse PDF file
   */
  private async parsePDF(filepath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filepath);
    const data = await pdfParse(dataBuffer);
    console.log(`✅ Parsed PDF: ${data.numpages} pages, ${data.text.length} characters`);
    return data.text;
  }

  /**
   * Parse TXT file
   */
  private async parseTXT(filepath: string): Promise<string> {
    const text = fs.readFileSync(filepath, 'utf-8');
    console.log(`✅ Parsed TXT: ${text.length} characters`);
    return text;
  }

  /**
   * Parse DOCX file
   */
  private async parseDOCX(filepath: string): Promise<string> {
    const result = await mammoth.extractRawText({ path: filepath });
    console.log(`✅ Parsed DOCX: ${result.value.length} characters`);
    return result.value;
  }

  /**
   * Split text into chunks with overlap
   */
  chunkText(text: string, bookId: string): DocumentChunk[] {
    console.log(`📝 Chunking text (${text.length} characters)...`);
    
    // Clean and normalize text in smaller operations to avoid memory spike
    let cleanText = text.replace(/\r\n/g, '\n');
    cleanText = cleanText.replace(/\n{3,}/g, '\n\n');
    cleanText = cleanText.trim();
    
    console.log(`📝 Text cleaned, starting chunking...`);

    const chunks: DocumentChunk[] = [];
    let startIndex = 0;
    let chunkIndex = 0;
    const totalLength = cleanText.length;
    const estimatedChunks = Math.ceil(totalLength / (this.chunkSize - this.chunkOverlap));
    
    console.log(`📊 Estimated ${estimatedChunks} chunks to create...`);

    while (startIndex < totalLength) {
      // Progress logging every 50 chunks
      if (chunkIndex > 0 && chunkIndex % 50 === 0) {
        console.log(`  ✓ Created ${chunkIndex} chunks so far...`);
      }
      // Calculate end index for this chunk
      let endIndex = startIndex + this.chunkSize;

      // If not at the end, try to break at a sentence or paragraph
      if (endIndex < cleanText.length) {
        // Look for paragraph break
        const paragraphBreak = cleanText.lastIndexOf('\n\n', endIndex);
        if (paragraphBreak > startIndex) {
          endIndex = paragraphBreak + 2;
        } else {
          // Look for sentence break
          const sentenceBreak = cleanText.lastIndexOf('. ', endIndex);
          if (sentenceBreak > startIndex) {
            endIndex = sentenceBreak + 2;
          }
        }
      }

      // Extract chunk
      const chunkContent = cleanText.slice(startIndex, endIndex).trim();

      if (chunkContent.length > 0) {
        chunks.push({
          content: chunkContent,
          metadata: {
            bookId,
            chunkIndex,
          },
        });
        chunkIndex++;
      }

      // Move to next chunk with overlap
      const nextStart = endIndex - this.chunkOverlap;
      
      // CRITICAL: Always ensure we make forward progress
      // If nextStart doesn't move us forward, jump to endIndex
      if (nextStart <= startIndex) {
        // Not making progress, force jump forward
        startIndex = endIndex;
      } else {
        // Normal case: move with overlap
        startIndex = nextStart;
      }
      
      // Safety check: if we're stuck at the same position, break
      if (startIndex === 0 && chunkIndex > 1000) {
        console.error('❌ Infinite loop detected in chunking! Breaking...');
        break;
      }
    }

    console.log(`✅ Created ${chunks.length} chunks from document`);
    return chunks;
  }

  /**
   * Process entire document: parse, extract metadata, and chunk
   */
  async processDocument(
    filepath: string,
    bookId: string
  ): Promise<{ chunks: DocumentChunk[]; metadata: BookMetadata; fullText: string }> {
    console.log(`📄 Processing document: ${filepath}`);
    
    const text = await this.parseDocument(filepath);
    
    if (!text || text.trim().length === 0) {
      throw new Error('Document is empty or could not be parsed');
    }

    // Extract metadata from the full text
    const filename = path.basename(filepath);
    const metadata = await this.metadataExtractor.extractMetadata(text, filename);

    // Create chunks
    const chunks = this.chunkText(text, bookId);
    
    if (chunks.length === 0) {
      throw new Error('No chunks created from document');
    }

    return {
      chunks,
      metadata,
      fullText: text, // Store full text for preview functionality
    };
  }

  /**
   * Get document statistics
   */
  async getDocumentStats(filepath: string): Promise<{
    characters: number;
    words: number;
    estimatedChunks: number;
  }> {
    const text = await this.parseDocument(filepath);
    const words = text.split(/\s+/).length;
    const estimatedChunks = Math.ceil(text.length / this.chunkSize);

    return {
      characters: text.length,
      words,
      estimatedChunks,
    };
  }
}

export default DocumentProcessor;

// Made with Bob
