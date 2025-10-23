/**
 * Checksum calculation utilities
 */

/**
 * Calculate EAN/UPC checksum (Modulo 10)
 */
export function calculateEANChecksum(data: string): number {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    const digit = parseInt(data[i], 10);
    sum += (i % 2 === 0) ? digit * 1 : digit * 3;
  }
  return (10 - (sum % 10)) % 10;
}

/**
 * Calculate Code128 checksum (Modulo 103)
 */
export function calculateCode128Checksum(values: number[]): number {
  let sum = values[0]; // Start code
  for (let i = 1; i < values.length; i++) {
    sum += values[i] * i;
  }
  return sum % 103;
}

/**
 * Calculate Code39 checksum (Modulo 43)
 */
export function calculateCode39Checksum(data: string): string {
  const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%';
  let sum = 0;

  for (const char of data) {
    const index = charset.indexOf(char);
    if (index === -1) continue;
    sum += index;
  }

  return charset[sum % 43];
}

/**
 * Calculate Code93 check characters (C and K)
 */
export function calculateCode93Checksum(data: string): string {
  const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%';

  // Calculate C check character
  let sumC = 0;
  let weightC = 1;
  for (let i = data.length - 1; i >= 0; i--) {
    const index = charset.indexOf(data[i]);
    sumC += index * weightC;
    weightC++;
    if (weightC > 20) weightC = 1;
  }
  const checkC = charset[sumC % 47];

  // Calculate K check character (includes C)
  let sumK = 0;
  let weightK = 1;
  const dataWithC = data + checkC;
  for (let i = dataWithC.length - 1; i >= 0; i--) {
    const index = charset.indexOf(dataWithC[i]);
    sumK += index * weightK;
    weightK++;
    if (weightK > 15) weightK = 1;
  }
  const checkK = charset[sumK % 47];

  return checkC + checkK;
}

/**
 * Validate EAN/UPC checksum
 */
export function validateEANChecksum(data: string): boolean {
  if (data.length < 2) return false;
  const checkDigit = parseInt(data[data.length - 1], 10);
  const calculated = calculateEANChecksum(data.slice(0, -1));
  return checkDigit === calculated;
}

/**
 * Calculate ITF checksum
 */
export function calculateITFChecksum(data: string): number {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    const digit = parseInt(data[i], 10);
    sum += (i % 2 === 0) ? digit * 3 : digit * 1;
  }
  return (10 - (sum % 10)) % 10;
}

