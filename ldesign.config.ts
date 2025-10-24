/**
 * @ldesign/barcode build configuration
 */

import { defineConfig } from '@ldesign/builder';

export default defineConfig({
  // 基础配置
  name: '@ldesign/barcode',
  entry: 'src/index.ts',

  // 输出配置
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
    umd: {
      enabled: false, // 暂时禁用 UMD，因为需要特殊配置
    },
  },

  // 外部依赖
  external: [
    'vue',
    'react',
    'react-dom',
    '@ldesign/shared',
    '@ericblade/quagga2',
  ],

  // 全局变量（如果启用UMD）
  globals: {
    'vue': 'Vue',
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
});

