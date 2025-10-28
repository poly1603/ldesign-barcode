import {
  BarcodeGenerator,
  BarcodeScanner,
  validateBarcode,
  detectBarcodeFormat,
  type BarcodeFormat,
  type GenerateOptions
} from '@ldesign/barcode-core';

// 创建生成器实例
const generator = new BarcodeGenerator();

// 初始化生成演示
function initGenerator() {
  const contentInput = document.getElementById('content') as HTMLInputElement;
  const formatSelect = document.getElementById('format') as HTMLSelectElement;
  const renderTypeSelect = document.getElementById('renderType') as HTMLSelectElement;
  const widthInput = document.getElementById('width') as HTMLInputElement;
  const heightInput = document.getElementById('height') as HTMLInputElement;
  const barcodeContainer = document.getElementById('barcode') as HTMLElement;
  const generateBtn = document.getElementById('generate') as HTMLButtonElement;
  const downloadPngBtn = document.getElementById('download-png') as HTMLButtonElement;
  const downloadSvgBtn = document.getElementById('download-svg') as HTMLButtonElement;
  const getDataUrlBtn = document.getElementById('get-dataurl') as HTMLButtonElement;

  // 生成条形码
  async function generateBarcode() {
    try {
      barcodeContainer.innerHTML = '';
      
      const options: GenerateOptions = {
        format: formatSelect.value as BarcodeFormat,
        renderType: renderTypeSelect.value as 'canvas' | 'svg',
        width: parseInt(widthInput.value),
        height: parseInt(heightInput.value),
        displayValue: true,
        fontSize: 20,
        margin: 10
      };

      const result = await generator.generate(contentInput.value, options);
      
      if (result.success && result.element) {
        barcodeContainer.appendChild(result.element);
      } else {
        barcodeContainer.innerHTML = `<p style="color: red;">生成失败: ${result.error || '未知错误'}</p>`;
      }
    } catch (error) {
      barcodeContainer.innerHTML = `<p style="color: red;">生成失败: ${error instanceof Error ? error.message : String(error)}</p>`;
    }
  }

  // 下载PNG
  downloadPngBtn.addEventListener('click', async () => {
    try {
      const options: GenerateOptions = {
        format: formatSelect.value as BarcodeFormat,
        width: parseInt(widthInput.value),
        height: parseInt(heightInput.value),
        displayValue: true,
        fontSize: 20,
        margin: 10
      };

      await generator.downloadPNG(contentInput.value, options, 'barcode.png');
      alert('✅ PNG图片已下载！');
    } catch (error) {
      alert(`❌ 下载失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  // 下载SVG
  downloadSvgBtn.addEventListener('click', async () => {
    try {
      const options: GenerateOptions = {
        format: formatSelect.value as BarcodeFormat,
        renderType: 'svg',
        width: parseInt(widthInput.value),
        height: parseInt(heightInput.value),
        displayValue: true,
        fontSize: 20,
        margin: 10
      };

      await generator.downloadSVG(contentInput.value, options, 'barcode.svg');
      alert('✅ SVG图片已下载！');
    } catch (error) {
      alert(`❌ 下载失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  // 获取Data URL
  getDataUrlBtn.addEventListener('click', async () => {
    try {
      const options: GenerateOptions = {
        format: formatSelect.value as BarcodeFormat,
        width: parseInt(widthInput.value),
        height: parseInt(heightInput.value),
        displayValue: true,
        fontSize: 20,
        margin: 10
      };

      const dataUrl = await generator.getDataURL(contentInput.value, options);
      
      // 复制到剪贴板
      await navigator.clipboard.writeText(dataUrl);
      alert('✅ Data URL已复制到剪贴板！\n\n' + dataUrl.substring(0, 100) + '...');
    } catch (error) {
      alert(`❌ 获取失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  // 事件监听
  generateBtn.addEventListener('click', generateBarcode);
  
  // 回车键生成
  [contentInput, formatSelect, renderTypeSelect, widthInput, heightInput].forEach(el => {
    el.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        generateBarcode();
      }
    });
  });

  // 初始生成
  generateBarcode();
}

// 初始化扫描演示
function initScanner() {
  const scannerInput = document.getElementById('scannerInput') as HTMLInputElement;
  const scanButton = document.getElementById('scan-button') as HTMLButtonElement;
  const batchScanButton = document.getElementById('batch-scan') as HTMLButtonElement;
  const resultContainer = document.getElementById('scanner-result') as HTMLElement;

  // 扫描单张图片
  scanButton.addEventListener('click', () => {
    scannerInput.multiple = false;
    scannerInput.click();
  });

  // 批量扫描
  batchScanButton.addEventListener('click', () => {
    scannerInput.multiple = true;
    scannerInput.click();
  });

  // 处理文件选择
  scannerInput.addEventListener('change', async (e) => {
    const files = (e.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;

    resultContainer.innerHTML = '<p>🔍 正在扫描...</p>';

    try {
      const scanner = new BarcodeScanner();
      const results = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await scanner.scan(file);
        
        results.push({
          fileName: file.name,
          result
        });
      }

      // 显示结果
      if (results.length === 0) {
        resultContainer.innerHTML = '<p>❌ 未选择图片</p>';
        return;
      }

      let html = '<div class="scanner-result">';
      html += `<h3>扫描结果 (${results.length}张图片)</h3>`;
      
      results.forEach(({ fileName, result }) => {
        html += '<div class="result-item">';
        html += `<strong>📄 ${fileName}</strong><br>`;
        
        if (result.success && result.data) {
          html += `<span style="color: green;">✅ 成功</span><br>`;
          html += `内容: <code>${result.data.text}</code><br>`;
          html += `格式: ${result.data.format || '未知'}<br>`;
          html += `置信度: ${result.data.quality ? (result.data.quality * 100).toFixed(1) + '%' : '未知'}`;
        } else {
          html += `<span style="color: red;">❌ 失败: ${result.error || '未识别到条形码'}</span>`;
        }
        
        html += '</div>';
      });
      
      html += '</div>';
      resultContainer.innerHTML = html;
    } catch (error) {
      resultContainer.innerHTML = `<p style="color: red;">❌ 扫描失败: ${error instanceof Error ? error.message : String(error)}</p>`;
    }

    // 重置输入
    scannerInput.value = '';
  });
}

// 初始化验证演示
function initValidator() {
  const validateContentInput = document.getElementById('validate-content') as HTMLInputElement;
  const validateBtn = document.getElementById('validate') as HTMLButtonElement;
  const detectBtn = document.getElementById('detect') as HTMLButtonElement;
  const resultContainer = document.getElementById('validate-result') as HTMLElement;

  // 验证格式
  validateBtn.addEventListener('click', () => {
    const content = validateContentInput.value.trim();
    if (!content) {
      alert('请输入要验证的内容！');
      return;
    }

    const formatSelect = document.getElementById('format') as HTMLSelectElement;
    const format = formatSelect.value as BarcodeFormat;

    const isValid = validateBarcode(content, format);
    
    resultContainer.style.display = 'block';
    if (isValid) {
      resultContainer.style.borderColor = '#4caf50';
      resultContainer.style.background = '#e8f5e9';
      resultContainer.innerHTML = `
        <strong style="color: #2e7d32;">✅ 验证通过</strong><br>
        内容 <code>${content}</code> 是有效的 <strong>${format.toUpperCase()}</strong> 格式
      `;
    } else {
      resultContainer.style.borderColor = '#f44336';
      resultContainer.style.background = '#ffebee';
      resultContainer.innerHTML = `
        <strong style="color: #c62828;">❌ 验证失败</strong><br>
        内容 <code>${content}</code> 不是有效的 <strong>${format.toUpperCase()}</strong> 格式
      `;
    }
  });

  // 自动检测格式
  detectBtn.addEventListener('click', () => {
    const content = validateContentInput.value.trim();
    if (!content) {
      alert('请输入要检测的内容！');
      return;
    }

    const formats = detectBarcodeFormat(content);
    
    resultContainer.style.display = 'block';
    if (formats.length > 0) {
      resultContainer.style.borderColor = '#2196f3';
      resultContainer.style.background = '#e3f2fd';
      resultContainer.innerHTML = `
        <strong style="color: #1976d2;">🔍 检测结果</strong><br>
        内容 <code>${content}</code> 可能的格式：<br>
        <strong>${formats.map(f => f.toUpperCase()).join(', ')}</strong>
      `;
    } else {
      resultContainer.style.borderColor = '#ff9800';
      resultContainer.style.background = '#fff3e0';
      resultContainer.innerHTML = `
        <strong style="color: #f57c00;">⚠️ 未检测到格式</strong><br>
        内容 <code>${content}</code> 不匹配任何已知的条形码格式
      `;
    }
  });

  // 回车键触发验证
  validateContentInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      validateBtn.click();
    }
  });
}

// 初始化所有演示
document.addEventListener('DOMContentLoaded', () => {
  initGenerator();
  initScanner();
  initValidator();
});
