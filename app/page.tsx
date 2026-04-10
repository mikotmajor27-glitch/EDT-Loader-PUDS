'use client';

import { useRouter } from 'next/navigation';
import { Wifi, Smartphone, Zap, Shield } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header with Status Bar Effect */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white pt-2 pb-6 px-4">
        <div className="max-w-md mx-auto">
          <p className="text-xs text-blue-200 mb-8 font-semibold tracking-wider">4:58  🔋 39%</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="text-4xl font-bold">
              <span className="text-red-500">P</span>
              <span className="text-blue-500">U</span>
              <span className="text-yellow-400">D</span>
              <span className="text-red-500">S</span>
            </div>
            <p className="text-center text-xs text-gray-600 mt-1 font-semibold">PUDS</p>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
          Philippine
        </h1>
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">
          Universal Data Slot
        </h2>

        {/* Subtitle */}
        <p className="text-center text-gray-600 mb-12 leading-relaxed">
          Single load, multiple network providers. Buy data for Smart, Globe, or DITO from one place. Fast, affordable, and reliable.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          <div className="bg-white rounded-2xl p-4 shadow-md flex flex-col items-center justify-center text-center">
            <Wifi className="w-8 h-8 text-blue-600 mb-2" />
            <p className="font-semibold text-gray-900 text-sm">All Networks</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md flex flex-col items-center justify-center text-center">
            <Smartphone className="w-8 h-8 text-blue-600 mb-2" />
            <p className="font-semibold text-gray-900 text-sm">Dual SIM</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md flex flex-col items-center justify-center text-center">
            <Zap className="w-8 h-8 text-blue-600 mb-2" />
            <p className="font-semibold text-gray-900 text-sm">Instant Load</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md flex flex-col items-center justify-center text-center">
            <Shield className="w-8 h-8 text-blue-600 mb-2" />
            <p className="font-semibold text-gray-900 text-sm">Secure Pay</p>
          </div>
        </div>

        {/* Auth Section */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-8">
          <div className="flex gap-3 mb-6">
            <button className="flex-1 py-3 bg-gray-200 text-gray-900 rounded-xl font-semibold text-center">
              Login
            </button>
            <button className="flex-1 py-3 bg-gray-100 text-gray-900 rounded-xl font-semibold text-center">
              Register
            </button>
          </div>
          <p className="text-center text-gray-600 text-sm">
            Enter any of your registered SIM numbers to login.
          </p>
        </div>

        {/* Get Started Button */}
        <button
          onClick={() => router.push('/data-packages')}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:shadow-lg transition transform hover:scale-105 active:scale-95"
        >
          Get Started
        </button>
      </div>

      {/* Footer */}
      <div className="flex justify-center gap-8 pb-8 mt-8 text-gray-400">
        <p className="text-xs">☰</p>
        <p className="text-xs">⬜</p>
        <p className="text-xs">◀</p>
      </div>
    </div>
  );
}
