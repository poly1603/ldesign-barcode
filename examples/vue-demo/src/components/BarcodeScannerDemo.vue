<template>
  <div class="demo-section">
    <h2>📷 条形码扫描</h2>

    <BarcodeScanner
      :multiple="multiple"
      @scan="handleScan"
      @error="handleError"
    >
      <template #trigger>
        <div class="button-group">
          <button @click="multiple = false">📸 选择图片扫描</button>
          <button @click="multiple = true">📚 批量扫描</button>
        </div>
      </template>
    </BarcodeScanner>

    <div v-if="scanning" class="scanner-result">
      <p>🔍 正在扫描...</p>
    </div>

    <div v-else-if="results.length > 0" class="scanner-result">
      <h3>扫描结果 ({{ results.length }}张图片)</h3>
      <div v-for="(item, index) in results" :key="index" class="result-item">
        <strong>📄 {{ item.fileName }}</strong><br>
        <template v-if="item.result.success && item.result.data">
          <span style="color: green;">✅ 成功</span><br>
          内容: <code>{{ item.result.data.text }}</code><br>
          格式: {{ item.result.data.format || '未知' }}<br>
          置信度: {{ item.result.data.quality ? (item.result.data.quality * 100).toFixed(1) + '%' : '未知' }}
        </template>
        <template v-else>
          <span style="color: red;">❌ 失败: {{ item.result.error || '未识别到条形码' }}</span>
        </template>
      </div>
    </div>

    <div class="info-box">
      <strong>支持格式：</strong> JPG, PNG, GIF, BMP 等图片格式 |
      <strong>支持批量：</strong> 可同时选择多张图片
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BarcodeScanner } from '@ldesign/barcode-vue';
import type { ScanResult } from '@ldesign/barcode-core';

interface ScanResultItem {
  fileName: string;
  result: ScanResult;
}

const multiple = ref(false);
const scanning = ref(false);
const results = ref<ScanResultItem[]>([]);

function handleScan(scanResults: ScanResult[]) {
  scanning.value = false;
  
  // 获取文件名（这里简化处理，实际应从事件中获取）
  results.value = scanResults.map((result, index) => ({
    fileName: `image-${index + 1}`,
    result
  }));
}

function handleError(error: Error) {
  scanning.value = false;
  alert(`扫描失败: ${error.message}`);
}
</script>
