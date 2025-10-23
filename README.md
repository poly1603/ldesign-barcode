# @ldesign/barcode

> 强大的条形码生成与扫描库 - 支持多种格式、SVG/Canvas 渲染、图像识别

[![NPM Version](https://img.shields.io/npm/v/@ldesign/barcode.svg)](https://www.npmjs.com/package/@ldesign/barcode)
[![License](https://img.shields.io/npm/l/@ldesign/barcode.svg)](https://github.com/ldesign/barcode/blob/main/LICENSE)

## ✨ 特性

### 🎨 条码生成
- **多种格式支持**: EAN-13/8, UPC-A/E, Code128, Code39, Code93, ITF-14, Codabar
- **双渲染引擎**: SVG（矢量）和 Canvas（光栅）
- **高度可定制**: 颜色、尺寸、文本显示、边距等
- **自动校验**: 自动计算和验证校验位
- **格式检测**: 智能识别数据格式

### 📷 条码扫描
- **图片扫描**: 支持上传图片识别条码
- **批量处理**: 一次扫描多个图片
- **智能预处理**: 自动增强、旋转、灰度化
- **高准确率**: 基于 Quagga2 引擎

### 🔧 框架集成
- **Vue 3 组件**: 开箱即用的 Vue 组件和组合式 API
- **React 组件**: 原生 React Hooks 支持
- **TypeScript**: 完整的类型定义

## 📦 安装

```bash
# npm
npm install @ldesign/barcode

# yarn
yarn add @ldesign/barcode

# pnpm
pnpm add @ldesign/barcode
```

## 🚀 快速开始

### 原生 JavaScript

```javascript
import { createBarcode, BarcodeFormat } from '@ldesign/barcode';

// 生成 EAN-13 条码
const barcode = createBarcode({
  content: '6901234567892',
  format: BarcodeFormat.EAN13,
  width: 300,
  height: 100,
  container: document.getElementById('barcode'),
});

// 下载条码
barcode.download('barcode.png');
```

### Vue 3

```vue
<template>
  <div>
    <!-- 条码生成 -->
    <Barcode
      content="6901234567892"
      :format="BarcodeFormat.EAN13"
      :width="300"
      :height="100"
      @generated="onGenerated"
    />
    
    <!-- 条码扫描 -->
    <BarcodeScanner
      :formats="[BarcodeFormat.EAN13, BarcodeFormat.CODE128]"
      @scan="onScan"
    />
  </div>
</template>

<script setup>
import { Barcode, BarcodeScanner, BarcodeFormat } from '@ldesign/barcode/vue';

const onGenerated = () => {
  console.log('Barcode generated!');
};

const onScan = (results) => {
  console.log('Scanned:', results);
};
</script>
```

### React

```tsx
import React from 'react';
import { Barcode, BarcodeScanner, BarcodeFormat } from '@ldesign/barcode/react';

function App() {
  const handleScan = (results) => {
    console.log('Scanned:', results);
  };
  
  return (
    <div>
      {/* 条码生成 */}
      <Barcode
        content="6901234567892"
        format={BarcodeFormat.EAN13}
        width={300}
        height={100}
      />
      
      {/* 条码扫描 */}
      <BarcodeScanner
        formats={[BarcodeFormat.EAN13, BarcodeFormat.CODE128]}
        onScan={handleScan}
      />
    </div>
  );
}
```

## 📖 API 文档

### BarcodeGenerator

#### `createBarcode(config: BarcodeConfig): BarcodeInstance`

创建条码实例。

**参数:**
- `content` (string): 条码内容
- `format` (BarcodeFormat): 条码格式（可选，自动检测）
- `width` (number): 宽度，默认 200
- `height` (number): 高度，默认 100
- `displayValue` (boolean): 显示文本，默认 true
- `background` (string): 背景色，默认 '#ffffff'
- `foreground` (string): 前景色，默认 '#000000'
- `renderType` ('svg' | 'canvas'): 渲染类型，默认 'canvas'
- `margin` (number): 边距，默认 10
- `fontSize` (number): 字体大小，默认 14

**返回值:** `BarcodeInstance`

**方法:**
- `update(config)`: 更新配置
- `toDataURL(format, quality)`: 获取 Data URL（Canvas）
- `toSVGString()`: 获取 SVG 字符串（SVG）
- `download(fileName, format)`: 下载条码
- `destroy()`: 销毁实例

### 支持的格式

| 格式 | 枚举值 | 描述 | 字符集 | 长度 |
|------|--------|------|--------|------|
| EAN-13 | `BarcodeFormat.EAN13` | 欧洲商品码 | 数字 | 12-13 位 |
| EAN-8 | `BarcodeFormat.EAN8` | 短版 EAN | 数字 | 7-8 位 |
| UPC-A | `BarcodeFormat.UPCA` | 美国商品码 | 数字 | 11-12 位 |
| UPC-E | `BarcodeFormat.UPCE` | 压缩 UPC | 数字 | 6-8 位 |
| Code128 | `BarcodeFormat.CODE128` | 高密度条码 | ASCII | 任意 |
| Code39 | `BarcodeFormat.CODE39` | 字母数字 | A-Z, 0-9, 符号 | 任意 |
| Code93 | `BarcodeFormat.CODE93` | 改进 Code39 | A-Z, 0-9, 符号 | 任意 |
| ITF-14 | `BarcodeFormat.ITF14` | 物流条码 | 数字 | 13-14 位 |
| Codabar | `BarcodeFormat.CODABAR` | 图书馆/医疗 | 0-9, 符号 | 任意 |

### ImageScanner

#### `scanBarcode(source, options): Promise<ScanResult[]>`

扫描条码。

**参数:**
- `source`: File | HTMLImageElement | ImageData
- `options` (可选):
  - `formats`: 指定扫描格式
  - `preprocess`: 启用预处理，默认 true
  - `maxAttempts`: 最大尝试次数，默认 3

**返回值:**
```typescript
interface ScanResult {
  format: BarcodeFormat | string;
  data: string;
  confidence: number; // 0-1
  metadata?: {
    angle?: number;
    position?: { x, y, width, height };
  };
}
```

## 🎯 使用示例

### 示例 1: 生成不同格式的条码

```javascript
import { createBarcode, BarcodeFormat } from '@ldesign/barcode';

// EAN-13（自动添加校验位）
createBarcode({
  content: '690123456789',
  format: BarcodeFormat.EAN13,
  container: document.getElementById('ean13'),
});

// Code128（自动优化编码）
createBarcode({
  content: 'ABC123456',
  format: BarcodeFormat.CODE128,
  container: document.getElementById('code128'),
});

// Code39（大写，带星号）
createBarcode({
  content: 'HELLO WORLD',
  format: BarcodeFormat.CODE39,
  container: document.getElementById('code39'),
});
```

### 示例 2: 自定义样式

```javascript
createBarcode({
  content: '123456789012',
  format: BarcodeFormat.UPCA,
  width: 400,
  height: 150,
  background: '#f0f0f0',
  foreground: '#ff0000',
  fontSize: 18,
  margin: 20,
  displayValue: true,
  container: document.getElementById('custom'),
});
```

### 示例 3: SVG 渲染与导出

```javascript
const barcode = createBarcode({
  content: '1234567890',
  renderType: 'svg',
  container: document.getElementById('svg'),
});

// 获取 SVG 字符串
const svgString = barcode.toSVGString();
console.log(svgString);

// 下载 SVG
barcode.download('barcode.svg', 'svg');
```

### 示例 4: 图片扫描

```javascript
import { scanBarcode } from '@ldesign/barcode';

// 扫描上传的图片
const fileInput = document.getElementById('file');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const results = await scanBarcode(file);
  
  results.forEach(result => {
    console.log(`${result.format}: ${result.data}`);
    console.log(`Confidence: ${result.confidence}`);
  });
});
```

### 示例 5: 批量扫描

```javascript
import { ImageScanner } from '@ldesign/barcode';

const scanner = new ImageScanner({
  formats: [BarcodeFormat.EAN13, BarcodeFormat.CODE128],
  preprocess: true,
});

const files = [...document.getElementById('files').files];
const results = await scanner.scanBatch(files);

results.forEach(({ fileName, results, error }) => {
  if (error) {
    console.error(`${fileName}: ${error.message}`);
  } else {
    console.log(`${fileName}:`, results);
  }
});
```

### 示例 6: Vue Composable

```vue
<script setup>
import { ref } from 'vue';
import { useBarcode, BarcodeFormat } from '@ldesign/barcode/vue';

const config = ref({
  content: '6901234567892',
  format: BarcodeFormat.EAN13,
  width: 300,
  height: 100,
});

const { container, error, download, toDataURL } = useBarcode(config);

const handleDownload = () => {
  download('my-barcode.png');
};

const getDataURL = () => {
  const url = toDataURL();
  console.log(url);
};
</script>

<template>
  <div>
    <div ref="container"></div>
    <button @click="handleDownload">Download</button>
    <button @click="getDataURL">Get URL</button>
  </div>
</template>
```

### 示例 7: React Hooks

```tsx
import { useBarcode, BarcodeFormat } from '@ldesign/barcode/react';

function MyBarcode() {
  const config = {
    content: '6901234567892',
    format: BarcodeFormat.EAN13,
    width: 300,
    height: 100,
  };
  
  const { containerRef, download, toDataURL } = useBarcode(config);
  
  return (
    <div>
      <div ref={containerRef} />
      <button onClick={() => download('barcode.png')}>Download</button>
    </div>
  );
}
```

## 🔗 集成 QR Code

本库专注于 1D 条码。如需二维码（QR Code）功能，请使用我们的姊妹库：

```bash
npm install @ldesign/qrcode
```

```javascript
import { createQRCode } from '@ldesign/qrcode';

createQRCode({
  content: 'https://example.com',
  container: document.getElementById('qrcode'),
});
```

## 🛠️ 高级用法

### 格式验证

```javascript
import { BarcodeValidator, BarcodeFormat } from '@ldesign/barcode';

// 验证数据
const isValid = BarcodeValidator.validate('6901234567892', BarcodeFormat.EAN13);

// 自动检测格式
const format = BarcodeValidator.detectFormat('6901234567892');
console.log(format); // BarcodeFormat.EAN13
```

### 自定义编码器

```javascript
import { FormatRegistry, Code39Encoder } from '@ldesign/barcode';

// 注册自定义编码器
const customEncoder = new Code39Encoder(true); // 启用校验位
FormatRegistry.register(BarcodeFormat.CODE39, customEncoder);
```

### 图像预处理

```javascript
import { ImagePreprocessor } from '@ldesign/barcode';

// 加载图片
const image = await ImagePreprocessor.loadFromFile(file);

// 转换为 ImageData
const imageData = ImagePreprocessor.imageToImageData(image);

// 预处理
const processed = ImagePreprocessor.preprocess(imageData);

// 增强对比度
const enhanced = ImagePreprocessor.enhanceContrast(processed, 1.5);

// 旋转
const rotated = ImagePreprocessor.rotate(enhanced, 90);
```

## 📊 性能优化

### 1. 使用 Canvas 渲染（更快）

```javascript
createBarcode({
  content: '123456',
  renderType: 'canvas', // 比 SVG 更快
});
```

### 2. 批量生成

```javascript
const configs = [
  { content: '123', format: BarcodeFormat.CODE128 },
  { content: '456', format: BarcodeFormat.CODE128 },
  { content: '789', format: BarcodeFormat.CODE128 },
];

const barcodes = configs.map(config => createBarcode(config));
```

### 3. 扫描优化

```javascript
const scanner = new ImageScanner({
  preprocess: true,      // 启用预处理
  maxAttempts: 2,        // 减少尝试次数
  formats: [             // 限制格式范围
    BarcodeFormat.EAN13,
    BarcodeFormat.CODE128,
  ],
});
```

## 🐛 故障排除

### 问题 1: 扫描失败

**解决方案:**
- 确保已安装 `@ericblade/quagga2`
- 图片质量要足够高
- 尝试启用预处理: `preprocess: true`
- 增加尝试次数: `maxAttempts: 5`

### 问题 2: 校验位错误

**解决方案:**
- EAN/UPC 会自动计算校验位
- 如果提供完整数据，系统会验证校验位
- 可以只提供 12 位（EAN-13）或 11 位（UPC-A）

### 问题 3: Vue/React 组件不显示

**解决方案:**
```bash
# 确保安装了对应的框架
npm install vue  # 或 react
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT © LDesign Team

## 🔗 相关项目

- [@ldesign/qrcode](https://github.com/ldesign/qrcode) - 二维码生成与扫描
- [@ldesign/chart](https://github.com/ldesign/chart) - 图表组件
- [@ldesign/editor](https://github.com/ldesign/editor) - 代码编辑器

## 📚 参考资源

本库参考了以下优秀项目：
- [jsbarcode](https://github.com/lindell/JsBarcode) - 条码生成
- [quagga](https://github.com/serratus/quagga) - 条码识别
- [zxing-js](https://github.com/zxing-js/library) - 多格式扫描
