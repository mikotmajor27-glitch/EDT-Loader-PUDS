import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { AdvanceBookingProvider } from './context/AdvanceBookingContext';
import { BookingTerminalProvider } from './context/BookingTerminalContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'PUDS: Ang Wallet sa Balat',
  description: 'Isang wallet para sa araw-araw. Send, receive, mag-load sa parehong SIM, at magbayad sa PUDS Terminal.',
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
