import { describe, expect, it, vi } from 'vitest';
import { BarcodeGenerator } from '../src/generator';

describe('BarcodeGenerator', () => {
  it('should create instance', () => {
    const generator = new BarcodeGenerator();
    expect(generator).toBeInstanceOf(BarcodeGenerator);
  });

  it('should generate barcode with canvas', async () => {
    const generator = new BarcodeGenerator();
    const result = await generator.generate('123456789012', {
      format: 'upca',
      renderType: 'canvas',
      width: 300,
      height: 100
    });

    expect(result.success).toBe(true);
    expect(result.element).toBeDefined();
    expect(result.element?.tagName).toBe('CANVAS');
  });

  it('should generate barcode with SVG', async () => {
    const generator = new BarcodeGenerator();
    const result = await generator.generate('123456789012', {
      format: 'upca',
      renderType: 'svg',
      width: 300,
      height: 100
    });

    expect(result.success).toBe(true);
    expect(result.element).toBeDefined();
    expect(result.element?.tagName).toBe('svg');
  });

  it('should handle invalid content', async () => {
    const generator = new BarcodeGenerator();
    const result = await generator.generate('invalid', {
      format: 'ean13',
      width: 300,
      height: 100
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should generate Data URL', async () => {
    const generator = new BarcodeGenerator();
    const dataUrl = await generator.getDataURL('123456789012', {
      format: 'upca',
      width: 300,
      height: 100
    });

    expect(dataUrl).toMatch(/^data:image\/(png|svg\+xml);base64,/);
  });

  it('should use default options', async () => {
    const generator = new BarcodeGenerator();
    const result = await generator.generate('123456789012', { format: 'upca' });

    expect(result.success).toBe(true);
    expect(result.element).toBeDefined();
  });

  it('should respect custom dimensions', async () => {
    const generator = new BarcodeGenerator();
    const result = await generator.generate('123456789012', {
      format: 'upca',
      width: 500,
      height: 200
    });

    expect(result.success).toBe(true);
    if (result.element instanceof HTMLCanvasElement) {
      expect(result.element.width).toBe(500);
      expect(result.element.height).toBe(200);
    }
  });
});
