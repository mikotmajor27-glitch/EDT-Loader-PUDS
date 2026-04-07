# PUDS Advance Booking Terminal Feature

## Overview

The Advance Booking Terminal is a kiosk-based pickup system that enables customers to retrieve their pre-booked orders using biometric authentication (fingerprint simulation) and a secret code verification.

## Features Implemented

### 1. Authentication System
- **Biometric Authentication**: Simulated fingerprint scanner with visual feedback and progress animation
- **Secret Code Verification**: 4-digit numeric code input with keypad interface
- **Multiple Merchant Support**: Customers with bookings at multiple merchants can select their location
- **Attempt Limiting**: 3-attempt limit per authentication session with 5-minute terminal lockout
- **Auto-Logout**: 2-minute auto-logout for security

### 2. User Interface Components

#### BiometricInput Component
- Simulated fingerprint scanner
- 2-second scanning animation
- Success/failure states with visual feedback
- Large touch-friendly interface for kiosk use

#### SecretCodeInput Component
- 4-digit code display with masked input (●●●●)
- Numeric keypad (0-9)
- Backspace and clear buttons
- Attempt counter display
- Large buttons optimized for touch

#### BookingDetailsCard Component
- Complete order summary with items and prices
- Merchant information and location
- Booking reference and PUDS ID
- Status badge (Ready/Picked Up)
- Pickup timestamp when applicable

#### TerminalHeader Component
- Merchant name and location display
- Current date/time with live update
- Terminal ID
- Home button for navigation

### 3. Terminal Flow Pages

#### `/booking-terminal/` - Welcome Screen
- Feature overview and benefits
- Step-by-step instructions
- Demo mode information with test credentials
- "Start Pickup Process" button

#### `/booking-terminal/authenticate` - Authentication Screen
- PUDS ID entry
- Merchant selection (if multiple bookings)
- Biometric fingerprint scanning
- Secret code entry with keypad
- Error handling and attempt tracking
- Back/Cancel buttons

#### `/booking-terminal/confirm` - Order Confirmation
- Full booking details display
- Identity verification confirmation
- Cashier instructions
- "Complete Pickup" button

#### `/booking-terminal/success` - Pickup Completion
- Success animation with bouncing checkmark
- Pickup receipt display
- Auto-redirect countdown (10 seconds)
- Manual reset button

### 4. Data Management

#### AdvanceBookingContext
- Manages all advance booking data
- LocalStorage persistence for demo data
- Mock booking data included for testing
- CRUD operations: create, read, update, delete bookings

#### BookingTerminalContext
- Terminal session state management
- Biometric scan status tracking
- Secret code attempt counting
- Terminal lock management
- Auto-logout timer

### 5. Utility Functions
- `generateSecretCode()`: Generate random 4-digit codes
- `formatAmount()`: Currency formatting (PHP)
- `formatDateTime()`: Date/time formatting for PH locale
- `getStatusBadge()`: Status display with styling
- `calculateTotalItems()`: Item quantity calculation
- `isValidSecretCodeFormat()`: Code format validation
- `formatPudsId()`: PUDS ID formatting
- `getTimeRemainingForLock()`: Lockout timer countdown

## Test Credentials

### Demo PUDS IDs and Bookings

**PUDS-12345** (2 bookings at different merchants)
- Booking 1 at Jollibee (Makati Mall) - Code: 1234
- Booking 2 at McDonald's (BGC) - Code: 9012

**PUDS-67890** (1 booking)
- Booking at McDonald's (BGC) - Code: 5678

## File Structure

```
app/
├── layout.tsx                          # Root layout with providers
├── page.tsx                            # Home page
├── globals.css                         # Global styles and Tailwind config
├── context/
│   ├── AdvanceBookingContext.tsx      # Booking state management
│   └── BookingTerminalContext.tsx     # Terminal session state
└── booking-terminal/
    ├── page.tsx                       # Welcome/welcome screen
    ├── authenticate/
    │   └── page.tsx                   # Authentication flow
    ├── confirm/
    │   └── page.tsx                   # Order confirmation
    └── success/
        └── page.tsx                   # Completion screen

components/
├── BiometricInput.tsx                 # Fingerprint scanner UI
├── SecretCodeInput.tsx                # Code input keypad
├── BookingDetailsCard.tsx             # Order details display
└── TerminalHeader.tsx                 # Terminal header bar

lib/
└── bookingUtils.ts                    # Utility functions
```

## How to Use

### For Customers

1. **Go to Terminal**: Access the PUDS Terminal welcome screen
2. **Enter PUDS ID**: Input your PUDS ID (e.g., PUDS-12345)
3. **Select Merchant** (if applicable): Choose from available merchant locations
4. **Scan Fingerprint**: Place your finger on the scanner (tap "Start Scan")
5. **Enter Secret Code**: Input your 4-digit secret code using the keypad
6. **Confirm Pickup**: Review your order and confirm completion
7. **Receive Order**: Collect your order from the counter

### For Development/Testing

1. Use test PUDS IDs from the demo credentials above
2. The welcome screen displays all test credentials
3. Mock data is stored in localStorage for demo persistence
4. No real payment processing or biometric hardware required

## Security Features

- **Fingerprint Verification**: Simulated biometric authentication
- **Secret Code Protection**: 4-digit code prevents unauthorized pickups
- **Attempt Limiting**: Locks terminal after 3 failed attempts
- **Auto-Logout**: 2-minute inactivity timeout
- **Masked Code Input**: Code displayed as dots (●●●●) during entry
- **Session Isolation**: Each terminal session is isolated and cleared

## Browser Compatibility

- Modern browsers with ES6+ support
- Touch-friendly interface for tablets/kiosks
- Responsive design for various screen sizes
- Tested on Chrome, Firefox, Safari, Edge

## Future Enhancements

- Integration with real biometric hardware
- Real payment processing system
- Email/SMS notifications for booking status
- Real-time merchant dashboard updates
- QR code alternative authentication
- Voice guidance for accessibility
- Multi-language support
- Receipt printing capability
- Integration with merchant inventory system

## Technical Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4
- **State Management**: React Context + Hooks
- **Icons**: Lucide React
- **Persistence**: Browser LocalStorage (demo)
- **TypeScript**: Full type safety

## Database Schema (Future Implementation)

When connecting to a real database, implement these tables:

```sql
-- Advance Bookings
CREATE TABLE advance_bookings (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR,
  puds_id VARCHAR,
  merchant_id VARCHAR,
  items JSONB,
  total_amount DECIMAL,
  secret_code VARCHAR,
  status VARCHAR (ready/picked_up/cancelled),
  created_at TIMESTAMP,
  picked_up_at TIMESTAMP
);

-- Audit Log
CREATE TABLE booking_pickup_logs (
  id VARCHAR PRIMARY KEY,
  booking_id VARCHAR,
  user_id VARCHAR,
  merchant_id VARCHAR,
  pickup_time TIMESTAMP,
  authenticated_method VARCHAR (biometric/code/hybrid)
);
```

## Notes

- All data currently uses localStorage for demo purposes
- Biometric scanning is simulated (2-second delay)
- Terminal auto-resets after successful pickup (10-second countdown)
- No backend API calls required for demo mode
- All components are touch-optimized for kiosk interfaces

## Support

For issues or feature requests related to the Advance Booking Terminal, please refer to the main PUDS_APP.md documentation or contact the development team.
