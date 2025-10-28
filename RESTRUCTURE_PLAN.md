# Barcode Library Restructure Plan

## 📋 Overview
Transform the @ldesign/barcode library into a comprehensive multi-framework monorepo supporting Vue, React, Angular, Svelte, Solid.js, Qwik, and Preact.

## 🎯 Goals
1. ✅ Framework-agnostic core package
2. ✅ Individual framework packages for easy integration
3. ✅ Optimal performance and minimal memory usage
4. ✅ Complete TypeScript types with no errors
5. ✅ Comprehensive testing (unit, visual, performance)
6. ✅ Full documentation with examples
7. ✅ Zero build errors with @ldesign/builder
8. ✅ ESLint configured with @antfu/eslint-config

## 📦 Package Structure

```
libraries/barcode/
├── packages/
│   ├── core/                    # @ldesign/barcode-core
│   │   ├── src/
│   │   │   ├── core/           # Generator, validator, cache, registry
│   │   │   ├── formats/        # EAN, UPC, Code128, Code39, etc.
│   │   │   ├── renderers/      # SVG, Canvas, OffscreenCanvas
│   │   │   ├── scanner/        # Image scanner, decoder, preprocessor
│   │   │   ├── performance/    # Monitor, profiler
│   │   │   ├── errors/         # Error classes
│   │   │   ├── types/          # TypeScript definitions
│   │   │   ├── utils/          # Checksum, encoder utilities
│   │   │   └── index.ts
│   │   ├── tests/              # Unit tests
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── eslint.config.js
│   │   └── vitest.config.ts
│   │
│   ├── vue/                     # @ldesign/barcode-vue
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Barcode.vue
│   │   │   │   ├── BarcodeScanner.vue
│   │   │   │   └── index.ts
│   │   │   ├── composables/
│   │   │   │   ├── useBarcode.ts
│   │   │   │   ├── useBarcodeScanner.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── tests/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── eslint.config.js
│   │   └── vitest.config.ts
│   │
│   ├── react/                   # @ldesign/barcode-react
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Barcode.tsx
│   │   │   │   ├── BarcodeScanner.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useBarcode.ts
│   │   │   │   ├── useBarcodeScanner.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── tests/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── eslint.config.js
│   │   └── vitest.config.ts
│   │
│   ├── angular/                 # @ldesign/barcode-angular
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── barcode.component.ts
│   │   │   │   └── barcode-scanner.component.ts
│   │   │   ├── directives/
│   │   │   │   └── barcode.directive.ts
│   │   │   ├── services/
│   │   │   │   └── barcode.service.ts
│   │   │   ├── barcode.module.ts
│   │   │   └── index.ts
│   │   ├── tests/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── eslint.config.js
│   │
│   ├── svelte/                  # @ldesign/barcode-svelte
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Barcode.svelte
│   │   │   │   └── BarcodeScanner.svelte
│   │   │   ├── stores/
│   │   │   │   └── barcode.ts
│   │   │   └── index.ts
│   │   ├── tests/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── eslint.config.js
│   │   └── vitest.config.ts
│   │
│   ├── solid/                   # @ldesign/barcode-solid
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Barcode.tsx
│   │   │   │   └── BarcodeScanner.tsx
│   │   │   ├── primitives/
│   │   │   │   └── createBarcode.ts
│   │   │   └── index.ts
│   │   ├── tests/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── eslint.config.js
│   │   └── vitest.config.ts
│   │
│   ├── qwik/                    # @ldesign/barcode-qwik
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── barcode.tsx
│   │   │   │   └── barcode-scanner.tsx
│   │   │   └── index.ts
│   │   ├── tests/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── eslint.config.js
│   │   └── vitest.config.ts
│   │
│   └── preact/                  # @ldesign/barcode-preact
│       ├── src/
│       │   ├── components/
│       │   │   ├── Barcode.tsx
│       │   │   └── BarcodeScanner.tsx
│       │   ├── hooks/
│       │   │   └── useBarcode.ts
│       │   └── index.ts
│       ├── tests/
│       ├── package.json
│       ├── tsconfig.json
│       ├── eslint.config.js
│       └── vitest.config.ts
│
├── examples/
│   ├── core-demo/              # Vanilla JS/TS demo
│   ├── vue-demo/               # Vue 3 demo
│   ├── react-demo/             # React demo
│   ├── angular-demo/           # Angular demo
│   ├── svelte-demo/            # Svelte demo
│   ├── solid-demo/             # Solid.js demo
│   ├── qwik-demo/              # Qwik demo
│   └── preact-demo/            # Preact demo
│
├── docs/                        # VitePress documentation
│   ├── .vitepress/
│   ├── guide/
│   ├── api/
│   ├── examples/
│   └── index.md
│
├── pnpm-workspace.yaml
├── package.json                 # Root package.json
├── tsconfig.json
└── README.md

```

## 🔧 Technical Improvements

### Performance Optimizations
1. **Encoding Cache**: LRU cache for frequently used barcode patterns
2. **Canvas Pooling**: Reuse canvas elements to reduce GC pressure
3. **Lazy Loading**: Dynamic imports for format encoders
4. **Web Workers**: Offload heavy scanning operations
5. **Memory Profiling**: Built-in memory leak detection

