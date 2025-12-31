# Foodie MVP - Food Ordering Application

A clean, simple, and beginner-friendly mobile food ordering application built with React Native, Expo, and TypeScript. This MVP demonstrates core food delivery app functionality including user authentication, restaurant browsing, menu viewing, cart management, and order history.

## Features

### Authentication
- **User Registration**: Simple signup with name, email, phone, and password
- **User Login**: Email/password authentication with validation
- **Session Persistence**: Auth state persists across app sessions using AsyncStorage
- **Logout**: Secure logout with confirmation

### Restaurant Browsing
- **Restaurant List**: Browse 8 featured restaurants with images, ratings, and delivery times
- **Restaurant Details**: View restaurant name, description, and cuisine type
- **Ratings**: Star ratings for each restaurant (1-5 stars)
- **Delivery Information**: Estimated delivery time for each restaurant

### Menu & Items
- **Food Items**: 5-6 items per restaurant with images, prices, and descriptions
- **Item Categories**: Items organized by category (Pizza, Burgers, Sushi, etc.)
- **Item Details**: View full item information including price and description
- **Quantity Selector**: Easily adjust item quantity (1-10) before adding to cart

### Shopping Cart
- **Add to Cart**: Add items from any restaurant to your cart
- **Quantity Management**: Increase or decrease item quantities
- **Remove Items**: Remove unwanted items from cart
- **Cart Persistence**: Cart data persists until order is placed
- **Price Calculation**: Automatic calculation of subtotal, tax (5%), delivery fee (₹50), and total

### Order Management
- **Place Order**: Simple one-click order placement
- **Order Confirmation**: Instant order confirmation with unique order ID
- **Order History**: View all past orders with dates, totals, and items
- **Order Details**: See full order information including delivery address and status

### User Profile
- **Profile Information**: View user details (name, email, phone)
- **User Avatar**: Initial-based avatar display
- **App Version**: Display current app version
- **Account Management**: Easy logout with confirmation

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React Native** | Cross-platform mobile development |
| **Expo** | Development framework and build system |
| **TypeScript** | Type-safe JavaScript |
| **React Navigation** | Tab-based navigation |
| **Expo Router** | File-based routing |
| **NativeWind** | Tailwind CSS for React Native |
| **AsyncStorage** | Local data persistence |
| **React Context** | State management (Auth, Cart, Orders) |
| **Vitest** | Unit testing framework |

## Project Structure

```
app/
├── _layout.tsx                 # Root layout with providers
├── (tabs)/                     # Tab-based navigation
│   ├── _layout.tsx            # Tab configuration
│   ├── index.tsx              # Home screen (restaurants)
│   ├── cart.tsx               # Shopping cart
│   ├── orders.tsx             # Order history
│   └── profile.tsx            # User profile
├── (auth)/                     # Authentication screens
│   ├── _layout.tsx            # Auth layout
│   ├── login.tsx              # Login screen
│   └── signup.tsx             # Signup screen
└── restaurant/                 # Restaurant menu
    ├── _layout.tsx            # Restaurant layout
    └── [id].tsx               # Restaurant menu screen

components/
├── screen-container.tsx        # SafeArea wrapper component
├── haptic-tab.tsx             # Haptic feedback for tabs
└── ui/
    └── icon-symbol.tsx        # Icon mapping

lib/
├── mock-data.ts               # Mock restaurant & menu data
├── auth-context.tsx           # Authentication context
├── cart-context.tsx           # Shopping cart context
├── orders-context.tsx         # Order history context
├── utils.ts                   # Utility functions
└── theme-provider.tsx         # Theme management

hooks/
├── use-auth.ts                # Auth hook
├── use-colors.ts              # Theme colors hook
└── use-color-scheme.ts        # Dark/light mode hook

assets/
├── images/
│   ├── icon.png              # App icon
│   ├── splash-icon.png       # Splash screen icon
│   └── favicon.png           # Web favicon

theme.config.js               # Theme color configuration
tailwind.config.js            # Tailwind CSS configuration
app.config.ts                 # Expo configuration
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- Expo CLI (optional, can use `npx expo`)
- iOS Simulator or Android Emulator (or physical device with Expo Go)

### Installation

1. **Clone or navigate to the project**
   ```bash
   cd food-ordering-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open in Expo Go**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS Simulator
   - Or press `a` for Android Emulator

### Demo Credentials

For testing the app without creating a new account:

| Field | Value |
|-------|-------|
| Email | demo@example.com |
| Password | password123 |

## Usage Guide

### First-Time User Flow

1. **Launch App** → Splash screen appears
2. **Sign Up** → Create account with name, email, phone, password
3. **Home Screen** → Browse 8 featured restaurants
4. **Select Restaurant** → View menu items
5. **Add Items** → Select quantity and add to cart
6. **View Cart** → Review items, adjust quantities
7. **Place Order** → Confirm and place order
8. **Order Confirmation** → See order ID and details
9. **View Orders** → Check order history anytime

### Returning User Flow

