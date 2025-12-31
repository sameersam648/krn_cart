# Restaurant Partner App - Interface Design

## Design Philosophy

The Restaurant Partner App is designed for **restaurant staff working in a fast-paced kitchen environment**. The interface prioritizes:

- **Large, touch-friendly buttons** for quick interactions with gloved hands
- **High contrast colors** for visibility in bright kitchen lighting
- **Minimal cognitive load** with clear status indicators
- **One-handed navigation** on mobile devices
- **Real-time order visibility** without unnecessary scrolling

All screens follow **iOS Human Interface Guidelines (HIG)** with a clean, professional aesthetic suitable for a first-party restaurant management app.

---

## Screen List

### 1. **Login Screen**
- Email and password input fields
- "Sign In" button
- Simple, focused layout
- No sign-up flow (single restaurant account per device)

### 2. **Order Dashboard (Main Screen)**
- **Tab Bar Navigation**: Home, Kitchen View, Profile
- List of all incoming orders sorted by time (newest first)
- Each order card shows:
  - Order ID (bold, large)
  - Customer name
  - Item count (e.g., "3 items")
  - Total amount
  - Order time / Time elapsed
  - Current status badge (New, Accepted, Preparing, Ready)
- **Pull-to-refresh** to fetch new orders
- **Floating action button** or section divider to separate new orders from accepted ones

### 3. **Order Details Screen**
- Full order breakdown
- Order ID and customer name at top
- **Items list** with quantity for each item
- Special instructions (if any) in a highlighted box
- Total amount
- Customer phone number (optional, for delivery coordination)
- **Action buttons**:
  - Accept Order (if New)
  - Start Preparing (if Accepted)
  - Mark Ready (if Preparing)
  - Complete Order (if Ready)
  - Reject Order (if New)
- Status timeline showing order progression

### 4. **Kitchen View Screen**
- Simplified, full-screen view optimized for kitchen display
- Large cards showing only **active orders** (Accepted, Preparing, Ready)
- Each card shows:
  - Order ID (very large)
  - Items list (large text)
  - Time elapsed (prominent)
  - Large status buttons for quick updates
- **Minimal navigation** - focus on current orders only
- No order details, just essential info

### 5. **Restaurant Profile Screen**
- Restaurant name (editable)
- Address (editable)
- Contact number (editable)
- Open/Close toggle (status indicator)
- Logout button
- App version info

---

## Primary Content and Functionality

### Order Dashboard
- **Content**: Real-time list of orders from customer app
- **Functionality**:
  - View all orders with status
  - Tap order to see details
  - Pull-to-refresh to fetch new orders
  - Visual separation of new vs. accepted orders

### Order Details
- **Content**: Full order information, items, customer details
- **Functionality**:
  - Accept/Reject order
  - Update status (Accepted → Preparing → Ready → Completed)
  - View special instructions
  - Navigate back to dashboard

### Kitchen View
- **Content**: Active orders only (Accepted, Preparing, Ready)
- **Functionality**:
  - Large, easy-to-read order information
  - Quick status updates via large buttons
  - Minimal distractions
  - Optimized for kitchen staff with limited attention

### Restaurant Profile
- **Content**: Restaurant details, account settings
- **Functionality**:
  - Edit restaurant info
  - Toggle open/close status
  - Logout

---

## Key User Flows

### Flow 1: Accepting and Preparing an Order
1. Staff sees new order in dashboard (badge shows "New")
2. Taps order to view details
3. Reviews items and special instructions
4. Taps "Accept Order" button
5. Order status changes to "Accepted"
6. Staff taps "Start Preparing"
7. Order status changes to "Preparing"
8. Staff works on order
9. Taps "Mark Ready" when done
10. Order status changes to "Ready for Pickup"
11. Delivery partner picks up order

### Flow 2: Rejecting an Order
1. Staff sees new order in dashboard
2. Taps order to view details
3. Reviews items
4. Taps "Reject Order" button (if unable to fulfill)
5. Order is removed from dashboard
6. Customer receives notification

