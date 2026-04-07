'use client';

import { useState, useEffect } from 'react';
import { Fingerprint, CheckCircle, AlertCircle } from 'lucide-react';

interface BiometricInputProps {
  onScanComplete: (success: boolean) => void;
  isLoading?: boolean;
}

export function BiometricInput({ onScanComplete, isLoading = false }: BiometricInputProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            return 100;
          }
          return prev + Math.random() * 30;
        });
      }, 300);

      const timer = setTimeout(() => {
        setScanProgress(100);
        setScanStatus('success');
        setIsScanning(false);
        setTimeout(() => onScanComplete(true), 800);
      }, 2000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [isScanning, onScanComplete]);

  const handleStartScan = () => {
    setScanStatus('scanning');
    setScanProgress(0);
    setIsScanning(true);
  };

  const handleReset = () => {
    setScanStatus('idle');
    setScanProgress(0);
    setIsScanning(false);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Fingerprint Scanner Animation */}
      <div className="relative w-32 h-32">
        {/* Outer circle */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-300" />

        {/* Animated scan rings */}
        {isScanning && (
          <>
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin"
              style={{ animation: 'spin 2s linear' }}
            />
            <div
              className="absolute inset-4 rounded-full border-4 border-transparent border-b-blue-400"
              style={{
                animation: 'spin 3s linear reverse',
              }}
            />
          </>
        )}

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {scanStatus === 'idle' && (
            <Fingerprint className="w-12 h-12 text-gray-600" />
          )}
          {scanStatus === 'scanning' && (
            <div className="w-12 h-12 bg-blue-500 rounded-full animate-pulse" />
          )}
          {scanStatus === 'success' && (
            <CheckCircle className="w-16 h-16 text-green-500" />
          )}
          {scanStatus === 'error' && (
            <AlertCircle className="w-16 h-16 text-red-500" />
          )}
        </div>

        {/* Progress ring */}
        {isScanning && (
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#ddd"
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray={`${(scanProgress / 100) * 283} 283`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.3s' }}
            />
          </svg>
        )}
      </div>

      {/* Status Text */}
      <div className="text-center">
        {scanStatus === 'idle' && (
          <p className="text-lg font-medium text-gray-700">Ready to scan fingerprint</p>
        )}
        {scanStatus === 'scanning' && (
          <p className="text-lg font-medium text-blue-600">Scanning fingerprint...</p>
        )}
        {scanStatus === 'success' && (
          <p className="text-lg font-medium text-green-600">Fingerprint verified!</p>
        )}
        {scanStatus === 'error' && (
          <p className="text-lg font-medium text-red-600">Fingerprint not recognized</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        {scanStatus === 'idle' && (
          <button
            onClick={handleStartScan}
            disabled={isLoading}
            className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Start Scan
          </button>
        )}
        {(scanStatus === 'scanning' || scanStatus === 'success') && (
          <div className="text-center text-sm text-gray-600">
            {scanStatus === 'scanning' && 'Place your finger on the scanner...'}
            {scanStatus === 'success' && 'Continue to next step...'}
          </div>
        )}
        {scanStatus === 'error' && (
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
