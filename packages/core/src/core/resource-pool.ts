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
  private inUse: WeakSet<HTMLCanvasElement> = new WeakSet();
  private lastCleanup: number = Date.now();
  private cleanupInterval: number = 5 * 60 * 1000; // 5 minutes

  constructor(maxSize: number = 10) {
    this.maxSize = maxSize;
  }

  /**
   * Acquire a canvas from the pool
   */
  acquire(width: number, height: number): HTMLCanvasElement {
    // Periodic cleanup
    if (Date.now() - this.lastCleanup > this.cleanupInterval) {
      this.periodicCleanup();
    }
    
    let canvas = this.pool.pop();

    if (!canvas) {
      canvas = document.createElement('canvas');
      this.created++;
    }

    // Resize canvas
    canvas.width = width;
    canvas.height = height;
    
    // Track canvas in use
    this.inUse.add(canvas);

    return canvas;
  }

  /**
   * Release canvas back to the pool
   */
  release(canvas: HTMLCanvasElement): void {
    if (this.pool.length < this.maxSize) {
      // Clear canvas properly
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Reset transform
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }

      this.pool.push(canvas);
    } else {
      // Free memory if pool is full
      canvas.width = 0;
      canvas.height = 0;
    }
  }

  /**
   * Clear the pool
   */
  clear(): void {
    // Free memory of all pooled canvases
    for (const canvas of this.pool) {
      canvas.width = 0;
      canvas.height = 0;
    }
    this.pool = [];
  }

  /**
   * Periodic cleanup to prevent memory leaks
   */
  private periodicCleanup(): void {
    // Keep only half of max size during cleanup
    const targetSize = Math.floor(this.maxSize / 2);
    if (this.pool.length > targetSize) {
      const toRemove = this.pool.splice(targetSize);
      for (const canvas of toRemove) {
        canvas.width = 0;
        canvas.height = 0;
      }
    }
    this.lastCleanup = Date.now();
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

  /**
   * Destroy pool and free all resources
   */
  destroy(): void {
    this.clear();
    this.created = 0;
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
    globalCanvasPool.destroy();
    globalCanvasPool = null;
  }
}


