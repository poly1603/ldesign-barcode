/**
 * @ldesign/barcode-vue - Vue 3 适配器
 */

// Export components
export { default as Barcode } from './components/Barcode.vue';
export { default as BarcodeScanner } from './components/BarcodeScanner.vue';

// Export composables
export { useBarcode } from './composables/useBarcode';
export type { UseBarcodeReturn } from './composables/useBarcode';
export { useBarcodeScanner } from './composables/useBarcodeScanner';

// Re-export types and core utilities from barcode-core
export type {
  BarcodeConfig,
  BarcodeInstance,
  BarcodeFormat,
  RenderType,
  ScanResult,
  ScannerOptions,
} from '@ldesign/barcode-core';

