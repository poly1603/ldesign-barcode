/**
 * UPC encoder tests
 */

import { describe, it, expect } from 'vitest';
import { UPCAEncoder, UPCEEncoder } from '../upc';
import { BarcodeFormat } from '../../types';
import { getValidSamples } from '../../../tests/fixtures/barcode-samples';

describe('UPCAEncoder', () => {
  const encoder = new UPCAEncoder();

  it('should return correct format', () => {
    expect(encoder.getFormat()).toBe(BarcodeFormat.UPCA);
  });

  it('should encode valid UPC-A data', () => {
    const validSamples = getValidSamples(BarcodeFormat.UPCA);

    for (const sample of validSamples) {
      const result = encoder.encode(sample);
      expect(result).toBeDefined();
      expect(result.format).toBe(BarcodeFormat.UPCA);
      expect(result.text.length).toBe(12);
    }
  });

  it('should auto-add checksum for 11-digit codes', () => {
    const result = encoder.encode('12345678901');
    expect(result.text.length).toBe(12);
  });

  it('should validate checksum for 12-digit codes', () => {
    expect(() => encoder.encode('123456789012')).not.toThrow();
  });

  it('should pad short codes', () => {
    const result = encoder.encode('123');
    expect(result.text.length).toBe(12);
  });

  it('should validate input data', () => {
    expect(encoder.validate('123456789012')).toBe(true);
    expect(encoder.validate('12345678901')).toBe(true);
  });

  it('should reject invalid data', () => {
    expect(encoder.validate('123')).toBe(false);          // Too short (without padding context)
    expect(encoder.validate('ABC123456789')).toBe(false); // Non-numeric
    expect(encoder.validate('1234567890123')).toBe(false);// Too long
  });

  it('should generate correct binary pattern', () => {
    const result = encoder.encode('123456789012');
    const bars = result.bars;

    expect(bars).toMatch(/^[01]+$/);
    expect(bars.substring(0, 3)).toBe('101'); // Start
    expect(bars.substring(bars.length - 3)).toBe('101'); // End
  });
});

describe('UPCEEncoder', () => {
  const encoder = new UPCEEncoder();

  it('should return correct format', () => {
    expect(encoder.getFormat()).toBe(BarcodeFormat.UPCE);
  });

  it('should encode valid UPC-E data', () => {
    const validSamples = getValidSamples(BarcodeFormat.UPCE);

    for (const sample of validSamples) {
      const result = encoder.encode(sample);
      expect(result).toBeDefined();
      expect(result.format).toBe(BarcodeFormat.UPCE);
      expect(result.text.length).toBeGreaterThanOrEqual(7);
      expect(result.text.length).toBeLessThanOrEqual(8);
    }
  });

  it('should handle different UPC-E formats', () => {
    const samples = ['01234565', '0123456', '12345678'];

    for (const sample of samples) {
      const result = encoder.encode(sample);
      expect(result).toBeDefined();
    }
  });

  it('should validate input data', () => {
    expect(encoder.validate('01234565')).toBe(true);
    expect(encoder.validate('0123456')).toBe(true);
  });

  it('should reject invalid data', () => {
    expect(encoder.validate('123')).toBe(false);
    expect(encoder.validate('ABCDEFGH')).toBe(false);
    expect(encoder.validate('123456789')).toBe(false);
  });

  it('should generate binary pattern', () => {
    const result = encoder.encode('01234565');
    const bars = result.bars;

    expect(bars).toMatch(/^[01]+$/);
    expect(bars.length).toBeGreaterThan(30);
  });
});


