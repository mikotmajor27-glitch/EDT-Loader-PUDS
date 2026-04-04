# PUDS - Payment Universal Data System

A comprehensive mobile payment and data loading application built with Next.js for dual-SIM smartphone management.

## Features

### 🔐 Authentication & Registration
- **Dual-SIM Registration**: Register both SIM card slots with their respective network carriers
- **Carrier Selection**: Smart, Globe, or Dito network providers
- **PUDS ID Generation**: Automatic unique ID generation for each user (format: PUDS-XXXXX)
- **Secure Login**: Sign in with PUDS ID and password for returning users
- **Password Management**: Create and confirm passwords during registration

### 📱 EDT Data Loader
- **Data Packages**: Three tiered options
  - 10GB for 7 days - ₱160 (5GB per SIM)
  - 20GB for 15 days - ₱300 (10GB per SIM)
  - 40GB for 30 days - ₱600 (20GB per SIM)
- **Flexible Payment Methods**: GCash, PayMaya, 7-Eleven, PUDS Balance
- **Admin Approval System**: Payments require admin verification before fulfillment
- **Automatic Distribution**: Data loads to both registered SIM cards

### 💳 PUDS Payment System
- **Age Verification**: Must be 18 years or older
- **KYC Compliance**: 
  - Complete profile with full name
  - Government ID verification
  - Face recognition scan (mock)
  - Fingerprint registration
