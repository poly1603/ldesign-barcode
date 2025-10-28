import { Injectable } from '@angular/core'
import type {
  BarcodeConfig,
  BarcodeFormat,
  BarcodeInstance,
  ScanResult,
  ScannerOptions,
} from '@ldesign/barcode-core'
import {
  BarcodeGenerator,
  BarcodeValidator,
  ImageScanner,
} from '@ldesign/barcode-core'

/**
 * Angular条形码服务
 * 提供条形码生成、扫描和验证功能
 */
@Injectable({
  providedIn: 'root',
})
export class BarcodeService {
  /**
   * 生成条形码实例
   */
  generate(config: BarcodeConfig): BarcodeInstance {
    return BarcodeGenerator.generate(config)
  }

  /**
   * 生成条形码为DataURL
   */
  async toDataURL(
    content: string,
    format?: BarcodeFormat,
    options?: Partial<BarcodeConfig>,
  ): Promise<string> {
    return await BarcodeGenerator.toDataURL(content, format, options)
  }

  /**
   * 生成条形码为SVG字符串
   */
  toSVGString(
    content: string,
    format?: BarcodeFormat,
    options?: Partial<BarcodeConfig>,
  ): string {
    return BarcodeGenerator.toSVGString(content, format, options)
  }

  /**
   * 验证条形码数据
   */
  validate(content: string, format: BarcodeFormat): boolean {
    return BarcodeValidator.validate(content, format)
  }

  /**
   * 自动检测条形码格式
   */
  detectFormat(content: string): BarcodeFormat | null {
    return BarcodeValidator.detectFormat(content)
  }

  /**
   * 扫描图片中的条形码
   */
  async scanImage(
    image: File | HTMLImageElement | ImageData,
    options?: ScannerOptions,
  ): Promise<ScanResult[]> {
    const scanner = new ImageScanner(options)

    if (image instanceof File) {
      return await scanner.scanFile(image)
    }
    else if (image instanceof HTMLImageElement) {
      return await scanner.scanImage(image)
    }
    else {
      return await scanner.scanImageData(image)
    }
  }

  /**
   * 批量扫描图片
   */
  async scanBatch(
    files: File[],
    options?: ScannerOptions,
  ): Promise<Array<{
    fileName: string
    results: ScanResult[]
    error?: Error
  }>> {
    const scanner = new ImageScanner(options)
    return await scanner.scanBatch(files)
  }
}
