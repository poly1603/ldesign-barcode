/**
 * ITF-14 (Interleaved 2 of 5) encoder
 */

import { BarcodeFormat, EncodedBarcode, FormatEncoder } from '../types';
import { calculateITFChecksum } from '../utils/checksum';
import { CharacterEncoder } from '../utils/encoder';

// ITF encoding patterns (wide = 1, narrow = 0)
const ITF_PATTERNS = [
  '00110', '10001', '01001', '11000', '00101',
  '10100', '01100', '00011', '10010', '01010'
];

const START = '1010';
const STOP = '1101';

/**
 * ITF-14 Encoder
 */
export class ITF14Encoder implements FormatEncoder {
  encode(data: string): EncodedBarcode {
    let code = data.replace(/\D/g, '');

    if (code.length === 13) {
      const checksum = calculateITFChecksum(code);
      code = code + checksum;
    } else if (code.length === 14) {
      // Validate checksum
      const providedCheck = parseInt(code[13], 10);
      const calculated = calculateITFChecksum(code.slice(0, 13));
      if (providedCheck !== calculated) {
        throw new Error('Invalid ITF-14 checksum');
      }
    } else if (code.length < 13) {
      // Pad to 13 digits
      code = CharacterEncoder.padZeros(code, 13);
      const checksum = calculateITFChecksum(code);
      code = code + checksum;
    } else {
      throw new Error('ITF-14 must be 13 or 14 digits');
    }

    let bars = START;

    // Encode pairs of digits (interleaved)
    for (let i = 0; i < code.length; i += 2) {
      const digit1 = parseInt(code[i], 10);
      const digit2 = parseInt(code[i + 1], 10);

      const pattern1 = ITF_PATTERNS[digit1];
      const pattern2 = ITF_PATTERNS[digit2];

      // Interleave: first digit = bars, second digit = spaces
      for (let j = 0; j < 5; j++) {
        // Bar from first digit
        bars += pattern1[j] === '1' ? '111' : '1'; // Wide or narrow bar
        // Space from second digit
        bars += pattern2[j] === '1' ? '000' : '0'; // Wide or narrow space
      }
    }

    bars += STOP;

    return {
      bars,
      text: code,
      format: BarcodeFormat.ITF14,
    };
  }

  validate(data: string): boolean {
    const code = data.replace(/\D/g, '');
    // ITF accepts any length, will be padded to 14 (even)
    return code.length >= 1 && code.length <= 14;
  }

  getFormat(): BarcodeFormat {
    return BarcodeFormat.ITF14;
  }
}

