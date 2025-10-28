import { bench, describe } from 'vitest';
import { BarcodeGenerator } from '../src/generator';
import { validateBarcode, detectBarcodeFormat } from '../src/utils/validator';

describe('Performance Benchmarks', () => {
  const generator = new BarcodeGenerator();

  describe('Generation Performance', () => {
    bench('generate EAN-13 barcode (canvas)', async () => {
      await generator.generate('1234567890128', {
        format: 'ean13',
        renderType: 'canvas',
        width: 200,
        height: 100,
      });
    });

    bench('generate EAN-13 barcode (SVG)', async () => {
      await generator.generate('1234567890128', {
        format: 'ean13',
        renderType: 'svg',
        width: 200,
        height: 100,
      });
    });

    bench('generate Code128 barcode', async () => {
      await generator.generate('HELLO WORLD', {
        format: 'code128',
        width: 200,
        height: 100,
      });
    });

    bench('batch generation (10 barcodes)', async () => {
      const promises = Array.from({ length: 10 }, (_, i) =>
        generator.generate(`12345${i}7890128`, {
          format: 'ean13',
          width: 200,
          height: 100,
        })
      );
      await Promise.all(promises);
    });
  });

  describe('Validation Performance', () => {
    bench('validate EAN-13', () => {
      validateBarcode('1234567890128', 'ean13');
    });

    bench('validate Code128', () => {
      validateBarcode('HELLO WORLD', 'code128');
    });

    bench('detect format', () => {
      detectBarcodeFormat('1234567890128');
    });

    bench('batch validation (100 items)', () => {
      for (let i = 0; i < 100; i++) {
        validateBarcode('1234567890128', 'ean13');
      }
    });
  });

  describe('Data URL Generation', () => {
    bench('get data URL (PNG)', async () => {
      await generator.getDataURL('1234567890128', {
        format: 'ean13',
        renderType: 'canvas',
        width: 200,
        height: 100,
      });
    });

    bench('get data URL (SVG)', async () => {
      await generator.getDataURL('1234567890128', {
        format: 'ean13',
        renderType: 'svg',
        width: 200,
        height: 100,
      });
    });
  });

  describe('Memory Usage', () => {
    bench('create and destroy 50 barcodes', async () => {
      for (let i = 0; i < 50; i++) {
        const result = await generator.generate(`12345${i}0128`, {
          format: 'ean13',
          width: 200,
          height: 100,
        });
        // Clean up
        result.element?.remove();
      }
    });
  });
});
