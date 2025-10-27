/**
 * React BarcodeScanner component
 */

import React, { useRef, useState, ChangeEvent } from 'react';
import { BarcodeFormat, ScannerOptions, ScanResult } from '../../../types';
import { useBarcodeScanner } from '../hooks/useBarcodeScanner';

export interface BarcodeScannerProps {
  formats?: BarcodeFormat[];
  preprocess?: boolean;
  maxAttempts?: number;
  multiple?: boolean;
  onScan?: (results: ScanResult[]) => void;
  onError?: (error: Error) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * BarcodeScanner Component
 */
export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  formats,
  preprocess = true,
  maxAttempts = 3,
  multiple = false,
  onScan,
  onError,
  className,
  style,
}) => {
  const options: ScannerOptions = {
    formats,
    preprocess,
    maxAttempts,
  };

  const { results, isScanning, error, scanFile, scanBatch } = useBarcodeScanner(options);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  /**
   * Trigger file input
   */
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  /**
   * Handle file change
   */
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    // Create preview
    if (files.length === 1) {
      setPreviewUrl(URL.createObjectURL(files[0]));
    }

    try {
      if (files.length === 1) {
        const scanResults = await scanFile(files[0]);
        onScan?.(scanResults);
      } else {
        const batchResults = await scanBatch(files);
        // Flatten batch results
        const allResults = batchResults.flatMap(br => br.results);
        onScan?.(allResults);
      }
    } catch (err) {
      onError?.(err as Error);
    }
  };

  /**
   * Cleanup preview URL
   */
  const cleanupPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className={`barcode-scanner ${className || ''}`} style={{ ...defaultStyle, ...style }}>
      <div style={inputContainerStyle}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileChange}
          style={fileInputStyle}
        />
        <button
          onClick={triggerFileInput}
          disabled={isScanning}
          style={buttonStyle(isScanning)}
        >
          {isScanning ? 'Scanning...' : 'Select Image'}
        </button>
      </div>

      {previewUrl && (
        <div style={previewContainerStyle}>
          <img src={previewUrl} alt="Preview" style={previewImageStyle} />
        </div>
      )}

      {isScanning && (
        <div style={loadingStyle}>
          <div style={spinnerStyle}></div>
          <span>Scanning barcode...</span>
        </div>
      )}

      {error && (
        <div style={errorStyle}>
          {error.message}
        </div>
      )}

      {results.length > 0 && (
        <div style={resultsStyle}>
          <h3 style={resultsTitleStyle}>Scan Results:</h3>
          {results.map((result, index) => (
            <div key={index} style={resultItemStyle}>
              <div style={resultFormatStyle}>{result.format}</div>
              <div style={resultDataStyle}>{result.data}</div>
              <div style={resultConfidenceStyle}>
                Confidence: {(result.confidence * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Styles
const defaultStyle: React.CSSProperties = {
  padding: '16px',
  border: '1px solid #dcdfe6',
  borderRadius: '4px',
};

const inputContainerStyle: React.CSSProperties = {
  marginBottom: '16px',
};

const fileInputStyle: React.CSSProperties = {
  display: 'none',
};

const buttonStyle = (disabled: boolean): React.CSSProperties => ({
  padding: '8px 16px',
  background: disabled ? '#a0cfff' : '#409eff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontSize: '14px',
});

const previewContainerStyle: React.CSSProperties = {
  marginBottom: '16px',
};

const previewImageStyle: React.CSSProperties = {
  maxWidth: '100%',
  maxHeight: '300px',
  border: '1px solid #dcdfe6',
  borderRadius: '4px',
};

const loadingStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px',
  background: '#f4f4f5',
  borderRadius: '4px',
};

const spinnerStyle: React.CSSProperties = {
  width: '16px',
  height: '16px',
  border: '2px solid #409eff',
  borderTopColor: 'transparent',
  borderRadius: '50%',
  animation: 'spin 0.6s linear infinite',
};

const errorStyle: React.CSSProperties = {
  padding: '12px',
  background: '#fef0f0',
  color: '#f56c6c',
  borderRadius: '4px',
  marginBottom: '16px',
};

const resultsStyle: React.CSSProperties = {
  marginTop: '16px',
};

const resultsTitleStyle: React.CSSProperties = {
  margin: '0 0 12px 0',
  fontSize: '16px',
  color: '#303133',
};

const resultItemStyle: React.CSSProperties = {
  padding: '12px',
  background: '#f4f4f5',
  borderRadius: '4px',
  marginBottom: '8px',
};

const resultFormatStyle: React.CSSProperties = {
  fontWeight: 600,
  color: '#409eff',
  marginBottom: '4px',
};

const resultDataStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '14px',
  marginBottom: '4px',
};

const resultConfidenceStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#909399',
};

export default BarcodeScanner;

