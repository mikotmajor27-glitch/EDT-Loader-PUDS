'use client';

import { useRouter } from 'next/navigation';
import { TerminalHeader } from '@/components/TerminalHeader';
import { useBookingTerminal } from '@/app/context/BookingTerminalContext';
import { useEffect } from 'react';
import { Smartphone, Fingerprint, Lock } from 'lucide-react';

export default function BookingTerminalWelcome() {
  const router = useRouter();
  const { resetSession } = useBookingTerminal();

  useEffect(() => {
    // Reset session when arriving at welcome page
    resetSession();
  }, [resetSession]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <TerminalHeader merchantName="PUDS Terminal" showHomeButton={false} />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to PUDS Terminal</h1>
          <p className="text-xl text-gray-600">
            Advance Booking Pickup - Fast, Secure & Easy
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Feature 1 */}
          <div className="terminal-card text-center">
            <div className="flex justify-center mb-4">
              <Smartphone className="w-16 h-16 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Quick Booking</h3>
            <p className="text-gray-600">
              Pre-book your order through PUDS app and pick it up at your convenience
            </p>
          </div>

          {/* Feature 2 */}
          <div className="terminal-card text-center">
            <div className="flex justify-center mb-4">
              <Fingerprint className="w-16 h-16 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Biometric Security</h3>
            <p className="text-gray-600">
              Your fingerprint and secret code ensure only you can claim your order
            </p>
          </div>

          {/* Feature 3 */}
          <div className="terminal-card text-center">
            <div className="flex justify-center mb-4">
              <Lock className="w-16 h-16 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              Your personal and booking information is protected with advanced security
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="terminal-card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <ol className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </span>
              <span>Book your order in advance through the PUDS app</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </span>
              <span>Arrive at the store and tap the PUDS terminal</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </span>
              <span>Scan your fingerprint when prompted</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </span>
              <span>Enter your 4-digit secret code to verify</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                5
              </span>
              <span>Confirm pickup and collect your order from the counter</span>
            </li>
          </ol>
        </div>

        {/* Start Button */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.push('/booking-terminal/authenticate')}
            className="terminal-button-lg"
          >
            Start Pickup Process
          </button>
        </div>

        {/* Demo Info */}
        <div className="mt-12 bg-amber-50 border-2 border-amber-300 rounded-xl p-6 text-center">
          <p className="text-amber-900 font-semibold mb-2">Demo Mode Active</p>
          <p className="text-amber-800 text-sm mb-3">
            This is a demonstration of the advance booking terminal system.
          </p>
          <p className="text-amber-800 text-sm">
            Test PUDS IDs: <strong>PUDS-12345</strong> or <strong>PUDS-67890</strong>
            <br />
            Test Secret Codes: <strong>1234</strong>, <strong>5678</strong>, or <strong>9012</strong>
          </p>
        </div>
      </main>
    </div>
  );
}
