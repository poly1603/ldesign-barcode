<template>
  <div class="container">
    <!-- 头部 -->
    <div class="header">
      <h1>📊 @ldesign/barcode</h1>
      <p>强大的条形码生成与扫描库 - 完整功能演示</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats">
      <div class="stat-card">
        <div class="stat-value">7</div>
        <div class="stat-label">支持格式</div>
      </div>
      <div class="stat-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
        <div class="stat-value">{{ generatedCount }}</div>
        <div class="stat-label">已生成条码</div>
      </div>
      <div class="stat-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
        <div class="stat-value">{{ scannedCount }}</div>
        <div class="stat-label">已扫描条码</div>
      </div>
    </div>

    <!-- 标签页 -->
    <div class="section">
      <div class="tabs">
        <button class="tab" :class="{ active: activeTab === 'generate' }" @click="activeTab = 'generate'">
          🎨 生成条码
        </button>
        <button class="tab" :class="{ active: activeTab === 'scan' }" @click="activeTab = 'scan'">
          📷 扫描条码
        </button>
        <button class="tab" :class="{ active: activeTab === 'custom' }" @click="activeTab = 'custom'">
          ⚙️ 自定义生成
        </button>
      </div>

      <!-- 生成条码标签页 -->
      <div v-if="activeTab === 'generate'">
        <h2 class="section-title">
          <span class="icon">🎨</span>
          条码生成示例
        </h2>

        <div class="grid">
          <div class="card" v-for="example in examples" :key="example.format">
            <div class="card-title">
              {{ example.title }}
              <span class="badge">{{ example.format }}</span>
            </div>
            <div class="barcode-container" :ref="el => setRef(example.format, el)"></div>
            <div style="text-align: center; margin-bottom: 10px;">
              <code>{{ example.content }}</code>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary" @click="downloadBarcode(example.format)">
                下载 PNG
              </button>
              <button class="btn btn-success" @click="downloadSVG(example.format)">
                下载 SVG
              </button>
            </div>
          </div>
        </div>

        <div class="info-box">
          <h3>✨ 支持的格式</h3>
          <ul>
            <li>EAN-13/EAN-8 - 欧洲商品码（自动校验位）</li>
            <li>UPC-A/UPC-E - 美国商品码（压缩编码）</li>
            <li>Code128 - 高密度条码（智能子集选择）</li>
            <li>Code39 - 字母数字条码（可选校验位）</li>
            <li>Code93 - 改进的 Code39（双校验字符）</li>
            <li>ITF-14 - 物流条码（交错编码）</li>
            <li>Codabar - 图书馆/医疗条码</li>
          </ul>
        </div>
      </div>

      <!-- 扫描条码标签页 -->
      <div v-if="activeTab === 'scan'">
        <h2 class="section-title">
          <span class="icon">📷</span>
          条码扫描
        </h2>

        <div class="scanner-section">
          <div class="upload-area" @click="triggerFileInput">
            <div class="upload-icon">📤</div>
            <h3>点击上传图片或拖拽到此处</h3>
            <p style="color: var(--text-secondary); margin-top: 10px;">
              支持 JPG、PNG、GIF 等格式
            </p>
            <input ref="fileInput" type="file" accept="image/*" multiple @change="handleFileChange"
              style="display: none;">
          </div>

          <div v-if="previewUrl" style="text-align: center;">
            <img :src="previewUrl" alt="Preview" class="preview-image">
          </div>

          <div v-if="isScanning" style="text-align: center;">
            <div class="spinner"></div>
            <div class="loading-text">正在扫描条码...</div>
          </div>

          <div v-if="scanError" class="error-message">
            {{ scanError }}
          </div>

          <div v-if="scanResults.length > 0" class="scan-results">
            <h3 style="margin-bottom: 15px; color: var(--text-primary);">
              扫描结果 ({{ scanResults.length }})
            </h3>
            <div v-for="(result, index) in scanResults" :key="index" class="result-item">
              <div class="result-format">{{ result.format }}</div>
              <div class="result-data">{{ result.data }}</div>
              <div class="result-confidence">
                置信度: {{ (result.confidence * 100).toFixed(1) }}%
              </div>
            </div>
          </div>
        </div>

        <div class="info-box">
          <h3>💡 扫描提示</h3>
          <ul>
            <li>支持多种格式同时识别</li>
            <li>自动图像预处理（灰度、增强、旋转）</li>
            <li>批量扫描多个图片</li>
            <li>支持模糊或低质量图片</li>
          </ul>
        </div>
      </div>

      <!-- 自定义生成标签页 -->
      <div v-if="activeTab === 'custom'">
        <h2 class="section-title">
          <span class="icon">⚙️</span>
          自定义条码生成
        </h2>

        <div class="controls">
          <div class="control-group">
            <label>条码内容</label>
            <input v-model="customConfig.content" placeholder="输入条码内容">
          </div>
          <div class="control-group">
            <label>格式</label>
            <select v-model="customConfig.format">
              <option value="CODE128">CODE128</option>
              <option value="EAN13">EAN13</option>
              <option value="EAN8">EAN8</option>
              <option value="UPCA">UPCA</option>
              <option value="UPCE">UPCE</option>
              <option value="CODE39">CODE39</option>
              <option value="CODE93">CODE93</option>
              <option value="ITF14">ITF14</option>
              <option value="CODABAR">CODABAR</option>
            </select>
          </div>
        </div>

        <div class="controls">
          <div class="control-group">
            <label>宽度 ({{ customConfig.width }}px)</label>
            <input type="range" v-model="customConfig.width" min="200" max="600" step="50">
          </div>
          <div class="control-group">
            <label>高度 ({{ customConfig.height }}px)</label>
            <input type="range" v-model="customConfig.height" min="60" max="200" step="20">
          </div>
        </div>

        <div class="controls">
          <div class="control-group">
            <label>前景色</label>
            <input type="color" v-model="customConfig.foreground">
          </div>
          <div class="control-group">
            <label>背景色</label>
            <input type="color" v-model="customConfig.background">
          </div>
          <div class="control-group">
            <label>渲染类型</label>
            <select v-model="customConfig.renderType">
              <option value="canvas">Canvas</option>
              <option value="svg">SVG</option>
            </select>
          </div>
        </div>

        <div class="controls">
          <div class="control-group">
            <label>字体大小 ({{ customConfig.fontSize }}px)</label>
            <input type="range" v-model="customConfig.fontSize" min="10" max="24" step="2">
          </div>
          <div class="control-group">
            <label>边距 ({{ customConfig.margin }}px)</label>
            <input type="range" v-model="customConfig.margin" min="0" max="30" step="5">
          </div>
          <div class="control-group" style="display: flex; align-items: center; padding-top: 30px;">
            <label style="margin: 0; margin-right: 10px;">显示文本</label>
            <input type="checkbox" v-model="customConfig.displayValue" style="width: auto;">
          </div>
        </div>

        <button class="btn btn-primary" @click="generateCustomBarcode" style="margin-bottom: 20px;">
          生成条码
        </button>

        <div class="card" v-if="customBarcodeGenerated">
          <div class="card-title">自定义条码</div>
          <div class="barcode-container" ref="customContainer"></div>
          <div class="card-footer">
            <button class="btn btn-primary" @click="downloadCustom('png')">
              下载 PNG
            </button>
            <button class="btn btn-success" @click="downloadCustom('svg')">
              下载 SVG
            </button>
            <button class="btn btn-warning" @click="copyDataURL">
              复制 Data URL
            </button>
          </div>
          <div v-if="copySuccess" class="success-message">
            ✓ Data URL 已复制到剪贴板
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { createBarcode, BarcodeFormat, scanBarcode } from '@ldesign/barcode';

