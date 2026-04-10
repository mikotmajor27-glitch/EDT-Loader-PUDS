'use client';

import { useRouter } from 'next/navigation';
import { Check, ArrowLeft } from 'lucide-react';

interface DataPackage {
  id: string;
  days: number;
  dataGB: number;
  price: number;
  popular?: boolean;
  networks: string[];
}

const packages: DataPackage[] = [
  {
    id: '7days',
    days: 7,
    dataGB: 12,
    price: 160,
    networks: ['Smart', 'Globe', 'DITO'],
  },
  {
    id: '15days',
    days: 15,
    dataGB: 20,
    price: 210,
    popular: true,
    networks: ['Smart', 'Globe', 'DITO'],
  },
  {
    id: '30days',
    days: 30,
    dataGB: 40,
    price: 410,
    networks: ['Smart', 'Globe', 'DITO'],
  },
];

export default function DataPackagesPage() {
  const router = useRouter();

  const handleSelectPackage = (packageId: string) => {
    console.log(`[v0] Selected package: ${packageId}`);
    alert(`✓ Data Load Initiated\n\nPackage: ${packageId}\n\nLoading to your phone...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-100 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold">Data Packages</h1>
            <p className="text-blue-100 text-sm">Choose your plan</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-2xl transition-all duration-300 overflow-hidden ${
                pkg.popular
                  ? 'ring-2 ring-blue-500 shadow-xl md:col-span-2 lg:col-span-1 transform scale-105'
                  : 'shadow-md hover:shadow-lg'
              } ${
                pkg.popular
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                  : 'bg-white'
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="bg-blue-800/50 backdrop-blur-sm px-4 py-2 text-center text-sm font-bold">
                  🌟 MOST POPULAR
                </div>
              )}

              {/* Content */}
              <div className={`p-6 ${pkg.popular ? '' : ''}`}>
                {/* Data Amount */}
                <div className="mb-4">
                  <h2 className={`text-4xl font-bold mb-1 ${pkg.popular ? 'text-white' : 'text-gray-900'}`}>
                    {pkg.dataGB}GB
                  </h2>
                  <p className={`text-sm ${pkg.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                    {pkg.days} days validity
                  </p>
                </div>

                {/* Price */}
                <div className={`mb-6 pb-6 border-b ${pkg.popular ? 'border-blue-400' : 'border-gray-200'}`}>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-bold ${pkg.popular ? 'text-blue-100' : 'text-blue-600'}`}>
                      ₱{pkg.price}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  <li className={`flex items-center gap-2 text-sm ${pkg.popular ? 'text-blue-100' : 'text-gray-700'}`}>
                    <Check className="w-4 h-4 flex-shrink-0" />
                    <span>{pkg.dataGB}GB high-speed data</span>
                  </li>
                  <li className={`flex items-center gap-2 text-sm ${pkg.popular ? 'text-blue-100' : 'text-gray-700'}`}>
                    <Check className="w-4 h-4 flex-shrink-0" />
                    <span>Valid {pkg.days} days</span>
                  </li>
                  <li className={`flex items-center gap-2 text-sm ${pkg.popular ? 'text-blue-100' : 'text-gray-700'}`}>
                    <Check className="w-4 h-4 flex-shrink-0" />
                    <span>All networks</span>
                  </li>
                  <li className={`flex items-center gap-2 text-sm ${pkg.popular ? 'text-blue-100' : 'text-gray-700'}`}>
                    <Check className="w-4 h-4 flex-shrink-0" />
                    <span>Instant activation</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPackage(pkg.id)}
                  className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
                    pkg.popular
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Load Now
                </button>

                {/* Per Day Rate */}
                <p className={`text-center text-xs mt-3 ${pkg.popular ? 'text-blue-200' : 'text-gray-500'}`}>
                  {(pkg.dataGB / pkg.days).toFixed(2)}GB per day
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why PUDS?
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600 mb-1">✓</p>
              <p className="text-sm font-semibold text-gray-900">All Networks</p>
              <p className="text-xs text-gray-600 mt-1">Smart, Globe, DITO</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600 mb-1">⚡</p>
              <p className="text-sm font-semibold text-gray-900">Instant</p>
              <p className="text-xs text-gray-600 mt-1">Immediate activation</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600 mb-1">✔</p>
              <p className="text-sm font-semibold text-gray-900">Reliable</p>
              <p className="text-xs text-gray-600 mt-1">Trusted service</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600 mb-1">💰</p>
              <p className="text-sm font-semibold text-gray-900">Affordable</p>
              <p className="text-xs text-gray-600 mt-1">Best rates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
