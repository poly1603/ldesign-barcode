# 快速开始

本指南将帮助您快速开始使用 @ldesign/barcode。

## 安装

根据您使用的框架选择相应的包：

::: code-group

```bash [Vue]
pnpm add @ldesign/barcode-vue
```

```bash [React]
pnpm add @ldesign/barcode-react
```

```bash [Angular]
pnpm add @ldesign/barcode-angular
```

```bash [Svelte]
pnpm add @ldesign/barcode-svelte
```

```bash [Core]
pnpm add @ldesign/barcode-core
```

:::

## 基础使用

### Vue 3

```vue
<template>
  <div>
    <Barcode 
      value="1234567890128" 
      format="ean13"
      :width="300"
      :height="100"
    />
  </div>
</template>

<script setup lang="ts">
import { Barcode } from '@ldesign/barcode-vue';
</script>
```

### React

```tsx
import { Barcode } from '@ldesign/barcode-react';

function App() {
  return (
    <Barcode 
      value="1234567890128" 
      format="ean13"
      width={300}
      height={100}
    />
  );
}
```

### 原生 JavaScript/TypeScript

```typescript
import { BarcodeGenerator } from '@ldesign/barcode-core';

const generator = new BarcodeGenerator();

// 生成条形码
const result = await generator.generate('1234567890128', {
  format: 'ean13',
  width: 300,
  height: 100,
  displayValue: true
});

if (result.success && result.element) {
  document.getElementById('barcode-container')?.appendChild(result.element);
}
```

## 支持的格式

- **EAN-13** - 13位欧洲商品编码
- **EAN-8** - 8位欧洲商品编码
- **UPC-A** - 12位通用产品代码
- **UPC-E** - 8位压缩UPC代码
- **Code128** - 高密度一维条形码
- **Code39** - 字母数字条形码
- **Code93** - Code39的改进版
- **ITF-14** - 交叉25码
- **Codabar** - 线性条形码

## 基本配置

```typescript
{
  value: string;           // 条形码内容
  format: BarcodeFormat;   // 条形码格式
  width?: number;          // 宽度 (默认: 200)
  height?: number;         // 高度 (默认: 100)
  displayValue?: boolean;  // 显示文本 (默认: true)
  fontSize?: number;       // 字体大小 (默认: 20)
  margin?: number;         // 边距 (默认: 10)
  background?: string;     // 背景色 (默认: '#ffffff')
  lineColor?: string;      // 线条颜色 (默认: '#000000')
  renderType?: 'canvas' | 'svg';  // 渲染类型 (默认: 'canvas')
}
```

## 下一步

- [安装指南](/guide/installation) - 详细的安装说明
- [基础用法](/guide/usage) - 更多使用示例
- [API 参考](/api/core) - 完整的 API 文档
- [框架集成](/guide/frameworks/vue) - 特定框架的集成指南
