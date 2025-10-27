/**
 * @ldesign/barcode-vue build configuration
 */

import { defineConfig } from '@ldesign/builder';

export default defineConfig({
  name: '@ldesign/barcode-vue',
  entry: 'src/index.ts',

  output: {
    esm: {
      enabled: true,
      dir: 'es',
    },
    cjs: {
      enabled: true,
      dir: 'lib',
    },
    dts: {
      enabled: true,
      dir: 'es',
    },
  },

  external: [
    'vue',
    '@ldesign/barcode-core',
  ],

  sourcemap: true,
});

