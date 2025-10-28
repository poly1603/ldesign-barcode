<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import type { BarcodeFormat, ScanResult, ScannerOptions } from '@ldesign/barcode-core'
  import { ImageScanner } from '@ldesign/barcode-core'

  // Props
  export let formats: BarcodeFormat[] | undefined = undefined
  export let preprocess = true
  export let maxAttempts = 3
  export let showInput = true

  const dispatch = createEventDispatcher<{
    scan: ScanResult[]
    error: Error
    scanning: boolean
  }>()

  let fileInput: HTMLInputElement
  let scanner: ImageScanner | null = null
  let isScanning = false

  function initScanner() {
    const options: ScannerOptions = {
      formats,
      preprocess,
      maxAttempts,
    }

    scanner = new ImageScanner(options)
  }

  async function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement
    const files = input.files

    if (!files || files.length === 0)
      return

    isScanning = true
    dispatch('scanning', true)

    try {
      if (files.length === 1) {
        // 单个文件
        const results = await scanFile(files[0])
        dispatch('scan', results)
      }
      else {
        // 多个文件
        const batchResults = await scanBatch(Array.from(files))
        const allResults = batchResults.flatMap(r => r.results)
        dispatch('scan', allResults)
      }
    }
    catch (err) {
      dispatch('error', err as Error)
    }
    finally {
      isScanning = false
      dispatch('scanning', false)
      input.value = ''
    }
  }

  export async function scanFile(file: File): Promise<ScanResult[]> {
    if (!scanner) {
      throw new Error('Scanner not initialized')
    }

    return await scanner.scanFile(file)
  }

  export async function scanBatch(files: File[]): Promise<Array<{
    fileName: string
    results: ScanResult[]
    error?: Error
  }>> {
    if (!scanner) {
      throw new Error('Scanner not initialized')
    }

    return await scanner.scanBatch(files)
  }

  export function selectFile() {
    fileInput.click()
  }

  export function updateOptions(options: Partial<ScannerOptions>) {
    if (scanner) {
      scanner.setOptions(options)
    }
  }

  onMount(() => {
    initScanner()
  })
</script>

<div class="ldesign-barcode-scanner">
  <input
    bind:this={fileInput}
    type="file"
    accept="image/*"
    multiple
    on:change={handleFileChange}
    style:display={showInput ? 'block' : 'none'}
  />
  
  <div class="scanner-status">
    <slot {isScanning} />
  </div>
</div>

<style>
  .ldesign-barcode-scanner {
    display: block;
  }
  
  .scanner-status {
    margin-top: 1rem;
  }
</style>
