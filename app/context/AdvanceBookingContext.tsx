'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface BookingItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface AdvanceBooking {
  id: string;
  pudsId: string;
  merchantId: string;
  merchantName: string;
  merchantLocation: string;
  items: BookingItem[];
  totalAmount: number;
  secretCode: string;
  status: 'ready' | 'picked_up' | 'cancelled';
  createdAt: string;
  pickedUpAt?: string;
}

interface AdvanceBookingContextType {
  bookings: AdvanceBooking[];
  getBookingsByPudsId: (pudsId: string, merchantId?: string) => AdvanceBooking[];
  getBookingById: (bookingId: string) => AdvanceBooking | undefined;
  createBooking: (booking: Omit<AdvanceBooking, 'id' | 'createdAt'>) => AdvanceBooking;
  updateBookingStatus: (bookingId: string, status: AdvanceBooking['status']) => void;
  deleteBooking: (bookingId: string) => void;
}

const AdvanceBookingContext = createContext<AdvanceBookingContextType | undefined>(undefined);

// Mock data generator
const generateMockBookings = (): AdvanceBooking[] => [
  {
    id: 'BK001',
    pudsId: 'PUDS-12345',
    merchantId: 'JOLLIBEE-001',
    merchantName: 'Jollibee',
    merchantLocation: 'Makati Mall',
    items: [
      { id: '1', name: 'Chickenjoy Combo', quantity: 2, price: 299 },
      { id: '2', name: 'Cheese Burger', quantity: 1, price: 169 },
    ],
    totalAmount: 767,
    secretCode: '1234',
    status: 'ready',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'BK002',
    pudsId: 'PUDS-67890',
    merchantId: 'MCDONALDS-001',
    merchantName: "McDonald's",
    merchantLocation: 'BGC',
    items: [
      { id: '1', name: 'Big Mac Meal', quantity: 1, price: 249 },
      { id: '2', name: 'McSpicy Sandwich', quantity: 2, price: 189 },
    ],
    totalAmount: 627,
    secretCode: '5678',
    status: 'ready',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'BK003',
    pudsId: 'PUDS-12345',
    merchantId: 'MCDONALDS-001',
    merchantName: "McDonald's",
    merchantLocation: 'BGC',
    items: [
      { id: '1', name: 'Fries Regular', quantity: 3, price: 79 },
    ],
    totalAmount: 237,
    secretCode: '9012',
    status: 'ready',
    createdAt: new Date().toISOString(),
  },
];

export function AdvanceBookingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [bookings, setBookings] = useState<AdvanceBooking[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('puds_advance_bookings');
    if (stored) {
      try {
        setBookings(JSON.parse(stored));
      } catch {
        setBookings(generateMockBookings());
      }
    } else {
      setBookings(generateMockBookings());
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever bookings change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('puds_advance_bookings', JSON.stringify(bookings));
    }
  }, [bookings, isInitialized]);

  const getBookingsByPudsId = (pudsId: string, merchantId?: string) => {
    return bookings.filter((b) => {
      const pudsMatch = b.pudsId === pudsId;
      const merchantMatch = merchantId ? b.merchantId === merchantId : true;
      return pudsMatch && merchantMatch;
    });
  };

  const getBookingById = (bookingId: string) => {
    return bookings.find((b) => b.id === bookingId);
  };

  const createBooking = (
    booking: Omit<AdvanceBooking, 'id' | 'createdAt'>
  ): AdvanceBooking => {
    const newBooking: AdvanceBooking = {
      ...booking,
      id: `BK${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setBookings([...bookings, newBooking]);
    return newBooking;
  };

  const updateBookingStatus = (
    bookingId: string,
    status: AdvanceBooking['status']
  ) => {
    setBookings(
      bookings.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status,
              pickedUpAt: status === 'picked_up' ? new Date().toISOString() : undefined,
            }
          : b
      )
    );
  };

  const deleteBooking = (bookingId: string) => {
    setBookings(bookings.filter((b) => b.id !== bookingId));
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <AdvanceBookingContext.Provider
      value={{
        bookings,
        getBookingsByPudsId,
        getBookingById,
        createBooking,
        updateBookingStatus,
        deleteBooking,
      }}
    >
      {children}
    </AdvanceBookingContext.Provider>
  );
}

export function useAdvanceBooking() {
  const context = useContext(AdvanceBookingContext);
  if (!context) {
    throw new Error('useAdvanceBooking must be used within AdvanceBookingProvider');
  }
  return context;
}
