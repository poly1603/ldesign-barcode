---
layout: home

hero:
  name: "@ldesign/barcode"
  text: "多框架条形码库"
  tagline: 强大、高性能、易用的条形码生成与扫描解决方案
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 查看 GitHub
      link: https://github.com/ldesign/barcode
  image:
    src: /logo.svg
    alt: @ldesign/barcode

features:
  - icon: 🎯
    title: 多框架支持
    details: 支持 Vue、React、Angular、Svelte、Solid、Qwik、Preact 等主流框架
  
  - icon: ⚡
    title: 高性能
    details: 优化的渲染引擎，支持 Canvas 和 SVG，内存使用优化
  
  - icon: 📦
    title: 多种格式
    details: 支持 EAN-13、EAN-8、UPC-A、Code128、Code39 等多种条形码格式
  
  - icon: 📷
    title: 扫描功能
    details: 内置条形码扫描功能，支持图片识别和批量处理
  
  - icon: 🎨
    title: 高度可定制
    details: 丰富的配置选项，支持自定义颜色、尺寸、字体等
  
  - icon: 📱
    title: 响应式
    details: 完美适配各种设备和屏幕尺寸
  
  - icon: 🔧
    title: TypeScript
    details: 完整的 TypeScript 类型定义，提供更好的开发体验
  
  - icon: 📚
    title: 完善文档
    details: 详细的文档和丰富的示例，快速上手
  
  - icon: 🧪
    title: 全面测试
    details: 单元测试、集成测试、性能测试覆盖
---

## 快速安装

::: code-group

```bash [pnpm]
# 核心包
pnpm add @ldesign/barcode-core

# Vue
pnpm add @ldesign/barcode-vue

# React
pnpm add @ldesign/barcode-react
```

```bash [npm]
# 核心包
npm install @ldesign/barcode-core

# Vue
npm install @ldesign/barcode-vue

# React
npm install @ldesign/barcode-react
```

```bash [yarn]
# 核心包
yarn add @ldesign/barcode-core

# Vue
yarn add @ldesign/barcode-vue

# React
yarn add @ldesign/barcode-react
```

:::

## 快速使用

::: code-group

```vue [Vue]
<template>
  <Barcode value="1234567890128" format="ean13" />
</template>

<script setup>
import { Barcode } from '@ldesign/barcode-vue';
</script>
```

```tsx [React]
import { Barcode } from '@ldesign/barcode-react';

function App() {
  return <Barcode value="1234567890128" format="ean13" />;
}
```

```typescript [Core]
import { BarcodeGenerator } from '@ldesign/barcode-core';

const generator = new BarcodeGenerator();
const result = await generator.generate('1234567890128', {
  format: 'ean13'
});

document.body.appendChild(result.element!);
```

:::

## 为什么选择 @ldesign/barcode?

- **🚀 开箱即用** - 简单的 API 设计，几行代码即可集成
- **💪 生产就绪** - 经过充分测试，性能优化，适合生产环境
- **🌍 框架无关** - 核心包框架无关，可在任何环境使用
- **📦 按需加载** - 模块化设计，按需引入，减小打包体积
- **🔄 持续更新** - 活跃维护，定期更新，持续改进

## 许可证

[MIT](https://opensource.org/licenses/MIT)

Copyright © 2025 ldesign
