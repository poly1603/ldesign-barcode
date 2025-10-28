/**
 * BarcodeGenerator - 简化的条形码生成器接口
 * 封装 barcode-generator.ts 的功能以提供更简单的API
 */

import { createBarcode, generateBarcode as generate } from './core/barcode-generator';
import type { BarcodeFormat, GenerateOptions, GenerateResult } from './types/enhanced';

export class BarcodeGenerator {
  /**
   * 生成条形码
   */
  async generate(value: string, options: GenerateOptions): Promise<GenerateResult> {
    try {
      const element = await createBarcode(value, options);
      return {
        success: true,
        element,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * 获取 Data URL
   */
  async getDataURL(value: string, options: GenerateOptions): Promise<string> {
    const element = await createBarcode(value, options);
    
    if (element instanceof HTMLCanvasElement) {
      return element.toDataURL('image/png');
    } else if (element instanceof SVGElement) {
      const svgString = new XMLSerializer().serializeToString(element);
      const base64 = btoa(unescape(encodeURIComponent(svgString)));
      return `data:image/svg+xml;base64,${base64}`;
    }
    
    throw new Error('Unsupported element type');
  }

  /**
   * 下载 PNG
   */
  async downloadPNG(value: string, options: GenerateOptions, filename = 'barcode.png'): Promise<void> {
    const dataUrl = await this.getDataURL(value, { ...options, renderType: 'canvas' });
    this.downloadFile(dataUrl, filename);
  }

  /**
   * 下载 SVG
   */
  async downloadSVG(value: string, options: GenerateOptions, filename = 'barcode.svg'): Promise<void> {
    const dataUrl = await this.getDataURL(value, { ...options, renderType: 'svg' });
    this.downloadFile(dataUrl, filename);
  }

  /**
   * 辅助方法：触发文件下载
   */
  private downloadFile(dataUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
  }
}

export { BarcodeFormat, GenerateOptions, GenerateResult };
