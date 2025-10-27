/**
 * Codabar encoder
 */

import { BarcodeFormat, EncodedBarcode, FormatEncoder } from '../types';

// Codabar encoding table
const CODABAR_ENCODING: { [key: string]: string } = {
  '0': '1011011011', '1': '1011011101', '2': '1011101011',
  '3': '1110110101', '4': '1011010111', '5': '1110101101',
  '6': '1010110111', '7': '1010111011', '8': '1011101101',
  '9': '1110101011', '-': '1010101101', '$': '1010110101',
  ':': '1101010101', '/': '1101011011', '.': '1101101011',
  '+': '1011011101', 'A': '1011010110', 'B': '1010110110',
  'C': '1001010111', 'D': '1001011011'
};

const START_STOP_CHARS = ['A', 'B', 'C', 'D'];

/**
 * Codabar Encoder
 */
export class CodabarEncoder implements FormatEncoder {
  encode(data: string): EncodedBarcode {
    let code = data.toUpperCase();

    // Auto-add start/stop if not present
    if (!START_STOP_CHARS.includes(code[0])) {
      code = 'A' + code;
    }
    if (!START_STOP_CHARS.includes(code[code.length - 1])) {
      code = code + 'A';
    }

    if (!this.validate(code)) {
      throw new Error('Invalid Codabar data: contains unsupported characters');
    }

    let bars = '';

    // Encode each character
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      if (!CODABAR_ENCODING[char]) {
        throw new Error(`Character '${char}' not supported in Codabar`);
      }

      bars += CODABAR_ENCODING[char];

      // Add inter-character gap (except after last character)
      if (i < code.length - 1) {
        bars += '0';
      }
    }

    return {
      bars,
      text: code,
      format: BarcodeFormat.CODABAR,
    };
  }

  validate(data: string): boolean {
    const upperData = data.toUpperCase();

    // Must start and end with A, B, C, or D
    if (upperData.length < 3) return false;
    if (!START_STOP_CHARS.includes(upperData[0])) return false;
    if (!START_STOP_CHARS.includes(upperData[upperData.length - 1])) return false;

    // Validate all characters
    const validChars = '0123456789-$:/.+ABCD';
    for (const char of upperData) {
      if (!validChars.includes(char)) {
        return false;
      }
    }

    return true;
  }

  getFormat(): BarcodeFormat {
    return BarcodeFormat.CODABAR;
  }
}

