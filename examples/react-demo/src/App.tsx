import React, { useState } from 'react';
import { Barcode, BarcodeScanner, useBarcode } from '@ldesign/barcode-react';
import type { BarcodeFormat, ScanResult } from '@ldesign/barcode-core';

function App() {
  // Generator state
  const [content, setContent] = useState('1234567890128');
  const [format, setFormat] = useState<BarcodeFormat>('ean13');
  const [renderType, setRenderType] = useState<'canvas' | 'svg'>('canvas');
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(100);

  // Scanner state
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);

  // Validator state
  const [validateContent, setValidateContent] = useState('1234567890128');
  const [validationResult, setValidationResult] = useState<any>(null);

  const { downloadPNG, downloadSVG, getDataURL, validateBarcode: validate, detectBarcodeFormat } = useBarcode();

  const handleDownloadPNG = async () => {
    try {
      await downloadPNG(content, { format, width, height, displayValue: true, fontSize: 20, margin: 10 }, 'barcode.png');
      alert('✅ PNG图片已下载！');
    } catch (error) {
      alert(`❌ 下载失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleDownloadSVG = async () => {
    try {
      await downloadSVG(content, { format, renderType: 'svg', width, height, displayValue: true, fontSize: 20, margin: 10 }, 'barcode.svg');
      alert('✅ SVG图片已下载！');
    } catch (error) {
      alert(`❌ 下载失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleGetDataURL = async () => {
    try {
      const dataUrl = await getDataURL(content, { format, width, height, displayValue: true, fontSize: 20, margin: 10 });
      await navigator.clipboard.writeText(dataUrl);
      alert('✅ Data URL已复制到剪贴板！\n\n' + dataUrl.substring(0, 100) + '...');
    } catch (error) {
      alert(`❌ 获取失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleValidate = () => {
    const content = validateContent.trim();
    if (!content) {
      alert('请输入要验证的内容！');
      return;
    }

    const isValid = validate(content, format);
    setValidationResult(isValid
      ? { type: 'success', title: '✅ 验证通过', message: `内容 ${content} 是有效的 ${format.toUpperCase()} 格式` }
      : { type: 'error', title: '❌ 验证失败', message: `内容 ${content} 不是有效的 ${format.toUpperCase()} 格式` }
    );
  };

  const handleDetect = () => {
    const content = validateContent.trim();
    if (!content) {
      alert('请输入要检测的内容！');
      return;
    }

    const formats = detectBarcodeFormat(content);
    setValidationResult(formats.length > 0
      ? { type: 'success', title: '🔍 检测结果', message: `内容 ${content} 可能的格式：${formats.map(f => f.toUpperCase()).join(', ')}` }
      : { type: '', title: '⚠️ 未检测到格式', message: `内容 ${content} 不匹配任何已知的条形码格式` }
    );
  };

  return (
    <div className="container">
      <h1>🎨 @ldesign/barcode</h1>
      <p className="subtitle">强大的条形码生成与扫描库 - React 演示</p>

      {/* Generator Demo */}
      <div className="demo-section">
        <h2>📦 条形码生成</h2>
        <div className="controls">
          <div className="control-group">
            <label>条形码内容:</label>
            <input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <div className="control-group">
            <label>格式:</label>
            <select value={format} onChange={(e) => setFormat(e.target.value as BarcodeFormat)}>
              <option value="ean13">EAN-13</option>
              <option value="ean8">EAN-8</option>
              <option value="upca">UPC-A</option>
              <option value="code128">Code128</option>
            </select>
          </div>
          <div className="control-group">
            <label>渲染类型:</label>
            <select value={renderType} onChange={(e) => setRenderType(e.target.value as 'canvas' | 'svg')}>
              <option value="canvas">Canvas</option>
              <option value="svg">SVG</option>
            </select>
          </div>
          <div className="control-group">
            <label>宽度:</label>
            <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} min="100" max="800" />
          </div>
          <div className="control-group">
            <label>高度:</label>
            <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} min="50" max="300" />
          </div>
        </div>
        <div className="barcode-container">
          <Barcode value={content} format={format} renderType={renderType} width={width} height={height} displayValue fontSize={20} margin={10} />
        </div>
        <div className="button-group">
          <button onClick={handleDownloadPNG}>📥 下载 PNG</button>
          <button onClick={handleDownloadSVG}>📥 下载 SVG</button>
          <button onClick={handleGetDataURL}>🔗 获取 Data URL</button>
        </div>
        <div className="info-box">
          <strong>提示：</strong> 使用 React 组件方式，状态驱动渲染，修改任何参数自动更新
        </div>
      </div>

      {/* Scanner Demo */}
      <div className="demo-section">
        <h2>📷 条形码扫描</h2>
        <BarcodeScanner onScan={setScanResults} onError={(err) => alert(`扫描失败: ${err.message}`)}>
          <div className="button-group">
            <button>📸 选择图片扫描</button>
          </div>
        </BarcodeScanner>
        {scanResults.length > 0 && (
          <div className="scanner-result">
            <h3>扫描结果 ({scanResults.length}张图片)</h3>
            {scanResults.map((result, index) => (
              <div key={index} className="result-item">
                <strong>📄 图片 {index + 1}</strong><br />
                {result.success && result.data ? (
                  <>
                    <span style={{ color: 'green' }}>✅ 成功</span><br />
                    内容: <code>{result.data.text}</code><br />
                    格式: {result.data.format || '未知'}
                  </>
                ) : (
                  <span style={{ color: 'red' }}>❌ 失败: {result.error || '未识别到条形码'}</span>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="info-box">
          <strong>支持格式：</strong> JPG, PNG, GIF, BMP 等图片格式
        </div>
      </div>

      {/* Validator Demo */}
      <div className="demo-section">
        <h2>✅ 格式验证</h2>
        <div className="controls">
          <div className="control-group">
            <label>待验证内容:</label>
            <input type="text" value={validateContent} onChange={(e) => setValidateContent(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleValidate()} />
          </div>
        </div>
        <div className="button-group">
          <button onClick={handleValidate}>验证格式</button>
          <button onClick={handleDetect}>自动检测格式</button>
        </div>
        {validationResult && (
          <div className={`info-box ${validationResult.type}`}>
            <strong>{validationResult.title}</strong><br />
            {validationResult.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
