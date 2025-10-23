/**
 * @ldesign/barcode - 条形码生成与扫描
 */

import { BarcodeGenerator, createBarcode, generateBarcode } from './core/barcode-generator';
import { scanBarcode } from './scanner/image-scanner';

// Export types
export * from './types';

// Export core
export { BarcodeGenerator, createBarcode, generateBarcode } from './core/barcode-generator';
export { BarcodeValidator } from './core/barcode-validator';
export { FormatRegistry } from './core/format-registry';

// Export format encoders
export { EAN13Encoder, EAN8Encoder } from './formats/ean';
export { UPCAEncoder, UPCEEncoder } from './formats/upc';
export { Code128Encoder } from './formats/code128';
export { Code39Encoder } from './formats/code39';
export { Code93Encoder } from './formats/code93';
export { ITF14Encoder } from './formats/itf';
export { CodabarEncoder } from './formats/codabar';

// Export renderers
export { BaseRenderer } from './renderers/base-renderer';
export { SVGRenderer } from './renderers/svg-renderer';
export { CanvasRenderer } from './renderers/canvas-renderer';

// Export scanner
export { ImageScanner, scanBarcode } from './scanner/image-scanner';
export { BarcodeDecoder } from './scanner/decoder';
export { ImagePreprocessor } from './scanner/preprocessor';

// Export utilities
export { BinaryString, CharacterEncoder, DataValidator } from './utils/encoder';
export * from './utils/checksum';

// Default export
export default {
  BarcodeGenerator,
  createBarcode,
  generateBarcode,
  scanBarcode,
}






