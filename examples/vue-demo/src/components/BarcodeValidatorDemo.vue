<template>
  <div class="demo-section">
    <h2>✅ 格式验证</h2>

    <div class="controls">
      <div class="control-group">
        <label for="validate-content">待验证内容:</label>
        <input
          id="validate-content"
          v-model="validateContent"
          type="text"
          placeholder="输入条形码内容"
          @keypress.enter="validate"
        >
      </div>
    </div>

    <div class="button-group">
      <button @click="validate">验证格式</button>
      <button @click="detect">自动检测格式</button>
    </div>

    <div v-if="validationResult" :class="['info-box', validationResult.type]">
      <strong>{{ validationResult.title }}</strong><br>
      <span v-html="validationResult.message"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useBarcode } from '@ldesign/barcode-vue';
import type { BarcodeFormat } from '@ldesign/barcode-core';

const validateContent = ref('1234567890128');
const validationResult = ref<{
  type: 'success' | 'error' | '';
  title: string;
  message: string;
} | null>(null);

const { validateBarcode, detectBarcodeFormat } = useBarcode();

// 从生成器组件获取当前选择的格式（这里简化处理，使用固定值）
const currentFormat = ref<BarcodeFormat>('ean13');

function validate() {
  const content = validateContent.value.trim();
  if (!content) {
    alert('请输入要验证的内容！');
    return;
  }

  const isValid = validateBarcode(content, currentFormat.value);

  if (isValid) {
    validationResult.value = {
      type: 'success',
      title: '✅ 验证通过',
      message: `内容 <code>${content}</code> 是有效的 <strong>${currentFormat.value.toUpperCase()}</strong> 格式`
    };
  } else {
    validationResult.value = {
      type: 'error',
      title: '❌ 验证失败',
      message: `内容 <code>${content}</code> 不是有效的 <strong>${currentFormat.value.toUpperCase()}</strong> 格式`
    };
  }
}

function detect() {
  const content = validateContent.value.trim();
  if (!content) {
    alert('请输入要检测的内容！');
    return;
  }

  const formats = detectBarcodeFormat(content);

  if (formats.length > 0) {
    validationResult.value = {
      type: 'success',
      title: '🔍 检测结果',
      message: `内容 <code>${content}</code> 可能的格式：<br><strong>${formats.map(f => f.toUpperCase()).join(', ')}</strong>`
    };
  } else {
    validationResult.value = {
      type: '',
      title: '⚠️ 未检测到格式',
      message: `内容 <code>${content}</code> 不匹配任何已知的条形码格式`
    };
  }
}
</script>

<style scoped>
.info-box.success {
  color: #2e7d32;
  background: #e8f5e9;
  border-left-color: #2e7d32;
}

.info-box.error {
  color: #d32f2f;
  background: #ffebee;
  border-left-color: #d32f2f;
}
</style>
