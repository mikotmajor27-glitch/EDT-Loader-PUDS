'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">PUDS Terminal</h1>
        <p className="text-2xl text-blue-100 mb-8">
          Philippine Unified Distributed System
        </p>
        <p className="text-lg text-blue-200 mb-12 max-w-2xl">
          Advance Booking Pickup Terminal - Fast, Secure & Easy Order Management
        </p>

        <button
          onClick={() => router.push('/booking-terminal')}
          className="px-12 py-4 bg-white text-blue-600 text-xl font-bold rounded-lg hover:bg-blue-50 transition transform hover:scale-105 active:scale-95 shadow-lg"
        >
          Access Terminal
        </button>

        <div className="mt-12 text-blue-200 text-sm">
          <p>© 2026 PUDS System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
