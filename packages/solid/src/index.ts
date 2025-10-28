/**
 * @ldesign/barcode-solid
 * Solid.js条形码库
 */

// 组件
export { Barcode, type BarcodeProps } from './components/Barcode'

// Primitives
export { createBarcode, type CreateBarcodeReturn } from './primitives/createBarcode'

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
  scanBarcode,
} from '@ldesign/barcode-core'