// 状态
const activeTab = ref('generate');
const generatedCount = ref(0);
const scannedCount = ref(0);

// 示例数据
const examples = [
  { format: 'EAN13', title: 'EAN-13', content: '6901234567892' },
  { format: 'EAN8', title: 'EAN-8', content: '1234567' },
  { format: 'UPCA', title: 'UPC-A', content: '123456789012' },
  { format: 'CODE128', title: 'Code128', content: 'ABC-123456' },
  { format: 'CODE39', title: 'Code39', content: 'HELLO WORLD' },
  { format: 'ITF14', title: 'ITF-14', content: '1234567890123' },
];

// 条码实例存储
const barcodeInstances = ref(new Map());
const containerRefs = ref(new Map());

// 扫描相关
const fileInput = ref(null);
const previewUrl = ref(null);
const isScanning = ref(false);
const scanError = ref(null);
const scanResults = ref([]);

// 自定义配置
const customConfig = ref({
  content: 'CUSTOM-12345',
  format: 'CODE128',
  width: 300,
  height: 100,
  displayValue: true,
  background: '#ffffff',
  foreground: '#000000',
  renderType: 'canvas',
  fontSize: 14,
  margin: 10,
});

const customContainer = ref(null);
const customBarcodeInstance = ref(null);
const customBarcodeGenerated = ref(false);
const copySuccess = ref(false);

