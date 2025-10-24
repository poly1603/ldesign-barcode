/**
 * Code93 encoder tests
 */

import { describe, it, expect } from 'vitest';
import { Code93Encoder } from '../code93';
import { BarcodeFormat } from '../../types';

describe('Code93Encoder', () => {
  const encoder = new Code93Encoder();

  it('should return correct format', () => {
    expect(encoder.getFormat()).toBe(BarcodeFormat.CODE93);
  });

  it('should encode valid Code93 data', () => {
    const validSamples = ['HELLO', '123456', 'CODE93', 'ABC-123'];

    for (const sample of validSamples) {
      const result = encoder.encode(sample);
      expect(result).toBeDefined();
      expect(result.format).toBe(BarcodeFormat.CODE93);
      expect(result.bars).toBeTypeOf('string');
    }
  });

  it('should convert lowercase to uppercase', () => {
    const result = encoder.encode('hello');
    expect(result.text).toBe('HELLO');
  });

  it('should handle numeric data', () => {
    const result = encoder.encode('123456');
    expect(result.text).toBe('123456');
  });

  it('should handle mixed alphanumeric', () => {
    const result = encoder.encode('ABC123');
    expect(result.text).toBe('ABC123');
  });

  it('should validate input data', () => {
    expect(encoder.validate('HELLO')).toBe(true);
    expect(encoder.validate('123456')).toBe(true);
    expect(encoder.validate('ABC-123')).toBe(true);
  });

  it('should reject empty data', () => {
    expect(encoder.validate('')).toBe(false);
    expect(() => encoder.encode('')).toThrow();
  });

  it('should generate binary pattern with check characters', () => {
    const result = encoder.encode('TEST');
    const bars = result.bars;

    expect(bars).toMatch(/^[01]+$/);
    expect(bars.length).toBeGreaterThan(50);
  });

  it('should produce different outputs for different inputs', () => {
    const result1 = encoder.encode('ABC');
    const result2 = encoder.encode('XYZ');

    expect(result1.bars).not.toBe(result2.bars);
  });

  it('should be deterministic', () => {
    const data = 'TEST123';
    const result1 = encoder.encode(data);
    const result2 = encoder.encode(data);

    expect(result1.bars).toBe(result2.bars);
  });

  it('should handle special characters', () => {
    const samples = ['ABC-123', 'TEST.DATA', 'A+B'];

    for (const sample of samples) {
      const result = encoder.encode(sample);
      expect(result).toBeDefined();
    }
  });
});


