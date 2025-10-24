/**
 * Codabar encoder tests
 */

import { describe, it, expect } from 'vitest';
import { CodabarEncoder } from '../codabar';
import { BarcodeFormat } from '../../types';

describe('CodabarEncoder', () => {
  const encoder = new CodabarEncoder();

  it('should return correct format', () => {
    expect(encoder.getFormat()).toBe(BarcodeFormat.CODABAR);
  });

  it('should encode valid Codabar data', () => {
    const validSamples = ['A123456A', '123456', 'B123-456C', 'C123.456D'];

    for (const sample of validSamples) {
      const result = encoder.encode(sample);
      expect(result).toBeDefined();
      expect(result.format).toBe(BarcodeFormat.CODABAR);
      expect(result.bars).toBeTypeOf('string');
    }
  });

  it('should add start/stop characters if missing', () => {
    const result = encoder.encode('123456');
    expect(result.text).toMatch(/^[ABCD].*[ABCD]$/);
  });

  it('should preserve existing start/stop characters', () => {
    const result = encoder.encode('A123456A');
    expect(result.text).toBe('A123456A');
  });

  it('should handle special characters', () => {
    const samples = ['A123-456A', 'B123.456B', 'C123:456C', 'D123/456D'];

    for (const sample of samples) {
      const result = encoder.encode(sample);
      expect(result).toBeDefined();
    }
  });

  it('should validate input data', () => {
    expect(encoder.validate('A123456A')).toBe(true);
    expect(encoder.validate('123456')).toBe(true);
    expect(encoder.validate('B123-456C')).toBe(true);
  });

  it('should reject empty data', () => {
    expect(encoder.validate('')).toBe(false);
    expect(() => encoder.encode('')).toThrow();
  });

  it('should generate binary pattern', () => {
    const result = encoder.encode('A123456A');
    const bars = result.bars;

    expect(bars).toMatch(/^[01]+$/);
    expect(bars.length).toBeGreaterThan(40);
  });

  it('should support different start/stop combinations', () => {
    const combinations = ['A123A', 'B123B', 'C123C', 'D123D', 'A123B', 'C123D'];

    for (const combo of combinations) {
      const result = encoder.encode(combo);
      expect(result).toBeDefined();
    }
  });

  it('should be deterministic', () => {
    const data = 'A123456A';
    const result1 = encoder.encode(data);
    const result2 = encoder.encode(data);

    expect(result1.bars).toBe(result2.bars);
  });
});


