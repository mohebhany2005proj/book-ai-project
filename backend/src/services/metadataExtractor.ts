import { BookMetadata } from '../types';

export class MetadataExtractor {
  /**
   * Extract comprehensive metadata from book text
   */
  async extractMetadata(text: string, filename: string): Promise<BookMetadata> {
    console.log('📊 Extracting book metadata...');

    const metadata: BookMetadata = {
      wordCount: this.countWords(text),
      estimatedReadingTime: 0,
    };

    // Extract author
    metadata.author = this.extractAuthor(text);

    // Detect language
    metadata.language = this.detectLanguage(text);

    // Extract chapters
    const chapters = this.extractChapters(text);
    metadata.chapters = chapters;
    metadata.chapterCount = chapters.length;

    // Estimate page count (assuming ~300 words per page)
    metadata.pageCount = Math.ceil(metadata.wordCount / 300);

    // Calculate reading time (assuming 200 words per minute)
    metadata.estimatedReadingTime = Math.ceil(metadata.wordCount / 200);

    // Extract table of contents
    metadata.tableOfContents = this.generateTableOfContents(chapters);

    // Extract introduction (first 500 words)
    metadata.introduction = this.extractIntroduction(text);

    console.log(`✅ Metadata extracted: ${metadata.pageCount} pages, ${metadata.chapterCount} chapters, ${metadata.wordCount} words`);
    if (metadata.author) {
      console.log(`   Author: ${metadata.author}`);
    }

    return metadata;
  }

  /**
   * Count words in text
   */
  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Extract author from text
   */
  private extractAuthor(text: string): string | undefined {
    // Look for common author patterns in first 2000 characters
    const searchText = text.substring(0, 2000);

    // Pattern 1: "by [Author Name]"
    const byPattern = /\bby\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/i;
    let match = searchText.match(byPattern);
    if (match) {
      return match[1].trim();
    }

    // Pattern 2: "Author: [Name]"
    const authorPattern = /\bAuthor:\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/i;
    match = searchText.match(authorPattern);
    if (match) {
      return match[1].trim();
    }

    // Pattern 3: "Written by [Name]"
    const writtenPattern = /\bWritten\s+by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/i;
    match = searchText.match(writtenPattern);
    if (match) {
      return match[1].trim();
    }

    // Pattern 4: Look for name after title (common in books)
    const titleAuthorPattern = /^[^\n]+\n+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\n/;
    match = searchText.match(titleAuthorPattern);
    if (match) {
      return match[1].trim();
    }

    return undefined;
  }

  /**
   * Detect language (simple heuristic)
   */
  private detectLanguage(text: string): string {
    const sample = text.substring(0, 1000);
    
    // Check for Arabic characters
    if (/[\u0600-\u06FF]/.test(sample)) {
      return 'ar';
    }
    
    // Default to English
    return 'en';
  }

