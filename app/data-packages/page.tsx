'use client';

import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

interface DataPackage {
  id: string;
  days: number;
  dataGB: number;
  price: number;
  popular?: boolean;
  promo?: boolean;
}

const packages: DataPackage[] = [
  {
    id: '1day',
    days: 1,
    dataGB: 2,
    price: 30,
    promo: true,
  },
  {
    id: '3days',
    days: 3,
    dataGB: 5,
    price: 75,
    promo: true,
  },
  {
    id: '7days',
    days: 7,
    dataGB: 12,
    price: 160,
    popular: true,
  },
  {
    id: '15days',
    days: 15,
    dataGB: 20,
    price: 210,
  },
  {
    id: '30days',
    days: 30,
    dataGB: 40,
    price: 410,
  },
];

export default function DataPackagesPage() {
  const router = useRouter();

  const handleSelectPackage = (packageId: string) => {
    console.log(`Selected package: ${packageId}`);
    // Navigate to booking or payment flow
    router.push('/booking-terminal');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 px-4">
        <button
          onClick={() => router.back()}
          className="mb-4 text-blue-100 hover:text-white transition"
        >
          ← Back
        </button>
        <h1 className="text-4xl font-bold mb-2">Data Packages</h1>
        <p className="text-blue-100">Choose the perfect plan for your needs</p>
      </div>

      {/* Packages Container */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-xl transition-all duration-300 ${
                pkg.popular
                  ? 'ring-2 ring-blue-400 lg:scale-105 shadow-2xl'
                  : 'shadow-lg hover:shadow-xl'
              } ${
                pkg.popular
                  ? 'bg-gradient-to-br from-blue-50 to-blue-100'
                  : 'bg-white'
              } overflow-hidden`}
            >
              {/* Promo/Popular Badge */}
              {pkg.promo && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-amber-400 text-white py-1 text-center font-bold text-xs">
                  PROMO
                </div>
              )}
              {pkg.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-1 text-center font-bold text-xs">
                  BEST VALUE
                </div>
              )}

              {/* Content */}
              <div className={`p-6 ${pkg.promo || pkg.popular ? 'pt-12' : ''}`}>
                {/* Duration and Data */}
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    {pkg.dataGB}GB
                  </h2>
                  <p className="text-slate-600 text-lg">
                    Valid for {pkg.days} days
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8 py-6 border-y border-slate-200">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-blue-600">
                      ₱{pkg.price}
                    </span>
                    <span className="text-slate-600 ml-2">/one-time</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-slate-700">
                    <Check className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                    <span>{pkg.dataGB}GB high-speed data</span>
                  </li>
                  <li className="flex items-center text-slate-700">
                    <Check className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                    <span>Valid for {pkg.days} days</span>
                  </li>
                  <li className="flex items-center text-slate-700">
                    <Check className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                    <span>All networks supported</span>
                  </li>
                  <li className="flex items-center text-slate-700">
                    <Check className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                    <span>Instant activation</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPackage(pkg.id)}
                  className={`w-full py-2 px-6 rounded-lg font-bold transition-all duration-300 text-sm ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:from-blue-700 hover:to-blue-600'
                      : pkg.promo
                      ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-white hover:shadow-lg hover:from-amber-600 hover:to-amber-500'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  Load Data
                </button>

                {/* Data per Day Info */}
                <p className="text-center text-sm text-slate-500 mt-4">
                  {(pkg.dataGB / pkg.days).toFixed(2)}GB per day
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-white rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">
            Why Choose Our Data Plans?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <p className="text-slate-600">Network Coverage</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <p className="text-slate-600">Customer Support</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">0%</div>
              <p className="text-slate-600">Hidden Charges</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">⚡</div>
              <p className="text-slate-600">Instant Activation</p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-blue-300 hover:text-white transition"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
