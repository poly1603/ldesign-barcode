/**
 * SVG Renderer
 */

import { BaseRenderer } from './base-renderer';
import { isSVGSupported } from '../core/env-detector';

/**
 * SVG Renderer
 */
export class SVGRenderer extends BaseRenderer {
  private svg: SVGSVGElement | null = null;

  constructor() {
    super();
    
    if (!isSVGSupported()) {
      throw new Error('SVG is not supported in this environment');
    }
  }

  protected renderBarcode(): void {
    if (!this.encoded || !this.options) return;

    const width = this.calculateWidth();
    const height = this.options.height;
    const barWidth = this.getBarWidth();
    const barcodeHeight = this.getBarcodeHeight();

    // Create SVG element
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', width.toString());
    this.svg.setAttribute('height', height.toString());
    this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    // Background
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('width', '100%');
    background.setAttribute('height', '100%');
    background.setAttribute('fill', this.options.background);
    this.svg.appendChild(background);

    // Create group for barcode
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Draw bars
    let x = this.options.margin;
    for (const bit of this.encoded.bars) {
      if (bit === '1') {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x.toString());
        rect.setAttribute('y', this.options.margin.toString());
        rect.setAttribute('width', barWidth.toString());
        rect.setAttribute('height', barcodeHeight.toString());
        rect.setAttribute('fill', this.options.foreground);
        group.appendChild(rect);
      }
      x += barWidth;
    }

    this.svg.appendChild(group);

    // Draw text
    if (this.options.displayValue && this.encoded.text) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', this.getTextX().toString());
      text.setAttribute('y', this.getTextY().toString());
      text.setAttribute('text-anchor', this.options.textAlign === 'center' ? 'middle' : this.options.textAlign === 'right' ? 'end' : 'start');
      text.setAttribute('font-family', this.options.fontFamily);
      text.setAttribute('font-size', this.options.fontSize.toString());
      text.setAttribute('fill', this.options.foreground);
      text.textContent = this.encoded.text;
      this.svg.appendChild(text);
    }
  }

  getElement(): SVGSVGElement | null {
    return this.svg;
  }

  /**
   * Get SVG as string
   */
  toString(): string {
    if (!this.svg) return '';
    const serializer = new XMLSerializer();
    return serializer.serializeToString(this.svg);
  }

  /**
   * Download SVG
   */
  download(fileName: string): void {
    if (!this.svg) return;

    const svgString = this.toString();
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    if (typeof link.download !== 'undefined') {
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Fallback for older browsers
      window.open(url, '_blank');
    }
    
    // Clean up object URL
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  /**
   * Update configuration
   */
  update(encoded: import('../types').EncodedBarcode, options: import('../types').RenderOptions): void {
    this.render(encoded, options);
  }

  destroy(): void {
    if (this.svg && this.svg.parentNode) {
      this.svg.parentNode.removeChild(this.svg);
    }
    this.svg = null;
  }
}

