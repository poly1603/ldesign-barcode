import { describe, expect, it } from 'vitest';
import { validateBarcode, detectBarcodeFormat } from '../src/utils/validator';

describe('validator', () => {
  describe('validateBarcode', () => {
    it('should validate EAN-13 correctly', () => {
      expect(validateBarcode('1234567890128', 'ean13')).toBe(true);
      expect(validateBarcode('123456789012', 'ean13')).toBe(false);
      expect(validateBarcode('12345678901234', 'ean13')).toBe(false);
      expect(validateBarcode('abcdefghijklm', 'ean13')).toBe(false);
    });

    it('should validate EAN-8 correctly', () => {
      expect(validateBarcode('12345670', 'ean8')).toBe(true);
      expect(validateBarcode('1234567', 'ean8')).toBe(false);
      expect(validateBarcode('123456789', 'ean8')).toBe(false);
    });

    it('should validate Code128 correctly', () => {
      expect(validateBarcode('ABC123', 'code128')).toBe(true);
      expect(validateBarcode('Hello World', 'code128')).toBe(true);
      expect(validateBarcode('', 'code128')).toBe(false);
    });

    it('should validate UPC-A correctly', () => {
      expect(validateBarcode('123456789012', 'upca')).toBe(true);
      expect(validateBarcode('12345678901', 'upca')).toBe(false);
      expect(validateBarcode('1234567890123', 'upca')).toBe(false);
    });

    it('should validate Code39 correctly', () => {
      expect(validateBarcode('ABC123', 'code39')).toBe(true);
      expect(validateBarcode('HELLO-WORLD', 'code39')).toBe(true);
      expect(validateBarcode('hello', 'code39')).toBe(false);
    });
  });

  describe('detectBarcodeFormat', () => {
    it('should detect EAN-13 format', () => {
      const formats = detectBarcodeFormat('1234567890128');
      expect(formats).toContain('ean13');
    });

    it('should detect EAN-8 format', () => {
      const formats = detectBarcodeFormat('12345670');
      expect(formats).toContain('ean8');
    });

    it('should detect UPC-A format', () => {
      const formats = detectBarcodeFormat('123456789012');
      expect(formats).toContain('upca');
    });

    it('should detect multiple possible formats', () => {
      const formats = detectBarcodeFormat('123456789012');
      expect(formats.length).toBeGreaterThan(0);
    });

    it('should return empty array for invalid content', () => {
      const formats = detectBarcodeFormat('');
      expect(formats).toEqual([]);
    });

    it('should detect Code128 for alphanumeric strings', () => {
      const formats = detectBarcodeFormat('ABC123XYZ');
      expect(formats).toContain('code128');
    });
  });
});
