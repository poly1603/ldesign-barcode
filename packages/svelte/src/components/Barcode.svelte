<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { BarcodeConfig, BarcodeFormat, BarcodeInstance } from '@ldesign/barcode-core'
  import { createBarcode } from '@ldesign/barcode-core'

  // Props
  export let content: string
  export let format: BarcodeFormat | undefined = undefined
  export let width = 200
  export let height = 100
  export let displayValue = true
  export let background = '#ffffff'
  export let foreground = '#000000'
  export let renderType: 'svg' | 'canvas' = 'canvas'
  export let margin = 10
  export let fontSize = 14
  export let textAlign: 'left' | 'center' | 'right' = 'center'
  export let fontFamily = 'monospace'
  export let lineWidth = 2

  let container: HTMLDivElement
  let instance: BarcodeInstance | null = null

  function renderBarcode() {
    // 销毁旧实例
    if (instance) {
      instance.destroy()
      instance = null
    }

    // 创建新实例
    const config: BarcodeConfig = {
      content,
      format,
      width,
      height,
      displayValue,
      background,
      foreground,
      renderType,
      margin,
      fontSize,
      textAlign,
      fontFamily,
      lineWidth,
      container,
    }

    try {
      instance = createBarcode(config)
    }
    catch (error) {
      console.error('Failed to create barcode:', error)
    }
  }

  // 导出方法
  export function download(fileName?: string, exportFormat?: 'png' | 'jpeg' | 'svg') {
    if (instance) {
      instance.download(fileName, exportFormat)
    }
  }

  export function toDataURL(exportFormat: 'png' | 'jpeg' = 'png', quality?: number): string | null {
    if (instance) {
      try {
        return instance.toDataURL(exportFormat, quality)
      }
      catch {
        return null
      }
    }
    return null
  }

  export function toSVGString(): string | null {
    if (instance) {
      try {
        return instance.toSVGString()
      }
      catch {
        return null
      }
    }
    return null
  }

  onMount(() => {
    renderBarcode()
  })

  onDestroy(() => {
    if (instance) {
      instance.destroy()
      instance = null
    }
  })

  // 响应式更新
  $: if (container && instance) {
    renderBarcode()
  }
</script>

<div bind:this={container} class="ldesign-barcode" />

<style>
  .ldesign-barcode {
    display: inline-block;
  }
</style>
