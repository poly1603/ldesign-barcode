/**
 * Encoding utilities
 */

/**
 * Binary string manipulation helpers
 */
export class BinaryString {
  /**
   * Convert binary string to visual representation
   */
  static toVisual(binary: string): string {
    return binary.replace(/1/g, '█').replace(/0/g, ' ');
  }

  /**
   * Validate binary string
   */
  static validate(binary: string): boolean {
    return /^[01]+$/.test(binary);
  }

  /**
   * Repeat pattern
   */
  static repeat(pattern: string, times: number): string {
    return pattern.repeat(times);
  }

  /**
   * Add quiet zone (margins)
   */
  static addQuietZone(binary: string, leftZone: number = 10, rightZone: number = 10): string {
    const left = '0'.repeat(leftZone);
    const right = '0'.repeat(rightZone);
    return left + binary + right;
  }
}

/**
 * Character encoding helpers
 */
export class CharacterEncoder {
  /**
   * Convert string to ASCII values
   */
  static toASCII(str: string): number[] {
    return Array.from(str).map(char => char.charCodeAt(0));
  }

  /**
   * Convert ASCII values to string
   */
  static fromASCII(values: number[]): string {
    return values.map(val => String.fromCharCode(val)).join('');
  }

  /**
   * Check if string contains only digits
   */
  static isNumeric(str: string): boolean {
    return /^\d+$/.test(str);
  }

  /**
   * Check if string contains only alphanumeric characters
   */
  static isAlphanumeric(str: string): boolean {
    return /^[A-Z0-9\-. $/+%]+$/.test(str);
  }

  /**
   * Pad string with zeros
   */
  static padZeros(str: string, length: number, left: boolean = true): string {
    const padding = '0'.repeat(Math.max(0, length - str.length));
    return left ? padding + str : str + padding;
  }
}

/**
 * Data validation helpers
 */
export class DataValidator {
  /**
   * Validate length
   */
  static validateLength(data: string, minLength: number, maxLength?: number): boolean {
    if (data.length < minLength) return false;
    if (maxLength !== undefined && data.length > maxLength) return false;
    return true;
  }

  /**
   * Validate charset
   */
  static validateCharset(data: string, charset: string): boolean {
    for (const char of data) {
      if (!charset.includes(char)) return false;
    }
    return true;
  }

  /**
   * Sanitize data
   */
  static sanitize(data: string, charset: string, replacement: string = ''): string {
    return Array.from(data)
      .map(char => charset.includes(char) ? char : replacement)
      .join('');
  }
}

