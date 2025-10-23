/**
 * React hook for barcode generation
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { BarcodeConfig, BarcodeInstance } from '../../../types';
import { createBarcode } from '../../../core/barcode-generator';

/**
 * Use Barcode hook
 */
export function useBarcode(config: BarcodeConfig) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<BarcodeInstance | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Generate barcode
   */
  const generate = useCallback(async () => {
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
          ...config,
          container: containerRef.current,
        });
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  /**
   * Update barcode
   */
  const update = useCallback(async (newConfig: Partial<BarcodeConfig>) => {
    if (instanceRef.current) {
      try {
        await instanceRef.current.update(newConfig);
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

  // Generate on mount and config change
  useEffect(() => {
    generate();
  }, [generate]);

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

