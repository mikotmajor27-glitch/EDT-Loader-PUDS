'use client';

import { Clock, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TerminalHeaderProps {
  merchantName?: string;
  merchantLocation?: string;
  showHomeButton?: boolean;
}

export function TerminalHeader({
  merchantName = 'PUDS Terminal',
  merchantLocation = '',
  showHomeButton = true,
}: TerminalHeaderProps) {
  const router = useRouter();
  const currentTime = new Date().toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left Side - Merchant Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{merchantName}</h1>
          {merchantLocation && (
            <p className="text-blue-100 text-sm mt-1">{merchantLocation}</p>
          )}
        </div>

        {/* Center - Time and Terminal ID */}
        <div className="flex items-center gap-4 text-sm text-blue-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="font-mono">{currentTime}</span>
          </div>
          <div className="text-xs bg-blue-700 px-2 py-1 rounded">Terminal ID: T001</div>
        </div>

        {/* Right Side - Home Button */}
        {showHomeButton && (
          <button
            onClick={() => router.push('/booking-terminal')}
            className="ml-4 flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
        )}
      </div>
    </div>
  );
}
