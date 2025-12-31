# Foodie MVP - Mobile App Design Document

## Overview

A clean, simple, and beginner-friendly food ordering application built with React Native and Expo. The app follows iOS Human Interface Guidelines (HIG) and is optimized for mobile portrait orientation (9:16) with one-handed usage in mind.

---

## Screen List

### Authentication Screens
1. **Splash Screen** — App logo and branding on launch
2. **Login Screen** — Email/phone login with password
3. **Signup Screen** — Basic registration (name, email, phone, password)

### Main App Screens
4. **Home Screen (Restaurant List)** — Discover restaurants with filters
5. **Restaurant Menu Screen** — Browse food items from a selected restaurant
6. **Item Detail Screen** — View item details, quantity selector, add to cart
7. **Cart Screen** — Review items, adjust quantities, proceed to checkout
8. **Checkout Screen** — Order confirmation with delivery details
9. **Order Success Screen** — Confirmation message with order ID
10. **Order History Screen** — List of past orders with details
11. **User Profile Screen** — User details, logout option

---

## Primary Content and Functionality

### 1. Splash Screen
- **Content**: App logo (Foodie branding), app name
- **Functionality**: Auto-dismiss after 2-3 seconds, redirect to login/home based on auth state

### 2. Login Screen
- **Content**: Email/phone input field, password input, login button, signup link
- **Functionality**: 
  - Validate email/phone format
  - Validate password (minimum 6 characters)
  - Store auth token in AsyncStorage
  - Navigate to home on success
  - Show error messages for invalid credentials

### 3. Signup Screen
- **Content**: Name, email, phone, password, confirm password fields, signup button, login link
- **Functionality**:
  - Validate all fields
  - Password confirmation check
  - Create user account (mock or backend)
  - Auto-login after signup
  - Navigate to home

### 4. Home Screen (Restaurant List)
- **Content**: 
  - Search bar (optional for MVP)
  - Restaurant cards with:
    - Restaurant image
    - Name
    - Rating (1-5 stars, static)
    - Short description (cuisine type)
    - Delivery time estimate
  - Tab bar with Home, Orders, Profile icons
- **Functionality**:
  - Display list of 8-10 mock restaurants
  - Tap restaurant → navigate to menu screen
  - Pull-to-refresh (optional)
  - Smooth scrolling

### 5. Restaurant Menu Screen
- **Content**:
  - Restaurant header (image, name, rating)
  - Food items list with:
    - Item image
    - Item name
    - Price
    - Short description
    - Add to cart button
- **Functionality**:
  - Display 10-15 mock food items
  - Tap item → show detail screen or inline quantity selector
  - Add to cart with default quantity (1)
  - Show cart badge with item count in header

### 6. Item Detail Screen
- **Content**:
  - Large item image
  - Item name, price, description
  - Quantity selector (-, count, +)
  - Special instructions text input (optional)
  - Add to Cart button
- **Functionality**:
  - Adjust quantity (min 1, max 10)
  - Add to cart with selected quantity
  - Show success toast/alert
  - Navigate back to menu

### 7. Cart Screen
- **Content**:
  - List of cart items with:
    - Item name, price, quantity
    - Remove button
    - Quantity adjuster (-, count, +)
  - Subtotal, taxes (mock), delivery fee (mock)
  - Total price
  - Checkout button
  - Continue Shopping button
- **Functionality**:
  - Persist cart in AsyncStorage
  - Update quantities in real-time
  - Remove items from cart
  - Calculate totals automatically
  - Disable checkout if cart is empty

### 8. Checkout Screen
- **Content**:
  - Order summary (items, total)
  - Delivery address (mock or user input)
  - Delivery time estimate
  - Place Order button
- **Functionality**:
  - Show order summary
  - Allow address input (optional for MVP)
  - Generate mock order ID
  - Save order to history
  - Clear cart on successful order

### 9. Order Success Screen
- **Content**:
  - Success message
  - Order ID
  - Estimated delivery time
  - Order details summary
  - Back to Home button
- **Functionality**:
  - Display for 3-5 seconds then auto-navigate to home
  - Or allow manual navigation

### 10. Order History Screen
- **Content**:
  - List of past orders with:
    - Order ID
    - Date and time
    - Total amount
    - Number of items
    - Status (Delivered, Pending, etc.)
  - Tap order → show order details
- **Functionality**:
  - Fetch orders from AsyncStorage
  - Display in reverse chronological order (newest first)
  - Show order details on tap
  - Reorder button (optional)

### 11. User Profile Screen
- **Content**:
  - User avatar (mock)
  - User name, email, phone
  - Edit profile button (optional)
  - Logout button
  - App version info
- **Functionality**:
  - Display logged-in user details
  - Logout → clear auth token, navigate to login
  - Show app version

---

## Key User Flows

### Flow 1: New User Registration & First Order
1. User launches app → Splash screen
2. Splash → Login screen
3. User taps "Sign Up" → Signup screen
4. User fills form → Signup screen validates → Creates account
5. Auto-login → Home screen
6. User browses restaurants → Taps restaurant → Menu screen
7. User browses items → Taps item → Item detail screen
8. User adjusts quantity → Taps "Add to Cart" → Cart screen
9. User reviews cart → Taps "Checkout" → Checkout screen
10. User confirms order → Order success screen
11. Auto-navigate to Home screen after 3 seconds

