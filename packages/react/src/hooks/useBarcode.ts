/**
 * React hook for barcode generation
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { BarcodeConfig, BarcodeInstance, createBarcode, isBrowser } from '@ldesign/barcode-core';

export interface UseBarcodeReturn {
  containerRef: React.RefObject<HTMLDivElement>;
  instance: BarcodeInstance | null;
  error: Error | null;
  isLoading: boolean;
  generate: () => Promise<void>;
  update: (newConfig: Partial<BarcodeConfig>) => void;
  download: (fileName?: string, format?: 'png' | 'jpeg' | 'svg') => void;
  toDataURL: (format?: 'png' | 'jpeg', quality?: number) => string;
  toSVGString: () => string;
}

/**
 * Use Barcode hook
 */
export function useBarcode(config: BarcodeConfig): UseBarcodeReturn {
  // Check SSR
  if (!isBrowser()) {
    console.warn('useBarcode: Not in browser environment, barcode generation will be skipped');
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<BarcodeInstance | null>(null);
  const configRef = useRef<BarcodeConfig>(config);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMountedRef = useRef(false);

  // Update config ref when config changes
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  /**
   * Generate barcode
   */
  const generate = useCallback(async () => {
    if (!isBrowser()) return;

    try {
      setIsLoading(true);
      setError(null);

      // Destroy previous instance
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }

      // Create new instance
      if (containerRef.current) {
        instanceRef.current = createBarcode({
          ...configRef.current,
          container: containerRef.current,
        });
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update barcode
   */
  const update = useCallback((newConfig: Partial<BarcodeConfig>) => {
    if (instanceRef.current) {
      try {
        instanceRef.current.update(newConfig);
      } catch (err) {
        setError(err as Error);
      }
    }
  }, []);

  /**
   * Download barcode
   */
  const download = useCallback((fileName?: string, format?: 'png' | 'jpeg' | 'svg') => {
    if (instanceRef.current) {
      instanceRef.current.download(fileName, format);
    }
  }, []);

  /**
   * Get data URL
   */
  const toDataURL = useCallback((format?: 'png' | 'jpeg', quality?: number): string => {
    if (instanceRef.current) {
      return instanceRef.current.toDataURL(format, quality);
    }
    return '';
  }, []);

  /**
   * Get SVG string
   */
  const toSVGString = useCallback((): string => {
    if (instanceRef.current) {
      return instanceRef.current.toSVGString();
    }
    return '';
  }, []);

  // Generate on mount
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      generate();
    }
  }, [generate]);

  // Update when config changes (but not on mount)
  useEffect(() => {
    if (isMountedRef.current && instanceRef.current) {
      update(config);
    }
  }, [config, update]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, []);

  return {
    containerRef,
    instance: instanceRef.current,
    error,
    isLoading,
    generate,
    update,
    download,
    toDataURL,
    toSVGString,
  };
}

