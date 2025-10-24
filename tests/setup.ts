/**
 * Vitest setup file
 */

import { beforeAll, afterEach, vi } from 'vitest';

// Mock browser APIs that might not be available in jsdom
beforeAll(() => {
  // Mock HTMLCanvasElement.toDataURL if needed
  if (!HTMLCanvasElement.prototype.toDataURL) {
    HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,mock');
  }

  // Mock OffscreenCanvas if not available
  if (typeof OffscreenCanvas === 'undefined') {
    global.OffscreenCanvas = class OffscreenCanvas {
      width: number;
      height: number;

      constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
      }

      getContext() {
        return {
          fillRect: vi.fn(),
          fillText: vi.fn(),
          clearRect: vi.fn(),
        };
      }

      convertToBlob() {
        return Promise.resolve(new Blob());
      }
    } as any;
  }
});

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
});


