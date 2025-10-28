/**
 * @ldesign/barcode-svelte
 * Svelte条形码库
 */

// 组件
export { default as Barcode } from './components/Barcode.svelte'
export { default as BarcodeScanner } from './components/BarcodeScanner.svelte'

// 重新导出核心类型
export type {
  BarcodeConfig,
  BarcodeFormat,
  BarcodeInstance,
  ScanResult,
  ScannerOptions,
  EncodedBarcode,
  RenderOptions,
} from '@ldesign/barcode-core'

// 重新导出核心功能
export {
  BarcodeFormat,
  BarcodeGenerator,
  BarcodeValidator,
  ImageScanner,
  createBarcode,
  scanBarcode,
} from '@ldesign/barcode-core'
