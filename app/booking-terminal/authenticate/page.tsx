'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TerminalHeader } from '@/components/TerminalHeader';
import { BiometricInput } from '@/components/BiometricInput';
import { SecretCodeInput } from '@/components/SecretCodeInput';
import { useBookingTerminal } from '@/app/context/BookingTerminalContext';
import { useAdvanceBooking } from '@/app/context/AdvanceBookingContext';
import { getTimeRemainingForLock } from '@/lib/bookingUtils';
import { AlertCircle } from 'lucide-react';

type AuthStep = 'puds-id' | 'biometric' | 'code' | 'select-booking';

export default function AuthenticatePage() {
  const router = useRouter();
  const { session, startBiometricScan, validateSecretCode, selectBooking, incrementAttempt, resetSession } = useBookingTerminal();
  const { getBookingsByPudsId } = useAdvanceBooking();

  const [step, setStep] = useState<AuthStep>('puds-id');
  const [pudsId, setPudsId] = useState('');
  const [pudsIdError, setPudsIdError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [codeError, setCodeError] = useState('');
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<string>('');

  // Update countdown timer
  const handleTimerUpdate = () => {
    if (session.lockUntil) {
      const remaining = getTimeRemainingForLock(session.lockUntil);
      setTimeRemaining(remaining);
      if (remaining === 0) {
        setStep('puds-id');
        setPudsId('');
        setPudsIdError('');
      }
    }
  };

  const handlePudsIdSubmit = (id: string) => {
    if (!id.trim()) {
      setPudsIdError('Please enter your PUDS ID');
      return;
    }

    // Check if user has any bookings at any merchant
    const bookings = getBookingsByPudsId(id);
    if (bookings.length === 0) {
      setPudsIdError('No advance bookings found for this PUDS ID');
      return;
    }

    setUserBookings(bookings);
    setPudsIdError('');

    // If only one merchant, go directly to biometric
    if (bookings.length === 1) {
      setStep('biometric');
    } else {
      // If multiple merchants, show selection
      setStep('select-booking');
    }
  };

  const handleBiometricComplete = async (success: boolean) => {
    if (success) {
      setStep('code');
    }
  };

  const handleCodeSubmit = (code: string) => {
    if (!validateSecretCode(code)) {
      incrementAttempt();
      const remaining = session.attemptCount + 1 >= 3 ? 0 : 3 - (session.attemptCount + 1);
      setCodeError(
        remaining > 0 ? `Incorrect code. ${remaining} attempts remaining.` : 'Terminal locked due to too many failed attempts.'
      );
      return;
    }

    setCodeError('');
    router.push('/booking-terminal/confirm');
  };

  const handleSelectMerchant = (merchantId: string) => {
    const booking = userBookings.find((b) => b.merchantId === merchantId);
    if (booking) {
      selectBooking(booking);
      setSelectedMerchant(merchantId);
      setStep('biometric');
    }
  };

  const handleBack = () => {
    if (step === 'biometric' && userBookings.length > 1) {
      setStep('select-booking');
    } else if (step === 'code' || step === 'select-booking') {
      setStep('puds-id');
      setPudsId('');
      setUserBookings([]);
      setSelectedMerchant('');
    }
  };

  const handleCancel = () => {
    resetSession();
    router.push('/booking-terminal');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TerminalHeader />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Terminal Locked State */}
        {session.isLocked && (
          <div className="mb-8 bg-red-50 border-2 border-red-300 rounded-xl p-6">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-red-900">Terminal Locked</h3>
                <p className="text-red-800 mt-1">
                  Too many failed attempts. Please try again in{' '}
                  <span className="font-bold">{getTimeRemainingForLock(session.lockUntil)}</span> seconds.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PUDS ID Entry */}
        {step === 'puds-id' && !session.isLocked && (
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Enter PUDS ID</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="e.g., PUDS-12345"
                value={pudsId}
                onChange={(e) => {
                  setPudsId(e.target.value);
                  setPudsIdError('');
                }}
                className="terminal-input"
              />
              {pudsIdError && (
                <div className="text-red-600 text-sm font-semibold">{pudsIdError}</div>
              )}
              <button
                onClick={() => handlePudsIdSubmit(pudsId)}
                className="w-full terminal-button-lg"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Merchant Selection */}
        {step === 'select-booking' && (
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Select Merchant</h2>
            <p className="text-gray-600 mb-6">
              You have bookings at multiple merchants. Please select one:
            </p>
            <div className="space-y-3 mb-6">
              {userBookings.map((booking) => (
                <button
                  key={booking.merchantId}
                  onClick={() => handleSelectMerchant(booking.merchantId)}
                  className="w-full text-left p-4 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition"
                >
                  <h3 className="font-bold text-gray-900">{booking.merchantName}</h3>
                  <p className="text-sm text-gray-600">{booking.merchantLocation}</p>
                </button>
              ))}
            </div>
            <button
              onClick={handleBack}
              className="w-full px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition"
            >
              Back
            </button>
          </div>
        )}

        {/* Biometric Authentication */}
        {step === 'biometric' && !session.isLocked && (
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Biometric Authentication</h2>
            <BiometricInput onScanComplete={handleBiometricComplete} />
            <div className="flex gap-3 mt-8">
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition"
              >
                Back
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 terminal-button-danger"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Secret Code Entry */}
        {step === 'code' && !session.isLocked && (
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Enter Secret Code</h2>
            <p className="text-center text-gray-600 mb-8">Enter the 4-digit secret code provided during booking</p>
            
            <SecretCodeInput
              onSubmit={handleCodeSubmit}
              attemptsRemaining={3 - session.attemptCount}
              maxAttempts={3}
            />

            {codeError && (
              <div className="mt-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg text-red-700 font-semibold text-center">
                {codeError}
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition"
              >
                Back
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 terminal-button-danger"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
