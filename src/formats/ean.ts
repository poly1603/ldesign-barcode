/**
 * EAN-13 and EAN-8 encoder
 */

import { BarcodeFormat, EncodedBarcode, FormatEncoder } from '../types';
import { calculateEANChecksum, validateEANChecksum } from '../utils/checksum';
import { CharacterEncoder } from '../utils/encoder';

// EAN encoding tables
const L_CODES = [
  '0001101', '0011001', '0010011', '0111101', '0100011',
  '0110001', '0101111', '0111011', '0110111', '0001011'
];

const G_CODES = [
  '0100111', '0110011', '0011011', '0100001', '0011101',
  '0111001', '0000101', '0010001', '0001001', '0010111'
];

const R_CODES = [
  '1110010', '1100110', '1101100', '1000010', '1011100',
  '1001110', '1010000', '1000100', '1001000', '1110100'
];

// First digit patterns for EAN-13
const FIRST_DIGIT_PATTERNS = [
  'LLLLLL', // 0
  'LLGLGG', // 1
  'LLGGLG', // 2
  'LLGGGL', // 3
  'LGLLGG', // 4
  'LGGLLG', // 5
  'LGGGLL', // 6
  'LGLGLG', // 7
  'LGLGGL', // 8
  'LGGLGL', // 9
];

const START_END = '101';
const MIDDLE = '01010';

/**
 * EAN-13 Encoder
 */
export class EAN13Encoder implements FormatEncoder {
  encode(data: string): EncodedBarcode {
    // Auto-complete or validate
    let code = data.replace(/\D/g, ''); // Remove non-digits

    if (code.length === 12) {
      // Add checksum
      const checksum = calculateEANChecksum(code);
      code = code + checksum;
    } else if (code.length === 13) {
      // Validate checksum
      if (!validateEANChecksum(code)) {
        throw new Error('Invalid EAN-13 checksum');
      }
    } else if (code.length < 12) {
      // Pad with zeros on the left
      code = CharacterEncoder.padZeros(code, 12);
      const checksum = calculateEANChecksum(code);
      code = code + checksum;
    } else {
      throw new Error('EAN-13 must be 12 or 13 digits');
    }

    // Encode
    const firstDigit = parseInt(code[0], 10);
    const pattern = FIRST_DIGIT_PATTERNS[firstDigit];

    let bars = START_END;

    // Left side (6 digits)
    for (let i = 1; i <= 6; i++) {
      const digit = parseInt(code[i], 10);
      bars += pattern[i - 1] === 'L' ? L_CODES[digit] : G_CODES[digit];
    }

    bars += MIDDLE;

    // Right side (6 digits including checksum)
    for (let i = 7; i <= 12; i++) {
      const digit = parseInt(code[i], 10);
      bars += R_CODES[digit];
    }

    bars += START_END;

    return {
      bars,
      text: code,
      format: BarcodeFormat.EAN13,
    };
  }

  validate(data: string): boolean {
    const code = data.replace(/\D/g, '');
    if (code.length !== 12 && code.length !== 13) return false;
    if (code.length === 13 && !validateEANChecksum(code)) return false;
    return true;
  }

  getFormat(): BarcodeFormat {
    return BarcodeFormat.EAN13;
  }
}

/**
 * EAN-8 Encoder
 */
export class EAN8Encoder implements FormatEncoder {
  encode(data: string): EncodedBarcode {
    let code = data.replace(/\D/g, '');

    if (code.length === 7) {
      const checksum = calculateEANChecksum(code);
      code = code + checksum;
    } else if (code.length === 8) {
      if (!validateEANChecksum(code)) {
        throw new Error('Invalid EAN-8 checksum');
      }
    } else {
      throw new Error('EAN-8 must be 7 or 8 digits');
    }

    let bars = START_END;

    // Left side (4 digits)
    for (let i = 0; i < 4; i++) {
      const digit = parseInt(code[i], 10);
      bars += L_CODES[digit];
    }

    bars += MIDDLE;

    // Right side (4 digits)
    for (let i = 4; i < 8; i++) {
      const digit = parseInt(code[i], 10);
      bars += R_CODES[digit];
    }

    bars += START_END;

    return {
      bars,
      text: code,
      format: BarcodeFormat.EAN8,
    };
  }

  validate(data: string): boolean {
    const code = data.replace(/\D/g, '');
    if (code.length !== 7 && code.length !== 8) return false;
    if (code.length === 8 && !validateEANChecksum(code)) return false;
    return true;
  }

  getFormat(): BarcodeFormat {
    return BarcodeFormat.EAN8;
  }
}

