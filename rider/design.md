# Delivery Rider App - Design Document

## Overview

The Delivery Rider App is a mobile application designed for delivery partners to efficiently manage and complete deliveries. The app focuses on simplicity, speed, and ease of use during active delivery operations.

---

## Screen List

### 1. **Login Screen**
   - Mobile number or email input field
   - Password input field
   - "Login" button
   - "Forgot Password?" link
   - Simple, clean layout

### 2. **Home Screen (Order Requests)**
   - List of available delivery requests
   - Each request card displays:
     - Order ID
     - Restaurant name & location
     - Pickup address
     - Delivery address
     - Estimated distance
     - Estimated earnings
   - "Accept" and "Reject" buttons on each card
   - Pull-to-refresh functionality
   - Empty state when no orders available

### 3. **Active Delivery Screen**
   - Order details section with:
     - Order ID
     - Restaurant name & address
     - Customer name & delivery address
     - Order items (read-only list)
     - Special delivery instructions
   - Status update buttons (Accepted → Reached Restaurant → Picked Up → On the Way → Delivered)
   - Current status indicator
   - "Open in Maps" button for navigation
   - Contact customer button (optional)

### 4. **Delivery History Screen**
   - List of completed deliveries
   - Each history item shows:
     - Order ID
     - Date & time
     - Restaurant name
     - Earnings
     - Delivery status
   - Swipe or tap to view details
   - Filter by date range (optional)

### 5. **Rider Profile Screen**
   - Rider information:
     - Profile picture
     - Name
     - Phone number
     - Vehicle type
     - Rating (if applicable)
   - Online/Offline toggle
   - Settings option
   - Logout button

### 6. **Settings Screen** (Optional)
   - Notification preferences
   - Language selection
   - Theme (Light/Dark mode)
   - About app
   - Help & Support

---

## Primary Content and Functionality

### Home Screen (Order Requests)
- **Content**: List of available delivery requests from restaurants
- **Functionality**:
  - Display orders with key information (distance, earnings, pickup/delivery locations)
  - Accept order → Move to Active Delivery Screen
  - Reject order → Remove from list
  - Pull-to-refresh to fetch new orders
  - Real-time order updates (if backend supports)

### Active Delivery Screen
- **Content**: Full order details, customer info, items, and instructions
- **Functionality**:
  - Update order status through predefined steps
  - Navigate to restaurant/customer using Google Maps
  - Display current status with visual indicator
  - Show ETA and distance
  - Contact customer (optional)
  - Cancel delivery (with reason)

### Delivery History Screen
- **Content**: Completed deliveries with summary information
- **Functionality**:
  - View list of past deliveries
  - Tap to see full details
  - Track daily/weekly earnings
  - Filter by date (optional)

### Rider Profile Screen
- **Content**: Rider personal and vehicle information
- **Functionality**:
  - Toggle online/offline status
  - View and edit profile information
  - Access settings
  - Logout

---

## Key User Flows

### Flow 1: Accept and Complete a Delivery
1. Rider opens app → sees list of available orders on Home Screen
2. Rider reviews order details (distance, pickup/delivery locations, earnings)
3. Rider taps "Accept" button
4. App navigates to Active Delivery Screen
5. Rider taps "Reached Restaurant" when arriving at pickup location
6. Rider confirms "Picked Up" after collecting order
7. Rider taps "On the Way" to start delivery
8. Rider navigates to customer address using Maps
9. Rider taps "Delivered" upon arrival
10. Order marked as complete, moves to Delivery History
11. Rider can accept next order

### Flow 2: Reject an Order
1. Rider sees order on Home Screen
2. Rider taps "Reject" button
3. Order is removed from list
4. Rider can continue browsing other orders

### Flow 3: Navigate to Location
1. Rider on Active Delivery Screen
2. Rider taps "Open in Maps" button
3. Google Maps opens with destination pre-filled
4. Rider follows navigation
5. Returns to app to update status

