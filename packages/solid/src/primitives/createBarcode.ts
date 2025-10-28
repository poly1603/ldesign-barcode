import { createEffect, createSignal, onCleanup, type Accessor } from 'solid-js'
import type { BarcodeConfig, BarcodeInstance } from '@ldesign/barcode-core'
import { createBarcode as createBarcodeCore } from '@ldesign/barcode-core'

export interface CreateBarcodeReturn {
  container: (el: HTMLElement) => void
  instance: Accessor<BarcodeInstance | null>
  error: Accessor<Error | null>
  download: (fileName?: string, format?: 'png' | 'jpeg' | 'svg') => void
  toDataURL: (format?: 'png' | 'jpeg', quality?: number) => string | null
  toSVGString: () => string | null
}

export function createBarcode(
  config: Accessor<Omit<BarcodeConfig, 'container'>>,
): CreateBarcodeReturn {
  let containerElement: HTMLElement | undefined
  const [instance, setInstance] = createSignal<BarcodeInstance | null>(null)
  const [error, setError] = createSignal<Error | null>(null)

  const renderBarcode = () => {
    if (!containerElement)
      return

    // 销毁旧实例
    const oldInstance = instance()
    if (oldInstance) {
      oldInstance.destroy()
      setInstance(null)
    }

    // 创建新实例
    const fullConfig: BarcodeConfig = {
      ...config(),
      container: containerElement,
    }

    try {
      const newInstance = createBarcodeCore(fullConfig)
      setInstance(newInstance)
      setError(null)
    }
    catch (err) {
      setError(err as Error)
      console.error('Failed to create barcode:', err)
    }
  }

  // 响应式更新
  createEffect(() => {
    config() // 追踪config变化
    renderBarcode()
  })

  // 清理
  onCleanup(() => {
    const currentInstance = instance()
    if (currentInstance) {
      currentInstance.destroy()
      setInstance(null)
    }
  })

  // 容器ref回调
  const container = (el: HTMLElement) => {
    containerElement = el
    renderBarcode()
  }

  // 辅助方法
  const download = (fileName?: string, format?: 'png' | 'jpeg' | 'svg') => {
    const currentInstance = instance()
    if (currentInstance) {
      currentInstance.download(fileName, format)
    }
  }

  const toDataURL = (format: 'png' | 'jpeg' = 'png', quality?: number): string | null => {
    const currentInstance = instance()
    if (currentInstance) {
      try {
        return currentInstance.toDataURL(format, quality)
      }
      catch {
        return null
      }
    }
    return null
  }

  const toSVGString = (): string | null => {
    const currentInstance = instance()
    if (currentInstance) {
      try {
        return currentInstance.toSVGString()
      }
      catch {
        return null
      }
    }
    return null
  }

  return {
    container,
    instance,
    error,
    download,
    toDataURL,
    toSVGString,
  }
}
