/**
 * @ldesign/barcode-react - React 适配器
 */

// Export components
export { Barcode } from './components/Barcode';
export type { BarcodeProps } from './components/Barcode';
export { BarcodeScanner } from './components/BarcodeScanner';
export type { BarcodeScannerProps } from './components/BarcodeScanner';

// Export hooks
export { useBarcode } from './hooks/useBarcode';
export type { UseBarcodeReturn } from './hooks/useBarcode';
export { useBarcodeScanner } from './hooks/useBarcodeScanner';

// Re-export types and core utilities from barcode-core
export type {
  BarcodeConfig,
  BarcodeInstance,
  BarcodeFormat,
  RenderType,
  ScanResult,
  ScannerOptions,
} from '@ldesign/barcode-core';

