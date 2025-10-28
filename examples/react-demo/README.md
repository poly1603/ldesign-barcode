# @ldesign/barcode React Demo

完整的 React 演示项目，展示 `@ldesign/barcode-react` 的所有功能。

## 功能展示

- ✅ `<Barcode>` 组件
- ✅ `<BarcodeScanner>` 组件
- ✅ `useBarcode()` Hook
- ✅ 多格式支持、实时渲染、导出功能

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器（端口3002）
pnpm dev

# 构建
pnpm build
```

## 使用示例

```tsx
import { Barcode, useBarcode } from '@ldesign/barcode-react';

function App() {
  const [value, setValue] = useState('123456789');
  const { downloadPNG } = useBarcode();

  return (
    <>
      <Barcode value={value} format="code128" width={300} height={100} />
      <button onClick={() => downloadPNG(value, { format: 'code128' })}>
        下载
      </button>
    </>
  );
}
```

## 相关链接

- [React包文档](../../packages/react/README.md)
- [核心包文档](../../packages/core/README.md)
- [项目主页](../../README.md)
