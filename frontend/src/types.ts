export type ActiveTab = | 'beranda' | 'pdf-to-word' | 'word-to-pdf' | 'laravel-backend';

export interface User {
  id: string;
  name?: string;
  email?: string;
}

export interface ProcessedFile {
  id: string;
  userId?: string;
  fileName: string;
  tool: 'merge' | 'compress' | 'pdf-to-word' | 'word-to-pdf' | 'ocr';
  originalSize: number;
  processedSize: number;
  reductionPercentage?: number;
  createdAt: string;
  downloadUrl?: string;
  blobData?: Blob;
  mimeType: string;
  extractedText?: string;
  pageCount?: number;
}

export interface CompressionOption {
  id: 'extreme' | 'recommended' | 'light';
  name: string;
  reductionLabel: string;
  reductionRatio: number;
  description: string;
  dpi: number;
}