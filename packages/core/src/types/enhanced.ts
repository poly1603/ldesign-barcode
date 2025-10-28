/**
 * Enhanced Type Definitions
 * 补充和完善的类型定义，用于简化的API
 */

/**
 * 条形码格式（字符串联合类型）
 */
export type BarcodeFormat =
  | 'ean13'
  | 'ean8'
  | 'upca'
  | 'upce'
  | 'code128'
  | 'code39'
  | 'code93'
  | 'itf14'
  | 'codabar';

/**
 * 渲染类型
 */
export type RenderType = 'canvas' | 'svg';

/**
 * 文本对齐
 */
export type TextAlign = 'left' | 'center' | 'right';

/**
 * 文本位置
 */
export type TextPosition = 'top' | 'bottom';

/**
 * 生成选项
 */
export interface GenerateOptions {
  /** 条形码格式 */
  format: BarcodeFormat;
  
  /** 宽度（像素） */
  width?: number;
  
  /** 高度（像素） */
  height?: number;
  
  /** 是否显示文本 */
  displayValue?: boolean;
  
  /** 字体大小 */
  fontSize?: number;
  
  /** 字体族 */
  fontFamily?: string;
  
  /** 文本对齐 */
  textAlign?: TextAlign;
  
  /** 文本位置 */
  textPosition?: TextPosition;
  
  /** 边距 */
  margin?: number;
  
  /** 上边距 */
  marginTop?: number;
  
  /** 下边距 */
  marginBottom?: number;
  
  /** 左边距 */
  marginLeft?: number;
  
  /** 右边距 */
  marginRight?: number;
  
  /** 背景色 */
  background?: string;
  
  /** 线条颜色 */
  lineColor?: string;
  
  /** 渲染类型 */
  renderType?: RenderType;
}

/**
 * 生成结果
 */
export interface GenerateResult {
  /** 是否成功 */
  success: boolean;
  
  /** 生成的元素 */
  element?: HTMLCanvasElement | SVGElement;
  
  /** Data URL（可选） */
  dataUrl?: string;
  
  /** 错误信息 */
  error?: string;
}

/**
 * 扫描选项
 */
export interface ScanOptions {
  /** 要扫描的格式列表 */
  formats?: BarcodeFormat[];
  
  /** 是否尝试更努力地扫描 */
  tryHarder?: boolean;
  
  /** 是否支持多个条形码 */
  multiple?: boolean;
}

/**
 * 扫描数据
 */
export interface ScanData {
  /** 条形码文本 */
  text: string;
  
  /** 条形码格式 */
  format?: BarcodeFormat;
  
  /** 质量/置信度 (0-1) */
  quality?: number;
  
  /** 边界框 */
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  
  /** 原始数据 */
  rawData?: Uint8Array;
}

/**
 * 扫描结果
 */
export interface ScanResult {
  /** 是否成功 */
  success: boolean;
  
  /** 扫描数据 */
  data?: ScanData;
  
  /** 错误信息 */
  error?: string;
}

/**
 * 批量生成配置
 */
export interface BatchGenerateConfig {
  /** 条形码数据列表 */
  items: Array<{
    value: string;
    options?: GenerateOptions;
  }>;
  
  /** 并发数 */
  concurrency?: number;
  
  /** 进度回调 */
  onProgress?: (current: number, total: number) => void;
}

/**
 * 批量生成结果
 */
export interface BatchGenerateResult {
  /** 成功数量 */
  successCount: number;
  
  /** 失败数量 */
  failureCount: number;
  
  /** 详细结果 */
  results: GenerateResult[];
  
  /** 总耗时（毫秒） */
  duration: number;
}

/**
 * 性能指标
 */
export interface PerformanceMetrics {
  /** 操作名称 */
  name: string;
  
  /** 开始时间 */
  startTime: number;
  
  /** 结束时间 */
  endTime: number;
  
  /** 持续时间（毫秒） */
  duration: number;
  
  /** 内存使用（字节） */
  memoryUsed?: number;
}

/**
 * 验证结果
 */
export interface ValidationResult {
  /** 是否有效 */
  valid: boolean;
  
  /** 错误信息 */
  errors?: string[];
  
  /** 警告信息 */
  warnings?: string[];
}

/**
 * 缓存选项
 */
export interface CacheOptions {
  /** 是否启用缓存 */
  enabled?: boolean;
  
  /** 最大缓存数量 */
  maxSize?: number;
  
  /** 缓存过期时间（毫秒） */
  ttl?: number;
}

/**
 * 导出选项
 */
export interface ExportOptions {
  /** 文件名 */
  filename?: string;
  
  /** 文件格式 */
  format?: 'png' | 'jpeg' | 'svg' | 'webp';
  
  /** 图片质量 (0-1) */
  quality?: number;
  
  /** 是否自动下载 */
  autoDownload?: boolean;
}
