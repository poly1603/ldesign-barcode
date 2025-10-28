import { render } from 'preact';
import { useState } from 'preact/hooks';
import { Barcode } from '@ldesign/barcode-preact';
import type { BarcodeFormat } from '@ldesign/barcode-core';
import './style.css';

function App() {
  const [content, setContent] = useState('1234567890128');
  const [format, setFormat] = useState<BarcodeFormat>('ean13');

  return (
    <div class="container">
      <h1>🎨 @ldesign/barcode</h1>
      <p class="subtitle">强大的条形码生成与扫描库 - Preact 演示</p>
      <div class="demo-section">
        <h2>📦 条形码生成</h2>
        <div class="controls">
          <div class="control-group">
            <label>内容:</label>
            <input type="text" value={content} onInput={(e) => setContent(e.currentTarget.value)} />
          </div>
          <div class="control-group">
            <label>格式:</label>
            <select value={format} onChange={(e) => setFormat(e.currentTarget.value as BarcodeFormat)}>
              <option value="ean13">EAN-13</option>
              <option value="code128">Code128</option>
            </select>
          </div>
        </div>
        <div class="barcode-container">
          <Barcode value={content} format={format} width={300} height={100} displayValue fontSize={20} margin={10} />
        </div>
        <div class="info-box">
          <strong>提示：</strong> Preact 轻量级React替代方案，仅3KB
        </div>
      </div>
    </div>
  );
}

render(<App />, document.getElementById('app')!);
