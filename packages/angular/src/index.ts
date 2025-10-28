/**
 * @ldesign/barcode-angular
 * Angular条形码库
 */

// 组件
export { BarcodeComponent } from './components/barcode.component'
export { BarcodeScannerComponent } from './components/barcode-scanner.component'

// 指令
export { BarcodeDirective } from './directives/barcode.directive'

// 服务
export { BarcodeService } from './services/barcode.service'

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
