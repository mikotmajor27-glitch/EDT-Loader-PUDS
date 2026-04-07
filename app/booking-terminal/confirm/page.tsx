'use client';

import { useRouter } from 'next/navigation';
import { useBookingTerminal } from '@/app/context/BookingTerminalContext';
import { useAdvanceBooking } from '@/app/context/AdvanceBookingContext';
import { TerminalHeader } from '@/components/TerminalHeader';
import { BookingDetailsCard } from '@/components/BookingDetailsCard';
import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function ConfirmPage() {
  const router = useRouter();
  const { session } = useBookingTerminal();
  const { updateBookingStatus } = useAdvanceBooking();

  useEffect(() => {
    // Redirect to authenticate if no booking is selected
    if (!session.selectedBooking) {
      router.push('/booking-terminal/authenticate');
    }
  }, [session.selectedBooking, router]);

  const handleCompletePickup = () => {
    if (session.selectedBooking) {
      // Update booking status to picked_up
      updateBookingStatus(session.selectedBooking.id, 'picked_up');
      // Navigate to success page
      router.push('/booking-terminal/success');
    }
  };

  const handleCancel = () => {
    router.push('/booking-terminal');
  };

  if (!session.selectedBooking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TerminalHeader
        merchantName={session.selectedBooking.merchantName}
        merchantLocation={session.selectedBooking.merchantLocation}
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Confirmation Message */}
        <div className="mb-8 bg-green-50 border-2 border-green-300 rounded-xl p-6">
          <div className="flex gap-3">
            <AlertCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-green-900">Identity Verified</h3>
              <p className="text-green-800 mt-1">
                Your booking has been confirmed. Your order is ready for pickup.
              </p>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Order Confirmation</h1>
          <p className="text-gray-600 mt-2">Please review your order details below</p>
        </div>

        {/* Booking Details */}
        <div className="flex justify-center mb-12">
          <BookingDetailsCard booking={session.selectedBooking} />
        </div>

        {/* Cashier Confirmation */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-blue-900 mb-2">For Cashier:</h3>
          <p className="text-blue-800">
            This customer&apos;s order is ready for handover. Please verify the booking ID{' '}
            <span className="font-mono font-bold">{session.selectedBooking.id}</span> and deliver the
            items listed above.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleCompletePickup}
            className="terminal-button-success"
          >
            Complete Pickup
          </button>
          <button
            onClick={handleCancel}
            className="terminal-button-danger"
          >
            Cancel
          </button>
        </div>
      </main>
    </div>
  );
}