### Flow 4: View Delivery History
1. Rider navigates to History tab
2. Sees list of completed deliveries
3. Can tap on any delivery to see full details
4. Can view earnings summary

### Flow 5: Manage Profile
1. Rider navigates to Profile tab
2. Can toggle online/offline status
3. Can view personal information
4. Can access settings or logout

---

## Color Choices

### Primary Colors
- **Primary Brand Color**: `#FF6B35` (Vibrant Orange) - Used for CTAs, buttons, and highlights
- **Success Color**: `#06A77D` (Teal Green) - Used for completed deliveries and positive states
- **Warning Color**: `#F77F00` (Dark Orange) - Used for pending or attention-needed states
- **Error Color**: `#D62828` (Red) - Used for cancellations or errors

### Neutral Colors
- **Background**: `#FFFFFF` (White) - Main screen background
- **Surface**: `#F8F9FA` (Light Gray) - Card backgrounds
- **Text Primary**: `#1A1A1A` (Dark Gray) - Main text
- **Text Secondary**: `#6B7280` (Medium Gray) - Secondary text
- **Border**: `#E5E7EB` (Light Gray) - Dividers and borders

### Dark Mode (Optional)
- **Background**: `#0F0F0F` (Near Black)
- **Surface**: `#1A1A1A` (Dark Gray)
- **Text Primary**: `#FFFFFF` (White)
- **Text Secondary**: `#9CA3AF` (Light Gray)

---

## Typography

- **Headings**: Bold, 24-28px (screen titles)
- **Subheadings**: Semibold, 18-20px (section titles)
- **Body Text**: Regular, 14-16px (main content)
- **Small Text**: Regular, 12-14px (secondary info, labels)
- **Button Text**: Semibold, 14-16px

---

## Layout Principles

### Mobile Portrait (9:16) Optimization
- **Single-handed usage**: All interactive elements within thumb reach
- **Large touch targets**: Minimum 44x44pt for buttons
- **Vertical scrolling**: Content flows top-to-bottom
- **Bottom-aligned CTAs**: Primary actions near bottom for easy reach

### Spacing & Padding
- **Screen padding**: 16px on sides
- **Card padding**: 12-16px
- **Gap between items**: 12-16px
- **Button height**: 48-56px for easy tapping while riding

### Navigation
- **Tab bar**: Bottom navigation with 4-5 main tabs (Home, Active, History, Profile, Settings)
- **Back button**: Top-left corner for modal/detail screens
- **Consistent navigation**: Clear back/forward paths

---

## Interaction Patterns

### Button States
- **Default**: Full opacity, normal scale
- **Pressed**: 95% opacity, slight scale down (0.97)
- **Disabled**: 60% opacity, no interaction
- **Loading**: Spinner or progress indicator

### List Items
- **Default**: Normal appearance
- **Pressed**: 90% opacity, subtle highlight
- **Swipe**: Optional swipe actions (edit, delete)

### Status Indicators
- **Accepted**: Green badge with checkmark
- **Reached Restaurant**: Orange badge with location pin
- **Picked Up**: Blue badge with package icon
- **On the Way**: Purple badge with truck icon
- **Delivered**: Green badge with checkmark

---

## Performance Considerations

- **Lazy loading**: Load order lists in batches
- **Image optimization**: Compress profile pictures and order images
- **Caching**: Cache recent orders and history locally
- **Offline support**: Store last known state for offline access

---

## Accessibility

- **High contrast**: Text meets WCAG AA standards
- **Large text**: Minimum 14px for body text
- **Touch targets**: 44x44pt minimum
- **Clear labels**: All buttons and inputs have clear labels
- **Haptic feedback**: Vibration on button press for confirmation

---

## Future Enhancements

- Real-time order tracking with live map
- Earnings analytics and daily/weekly reports
- Customer ratings and reviews
- In-app chat with customers
- Biometric login (fingerprint/face)
- Push notifications for new orders
- Offline mode with sync when online
- Multi-language support
- Vehicle type selection (bike, car, scooter)
