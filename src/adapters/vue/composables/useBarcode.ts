/**
 * Vue composable for barcode generation
 */

import { ref, watch, onMounted, onUnmounted, Ref } from 'vue';
import { BarcodeConfig, BarcodeInstance } from '../../../types';
import { createBarcode } from '../../../core/barcode-generator';

/**
 * Use Barcode composable
 */
export function useBarcode(config: Ref<BarcodeConfig>) {
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
          ...config.value,
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
  const update = async (newConfig: Partial<BarcodeConfig>) => {
    if (instance.value) {
      try {
        await instance.value.update(newConfig);
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

  // Watch config changes
  watch(config, () => {
    if (instance.value) {
      update(config.value);
    }
  }, { deep: true });

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

