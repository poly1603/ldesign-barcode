/**
 * Image preprocessor for barcode scanning
 */

/**
 * Image Preprocessor
 */
export class ImagePreprocessor {
  /**
   * Convert image to grayscale
   */
  static toGrayscale(imageData: ImageData): ImageData {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }
    return imageData;
  }

  /**
   * Enhance contrast
   */
  static enhanceContrast(imageData: ImageData, factor: number = 1.5): ImageData {
    const data = imageData.data;
    const contrast = (factor - 1) * 255;
    const factorCalc = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for (let i = 0; i < data.length; i += 4) {
      data[i] = factorCalc * (data[i] - 128) + 128;
      data[i + 1] = factorCalc * (data[i + 1] - 128) + 128;
      data[i + 2] = factorCalc * (data[i + 2] - 128) + 128;
    }

    return imageData;
  }

  /**
   * Apply threshold (binarization)
   */
  static threshold(imageData: ImageData, threshold: number = 128): ImageData {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const value = data[i] > threshold ? 255 : 0;
      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value;
    }
    return imageData;
  }

  /**
   * Load image from File
   */
  static loadFromFile(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Convert image to ImageData
   */
  static imageToImageData(image: HTMLImageElement): ImageData {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    ctx.drawImage(image, 0, 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  /**
   * Preprocess image for scanning
   */
  static preprocess(imageData: ImageData): ImageData {
    let processed = imageData;
    processed = this.toGrayscale(processed);
    processed = this.enhanceContrast(processed, 1.3);
    return processed;
  }

  /**
   * Rotate image by angle
   */
  static rotate(imageData: ImageData, angle: number): ImageData {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    const rad = (angle * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad));
    const cos = Math.abs(Math.cos(rad));

    const newWidth = imageData.width * cos + imageData.height * sin;
    const newHeight = imageData.width * sin + imageData.height * cos;

    canvas.width = newWidth;
    canvas.height = newHeight;

    ctx.translate(newWidth / 2, newHeight / 2);
    ctx.rotate(rad);
    ctx.drawImage(
      this.imageDataToCanvas(imageData),
      -imageData.width / 2,
      -imageData.height / 2
    );

    return ctx.getImageData(0, 0, newWidth, newHeight);
  }

  /**
   * Convert ImageData to canvas
   */
  private static imageDataToCanvas(imageData: ImageData): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.putImageData(imageData, 0, 0);
    }
    return canvas;
  }
}

