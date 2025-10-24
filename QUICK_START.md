# 🚀 快速启动指南

## 📦 安装和构建

### 1. 安装依赖

```bash
cd libraries/barcode
npm install
```

### 2. 运行测试

```bash
# 运行所有测试
npm test

# 查看测试覆盖率
npm run test:coverage

# 使用 UI 界面
npm run test:ui
```

### 3. 构建包

```bash
npm run build
```

**构建产物**:
- `es/` - ESM 格式
- `lib/` - CommonJS 格式
- `*.d.ts` - TypeScript 类型定义

## 🎨 运行示例项目

### Vite 演示应用

```bash
# 1. 进入示例目录
cd examples/vite-demo

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 在浏览器中打开
# http://localhost:3000
```

**功能展示**:
- ✅ 7种格式生成演示
- ✅ 文件上传扫描
- ✅ 实时自定义配置
- ✅ 下载 PNG/SVG
- ✅ 性能统计

## 💻 基础使用

### 生成条码

```typescript
import { createBarcode, BarcodeFormat } from '@ldesign/barcode';

// 创建 EAN-13 条码
const barcode = createBarcode({
  content: '6901234567892',
  format: BarcodeFormat.EAN13,
  width: 300,
  height: 100,
  container: document.getElementById('barcode'),
});

// 下载
barcode.download('barcode.png');
```

### 扫描条码

```typescript
import { scanBarcode } from '@ldesign/barcode';

// 扫描图片
const fileInput = document.getElementById('file');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const results = await scanBarcode(file);
  console.log('扫描结果:', results);
});
```

### Vue 3 组件

```vue
<template>
  <Barcode
    content="6901234567892"
    :format="BarcodeFormat.EAN13"
  />
</template>

<script setup>
import { Barcode, BarcodeFormat } from '@ldesign/barcode/vue';
</script>
```

## 🎯 按需导入（推荐）

### 仅使用生成功能

```typescript
// 包体积减少 60%
import { createBarcode } from '@ldesign/barcode/generator';
```

### 仅使用扫描功能

```typescript
// 包体积减少 40%
import { scanBarcode } from '@ldesign/barcode/scanner';
```

### 性能工具

```typescript
import { measure, configureGlobalCache } from '@ldesign/barcode/performance';

// 启用缓存
configureGlobalCache({ maxSize: 100 });

// 监控性能
await measure('generate', () => {
  return createBarcode({ content: '123' });
});
```

## 🔧 高级用法

### 批量生成

```typescript
import { generateBatch } from '@ldesign/barcode';

const results = await generateBatch(
  ['123', '456', '789'],
  { format: BarcodeFormat.CODE128 },
  {
    concurrency: 10,
    onProgress: (done, total) => {
      console.log(`进度: ${done}/${total}`);
    }
  }
);
```

### 性能监控

```typescript
import { getGlobalMonitor } from '@ldesign/barcode/performance';

// 获取性能报告
const report = getGlobalMonitor().getReport();
console.log('平均耗时:', report.averageDuration);
console.log('总操作数:', report.totalOperations);
```

## 📝 测试清单

运行示例后，验证以下功能：

### 生成功能
- [ ] EAN-13 显示正常
- [ ] EAN-8 显示正常
- [ ] UPC-A 显示正常
- [ ] CODE128 显示正常
- [ ] CODE39 显示正常
- [ ] ITF-14 显示正常
- [ ] 下载 PNG 功能正常
- [ ] 下载 SVG 功能正常

### 扫描功能
- [ ] 上传图片正常
- [ ] 扫描识别正常
- [ ] 结果显示正常
- [ ] 置信度显示正常

### 自定义功能
- [ ] 实时配置更新
- [ ] 颜色修改生效
- [ ] 尺寸调整生效
- [ ] 渲染类型切换正常
- [ ] Data URL 复制正常

## 🐛 常见问题

### 1. 构建失败

**问题**: `npm run build` 失败

**解决**:
```bash
# 清理并重新安装
rm -rf node_modules
npm install
npm run build
```

### 2. 示例项目启动失败

**问题**: Vite 演示无法启动

**解决**:
```bash
# 确保在正确的目录
cd examples/vite-demo

# 清理并重装
rm -rf node_modules
npm install

# 确保父包已构建
cd ../..
npm run build

# 再次启动
cd examples/vite-demo
npm run dev
```

### 3. 导入错误

**问题**: 无法导入模块

**解决**: 确保使用正确的导入路径

```typescript
// ✅ 正确
import { createBarcode } from '@ldesign/barcode';
import { createBarcode } from '@ldesign/barcode/generator';

// ❌ 错误
import createBarcode from '@ldesign/barcode';
```

### 4. TypeScript 错误

**问题**: 类型定义找不到

**解决**: 确保包已正确构建

```bash
npm run build
# 检查 es/*.d.ts 文件是否存在
```

## 📚 文档导航

- [完整 API 文档](./README.md)
- [升级指南](./V0.2_UPGRADE_GUIDE.md)
- [性能最佳实践](./PERFORMANCE_TIPS.md)
- [优化报告](./OPTIMIZATION_REPORT.md)
- [构建检查清单](./BUILD_CHECK.md)

## 🎉 开始使用

现在你已经准备好开始使用 @ldesign/barcode 了！

1. ✅ 安装依赖
2. ✅ 运行测试
3. ✅ 构建包
4. ✅ 启动示例
5. ✅ 开始开发

有任何问题，请参考文档或提交 Issue。

---

**版本**: v0.2.0  
**更新**: 2024年10月24日  
**维护**: LDesign Team

