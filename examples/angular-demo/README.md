# @ldesign/barcode Angular Demo

```bash
pnpm install
pnpm dev  # 端口 3007
```

## 使用示例

```typescript
import { Component } from '@angular/core';
import { BarcodeModule } from '@ldesign/barcode-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BarcodeModule],
  template: `
    <barcode [value]="'123456789'" [format]="'code128'" [width]="300" [height]="100"></barcode>
  `
})
export class AppComponent {
  value = '123456789';
}
```
