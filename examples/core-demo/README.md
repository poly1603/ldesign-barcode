# @ldesign/barcode Core Demo

这是 `@ldesign/barcode-core` 的核心功能演示项目，展示了如何在原生 JavaScript/TypeScript 环境中使用条形码生成和扫描功能。

## 功能展示

### 1. 条形码生成
- ✅ 支持多种条形码格式（EAN-13、EAN-8、UPC-A、UPC-E、Code128等）
- ✅ Canvas 和 SVG 两种渲染方式
- ✅ 自定义尺寸、颜色、字体等样式
- ✅ 实时预览生成效果
- ✅ 导出为 PNG、SVG 或 Data URL

### 2. 条形码扫描
- ✅ 单张图片扫描
- ✅ 批量图片扫描
- ✅ 支持多种图片格式
- ✅ 显示扫描结果和置信度

### 3. 格式验证
- ✅ 验证条形码内容是否符合特定格式
- ✅ 自动检测可能的条形码格式

## 快速开始

### 1. 安装依赖

```bash
# 在项目根目录
pnpm install
```

### 2. 启动开发服务器

```bash
# 在当前目录或项目根目录
pnpm dev

# 或直接运行
npm run dev
```

开发服务器将自动在浏览器中打开 `http://localhost:3000`

### 3. 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

## 项目结构

```
core-demo/
├── src/
│   └── main.ts          # 主入口文件，包含所有演示逻辑
├── index.html           # HTML 模板，包含 UI 界面
├── package.json         # 项目配置
├── tsconfig.json        # TypeScript 配置
├── vite.config.ts       # Vite 构建配置
└── README.md            # 项目文档
```

## 技术栈

- **构建工具**: Vite
- **语言**: TypeScript
- **核心库**: @ldesign/barcode-core

## 使用示例

### 基础生成

```typescript
import { BarcodeGenerator } from '@ldesign/barcode-core';

const generator = new BarcodeGenerator();
const result = await generator.generate('1234567890128', {
  format: 'ean13',
  renderType: 'canvas',
  width: 300,
  height: 100
});

if (result.success && result.element) {
  document.body.appendChild(result.element);
}
```

### 图片扫描

```typescript
import { BarcodeScanner } from '@ldesign/barcode-core';

const scanner = new BarcodeScanner();
const file = document.querySelector('input[type="file"]').files[0];
const result = await scanner.scan(file);

if (result.success && result.data) {
  console.log('扫描结果:', result.data.text);
  console.log('格式:', result.data.format);
}
```

### 格式验证

```typescript
import { validateBarcode, detectBarcodeFormat } from '@ldesign/barcode-core';

// 验证特定格式
const isValid = validateBarcode('1234567890128', 'ean13');

// 自动检测格式
const formats = detectBarcodeFormat('1234567890128');
console.log('可能的格式:', formats); // ['ean13', 'upca']
```

## 常见问题

### 1. 生成失败

- 检查条形码内容是否符合所选格式的规范
- 确保尺寸参数合理（宽度 >= 100，高度 >= 50）

### 2. 扫描不成功

- 确保图片清晰，条形码完整可见
- 尝试调整图片亮度和对比度
- 部分复杂背景可能影响识别率

### 3. 性能问题

- 批量扫描时建议限制并发数量
- Canvas 渲染通常比 SVG 更快
- 可以使用 Web Worker 进行后台处理

## 相关链接

- [核心包文档](../../packages/core/README.md)
- [API 文档](../../docs/API.md)
- [项目主页](../../README.md)

## License

MIT © ldesign
