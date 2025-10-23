/**
 * Code39 encoder
 */

import { BarcodeFormat, EncodedBarcode, FormatEncoder } from '../types';
import { calculateCode39Checksum } from '../utils/checksum';

// Code39 encoding table
const CODE39_ENCODING: { [key: string]: string } = {
  '0': '101001101101', '1': '110100101011', '2': '101100101011',
  '3': '110110010101', '4': '101001101011', '5': '110100110101',
  '6': '101100110101', '7': '101001011011', '8': '110100101101',
  '9': '101100101101', 'A': '110101001011', 'B': '101101001011',
  'C': '110110100101', 'D': '101011001011', 'E': '110101100101',
  'F': '101101100101', 'G': '101010011011', 'H': '110101001101',
  'I': '101101001101', 'J': '101011001101', 'K': '110101010011',
  'L': '101101010011', 'M': '110110101001', 'N': '101011010011',
  'O': '110101101001', 'P': '101101101001', 'Q': '101010110011',
  'R': '110101011001', 'S': '101101011001', 'T': '101011011001',
  'U': '110010101011', 'V': '100110101011', 'W': '110011010101',
  'X': '100101101011', 'Y': '110010110101', 'Z': '100110110101',
  '-': '100101011011', '.': '110010101101', ' ': '100110101101',
  '$': '100100100101', '/': '100100101001', '+': '100101001001',
  '%': '101001001001', '*': '100101101101' // Start/Stop
};

/**
 * Code39 Encoder
 */
export class Code39Encoder implements FormatEncoder {
  private includeChecksum: boolean;

  constructor(includeChecksum: boolean = false) {
    this.includeChecksum = includeChecksum;
  }

  encode(data: string): EncodedBarcode {
    // Convert to uppercase
    const upperData = data.toUpperCase();

    if (!this.validate(upperData)) {
      throw new Error('Invalid Code39 data: contains unsupported characters');
    }

    let encodedData = upperData;

    // Add checksum if required
    if (this.includeChecksum) {
      const checksum = calculateCode39Checksum(upperData);
      encodedData = upperData + checksum;
    }

    // Start with * (start character)
    let bars = CODE39_ENCODING['*'];

    // Add narrow space between characters
    bars += '0';

    // Encode each character
    for (const char of encodedData) {
      if (!CODE39_ENCODING[char]) {
        throw new Error(`Character '${char}' not supported in Code39`);
      }
      bars += CODE39_ENCODING[char];
      bars += '0'; // Inter-character gap
    }

    // End with * (stop character)
    bars += CODE39_ENCODING['*'];

    return {
      bars,
      text: '*' + encodedData + '*',
      format: BarcodeFormat.CODE39,
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
    return BarcodeFormat.CODE39;
  }
}

