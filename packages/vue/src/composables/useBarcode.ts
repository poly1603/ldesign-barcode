/**
 * Vue composable for barcode generation
 */

import { ref, watch, onUnmounted, Ref, isRef } from 'vue';
import { BarcodeConfig, BarcodeInstance, createBarcode, isBrowser } from '@ldesign/barcode-core';

export interface UseBarcodeReturn {
  container: Ref<HTMLElement | null>;
  instance: Ref<BarcodeInstance | null>;
  error: Ref<Error | null>;
  isLoading: Ref<boolean>;
  generate: () => Promise<void>;
  update: (newConfig: Partial<BarcodeConfig>) => void;
  download: (fileName?: string, format?: 'png' | 'jpeg' | 'svg') => void;
  toDataURL: (format?: 'png' | 'jpeg', quality?: number) => string;
  toSVGString: () => string;
}

/**
 * Use Barcode composable
 */
export function useBarcode(config: Ref<BarcodeConfig> | BarcodeConfig): UseBarcodeReturn {
  // Check SSR
  if (!isBrowser()) {
    console.warn('useBarcode: Not in browser environment, barcode generation will be skipped');
  }

  // Handle both ref and plain object
  const configRef = isRef(config) ? config : ref(config);
  const container = ref<HTMLElement | null>(null);
  const instance = ref<BarcodeInstance | null>(null);
  const error = ref<Error | null>(null);
  const isLoading = ref(false);

  /**
   * Generate barcode
   */
  const generate = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      // Destroy previous instance
      if (instance.value) {
        instance.value.destroy();
        instance.value = null;
      }

      // Create new instance
      if (container.value) {
        instance.value = createBarcode({
          ...configRef.value,
          container: container.value,
        });
      }
    } catch (err) {
      error.value = err as Error;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Update barcode
   */
  const update = (newConfig: Partial<BarcodeConfig>) => {
    if (instance.value) {
      try {
        instance.value.update(newConfig);
      } catch (err) {
        error.value = err as Error;
      }
    }
  };

  /**
   * Download barcode
   */
  const download = (fileName?: string, format?: 'png' | 'jpeg' | 'svg') => {
    if (instance.value) {
      instance.value.download(fileName, format);
    }
  };

  /**
   * Get data URL
   */
  const toDataURL = (format?: 'png' | 'jpeg', quality?: number): string => {
    if (instance.value) {
      return instance.value.toDataURL(format, quality);
    }
    return '';
  };

  /**
   * Get SVG string
   */
  const toSVGString = (): string => {
    if (instance.value) {
      return instance.value.toSVGString();
    }
    return '';
  };

  // Watch config changes (with immediate: false to avoid double render)
  watch(configRef, (newConfig) => {
    if (instance.value) {
      update(newConfig);
    }
  }, { deep: true, immediate: false });

  // Cleanup on unmount
  onUnmounted(() => {
    if (instance.value) {
      instance.value.destroy();
      instance.value = null;
    }
  });

  return {
    container,
    instance,
    error,
    isLoading,
    generate,
    update,
    download,
    toDataURL,
    toSVGString,
  };
}

