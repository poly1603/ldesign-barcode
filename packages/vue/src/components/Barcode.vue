<template>
  <div ref="container" class="barcode-container" :class="{ 'barcode-loading': isLoading }">
    <div v-if="error" class="barcode-error">{{ error.message }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { BarcodeConfig, BarcodeFormat, RenderType } from '../../../types';
import { useBarcode } from '../composables/useBarcode';

// Props
interface Props {
  content: string;
  format?: BarcodeFormat;
  width?: number;
  height?: number;
  displayValue?: boolean;
  background?: string;
  foreground?: string;
  renderType?: RenderType;
  margin?: number;
  fontSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  format: BarcodeFormat.CODE128,
  width: 200,
  height: 100,
  displayValue: true,
  background: '#ffffff',
  foreground: '#000000',
  renderType: 'canvas',
  margin: 10,
  fontSize: 14,
});

// Emits
const emit = defineEmits<{
  generated: [];
  error: [error: Error];
}>();

// Config
const config = computed<BarcodeConfig>(() => ({
  content: props.content,
  format: props.format,
  width: props.width,
  height: props.height,
  displayValue: props.displayValue,
  background: props.background,
  foreground: props.foreground,
  renderType: props.renderType,
  margin: props.margin,
  fontSize: props.fontSize,
}));

// Use barcode composable
const { container, error, isLoading, generate } = useBarcode(config);

// Watch error
watch(error, (newError) => {
  if (newError) {
    emit('error', newError);
  }
});

// Generate on mount
onMounted(() => {
  generate().then(() => {
    if (!error.value) {
      emit('generated');
    }
  });
});

// Expose methods
defineExpose({
  generate,
});
</script>

<style scoped>
.barcode-container {
  display: inline-block;
  position: relative;
}

.barcode-loading {
  opacity: 0.6;
}

.barcode-error {
  color: #f56c6c;
  font-size: 12px;
  padding: 4px 8px;
  background: #fef0f0;
  border-radius: 4px;
}
</style>
