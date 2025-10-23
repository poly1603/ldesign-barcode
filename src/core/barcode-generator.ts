/**
 * Barcode Generator - Main orchestrator
 */

import { BarcodeConfig, BarcodeInstance, RenderOptions, BarcodeFormat, EncodedBarcode } from '../types';
import { FormatRegistry } from './format-registry';
import { BarcodeValidator } from './barcode-validator';
import { SVGRenderer } from '../renderers/svg-renderer';
import { CanvasRenderer } from '../renderers/canvas-renderer';

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<Omit<BarcodeConfig, 'content' | 'container'>> = {
  format: BarcodeFormat.CODE128,
  width: 200,
  height: 100,
  displayValue: true,
  background: '#ffffff',
  foreground: '#000000',
  renderType: 'canvas',
  margin: 10,
  fontSize: 14,
  textAlign: 'center',
  fontFamily: 'monospace',
  lineWidth: 2,
};

/**
 * Barcode Instance Implementation
 */
class BarcodeInstanceImpl implements BarcodeInstance {
  private config: BarcodeConfig;
  private renderer: SVGRenderer | CanvasRenderer;
  private encoded?: EncodedBarcode;

  constructor(config: BarcodeConfig) {
    this.config = config;

    // Create renderer
    const renderType = config.renderType || DEFAULT_CONFIG.renderType;
    this.renderer = renderType === 'svg' ? new SVGRenderer() : new CanvasRenderer();

    // Initial render
    this.renderBarcode();

    // Append to container if provided
    if (config.container) {
      const element = this.getElement();
      if (element) {
        config.container.appendChild(element);
      }
    }
  }

  /**
   * Render the barcode
   */
  private renderBarcode(): void {
    const fullConfig = { ...DEFAULT_CONFIG, ...this.config };

    // Auto-detect format if not specified
    let format = fullConfig.format;
    if (!format) {
      const detected = BarcodeValidator.detectFormat(fullConfig.content);
      format = detected || BarcodeFormat.CODE128;
    }

    // Validate data
    if (!BarcodeValidator.validate(fullConfig.content, format)) {
      throw new Error(`Invalid data for format ${format}`);
    }

    // Encode
    const encoder = FormatRegistry.getEncoder(format);
    this.encoded = encoder.encode(fullConfig.content);

    // Prepare render options
    const renderOptions: RenderOptions = {
      renderType: fullConfig.renderType,
      width: fullConfig.width,
      height: fullConfig.height,
      margin: fullConfig.margin,
      fontSize: fullConfig.fontSize,
      textAlign: fullConfig.textAlign,
      fontFamily: fullConfig.fontFamily,
      displayValue: fullConfig.displayValue,
      background: fullConfig.background,
      foreground: fullConfig.foreground,
      lineWidth: fullConfig.lineWidth,
    };

    // Render
    this.renderer.render(this.encoded, renderOptions);
  }

  async update(config: Partial<BarcodeConfig>): Promise<void> {
    this.config = { ...this.config, ...config };
    this.renderBarcode();
  }

  toDataURL(format: 'png' | 'jpeg' = 'png', quality?: number): string {
    if (this.renderer instanceof CanvasRenderer) {
      return this.renderer.toDataURL(format, quality);
    }
    throw new Error('toDataURL is only available for canvas render type');
  }

  toSVGString(): string {
    if (this.renderer instanceof SVGRenderer) {
      return this.renderer.toString();
    }
    throw new Error('toSVGString is only available for SVG render type');
  }

  download(fileName?: string, format?: 'png' | 'jpeg' | 'svg'): void {
    const defaultName = `barcode-${Date.now()}`;

    if (this.renderer instanceof CanvasRenderer) {
      const fmt = format || 'png';
      const name = fileName || `${defaultName}.${fmt}`;
      this.renderer.download(name, fmt === 'jpeg' ? 'jpeg' : 'png');
    } else if (this.renderer instanceof SVGRenderer) {
      const name = fileName || `${defaultName}.svg`;
      this.renderer.download(name);
    }
  }

  destroy(): void {
    this.renderer.destroy();
  }

  getElement(): HTMLCanvasElement | SVGSVGElement | null {
    return this.renderer.getElement();
  }
}

/**
 * Barcode Generator
 */
export class BarcodeGenerator {
  /**
   * Generate a barcode
   */
  static generate(config: BarcodeConfig): BarcodeInstance {
    return new BarcodeInstanceImpl(config);
  }

  /**
   * Create barcode instance (alias)
   */
  static create(config: BarcodeConfig): BarcodeInstance {
    return this.generate(config);
  }

  /**
   * Generate barcode as data URL
   */
  static async toDataURL(
    content: string,
    format?: BarcodeFormat,
    options?: Partial<BarcodeConfig>
  ): Promise<string> {
    const instance = this.generate({
      content,
      format,
      renderType: 'canvas',
      ...options,
    });

    const dataURL = instance.toDataURL();
    instance.destroy();
    return dataURL;
  }

  /**
   * Generate barcode as SVG string
   */
  static toSVGString(
    content: string,
    format?: BarcodeFormat,
    options?: Partial<BarcodeConfig>
  ): string {
    const instance = this.generate({
      content,
      format,
      renderType: 'svg',
      ...options,
    });

    const svgString = instance.toSVGString();
    instance.destroy();
    return svgString;
  }
}

/**
 * Convenience function to create barcode
 */
export function createBarcode(config: BarcodeConfig): BarcodeInstance {
  return BarcodeGenerator.generate(config);
}

/**
 * Convenience function to generate in container
 */
export function generateBarcode(container: HTMLElement, config: Omit<BarcodeConfig, 'container'>): BarcodeInstance {
  return BarcodeGenerator.generate({ ...config, container });
}

