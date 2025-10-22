/**
 * @ldesign/barcode - 条形码/二维码
 */
export class BarcodeGenerator {
  generate(data: string, type: string = 'code128') { console.info('Barcode:', data, type); return data }
}
export function createBarcode() { return new BarcodeGenerator() }