  /**
   * Extract chapters from text
   */
  private extractChapters(text: string): Array<{ number: number; title: string; startPage?: number }> {
    const chapters: Array<{ number: number; title: string; startPage?: number }> = [];
    
    // Multiple chapter patterns
    const patterns = [
      // "Chapter 1", "Chapter One", "CHAPTER 1"
      /(?:^|\n)\s*(Chapter\s+(\d+|One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|[IVX]+))[:\s]*([^\n]*)/gi,
      // "1. Chapter Title" or "I. Chapter Title"
      /(?:^|\n)\s*([IVX]+|\d+)\.\s+([^\n]{3,50})\n/g,
      // "Part 1", "Part One"
      /(?:^|\n)\s*(Part\s+(\d+|One|Two|Three|Four|Five))[:\s]*([^\n]*)/gi,
    ];

    let chapterNumber = 0;
    const seenTitles = new Set<string>();

    for (const pattern of patterns) {
      let match;
      pattern.lastIndex = 0; // Reset regex
      
      while ((match = pattern.exec(text)) !== null) {
        chapterNumber++;
        
        // Extract title (combine captured groups)
        let title = '';
        if (match[3]) {
          title = match[3].trim();
        } else if (match[2]) {
          title = match[2].trim();
        } else {
          title = match[1].trim();
        }

        // Skip if we've seen this title (avoid duplicates)
        if (seenTitles.has(title.toLowerCase())) {
          continue;
        }

        // Skip very short or very long titles
        if (title.length < 3 || title.length > 100) {
          continue;
        }

        seenTitles.add(title.toLowerCase());

        // Estimate page number based on position in text
        const position = match.index;
        const estimatedPage = Math.ceil((position / text.length) * (text.length / 1500)); // ~1500 chars per page

        chapters.push({
          number: chapterNumber,
          title: title || `Chapter ${chapterNumber}`,
          startPage: estimatedPage,
        });

        // Limit to reasonable number of chapters
        if (chapters.length >= 50) {
          break;
        }
      }

      // If we found chapters with this pattern, don't try other patterns
      if (chapters.length > 0) {
        break;
      }
    }

    // If no chapters found, create a single chapter
    if (chapters.length === 0) {
      chapters.push({
        number: 1,
        title: 'Full Book',
        startPage: 1,
      });
    }

    return chapters;
  }

  /**
   * Generate table of contents from chapters
   */
  private generateTableOfContents(chapters: Array<{ number: number; title: string; startPage?: number }>): string {
    if (chapters.length === 0) {
      return '';
    }

    let toc = 'Table of Contents:\n\n';
    
    for (const chapter of chapters) {
      const pageInfo = chapter.startPage ? ` (Page ${chapter.startPage})` : '';
      toc += `${chapter.number}. ${chapter.title}${pageInfo}\n`;
    }

    return toc;
  }

  /**
   * Extract introduction (first few paragraphs)
   */
  private extractIntroduction(text: string): string {
    // Get first 500 words
    const words = text.trim().split(/\s+/);
    const introWords = words.slice(0, 500);
    let intro = introWords.join(' ');

    // Try to end at a sentence boundary
    const lastPeriod = intro.lastIndexOf('.');
    if (lastPeriod > 200) {
      intro = intro.substring(0, lastPeriod + 1);
    }

    return intro;
  }

  /**
   * Calculate proportional response length based on book size
   */
  calculateResponseLength(metadata: BookMetadata, featureType: string): number {
    const baseTokens: Record<string, number> = {
      'summary': 2500,        // Base: 5 pages for 100-page book
      'insights': 2000,       // Detailed analysis
      'quiz': 3000,          // Questions with explanations
      'speedReading': 3000,  // Key points and summaries
      'summaryCards': 2000,  // Visual cards
      'chat': 1500,          // Conversational responses
    };

    // Get base tokens for feature type
    const base = baseTokens[featureType] || 1500;

    // Calculate multiplier based on page count (cap at 5x)
    const pageCount = metadata.pageCount || 100;
    const multiplier = Math.min(pageCount / 100, 5);

    // Calculate scaled tokens
    const scaledTokens = Math.round(base * multiplier);

    console.log(`📏 Response length for ${featureType}: ${scaledTokens} tokens (${pageCount} pages, ${multiplier.toFixed(2)}x multiplier)`);

    return scaledTokens;
  }

  /**
   * Get optimal context chunk count based on book size
   */
  getOptimalChunkCount(metadata: BookMetadata, featureType: string): number {
    const baseChunks: Record<string, number> = {
      'summary': 30,
      'insights': 25,
      'quiz': 20,
      'speedReading': 30,
      'summaryCards': 15,
      'chat': 20,
    };

    const base = baseChunks[featureType] || 15;
    const pageCount = metadata.pageCount || 100;
    
    // Scale chunks based on book size
    const multiplier = Math.min(pageCount / 100, 3); // Cap at 3x
    const chunkCount = Math.round(base * multiplier);

    return Math.min(chunkCount, 50); // Cap at 50 chunks
  }
}

export default MetadataExtractor;

// Made with Bob