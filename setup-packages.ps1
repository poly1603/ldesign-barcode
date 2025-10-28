# 自动设置所有包的脚本

$ErrorActionPreference = "Stop"

# 包列表
$packages = @(
    @{ name = "svelte"; frameworks = @("svelte") },
    @{ name = "solid"; frameworks = @("solid-js") },
    @{ name = "qwik"; frameworks = @("qwik") },
    @{ name = "preact"; frameworks = @("preact") }
)

Write-Host "开始创建包结构..." -ForegroundColor Green

foreach ($pkg in $packages) {
    $pkgName = $pkg.name
    $pkgPath = "packages\$pkgName"
    
    Write-Host "`n创建 $pkgName 包..." -ForegroundColor Cyan
    
    # 创建目录结构
    $dirs = @(
        "$pkgPath\src\components",
        "$pkgPath\tests"
    )
    
    # Solid 和 Preact 需要hooks目录
    if ($pkgName -eq "solid") {
        $dirs += "$pkgPath\src\primitives"
    }
    if ($pkgName -in @("preact")) {
        $dirs += "$pkgPath\src\hooks"
    }
    if ($pkgName -eq "svelte") {
        $dirs += "$pkgPath\src\stores"
    }
    
    foreach ($dir in $dirs) {
        if (!(Test-Path $dir)) {
            New-Item -ItemType Directory -Force -Path $dir | Out-Null
            Write-Host "  ✓ 创建目录: $dir" -ForegroundColor Gray
        }
    }
    
    # 创建基本文件
    $files = @(
        "$pkgPath\src\index.ts",
        "$pkgPath\tests\.gitkeep",
        "$pkgPath\README.md"
    )
    
    foreach ($file in $files) {
        if (!(Test-Path $file)) {
            New-Item -ItemType File -Force -Path $file | Out-Null
            Write-Host "  ✓ 创建文件: $file" -ForegroundColor Gray
        }
    }
}

Write-Host "`n✅ 所有包结构创建完成！" -ForegroundColor Green
Write-Host "`n下一步:" -ForegroundColor Yellow
Write-Host "1. 运行 'pnpm install' 安装依赖" -ForegroundColor White
Write-Host "2. 为每个包创建具体的组件实现" -ForegroundColor White
Write-Host "3. 配置 pnpm-workspace.yaml" -ForegroundColor White
Write-Host "4. 运行 'pnpm -r build' 构建所有包" -ForegroundColor White
