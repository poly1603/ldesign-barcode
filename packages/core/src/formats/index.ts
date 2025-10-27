/**
 * Format encoders registry with dynamic loading support
 */

import { BarcodeFormat, FormatEncoder } from '../types';

// Lazy-loaded encoder cache
const encoderCache = new Map<BarcodeFormat, FormatEncoder>();

/**
 * Dynamically import and cache encoder for a format
 */
export async function getEncoder(format: BarcodeFormat): Promise<FormatEncoder> {
  // Check cache first
  if (encoderCache.has(format)) {
    return encoderCache.get(format)!;
  }

  let encoder: FormatEncoder;

  // Dynamic import based on format
  switch (format) {
    case BarcodeFormat.EAN13:
      const { EAN13Encoder } = await import('./ean');
      encoder = new EAN13Encoder();
      break;

    case BarcodeFormat.EAN8:
      const { EAN8Encoder } = await import('./ean');
      encoder = new EAN8Encoder();
      break;

    case BarcodeFormat.UPCA:
      const { UPCAEncoder } = await import('./upc');
      encoder = new UPCAEncoder();
      break;

    case BarcodeFormat.UPCE:
      const { UPCEEncoder } = await import('./upc');
      encoder = new UPCEEncoder();
      break;

    case BarcodeFormat.CODE128:
      const { Code128Encoder } = await import('./code128');
      encoder = new Code128Encoder();
      break;

    case BarcodeFormat.CODE39:
      const { Code39Encoder } = await import('./code39');
      encoder = new Code39Encoder();
      break;

    case BarcodeFormat.CODE93:
      const { Code93Encoder } = await import('./code93');
      encoder = new Code93Encoder();
      break;

    case BarcodeFormat.ITF14:
      const { ITF14Encoder } = await import('./itf');
      encoder = new ITF14Encoder();
      break;

    case BarcodeFormat.CODABAR:
      const { CodabarEncoder } = await import('./codabar');
      encoder = new CodabarEncoder();
      break;

    default:
      throw new Error(`Unsupported barcode format: ${format}`);
  }

  encoderCache.set(format, encoder);
  return encoder;
}

/**
 * Preload specific formats (for performance optimization)
 */
export async function preloadFormats(formats: BarcodeFormat[]): Promise<void> {
  await Promise.all(formats.map(format => getEncoder(format)));
}

/**
 * Clear encoder cache (for testing or memory management)
 */
export function clearEncoderCache(): void {
  encoderCache.clear();
}

/**
 * Get all loaded encoders
 */
export function getLoadedEncoders(): BarcodeFormat[] {
  return Array.from(encoderCache.keys());
}


