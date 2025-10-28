# 📖 条形码库使用示例

完整的跨框架使用示例指南。

## 📦 安装

```bash
# 核心包（必需）
pnpm add @ldesign/barcode-core

# Vue 3
pnpm add @ldesign/barcode-vue

# React
pnpm add @ldesign/barcode-react

# Angular
pnpm add @ldesign/barcode-angular

# Svelte
pnpm add @ldesign/barcode-svelte

# Solid.js
pnpm add @ldesign/barcode-solid

# Qwik
pnpm add @ldesign/barcode-qwik

# Preact
pnpm add @ldesign/barcode-preact
```

## 🚀 快速开始

### Vanilla JavaScript/TypeScript

```typescript
import { createBarcode, BarcodeFormat } from '@ldesign/barcode-core'

// 生成条形码
const barcode = createBarcode({
  content: '1234567890128',
  format: BarcodeFormat.EAN13,
  width: 300,
  height: 100,
  container: document.getElementById('barcode')
})

// 下载
barcode.download('barcode.png')

// 获取DataURL
const dataURL = barcode.toDataURL('png')

// 销毁
barcode.destroy()
```

### Vue 3 组合式API

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Barcode, BarcodeScanner, BarcodeFormat } from '@ldesign/barcode-vue'

const content = ref('1234567890128')
const format = ref(BarcodeFormat.EAN13)

function handleScan(results) {
  console.log('扫描结果:', results)
}
</script>

<template>
  <div>
    <!-- 条形码生成 -->
    <Barcode
      :content="content"
      :format="format"
      :width="300"
      :height="100"
    />

    <!-- 条形码扫描 -->
    <BarcodeScanner
      :formats="[BarcodeFormat.EAN13, BarcodeFormat.CODE128]"
      @scan="handleScan"
    />
  </div>
</template>
```

### Vue 3 Composable

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useBarcode, BarcodeFormat } from '@ldesign/barcode-vue'

const config = ref({
  content: '1234567890128',
  format: BarcodeFormat.EAN13,
  width: 300,
  height: 100
})

const { container, error, download, toDataURL } = useBarcode(config)

function handleDownload() {
  download('my-barcode.png')
}
</script>

<template>
  <div>
    <div ref="container" />
    <button @click="handleDownload">下载条形码</button>
    <div v-if="error">错误: {{ error }}</div>
  </div>
</template>
```

### React

```tsx
import { Barcode, BarcodeScanner, useBarcode, BarcodeFormat } from '@ldesign/barcode-react'

// 组件方式
function App() {
  const handleScan = (results) => {
    console.log('扫描结果:', results)
  }

  return (
    <div>
      <Barcode
        content="1234567890128"
        format={BarcodeFormat.EAN13}
        width={300}
        height={100}
      />

      <BarcodeScanner
        formats={[BarcodeFormat.EAN13, BarcodeFormat.CODE128]}
        onScan={handleScan}
      />
    </div>
  )
}

// Hook方式
function BarcodeWithHook() {
  const { containerRef, download, toDataURL, error } = useBarcode({
    content: '1234567890128',
    format: BarcodeFormat.EAN13,
    width: 300,
    height: 100
  })

  return (
    <div>
      <div ref={containerRef} />
      <button onClick={() => download('barcode.png')}>下载</button>
      {error && <div>错误: {error.message}</div>}
    </div>
  )
}
```

### Angular

```typescript
import { Component } from '@angular/core'
import { BarcodeComponent, BarcodeScannerComponent, BarcodeFormat } from '@ldesign/barcode-angular'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BarcodeComponent, BarcodeScannerComponent],
  template: `
    <div>
      <!-- 组件方式 -->
      <ldesign-barcode
        [content]="'1234567890128'"
        [format]="BarcodeFormat.EAN13"
        [width]="300"
        [height]="100"
      />

      <!-- 扫描器 -->
      <ldesign-barcode-scanner
        [formats]="[BarcodeFormat.EAN13, BarcodeFormat.CODE128]"
        (scan)="handleScan($event)"
      />
    </div>
  `
})
export class AppComponent {
  BarcodeFormat = BarcodeFormat

  handleScan(results: any) {
    console.log('扫描结果:', results)
  }
}
```

### Angular 指令

