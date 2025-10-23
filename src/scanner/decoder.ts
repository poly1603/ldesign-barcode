/**
 * Barcode decoder using Quagga2
 */

import { ScanResult, BarcodeFormat } from '../types';

// Lazy-load Quagga2
let Quagga: any = null;

/**
 * Initialize Quagga2
 */
async function initQuagga(): Promise<void> {
  if (Quagga) return;

  try {
    // @ts-ignore - Dynamic import
    Quagga = await import('@ericblade/quagga2');
  } catch (error) {
    console.warn('Quagga2 not available. Scanner functionality will be limited.', error);
  }
}

/**
 * Map Quagga format to BarcodeFormat
 */
function mapFormat(quaggaFormat: string): BarcodeFormat | string {
  const formatMap: { [key: string]: BarcodeFormat } = {
    'ean_13': BarcodeFormat.EAN13,
    'ean_8': BarcodeFormat.EAN8,
    'upc_a': BarcodeFormat.UPCA,
    'upc_e': BarcodeFormat.UPCE,
    'code_128': BarcodeFormat.CODE128,
    'code_39': BarcodeFormat.CODE39,
    'code_93': BarcodeFormat.CODE93,
    'i2of5': BarcodeFormat.ITF14,
    'codabar': BarcodeFormat.CODABAR,
  };

  return formatMap[quaggaFormat] || quaggaFormat;
}

/**
 * Barcode Decoder
 */
export class BarcodeDecoder {
  /**
   * Decode barcode from image
   */
  static async decode(
    image: HTMLImageElement | HTMLCanvasElement | ImageData,
    formats?: BarcodeFormat[]
  ): Promise<ScanResult[]> {
    await initQuagga();

    if (!Quagga) {
      throw new Error('Quagga2 library not available. Please install @ericblade/quagga2');
    }

    return new Promise((resolve) => {
      const results: ScanResult[] = [];

      // Convert formats to Quagga format names
      const quaggaFormats = formats?.map(f => this.toQuaggaFormat(f)) || [
        'ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128',
        'code_39', 'code_93', 'i2of5', 'codabar'
      ];

      const config = {
        decoder: {
          readers: quaggaFormats,
          multiple: true,
        },
        locate: true,
        src: image,
      };

      try {
        Quagga.decodeSingle(config, (result: any) => {
          if (result && result.codeResult) {
            const scanResult: ScanResult = {
              format: mapFormat(result.codeResult.format),
              data: result.codeResult.code,
              confidence: result.codeResult.quality || 0,
              metadata: result.box ? {
                position: {
                  x: result.box[0]?.[0] || 0,
                  y: result.box[0]?.[1] || 0,
                  width: Math.abs((result.box[1]?.[0] || 0) - (result.box[0]?.[0] || 0)),
                  height: Math.abs((result.box[2]?.[1] || 0) - (result.box[0]?.[1] || 0)),
                },
              } : undefined,
            };
            results.push(scanResult);
          }
          resolve(results);
        });
      } catch (error) {
        console.error('Decode error:', error);
        resolve([]);
      }
    });
  }

  /**
   * Convert BarcodeFormat to Quagga format name
   */
  private static toQuaggaFormat(format: BarcodeFormat): string {
    const formatMap: { [key in BarcodeFormat]: string } = {
      [BarcodeFormat.EAN13]: 'ean_13',
      [BarcodeFormat.EAN8]: 'ean_8',
      [BarcodeFormat.UPCA]: 'upc_a',
      [BarcodeFormat.UPCE]: 'upc_e',
      [BarcodeFormat.CODE128]: 'code_128',
      [BarcodeFormat.CODE39]: 'code_39',
      [BarcodeFormat.CODE93]: 'code_93',
      [BarcodeFormat.ITF14]: 'i2of5',
      [BarcodeFormat.CODABAR]: 'codabar',
    };

    return formatMap[format] || 'code_128';
  }
}