1. **Login** → Enter email and password
2. **Browse Restaurants** → Same as first-time user
3. **Repeat Steps 4-9** above

### Navigation

- **Home Tab** → Browse restaurants and add items
- **Cart Tab** → View and manage shopping cart
- **Orders Tab** → View order history
- **Profile Tab** → View user details and logout

## Features Explained

### Authentication System

The app uses a mock authentication system with AsyncStorage for persistence. In production, this would connect to a real backend API.

- **Validation**: Email format, password length (6+ chars), phone length (10+ digits)
- **Session Management**: User session persists until logout
- **Error Handling**: Clear error messages for validation failures

### Cart Management

The cart system uses React Context for state management and AsyncStorage for persistence.

- **Add Items**: Items are added with default quantity of 1
- **Merge Items**: Adding the same item increases quantity instead of duplicating
- **Quantity Limits**: Items can have 1-10 quantity
- **Automatic Calculations**: Prices update automatically based on quantities
- **Persistent Storage**: Cart survives app restarts until order is placed

### Order System

Orders are created with unique IDs and stored in AsyncStorage.

- **Order ID Format**: `ORD-XXXXXXXXX` (unique alphanumeric)
- **Order Status**: Currently shows "Confirmed" (can be extended for real tracking)
- **Order History**: Orders sorted by date (newest first)
- **Order Details**: Includes items, total, delivery address, and date

### Data Persistence

All user data is stored locally using AsyncStorage:

- **User Data** → Stored in `user` key
- **Cart Data** → Stored in `cart` key
- **Orders Data** → Stored in `orders` key

## Customization

### Changing App Name

Edit `app.config.ts`:
```typescript
const env = {
  appName: "Your App Name",
  appSlug: "your-app-slug",
  // ...
};
```

### Updating Colors

Edit `theme.config.js`:
```javascript
const themeColors = {
  primary: { light: '#YOUR_COLOR', dark: '#YOUR_COLOR' },
  // ... other colors
};
```

### Adding Restaurants

Edit `lib/mock-data.ts` and add new restaurants to the `mockRestaurants` array.

### Modifying Menu Items

Each restaurant in `mockRestaurants` has an `items` array. Add or modify items there.

## Testing

The app includes comprehensive unit tests covering:

- **Authentication**: Validation, login, signup
- **Cart Management**: Add, remove, update quantities, calculations
- **Order Management**: Order creation, history
- **Data Validation**: Restaurant and menu item structures
- **Business Logic**: Quantity limits, empty cart prevention

### Run Tests

```bash
pnpm test
# or
npm test
```

### Test Coverage

- 27 unit tests
- Authentication validation
- Cart operations
- Order management
- Data persistence
- Business logic

## Performance Considerations

- **FlatList**: Used for all scrollable lists (restaurants, menu items, cart, orders)
- **Image Optimization**: External images from Unsplash (optimized CDN)
- **Lazy Loading**: Screens load on demand
- **Context API**: Efficient state management without unnecessary re-renders

## Accessibility

- **Touch Targets**: All buttons are 44x44pt minimum
- **Color Contrast**: High contrast text for readability
- **Font Sizes**: Readable font sizes throughout
- **Safe Area**: Proper handling of notches and home indicators

## Limitations & Future Enhancements

### Current Limitations

- No real payment gateway (mock only)
- No live order tracking
- No real-time notifications
- No delivery partner system
- No chat/messaging
- No advanced search or filters
- No user ratings/reviews

### Planned Enhancements

- Real payment integration (Stripe, PayPal)
- Live order tracking with map
- Push notifications
- Advanced search and filters
- User ratings and reviews
- Favorite restaurants
- Promo codes and discounts
- Multiple delivery addresses
- Order scheduling
- Admin dashboard

## Troubleshooting

### App Won't Start

1. Clear cache: `expo start -c`
2. Reinstall dependencies: `rm -rf node_modules && pnpm install`
3. Check Node version: `node --version` (should be 18+)

### Cart Data Not Persisting

- Check if AsyncStorage is properly initialized
- Verify device has sufficient storage
- Clear app cache and try again

### Navigation Issues

- Ensure all route files are in correct directories
- Check `_layout.tsx` files for proper configuration
- Verify route names match between navigation and file structure

### Authentication Issues

- Clear AsyncStorage: Delete app and reinstall
- Check email format validation
- Verify password is at least 6 characters

## Browser Compatibility

The app works on:

- **iOS**: iOS 13+
- **Android**: Android 6+
- **Web**: Modern browsers (Chrome, Safari, Firefox, Edge)

## Deployment

### iOS

```bash
eas build --platform ios
```

### Android

```bash
eas build --platform android
```

### Web

```bash
expo export --platform web
```

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review the design document (`design.md`)
3. Check the todo list (`todo.md`)
4. Review test cases for expected behavior

## Credits

- **UI Design**: Inspired by iOS Human Interface Guidelines
- **Icons**: Material Icons via Expo Vector Icons
- **Images**: Unsplash
- **Framework**: Expo and React Native community

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Status**: MVP Complete ✓
