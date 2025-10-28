#!/usr/bin/env node

/**
 * 运行所有测试的脚本
 * 包括单元测试、性能测试和视觉测试
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import { join } from 'path';

const execAsync = promisify(exec);

const rootDir = process.cwd();
const coreDir = join(rootDir, 'packages', 'core');

console.log('🧪 开始运行所有测试...\n');

const testSuites = [
  {
    name: '单元测试',
    command: 'pnpm test',
    dir: coreDir,
    icon: '🔬'
  },
  {
    name: '性能测试',
    command: 'pnpm test:bench',
    dir: coreDir,
    icon: '⚡'
  },
  {
    name: '覆盖率测试',
    command: 'pnpm test:coverage',
    dir: coreDir,
    icon: '📊'
  }
];

const results = [];

async function runTest(suite) {
  console.log(`${suite.icon} 运行 ${suite.name}...`);
  
  try {
    const { stdout, stderr } = await execAsync(suite.command, {
      cwd: suite.dir,
      timeout: 60000 // 60秒超时
    });

    console.log(`✅ ${suite.name} 通过\n`);
    
    return {
      name: suite.name,
      success: true,
      output: stdout
    };
  } catch (error) {
    console.log(`❌ ${suite.name} 失败\n`);
    console.error(error.stderr || error.message);
    
    return {
      name: suite.name,
      success: false,
      error: error.message
    };
  }
}

async function main() {
  // 检查核心包是否存在
  if (!existsSync(coreDir)) {
    console.error('❌ 核心包不存在，请先安装依赖');
    process.exit(1);
  }

  // 运行所有测试
  for (const suite of testSuites) {
    const result = await runTest(suite);
    results.push(result);
    console.log('---\n');
  }

  // 输出总结
  console.log('\n📊 测试总结:\n');
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`总测试套件: ${results.length}`);
  console.log(`✅ 通过: ${passed}`);
  console.log(`❌ 失败: ${failed}\n`);

  results.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${result.name}`);
  });

  if (failed > 0) {
    console.log('\n⚠️  存在失败的测试，请检查上面的错误信息');
    process.exit(1);
  } else {
    console.log('\n🎉 所有测试通过！');
    process.exit(0);
  }
}

main().catch(error => {
  console.error('运行测试时出错:', error);
  process.exit(1);
});
