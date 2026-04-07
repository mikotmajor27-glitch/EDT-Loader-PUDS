import type { Metadata } from 'next';
import { AdvanceBookingProvider } from './context/AdvanceBookingContext';
import { BookingTerminalProvider } from './context/BookingTerminalContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'PUDS Advance Booking Terminal',
  description: 'Philippine Unified Distributed System - Advance Booking Terminal Pickup',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AdvanceBookingProvider>
          <BookingTerminalProvider>
            {children}
          </BookingTerminalProvider>
        </AdvanceBookingProvider>
      </body>
    </html>
  );
}
