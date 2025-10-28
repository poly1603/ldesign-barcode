import { createEffect, createSignal, onCleanup, type Component } from 'solid-js'
import type { BarcodeConfig, BarcodeFormat, BarcodeInstance } from '@ldesign/barcode-core'
import { createBarcode } from '@ldesign/barcode-core'

export interface BarcodeProps {
  content: string
  format?: BarcodeFormat
  width?: number
  height?: number
  displayValue?: boolean
  background?: string
  foreground?: string
  renderType?: 'svg' | 'canvas'
  margin?: number
  fontSize?: number
  textAlign?: 'left' | 'center' | 'right'
  fontFamily?: string
  lineWidth?: number
}

export const Barcode: Component<BarcodeProps> = (props) => {
  let containerRef: HTMLDivElement | undefined
  let instance: BarcodeInstance | null = null
  const [error, setError] = createSignal<Error | null>(null)

  const renderBarcode = () => {
    if (!containerRef)
      return

    // 销毁旧实例
    if (instance) {
      instance.destroy()
      instance = null
    }

    // 创建新实例
    const config: BarcodeConfig = {
      content: props.content,
      format: props.format,
      width: props.width ?? 200,
      height: props.height ?? 100,
      displayValue: props.displayValue ?? true,
      background: props.background ?? '#ffffff',
      foreground: props.foreground ?? '#000000',
      renderType: props.renderType ?? 'canvas',
      margin: props.margin ?? 10,
      fontSize: props.fontSize ?? 14,
      textAlign: props.textAlign ?? 'center',
      fontFamily: props.fontFamily ?? 'monospace',
      lineWidth: props.lineWidth ?? 2,
      container: containerRef,
    }

    try {
      instance = createBarcode(config)
      setError(null)
    }
    catch (err) {
      setError(err as Error)
      console.error('Failed to create barcode:', err)
    }
  }

  createEffect(() => {
    // 监听props变化
    props.content
    renderBarcode()
  })

  onCleanup(() => {
    if (instance) {
      instance.destroy()
      instance = null
    }
  })

  return (
    <div>
      <div ref={containerRef} class="ldesign-barcode" />
      {error() && <div class="ldesign-barcode-error">错误: {error()!.message}</div>}
    </div>
  )
}

export default Barcode
