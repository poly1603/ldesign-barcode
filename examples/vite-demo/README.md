# @ldesign/barcode - Vite Demo

> 完整的功能演示项目，展示 @ldesign/barcode 的所有功能

## 🚀 快速启动

```bash
# 1. 进入示例目录
cd libraries/barcode/examples/vite-demo

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 在浏览器中打开 http://localhost:3000
```

## ✨ 功能展示

### 📊 条码生成
- **7种格式**: EAN-13/8, UPC-A/E, Code128, Code39, Code93, ITF-14, Codabar
- **双渲染引擎**: SVG（矢量）和 Canvas（光栅）
- **即时下载**: PNG/SVG 格式导出
- **实时预览**: 所有格式的生成示例

### 📷 条码扫描
- **图片上传**: 支持多种图片格式
- **智能识别**: 自动预处理和多格式识别
- **批量扫描**: 一次上传多个图片
- **结果展示**: 格式、数据、置信度

### ⚙️ 自定义生成
- **实时配置**: 动态调整所有参数
- **颜色自定义**: 前景色和背景色
- **尺寸控制**: 宽度、高度、边距、字体
- **渲染切换**: Canvas/SVG 切换
- **数据导出**: Data URL 复制

## 📦 项目结构

```
vite-demo/
├── index.html          # HTML 入口
├── package.json        # 依赖配置
├── vite.config.js      # Vite 配置
└── src/
    ├── main.js         # 应用入口
    ├── style.css       # 全局样式
    └── App.vue         # 主组件
```

## 🎯 主要功能演示

### 1. 生成条码示例

```vue
<template>
  <Barcode
    content="6901234567892"
    :format="BarcodeFormat.EAN13"
    :width="300"
    :height="100"
  />
</template>

<script setup>
import { Barcode, BarcodeFormat } from '@ldesign/barcode/vue';
</script>
```

### 2. 扫描条码示例

```vue
<template>
  <BarcodeScanner
    :formats="[BarcodeFormat.EAN13, BarcodeFormat.CODE128]"
    @scan="handleScan"
  />
</template>

<script setup>
import { BarcodeScanner, BarcodeFormat } from '@ldesign/barcode/vue';

const handleScan = (results) => {
  console.log('扫描结果:', results);
};
</script>
```

### 3. 自定义生成

```javascript
import { createBarcode, BarcodeFormat } from '@ldesign/barcode';

const barcode = createBarcode({
  content: 'CUSTOM-123',
  format: BarcodeFormat.CODE128,
  width: 400,
  height: 150,
  background: '#f0f0f0',
  foreground: '#ff0000',
  displayValue: true,
});

// 下载
barcode.download('custom.png');

// 获取 Data URL
const dataURL = barcode.toDataURL();
```

## 🎨 UI 特性

- **渐变背景**: 现代化的紫色渐变
- **响应式布局**: 自适应各种屏幕尺寸
- **流畅动画**: 平滑的过渡效果
- **交互反馈**: 悬停、点击效果
- **统计仪表盘**: 实时显示生成和扫描数量

## 🛠️ 技术栈

- **Vue 3**: 组合式 API
- **Vite**: 极速开发服务器
- **@ldesign/barcode**: 条码生成与扫描
- **纯 CSS**: 无第三方 UI 框架

## 📝 使用说明

### 生成条码
1. 切换到"生成条码"标签页
2. 查看 6 种格式的预设示例
3. 点击"下载 PNG"或"下载 SVG"导出

### 扫描条码
1. 切换到"扫描条码"标签页
2. 点击上传区域选择图片
3. 等待扫描结果显示
4. 查看格式、数据和置信度

### 自定义生成
1. 切换到"自定义生成"标签页
2. 输入条码内容
3. 选择格式（9种可选）
4. 调整尺寸、颜色、边距等
5. 实时预览更新
6. 下载或复制 Data URL

## 🔧 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 💡 提示

- **图片质量**: 扫描时使用高质量图片效果更好
- **格式选择**: EAN/UPC 用于商品，Code128 用于通用数据
- **颜色对比**: 保持前景和背景高对比度
- **尺寸控制**: 宽度建议 200-600px，高度建议 60-200px

## 🎓 学习资源

- [完整 API 文档](../../README.md)
- [格式说明](../../README.md#支持的格式)
- [高级用法](../../README.md#高级用法)

## 📄 许可证

MIT © LDesign Team

