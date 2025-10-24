/**
 * Checksum utility tests
 */

import { describe, it, expect } from 'vitest';
import {
  calculateEANChecksum,
  validateEANChecksum,
  calculateCode128Checksum,
  calculateCode39Checksum,
  calculateCode93Checksum,
  calculateITFChecksum,
} from '../checksum';

describe('Checksum Utilities', () => {
  describe('EAN Checksum', () => {
    it('should calculate correct EAN-13 checksum', () => {
      expect(calculateEANChecksum('690123456789')).toBe('2');
      expect(calculateEANChecksum('590123412345')).toBe('7');
      expect(calculateEANChecksum('400123456789')).toBe('5');
    });

    it('should calculate correct EAN-8 checksum', () => {
      expect(calculateEANChecksum('9638507')).toBe('4');
      expect(calculateEANChecksum('1234567')).toBe('0');
    });

    it('should validate correct EAN checksums', () => {
      expect(validateEANChecksum('6901234567892')).toBe(true);
      expect(validateEANChecksum('5901234123457')).toBe(true);
      expect(validateEANChecksum('96385074')).toBe(true);
    });

    it('should reject incorrect EAN checksums', () => {
      expect(validateEANChecksum('6901234567891')).toBe(false); // Wrong checksum
      expect(validateEANChecksum('5901234123456')).toBe(false); // Wrong checksum
    });

    it('should handle edge cases', () => {
      expect(calculateEANChecksum('000000000000')).toBe('0');
      expect(calculateEANChecksum('999999999999')).toBe('3');
    });
  });

  describe('Code128 Checksum', () => {
    it('should calculate checksum for encoded values', () => {
      // Start B (104) + "1" (17) + "2" (18) + "3" (19)
      const encoded1 = [104, 17, 18, 19];
      const checksum1 = calculateCode128Checksum(encoded1);
      expect(checksum1).toBeGreaterThanOrEqual(0);
      expect(checksum1).toBeLessThan(103);

      // Start C (105) + 12 (12) + 34 (34)
      const encoded2 = [105, 12, 34];
      const checksum2 = calculateCode128Checksum(encoded2);
      expect(checksum2).toBeGreaterThanOrEqual(0);
      expect(checksum2).toBeLessThan(103);
    });

    it('should calculate different checksums for different data', () => {
      const encoded1 = [104, 17, 18];
      const encoded2 = [104, 18, 17];
      expect(calculateCode128Checksum(encoded1)).not.toBe(calculateCode128Checksum(encoded2));
    });
  });

  describe('Code39 Checksum', () => {
    it('should calculate Code39 checksum', () => {
      const checksum1 = calculateCode39Checksum('HELLO');
      expect(checksum1).toBeTypeOf('string');
      expect(checksum1.length).toBe(1);

      const checksum2 = calculateCode39Checksum('123456');
      expect(checksum2).toBeTypeOf('string');
      expect(checksum2.length).toBe(1);
    });

    it('should calculate different checksums for different data', () => {
      expect(calculateCode39Checksum('HELLO')).not.toBe(calculateCode39Checksum('WORLD'));
      expect(calculateCode39Checksum('123')).not.toBe(calculateCode39Checksum('456'));
    });
  });

  describe('Code93 Checksum', () => {
    it('should calculate C and K check characters', () => {
      const checks = calculateCode93Checksum([10, 11, 12]);
      expect(checks).toHaveLength(2);
      expect(checks[0]).toBeGreaterThanOrEqual(0);
      expect(checks[0]).toBeLessThan(47);
      expect(checks[1]).toBeGreaterThanOrEqual(0);
      expect(checks[1]).toBeLessThan(47);
    });

    it('should calculate different checks for different data', () => {
      const checks1 = calculateCode93Checksum([10, 11, 12]);
      const checks2 = calculateCode93Checksum([12, 11, 10]);
      expect(checks1).not.toEqual(checks2);
    });
  });

  describe('ITF Checksum', () => {
    it('should calculate correct ITF checksum', () => {
      expect(calculateITFChecksum('1234567890123')).toBe('1');
      expect(calculateITFChecksum('0001234567890')).toBe('5');
    });

    it('should handle all numeric inputs', () => {
      expect(calculateITFChecksum('0000000000000')).toBe('0');
      expect(calculateITFChecksum('9999999999999')).toBeTypeOf('string');
    });
  });
});


