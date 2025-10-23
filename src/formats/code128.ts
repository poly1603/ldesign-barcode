/**
 * Code128 encoder with automatic subset selection
 */

import { BarcodeFormat, EncodedBarcode, FormatEncoder } from '../types';
import { calculateCode128Checksum } from '../utils/checksum';

// Code128 patterns (103 values + start codes + stop)
const CODE128_PATTERNS = [
  '11011001100', '11001101100', '11001100110', '10010011000', '10010001100',
  '10001001100', '10011001000', '10011000100', '10001100100', '11001001000',
  '11001000100', '11000100100', '10110011100', '10011011100', '10011001110',
  '10111001100', '10011101100', '10011100110', '11001110010', '11001011100',
  '11001001110', '11011100100', '11001110100', '11101101110', '11101001100',
  '11100101100', '11100100110', '11101100100', '11100110100', '11100110010',
  '11011011000', '11011000110', '11000110110', '10100011000', '10001011000',
  '10001000110', '10110001000', '10001101000', '10001100010', '11010001000',
  '11000101000', '11000100010', '10110111000', '10110001110', '10001101110',
  '10111011000', '10111000110', '10001110110', '11101110110', '11010001110',
  '11000101110', '11011101000', '11011100010', '11011101110', '11101011000',
  '11101000110', '11100010110', '11101101000', '11101100010', '11100011010',
  '11101111010', '11001000010', '11110001010', '10100110000', '10100001100',
  '10010110000', '10010000110', '10000101100', '10000100110', '10110010000',
  '10110000100', '10011010000', '10011000010', '10000110100', '10000110010',
  '11000010010', '11001010000', '11110111010', '11000010100', '10001111010',
  '10100111100', '10010111100', '10010011110', '10111100100', '10011110100',
  '10011110010', '11110100100', '11110010100', '11110010010', '11011011110',
  '11011110110', '11110110110', '10101111000', '10100011110', '10001011110',
  '10111101000', '10111100010', '11110101000', '11110100010', '10111011110',
  '10111101110', '11101011110', '11110101110', '11010000100', '11010010000',
  '11010011100', '1100011101011'
];

const START_A = 103;
const START_B = 104;
const START_C = 105;
const STOP = 106;

/**
 * Code128 Encoder
 */
export class Code128Encoder implements FormatEncoder {
  encode(data: string): EncodedBarcode {
    if (!data || data.length === 0) {
      throw new Error('Code128 data cannot be empty');
    }

    // Determine optimal encoding strategy
    const encoded = this.optimizeEncoding(data);

    // Calculate checksum
    const checksum = calculateCode128Checksum(encoded);

    // Build binary pattern
    let bars = '';
    for (const value of encoded) {
      bars += CODE128_PATTERNS[value];
    }
    bars += CODE128_PATTERNS[checksum];
    bars += CODE128_PATTERNS[STOP];

    return {
      bars,
      text: data,
      format: BarcodeFormat.CODE128,
    };
  }

  /**
   * Optimize encoding using subset selection
   */
  private optimizeEncoding(data: string): number[] {
    const result: number[] = [];
    let currentSubset: 'A' | 'B' | 'C' | null = null;
    let i = 0;

    while (i < data.length) {
      // Try Code C (pairs of digits) first for efficiency
      if (this.canUseCodeC(data, i)) {
        if (currentSubset !== 'C') {
          if (currentSubset === null) {
            result.push(START_C);
          } else {
            result.push(99); // CODE C switch
          }
          currentSubset = 'C';
        }

        const pair = data.substr(i, 2);
        result.push(parseInt(pair, 10));
        i += 2;
      } else {
        // Use Code B (more common for ASCII)
        const char = data[i];
        const ascii = char.charCodeAt(0);

        if (currentSubset === null) {
          if (ascii < 32) {
            result.push(START_A);
            currentSubset = 'A';
          } else {
            result.push(START_B);
            currentSubset = 'B';
          }
        } else if (currentSubset === 'C') {
          if (ascii < 32) {
            result.push(101); // CODE A switch
            currentSubset = 'A';
          } else {
            result.push(100); // CODE B switch
            currentSubset = 'B';
          }
        }

        // Encode character
        if (currentSubset === 'A') {
          if (ascii < 32) {
            result.push(ascii + 64); // Control characters
          } else if (ascii < 96) {
            result.push(ascii - 32);
          } else {
            throw new Error(`Character '${char}' not supported in Code A`);
          }
        } else { // Code B
          if (ascii >= 32 && ascii <= 127) {
            result.push(ascii - 32);
          } else {
            throw new Error(`Character '${char}' not supported in Code B`);
          }
        }

        i++;
      }
    }

    return result;
  }

  /**
   * Check if Code C can be used (at least 4 digits or 2 digits at end)
   */
  private canUseCodeC(data: string, position: number): boolean {
    const remaining = data.length - position;
    if (remaining < 2) return false;

    const char1 = data[position];
    const char2 = data[position + 1];

    if (!/^\d$/.test(char1) || !/^\d$/.test(char2)) {
      return false;
    }

    // Use Code C if we have at least 4 digits or 2 digits at the end
    if (remaining === 2) return true;

    if (remaining >= 4) {
      const char3 = data[position + 2];
      const char4 = data[position + 3];
      return /^\d$/.test(char3) && /^\d$/.test(char4);
    }

    return false;
  }

  validate(data: string): boolean {
    // Code128 can encode ASCII 0-127
    for (const char of data) {
      const code = char.charCodeAt(0);
      if (code > 127) return false;
    }
    return data.length > 0;
  }

  getFormat(): BarcodeFormat {
    return BarcodeFormat.CODE128;
  }
}

