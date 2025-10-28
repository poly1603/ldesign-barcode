# 批量生成框架包配置脚本

$ErrorActionPreference = "Stop"

# 定义框架包配置
$packages = @(
    @{
        name = "qwik"
        displayName = "Qwik"
        version = "0.1.0"
        peerDeps = "@{ 'qwik' = '^1.0.0' }"
        devDeps = "@'qwik', '@builder.io/qwik'"
    },
    @{
        name = "preact"
        displayName = "Preact"
        version = "0.1.0"
        peerDeps = "@{ 'preact' = '^10.0.0' }"
        devDeps = "'preact', '@preact/signals'"
    }
)

Write-Host "`n🏗️  批量生成框架包配置...`n" -ForegroundColor Cyan

foreach ($pkg in $packages) {
    $pkgName = $pkg.name
    $displayName = $pkg.displayName
    
    Write-Host "处理 $displayName 包..." -ForegroundColor Yellow
    
    # 创建目录
    $dirs = @(
        "packages\$pkgName\src\components",
        "packages\$pkgName\src\hooks",
        "packages\$pkgName\tests"
    )
    
    foreach ($dir in $dirs) {
        if (!(Test-Path $dir)) {
            New-Item -ItemType Directory -Force -Path $dir | Out-Null
            Write-Host "  ✓ 创建: $dir" -ForegroundColor Gray
        }
    }
    
    # 创建package.json
    $packageJson = @"
{
  "name": "@ldesign/barcode-$pkgName",
  "version": "$($pkg.version)",
  "description": "条形码 $displayName 组件和 hooks",
  "keywords": [
    "ldesign",
    "barcode",
    "$pkgName",
    "component",
    "hooks"
  ],
  "author": "LDesign Team",
  "license": "MIT",
  "type": "module",
  "sideEffects": false,
  "exports": {
    ".": {
      "types": "./es/index.d.ts",
      "import": "./es/index.js",
      "require": "./lib/index.cjs"
    }
  },
  "main": "./lib/index.cjs",
  "module": "./es/index.js",
  "types": "./es/index.d.ts",
  "files": [
    "README.md",
    "LICENSE",
    "package.json",
    "es",
    "lib"
  ],
  "scripts": {
    "build": "ldesign-builder build -f esm,cjs,dts",
    "dev": "ldesign-builder build -f esm,cjs,dts --watch",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "typecheck": "tsc --noEmit",
    "clean": "rimraf dist es lib coverage"
  },
  "dependencies": {
    "@ldesign/barcode-core": "workspace:*"
  },
  "peerDependencies": $($pkg.peerDeps),
  "devDependencies": {
    "@antfu/eslint-config": "^6.0.0",
    "@ldesign/builder": "workspace:*",
    "@vitest/coverage-v8": "^2.0.0",
    "@vitest/ui": "^2.0.0",
    "eslint": "^9.18.0",
    "happy-dom": "^12.10.0",
    "rimraf": "^5.0.5",
    "typescript": "^5.7.3",
    "vite": "^5.0.0",
    "vitest": "^2.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/ldesign/ldesign.git",
    "directory": "libraries/barcode/packages/$pkgName"
  },
  "publishConfig": {
    "access": "public"
  }
}
"@
    
    $packageJsonPath = "packages\$pkgName\package.json"
    if (!(Test-Path $packageJsonPath)) {
        $packageJson | Out-File -FilePath $packageJsonPath -Encoding utf8
        Write-Host "  ✓ 创建: package.json" -ForegroundColor Gray
    }
    
    # 创建index.ts
    $indexTs = @"
/**
 * @ldesign/barcode-$pkgName
 * $displayName 条形码库
 */

// 重新导出核心类型
export type {
  BarcodeConfig,
  BarcodeFormat,
  BarcodeInstance,
  ScanResult,
  ScannerOptions,
  EncodedBarcode,
  RenderOptions,
} from '@ldesign/barcode-core'

// 重新导出核心功能
export {
  BarcodeFormat,
  BarcodeGenerator,
  BarcodeValidator,
  ImageScanner,
  createBarcode,
  scanBarcode,
} from '@ldesign/barcode-core'
"@
    
    $indexTsPath = "packages\$pkgName\src\index.ts"
    if (!(Test-Path $indexTsPath)) {
        $indexTs | Out-File -FilePath $indexTsPath -Encoding utf8
        Write-Host "  ✓ 创建: index.ts" -ForegroundColor Gray
    }
    
    # 创建tsconfig.json
    $tsconfig = @"
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./es",
    "rootDir": "./src",
    "jsx": "preserve"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "es", "lib", "**/__tests__/**", "**/*.test.ts"]
}
"@
    
    $tsconfigPath = "packages\$pkgName\tsconfig.json"
    if (!(Test-Path $tsconfigPath)) {
        $tsconfig | Out-File -FilePath $tsconfigPath -Encoding utf8
        Write-Host "  ✓ 创建: tsconfig.json" -ForegroundColor Gray
    }
    
    # 创建eslint.config.js
    $eslintConfig = @"
import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  formatters: { css: true, markdown: true },
  ignores: ['**/node_modules/**', '**/dist/**', '**/es/**', '**/lib/**'],
})
"@
    
    $eslintPath = "packages\$pkgName\eslint.config.js"
    if (!(Test-Path $eslintPath)) {
        $eslintConfig | Out-File -FilePath $eslintPath -Encoding utf8
        Write-Host "  ✓ 创建: eslint.config.js" -ForegroundColor Gray
    }
    
    Write-Host "  ✅ $displayName 包配置完成`n" -ForegroundColor Green
}

Write-Host "All framework packages generated!" -ForegroundColor Green
Write-Host "Next: Implement component code for each package" -ForegroundColor Yellow