```typescript
import { Component } from '@angular/core'
import { BarcodeDirective, BarcodeFormat } from '@ldesign/barcode-angular'

@Component({
  selector: 'app-barcode',
  standalone: true,
  imports: [BarcodeDirective],
  template: `
    <div 
      ldesignBarcode
      [barcodeContent]="'1234567890128'"
      [barcodeFormat]="BarcodeFormat.EAN13"
      [barcodeWidth]="300"
      [barcodeHeight]="100"
    ></div>
  `
})
export class BarcodeDirectiveComponent {
  BarcodeFormat = BarcodeFormat
}
```

### Angular 服务

```typescript
import { Component, inject } from '@angular/core'
import { BarcodeService, BarcodeFormat } from '@ldesign/barcode-angular'

@Component({
  selector: 'app-root',
  template: `<div id="barcode"></div>`
})
export class AppComponent {
  private barcodeService = inject(BarcodeService)

  ngOnInit() {
    // 生成条形码
    const barcode = this.barcodeService.generate({
      content: '1234567890128',
      format: BarcodeFormat.EAN13,
      container: document.getElementById('barcode')
    })

    // 验证
    const isValid = this.barcodeService.validate('1234567890128', BarcodeFormat.EAN13)

    // 扫描
    this.barcodeService.scanImage(file).then(results => {
      console.log('扫描结果:', results)
    })
  }
}
```

### Svelte

```svelte
<script lang="ts">
  import { Barcode, BarcodeScanner, BarcodeFormat } from '@ldesign/barcode-svelte'
  
  let content = '1234567890128'
  let format = BarcodeFormat.EAN13
  let barcodeRef
  
  function handleScan(event) {
    console.log('扫描结果:', event.detail)
  }
  
  function handleDownload() {
    barcodeRef?.download('barcode.png')
  }
</script>

<div>
  <!-- 条形码 -->
  <Barcode
    bind:this={barcodeRef}
    {content}
    {format}
    width={300}
    height={100}
  />
  
  <button on:click={handleDownload}>下载</button>

  <!-- 扫描器 -->
  <BarcodeScanner
    formats={[BarcodeFormat.EAN13, BarcodeFormat.CODE128]}
    on:scan={handleScan}
  >
    <div slot="default" let:isScanning>
      {#if isScanning}
        <p>扫描中...</p>
      {/if}
    </div>
  </BarcodeScanner>
</div>
```

### Solid.js

```tsx
import { Barcode, BarcodeScanner, createBarcode, BarcodeFormat } from '@ldesign/barcode-solid'

function App() {
  const handleScan = (results) => {
    console.log('扫描结果:', results)
  }

  return (
    <div>
      <Barcode
        content="1234567890128"
        format={BarcodeFormat.EAN13}
        width={300}
        height={100}
      />

      <BarcodeScanner
        formats={[BarcodeFormat.EAN13, BarcodeFormat.CODE128]}
        onScan={handleScan}
      />
    </div>
  )
}

// 使用Primitive
function BarcodeWithPrimitive() {
  const { container, download, error } = createBarcode(() => ({
    content: '1234567890128',
    format: BarcodeFormat.EAN13,
    width: 300,
    height: 100
  }))

  return (
    <div>
      <div ref={container} />
      <button onClick={() => download('barcode.png')}>下载</button>
      {error() && <div>错误: {error()}</div>}
    </div>
  )
}
```

## 🎨 高级用法

### 批量生成

```typescript
import { BarcodeGenerator, BarcodeFormat } from '@ldesign/barcode-core'

const configs = [
  { content: '123456', format: BarcodeFormat.CODE128 },
  { content: '1234567890128', format: BarcodeFormat.EAN13 },
  { content: '123456789012', format: BarcodeFormat.UPCA }
]

const barcodes = configs.map(config => 
  BarcodeGenerator.generate(config)
)

// 批量下载
barcodes.forEach((barcode, index) => {
  barcode.download(`barcode-${index}.png`)
})
```

### 自定义样式

```typescript
import { createBarcode, BarcodeFormat } from '@ldesign/barcode-core'

const barcode = createBarcode({
  content: '1234567890128',
  format: BarcodeFormat.EAN13,
  width: 400,
  height: 150,
  background: '#f0f0f0',
  foreground: '#ff0000',
  fontSize: 18,
  fontFamily: 'Arial',
  margin: 20,
  displayValue: true,
  textAlign: 'center',
  renderType: 'svg' // 或 'canvas'
})
```

### 格式验证

