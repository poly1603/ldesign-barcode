import { describe, expect, it } from 'vitest';
import { BarcodeGenerator } from '../src/generator';

/**
 * 视觉回归测试
 * 注意：这需要配置 @vitest/ui 或其他视觉测试工具
 */
describe('Visual Regression Tests', () => {
  const generator = new BarcodeGenerator();

  describe('EAN-13 Barcode Visual', () => {
    it('should generate consistent EAN-13 barcode', async () => {
      const result = await generator.generate('1234567890128', {
        format: 'ean13',
        width: 300,
        height: 100,
        displayValue: true,
      });

      expect(result.success).toBe(true);
      expect(result.element).toBeDefined();

      // 可以添加快照测试
      if (result.element instanceof HTMLCanvasElement) {
        const dataUrl = result.element.toDataURL();
        expect(dataUrl).toMatchSnapshot('ean13-barcode');
      }
    });

    it('should maintain visual consistency with different widths', async () => {
      const widths = [200, 300, 400];
      const results = await Promise.all(
        widths.map(width =>
          generator.generate('1234567890128', {
            format: 'ean13',
            width,
            height: 100,
          })
        )
      );

      results.forEach((result, index) => {
        expect(result.success).toBe(true);
        expect(result.element).toBeDefined();
        
        if (result.element instanceof HTMLCanvasElement) {
          expect(result.element.width).toBe(widths[index]);
        }
      });
    });
  });

  describe('Code128 Barcode Visual', () => {
    it('should generate readable Code128 barcode', async () => {
      const result = await generator.generate('HELLO WORLD', {
        format: 'code128',
        width: 300,
        height: 100,
        displayValue: true,
        fontSize: 20,
      });

      expect(result.success).toBe(true);
      expect(result.element).toBeDefined();
    });
  });

  describe('SVG Rendering Visual', () => {
    it('should generate valid SVG element', async () => {
      const result = await generator.generate('1234567890128', {
        format: 'ean13',
        renderType: 'svg',
        width: 300,
        height: 100,
      });

      expect(result.success).toBe(true);
      expect(result.element).toBeDefined();
      
      if (result.element) {
        expect(result.element.tagName.toLowerCase()).toBe('svg');
        // 验证 SVG 属性
        expect(result.element.getAttribute('width')).toBeDefined();
        expect(result.element.getAttribute('height')).toBeDefined();
      }
    });
  });

  describe('Color Variations', () => {
    it('should render with custom colors', async () => {
      const colors = [
        { background: '#ffffff', lineColor: '#000000' },
        { background: '#000000', lineColor: '#ffffff' },
        { background: '#f0f0f0', lineColor: '#333333' },
      ];

      for (const color of colors) {
        const result = await generator.generate('1234567890128', {
          format: 'ean13',
          width: 300,
          height: 100,
          ...color,
        });

        expect(result.success).toBe(true);
        expect(result.element).toBeDefined();
      }
    });
  });

  describe('Cross-Format Consistency', () => {
    const formats: Array<{ value: string; format: any }> = [
      { value: '1234567890128', format: 'ean13' },
      { value: '12345670', format: 'ean8' },
      { value: '123456789012', format: 'upca' },
      { value: 'HELLO', format: 'code39' },
    ];

    formats.forEach(({ value, format }) => {
      it(`should render ${format} consistently`, async () => {
        const result = await generator.generate(value, {
          format,
          width: 300,
          height: 100,
        });

        expect(result.success).toBe(true);
        expect(result.element).toBeDefined();
      });
    });
  });
});
