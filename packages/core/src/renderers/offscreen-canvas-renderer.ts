/**
 * Offscreen Canvas Renderer for Web Worker support
 */

import { EncodedBarcode, RenderOptions, Renderer } from '../types';

/**
 * Offscreen Canvas Renderer (for Web Worker usage)
 */
export class OffscreenCanvasRenderer implements Renderer {
  private canvas: OffscreenCanvas | null = null;
  private ctx: OffscreenCanvasRenderingContext2D | null = null;
  private encoded?: EncodedBarcode;
  private options?: RenderOptions;

  constructor(width: number = 200, height: number = 100) {
    if (typeof OffscreenCanvas !== 'undefined') {
      this.canvas = new OffscreenCanvas(width, height);
      this.ctx = this.canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
    }
  }

  render(encoded: EncodedBarcode, options: RenderOptions): void {
    if (!this.canvas || !this.ctx) {
      throw new Error('OffscreenCanvas not supported in this environment');
    }

    this.encoded = encoded;
    this.options = options;

    this.renderBarcode();
  }

  private renderBarcode(): void {
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

  private calculateWidth(): number {
    if (!this.encoded || !this.options) return 0;
    const barWidth = this.getBarWidth();
    return this.encoded.bars.length * barWidth + this.options.margin * 2;
  }

  private getBarWidth(): number {
    if (!this.encoded || !this.options) return 1;
    const availableWidth = this.options.width - this.options.margin * 2;
    return Math.max(1, availableWidth / this.encoded.bars.length);
  }

  private getBarcodeHeight(): number {
    if (!this.options) return 0;
    const textHeight = this.options.displayValue ? this.options.fontSize + 4 : 0;
    return this.options.height - this.options.margin * 2 - textHeight;
  }

  private getTextX(): number {
    if (!this.options) return 0;
    const width = this.calculateWidth();

    switch (this.options.textAlign) {
      case 'left':
        return this.options.margin;
      case 'right':
        return width - this.options.margin;
      case 'center':
      default:
        return width / 2;
    }
  }

  private getTextY(): number {
    if (!this.options) return 0;
    return this.options.height - this.options.margin;
  }

  /**
   * Convert to Blob
   */
  async toBlob(type: 'image/png' | 'image/jpeg' = 'image/png', quality?: number): Promise<Blob> {
    if (!this.canvas) {
      throw new Error('No canvas available');
    }

    return await this.canvas.convertToBlob({ type, quality });
  }

  /**
   * Get canvas
   */
  getCanvas(): OffscreenCanvas | null {
    return this.canvas;
  }

  getElement(): never {
    throw new Error('OffscreenCanvas does not have a DOM element');
  }

  destroy(): void {
    // Set canvas size to 0 to free GPU memory
    if (this.canvas) {
      this.canvas.width = 0;
      this.canvas.height = 0;
    }
    
    this.canvas = null;
    this.ctx = null;
    this.encoded = undefined;
    this.options = undefined;
  }
}

/**
 * Check if OffscreenCanvas is supported
 */
export function isOffscreenCanvasSupported(): boolean {
  return typeof OffscreenCanvas !== 'undefined';
}


