/**
 * Performance monitoring utilities
 */

export interface PerformanceMetrics {
  operation: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface PerformanceReport {
  totalOperations: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  operations: Map<string, {
    count: number;
    totalDuration: number;
    averageDuration: number;
    minDuration: number;
    maxDuration: number;
  }>;
}

/**
 * Performance Monitor
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private enabled: boolean = false;
  private maxMetrics: number;

  constructor(options: { enabled?: boolean; maxMetrics?: number } = {}) {
    this.enabled = options.enabled ?? false;
    this.maxMetrics = options.maxMetrics ?? 1000;
  }

  /**
   * Enable monitoring
   */
  enable(): void {
    this.enabled = true;
  }

  /**
   * Disable monitoring
   */
  disable(): void {
    this.enabled = false;
  }

  /**
   * Record a metric
   */
  record(operation: string, duration: number, metadata?: Record<string, any>): void {
    if (!this.enabled) return;

    this.metrics.push({
      operation,
      duration,
      timestamp: Date.now(),
      metadata,
    });

    // Trim old metrics if exceeded max
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  /**
   * Measure and record an operation
   */
  async measure<T>(
    operation: string,
    fn: () => T | Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const start = performance.now();

    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.record(operation, duration, metadata);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.record(operation, duration, { ...metadata, error: true });
      throw error;
    }
  }

  /**
   * Get performance report
   */
  getReport(): PerformanceReport {
    const operationStats = new Map<string, {
      count: number;
      totalDuration: number;
      averageDuration: number;
      minDuration: number;
      maxDuration: number;
    }>();

    let totalDuration = 0;
    let minDuration = Infinity;
    let maxDuration = 0;

    for (const metric of this.metrics) {
      totalDuration += metric.duration;
      minDuration = Math.min(minDuration, metric.duration);
      maxDuration = Math.max(maxDuration, metric.duration);

      const stat = operationStats.get(metric.operation) || {
        count: 0,
        totalDuration: 0,
        averageDuration: 0,
        minDuration: Infinity,
        maxDuration: 0,
      };

      stat.count++;
      stat.totalDuration += metric.duration;
      stat.minDuration = Math.min(stat.minDuration, metric.duration);
      stat.maxDuration = Math.max(stat.maxDuration, metric.duration);
      stat.averageDuration = stat.totalDuration / stat.count;

      operationStats.set(metric.operation, stat);
    }

    return {
      totalOperations: this.metrics.length,
      averageDuration: this.metrics.length > 0 ? totalDuration / this.metrics.length : 0,
      minDuration: minDuration === Infinity ? 0 : minDuration,
      maxDuration,
      operations: operationStats,
    };
  }

  /**
   * Get raw metrics
   */
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * Get recent metrics
   */
  getRecent(count: number): PerformanceMetrics[] {
    return this.metrics.slice(-count);
  }
}

// Global monitor instance
let globalMonitor: PerformanceMonitor | null = null;

/**
 * Get or create global monitor
 */
export function getGlobalMonitor(): PerformanceMonitor {
  if (!globalMonitor) {
    globalMonitor = new PerformanceMonitor();
  }
  return globalMonitor;
}

/**
 * Configure global monitor
 */
export function configureGlobalMonitor(options: { enabled?: boolean; maxMetrics?: number }): void {
  globalMonitor = new PerformanceMonitor(options);
}

/**
 * Quick measure function using global monitor
 */
export async function measure<T>(
  operation: string,
  fn: () => T | Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  return getGlobalMonitor().measure(operation, fn, metadata);
}


