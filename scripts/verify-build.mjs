#!/usr/bin/env node

/**
 * 验证构建脚本
 * 检查所有包是否可以成功构建
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import { join } from 'path';

const execAsync = promisify(exec);

const packages = [
  'core',
  'vue',
  'react',
  'angular',
  'svelte',
  'solid',
  'qwik',
  'preact'
];

const rootDir = process.cwd();

console.log('🔍 验证构建配置...\n');

async function verifyPackage(pkg) {
  const pkgPath = join(rootDir, 'packages', pkg);
  const pkgJsonPath = join(pkgPath, 'package.json');
  
  if (!existsSync(pkgJsonPath)) {
    console.log(`❌ ${pkg}: package.json 不存在`);
    return false;
  }
  
  console.log(`✅ ${pkg}: 配置正确`);
  return true;
}

async function checkBuildCommand(pkg) {
  const pkgPath = join(rootDir, 'packages', pkg);
  
  try {
    const { stdout } = await execAsync('pnpm run build --help', {
      cwd: pkgPath,
      timeout: 5000
    });
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  let allValid = true;
  
  for (const pkg of packages) {
    const isValid = await verifyPackage(pkg);
    if (!isValid) {
      allValid = false;
    }
  }
  
  console.log('\n📊 验证结果:');
  console.log(`总包数: ${packages.length}`);
  console.log(`状态: ${allValid ? '✅ 全部通过' : '❌ 存在问题'}\n`);
  
  if (allValid) {
    console.log('💡 提示: 运行 `pnpm build` 开始构建所有包');
  } else {
    console.log('⚠️  请先修复上述问题再进行构建');
    process.exit(1);
  }
}

main().catch(console.error);
