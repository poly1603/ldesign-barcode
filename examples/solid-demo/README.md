# @ldesign/barcode Solid.js Demo

```bash
pnpm install
pnpm dev  # 端口 3004
```

## 使用示例

```tsx
import { Barcode } from '@ldesign/barcode-solid';
import { createSignal } from 'solid-js';

const [value] = createSignal('123456789');
<Barcode value={value()} format="code128" />
```
