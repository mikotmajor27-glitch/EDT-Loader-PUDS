import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { AdvanceBookingProvider } from './context/AdvanceBookingContext';
import { BookingTerminalProvider } from './context/BookingTerminalContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'PUDS Demo Wallet · Ang Wallet sa Balat',
  description: 'Interactive PUDS demo wallet with simulated PHP balances, recipient transfers, single-use terminal codes, and persistent demo history.'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f7f8f3',
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
        <Analytics />
      </body>
    </html>
  );
}
