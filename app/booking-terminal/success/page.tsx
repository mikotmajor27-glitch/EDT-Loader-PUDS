'use client';

import { useRouter } from 'next/navigation';
import { useBookingTerminal } from '@/app/context/BookingTerminalContext';
import { useAdvanceBooking } from '@/app/context/AdvanceBookingContext';
import { TerminalHeader } from '@/components/TerminalHeader';
import { BookingDetailsCard } from '@/components/BookingDetailsCard';
import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  const router = useRouter();
  const { session, resetSession } = useBookingTerminal();
  const { getBookingById } = useAdvanceBooking();
  const [countdown, setCountdown] = useState(10);

  const booking = session.selectedBooking ? getBookingById(session.selectedBooking.id) : null;

  useEffect(() => {
    // Auto-redirect after 10 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          resetSession();
          router.push('/booking-terminal');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resetSession, router]);

  if (!booking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-50">
      <TerminalHeader
        merchantName={booking.merchantName}
        merchantLocation={booking.merchantLocation}
      />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-24 h-24 text-green-600 animate-bounce" />
          </div>
          <h1 className="text-5xl font-bold text-green-600 mb-2">Pickup Complete!</h1>
          <p className="text-xl text-gray-600">Thank you for using PUDS Terminal</p>
        </div>

        {/* Order Details */}
        <div className="flex justify-center mb-12">
          <BookingDetailsCard booking={booking} />
        </div>

        {/* Receipt-like Summary */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-8 mb-8 shadow-lg max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Pickup Receipt</h2>

          <div className="space-y-4 border-b-2 border-gray-200 pb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Booking ID:</span>
              <span className="font-mono font-bold text-gray-900">{booking.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">PUDS ID:</span>
              <span className="font-mono font-bold text-gray-900">{booking.pudsId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Merchant:</span>
              <span className="font-bold text-gray-900">{booking.merchantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-bold text-gray-900">{booking.merchantLocation}</span>
            </div>
          </div>

          <div className="pt-6">
            <div className="flex justify-between text-lg font-bold text-gray-900 mb-2">
              <span>Total Amount:</span>
              <span>₱{booking.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Picked up at:</span>
              <span>
                {new Date().toLocaleString('en-PH', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-8 text-center mb-8">
          <h3 className="text-2xl font-bold text-blue-900 mb-3">Thank You!</h3>
          <p className="text-blue-800 mb-4">
            Your order has been successfully picked up. We hope you enjoy your purchase!
          </p>
          <p className="text-blue-700 text-sm">
            This terminal will reset in <span className="font-bold text-lg">{countdown}</span> seconds...
          </p>
        </div>

        {/* Manual Reset Button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              resetSession();
              router.push('/booking-terminal');
            }}
            className="terminal-button"
          >
            Back to Home
          </button>
        </div>
      </main>
    </div>
  );
}