```typescript
import { BarcodeValidator, BarcodeFormat } from '@ldesign/barcode-core'

// 验证数据
const isValid = BarcodeValidator.validate('1234567890128', BarcodeFormat.EAN13)

// 自动检测格式
const format = BarcodeValidator.detectFormat('1234567890128')
console.log(format) // BarcodeFormat.EAN13
```

### 图片扫描

```typescript
import { ImageScanner, BarcodeFormat } from '@ldesign/barcode-core'

// 创建扫描器
const scanner = new ImageScanner({
  formats: [BarcodeFormat.EAN13, BarcodeFormat.CODE128],
  preprocess: true,
  maxAttempts: 3
})

// 扫描文件
const results = await scanner.scanFile(file)

// 批量扫描
const batchResults = await scanner.scanBatch([file1, file2, file3])
```

### SVG导出

```typescript
import { createBarcode, BarcodeFormat } from '@ldesign/barcode-core'

const barcode = createBarcode({
  content: '1234567890128',
  format: BarcodeFormat.EAN13,
  renderType: 'svg'
})

// 获取SVG字符串
const svgString = barcode.toSVGString()

// 保存为SVG文件
barcode.download('barcode.svg', 'svg')
```

### 性能监控

```typescript
import { PerformanceMonitor } from '@ldesign/barcode-core/performance'

const monitor = new PerformanceMonitor({ enabled: true })

// 测量操作
await monitor.measure('barcode-generation', async () => {
  const barcode = createBarcode({
    content: '1234567890128',
    format: BarcodeFormat.EAN13
  })
})

// 获取报告
const report = monitor.getReport()
console.log('平均耗时:', report.averageDuration, 'ms')
```

## 🧪 测试示例

### Vitest

```typescript
import { describe, it, expect } from 'vitest'
import { createBarcode, BarcodeFormat } from '@ldesign/barcode-core'

describe('Barcode', () => {
  it('should create EAN13 barcode', () => {
    const barcode = createBarcode({
      content: '1234567890128',
      format: BarcodeFormat.EAN13
    })

    expect(barcode).toBeDefined()
    expect(barcode.getElement()).toBeTruthy()
  })

  it('should generate correct dataURL', () => {
    const barcode = createBarcode({
      content: '123456',
      format: BarcodeFormat.CODE128,
      renderType: 'canvas'
    })

    const dataURL = barcode.toDataURL('png')
    expect(dataURL).toMatch(/^data:image\/png/)
  })
})
```

### Vue Test Utils

```typescript
import { mount } from '@vue/test-utils'
import { Barcode, BarcodeFormat } from '@ldesign/barcode-vue'

describe('Barcode Component', () => {
  it('should render barcode', () => {
    const wrapper = mount(Barcode, {
      props: {
        content: '1234567890128',
        format: BarcodeFormat.EAN13
      }
    })

    expect(wrapper.find('.ldesign-barcode').exists()).toBe(true)
  })
})
```

### React Testing Library

```tsx
import { render, screen } from '@testing-library/react'
import { Barcode, BarcodeFormat } from '@ldesign/barcode-react'

describe('Barcode Component', () => {
  it('should render barcode', () => {
    render(
      <Barcode
        content="1234567890128"
        format={BarcodeFormat.EAN13}
      />
    )

    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
```

## 📚 更多资源

- [完整API文档](./RESTRUCTURE_PLAN.md#api-design)
- [实施指南](./IMPLEMENTATION_GUIDE.md)
- [项目规划](./RESTRUCTURE_PLAN.md)

## 💡 提示

1. **始终销毁实例**：使用完毕后调用`destroy()`避免内存泄漏
2. **选择正确的渲染类型**：Canvas性能更好，SVG可缩放
3. **启用预处理**：扫描时启用`preprocess`提高识别率
4. **指定格式范围**：限制扫描格式可以提升性能
5. **使用缓存**：重复生成相同条形码会自动使用缓存

## 🐛 常见问题

### 问题：条形码显示不正确

**解决方案**：
- 检查数据格式是否正确
- 验证校验位
- 尝试不同的渲染类型

### 问题：扫描识别失败

**解决方案**：
- 确保图片质量足够
- 启用预处理：`preprocess: true`
- 增加尝试次数：`maxAttempts: 5`

### 问题：内存占用过高

**解决方案**：
- 及时销毁不用的实例
- 使用批量操作而非循环创建
- 检查是否正确清理事件监听器
