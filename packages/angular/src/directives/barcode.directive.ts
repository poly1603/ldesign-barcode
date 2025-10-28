import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core'
import type { BarcodeConfig, BarcodeFormat, BarcodeInstance } from '@ldesign/barcode-core'
import { createBarcode } from '@ldesign/barcode-core'

/**
 * 条形码指令
 * 使用方式: <div ldesignBarcode [barcodeContent]="'123456'" [barcodeFormat]="format"></div>
 */
@Directive({
  selector: '[ldesignBarcode]',
  standalone: true,
})
export class BarcodeDirective implements OnInit, OnChanges, OnDestroy {
  @Input() barcodeContent!: string
  @Input() barcodeFormat?: BarcodeFormat
  @Input() barcodeWidth = 200
  @Input() barcodeHeight = 100
  @Input() barcodeDisplayValue = true
  @Input() barcodeBackground = '#ffffff'
  @Input() barcodeForeground = '#000000'
  @Input() barcodeRenderType: 'svg' | 'canvas' = 'canvas'
  @Input() barcodeMargin = 10
  @Input() barcodeFontSize = 14
  @Input() barcodeTextAlign: 'left' | 'center' | 'right' = 'center'
  @Input() barcodeFontFamily = 'monospace'
  @Input() barcodeLineWidth = 2

  private barcodeInstance: BarcodeInstance | null = null

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.renderBarcode()
  }

  ngOnChanges(changes: SimpleChanges): void {
    // 如果已经初始化且有变化，重新渲染
    if (this.barcodeInstance && !changes['barcodeContent']?.firstChange) {
      this.renderBarcode()
    }
  }

  ngOnDestroy(): void {
    this.destroyBarcode()
  }

  private renderBarcode(): void {
    // 销毁旧实例
    this.destroyBarcode()

    // 清空容器
    this.elementRef.nativeElement.innerHTML = ''

    // 创建新实例
    const config: BarcodeConfig = {
      content: this.barcodeContent,
      format: this.barcodeFormat,
      width: this.barcodeWidth,
      height: this.barcodeHeight,
      displayValue: this.barcodeDisplayValue,
      background: this.barcodeBackground,
      foreground: this.barcodeForeground,
      renderType: this.barcodeRenderType,
      margin: this.barcodeMargin,
      fontSize: this.barcodeFontSize,
      textAlign: this.barcodeTextAlign,
      fontFamily: this.barcodeFontFamily,
      lineWidth: this.barcodeLineWidth,
      container: this.elementRef.nativeElement,
    }

    try {
      this.barcodeInstance = createBarcode(config)
    }
    catch (error) {
      console.error('Failed to create barcode:', error)
    }
  }

  private destroyBarcode(): void {
    if (this.barcodeInstance) {
      this.barcodeInstance.destroy()
      this.barcodeInstance = null
    }
  }
}
