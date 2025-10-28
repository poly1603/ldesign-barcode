/**
 * Barcode validator utilities
 */

import { BarcodeValidator } from '../core/barcode-validator';
import type { BarcodeFormat } from '../types/enhanced';

const validator = new BarcodeValidator();

/**
 * 验证条形码内容是否符合指定格式
 */
export function validateBarcode(value: string, format: BarcodeFormat): boolean {
  try {
    return validator.validate(value, format);
  } catch {
    return false;
  }
}

/**
 * 自动检测条形码内容可能的格式
 */
export function detectBarcodeFormat(value: string): BarcodeFormat[] {
  const formats: BarcodeFormat[] = [
    'ean13',
    'ean8',
    'upca',
    'upce',
    'code128',
    'code39',
    'code93',
    'itf14',
    'codabar',
  ];

  const detected: BarcodeFormat[] = [];

  for (const format of formats) {
    if (validateBarcode(value, format)) {
      detected.push(format);
    }
  }

  return detected;
}
