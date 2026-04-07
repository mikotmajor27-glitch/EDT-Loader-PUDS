'use client';

import { AdvanceBooking } from '@/app/context/AdvanceBookingContext';
import { formatAmount, getStatusBadge, calculateTotalItems } from '@/lib/bookingUtils';
import { Package, MapPin, Clock } from 'lucide-react';

interface BookingDetailsCardProps {
  booking: AdvanceBooking;
  showStatus?: boolean;
}

export function BookingDetailsCard({ booking, showStatus = true }: BookingDetailsCardProps) {
  const badge = getStatusBadge(booking.status);

  return (
    <div className="w-full max-w-2xl bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{booking.merchantName}</h2>
          <div className="flex items-center gap-2 text-gray-600 mt-1">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{booking.merchantLocation}</span>
          </div>
        </div>
        {showStatus && (
          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${badge.className}`}>
            {badge.text}
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
        </div>
        <div className="space-y-2 ml-7">
          {booking.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2">
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p className="text-right font-semibold text-gray-900">
                {formatAmount(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Total Items:</span>
          <span className="font-semibold text-gray-900">{calculateTotalItems(booking.items)}</span>
        </div>
        <div className="border-t border-blue-200 pt-2 flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
          <span className="text-2xl font-bold text-blue-600">
            {formatAmount(booking.totalAmount)}
          </span>
        </div>
      </div>

      {/* Booking Reference */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Booking ID:</span>
          <span className="font-mono font-semibold text-gray-900">{booking.id}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">PUDS ID:</span>
          <span className="font-mono font-semibold text-gray-900">{booking.pudsId}</span>
        </div>
        {booking.pickedUpAt && (
          <div className="flex items-center gap-2 text-sm text-green-600 pt-2">
            <Clock className="w-4 h-4" />
            <span>
              Picked up on{' '}
              {new Date(booking.pickedUpAt).toLocaleString('en-PH', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
