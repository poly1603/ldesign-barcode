import React, { useState } from 'react';
import { Barcode, BarcodeScanner, useBarcode } from '@ldesign/barcode-react';
import { BarcodeFormat } from '@ldesign/barcode-core';
import type { ScanResult } from '@ldesign/barcode-core';
import './style.css';

function App() {
  const [barcodeContent, setBarcodeContent] = useState('1234567890128');
  const [selectedFormat, setSelectedFormat] = useState<keyof typeof BarcodeFormat>('EAN13');
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);

  // useBarcode hook demo
  const { containerRef, download } = useBarcode({
    content: '9876543210',
    format: BarcodeFormat.CODE128,
    width: 300,
    height: 100,
  });

  const handleScan = (results: ScanResult[]) => {
    setScanResults(results);
    console.log('Scanned:', results);
  };

  return (
    <div id="app">
      <h1>@ldesign/barcode - React 示例</h1>

      <div className="demo-section">
        <h2>1. 使用 Barcode 组件</h2>
        <div className="controls">
          <input
            type="text"
            value={barcodeContent}
            onChange={(e) => setBarcodeContent(e.target.value)}
            placeholder="输入条码内容"
          />
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value as keyof typeof BarcodeFormat)}
          >
            <option value="EAN13">EAN-13</option>
            <option value="EAN8">EAN-8</option>
            <option value="CODE128">Code 128</option>
            <option value="CODE39">Code 39</option>
            <option value="UPCA">UPC-A</option>
          </select>
        </div>
        <Barcode
          content={barcodeContent}
          format={BarcodeFormat[selectedFormat]}
          width={400}
          height={150}
        />
      </div>

      <div className="demo-section">
        <h2>2. 使用 useBarcode Hook</h2>
        <div ref={containerRef} className="barcode-container"></div>
        <button onClick={() => download('barcode.png')}>下载</button>
      </div>

      <div className="demo-section">
        <h2>3. 扫描条码</h2>
        <BarcodeScanner
          formats={[BarcodeFormat.EAN13, BarcodeFormat.CODE128]}
          onScan={handleScan}
        />
        {scanResults.length > 0 && (
          <div className="scan-results">
            <h3>扫描结果：</h3>
            {scanResults.map((result, index) => (
              <div key={index} className="scan-result-item">
                <strong>{result.format}:</strong> {result.data}
                <br />
                <small>置信度: {(result.confidence * 100).toFixed(2)}%</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

