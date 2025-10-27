/**
 * EAN encoder tests
 */

import { describe, it, expect } from 'vitest';
import { EAN13Encoder, EAN8Encoder } from '../ean';
import { BarcodeFormat } from '../../types';
import { getValidSamples, getInvalidSamples } from '../../../tests/fixtures/barcode-samples';

describe('EAN13Encoder', () => {
  const encoder = new EAN13Encoder();

  it('should return correct format', () => {
    expect(encoder.getFormat()).toBe(BarcodeFormat.EAN13);
  });

  it('should encode valid EAN-13 data', () => {
    const validSamples = getValidSamples(BarcodeFormat.EAN13);

    for (const sample of validSamples) {
      const result = encoder.encode(sample);
      expect(result).toBeDefined();
      expect(result.format).toBe(BarcodeFormat.EAN13);
      expect(result.bars).toBeTypeOf('string');
      expect(result.bars.length).toBeGreaterThan(0);
      expect(result.text).toBeTypeOf('string');
      expect(result.text.length).toBe(13); // Should be 13 digits
    }
  });

  it('should auto-add checksum for 12-digit codes', () => {
    const result = encoder.encode('690123456789');
    expect(result.text).toBe('6901234567892'); // Checksum '2' added
    expect(result.text.length).toBe(13);
  });

  it('should validate checksum for 13-digit codes', () => {
    // Valid checksum
    expect(() => encoder.encode('6901234567892')).not.toThrow();

    // Invalid checksum
    expect(() => encoder.encode('6901234567891')).toThrow(/checksum/i);
  });

  it('should pad short codes with zeros', () => {
    const result = encoder.encode('123');
    expect(result.text.length).toBe(13);
    expect(result.text).toMatch(/^0+123\d$/); // Should start with zeros
  });

  it('should validate input data', () => {
    const validSamples = getValidSamples(BarcodeFormat.EAN13);
    for (const sample of validSamples) {
      expect(encoder.validate(sample)).toBe(true);
    }
  });

  it('should reject invalid data', () => {
    const invalidSamples = getInvalidSamples(BarcodeFormat.EAN13);
    for (const sample of invalidSamples) {
      expect(encoder.validate(sample)).toBe(false);
    }
  });

  it('should generate correct binary pattern structure', () => {
    const result = encoder.encode('6901234567892');
    const bars = result.bars;

    // Should start with start pattern '101'
    expect(bars.substring(0, 3)).toBe('101');

    // Should have middle pattern '01010' at position 3 + (6*7)
    const middlePos = 3 + 42; // 3 start + 6 digits * 7 bits
    expect(bars.substring(middlePos, middlePos + 5)).toBe('01010');

    // Should end with end pattern '101'
    expect(bars.substring(bars.length - 3)).toBe('101');
  });

  it('should handle numeric strings with non-numeric characters', () => {
    const result = encoder.encode('690-123-456-789');
    expect(result.text).toBe('6901234567892');
  });
});

describe('EAN8Encoder', () => {
  const encoder = new EAN8Encoder();

  it('should return correct format', () => {
    expect(encoder.getFormat()).toBe(BarcodeFormat.EAN8);
  });

  it('should encode valid EAN-8 data', () => {
    const validSamples = getValidSamples(BarcodeFormat.EAN8);

    for (const sample of validSamples) {
      const result = encoder.encode(sample);
      expect(result).toBeDefined();
      expect(result.format).toBe(BarcodeFormat.EAN8);
      expect(result.text.length).toBe(8);
    }
  });

  it('should auto-add checksum for 7-digit codes', () => {
    const result = encoder.encode('1234567');
    expect(result.text).toBe('12345670');
    expect(result.text.length).toBe(8);
  });

  it('should validate checksum for 8-digit codes', () => {
    expect(() => encoder.encode('96385074')).not.toThrow();
    expect(() => encoder.encode('96385073')).toThrow(/checksum/i);
  });

  it('should validate input data', () => {
    expect(encoder.validate('1234567')).toBe(true);
    expect(encoder.validate('12345670')).toBe(true);
    expect(encoder.validate('96385074')).toBe(true);
  });

  it('should reject invalid data', () => {
    expect(encoder.validate('123')).toBe(false);       // Too short
    expect(encoder.validate('123456789')).toBe(false); // Too long
    expect(encoder.validate('ABCD1234')).toBe(false);  // Non-numeric
  });

  it('should generate correct binary pattern structure', () => {
    const result = encoder.encode('96385074');
    const bars = result.bars;

    // Should start with '101'
    expect(bars.substring(0, 3)).toBe('101');

    // Should have middle pattern
    const middlePos = 3 + 28; // 3 start + 4 digits * 7 bits
    expect(bars.substring(middlePos, middlePos + 5)).toBe('01010');

    // Should end with '101'
    expect(bars.substring(bars.length - 3)).toBe('101');
  });
});


