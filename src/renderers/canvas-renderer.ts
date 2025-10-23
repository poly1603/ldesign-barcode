/**
 * Canvas Renderer
 */

import { BaseRenderer } from './base-renderer';

/**
 * Canvas Renderer
 */
export class CanvasRenderer extends BaseRenderer {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  constructor() {
    super();
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
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
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.canvas = null;
    this.ctx = null;
  }
}

