import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import type { BarcodeFormat, ScanResult, ScannerOptions } from '@ldesign/barcode-core'
import { ImageScanner } from '@ldesign/barcode-core'

@Component({
  selector: 'ldesign-barcode-scanner',
  standalone: true,
  template: `
    <div class="ldesign-barcode-scanner">
      <input
        #fileInput
        type="file"
        accept="image/*"
        multiple
        (change)="onFileChange($event)"
        [style.display]="showInput ? 'block' : 'none'"
      />
      <div class="scanner-status">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .ldesign-barcode-scanner {
      display: block;
    }
    
    .scanner-status {
      margin-top: 1rem;
    }
  `],
})
export class BarcodeScannerComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput', { static: true }) fileInput!: ElementRef<HTMLInputElement>

  @Input() formats?: BarcodeFormat[]
  @Input() preprocess = true
  @Input() maxAttempts = 3
  @Input() showInput = true

  @Output() scan = new EventEmitter<ScanResult[]>()
  @Output() error = new EventEmitter<Error>()
  @Output() scanning = new EventEmitter<boolean>()

  private scanner: ImageScanner | null = null

  ngOnInit(): void {
    this.initScanner()
  }

  ngOnDestroy(): void {
    this.scanner = null
  }

  private initScanner(): void {
    const options: ScannerOptions = {
      formats: this.formats,
      preprocess: this.preprocess,
      maxAttempts: this.maxAttempts,
    }

    this.scanner = new ImageScanner(options)
  }

  async onFileChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement
    const files = input.files

    if (!files || files.length === 0)
      return

    this.scanning.emit(true)

    try {
      if (files.length === 1) {
        // 单个文件
        const results = await this.scanFile(files[0])
        this.scan.emit(results)
      }
      else {
        // 多个文件
        const batchResults = await this.scanBatch(Array.from(files))
        // 合并所有结果
        const allResults = batchResults.flatMap(r => r.results)
        this.scan.emit(allResults)
      }
    }
    catch (err) {
      this.error.emit(err as Error)
    }
    finally {
      this.scanning.emit(false)
      // 清空input以允许重复选择同一文件
      input.value = ''
    }
  }

  /**
   * 扫描单个文件
   */
  async scanFile(file: File): Promise<ScanResult[]> {
    if (!this.scanner) {
      throw new Error('Scanner not initialized')
    }

    return await this.scanner.scanFile(file)
  }

  /**
   * 批量扫描文件
   */
  async scanBatch(files: File[]): Promise<Array<{
    fileName: string
    results: ScanResult[]
    error?: Error
  }>> {
    if (!this.scanner) {
      throw new Error('Scanner not initialized')
    }

    return await this.scanner.scanBatch(files)
  }

  /**
   * 触发文件选择
   */
  selectFile(): void {
    this.fileInput.nativeElement.click()
  }

  /**
   * 更新扫描器选项
   */
  updateOptions(options: Partial<ScannerOptions>): void {
    if (this.scanner) {
      this.scanner.setOptions(options)
    }
  }
}
