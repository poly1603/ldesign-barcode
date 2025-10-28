<template>
  <div class="container">
    <h1>🎨 @ldesign/barcode</h1>
    <p class="subtitle">强大的条形码生成与扫描库 - Vue 3 演示</p>

    <BarcodeGeneratorDemo />
    <BarcodeScannerDemo />
    <BarcodeValidatorDemo />
  </div>
</template>

<script setup lang="ts">
import BarcodeGeneratorDemo from './components/BarcodeGeneratorDemo.vue';
import BarcodeScannerDemo from './components/BarcodeScannerDemo.vue';
import BarcodeValidatorDemo from './components/BarcodeValidatorDemo.vue';
</script>
