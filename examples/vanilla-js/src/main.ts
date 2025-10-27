import { createBarcode, scanBarcode, BarcodeFormat } from '@ldesign/barcode-core';
import type { BarcodeInstance } from '@ldesign/barcode-core';
import './style.css';

let barcodeInstance: BarcodeInstance | null = null;

// Generate barcode
const generateBtn = document.getElementById('generateBtn') as HTMLButtonElement;
const barcodeInput = document.getElementById('barcodeInput') as HTMLInputElement;
const formatSelect = document.getElementById('formatSelect') as HTMLSelectElement;
const barcodeContainer = document.getElementById('barcodeContainer') as HTMLDivElement;

generateBtn?.addEventListener('click', () => {
  const content = barcodeInput.value;
  const format = BarcodeFormat[formatSelect.value as keyof typeof BarcodeFormat];

  if (!content) {
    alert('请输入条码内容');
    return;
  }

  // Destroy old instance
  if (barcodeInstance) {
    barcodeInstance.destroy();
  }

  // Clear container
  barcodeContainer.innerHTML = '';

  try {
    // Create new barcode
    barcodeInstance = createBarcode({
      content,
      format,
      width: 400,
      height: 150,
      container: barcodeContainer,
      renderType: 'canvas',
    });
  } catch (error) {
    alert(`生成失败: ${(error as Error).message}`);
  }
});

// Download barcode
const downloadBtn = document.getElementById('downloadBtn') as HTMLButtonElement;
downloadBtn?.addEventListener('click', () => {
  if (barcodeInstance) {
    barcodeInstance.download('barcode.png');
  } else {
    alert('请先生成条码');
  }
});

// Scan barcode
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const scanResult = document.getElementById('scanResult') as HTMLDivElement;

fileInput?.addEventListener('change', async (e) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  scanResult.innerHTML = '<p>扫描中...</p>';

  try {
    const results = await scanBarcode(file, {
      preprocess: true,
      maxAttempts: 3,
    });

    if (results.length > 0) {
      scanResult.innerHTML = results.map(r => `
        <div class="scan-result-item">
          <strong>${r.format}:</strong> ${r.data}
          <br>
          <small>置信度: ${(r.confidence * 100).toFixed(2)}%</small>
        </div>
      `).join('');
    } else {
      scanResult.innerHTML = '<p>未识别到条码</p>';
    }
  } catch (error) {
    scanResult.innerHTML = `<p class="error">扫描失败: ${(error as Error).message}</p>`;
  }
});

// Initial generation
if (barcodeInput && formatSelect && barcodeContainer) {
  generateBtn.click();
}

