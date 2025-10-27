/**
 * Barcode validation
 */

import { BarcodeFormat } from '../types';
import { EAN13Encoder, EAN8Encoder } from '../formats/ean';
import { UPCAEncoder, UPCEEncoder } from '../formats/upc';
import { Code128Encoder } from '../formats/code128';
import { Code39Encoder } from '../formats/code39';
import { Code93Encoder } from '../formats/code93';
import { ITF14Encoder } from '../formats/itf';
import { CodabarEncoder } from '../formats/codabar';

/**
 * Barcode Validator
 */
export class BarcodeValidator {
  /**
   * Validate barcode data for a specific format
   */
  static validate(data: string, format: BarcodeFormat): boolean {
    try {
      const encoder = this.getEncoder(format);
      return encoder.validate(data);
    } catch {
      return false;
    }
  }

  /**
   * Auto-detect barcode format from data
   */
  static detectFormat(data: string): BarcodeFormat | null {
    // Remove whitespace
    const trimmed = data.trim();
    const numeric = trimmed.replace(/\D/g, '');

    // EAN-13 (13 digits)
    if (numeric.length === 13 && numeric === trimmed) {
      const encoder = new EAN13Encoder();
      if (encoder.validate(trimmed)) return BarcodeFormat.EAN13;
    }

    // EAN-8 (8 digits)
    if (numeric.length === 8 && numeric === trimmed) {
      const encoder = new EAN8Encoder();
      if (encoder.validate(trimmed)) return BarcodeFormat.EAN8;
    }

    // UPC-A (12 digits)
    if (numeric.length === 12 && numeric === trimmed) {
      const encoder = new UPCAEncoder();
      if (encoder.validate(trimmed)) return BarcodeFormat.UPCA;
    }

    // UPC-E (6-8 digits)
    if (numeric.length >= 6 && numeric.length <= 8 && numeric === trimmed) {
      const encoder = new UPCEEncoder();
      if (encoder.validate(trimmed)) return BarcodeFormat.UPCE;
    }

    // ITF-14 (14 digits)
    if (numeric.length === 14 && numeric === trimmed) {
      const encoder = new ITF14Encoder();
      if (encoder.validate(trimmed)) return BarcodeFormat.ITF14;
    }

    // Codabar (starts/ends with A-D)
    if (/^[A-D]/i.test(trimmed) && /[A-D]$/i.test(trimmed)) {
      const encoder = new CodabarEncoder();
      if (encoder.validate(trimmed)) return BarcodeFormat.CODABAR;
    }

    // Code39 (alphanumeric with special chars)
    if (/^[0-9A-Z\-. $\/+%]+$/i.test(trimmed)) {
      const encoder = new Code39Encoder();
      if (encoder.validate(trimmed.toUpperCase())) return BarcodeFormat.CODE39;
    }

    // Code93 (similar to Code39)
    if (/^[0-9A-Z\-. $\/+%]+$/i.test(trimmed)) {
      const encoder = new Code93Encoder();
      if (encoder.validate(trimmed.toUpperCase())) return BarcodeFormat.CODE93;
    }

    // Default to Code128 for general data
    const code128 = new Code128Encoder();
    if (code128.validate(trimmed)) return BarcodeFormat.CODE128;

    return null;
  }

  /**
   * Get encoder instance for format
   */
  private static getEncoder(format: BarcodeFormat) {
    switch (format) {
      case BarcodeFormat.EAN13:
        return new EAN13Encoder();
      case BarcodeFormat.EAN8:
        return new EAN8Encoder();
      case BarcodeFormat.UPCA:
        return new UPCAEncoder();
      case BarcodeFormat.UPCE:
        return new UPCEEncoder();
      case BarcodeFormat.CODE128:
        return new Code128Encoder();
      case BarcodeFormat.CODE39:
        return new Code39Encoder();
      case BarcodeFormat.CODE93:
        return new Code93Encoder();
      case BarcodeFormat.ITF14:
        return new ITF14Encoder();
      case BarcodeFormat.CODABAR:
        return new CodabarEncoder();
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }
}

