import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core'
import type { BarcodeConfig, BarcodeFormat, BarcodeInstance } from '@ldesign/barcode-core'
import { createBarcode } from '@ldesign/barcode-core'

@Component({
  selector: 'ldesign-barcode',
  standalone: true,
  template: `<div #barcodeContainer class="ldesign-barcode"></div>`,
  styles: [`
    .ldesign-barcode {
      display: inline-block;
    }
  `],
})
export class BarcodeComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('barcodeContainer', { static: true }) container!: ElementRef<HTMLDivElement>

  @Input({ required: true }) content!: string
  @Input() format?: BarcodeFormat
  @Input() width = 200
  @Input() height = 100
  @Input() displayValue = true
  @Input() background = '#ffffff'
  @Input() foreground = '#000000'
  @Input() renderType: 'svg' | 'canvas' = 'canvas'
  @Input() margin = 10
  @Input() fontSize = 14
  @Input() textAlign: 'left' | 'center' | 'right' = 'center'
  @Input() fontFamily = 'monospace'
  @Input() lineWidth = 2

  private barcodeInstance: BarcodeInstance | null = null

  ngOnInit(): void {
    this.renderBarcode()
  }

  ngOnChanges(changes: SimpleChanges): void {
    // 如果已经初始化且有变化，重新渲染
    if (this.barcodeInstance && !changes['content']?.firstChange) {
      this.renderBarcode()
    }
  }

  ngOnDestroy(): void {
    this.destroyBarcode()
  }

  private renderBarcode(): void {
    // 销毁旧实例
    this.destroyBarcode()

    // 创建新实例
    const config: BarcodeConfig = {
      content: this.content,
      format: this.format,
      width: this.width,
      height: this.height,
      displayValue: this.displayValue,
      background: this.background,
      foreground: this.foreground,
      renderType: this.renderType,
      margin: this.margin,
      fontSize: this.fontSize,
      textAlign: this.textAlign,
      fontFamily: this.fontFamily,
      lineWidth: this.lineWidth,
      container: this.container.nativeElement,
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

  /**
   * 下载条形码
   */
  download(fileName?: string, format?: 'png' | 'jpeg' | 'svg'): void {
    if (this.barcodeInstance) {
      this.barcodeInstance.download(fileName, format)
    }
  }

  /**
   * 获取DataURL
   */
  toDataURL(format: 'png' | 'jpeg' = 'png', quality?: number): string | null {
    if (this.barcodeInstance) {
      try {
        return this.barcodeInstance.toDataURL(format, quality)
      }
      catch {
        return null
      }
    }
    return null
  }

  /**
   * 获取SVG字符串
   */
  toSVGString(): string | null {
    if (this.barcodeInstance) {
      try {
        return this.barcodeInstance.toSVGString()
      }
      catch {
        return null
      }
    }
    return null
  }
}