### Flow 3: Kitchen View Quick Updates
1. Staff opens Kitchen View tab
2. Sees all active orders in large cards
3. Taps "Start Preparing" on a card
4. Taps "Mark Ready" when done
5. No need to navigate back to dashboard

### Flow 4: Checking Restaurant Status
1. Staff opens Profile tab
2. Sees restaurant open/close status
3. Can toggle status if needed
4. Can edit restaurant info

---

## Color Choices

### Brand Colors (Restaurant Partner Theme)
- **Primary**: `#FF6B35` (Warm Orange-Red) - Action buttons, highlights, status indicators
- **Secondary**: `#004E89` (Deep Blue) - Secondary actions, accents
- **Success**: `#22C55E` (Green) - Ready/Completed status
- **Warning**: `#F59E0B` (Amber) - Preparing status
- **Error**: `#EF4444` (Red) - Rejected/Error status
- **Background**: `#FFFFFF` (Light) / `#151718` (Dark)
- **Surface**: `#F5F5F5` (Light) / `#1E2022` (Dark)
- **Text Primary**: `#11181C` (Light) / `#ECEDEE` (Dark)
- **Text Secondary**: `#687076` (Light) / `#9BA1A6` (Dark)

### Status Badge Colors
- **New**: `#004E89` (Blue) - Requires attention
- **Accepted**: `#F59E0B` (Amber) - In progress
- **Preparing**: `#FF6B35` (Orange-Red) - Active work
- **Ready**: `#22C55E` (Green) - Complete, waiting for pickup
- **Completed**: `#687076` (Gray) - Archived

---

## Layout Specifications

### Portrait Orientation (9:16)
All screens are optimized for portrait orientation with one-handed usage in mind.

### Safe Area Handling
- Status bar: 44pt (iPhone X+) or 20pt (standard)
- Bottom safe area: 34pt (iPhone X+) or 0pt (standard)
- Tab bar: 56pt + bottom safe area

### Typography
- **Headings**: 28pt, bold (SF Pro Display)
- **Subheadings**: 18pt, semibold
- **Body**: 16pt, regular
- **Small text**: 14pt, regular
- **Captions**: 12pt, regular

### Spacing
- **Padding**: 16pt standard, 12pt compact
- **Gap between items**: 12pt
- **Card corners**: 12pt border radius
- **Button height**: 48pt (touch-friendly)

---

## Interaction Patterns

### Buttons
- **Primary buttons**: Full width, `#FF6B35`, white text, 48pt height
- **Secondary buttons**: Outlined, `#004E89`, 48pt height
- **Danger buttons**: Full width, `#EF4444`, white text, 48pt height
- **Press feedback**: Scale 0.97, haptic feedback (light impact)

### Cards
- **Order cards**: White/dark surface, 12pt radius, subtle shadow
- **Press feedback**: Opacity 0.7 on press
- **Swipe actions**: Optional (not required for MVP)

### Status Indicators
- **Badge**: 20pt height, rounded corners, bold text
- **Timeline**: Vertical line with status dots

---

## Navigation Structure

```
Tab Bar (3 tabs):
├── Home (Order Dashboard)
│   └── Order Details (modal or push)
├── Kitchen View (Simplified order view)
└── Profile (Restaurant settings)
```

---

## Accessibility

- **Color contrast**: All text meets WCAG AA standards (4.5:1 ratio)
- **Touch targets**: Minimum 44pt × 44pt for all interactive elements
- **Text size**: Respects system font size settings
- **Dark mode**: Full support with automatic color switching

---

## Performance Considerations

- **Lazy loading**: Order list loads incrementally
- **Caching**: Recent orders cached locally
- **Real-time sync**: WebSocket or polling for new orders
- **Offline mode**: Show cached orders if network unavailable

---

## Future Enhancements (Post-MVP)

- Push notifications for new orders
- Order history and analytics
- Multi-restaurant support
- Kitchen printer integration
- Delivery partner tracking
- Customer ratings and feedback
- Inventory management
- Staff management and roles
