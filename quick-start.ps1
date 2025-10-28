# 快速开始脚本 - 条形码库重构项目

$ErrorActionPreference = "Stop"

Write-Host "`n🚀 条形码库快速开始脚本`n" -ForegroundColor Cyan

# 检查pnpm
Write-Host "检查pnpm安装..." -ForegroundColor Yellow
if (!(Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 未找到pnpm，请先安装: npm install -g pnpm" -ForegroundColor Red
    exit 1
}
Write-Host "✓ pnpm已安装" -ForegroundColor Green

# 步骤1: 运行设置脚本
Write-Host "`n步骤1: 创建包结构..." -ForegroundColor Cyan
if (Test-Path "setup-packages.ps1") {
    & .\setup-packages.ps1
} else {
    Write-Host "⚠️  setup-packages.ps1 不存在，跳过..." -ForegroundColor Yellow
}

# 步骤2: 安装依赖
Write-Host "`n步骤2: 安装依赖..." -ForegroundColor Cyan
Write-Host "这可能需要几分钟..." -ForegroundColor Gray
pnpm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 依赖安装失败" -ForegroundColor Red
    exit 1
}
Write-Host "✓ 依赖安装成功" -ForegroundColor Green

# 步骤3: 构建core包
Write-Host "`n步骤3: 构建core包..." -ForegroundColor Cyan
pnpm --filter @ldesign/barcode-core build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Core包构建失败" -ForegroundColor Red
    Write-Host "请检查TypeScript错误和构建配置" -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Core包构建成功" -ForegroundColor Green

# 步骤4: 运行类型检查
Write-Host "`n步骤4: 类型检查..." -ForegroundColor Cyan
pnpm --filter @ldesign/barcode-core typecheck

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  类型检查有错误，请修复" -ForegroundColor Yellow
} else {
    Write-Host "✓ 类型检查通过" -ForegroundColor Green
}

# 步骤5: 运行ESLint
Write-Host "`n步骤5: 代码检查..." -ForegroundColor Cyan
pnpm --filter @ldesign/barcode-core lint

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  ESLint检查有错误" -ForegroundColor Yellow
    Write-Host "运行 'pnpm --filter @ldesign/barcode-core lint:fix' 自动修复" -ForegroundColor Gray
} else {
    Write-Host "✓ 代码检查通过" -ForegroundColor Green
}

# 步骤6: 运行测试
Write-Host "`n步骤6: 运行测试..." -ForegroundColor Cyan
pnpm --filter @ldesign/barcode-core test:run

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  部分测试失败" -ForegroundColor Yellow
} else {
    Write-Host "✓ 所有测试通过" -ForegroundColor Green
}

# 完成
Write-Host "`n✅ 快速开始完成！`n" -ForegroundColor Green

# 显示后续步骤
Write-Host "后续步骤:" -ForegroundColor Cyan
Write-Host "1. 修复任何类型或ESLint错误:" -ForegroundColor White
Write-Host "   pnpm --filter @ldesign/barcode-core lint:fix" -ForegroundColor Gray
Write-Host "   pnpm --filter @ldesign/barcode-core typecheck" -ForegroundColor Gray

Write-Host "`n2. 构建其他包:" -ForegroundColor White
Write-Host "   pnpm build:vue" -ForegroundColor Gray
Write-Host "   pnpm build:react" -ForegroundColor Gray
Write-Host "   pnpm build:angular" -ForegroundColor Gray

Write-Host "`n3. 运行开发模式:" -ForegroundColor White
Write-Host "   pnpm dev" -ForegroundColor Gray

Write-Host "`n4. 查看文档:" -ForegroundColor White
Write-Host "   - RESTRUCTURE_PLAN.md - 整体规划" -ForegroundColor Gray
Write-Host "   - IMPLEMENTATION_GUIDE.md - 实施指南" -ForegroundColor Gray

Write-Host "`n5. 需要帮助？查看:" -ForegroundColor White
Write-Host "   https://github.com/ldesign/barcode" -ForegroundColor Gray

Write-Host ""