### New Features to Add
1. **Batch Generation**: Generate multiple barcodes in parallel
2. **Streaming API**: Generate barcodes progressively
3. **WASM Support**: Optional WASM encoder for better performance
4. **Print Optimization**: Special mode for high-quality printing
5. **Validation API**: Standalone validation without rendering
6. **Format Auto-detection**: Smarter format detection with confidence scores
7. **Checksum Calculator**: Utility to calculate checksums for any format
8. **Custom Encoders**: Plugin system for custom barcode formats
9. **Error Correction**: Add error correction for QR-like formats
10. **Image Export**: Export to multiple formats (PNG, JPEG, WebP, PDF)

### Code Quality
1. **ESLint**: @antfu/eslint-config with strict rules
2. **TypeScript**: Strict mode with complete type coverage
3. **Testing**: 
   - Unit tests with Vitest (>90% coverage)
   - Visual regression with Playwright
   - Performance benchmarks
4. **Documentation**: 
   - API reference with TypeDoc
   - Interactive examples
   - Migration guides

## 📝 Implementation Phases

### Phase 1: Core Package Setup ✅
- [x] Analyze existing code
- [ ] Move core code to packages/core
- [ ] Add new features (batch, streaming, etc.)
- [ ] Configure build with @ldesign/builder
- [ ] Add ESLint and fix all errors
- [ ] Complete TypeScript types
- [ ] Write comprehensive tests

### Phase 2: Framework Packages 🚧
- [ ] Update Vue package
- [ ] Update React package
- [ ] Create Angular package
- [ ] Create Svelte package
- [ ] Create Solid.js package
- [ ] Create Qwik package
- [ ] Create Preact package

### Phase 3: Examples & Documentation 📚
- [ ] Create demo projects for each framework
- [ ] Set up VitePress documentation site
- [ ] Write comprehensive guides
- [ ] Add API reference
- [ ] Create video tutorials

### Phase 4: Testing & Optimization 🧪
- [ ] Unit tests for all packages
- [ ] Visual regression tests
- [ ] Performance benchmarks
- [ ] Memory profiling
- [ ] Fix memory leaks

### Phase 5: CI/CD & Release 🚀
- [ ] Configure GitHub Actions
- [ ] Set up automated testing
- [ ] Configure npm publishing
- [ ] Create release workflow
- [ ] Add changelog generation

## 🎨 API Design

### Core Package API
```typescript
// Generation
import { createBarcode, BarcodeFormat } from '@ldesign/barcode-core';

const barcode = createBarcode({
  content: '123456789012',
  format: BarcodeFormat.EAN13,
  width: 300,
  height: 100,
});

// Batch generation
import { createBarcodeBatch } from '@ldesign/barcode-core';

const barcodes = await createBarcodeBatch([
  { content: '123', format: BarcodeFormat.CODE128 },
  { content: '456', format: BarcodeFormat.EAN13 },
]);

// Scanning
import { scanBarcode } from '@ldesign/barcode-core';

const results = await scanBarcode(imageFile, {
  formats: [BarcodeFormat.EAN13, BarcodeFormat.CODE128],
});

// Validation
import { validateBarcode, detectFormat } from '@ldesign/barcode-core';

const isValid = validateBarcode('123456789012', BarcodeFormat.EAN13);
const format = detectFormat('123456789012'); // BarcodeFormat.EAN13
```

### Vue 3 API
```vue
<script setup>
import { Barcode, BarcodeScanner } from '@ldesign/barcode-vue';
import { useBarcode } from '@ldesign/barcode-vue';
import { BarcodeFormat } from '@ldesign/barcode-core';

const { container, download } = useBarcode({
  content: '123456789012',
  format: BarcodeFormat.EAN13,
});
</script>

<template>
  <Barcode content="123456789012" :format="BarcodeFormat.EAN13" />
  <BarcodeScanner @scan="onScan" />
</template>
```

### React API
```tsx
import { Barcode, BarcodeScanner, useBarcode } from '@ldesign/barcode-react';
import { BarcodeFormat } from '@ldesign/barcode-core';

function App() {
  const { containerRef, download } = useBarcode({
    content: '123456789012',
    format: BarcodeFormat.EAN13,
  });

  return (
    <>
      <Barcode content="123456789012" format={BarcodeFormat.EAN13} />
      <BarcodeScanner onScan={handleScan} />
      <div ref={containerRef} />
    </>
  );
}
```

## 📊 Success Metrics
- [ ] All packages build without errors
- [ ] All tests pass (unit, visual, performance)
- [ ] ESLint reports 0 errors
- [ ] TypeScript has 0 type errors
- [ ] Test coverage >90%
- [ ] Performance: <5ms for encoding, <50ms for scanning
- [ ] Memory: No leaks detected in 1-hour stress test
- [ ] Bundle size: Core <50KB gzipped, Framework packages <20KB gzipped

## 🔄 Migration Path
For existing users:

```typescript
// Old API (still supported)
import { createBarcode } from '@ldesign/barcode';

// New API (recommended)
import { createBarcode } from '@ldesign/barcode-core';
import { Barcode } from '@ldesign/barcode-vue'; // or react, etc.
```

## 📚 Documentation Structure
1. **Getting Started**: Installation, quick start
2. **Core Concepts**: Formats, rendering, scanning
3. **Framework Guides**: Vue, React, Angular, Svelte, Solid, Qwik, Preact
4. **API Reference**: Complete API documentation
5. **Advanced Topics**: Performance, customization, plugins
6. **Migration Guide**: From v0.x to v1.x
7. **Contributing**: How to contribute
8. **Changelog**: Version history