// 设置容器引用
const setRef = (format, el) => {
  if (el) {
    containerRefs.value.set(format, el);
  }
};

// 生成所有示例条码
const generateExamples = async () => {
  await nextTick();

  examples.forEach(example => {
    const container = containerRefs.value.get(example.format);
    if (container) {
      try {
        // 清空容器
        container.innerHTML = '';

        const instance = createBarcode({
          content: example.content,
          format: BarcodeFormat[example.format],
          width: 280,
          height: 90,
          displayValue: true,
          container: container,
        });

        barcodeInstances.value.set(example.format, instance);
        generatedCount.value++;
      } catch (error) {
        console.error(`生成 ${example.format} 失败:`, error);
      }
    }
  });
};

// 下载条码
const downloadBarcode = (format) => {
  const instance = barcodeInstances.value.get(format);
  if (instance) {
    instance.download(`barcode-${format}.png`, 'png');
  }
};

const downloadSVG = (format) => {
  // 重新生成 SVG 版本
  const example = examples.find(e => e.format === format);
  if (example) {
    const svgInstance = createBarcode({
      content: example.content,
      format: BarcodeFormat[example.format],
      width: 280,
      height: 90,
      displayValue: true,
      renderType: 'svg',
    });
    svgInstance.download(`barcode-${format}.svg`, 'svg');
    svgInstance.destroy();
  }
};

// 扫描相关函数
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = async (event) => {
  const files = Array.from(event.target.files || []);
  if (files.length === 0) return;

  isScanning.value = true;
  scanError.value = null;
  scanResults.value = [];

  // 预览第一张图片
  if (files.length === 1) {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value);
    }
    previewUrl.value = URL.createObjectURL(files[0]);
  }

  try {
    const results = await scanBarcode(files[0]);
    scanResults.value = results;
    scannedCount.value += results.length;

    if (results.length === 0) {
      scanError.value = '未检测到条码，请尝试其他图片或调整图片质量';
    }
  } catch (error) {
    scanError.value = `扫描失败: ${error.message}`;
    console.error('扫描错误:', error);
  } finally {
    isScanning.value = false;
  }
};

// 自定义生成
const generateCustomBarcode = async () => {
  await nextTick();

  if (!customContainer.value) return;

  // 销毁旧实例
  if (customBarcodeInstance.value) {
    customBarcodeInstance.value.destroy();
  }

  // 清空容器
  customContainer.value.innerHTML = '';

  try {
    customBarcodeInstance.value = createBarcode({
      content: customConfig.value.content,
      format: BarcodeFormat[customConfig.value.format],
      width: parseInt(customConfig.value.width),
      height: parseInt(customConfig.value.height),
      displayValue: customConfig.value.displayValue,
      background: customConfig.value.background,
      foreground: customConfig.value.foreground,
      renderType: customConfig.value.renderType,
      fontSize: parseInt(customConfig.value.fontSize),
      margin: parseInt(customConfig.value.margin),
      container: customContainer.value,
    });

    customBarcodeGenerated.value = true;
    generatedCount.value++;
  } catch (error) {
    alert(`生成失败: ${error.message}`);
  }
};

// 下载自定义条码
const downloadCustom = (format) => {
  if (customBarcodeInstance.value) {
    customBarcodeInstance.value.download(`custom-barcode.${format}`, format);
  }
};

// 复制 Data URL
const copyDataURL = async () => {
  if (customBarcodeInstance.value && customConfig.value.renderType === 'canvas') {
    try {
      const dataURL = customBarcodeInstance.value.toDataURL();
      await navigator.clipboard.writeText(dataURL);
      copySuccess.value = true;
      setTimeout(() => {
        copySuccess.value = false;
      }, 3000);
    } catch (error) {
      alert('复制失败，请使用 Canvas 渲染类型');
    }
  }
};

// 监听自定义配置变化
watch(customConfig, () => {
  if (customBarcodeGenerated.value) {
    generateCustomBarcode();
  }
}, { deep: true });

// 挂载时生成示例
onMounted(() => {
  generateExamples();
});
</script>
