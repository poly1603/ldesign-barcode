/**
 * ITF-14 encoder tests
 */

import { describe, it, expect } from 'vitest';
import { ITF14Encoder } from '../itf';
import { BarcodeFormat } from '../../types';
import { getValidSamples } from '../../../tests/fixtures/barcode-samples';

describe('ITF14Encoder', () => {
  const encoder = new ITF14Encoder();

  it('should return correct format', () => {
    expect(encoder.getFormat()).toBe(BarcodeFormat.ITF14);
  });

  it('should encode valid ITF-14 data', () => {
    const validSamples = getValidSamples(BarcodeFormat.ITF14);

    for (const sample of validSamples) {
      const result = encoder.encode(sample);
      expect(result).toBeDefined();
      expect(result.format).toBe(BarcodeFormat.ITF14);
      expect(result.text.length).toBe(14);
    }
  });

  it('should auto-add checksum for 13-digit codes', () => {
    const result = encoder.encode('1234567890123');
    expect(result.text.length).toBe(14);
  });

  it('should pad short codes', () => {
    const result = encoder.encode('123');
    expect(result.text.length).toBe(14);
    expect(result.text).toMatch(/^0+/);
  });

  it('should validate input data', () => {
    expect(encoder.validate('12345678901231')).toBe(true);
    expect(encoder.validate('1234567890123')).toBe(true);
  });

  it('should reject invalid data', () => {
    expect(encoder.validate('ABC1234567890')).toBe(false);
    expect(encoder.validate('123456789012345')).toBe(false);
  });

  it('should generate binary pattern with interleaved encoding', () => {
    const result = encoder.encode('12345678901231');
    const bars = result.bars;

    expect(bars).toMatch(/^[01]+$/);
    expect(bars.length).toBeGreaterThan(50);
  });

  it('should handle all zeros', () => {
    const result = encoder.encode('00000000000000');
    expect(result.text).toBe('00000000000000');
  });

  it('should handle all nines', () => {
    const result = encoder.encode('9999999999999');
    expect(result.text.length).toBe(14);
  });
});


