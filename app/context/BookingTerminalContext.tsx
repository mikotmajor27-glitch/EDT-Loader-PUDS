'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdvanceBooking } from './AdvanceBookingContext';

interface TerminalSession {
  isAuthenticated: boolean;
  currentUser: { pudsId: string; name: string } | null;
  selectedBooking: AdvanceBooking | null;
  attemptCount: number;
  isLocked: boolean;
  lockUntil?: number;
  scanStartTime?: number;
}

interface BookingTerminalContextType {
  session: TerminalSession;
  startBiometricScan: () => Promise<boolean>;
  validateSecretCode: (code: string) => boolean;
  selectBooking: (booking: AdvanceBooking) => void;
  completePickup: () => void;
  resetSession: () => void;
  incrementAttempt: () => void;
  lockTerminal: (durationMs: number) => void;
}

const BookingTerminalContext = createContext<BookingTerminalContextType | undefined>(undefined);

export function BookingTerminalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<TerminalSession>({
    isAuthenticated: false,
    currentUser: null,
    selectedBooking: null,
    attemptCount: 0,
    isLocked: false,
  });

  // Check for terminal lock expiration
  useEffect(() => {
    if (session.isLocked && session.lockUntil) {
      const timer = setTimeout(() => {
        if (Date.now() >= session.lockUntil!) {
          setSession((prev) => ({
            ...prev,
            isLocked: false,
            lockUntil: undefined,
            attemptCount: 0,
          }));
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [session.isLocked, session.lockUntil]);

  // Auto-logout after 2 minutes of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      if (session.isAuthenticated) {
        resetSession();
      }
    }, 2 * 60 * 1000); // 2 minutes

    return () => clearTimeout(timer);
  }, [session.isAuthenticated]);

  const startBiometricScan = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Simulate 2-second biometric scan
      setTimeout(() => {
        // Always succeed for now (in real app, would validate against registered biometric)
        setSession((prev) => ({
          ...prev,
          scanStartTime: Date.now(),
        }));
        resolve(true);
      }, 2000);
    });
  };

  const validateSecretCode = (code: string): boolean => {
    const booking = session.selectedBooking;
    if (!booking) return false;

    const isValid = booking.secretCode === code;
    if (isValid) {
      setSession((prev) => ({
        ...prev,
        isAuthenticated: true,
        attemptCount: 0,
      }));
    }

    return isValid;
  };

  const selectBooking = (booking: AdvanceBooking) => {
    setSession((prev) => ({
      ...prev,
      selectedBooking: booking,
      currentUser: {
        pudsId: booking.pudsId,
        name: 'Customer', // In real app, would fetch from user data
      },
    }));
  };

  const completePickup = () => {
    setSession((prev) => ({
      ...prev,
      // This will be handled by the page to update booking status
    }));
  };

  const incrementAttempt = () => {
    setSession((prev) => {
      const newCount = prev.attemptCount + 1;
      if (newCount >= 3) {
        // Lock terminal for 5 minutes after 3 failed attempts
        return {
          ...prev,
          attemptCount: newCount,
          isLocked: true,
          lockUntil: Date.now() + 5 * 60 * 1000,
        };
      }
      return {
        ...prev,
        attemptCount: newCount,
      };
    });
  };

  const lockTerminal = (durationMs: number) => {
    setSession((prev) => ({
      ...prev,
      isLocked: true,
      lockUntil: Date.now() + durationMs,
    }));
  };

  const resetSession = () => {
    setSession({
      isAuthenticated: false,
      currentUser: null,
      selectedBooking: null,
      attemptCount: 0,
      isLocked: false,
    });
  };

  return (
    <BookingTerminalContext.Provider
      value={{
        session,
        startBiometricScan,
        validateSecretCode,
        selectBooking,
        completePickup,
        resetSession,
        incrementAttempt,
        lockTerminal,
      }}
    >
      {children}
    </BookingTerminalContext.Provider>
  );
}

export function useBookingTerminal() {
  const context = useContext(BookingTerminalContext);
  if (!context) {
    throw new Error('useBookingTerminal must be used within BookingTerminalProvider');
  }
  return context;
}
