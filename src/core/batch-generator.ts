/**
 * Batch barcode generator for performance optimization
 */

import { BarcodeConfig, BarcodeInstance, EncodedBarcode } from '../types';
import { BarcodeGenerator } from './barcode-generator';

export interface BatchConfig extends Omit<BarcodeConfig, 'content' | 'container'> {
  items: string[];
}

export interface BatchResult {
  content: string;
  instance?: BarcodeInstance;
  encoded?: EncodedBarcode;
  error?: Error;
}

/**
 * Batch Generator Options
 */
export interface BatchGeneratorOptions {
  /** Use shared renderer for all barcodes (faster but uses more memory) */
  useSharedRenderer?: boolean;

  /** Maximum concurrent generations */
  concurrency?: number;

  /** Enable caching */
  enableCache?: boolean;

  /** Progress callback */
  onProgress?: (completed: number, total: number) => void;
}

/**
 * Batch Barcode Generator
 */
export class BatchBarcodeGenerator {
  private options: Required<BatchGeneratorOptions>;

  constructor(options: BatchGeneratorOptions = {}) {
    this.options = {
      useSharedRenderer: options.useSharedRenderer ?? false,
      concurrency: options.concurrency ?? 10,
      enableCache: options.enableCache ?? true,
      onProgress: options.onProgress ?? (() => { }),
    };
  }

  /**
   * Generate multiple barcodes
   */
  async generate(config: BatchConfig): Promise<BatchResult[]> {
    const { items, ...baseConfig } = config;
    const results: BatchResult[] = [];
    let completed = 0;

    // Process in batches based on concurrency
    for (let i = 0; i < items.length; i += this.options.concurrency) {
      const batch = items.slice(i, i + this.options.concurrency);

      const batchResults = await Promise.all(
        batch.map(async (content) => {
          try {
            const instance = BarcodeGenerator.generate({
              ...baseConfig,
              content,
            });

            completed++;
            this.options.onProgress(completed, items.length);

            return {
              content,
              instance,
            };
          } catch (error) {
            completed++;
            this.options.onProgress(completed, items.length);

            return {
              content,
              error: error as Error,
            };
          }
        })
      );

      results.push(...batchResults);
    }

    return results;
  }

  /**
   * Generate and export to data URLs
   */
  async generateDataURLs(
    config: BatchConfig,
    format: 'png' | 'jpeg' = 'png',
    quality?: number
  ): Promise<Array<{ content: string; dataURL?: string; error?: Error }>> {
    const results = await this.generate({ ...config, renderType: 'canvas' });

    return results.map(({ content, instance, error }) => {
      if (error || !instance) {
        return { content, error };
      }

      try {
        const dataURL = instance.toDataURL(format, quality);
        instance.destroy(); // Clean up immediately
        return { content, dataURL };
      } catch (err) {
        instance.destroy();
        return { content, error: err as Error };
      }
    });
  }

  /**
   * Generate and download as ZIP (requires additional library)
   */
  async downloadAsZip(
    config: BatchConfig,
    zipFileName: string = 'barcodes.zip'
  ): Promise<void> {
    // Note: This would require JSZip or similar library
    // Placeholder implementation
    const dataURLs = await this.generateDataURLs(config);

    console.log(`Generated ${dataURLs.length} barcodes for ZIP: ${zipFileName}`);
    console.warn('ZIP download requires JSZip library integration');

    // TODO: Integrate with JSZip when available
  }
}

/**
 * Convenience function for batch generation
 */
export async function generateBatch(
  contents: string[],
  config: Partial<BarcodeConfig> = {},
  options: BatchGeneratorOptions = {}
): Promise<BatchResult[]> {
  const generator = new BatchBarcodeGenerator(options);
  return generator.generate({
    ...config,
    items: contents,
  });
}


