<template>
  <div class="demo-section">
    <h2>📦 条形码生成</h2>

    <div class="controls">
      <div class="control-group">
        <label for="content">条形码内容:</label>
        <input
          id="content"
          v-model="content"
          type="text"
          placeholder="输入条形码内容"
        >
      </div>

      <div class="control-group">
        <label for="format">格式:</label>
        <select id="format" v-model="format">
          <option value="ean13">EAN-13</option>
          <option value="ean8">EAN-8</option>
          <option value="upca">UPC-A</option>
          <option value="upce">UPC-E</option>
          <option value="code128">Code128</option>
          <option value="code39">Code39</option>
          <option value="code93">Code93</option>
          <option value="itf14">ITF-14</option>
          <option value="codabar">Codabar</option>
        </select>
      </div>

      <div class="control-group">
        <label for="renderType">渲染类型:</label>
        <select id="renderType" v-model="renderType">
          <option value="canvas">Canvas</option>
          <option value="svg">SVG</option>
        </select>
      </div>

      <div class="control-group">
        <label for="width">宽度:</label>
        <input
          id="width"
          v-model.number="width"
          type="number"
          min="100"
          max="800"
        >
      </div>

      <div class="control-group">
        <label for="height">高度:</label>
        <input
          id="height"
          v-model.number="height"
          type="number"
          min="50"
          max="300"
        >
      </div>
    </div>

    <div class="barcode-container">
      <Barcode
        :value="content"
        :format="format"
        :render-type="renderType"
        :width="width"
        :height="height"
        :display-value="true"
        :font-size="20"
        :margin="10"
      />
    </div>

    <div class="button-group">
      <button @click="downloadPNG">📥 下载 PNG</button>
      <button @click="downloadSVG">📥 下载 SVG</button>
      <button @click="getDataURL">🔗 获取 Data URL</button>
    </div>

    <div class="info-box">
      <strong>提示：</strong> 使用 Vue 组件方式，数据响应式更新，修改任何参数自动重新渲染
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Barcode, useBarcode } from '@ldesign/barcode-vue';
import type { BarcodeFormat } from '@ldesign/barcode-core';

const content = ref('1234567890128');
const format = ref<BarcodeFormat>('ean13');
const renderType = ref<'canvas' | 'svg'>('canvas');
const width = ref(300);
const height = ref(100);

const { downloadPNG: download, downloadSVG: downloadSvg, getDataURL: getData } = useBarcode();

async function downloadPNG() {
  try {
    await download(content.value, {
      format: format.value,
      width: width.value,
      height: height.value,
      displayValue: true,
      fontSize: 20,
      margin: 10
    }, 'barcode.png');
    alert('✅ PNG图片已下载！');
  } catch (error) {
    alert(`❌ 下载失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function downloadSVG() {
  try {
    await downloadSvg(content.value, {
      format: format.value,
      renderType: 'svg',
      width: width.value,
      height: height.value,
      displayValue: true,
      fontSize: 20,
      margin: 10
    }, 'barcode.svg');
    alert('✅ SVG图片已下载！');
  } catch (error) {
    alert(`❌ 下载失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function getDataURL() {
  try {
    const dataUrl = await getData(content.value, {
      format: format.value,
      width: width.value,
      height: height.value,
      displayValue: true,
      fontSize: 20,
      margin: 10
    });
    await navigator.clipboard.writeText(dataUrl);
    alert('✅ Data URL已复制到剪贴板！\n\n' + dataUrl.substring(0, 100) + '...');
  } catch (error) {
    alert(`❌ 获取失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}
</script>
