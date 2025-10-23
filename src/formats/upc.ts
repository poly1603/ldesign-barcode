/**
 * UPC-A and UPC-E encoder
 */

import { BarcodeFormat, EncodedBarcode, FormatEncoder } from '../types';
import { calculateEANChecksum, validateEANChecksum } from '../utils/checksum';
import { CharacterEncoder } from '../utils/encoder';

// Same encoding as EAN
const L_CODES = [
  '0001101', '0011001', '0010011', '0111101', '0100011',
  '0110001', '0101111', '0111011', '0110111', '0001011'
];

const R_CODES = [
  '1110010', '1100110', '1101100', '1000010', '1011100',
  '1001110', '1010000', '1000100', '1001000', '1110100'
];

// UPC-E odd/even patterns
const UPCE_PATTERNS = [
  'EEEOOO', 'EEOEOO', 'EEOOEO', 'EEOOOE', 'EOEEOO',
  'EOOEEO', 'EOOOEE', 'EOEOEO', 'EOEOOE', 'EOOEOE'
];

const START_END = '101';
const MIDDLE = '01010';
const UPCE_END = '010101';

/**
 * UPC-A Encoder (essentially EAN-13 with leading 0)
 */
export class UPCAEncoder implements FormatEncoder {
  encode(data: string): EncodedBarcode {
    let code = data.replace(/\D/g, '');

    if (code.length === 11) {
      const checksum = calculateEANChecksum(code);
      code = code + checksum;
    } else if (code.length === 12) {
      if (!validateEANChecksum(code)) {
        throw new Error('Invalid UPC-A checksum');
      }
    } else {
      throw new Error('UPC-A must be 11 or 12 digits');
    }

    let bars = START_END;

    // Left side (6 digits)
    for (let i = 0; i < 6; i++) {
      const digit = parseInt(code[i], 10);
      bars += L_CODES[digit];
    }

    bars += MIDDLE;

    // Right side (6 digits)
    for (let i = 6; i < 12; i++) {
      const digit = parseInt(code[i], 10);
      bars += R_CODES[digit];
    }

    bars += START_END;

    return {
      bars,
      text: code,
      format: BarcodeFormat.UPCA,
    };
  }

  validate(data: string): boolean {
    const code = data.replace(/\D/g, '');
    if (code.length !== 11 && code.length !== 12) return false;
    if (code.length === 12 && !validateEANChecksum(code)) return false;
    return true;
  }

  getFormat(): BarcodeFormat {
    return BarcodeFormat.UPCA;
  }
}

/**
 * UPC-E Encoder (compressed UPC-A)
 */
export class UPCEEncoder implements FormatEncoder {
  encode(data: string): EncodedBarcode {
    let code = data.replace(/\D/g, '');

    if (code.length === 6) {
      // Add number system (0) and check digit
      const upca = this.expandToUPCA(code);
      const checksum = calculateEANChecksum(upca.slice(0, 11));
      code = code + checksum;
    } else if (code.length === 7 || code.length === 8) {
      // Validate by expanding to UPC-A
      const codeWithoutCheck = code.slice(0, code.length === 8 ? -1 : code.length);
      const upca = this.expandToUPCA(codeWithoutCheck.slice(code.length === 8 ? 1 : 0, code.length === 8 ? 7 : 6));
      const checksum = calculateEANChecksum(upca.slice(0, 11));

      if (code.length === 7) {
        code = code + checksum;
      } else {
        const providedCheck = parseInt(code[7], 10);
        if (providedCheck !== checksum) {
          throw new Error('Invalid UPC-E checksum');
        }
      }
    } else {
      throw new Error('UPC-E must be 6, 7, or 8 digits');
    }

    // Use the last digit for pattern selection
    const lastDigit = parseInt(code[code.length - 1], 10);
    const pattern = UPCE_PATTERNS[lastDigit];

    let bars = START_END;

    // Encode 6 middle digits with pattern
    const middleDigits = code.length === 8 ? code.slice(1, 7) : code.slice(0, 6);
    for (let i = 0; i < 6; i++) {
      const digit = parseInt(middleDigits[i], 10);
      bars += pattern[i] === 'E' ? L_CODES[digit] : R_CODES[digit];
    }

    bars += UPCE_END;

    return {
      bars,
      text: code,
      format: BarcodeFormat.UPCE,
    };
  }

  /**
   * Expand UPC-E to UPC-A for validation
   */
  private expandToUPCA(upce: string): string {
    const lastDigit = parseInt(upce[5], 10);
    let upca = '0'; // Number system

    if (lastDigit <= 2) {
      upca += upce.slice(0, 2) + lastDigit + '0000' + upce.slice(2, 5);
    } else if (lastDigit === 3) {
      upca += upce.slice(0, 3) + '00000' + upce.slice(3, 5);
    } else if (lastDigit === 4) {
      upca += upce.slice(0, 4) + '00000' + upce[4];
    } else {
      upca += upce.slice(0, 5) + '0000' + lastDigit;
    }

    return upca;
  }

  validate(data: string): boolean {
    const code = data.replace(/\D/g, '');
    return code.length >= 6 && code.length <= 8;
  }

  getFormat(): BarcodeFormat {
    return BarcodeFormat.UPCE;
  }
}

