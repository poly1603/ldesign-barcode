/**
 * Base renderer for barcodes
 */

import { EncodedBarcode, RenderOptions, Renderer } from '../types';

/**
 * Abstract base renderer
 */
export abstract class BaseRenderer implements Renderer {
  protected encoded?: EncodedBarcode;
  protected options?: RenderOptions;

  /**
   * Render barcode
   */
  render(encoded: EncodedBarcode, options: RenderOptions): void {
    this.encoded = encoded;
    this.options = options;
    this.renderBarcode();
  }

  /**
   * Abstract render method
   */
  protected abstract renderBarcode(): void;

  /**
   * Get rendered element
   */
  abstract getElement(): HTMLCanvasElement | SVGSVGElement | null;

  /**
   * Destroy renderer
   */
  abstract destroy(): void;

  /**
   * Calculate bar width
   */
  protected getBarWidth(): number {
    if (!this.encoded || !this.options) return 2;

    const totalBars = this.encoded.bars.length;
    const availableWidth = this.options.width - (this.options.margin * 2);
    const barWidth = Math.max(1, Math.floor(availableWidth / totalBars));

    return Math.max(barWidth, this.options.lineWidth);
  }

  /**
   * Calculate total width needed
   */
  protected calculateWidth(): number {
    if (!this.encoded || !this.options) return 0;

    const barWidth = this.getBarWidth();
    return (this.encoded.bars.length * barWidth) + (this.options.margin * 2);
  }

  /**
   * Calculate barcode height (excluding text)
   */
  protected getBarcodeHeight(): number {
    if (!this.options) return 0;

    const textHeight = this.options.displayValue ? this.options.fontSize + 10 : 0;
    return this.options.height - textHeight - (this.options.margin * 2);
  }

  /**
   * Get text Y position
   */
  protected getTextY(): number {
    if (!this.options) return 0;

    return this.options.height - this.options.margin - 5;
  }

  /**
   * Get text X position based on alignment
   */
  protected getTextX(): number {
    if (!this.options) return 0;

    const totalWidth = this.calculateWidth();

    switch (this.options.textAlign) {
      case 'left':
        return this.options.margin;
      case 'right':
        return totalWidth - this.options.margin;
      case 'center':
      default:
        return totalWidth / 2;
    }
  }
}

