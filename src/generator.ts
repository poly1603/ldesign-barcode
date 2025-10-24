/**
 * Generator-only entry point (tree-shakable)
 */

export type {
  // Types
  BarcodeConfig,
  BarcodeInstance,
  EncodedBarcode,
  RenderOptions,
  RenderType,
} from './types';

export {
  BarcodeFormat,
} from './types';

export {
  // Core generator
  BarcodeGenerator,
  createBarcode,
  generateBarcode,
} from './core/barcode-generator';

export {
  // Validator
  BarcodeValidator,
} from './core/barcode-validator';

export {
  // Format registry
  FormatRegistry,
} from './core/format-registry';

export {
  // Renderers
  SVGRenderer,
  CanvasRenderer,
} from './renderers';

export {
  // Batch generation
  BatchBarcodeGenerator,
  generateBatch,
} from './core/batch-generator';

export type {
  BatchConfig,
  BatchResult,
  BatchGeneratorOptions,
} from './core/batch-generator';

export {
  // Cache
  BarcodeCache,
  getGlobalCache,
  configureGlobalCache,
} from './core/barcode-cache';

export {
  // Resource pool
  CanvasPool,
  getGlobalCanvasPool,
  configureGlobalCanvasPool,
} from './core/resource-pool';

export {
  // Errors
  BarcodeError,
  EncodingError,
  ValidationError,
  RenderingError,
  ErrorFactory,
  ErrorHandler,
} from './errors';


