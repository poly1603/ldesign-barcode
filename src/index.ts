/**
 * @ldesign/barcode - 条形码生成与扫描
 * 
 * @packageDocumentation
 * 完整的条形码解决方案，支持7种格式，提供生成、扫描、批量处理等功能
 */

// Export types
export * from './types';

// Export core
export { BarcodeGenerator, createBarcode, generateBarcode } from './core/barcode-generator';
export { BarcodeValidator } from './core/barcode-validator';
export { FormatRegistry } from './core/format-registry';

// Export format encoders (for advanced usage)
export { EAN13Encoder, EAN8Encoder } from './formats/ean';
export { UPCAEncoder, UPCEEncoder } from './formats/upc';
export { Code128Encoder } from './formats/code128';
export { Code39Encoder } from './formats/code39';
export { Code93Encoder } from './formats/code93';
export { ITF14Encoder } from './formats/itf';
export { CodabarEncoder } from './formats/codabar';

// Export renderers
export { BaseRenderer, SVGRenderer, CanvasRenderer } from './renderers';
export { OffscreenCanvasRenderer, isOffscreenCanvasSupported } from './renderers/offscreen-canvas-renderer';

// Export scanner
export { ImageScanner, scanBarcode } from './scanner/image-scanner';
export { BarcodeDecoder } from './scanner/decoder';
export { ImagePreprocessor } from './scanner/preprocessor';

// Export performance optimization
export { BatchBarcodeGenerator, generateBatch } from './core/batch-generator';
export type { BatchConfig, BatchResult, BatchGeneratorOptions } from './core/batch-generator';

export { BarcodeCache, getGlobalCache, configureGlobalCache } from './core/barcode-cache';
export { CanvasPool, getGlobalCanvasPool, configureGlobalCanvasPool } from './core/resource-pool';

// Export performance monitoring
export { PerformanceMonitor, getGlobalMonitor, configureGlobalMonitor, measure } from './performance/monitor';
export { PerformanceProfiler, getGlobalProfiler, configureGlobalProfiler, profile } from './performance/profiler';
export type { PerformanceMetrics, PerformanceReport, ProfileEntry } from './performance';

// Export errors
export {
  BarcodeError,
  EncodingError,
  ValidationError,
  RenderingError,
  ScanningError,
  ConfigurationError,
  ErrorFactory,
  ErrorHandler,
} from './errors';

// Export utilities
export { BinaryString, CharacterEncoder, DataValidator } from './utils/encoder';
export * from './utils/checksum';

// Import for default export
import { createBarcode, generateBarcode } from './core/barcode-generator';
import { scanBarcode } from './scanner/image-scanner';
import { generateBatch } from './core/batch-generator';

// Default export for convenience
export default {
  createBarcode,
  generateBarcode,
  scanBarcode,
  generateBatch,
}