- **Merchant Directory**: 
  - Food & Dining (Jollibee, McDonald's, Starbucks)
  - Utilities (Meralco, Maynilad)
  - Finance (GCash Partner, PayMaya Partner)
  - Fuel (Petron)
- **One-Time Payment Codes**: 4-digit unique codes generated per transaction
- **Fingerprint Authentication**: No phone or card needed at checkout
- **Instant Transactions**: Real-time payment processing

### 🛡️ Security Features
- **Fingerprint Authentication**: Biometric verification for PUDS payments
- **One-Time Codes**: Codes expire after single use
- **Admin Password Protection**: Access control for admin dashboard
- **User Data Isolation**: localStorage-based with user-specific records

### 📊 Admin Dashboard
**Access URL**: `/admin`
**Default Password**: `PUDS271986`

**Features**:
- EDT Transaction Management
  - View pending, approved, and fulfilled transactions
  - Approve payment submissions
  - Mark transactions as fulfilled
- Payment Code Monitoring
  - Track generated payment codes
  - Monitor active, used, and expired codes
  - Mark codes as used in the system

## User Flow

### Registration Flow
1. **Landing Page** → Click "Get Started"
2. **SIM Card 1 Registration** → Select carrier, enter phone number
3. **SIM Card 2 Registration** → Select carrier, enter phone number
4. **Password Creation** → Create and confirm password
5. **Registration Complete** → Display PUDS ID
6. **Dashboard Access**

### EDT Data Loading
1. Dashboard → Click "EDT Loader"
2. Select data package
3. Choose payment method
4. Submit for admin approval
5. Receive notification when approved
6. Data loads to both SIM cards

### PUDS Payment
1. Dashboard → Click "PUDS Payment"
2. Complete verification process:
   - Verify age (18+)
   - Complete profile (name, ID)
   - Face recognition scan
   - Fingerprint registration
3. Select merchant
4. Enter amount to pay
5. Generate 4-digit payment code
6. Show code at merchant counter
7. Use fingerprint at PUDS terminal
8. Transaction completes instantly

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: React Context API
- **Storage**: Browser localStorage (mock data)
- **Icons**: lucide-react

## Color Scheme

Based on PUDS Logo colors:
- **Primary**: Purple (#8B2E7E) - Brand color
- **Secondary**: Red (#D32F2F) - PUDS logo red
- **Accent**: Yellow (#FBC02D) - PUDS logo yellow
- **Information**: Blue (#1976D2) - PUDS logo blue
- **Success**: Green - For confirmations

## File Structure

```
app/
├── context/
│   ├── AuthContext.tsx          # User authentication & registration
│   └── TransactionContext.tsx   # EDT and payment transactions
├── landing/                      # Landing page
├── register/                     # Registration flow
├── registration-complete/        # Registration confirmation
├── login/                        # Login page
├── dashboard/                    # Main dashboard
├── edt-loader/
│   ├── page.tsx                 # EDT package selection
│   ├── payment/                 # Payment method selection
│   └── confirmation/            # Payment confirmation
├── puds-payment/
│   ├── page.tsx                # Payment feature intro
│   ├── verify/                 # Age & profile verification
│   ├── merchant/               # Merchant selection & amount
│   └── code/                   # Payment code display
├── admin/                       # Admin dashboard
├── layout.tsx                   # Root layout with providers
├── page.tsx                     # Router page
└── globals.css                  # Design tokens & styles
```

## Navigation Routes

| Route | Purpose |
|-------|---------|
| `/` | Auto-routes based on auth state |
| `/landing` | App introduction |
| `/register` | Registration flow |
| `/registration-complete` | Registration confirmation |
| `/login` | Sign in page |
| `/dashboard` | Main app dashboard |
| `/edt-loader` | Data package selection |
| `/edt-loader/payment` | Payment method selection |
| `/edt-loader/confirmation` | Pending approval |
| `/puds-payment` | Payment feature start |
| `/puds-payment/verify` | Verification process |
| `/puds-payment/merchant` | Merchant & amount |
| `/puds-payment/code` | Code display & instructions |
| `/admin` | Admin management dashboard |

## Data Structure

### User Data
```typescript
interface User {
  pudsId: string;
  password: string;
  sim1: { slot: number; carrier: string; phoneNumber: string };
  sim2: { slot: number; carrier: string; phoneNumber: string };
  createdAt: string;
}
```

### EDT Transaction
```typescript
interface EDTTransaction {
  id: string;
  pudsId: string;
  dataPackage: '10GB' | '20GB' | '40GB';
  price: number;
  paymentMethod: string;
  status: 'pending' | 'approved' | 'fulfilled';
  simSlots: (1 | 2)[];
  createdAt: string;
}
```

### Payment Code
```typescript
interface PaymentCode {
  id: string;
  pudsId: string;
  merchant: PUDSMerchant;
  code: string;
  amount: number;
  status: 'active' | 'used' | 'expired';
  createdAt: string;
  expiresAt: string;
}
```

## Testing the App

### Test User
The app uses localStorage for mock data. After registering:
- **PUDS ID**: PUDS-XXXXX (auto-generated)
- **Password**: Your chosen password

### Admin Access
- **URL**: `/admin`
- **Password**: `PUDS271986`

### Quick Start
1. Go to `/landing`
2. Click "Get Started"
3. Register both SIM cards (use any 10-digit number starting with 09)
4. Create a password
5. Save your PUDS ID
6. Access dashboard and test EDT Loader or PUDS Payment

## Features Demo

### EDT Loader Demo
- Select data package
- Choose payment method
- Wait for admin approval (admin can approve in dashboard)
- Transaction status updates

### PUDS Payment Demo
- Complete verification (mock fingerprint/face recognition)
- Select merchant
- Enter amount
- Generate unique payment code
- View how-to-pay instructions

### Admin Demo
- View pending transactions
- Approve EDT payments
- Fulfill orders
- Track payment codes

## Future Enhancements

- Real database integration (Supabase/Neon)
- Actual fingerprint API integration
- Real payment gateway integration
- SMS notifications
- Transaction history
- Account settings
- Customer support chat
- Real face recognition API
- Multi-language support

## Notes

- All data is stored in browser localStorage (mock implementation)
- Data persists during the session but clears on browser data clear
- Payment codes expire after 1 hour (configurable)
- Admin password is hardcoded for demo (should use proper auth in production)
- Biometric features are simulated (no real sensor integration)

## Support

For admin access or feature requests, use the admin dashboard at `/admin` with password `PUDS271986`.
