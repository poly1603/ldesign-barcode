/**
 * BarcodeScanner - 简化的条形码扫描器接口
 * 封装 scanner/image-scanner.ts 的功能
 */

import { scanBarcode as scan } from './scanner/image-scanner';
import type { ScanOptions, ScanResult } from './types/enhanced';

export class BarcodeScanner {
  private options: ScanOptions;

  constructor(options: ScanOptions = {}) {
    this.options = options;
  }

  /**
   * 扫描单个图片
   */
  async scan(source: File | Blob | string): Promise<ScanResult> {
    try {
      const result = await scan(source, this.options);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * 批量扫描多个图片
   */
  async scanMultiple(sources: Array<File | Blob | string>): Promise<ScanResult[]> {
    const results: ScanResult[] = [];
    
    for (const source of sources) {
      const result = await this.scan(source);
      results.push(result);
    }
    
    return results;
  }
}

export { ScanOptions, ScanResult };
