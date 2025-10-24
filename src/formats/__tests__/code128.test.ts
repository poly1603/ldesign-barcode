/**
 * Code128 encoder tests
 */

import { describe, it, expect } from 'vitest';
import { Code128Encoder } from '../code128';
import { BarcodeFormat } from '../../types';
import { getValidSamples, getInvalidSamples } from '../../../tests/fixtures/barcode-samples';

describe('Code128Encoder', () => {
  const encoder = new Code128Encoder();

  it('should return correct format', () => {
    expect(encoder.getFormat()).toBe(BarcodeFormat.CODE128);
  });

  it('should encode valid Code128 data', () => {
    const validSamples = getValidSamples(BarcodeFormat.CODE128);

    for (const sample of validSamples) {
      const result = encoder.encode(sample);
      expect(result).toBeDefined();
      expect(result.format).toBe(BarcodeFormat.CODE128);
      expect(result.bars).toBeTypeOf('string');
      expect(result.bars.length).toBeGreaterThan(0);
      expect(result.text).toBe(sample);
    }
  });

  it('should optimize encoding for numeric data', () => {
    // Numeric data should use Code C (pairs of digits)
    const result = encoder.encode('12345678');
    expect(result).toBeDefined();
    expect(result.bars.length).toBeLessThan(encoder.encode('ABCDEFGH').bars.length);
  });

  it('should handle mixed alphanumeric data', () => {
    const samples = ['ABC123', 'Test123Test', '123ABC456'];

    for (const sample of samples) {
      const result = encoder.encode(sample);
      expect(result.text).toBe(sample);
      expect(result.format).toBe(BarcodeFormat.CODE128);
    }
  });

  it('should handle special characters', () => {
    const samples = ['Hello World', 'ABC-123', 'Test@123'];

    for (const sample of samples) {
      const result = encoder.encode(sample);
      expect(result.text).toBe(sample);
    }
  });

  it('should validate input data', () => {
    expect(encoder.validate('ABC123')).toBe(true);
    expect(encoder.validate('12345678')).toBe(true);
    expect(encoder.validate('Hello World')).toBe(true);
  });

  it('should reject invalid data', () => {
    expect(encoder.validate('')).toBe(false); // Empty
  });

  it('should reject non-ASCII characters', () => {
    expect(encoder.validate('Hello\u0200World')).toBe(false);
    expect(encoder.validate('Test\u2022')).toBe(false);
  });

  it('should throw for empty data', () => {
    expect(() => encoder.encode('')).toThrow(/empty/i);
  });

  it('should generate binary pattern with correct structure', () => {
    const result = encoder.encode('123456');
    const bars = result.bars;

    // Should be a valid binary string
    expect(bars).toMatch(/^[01]+$/);
    expect(bars.length).toBeGreaterThan(50); // Reasonable minimum length
  });

  it('should use Code C for 4+ consecutive digits', () => {
    const numeric = encoder.encode('12345678'); // Should use Code C
    const alpha = encoder.encode('ABCDEFGH');   // Should use Code B

    // Numeric should be shorter due to Code C optimization
    expect(numeric.bars.length).toBeLessThan(alpha.bars.length);
  });

  it('should handle control characters', () => {
    const result = encoder.encode('ABC\tDEF'); // Tab character
    expect(result).toBeDefined();
    expect(result.text).toBe('ABC\tDEF');
  });

  it('should produce different outputs for different inputs', () => {
    const result1 = encoder.encode('ABC123');
    const result2 = encoder.encode('ABC124');

    expect(result1.bars).not.toBe(result2.bars);
  });

  it('should be deterministic', () => {
    const data = 'Test123';
    const result1 = encoder.encode(data);
    const result2 = encoder.encode(data);

    expect(result1.bars).toBe(result2.bars);
    expect(result1.text).toBe(result2.text);
  });
});


