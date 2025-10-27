/**
 * Error types for barcode library
 */

/**
 * Base Barcode Error
 */
export class BarcodeError extends Error {
  constructor(message: string, public code?: string, public details?: Record<string, any>) {
    super(message);
    this.name = 'BarcodeError';
  }
}

/**
 * Encoding Error
 */
export class EncodingError extends BarcodeError {
  constructor(message: string, public format?: string, public data?: string) {
    super(message, 'ENCODING_ERROR', { format, data });
    this.name = 'EncodingError';
  }
}

/**
 * Validation Error
 */
export class ValidationError extends BarcodeError {
  constructor(message: string, public field?: string, public value?: any) {
    super(message, 'VALIDATION_ERROR', { field, value });
    this.name = 'ValidationError';
  }
}

/**
 * Rendering Error
 */
export class RenderingError extends BarcodeError {
  constructor(message: string, public renderType?: string) {
    super(message, 'RENDERING_ERROR', { renderType });
    this.name = 'RenderingError';
  }
}

/**
 * Scanning Error
 */
export class ScanningError extends BarcodeError {
  constructor(message: string, public source?: string) {
    super(message, 'SCANNING_ERROR', { source });
    this.name = 'ScanningError';
  }
}

/**
 * Configuration Error
 */
export class ConfigurationError extends BarcodeError {
  constructor(message: string, public config?: Record<string, any>) {
    super(message, 'CONFIGURATION_ERROR', { config });
    this.name = 'ConfigurationError';
  }
}

/**
 * Error factory
 */
export class ErrorFactory {
  static invalidFormat(format: string, data: string): EncodingError {
    return new EncodingError(
      `Invalid data for format ${format}. Please check the data format and try again.`,
      format,
      data
    );
  }

  static invalidChecksum(format: string): ValidationError {
    return new ValidationError(
      `Invalid checksum for ${format}. The data appears to be corrupted.`,
      'checksum'
    );
  }

  static unsupportedCharacter(char: string, format: string): EncodingError {
    return new EncodingError(
      `Character '${char}' is not supported in ${format} format.`,
      format
    );
  }

  static dataLengthError(format: string, expected: string, actual: number): ValidationError {
    return new ValidationError(
      `Invalid data length for ${format}. Expected ${expected}, got ${actual} digits.`,
      'length',
      actual
    );
  }

  static renderingFailed(renderType: string, reason?: string): RenderingError {
    const message = reason
      ? `Rendering failed (${renderType}): ${reason}`
      : `Rendering failed for ${renderType}`;
    return new RenderingError(message, renderType);
  }

  static scanningFailed(reason?: string): ScanningError {
    return new ScanningError(
      reason || 'Failed to scan barcode. Please ensure the image is clear and try again.'
    );
  }

  static quaggaNotAvailable(): ScanningError {
    return new ScanningError(
      'Quagga2 library not available. Please install @ericblade/quagga2 to use scanning features.'
    );
  }

  static offscreenCanvasNotSupported(): RenderingError {
    return new RenderingError(
      'OffscreenCanvas is not supported in this environment.',
      'offscreen'
    );
  }
}

/**
 * Error handler with recovery suggestions
 */
export class ErrorHandler {
  /**
   * Get user-friendly error message with recovery suggestions
   */
  static getHelpfulMessage(error: Error): { message: string; suggestions: string[] } {
    if (error instanceof EncodingError) {
      return {
        message: error.message,
        suggestions: [
          `Verify that your data matches the ${error.format} format requirements`,
          'Check the documentation for valid character sets and data lengths',
          'Try using automatic format detection if unsure',
        ],
      };
    }

    if (error instanceof ValidationError) {
      return {
        message: error.message,
        suggestions: [
          'Double-check your input data',
          'Ensure all required fields are provided',
          'Refer to the format specification for valid values',
        ],
      };
    }

    if (error instanceof RenderingError) {
      return {
        message: error.message,
        suggestions: [
          'Try using a different render type (canvas/svg)',
          'Check browser compatibility',
          'Verify that the container element exists',
        ],
      };
    }

    if (error instanceof ScanningError) {
      return {
        message: error.message,
        suggestions: [
          'Ensure the image is clear and well-lit',
          'Try preprocessing the image',
          'Check that @ericblade/quagga2 is installed',
          'Verify the barcode format is supported',
        ],
      };
    }

    return {
      message: error.message,
      suggestions: ['Check the console for more details', 'Refer to the documentation'],
    };
  }

  /**
   * Log error with helpful information
   */
  static log(error: Error, context?: string): void {
    const { message, suggestions } = this.getHelpfulMessage(error);

    console.error(`[Barcode Error${context ? ` - ${context}` : ''}]`, message);

    if (suggestions.length > 0) {
      console.info('Suggestions:');
      suggestions.forEach((suggestion, i) => {
        console.info(`  ${i + 1}. ${suggestion}`);
      });
    }

    if (error instanceof BarcodeError && error.details) {
      console.debug('Error details:', error.details);
    }
  }
}


