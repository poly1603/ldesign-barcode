/**
 * Code39 encoder tests
 */

import { describe, it, expect } from 'vitest';
import { Code39Encoder } from '../code39';
import { BarcodeFormat } from '../../types';
import { getValidSamples } from '../../../tests/fixtures/barcode-samples';

describe('Code39Encoder', () => {
  const encoder = new Code39Encoder();

  it('should return correct format', () => {
    expect(encoder.getFormat()).toBe(BarcodeFormat.CODE39);
  });

  it('should encode valid Code39 data', () => {
    const validSamples = ['HELLO', '123456', 'ABC123', 'TEST-DATA'];

    for (const sample of validSamples) {
      const result = encoder.encode(sample);
      expect(result).toBeDefined();
      expect(result.format).toBe(BarcodeFormat.CODE39);
      expect(result.bars).toBeTypeOf('string');
      expect(result.text).toBe(sample);
    }
  });

  it('should convert lowercase to uppercase', () => {
    const result = encoder.encode('hello');
    expect(result.text).toBe('HELLO');
  });

  it('should handle numeric data', () => {
    const result = encoder.encode('123456');
    expect(result.text).toBe('123456');
    expect(result.format).toBe(BarcodeFormat.CODE39);
  });

  it('should handle spaces', () => {
    const result = encoder.encode('HELLO WORLD');
    expect(result.text).toBe('HELLO WORLD');
  });

  it('should handle special characters', () => {
    const validChars = ['ABC-123', 'TEST.DATA', 'A+B', 'X/Y', 'A%B', 'A$B'];

    for (const sample of validChars) {
      const result = encoder.encode(sample);
      expect(result.text).toBe(sample);
    }
  });

  it('should validate input data', () => {
    expect(encoder.validate('HELLO')).toBe(true);
    expect(encoder.validate('123456')).toBe(true);
    expect(encoder.validate('ABC-123')).toBe(true);
    expect(encoder.validate('HELLO WORLD')).toBe(true);
  });

  it('should reject empty data', () => {
    expect(encoder.validate('')).toBe(false);
    expect(() => encoder.encode('')).toThrow();
  });

  it('should generate binary pattern', () => {
    const result = encoder.encode('HELLO');
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
});

describe('Code39Encoder with checksum', () => {
  const encoder = new Code39Encoder(true);

  it('should add checksum when enabled', () => {
    const result = encoder.encode('HELLO');
    expect(result).toBeDefined();
    // Text should be longer due to checksum
    expect(result.text.length).toBeGreaterThan('HELLO'.length);
  });

  it('should produce different output with/without checksum', () => {
    const withChecksum = new Code39Encoder(true);
    const withoutChecksum = new Code39Encoder(false);

    const result1 = withChecksum.encode('TEST');
    const result2 = withoutChecksum.encode('TEST');

    expect(result1.bars.length).toBeGreaterThan(result2.bars.length);
  });
});


