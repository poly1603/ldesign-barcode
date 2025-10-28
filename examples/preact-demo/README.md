# @ldesign/barcode Preact Demo

```bash
pnpm install
pnpm dev  # 端口 3005
```

## 使用示例

```tsx
import { Barcode } from '@ldesign/barcode-preact';
import { useState } from 'preact/hooks';

const [value] = useState('123456789');
<Barcode value={value} format="code128" />
```
