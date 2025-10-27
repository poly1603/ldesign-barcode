/**
 * @ldesign/barcode-react build configuration
 */

import { defineConfig } from '@ldesign/builder';

export default defineConfig({
  name: '@ldesign/barcode-react',
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
    'react',
    'react-dom',
    '@ldesign/barcode-core',
  ],

  sourcemap: true,
});

