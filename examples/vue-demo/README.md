# @ldesign/barcode Vue Demo

这是 `@ldesign/barcode-vue` 的完整功能演示项目，展示了如何在 Vue 3 应用中使用条形码生成和扫描功能。

## 功能展示

### 1. 条形码生成组件
- ✅ `<Barcode>` 组件响应式渲染
- ✅ 支持多种条形码格式
- ✅ Canvas 和 SVG 两种渲染方式
- ✅ 实时参数调整和预览
- ✅ 导出功能（PNG、SVG、Data URL）

### 2. 条形码扫描组件
- ✅ `<BarcodeScanner>` 组件
- ✅ 单张和批量图片扫描
- ✅ 自定义触发器插槽
- ✅ 事件驱动的结果处理

### 3. Composables
- ✅ `useBarcode()` - 条形码生成和工具函数
- ✅ `useBarcodeScanner()` - 扫描功能
- ✅ 格式验证和自动检测

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

开发服务器将自动在浏览器中打开 `http://localhost:3001`

### 3. 构建生产版本

```bash
npm run build
```

## 项目结构

```
vue-demo/
├── src/
│   ├── components/
│   │   ├── BarcodeGeneratorDemo.vue   # 生成器演示
│   │   ├── BarcodeScannerDemo.vue     # 扫描器演示
│   │   └── BarcodeValidatorDemo.vue   # 验证器演示
│   ├── App.vue                         # 主应用组件
│   ├── main.ts                         # 应用入口
│   └── style.css                       # 全局样式
├── index.html                          # HTML 模板
├── package.json                        # 项目配置
├── tsconfig.json                       # TypeScript 配置
├── vite.config.ts                      # Vite 配置
└── README.md                           # 项目文档
```

## 使用示例

### 基础组件用法

```vue
<template>
  <Barcode
    value="1234567890128"
    format="ean13"
    :width="300"
    :height="100"
  />
</template>

<script setup>
import { Barcode } from '@ldesign/barcode-vue';
</script>
```

### 响应式生成

```vue
<template>
  <input v-model="content" placeholder="输入内容">
  <Barcode :value="content" format="code128" />
</template>

<script setup>
import { ref } from 'vue';
import { Barcode } from '@ldesign/barcode-vue';

const content = ref('Hello World');
</script>
```

### 使用 Composable

```vue
<script setup>
import { useBarcode } from '@ldesign/barcode-vue';

const { downloadPNG, validateBarcode, detectBarcodeFormat } = useBarcode();

async function download() {
  await downloadPNG('1234567890128', {
    format: 'ean13',
    width: 300,
    height: 100
  }, 'barcode.png');
}

const isValid = validateBarcode('1234567890128', 'ean13'); // true
const formats = detectBarcodeFormat('1234567890128'); // ['ean13', 'upca']
</script>
```

### 扫描器组件

```vue
<template>
  <BarcodeScanner
    :multiple="true"
    @scan="handleScan"
    @error="handleError"
  >
    <template #trigger>
      <button>选择图片扫描</button>
    </template>
  </BarcodeScanner>
</template>

<script setup>
import { BarcodeScanner } from '@ldesign/barcode-vue';

function handleScan(results) {
  console.log('扫描结果:', results);
}

function handleError(error) {
  console.error('扫描失败:', error);
}
</script>
```

## 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **语言**: TypeScript
- **核心库**: @ldesign/barcode-core, @ldesign/barcode-vue

## 相关链接

- [Vue包文档](../../packages/vue/README.md)
- [核心包文档](../../packages/core/README.md)
- [API 文档](../../docs/API.md)
- [项目主页](../../README.md)

## License

MIT © ldesign
