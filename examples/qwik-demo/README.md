# @ldesign/barcode Qwik Demo

```bash
pnpm install
pnpm dev  # 端口 3006
```

## 使用示例

```tsx
import { component$, useSignal } from '@builder.io/qwik';
import { Barcode } from '@ldesign/barcode-qwik';

export default component$(() => {
  const value = useSignal('123456789');
  return <Barcode value={value.value} format="code128" />;
});
```
