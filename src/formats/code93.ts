/**
 * Code93 encoder
 */

import { BarcodeFormat, EncodedBarcode, FormatEncoder } from '../types';
import { calculateCode93Checksum } from '../utils/checksum';

// Code93 encoding table
const CODE93_ENCODING: { [key: string]: string } = {
  '0': '100010100', '1': '101001000', '2': '101000100',
  '3': '101000010', '4': '100101000', '5': '100100100',
  '6': '100100010', '7': '101010000', '8': '100010010',
  '9': '100001010', 'A': '110101000', 'B': '110100100',
  'C': '110100010', 'D': '110010100', 'E': '110010010',
  'F': '110001010', 'G': '101101000', 'H': '101100100',
  'I': '101100010', 'J': '100110100', 'K': '100011010',
  'L': '101011000', 'M': '101001100', 'N': '101000110',
  'O': '100101100', 'P': '100010110', 'Q': '110110100',
  'R': '110110010', 'S': '110101100', 'T': '110100110',
  'U': '110010110', 'V': '110011010', 'W': '101101100',
  'X': '101100110', 'Y': '100110110', 'Z': '100111010',
  '-': '100101110', '.': '111010100', ' ': '111010010',
  '$': '111001010', '/': '101101110', '+': '101110110',
  '%': '110101110', '*': '101011110' // Start/Stop
};

/**
 * Code93 Encoder
 */
export class Code93Encoder implements FormatEncoder {
  encode(data: string): EncodedBarcode {
    const upperData = data.toUpperCase();

    if (!this.validate(upperData)) {
      throw new Error('Invalid Code93 data: contains unsupported characters');
    }

    // Calculate check characters
    const checksumChars = calculateCode93Checksum(upperData);
    const fullData = upperData + checksumChars;

    // Start with * (start character)
    let bars = CODE93_ENCODING['*'];

    // Encode each character
    for (const char of fullData) {
      if (!CODE93_ENCODING[char]) {
        throw new Error(`Character '${char}' not supported in Code93`);
      }
      bars += CODE93_ENCODING[char];
    }

    // End with * (stop character)
    bars += CODE93_ENCODING['*'];

    // Add termination bar
    bars += '1';

    return {
      bars,
      text: upperData, // Don't show check characters in text
      format: BarcodeFormat.CODE93,
    };
  }

  validate(data: string): boolean {
    const validChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%';
    for (const char of data) {
      if (!validChars.includes(char)) {
        return false;
      }
    }
    return data.length > 0;
  }

  getFormat(): BarcodeFormat {
    return BarcodeFormat.CODE93;
  }
}

