# @ldesign/barcode Svelte Demo

Svelte演示项目，展示`@ldesign/barcode-svelte`的所有功能。

## 快速开始

```bash
pnpm install
pnpm dev  # 端口 3003
```

## 使用示例

```svelte
<script>
  import { Barcode } from '@ldesign/barcode-svelte';
  let value = '123456789';
</script>

<Barcode {value} format="code128" width={300} height={100} />
```

## 相关链接

- [Svelte包文档](../../packages/svelte/README.md)
- [项目主页](../../README.md)
