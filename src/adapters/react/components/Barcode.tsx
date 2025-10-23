/**
 * React Barcode component
 */

import React, { useEffect } from 'react';
import { BarcodeConfig, BarcodeFormat, RenderType } from '../../../types';
import { useBarcode } from '../hooks/useBarcode';

export interface BarcodeProps {
  content: string;
  format?: BarcodeFormat;
  width?: number;
  height?: number;
  displayValue?: boolean;
  background?: string;
  foreground?: string;
  renderType?: RenderType;
  margin?: number;
  fontSize?: number;
  onGenerated?: () => void;
  onError?: (error: Error) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Barcode Component
 */
export const Barcode: React.FC<BarcodeProps> = ({
  content,
  format = BarcodeFormat.CODE128,
  width = 200,
  height = 100,
  displayValue = true,
  background = '#ffffff',
  foreground = '#000000',
  renderType = 'canvas',
  margin = 10,
  fontSize = 14,
  onGenerated,
  onError,
  className,
  style,
}) => {
  const config: BarcodeConfig = {
    content,
    format,
    width,
    height,
    displayValue,
    background,
    foreground,
    renderType,
    margin,
    fontSize,
  };

  const { containerRef, error, isLoading } = useBarcode(config);

  // Handle callbacks
  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  useEffect(() => {
    if (!isLoading && !error && onGenerated) {
      onGenerated();
    }
  }, [isLoading, error, onGenerated]);

  return (
    <div
      ref={containerRef}
      className={`barcode-container ${isLoading ? 'barcode-loading' : ''} ${className || ''}`}
      style={style}
    >
      {error && (
        <div className="barcode-error" style={errorStyle}>
          {error.message}
        </div>
      )}
    </div>
  );
};

const errorStyle: React.CSSProperties = {
  color: '#f56c6c',
  fontSize: '12px',
  padding: '4px 8px',
  background: '#fef0f0',
  borderRadius: '4px',
};

export default Barcode;

