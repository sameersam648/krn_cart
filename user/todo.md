# Foodie MVP - Project TODO

## Phase 1: Project Setup & Branding
- [x] Generate custom app logo and update branding
- [x] Update app.config.ts with app name and logo URL
- [x] Configure theme colors in theme.config.js
- [x] Set up project structure and mock data

## Phase 2: Authentication System
- [x] Create Login screen with email/phone and password fields
- [x] Create Signup screen with name, email, phone, password fields
- [x] Implement auth context for state management
- [x] Add AsyncStorage persistence for auth token
- [x] Implement login validation and error handling
- [x] Implement signup validation and error handling
- [x] Create auth flow (redirect to home if logged in, to login if not)
- [x] Add logout functionality

## Phase 3: Home Screen & Restaurant Browsing
- [x] Create mock restaurant data (8-10 restaurants)
- [x] Build Home screen with restaurant list
- [x] Design restaurant card component with image, name, rating, description
- [x] Implement navigation to restaurant menu screen
- [ ] Add pull-to-refresh functionality (optional)
- [x] Display cart badge with item count in header

## Phase 4: Restaurant Menu & Item Details
- [x] Create mock menu items data (10-15 items per restaurant)
- [x] Build Restaurant Menu screen with food items list
- [x] Design food item card component
- [x] Create Item Detail screen with quantity selector
- [x] Implement add to cart functionality
- [x] Show success feedback when item added to cart
- [x] Add back navigation

## Phase 5: Cart Management
- [x] Create Cart screen with item list
- [x] Implement cart context for state management
- [x] Add AsyncStorage persistence for cart
- [x] Build quantity adjuster (-, count, +) for cart items
- [x] Implement remove item from cart
- [x] Calculate subtotal, taxes, delivery fee, and total
- [x] Disable checkout if cart is empty
- [x] Add continue shopping button

## Phase 6: Order Placement & Success
- [x] Create Checkout screen with order summary (integrated into cart)
- [x] Add delivery address input (mock)
- [x] Implement place order functionality
- [x] Generate mock order ID
- [x] Create Order Success screen with confirmation message
- [x] Save order to AsyncStorage
- [x] Clear cart after successful order
- [ ] Auto-navigate to home after 3-5 seconds

## Phase 7: Order History
- [x] Create Order History screen
- [x] Display list of past orders with date, total, item count
- [x] Implement order details view
- [ ] Add reorder functionality (optional)
- [x] Fetch orders from AsyncStorage

## Phase 8: User Profile
- [x] Create User Profile screen
- [x] Display user details (name, email, phone)
- [x] Add logout button with confirmation
- [x] Show app version info
- [ ] Add edit profile button (optional)

## Phase 9: Tab Navigation
- [x] Set up tab bar with Home, Orders, Profile icons
- [x] Implement tab icon mapping in icon-symbol.tsx
- [x] Connect tabs to respective screens
- [x] Ensure proper navigation between tabs

## Phase 10: Testing & Polish
- [x] Test all user flows end-to-end
- [x] Verify cart persistence across app sessions
- [x] Test auth state persistence
- [x] Check responsive design on different screen sizes
- [x] Verify all buttons and links work
- [x] Test error handling and validation
- [x] Optimize performance (FlatList for lists)
- [x] Add loading states where needed
- [x] Verify dark mode support

## Phase 11: Final Delivery
- [ ] Create checkpoint for deployment
- [x] Prepare documentation and README
- [ ] Generate QR code for testing on device
- [x] Verify all features work on iOS and Android

