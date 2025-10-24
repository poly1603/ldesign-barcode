/**
 * Scanner-only entry point (tree-shakable)
 */

export type {
  // Types
  ScanResult,
  ScannerOptions,
  BatchScanResult,
} from './types';

export {
  BarcodeFormat,
} from './types';

export {
  // Scanner
  ImageScanner,
  scanBarcode,
} from './scanner/image-scanner';

export {
  // Preprocessor
  ImagePreprocessor,
} from './scanner/preprocessor';

export {
  // Decoder
  BarcodeDecoder,
} from './scanner/decoder';

export {
  // Errors
  ScanningError,
  ErrorFactory,
  ErrorHandler,
} from './errors';


