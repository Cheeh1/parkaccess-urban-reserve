# Booking and Payment Integration

This document outlines the complete booking and payment feature implementation for the ParkAccess application.

## Overview

The booking and payment system allows users to:
1. Select a parking lot
2. Choose a date and view available time slots
3. Book a specific time slot with car details
4. Complete payment using Paystack
5. Receive booking confirmation

## API Integration

### Time Slots API

**Get Available Time Slots**
```
GET /api/time-slots/available/:parkingLotId?date=2024-03-20
```

**Book Time Slot**
```
POST /api/time-slots
Content-Type: application/json
Authorization: Bearer {token}

{
    "parkingLotId": "parking_lot_id",
    "spotNumber": 5,
    "startTime": "2024-03-20T10:00:00Z",
    "endTime": "2024-03-20T11:00:00Z"
}
```

### Payments API

**Initialize Payment**
```
POST /api/payments/initialize
Content-Type: application/json
Authorization: Bearer {token}

{
    "parkingLotId": "parking_lot_id",
    "spotNumber": 5,
    "startTime": "2024-03-20T10:00:00Z",
    "endTime": "2024-03-20T11:00:00Z",
    "carDetails": {
        "licensePlate": "ABC123",
        "carModel": "Toyota Camry",
        "carColor": "Black"
    },
    "amount": 1000 // Amount in kobo (₦10.00)
}
```

**Verify Payment**
```
GET /api/payments/verify/:reference
Authorization: Bearer {token}
```

## User Flow

### 1. Parking Lot Selection
- Users browse available parking lots on `/parking-lots`
- Click "Book Now" on a parking lot card
- Redirected to `/book/:id` (Booking page)

### 2. Date and Time Selection
- User selects a date using date picker
- Available time slots are fetched from the API
- User selects a time slot from available options
- Each slot shows spot number, time range, and availability status

### 3. Car Details Entry
- User enters car details:
  - License Plate
  - Car Model
  - Car Color
- All fields are required for booking

### 4. Booking and Payment Initialization
- System books the time slot via API
- Payment is initialized with Paystack
- User is redirected to `/checkout/:id` with booking data

### 5. Payment Processing
- Paystack payment popup opens
- User completes payment
- Payment is verified via `/verify/:reference` endpoint
- Success/failure status is displayed

### 6. Booking Confirmation
- On successful payment, booking is confirmed
- User receives confirmation message
- Option to go to dashboard

## Components

### New Components
- `src/pages/Booking.tsx` - Main booking page with date/time selection
- `src/utils/api.ts` - API utility functions

### Updated Components
- `src/pages/Checkout.tsx` - Payment processing and verification
- `src/components/parking/ParkingLotCard.tsx` - Updated to navigate to booking page
- `src/App.tsx` - Added new booking route

## Key Features

### Date and Time Management
- Date picker with minimum date validation
- Real-time availability checking
- Time slot visualization with availability status

### Payment Integration
- Paystack integration for payment processing
- Payment verification workflow
- Error handling and retry mechanisms

### User Experience
- Step-by-step booking process
- Real-time feedback and loading states
- Comprehensive error handling
- Mobile-responsive design

## Configuration

### Paystack Setup
Update the Paystack public key in `src/pages/Checkout.tsx`:
```typescript
key: 'pk_test_your_paystack_public_key', // Replace with actual key
```

### API Base URL
The API base URL is configured in `src/utils/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

## Error Handling

The system includes comprehensive error handling for:
- Network failures
- API errors
- Payment failures
- Invalid data scenarios
- Authentication issues

All errors are displayed to users via toast notifications with appropriate actions (retry, go back, etc.).

## Security

- All API calls include authentication tokens
- Payment data is handled securely through Paystack
- User input validation on both frontend and backend
- Secure payment reference generation and verification

## Testing

To test the booking and payment flow:

1. Start the backend server on `localhost:5000`
2. Ensure the required API endpoints are implemented
3. Configure Paystack with test keys
4. Navigate to a parking lot and click "Book Now"
5. Complete the booking flow with test data
6. Use Paystack test cards for payment testing 