### Flow 2: Returning User Login & Reorder
1. User launches app → Splash screen
2. Splash → Home screen (if already logged in) or Login screen
3. User enters credentials → Home screen
4. User taps "Orders" tab → Order history screen
5. User taps past order → Order details
6. User taps "Reorder" → Cart screen with same items
7. User proceeds to checkout → Order success

### Flow 3: Browse & Add Multiple Items to Cart
1. User on Home screen → Taps restaurant → Menu screen
2. User adds Item A (qty 2) to cart
3. User adds Item B (qty 1) to cart
4. User continues browsing → Adds Item C (qty 3) to cart
5. User taps cart icon → Cart screen
6. User reviews all items, adjusts quantities
7. User taps "Checkout" → Checkout screen
8. User confirms → Order success

### Flow 4: Logout & Login
1. User on Profile screen → Taps "Logout"
2. Auth token cleared → Login screen
3. User enters credentials → Home screen

---

## Color Choices

### Brand Colors
- **Primary (Accent)**: `#FF6B35` — Warm orange for CTAs, highlights, and primary actions
- **Secondary**: `#004E89` — Deep blue for secondary actions and accents
- **Success**: `#22C55E` — Green for success states and confirmations

### Neutral Colors
- **Background**: `#FFFFFF` (Light mode), `#0F172A` (Dark mode)
- **Surface**: `#F8FAFC` (Light mode), `#1E293B` (Dark mode)
- **Text Primary**: `#0F172A` (Light mode), `#F1F5F9` (Dark mode)
- **Text Secondary**: `#64748B` (Light mode), `#94A3B8` (Dark mode)
- **Border**: `#E2E8F0` (Light mode), `#334155` (Dark mode)

### Semantic Colors
- **Error**: `#EF4444` — Red for errors and warnings
- **Warning**: `#F59E0B` — Amber for alerts
- **Info**: `#3B82F6` — Blue for informational messages

---

## Layout & Spacing Guidelines

### Typography
- **Heading 1 (Screen Titles)**: 28px, font-weight 700
- **Heading 2 (Section Titles)**: 20px, font-weight 600
- **Body (Regular Text)**: 16px, font-weight 400
- **Caption (Small Text)**: 12px, font-weight 400

### Spacing
- **Padding (Screen)**: 16px (horizontal), 20px (vertical)
- **Gap (Between Items)**: 12px (vertical), 16px (horizontal)
- **Corner Radius**: 12px (cards), 8px (buttons), 24px (large elements)

### Component Sizing
- **Button Height**: 48px (primary), 44px (secondary)
- **Card Height**: 160px (restaurant card), 120px (item card)
- **Tab Bar Height**: 56px + safe area bottom

---

## Navigation Structure

### Tab-Based Navigation (Main App)
- **Home Tab** → Home screen (restaurant list)
- **Orders Tab** → Order history screen
- **Profile Tab** → User profile screen

### Stack Navigation (Within Tabs)
- Home → Restaurant Menu → Item Detail → Cart → Checkout → Order Success
- Orders → Order Details
- Profile → (No sub-screens for MVP)

### Modal Navigation (Optional)
- Cart screen can be presented as a modal sheet (bottom sheet) for quick access

---

## Design Principles

1. **Clean & Minimal** — No unnecessary elements, focus on core functionality
2. **Card-Based Layout** — Restaurants and items displayed as cards for clarity
3. **Consistent Spacing** — Uniform padding and gaps throughout
4. **High Contrast** — Text and buttons are easily readable
5. **One-Handed Usage** — Interactive elements positioned for thumb reach
6. **Visual Hierarchy** — Important information is prominent (price, rating, CTA buttons)
7. **Feedback** — User actions provide immediate visual feedback (press states, toasts)
8. **Accessibility** — Sufficient touch targets (min 44x44pt), readable font sizes

---

## Data Structure (Mock Data)

### Restaurant
```
{
  id: string,
  name: string,
  image: string,
  rating: number,
  description: string,
  deliveryTime: string,
  items: MenuItem[]
}
```

### MenuItem
```
{
  id: string,
  name: string,
  price: number,
  description: string,
  image: string,
  category: string
}
```

### CartItem
```
{
  id: string,
  restaurantId: string,
  menuItem: MenuItem,
  quantity: number,
  specialInstructions: string
}
```

### Order
```
{
  id: string,
  date: string,
  items: CartItem[],
  total: number,
  status: string,
  deliveryAddress: string
}
```

---

## MVP Scope

### Included
- User authentication (login/signup)
- Restaurant browsing
- Menu viewing
- Cart management
- Order placement
- Order history
- User profile
- Persistent cart (AsyncStorage)

### Excluded (Future Enhancements)
- Live order tracking
- Real payment gateway
- Delivery partner system
- Chat/messaging
- Push notifications
- Multi-language support
- Advanced filters/search
- Ratings and reviews
- Promo codes
- Admin panel

---

## Development Priorities

1. **Phase 1**: Auth system + Home screen
2. **Phase 2**: Menu browsing + Item details
3. **Phase 3**: Cart management
4. **Phase 4**: Order placement + History
5. **Phase 5**: Profile screen + Polish

