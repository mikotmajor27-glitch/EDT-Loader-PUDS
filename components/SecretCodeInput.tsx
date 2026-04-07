'use client';

import { useState } from 'react';
import { isValidSecretCodeFormat } from '@/lib/bookingUtils';

interface SecretCodeInputProps {
  onSubmit: (code: string) => void;
  maxAttempts?: number;
  attemptsRemaining?: number;
  isLoading?: boolean;
  disabled?: boolean;
}

export function SecretCodeInput({
  onSubmit,
  maxAttempts = 3,
  attemptsRemaining = 3,
  isLoading = false,
  disabled = false,
}: SecretCodeInputProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleNumberClick = (num: string) => {
    if (code.length < 4 && !disabled) {
      const newCode = code + num;
      setCode(newCode);
      setError('');
    }
  };

  const handleClear = () => {
    setCode('');
    setError('');
  };

  const handleSubmit = () => {
    if (!isValidSecretCodeFormat(code)) {
      setError('Please enter a 4-digit code');
      return;
    }
    onSubmit(code);
    setCode('');
  };

  const handleBackspace = () => {
    setCode(code.slice(0, -1));
    setError('');
  };

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm">
      {/* Code Display */}
      <div className="flex gap-3">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className="w-16 h-16 flex items-center justify-center bg-gray-100 border-2 border-gray-300 rounded-lg text-2xl font-bold"
          >
            {code[index] ? '●' : ''}
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-sm font-medium text-center">{error}</div>
      )}

      {/* Attempts Remaining */}
      {attemptsRemaining < maxAttempts && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Attempts remaining: <span className="font-bold">{attemptsRemaining}</span>
          </p>
        </div>
      )}

      {/* Numeric Keypad */}
      <div className="w-full grid grid-cols-3 gap-3">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            disabled={disabled || code.length >= 4 || isLoading}
            className="h-16 bg-blue-600 text-white text-xl font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-95"
          >
            {num}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="w-full grid grid-cols-2 gap-3">
        <button
          onClick={handleBackspace}
          disabled={disabled || code.length === 0 || isLoading}
          className="py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          ← Back
        </button>
        <button
          onClick={handleClear}
          disabled={disabled || code.length === 0 || isLoading}
          className="py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Clear
        </button>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={disabled || code.length < 4 || isLoading}
        className="w-full py-4 bg-green-600 text-white text-lg font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isLoading ? 'Verifying...' : 'Verify Code'}
      </button>
    </div>
  );
}
