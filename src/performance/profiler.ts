/**
 * Performance profiler for detailed analysis
 */

export interface ProfileEntry {
  label: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  children: ProfileEntry[];
  metadata?: Record<string, any>;
}

/**
 * Performance Profiler with hierarchical tracking
 */
export class PerformanceProfiler {
  private stack: ProfileEntry[] = [];
  private root: ProfileEntry | null = null;
  private enabled: boolean = false;

  constructor(enabled: boolean = false) {
    this.enabled = enabled;
  }

  /**
   * Enable profiling
   */
  enable(): void {
    this.enabled = true;
  }

  /**
   * Disable profiling
   */
  disable(): void {
    this.enabled = false;
  }

  /**
   * Start profiling a section
   */
  start(label: string, metadata?: Record<string, any>): void {
    if (!this.enabled) return;

    const entry: ProfileEntry = {
      label,
      startTime: performance.now(),
      children: [],
      metadata,
    };

    if (this.stack.length === 0) {
      this.root = entry;
    } else {
      const parent = this.stack[this.stack.length - 1];
      parent.children.push(entry);
    }

    this.stack.push(entry);
  }

  /**
   * End profiling current section
   */
  end(): void {
    if (!this.enabled || this.stack.length === 0) return;

    const entry = this.stack.pop()!;
    entry.endTime = performance.now();
    entry.duration = entry.endTime - entry.startTime;
  }

  /**
   * Get profiling results
   */
  getResults(): ProfileEntry | null {
    return this.root;
  }

  /**
   * Clear profiling data
   */
  clear(): void {
    this.stack = [];
    this.root = null;
  }

  /**
   * Format results as string
   */
  format(entry: ProfileEntry = this.root!, indent: number = 0): string {
    if (!entry) return '';

    const indentStr = '  '.repeat(indent);
    const duration = entry.duration?.toFixed(2) || '?';
    let output = `${indentStr}${entry.label}: ${duration}ms\n`;

    for (const child of entry.children) {
      output += this.format(child, indent + 1);
    }

    return output;
  }

  /**
   * Print results to console
   */
  print(): void {
    if (!this.root) {
      console.log('No profiling data available');
      return;
    }

    console.log('Performance Profile:');
    console.log(this.format());
  }
}

// Global profiler instance
let globalProfiler: PerformanceProfiler | null = null;

/**
 * Get or create global profiler
 */
export function getGlobalProfiler(): PerformanceProfiler {
  if (!globalProfiler) {
    globalProfiler = new PerformanceProfiler();
  }
  return globalProfiler;
}

/**
 * Configure global profiler
 */
export function configureGlobalProfiler(enabled: boolean): void {
  globalProfiler = new PerformanceProfiler(enabled);
}

/**
 * Profile a function using global profiler
 */
export async function profile<T>(
  label: string,
  fn: () => T | Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const profiler = getGlobalProfiler();
  profiler.start(label, metadata);

  try {
    const result = await fn();
    profiler.end();
    return result;
  } catch (error) {
    profiler.end();
    throw error;
  }
}


