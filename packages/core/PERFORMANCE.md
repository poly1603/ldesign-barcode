# 性能优化指南

## 已实现的优化

### 1. 对象池（Object Pooling）
- Canvas元素复用
- 减少DOM创建开销
- 位置：`core/resource-pool.ts`

### 2. 缓存机制
- 条形码结果缓存
- LRU缓存策略
- 位置：`core/barcode-cache.ts`

### 3. 批量处理
- 支持批量生成
- 并发控制
- 位置：`core/batch-generator.ts`

## 性能优化建议

### Canvas vs SVG 选择
```typescript
// Canvas - 更快的渲染，适合大量生成
generator.generate(value, { renderType: 'canvas' });

// SVG - 更好的缩放，适合需要缩放的场景
generator.generate(value, { renderType: 'svg' });
```

### 批量生成优化
```typescript
import { BatchBarcodeGenerator } from '@ldesign/barcode-core';

const batch = new BatchBarcodeGenerator();
const results = await batch.generateBatch({
  items: [
    { value: '123', options: { format: 'ean13' } },
    { value: '456', options: { format: 'ean13' } },
  ],
  concurrency: 5, // 并发数控制
});
```

### 缓存使用
```typescript
import { configureGlobalCache } from '@ldesign/barcode-core';

// 配置缓存
configureGlobalCache({
  maxSize: 100,    // 最大缓存数
  ttl: 300000,     // 5分钟过期
});
```

### Canvas池配置
```typescript
import { configureGlobalCanvasPool } from '@ldesign/barcode-core';

// 配置Canvas池
configureGlobalCanvasPool({
  maxSize: 10,     // 最大池大小
  initialSize: 3,  // 初始池大小
});
```

## 内存优化建议

### 1. 及时清理
```typescript
const result = await generator.generate(value, options);

// 使用完后清理
if (result.element) {
  result.element.remove();
  result.element = undefined;
}
```

### 2. 避免内存泄漏
```typescript
// ❌ 错误 - 持续持有引用
const elements = [];
for (let i = 0; i < 1000; i++) {
  const result = await generator.generate(value, options);
  elements.push(result.element); // 内存泄漏
}

// ✅ 正确 - 及时清理
for (let i = 0; i < 1000; i++) {
  const result = await generator.generate(value, options);
  // 使用完立即清理
  result.element?.remove();
}
```

### 3. 使用对象池
```typescript
import { getGlobalCanvasPool } from '@ldesign/barcode-core';

const pool = getGlobalCanvasPool();
const canvas = pool.acquire();
// 使用canvas
pool.release(canvas); // 释放回池
```

## 性能监控

### 使用性能监控器
```typescript
import { measure, getGlobalMonitor } from '@ldesign/barcode-core';

// 测量性能
await measure('generate-barcode', async () => {
  await generator.generate(value, options);
});

// 获取报告
const monitor = getGlobalMonitor();
const report = monitor.getReport();
console.log(report);
```

### 使用性能分析器
```typescript
import { profile, getGlobalProfiler } from '@ldesign/barcode-core';

// 分析性能
const result = await profile('my-operation', async () => {
  // 你的操作
});

const profiler = getGlobalProfiler();
console.log(profiler.getEntries());
```

## 基准测试

运行性能测试：
```bash
cd packages/core
pnpm test:bench
```

## 性能指标参考

### 生成性能（参考值）
- EAN-13 Canvas: ~2-5ms
- EAN-13 SVG: ~3-8ms
- Code128: ~5-10ms
- 批量生成(10个): ~20-50ms

### 内存使用（参考值）
- 单个Canvas: ~50KB
- 单个SVG: ~10-30KB
- Canvas池(10个): ~500KB
- 缓存(100个): ~5MB

## 最佳实践

1. **选择合适的渲染方式**
   - 静态展示 → Canvas
   - 需要缩放 → SVG
   - 批量生成 → Canvas + 对象池

2. **启用缓存**
   - 相同内容重复生成时
   - 配置合理的缓存大小和TTL

3. **批量处理**
   - 大量生成时使用批量API
   - 控制并发数避免阻塞

4. **及时清理**
   - 使用完立即清理DOM元素
   - 避免长时间持有引用

5. **监控性能**
   - 开发时使用性能监控
   - 定期运行基准测试
