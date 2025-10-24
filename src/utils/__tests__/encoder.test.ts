/**
 * Encoder utility tests
 */

import { describe, it, expect } from 'vitest';
import { BinaryString, CharacterEncoder, DataValidator } from '../encoder';

describe('BinaryString', () => {
  describe('toVisual', () => {
    it('should convert binary to visual representation', () => {
      expect(BinaryString.toVisual('101')).toBe('█ █');
      expect(BinaryString.toVisual('1111')).toBe('████');
      expect(BinaryString.toVisual('0000')).toBe('    ');
    });
  });

  describe('validate', () => {
    it('should validate binary strings', () => {
      expect(BinaryString.validate('101010')).toBe(true);
      expect(BinaryString.validate('111111')).toBe(true);
      expect(BinaryString.validate('000000')).toBe(true);
    });

    it('should reject non-binary strings', () => {
      expect(BinaryString.validate('102')).toBe(false);
      expect(BinaryString.validate('ABC')).toBe(false);
      expect(BinaryString.validate('')).toBe(false);
    });
  });

  describe('repeat', () => {
    it('should repeat pattern', () => {
      expect(BinaryString.repeat('10', 3)).toBe('101010');
      expect(BinaryString.repeat('1', 5)).toBe('11111');
      expect(BinaryString.repeat('010', 2)).toBe('010010');
    });
  });

  describe('addQuietZone', () => {
    it('should add quiet zones', () => {
      const result = BinaryString.addQuietZone('101', 2, 3);
      expect(result).toBe('00101000');
    });

    it('should use default quiet zones', () => {
      const result = BinaryString.addQuietZone('101');
      expect(result.startsWith('0000000000')).toBe(true);
      expect(result.endsWith('0000000000')).toBe(true);
    });
  });
});

describe('CharacterEncoder', () => {
  describe('toASCII', () => {
    it('should convert string to ASCII values', () => {
      expect(CharacterEncoder.toASCII('ABC')).toEqual([65, 66, 67]);
      expect(CharacterEncoder.toASCII('123')).toEqual([49, 50, 51]);
    });
  });

  describe('fromASCII', () => {
    it('should convert ASCII values to string', () => {
      expect(CharacterEncoder.fromASCII([65, 66, 67])).toBe('ABC');
      expect(CharacterEncoder.fromASCII([49, 50, 51])).toBe('123');
    });
  });

  describe('isNumeric', () => {
    it('should validate numeric strings', () => {
      expect(CharacterEncoder.isNumeric('123456')).toBe(true);
      expect(CharacterEncoder.isNumeric('0')).toBe(true);
    });

    it('should reject non-numeric strings', () => {
      expect(CharacterEncoder.isNumeric('ABC')).toBe(false);
      expect(CharacterEncoder.isNumeric('12A34')).toBe(false);
      expect(CharacterEncoder.isNumeric('')).toBe(false);
    });
  });

  describe('isAlphanumeric', () => {
    it('should validate alphanumeric strings', () => {
      expect(CharacterEncoder.isAlphanumeric('ABC123')).toBe(true);
      expect(CharacterEncoder.isAlphanumeric('TEST-DATA')).toBe(true);
      expect(CharacterEncoder.isAlphanumeric('A B C')).toBe(true);
    });

    it('should reject invalid strings', () => {
      expect(CharacterEncoder.isAlphanumeric('abc')).toBe(false); // lowercase
      expect(CharacterEncoder.isAlphanumeric('Test@')).toBe(false); // @
    });
  });

  describe('padZeros', () => {
    it('should pad on the left by default', () => {
      expect(CharacterEncoder.padZeros('123', 5)).toBe('00123');
      expect(CharacterEncoder.padZeros('1', 3)).toBe('001');
    });

    it('should pad on the right when specified', () => {
      expect(CharacterEncoder.padZeros('123', 5, false)).toBe('12300');
      expect(CharacterEncoder.padZeros('1', 3, false)).toBe('100');
    });

    it('should not pad if already long enough', () => {
      expect(CharacterEncoder.padZeros('12345', 3)).toBe('12345');
    });
  });
});

describe('DataValidator', () => {
  describe('validateLength', () => {
    it('should validate minimum length', () => {
      expect(DataValidator.validateLength('123', 3)).toBe(true);
      expect(DataValidator.validateLength('1234', 3)).toBe(true);
      expect(DataValidator.validateLength('12', 3)).toBe(false);
    });

    it('should validate maximum length', () => {
      expect(DataValidator.validateLength('123', 2, 5)).toBe(true);
      expect(DataValidator.validateLength('123456', 2, 5)).toBe(false);
    });
  });

  describe('validateCharset', () => {
    it('should validate charset', () => {
      expect(DataValidator.validateCharset('ABC', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')).toBe(true);
      expect(DataValidator.validateCharset('123', '0123456789')).toBe(true);
    });

    it('should reject invalid characters', () => {
      expect(DataValidator.validateCharset('ABC', '0123456789')).toBe(false);
      expect(DataValidator.validateCharset('12A', '0123456789')).toBe(false);
    });
  });

  describe('sanitize', () => {
    it('should remove invalid characters', () => {
      expect(DataValidator.sanitize('ABC123', '0123456789')).toBe('123');
      expect(DataValidator.sanitize('Test@123', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')).toBe('Test123');
    });

    it('should use replacement character', () => {
      expect(DataValidator.sanitize('A-B-C', 'ABC', '_')).toBe('A_B_C');
    });
  });
});

