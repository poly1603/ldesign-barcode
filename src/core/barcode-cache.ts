/**
 * Barcode caching layer for performance optimization
 */

import { BarcodeConfig, EncodedBarcode } from '../types';

interface CacheEntry {
  encoded: EncodedBarcode;
  timestamp: number;
  hits: number;
}

/**
 * Cache key generator
 */
function getCacheKey(config: Pick<BarcodeConfig, 'content' | 'format'>): string {
  return `${config.format || 'AUTO'}:${config.content}`;
}

/**
 * Barcode Cache
 */
export class BarcodeCache {
  private cache: Map<string, CacheEntry> = new Map();
  private maxSize: number;
  private maxAge: number; // in milliseconds

  constructor(options: { maxSize?: number; maxAge?: number } = {}) {
    this.maxSize = options.maxSize || 100;
    this.maxAge = options.maxAge || 5 * 60 * 1000; // 5 minutes default
  }

  /**
   * Get cached encoded barcode
   */
  get(config: Pick<BarcodeConfig, 'content' | 'format'>): EncodedBarcode | null {
    const key = getCacheKey(config);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if cache entry is expired
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    // Update hit count and return
    entry.hits++;
    return entry.encoded;
  }

  /**
   * Set cached encoded barcode
   */
  set(config: Pick<BarcodeConfig, 'content' | 'format'>, encoded: EncodedBarcode): void {
    const key = getCacheKey(config);

    // Evict old entries if cache is full
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLeastUsed();
    }

    this.cache.set(key, {
      encoded,
      timestamp: Date.now(),
      hits: 0,
    });
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; maxSize: number; hitRate: number } {
    let totalHits = 0;
    let totalAccess = 0;

    for (const entry of this.cache.values()) {
      totalHits += entry.hits;
      totalAccess += entry.hits + 1; // +1 for initial set
    }

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: totalAccess > 0 ? totalHits / totalAccess : 0,
    };
  }

  /**
   * Evict least recently used/least frequently used entry
   */
  private evictLeastUsed(): void {
    let minHits = Infinity;
    let oldestTime = Infinity;
    let evictKey: string | null = null;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.hits < minHits || (entry.hits === minHits && entry.timestamp < oldestTime)) {
        minHits = entry.hits;
        oldestTime = entry.timestamp;
        evictKey = key;
      }
    }

    if (evictKey) {
      this.cache.delete(evictKey);
    }
  }

  /**
   * Cleanup expired entries
   */
  cleanup(): number {
    const now = Date.now();
    let deleted = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.maxAge) {
        this.cache.delete(key);
        deleted++;
      }
    }

    return deleted;
  }
}

// Global cache instance
let globalCache: BarcodeCache | null = null;

/**
 * Get or create global cache instance
 */
export function getGlobalCache(): BarcodeCache {
  if (!globalCache) {
    globalCache = new BarcodeCache();
  }
  return globalCache;
}

/**
 * Configure global cache
 */
export function configureGlobalCache(options: { maxSize?: number; maxAge?: number }): void {
  globalCache = new BarcodeCache(options);
}

/**
 * Disable global cache
 */
export function disableGlobalCache(): void {
  globalCache = null;
}


