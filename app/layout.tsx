import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PUDS - Philippine Universal Data Slot',
  description: 'Buy mobile data for Smart, Globe, or DITO from one place. Fast, affordable, and reliable.',
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
        {children}
      </body>
    </html>
  );
}
