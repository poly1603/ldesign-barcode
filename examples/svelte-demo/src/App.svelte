<script lang="ts">
  import { Barcode, BarcodeScanner } from '@ldesign/barcode-svelte';
  import type { BarcodeFormat, ScanResult } from '@ldesign/barcode-core';

  let content = '1234567890128';
  let format: BarcodeFormat = 'ean13';
  let width = 300;
  let height = 100;
  let scanResults: ScanResult[] = [];

  function handleScan(event: CustomEvent<ScanResult[]>) {
    scanResults = event.detail;
  }
</script>

<div class="container">
  <h1>🎨 @ldesign/barcode</h1>
  <p class="subtitle">强大的条形码生成与扫描库 - Svelte 演示</p>

  <div class="demo-section">
    <h2>📦 条形码生成</h2>
    <div class="controls">
      <div class="control-group">
        <label for="content">条形码内容:</label>
        <input id="content" type="text" bind:value={content} />
      </div>
      <div class="control-group">
        <label for="format">格式:</label>
        <select id="format" bind:value={format}>
          <option value="ean13">EAN-13</option>
          <option value="ean8">EAN-8</option>
          <option value="code128">Code128</option>
        </select>
      </div>
      <div class="control-group">
        <label for="width">宽度:</label>
        <input id="width" type="number" bind:value={width} min="100" max="800" />
      </div>
      <div class="control-group">
        <label for="height">高度:</label>
        <input id="height" type="number" bind:value={height} min="50" max="300" />
      </div>
    </div>
    <div class="barcode-container">
      <Barcode value={content} {format} {width} {height} displayValue fontSize={20} margin={10} />
    </div>
    <div class="info-box">
      <strong>提示：</strong> Svelte 响应式系统，修改参数自动更新
    </div>
  </div>

  <div class="demo-section">
    <h2>📷 条形码扫描</h2>
    <BarcodeScanner on:scan={handleScan} on:error={(e) => alert(e.detail.message)}>
      <div class="button-group">
        <button>📸 选择图片扫描</button>
      </div>
    </BarcodeScanner>
    {#if scanResults.length > 0}
      <div class="scanner-result">
        <h3>扫描结果 ({scanResults.length}张图片)</h3>
        {#each scanResults as result, i}
          <div class="result-item">
            <strong>📄 图片 {i + 1}</strong><br />
            {#if result.success && result.data}
              <span style="color: green;">✅ 成功</span><br />
              内容: <code>{result.data.text}</code><br />
              格式: {result.data.format || '未知'}
            {:else}
              <span style="color: red;">❌ 失败: {result.error || '未识别到条形码'}</span>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
