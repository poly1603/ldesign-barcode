/**
 * Vue composable for barcode scanning
 */

import { ref, Ref } from 'vue';
import { ScanResult, ScannerOptions } from '../../../types';
import { ImageScanner } from '../../../scanner/image-scanner';

/**
 * Use Barcode Scanner composable
 */
export function useBarcodeScanner(options?: Ref<ScannerOptions>) {
  const scanner = ref<ImageScanner>(new ImageScanner(options?.value));
  const results = ref<ScanResult[]>([]);
  const isScanning = ref(false);
  const error = ref<Error | null>(null);

  /**
   * Scan file
   */
  const scanFile = async (file: File) => {
    try {
      isScanning.value = true;
      error.value = null;
      results.value = await scanner.value.scanFile(file);
      return results.value;
    } catch (err) {
      error.value = err as Error;
      return [];
    } finally {
      isScanning.value = false;
    }
  };

  /**
   * Scan image
   */
  const scanImage = async (image: HTMLImageElement) => {
    try {
      isScanning.value = true;
      error.value = null;
      results.value = await scanner.value.scanImage(image);
      return results.value;
    } catch (err) {
      error.value = err as Error;
      return [];
    } finally {
      isScanning.value = false;
    }
  };

  /**
   * Scan ImageData
   */
  const scanImageData = async (imageData: ImageData) => {
    try {
      isScanning.value = true;
      error.value = null;
      results.value = await scanner.value.scanImageData(imageData);
      return results.value;
    } catch (err) {
      error.value = err as Error;
      return [];
    } finally {
      isScanning.value = false;
    }
  };

  /**
   * Scan batch
   */
  const scanBatch = async (files: File[]) => {
    try {
      isScanning.value = true;
      error.value = null;
      return await scanner.value.scanBatch(files);
    } catch (err) {
      error.value = err as Error;
      return [];
    } finally {
      isScanning.value = false;
    }
  };

  /**
   * Update options
   */
  const setOptions = (newOptions: Partial<ScannerOptions>) => {
    scanner.value.setOptions(newOptions);
  };

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

