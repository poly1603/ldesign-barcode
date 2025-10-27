/**
 * Environment Detection Utilities
 * Detects browser capabilities and provides SSR compatibility
 */

/**
 * Check if running in browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Check if running in Node.js environment
 */
export function isNode(): boolean {
  return typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
}

/**
 * Check if DOM is available
 */
export function isDOMAvailable(): boolean {
  return isBrowser() && typeof document.createElement === 'function';
}

/**
 * Check if Canvas API is supported
 */
export function isCanvasSupported(): boolean {
  if (!isDOMAvailable()) return false;

  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext && canvas.getContext('2d'));
  } catch (e) {
    return false;
  }
}

/**
 * Check if OffscreenCanvas is supported
 */
export function isOffscreenCanvasSupported(): boolean {
  return typeof OffscreenCanvas !== 'undefined';
}

/**
 * Check if SVG is supported
 */
export function isSVGSupported(): boolean {
  if (!isDOMAvailable()) return false;

  try {
    return !!document.createElementNS &&
      !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
  } catch (e) {
    return false;
  }
}

/**
 * Check if File API is supported
 */
export function isFileAPISupported(): boolean {
  return isBrowser() && typeof File !== 'undefined' && typeof FileReader !== 'undefined';
}

/**
 * Check if Blob API is supported
 */
export function isBlobSupported(): boolean {
  return isBrowser() && typeof Blob !== 'undefined';
}

/**
 * Get recommended render type based on environment
 */
export function getRecommendedRenderType(): 'canvas' | 'svg' | null {
  if (isOffscreenCanvasSupported()) return 'canvas';
  if (isCanvasSupported()) return 'canvas';
  if (isSVGSupported()) return 'svg';
  return null;
}

/**
 * Validate environment for barcode generation
 */
export function validateGenerationEnvironment(): {
  supported: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!isBrowser()) {
    issues.push('Not running in browser environment');
  }

  if (!isDOMAvailable()) {
    issues.push('DOM is not available');
  }

  if (!isCanvasSupported() && !isSVGSupported()) {
    issues.push('Neither Canvas nor SVG is supported');
  }

  return {
    supported: issues.length === 0,
    issues,
  };
}

/**
 * Validate environment for barcode scanning
 */
export function validateScanningEnvironment(): {
  supported: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!isBrowser()) {
    issues.push('Not running in browser environment');
  }

  if (!isCanvasSupported()) {
    issues.push('Canvas API is not supported');
  }

  if (!isFileAPISupported()) {
    issues.push('File API is not supported');
  }

  return {
    supported: issues.length === 0,
    issues,
  };
}

/**
 * Environment detection result
 */
export interface EnvironmentInfo {
  isBrowser: boolean;
  isNode: boolean;
  isDOMAvailable: boolean;
  isCanvasSupported: boolean;
  isOffscreenCanvasSupported: boolean;
  isSVGSupported: boolean;
  isFileAPISupported: boolean;
  isBlobSupported: boolean;
  recommendedRenderType: 'canvas' | 'svg' | null;
}

/**
 * Get complete environment information
 */
export function getEnvironmentInfo(): EnvironmentInfo {
  return {
    isBrowser: isBrowser(),
    isNode: isNode(),
    isDOMAvailable: isDOMAvailable(),
    isCanvasSupported: isCanvasSupported(),
    isOffscreenCanvasSupported: isOffscreenCanvasSupported(),
    isSVGSupported: isSVGSupported(),
    isFileAPISupported: isFileAPISupported(),
    isBlobSupported: isBlobSupported(),
    recommendedRenderType: getRecommendedRenderType(),
  };
}

