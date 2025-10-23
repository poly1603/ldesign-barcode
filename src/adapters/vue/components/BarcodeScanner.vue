<template>
  <div class="barcode-scanner">
    <div class="scanner-input">
      <input ref="fileInput" type="file" accept="image/*" :multiple="multiple" @change="handleFileChange"
        class="file-input" />
      <button @click="triggerFileInput" class="scan-button" :disabled="isScanning">
        {{ isScanning ? 'Scanning...' : 'Select Image' }}
      </button>
    </div>

    <div v-if="previewUrl" class="preview-container">
      <img :src="previewUrl" alt="Preview" class="preview-image" />
    </div>

    <div v-if="isScanning" class="scanner-loading">
      <div class="spinner"></div>
      <span>Scanning barcode...</span>
    </div>

    <div v-if="error" class="scanner-error">
      {{ error.message }}
    </div>

    <div v-if="results.length > 0" class="scanner-results">
      <h3>Scan Results:</h3>
      <div v-for="(result, index) in results" :key="index" class="result-item">
        <div class="result-format">{{ result.format }}</div>
        <div class="result-data">{{ result.data }}</div>
        <div class="result-confidence">Confidence: {{ (result.confidence * 100).toFixed(1) }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { BarcodeFormat, ScannerOptions } from '../../../types';
import { useBarcodeScanner } from '../composables/useBarcodeScanner';

// Props
interface Props {
  formats?: BarcodeFormat[];
  preprocess?: boolean;
  maxAttempts?: number;
  multiple?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  preprocess: true,
  maxAttempts: 3,
  multiple: false,
});

// Emits
const emit = defineEmits<{
  scan: [results: any[]];
  error: [error: Error];
}>();

// Scanner options
const options = computed<ScannerOptions>(() => ({
  formats: props.formats,
  preprocess: props.preprocess,
  maxAttempts: props.maxAttempts,
}));

// Use scanner composable
const { results, isScanning, error, scanFile, scanBatch } = useBarcodeScanner(options);

// File input ref
const fileInput = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);

/**
 * Trigger file input
 */
const triggerFileInput = () => {
  fileInput.value?.click();
};

/**
 * Handle file change
 */
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files || []);

  if (files.length === 0) return;

  // Create preview
  if (files.length === 1) {
    previewUrl.value = URL.createObjectURL(files[0]);
  }

  try {
    if (files.length === 1) {
      const scanResults = await scanFile(files[0]);
      emit('scan', scanResults);
    } else {
      const batchResults = await scanBatch(files);
      emit('scan', batchResults);
    }
  } catch (err) {
    emit('error', err as Error);
  }
};

// Cleanup preview URL
const cleanupPreview = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }
};

// Expose methods
defineExpose({
  scanFile,
  scanBatch,
  cleanupPreview,
});
</script>

<style scoped>
.barcode-scanner {
  padding: 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.scanner-input {
  margin-bottom: 16px;
}

.file-input {
  display: none;
}

.scan-button {
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.scan-button:hover:not(:disabled) {
  background: #66b1ff;
}

.scan-button:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}

.preview-container {
  margin-bottom: 16px;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.scanner-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f4f4f5;
  border-radius: 4px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #409eff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.scanner-error {
  padding: 12px;
  background: #fef0f0;
  color: #f56c6c;
  border-radius: 4px;
  margin-bottom: 16px;
}

.scanner-results {
  margin-top: 16px;
}

.scanner-results h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #303133;
}

.result-item {
  padding: 12px;
  background: #f4f4f5;
  border-radius: 4px;
  margin-bottom: 8px;
}

.result-format {
  font-weight: 600;
  color: #409eff;
  margin-bottom: 4px;
}

.result-data {
  font-family: monospace;
  font-size: 14px;
  margin-bottom: 4px;
}

.result-confidence {
  font-size: 12px;
  color: #909399;
}
</style>
