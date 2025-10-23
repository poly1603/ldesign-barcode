/**
 * React hook for barcode scanning
 */

import { useState, useCallback, useMemo } from 'react';
import { ScanResult, ScannerOptions, BatchScanResult } from '../../../types';
import { ImageScanner } from '../../../scanner/image-scanner';

/**
 * Use Barcode Scanner hook
 */
export function useBarcodeScanner(options?: ScannerOptions) {
  const scanner = useMemo(() => new ImageScanner(options), [options]);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Scan file
   */
  const scanFile = useCallback(async (file: File) => {
    try {
      setIsScanning(true);
      setError(null);
      const scanResults = await scanner.scanFile(file);
      setResults(scanResults);
      return scanResults;
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setIsScanning(false);
    }
  }, [scanner]);

  /**
   * Scan image
   */
  const scanImage = useCallback(async (image: HTMLImageElement) => {
    try {
      setIsScanning(true);
      setError(null);
      const scanResults = await scanner.scanImage(image);
      setResults(scanResults);
      return scanResults;
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setIsScanning(false);
    }
  }, [scanner]);

  /**
   * Scan ImageData
   */
  const scanImageData = useCallback(async (imageData: ImageData) => {
    try {
      setIsScanning(true);
      setError(null);
      const scanResults = await scanner.scanImageData(imageData);
      setResults(scanResults);
      return scanResults;
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setIsScanning(false);
    }
  }, [scanner]);

  /**
   * Scan batch
   */
  const scanBatch = useCallback(async (files: File[]): Promise<BatchScanResult[]> => {
    try {
      setIsScanning(true);
      setError(null);
      return await scanner.scanBatch(files);
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setIsScanning(false);
    }
  }, [scanner]);

  /**
   * Update options
   */
  const setOptions = useCallback((newOptions: Partial<ScannerOptions>) => {
    scanner.setOptions(newOptions);
  }, [scanner]);

  return {
    scanner,
    results,
    isScanning,
    error,
    scanFile,
    scanImage,
    scanImageData,
    scanBatch,
    setOptions,
  };
}

