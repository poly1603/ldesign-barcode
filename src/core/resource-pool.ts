/**
 * Resource pool for Canvas element reuse
 */

/**
 * Canvas Pool for reusing canvas elements
 */
export class CanvasPool {
  private pool: HTMLCanvasElement[] = [];
  private maxSize: number;
  private created: number = 0;

  constructor(maxSize: number = 10) {
    this.maxSize = maxSize;
  }

  /**
   * Acquire a canvas from the pool
   */
  acquire(width: number, height: number): HTMLCanvasElement {
    let canvas = this.pool.pop();

    if (!canvas) {
      canvas = document.createElement('canvas');
      this.created++;
    }

    // Resize canvas
    canvas.width = width;
    canvas.height = height;

    return canvas;
  }

  /**
   * Release canvas back to the pool
   */
  release(canvas: HTMLCanvasElement): void {
    if (this.pool.length < this.maxSize) {
      // Clear canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      this.pool.push(canvas);
    }
  }

  /**
   * Clear the pool
   */
  clear(): void {
    this.pool = [];
  }

  /**
   * Get pool statistics
   */
  getStats(): { poolSize: number; maxSize: number; totalCreated: number } {
    return {
      poolSize: this.pool.length,
      maxSize: this.maxSize,
      totalCreated: this.created,
    };
  }
}

// Global canvas pool
let globalCanvasPool: CanvasPool | null = null;

/**
 * Get or create global canvas pool
 */
export function getGlobalCanvasPool(): CanvasPool {
  if (!globalCanvasPool) {
    globalCanvasPool = new CanvasPool();
  }
  return globalCanvasPool;
}

/**
 * Configure global canvas pool
 */
export function configureGlobalCanvasPool(maxSize: number): void {
  globalCanvasPool = new CanvasPool(maxSize);
}

/**
 * Disable global canvas pool
 */
export function disableGlobalCanvasPool(): void {
  if (globalCanvasPool) {
    globalCanvasPool.clear();
    globalCanvasPool = null;
  }
}


