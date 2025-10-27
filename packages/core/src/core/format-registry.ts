/**
 * Format registry for barcode encoders
 */

import { BarcodeFormat, FormatEncoder } from '../types';
import { EAN13Encoder, EAN8Encoder } from '../formats/ean';
import { UPCAEncoder, UPCEEncoder } from '../formats/upc';
import { Code128Encoder } from '../formats/code128';
import { Code39Encoder } from '../formats/code39';
import { Code93Encoder } from '../formats/code93';
import { ITF14Encoder } from '../formats/itf';
import { CodabarEncoder } from '../formats/codabar';

/**
 * Format Registry
 */
export class FormatRegistry {
  private static encoders = new Map<BarcodeFormat, FormatEncoder>();

  /**
   * Register default encoders
   */
  static registerDefaults(): void {
    this.register(BarcodeFormat.EAN13, new EAN13Encoder());
    this.register(BarcodeFormat.EAN8, new EAN8Encoder());
    this.register(BarcodeFormat.UPCA, new UPCAEncoder());
    this.register(BarcodeFormat.UPCE, new UPCEEncoder());
    this.register(BarcodeFormat.CODE128, new Code128Encoder());
    this.register(BarcodeFormat.CODE39, new Code39Encoder());
    this.register(BarcodeFormat.CODE93, new Code93Encoder());
    this.register(BarcodeFormat.ITF14, new ITF14Encoder());
    this.register(BarcodeFormat.CODABAR, new CodabarEncoder());
  }

  /**
   * Register an encoder
   */
  static register(format: BarcodeFormat, encoder: FormatEncoder): void {
    this.encoders.set(format, encoder);
  }

  /**
   * Get encoder for format
   */
  static getEncoder(format: BarcodeFormat): FormatEncoder {
    const encoder = this.encoders.get(format);
    if (!encoder) {
      throw new Error(`No encoder registered for format: ${format}`);
    }
    return encoder;
  }

  /**
   * Check if format is registered
   */
  static hasEncoder(format: BarcodeFormat): boolean {
    return this.encoders.has(format);
  }

  /**
   * Get all registered formats
   */
  static getFormats(): BarcodeFormat[] {
    return Array.from(this.encoders.keys());
  }
}

// Auto-register defaults
FormatRegistry.registerDefaults();

