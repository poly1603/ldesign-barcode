import { render } from 'solid-js/web';
import { createSignal } from 'solid-js';
import { Barcode } from '@ldesign/barcode-solid';
import type { BarcodeFormat } from '@ldesign/barcode-core';
import './style.css';

function App() {
  const [content, setContent] = createSignal('1234567890128');
  const [format, setFormat] = createSignal<BarcodeFormat>('ean13');
  const [width, setWidth] = createSignal(300);
  const [height, setHeight] = createSignal(100);

  return (
    <div class="container">
      <h1>🎨 @ldesign/barcode</h1>
      <p class="subtitle">强大的条形码生成与扫描库 - Solid.js 演示</p>
      
      <div class="demo-section">
        <h2>📦 条形码生成</h2>
        <div class="controls">
          <div class="control-group">
            <label>内容:</label>
            <input type="text" value={content()} onInput={(e) => setContent(e.currentTarget.value)} />
          </div>
          <div class="control-group">
            <label>格式:</label>
            <select value={format()} onChange={(e) => setFormat(e.currentTarget.value as BarcodeFormat)}>
              <option value="ean13">EAN-13</option>
              <option value="code128">Code128</option>
            </select>
          </div>
          <div class="control-group">
            <label>宽度:</label>
            <input type="number" value={width()} onInput={(e) => setWidth(Number(e.currentTarget.value))} />
          </div>
          <div class="control-group">
            <label>高度:</label>
            <input type="number" value={height()} onInput={(e) => setHeight(Number(e.currentTarget.value))} />
          </div>
        </div>
        <div class="barcode-container">
          <Barcode value={content()} format={format()} width={width()} height={height()} displayValue fontSize={20} margin={10} />
        </div>
        <div class="info-box">
          <strong>提示：</strong> Solid.js 细粒度响应式，性能卓越
        </div>
      </div>
    </div>
  );
}

render(() => <App />, document.getElementById('root')!);
