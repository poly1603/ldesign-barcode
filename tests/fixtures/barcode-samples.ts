/**
 * Sample barcode data for testing
 */

import { BarcodeFormat } from '../../src/types';

export interface BarcodeSample {
  format: BarcodeFormat;
  valid: string[];
  invalid: string[];
  description: string;
}

export const BARCODE_SAMPLES: Record<BarcodeFormat, BarcodeSample> = {
  [BarcodeFormat.EAN13]: {
    format: BarcodeFormat.EAN13,
    valid: [
      '6901234567892', // With checksum
      '690123456789',  // Without checksum (auto-add)
      '5901234123457', // Another valid EAN-13
    ],
    invalid: [
      '123',           // Too short
      'ABC123456789',  // Non-numeric
      '12345678901234', // Too long
    ],
    description: 'European Article Number 13',
  },

  [BarcodeFormat.EAN8]: {
    format: BarcodeFormat.EAN8,
    valid: [
      '12345670',      // With checksum
      '1234567',       // Without checksum
      '96385074',      // Another valid EAN-8
    ],
    invalid: [
      '12',            // Too short
      'ABCD1234',      // Non-numeric
      '123456789',     // Too long
    ],
    description: 'European Article Number 8',
  },

  [BarcodeFormat.UPCA]: {
    format: BarcodeFormat.UPCA,
    valid: [
      '123456789012',  // With checksum
      '12345678901',   // Without checksum
      '042100005264',  // Real UPC-A example
    ],
    invalid: [
      '123',           // Too short
      'ABC123456789',  // Non-numeric
      '1234567890123', // Too long
    ],
    description: 'Universal Product Code A',
  },

  [BarcodeFormat.UPCE]: {
    format: BarcodeFormat.UPCE,
    valid: [
      '01234565',      // 8 digits with checksum
      '0123456',       // 7 digits (auto-add checksum)
      '12345678',      // Another format
    ],
    invalid: [
      '123',           // Too short
      'ABCDEFGH',      // Non-numeric
      '123456789',     // Too long
    ],
    description: 'Universal Product Code E (compressed)',
  },

  [BarcodeFormat.CODE128]: {
    format: BarcodeFormat.CODE128,
    valid: [
      'ABC123',        // Mixed alphanumeric
      '1234567890',    // Numeric only
      'Hello World',   // With space
      'ABC-123-XYZ',   // With special chars
    ],
    invalid: [
      '',              // Empty
      'Hello\u0200',   // Non-ASCII character
    ],
    description: 'Code128 high-density barcode',
  },

  [BarcodeFormat.CODE39]: {
    format: BarcodeFormat.CODE39,
    valid: [
      'HELLO',         // Uppercase letters
      '123456',        // Numbers
      'HELLO WORLD',   // With space
      'ABC-123',       // With hyphen
    ],
    invalid: [
      'hello',         // Lowercase (should be uppercase)
      'Hello@World',   // Invalid character @
      '',              // Empty
    ],
    description: 'Code39 alphanumeric barcode',
  },

  [BarcodeFormat.CODE93]: {
    format: BarcodeFormat.CODE93,
    valid: [
      'HELLO',         // Uppercase
      '123456',        // Numbers
      'CODE93',        // Mixed
      'ABC-123',       // With special chars
    ],
    invalid: [
      'hello',         // Lowercase
      '',              // Empty
    ],
    description: 'Code93 improved Code39',
  },

  [BarcodeFormat.ITF14]: {
    format: BarcodeFormat.ITF14,
    valid: [
      '12345678901231', // 14 digits with checksum
      '1234567890123',  // 13 digits (auto-add checksum)
      '00012345678905', // Real ITF-14 example
    ],
    invalid: [
      '123',            // Too short
      'ABC1234567890',  // Non-numeric
      '123456789012345', // Too long
    ],
    description: 'Interleaved 2 of 5 (logistics)',
  },

  [BarcodeFormat.CODABAR]: {
    format: BarcodeFormat.CODABAR,
    valid: [
      'A123456A',      // With start/stop
      '123456',        // Without start/stop
      'B123-456C',     // With hyphen
    ],
    invalid: [
      '',              // Empty
      'HELLO',         // Invalid characters
    ],
    description: 'Codabar for library/medical',
  },
};

/**
 * Get valid samples for a format
 */
export function getValidSamples(format: BarcodeFormat): string[] {
  return BARCODE_SAMPLES[format].valid;
}

/**
 * Get invalid samples for a format
 */
export function getInvalidSamples(format: BarcodeFormat): string[] {
  return BARCODE_SAMPLES[format].invalid;
}

/**
 * Get all formats
 */
export function getAllFormats(): BarcodeFormat[] {
  return Object.values(BarcodeFormat);
}


