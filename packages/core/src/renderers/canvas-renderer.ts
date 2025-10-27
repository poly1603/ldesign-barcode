/**
 * Canvas Renderer
 */

import { BaseRenderer } from './base-renderer';
import { isCanvasSupported } from '../core/env-detector';

/**
 * Canvas Renderer
 */
export class CanvasRenderer extends BaseRenderer {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  constructor() {
    super();
    
    if (!isCanvasSupported()) {
      throw new Error('Canvas is not supported in this environment');
    }
    
    this.canvas = document.createElement('canvas');
    // Use willReadFrequently option for better performance when reading pixel data
    this.ctx = this.canvas.getContext('2d', { 
      willReadFrequently: false,
      alpha: true
    });
  }

  protected renderBarcode(): void {
    if (!this.encoded || !this.options || !this.canvas || !this.ctx) return;

    const width = this.calculateWidth();
    const height = this.options.height;
    const barWidth = this.getBarWidth();
    const barcodeHeight = this.getBarcodeHeight();

    // Set canvas size
    this.canvas.width = width;
    this.canvas.height = height;

    // Clear and draw background
    this.ctx.fillStyle = this.options.background;
    this.ctx.fillRect(0, 0, width, height);

    // Draw bars
    this.ctx.fillStyle = this.options.foreground;
    let x = this.options.margin;

    for (const bit of this.encoded.bars) {
      if (bit === '1') {
        this.ctx.fillRect(x, this.options.margin, barWidth, barcodeHeight);
      }
      x += barWidth;
    }

    // Draw text
    if (this.options.displayValue && this.encoded.text) {
      this.ctx.fillStyle = this.options.foreground;
      this.ctx.font = `${this.options.fontSize}px ${this.options.fontFamily}`;
      this.ctx.textAlign = this.options.textAlign;
      this.ctx.textBaseline = 'bottom';

      const textX = this.getTextX();
      const textY = this.getTextY();

      this.ctx.fillText(this.encoded.text, textX, textY);
    }
  }

  getElement(): HTMLCanvasElement | null {
    return this.canvas;
  }

  /**
   * Get canvas as data URL
   */
  toDataURL(format: 'png' | 'jpeg' = 'png', quality?: number): string {
    if (!this.canvas) return '';
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    return this.canvas.toDataURL(mimeType, quality);
  }

  /**
   * Download canvas as image
   */
  download(fileName: string, format: 'png' | 'jpeg' = 'png', quality?: number): void {
    if (!this.canvas) return;

    const dataURL = this.toDataURL(format, quality);
    
    // Check if download attribute is supported
    const link = document.createElement('a');
    if (typeof link.download !== 'undefined') {
      link.href = dataURL;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Fallback for older browsers
      window.open(dataURL, '_blank');
    }
  }

  /**
   * Update configuration
   */
  update(encoded: import('../types').EncodedBarcode, options: import('../types').RenderOptions): void {
    this.render(encoded, options);
  }

  /**
   * Get canvas
   */
  getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }

  destroy(): void {
    // Clean up canvas resources
    if (this.ctx && this.canvas) {
      // Clear the canvas to free memory
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    
    // Set dimensions to 0 to free GPU memory
    if (this.canvas) {
      this.canvas.width = 0;
      this.canvas.height = 0;
    }
    
    this.canvas = null;
    this.ctx = null;
  }
}

