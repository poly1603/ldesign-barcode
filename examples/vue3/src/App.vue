<template>
  <div id="app">
    <h1>@ldesign/barcode - Vue 3 示例</h1>
    
    <div class="demo-section">
      <h2>1. 使用 Barcode 组件</h2>
      <div class="controls">
        <input v-model="barcodeContent" type="text" placeholder="输入条码内容" />
        <select v-model="selectedFormat">
          <option value="EAN13">EAN-13</option>
          <option value="EAN8">EAN-8</option>
          <option value="CODE128">Code 128</option>
          <option value="CODE39">Code 39</option>
          <option value="UPCA">UPC-A</option>
        </select>
        <button @click="handleDownload">下载</button>
      </div>
      <Barcode
        :content="barcodeContent"
        :format="BarcodeFormat[selectedFormat]"
        :width="400"
        :height="150"
        @generated="onGenerated"
      />
    </div>
    
    <div class="demo-section">
      <h2>2. 使用 useBarcode Composable</h2>
      <div ref="container" class="barcode-container"></div>
      <button @click="generateComposable">使用 Composable 生成</button>
    </div>
    
    <div class="demo-section">
      <h2>3. 扫描条码</h2>
      <BarcodeScanner
        :formats="[BarcodeFormat.EAN13, BarcodeFormat.CODE128]"
        @scan="onScan"
      />
      <div v-if="scanResults.length" class="scan-results">
        <h3>扫描结果：</h3>
        <div v-for="(result, index) in scanResults" :key="index" class="scan-result-item">
          <strong>{{ result.format }}:</strong> {{ result.data }}
          <br>
          <small>置信度: {{ (result.confidence * 100).toFixed(2) }}%</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Barcode, BarcodeScanner, useBarcode } from '@ldesign/barcode-vue';
import { BarcodeFormat } from '@ldesign/barcode-core';
import type { ScanResult } from '@ldesign/barcode-core';
import './style.css';

// Component state
const barcodeContent = ref('1234567890128');
const selectedFormat = ref('EAN13');
const scanResults = ref<ScanResult[]>([]);

// Composable demo
const container = ref<HTMLElement | null>(null);
const composableConfig = computed(() => ({
  content: '9876543210',
  format: BarcodeFormat.CODE128,
  width: 300,
  height: 100,
  container: container.value || undefined,
}));

const { generate, download: composableDownload } = useBarcode(composableConfig);

const generateComposable = async () => {
  if (container.value) {
    await generate();
  }
};

// Event handlers
const onGenerated = () => {
  console.log('Barcode generated!');
};

const handleDownload = () => {
  // This would need access to the component's instance
  console.log('Download triggered');
};

const onScan = (results: ScanResult[]) => {
  scanResults.value = results;
  console.log('Scanned:', results);
};
</script>

