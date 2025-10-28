# Core API

核心包提供框架无关的条形码生成和扫描功能。

## BarcodeGenerator

条形码生成器类。

### 构造函数

```typescript
const generator = new BarcodeGenerator();
```

### 方法

#### `generate(value, options)`

生成条形码元素。

**参数:**
- `value: string` - 条形码内容
- `options: GenerateOptions` - 生成选项

**返回:** `Promise<GenerateResult>`

**示例:**

```typescript
const result = await generator.generate('1234567890128', {
  format: 'ean13',
  width: 300,
  height: 100
});

if (result.success) {
  document.body.appendChild(result.element);
}
```

#### `getDataURL(value, options)`

获取条形码的 Data URL。

**参数:**
- `value: string` - 条形码内容
- `options: GenerateOptions` - 生成选项

**返回:** `Promise<string>`

**示例:**

```typescript
const dataUrl = await generator.getDataURL('1234567890128', {
  format: 'ean13'
});
console.log(dataUrl); // data:image/png;base64,...
```

#### `downloadPNG(value, options, filename)`

下载条形码为 PNG 图片。

**参数:**
- `value: string` - 条形码内容
- `options: GenerateOptions` - 生成选项
- `filename: string` - 文件名 (默认: 'barcode.png')

**返回:** `Promise<void>`

**示例:**

```typescript
await generator.downloadPNG('1234567890128', {
  format: 'ean13'
}, 'my-barcode.png');
```

#### `downloadSVG(value, options, filename)`

下载条形码为 SVG 图片。

**参数:**
- `value: string` - 条形码内容
- `options: GenerateOptions` - 生成选项（必须设置 `renderType: 'svg'`）
- `filename: string` - 文件名 (默认: 'barcode.svg')

**返回:** `Promise<void>`

**示例:**

```typescript
await generator.downloadSVG('1234567890128', {
  format: 'ean13',
  renderType: 'svg'
}, 'my-barcode.svg');
```

## BarcodeScanner

条形码扫描器类。

### 构造函数

```typescript
const scanner = new BarcodeScanner(options?: ScanOptions);
```

### 方法

#### `scan(source)`

扫描图片中的条形码。

**参数:**
- `source: File | Blob | string` - 图片源（文件、Blob 或 URL）

**返回:** `Promise<ScanResult>`

**示例:**

```typescript
const scanner = new BarcodeScanner();
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const result = await scanner.scan(file);
if (result.success) {
  console.log('条形码:', result.data.text);
  console.log('格式:', result.data.format);
}
```

#### `scanMultiple(sources)`

批量扫描多个图片。

**参数:**
- `sources: Array<File | Blob | string>` - 图片源数组

**返回:** `Promise<ScanResult[]>`

**示例:**

```typescript
const files = Array.from(fileInput.files);
const results = await scanner.scanMultiple(files);
results.forEach((result, index) => {
  if (result.success) {
    console.log(`图片 ${index + 1}:`, result.data.text);
  }
});
```

## 工具函数

### `validateBarcode(value, format)`

验证条形码内容是否符合指定格式。

**参数:**
- `value: string` - 条形码内容
- `format: BarcodeFormat` - 条形码格式

**返回:** `boolean`

**示例:**

```typescript
import { validateBarcode } from '@ldesign/barcode-core';

const isValid = validateBarcode('1234567890128', 'ean13'); // true
const isInvalid = validateBarcode('invalid', 'ean13'); // false
```

### `detectBarcodeFormat(value)`

自动检测条形码内容可能的格式。

**参数:**
- `value: string` - 条形码内容

**返回:** `BarcodeFormat[]`

**示例:**

```typescript
import { detectBarcodeFormat } from '@ldesign/barcode-core';

const formats = detectBarcodeFormat('1234567890128');
console.log(formats); // ['ean13', 'upca']
```

## 类型定义

### `BarcodeFormat`

```typescript
type BarcodeFormat = 
  | 'ean13'
  | 'ean8'
  | 'upca'
  | 'upce'
  | 'code128'
  | 'code39'
  | 'code93'
  | 'itf14'
  | 'codabar';
```

### `GenerateOptions`

```typescript
interface GenerateOptions {
  format: BarcodeFormat;
  width?: number;
  height?: number;
  displayValue?: boolean;
  fontSize?: number;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  textPosition?: 'top' | 'bottom';
  margin?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  background?: string;
  lineColor?: string;
  renderType?: 'canvas' | 'svg';
}
```

### `GenerateResult`

```typescript
interface GenerateResult {
  success: boolean;
  element?: HTMLCanvasElement | SVGElement;
  dataUrl?: string;
  error?: string;
}
```

### `ScanResult`

```typescript
interface ScanResult {
  success: boolean;
  data?: {
    text: string;
    format: BarcodeFormat;
    quality?: number;
    boundingBox?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
  error?: string;
}
```

### `ScanOptions`

```typescript
interface ScanOptions {
  formats?: BarcodeFormat[];
  tryHarder?: boolean;
  multiple?: boolean;
}
```
