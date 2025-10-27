/**
 * Image Scanner
 */

import { ScanResult, ScannerOptions, BatchScanResult } from '../types';
import { ImagePreprocessor } from './preprocessor';
import { BarcodeDecoder } from './decoder';

/**
 * Image Scanner
 */
export class ImageScanner {
  private options: ScannerOptions & { maxConcurrency?: number };

  constructor(options: ScannerOptions & { maxConcurrency?: number } = {}) {
    this.options = {
      preprocess: true,
      maxAttempts: 3,
      debug: false,
      maxConcurrency: 5, // Default: process 5 images concurrently
      ...options,
    };
  }

  /**
   * Scan barcode from file
   */
  async scanFile(file: File): Promise<ScanResult[]> {
    try {
      const image = await ImagePreprocessor.loadFromFile(file);
      return await this.scanImage(image);
    } catch (error) {
      if (this.options.debug) {
        console.error('Scan file error:', error);
      }
      throw error;
    }
  }

  /**
   * Scan barcode from image
   */
  async scanImage(image: HTMLImageElement): Promise<ScanResult[]> {
    let imageData = ImagePreprocessor.imageToImageData(image);

    // Try scanning with preprocessing
    if (this.options.preprocess) {
      const preprocessed = ImagePreprocessor.preprocess(imageData);
      const results = await BarcodeDecoder.decode(preprocessed, this.options.formats);
      if (results.length > 0) return results;
    }

    // Try scanning original
    const results = await BarcodeDecoder.decode(imageData, this.options.formats);
    if (results.length > 0) return results;

    // Try with rotation if no results and maxAttempts > 1
    if (this.options.maxAttempts && this.options.maxAttempts > 1) {
      const angles = [90, 180, 270];
      for (const angle of angles) {
        const rotated = ImagePreprocessor.rotate(imageData, angle);
        const rotatedResults = await BarcodeDecoder.decode(rotated, this.options.formats);
        if (rotatedResults.length > 0) {
          return rotatedResults.map(r => ({
            ...r,
            metadata: {
              ...r.metadata,
              angle,
            },
          }));
        }
      }
    }

    return [];
  }

  /**
   * Scan barcode from ImageData
   */
  async scanImageData(imageData: ImageData): Promise<ScanResult[]> {
    if (this.options.preprocess) {
      imageData = ImagePreprocessor.preprocess(imageData);
    }

    return await BarcodeDecoder.decode(imageData, this.options.formats);
  }

  /**
   * Batch scan multiple files (with parallel processing)
   */
  async scanBatch(files: File[]): Promise<BatchScanResult[]> {
    const maxConcurrency = this.options.maxConcurrency || 5;
    const results: BatchScanResult[] = [];
    
    // Process files in chunks for controlled concurrency
    for (let i = 0; i < files.length; i += maxConcurrency) {
      const chunk = files.slice(i, i + maxConcurrency);
      const chunkPromises = chunk.map(async (file) => {
        try {
          const scanResults = await this.scanFile(file);
          return {
            fileName: file.name,
            results: scanResults,
          };
        } catch (error) {
          return {
            fileName: file.name,
            results: [],
            error: error as Error,
          };
        }
      });
      
      const chunkResults = await Promise.allSettled(chunkPromises);
      results.push(...chunkResults.map(r => r.status === 'fulfilled' ? r.value : {
        fileName: 'unknown',
        results: [],
        error: new Error('Promise rejected'),
      }));
    }

    return results;
  }

  /**
   * Update scanner options
   */
  setOptions(options: Partial<ScannerOptions>): void {
    this.options = { ...this.options, ...options };
  }
}

/**
 * Convenience function to scan image
 */
export async function scanBarcode(
  source: File | HTMLImageElement | ImageData,
  options?: ScannerOptions
): Promise<ScanResult[]> {
  const scanner = new ImageScanner(options);

  if (source instanceof File) {
    return await scanner.scanFile(source);
  } else if (source instanceof HTMLImageElement) {
    return await scanner.scanImage(source);
  } else {
    return await scanner.scanImageData(source);
  }
}

