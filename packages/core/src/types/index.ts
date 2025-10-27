/**
 * @ldesign/barcode - Type Definitions
 */

/**
 * Supported barcode formats
 */
export enum BarcodeFormat {
  EAN13 = 'EAN13',
  EAN8 = 'EAN8',
  UPCA = 'UPCA',
  UPCE = 'UPCE',
  CODE128 = 'CODE128',
  CODE39 = 'CODE39',
  CODE93 = 'CODE93',
  ITF14 = 'ITF14',
  CODABAR = 'CODABAR',
}

/**
 * Render type
 */
export type RenderType = 'svg' | 'canvas';

/**
 * Text alignment
 */
export type TextAlign = 'left' | 'center' | 'right';

/**
 * Barcode configuration
 */
export interface BarcodeConfig {
  /** Barcode content/data to encode */
  content: string;

  /** Barcode format */
  format?: BarcodeFormat;

  /** Barcode width in pixels */
  width?: number;

  /** Barcode height in pixels */
  height?: number;

  /** Display human-readable text below barcode */
  displayValue?: boolean;

  /** Background color */
  background?: string;

  /** Foreground (bar) color */
  foreground?: string;

  /** Render type: SVG or Canvas */
  renderType?: RenderType;

  /** Margin around barcode in pixels */
  margin?: number;

  /** Font size for text */
  fontSize?: number;

  /** Text alignment */
  textAlign?: TextAlign;

  /** Font family for text */
  fontFamily?: string;

  /** Line width for individual bars */
  lineWidth?: number;

  /** Container element to append to */
  container?: HTMLElement;
}

/**
 * Render options (internal)
 */
export interface RenderOptions {
  renderType: RenderType;
  width: number;
  height: number;
  margin: number;
  fontSize: number;
  textAlign: TextAlign;
  fontFamily: string;
  displayValue: boolean;
  background: string;
  foreground: string;
  lineWidth: number;
}

/**
 * Encoded barcode data
 */
export interface EncodedBarcode {
  /** Binary pattern (e.g., "101010011...") */
  bars: string;

  /** Human-readable text */
  text: string;

  /** Format used */
  format: BarcodeFormat;
}

/**
 * Barcode instance interface
 */
export interface BarcodeInstance {
  /**
   * Update barcode configuration
   */
  update(config: Partial<BarcodeConfig>): void;

  /**
   * Get data URL (canvas only)
   */
  toDataURL(format?: 'png' | 'jpeg', quality?: number): string;

  /**
   * Get SVG string (SVG only)
   */
  toSVGString(): string;

  /**
   * Download barcode
   */
  download(fileName?: string, format?: 'png' | 'jpeg' | 'svg'): void;

  /**
   * Destroy barcode instance
   */
  destroy(): void;

  /**
   * Get the rendered element
   */
  getElement(): HTMLCanvasElement | SVGSVGElement | null;
}

/**
 * Download options
 */
export interface DownloadOptions {
  fileName?: string;
  format?: 'png' | 'jpeg' | 'svg';
  quality?: number;
}

/**
 * Scan result
 */
export interface ScanResult {
  /** Detected barcode format */
  format: BarcodeFormat | string;

  /** Decoded data */
  data: string;

  /** Confidence level (0-1) */
  confidence: number;

  /** Additional metadata */
  metadata?: {
    angle?: number;
    position?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
}

/**
 * Scanner options
 */
export interface ScannerOptions {
  /** Formats to scan for */
  formats?: BarcodeFormat[];

  /** Enable image preprocessing */
  preprocess?: boolean;

  /** Number of scan attempts */
  maxAttempts?: number;

  /** Enable debug mode */
  debug?: boolean;
}

/**
 * Batch scan result
 */
export interface BatchScanResult {
  /** File name */
  fileName: string;

  /** Scan results */
  results: ScanResult[];

  /** Error if scan failed */
  error?: Error;
}

/**
 * Format encoder interface
 */
export interface FormatEncoder {
  /**
   * Encode data to barcode pattern
   */
  encode(data: string): EncodedBarcode;

  /**
   * Validate data format
   */
  validate(data: string): boolean;

  /**
   * Get format name
   */
  getFormat(): BarcodeFormat;
}

/**
 * Renderer interface
 */
export interface Renderer {
  /**
   * Render encoded barcode
   */
  render(encoded: EncodedBarcode, options: RenderOptions): void;

  /**
   * Get rendered element
   */
  getElement(): HTMLCanvasElement | SVGSVGElement | null;

  /**
   * Destroy renderer
   */
  destroy(): void;
}

