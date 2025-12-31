export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  description: string;
  deliveryTime: string;
  items: MenuItem[];
}

export interface CartItem {
  id: string;
  restaurantId: string;
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: string;
  deliveryAddress: string;
  orderType?: OrderType;
  scheduledDateTime?: string;
  subscriptionData?: SubscriptionData;
  customOrderData?: CustomOrderData;
}

export type OrderType = 'quick' | 'scheduled' | 'regular' | 'custom';

export interface SubscriptionData {
  frequency: 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  occurrences: number;
}

export interface CustomOrderData {
  photoUri?: string;
  audioUri?: string;
  description?: string;
}

// Mock restaurant data
export const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Pizza Paradise",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop",
    rating: 4.5,
    description: "Authentic Italian pizzas and pasta",
    deliveryTime: "30-40 min",
    items: [
      {
        id: "1-1",
        name: "Margherita Pizza",
        price: 299,
        description: "Fresh mozzarella, tomato, and basil",
        image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop",
        category: "Pizza",
      },
      {
        id: "1-2",
        name: "Pepperoni Pizza",
        price: 349,
        description: "Classic pepperoni with mozzarella",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07f4ee?w=400&h=300&fit=crop",
        category: "Pizza",
      },
      {
        id: "1-3",
        name: "Veggie Supreme",
        price: 329,
        description: "Bell peppers, onions, mushrooms, olives",
        image: "https://images.unsplash.com/photo-1511689915661-c52646673ae1?w=400&h=300&fit=crop",
        category: "Pizza",
      },
      {
        id: "1-4",
        name: "Spaghetti Carbonara",
        price: 279,
        description: "Creamy sauce with bacon and parmesan",
        image: "https://images.unsplash.com/photo-1612874742237-6526221fcf1f?w=400&h=300&fit=crop",
        category: "Pasta",
      },
      {
        id: "1-5",
        name: "Fettuccine Alfredo",
        price: 259,
        description: "Creamy parmesan sauce with fettuccine",
        image: "https://images.unsplash.com/photo-1645112411341-6c4ee32510d8?w=400&h=300&fit=crop",
        category: "Pasta",
      },
    ],
  },
  {
    id: "2",
    name: "Burger Bliss",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    rating: 4.3,
    description: "Juicy burgers and crispy fries",
    deliveryTime: "20-30 min",
    items: [
      {
        id: "2-1",
        name: "Classic Cheeseburger",
        price: 199,
        description: "Beef patty with cheddar and lettuce",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
        category: "Burgers",
      },
      {
        id: "2-2",
        name: "Bacon Burger",
        price: 249,
        description: "Beef patty with crispy bacon and cheese",
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop",
        category: "Burgers",
      },
      {
        id: "2-3",
        name: "Double Patty Burger",
        price: 299,
        description: "Two beef patties with cheese and toppings",
        image: "https://images.unsplash.com/photo-1550547990-25967502a51c?w=400&h=300&fit=crop",
        category: "Burgers",
      },
      {
        id: "2-4",
        name: "Crispy Fries",
        price: 99,
        description: "Golden crispy fries with salt",
        image: "https://images.unsplash.com/photo-1584054505923-5ac028344000?w=400&h=300&fit=crop",
        category: "Sides",
      },
      {
        id: "2-5",
        name: "Onion Rings",
        price: 129,
        description: "Crispy battered onion rings",
        image: "https://images.unsplash.com/photo-1639024471694-d6ace3bac628?w=400&h=300&fit=crop",
        category: "Sides",
      },
    ],
  },
  {
    id: "3",
    name: "Sushi Sensation",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
    rating: 4.7,
    description: "Fresh sushi and Japanese delicacies",
    deliveryTime: "35-45 min",
    items: [
      {
        id: "3-1",
        name: "California Roll",
        price: 249,
        description: "Crab, avocado, and cucumber",
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
        category: "Sushi",
      },
      {
        id: "3-2",
        name: "Salmon Nigiri",
        price: 199,
        description: "Fresh salmon on rice (6 pieces)",
        image: "https://images.unsplash.com/photo-1614707267537-b85faf00021b?w=400&h=300&fit=crop",
        category: "Sushi",
      },
      {
        id: "3-3",
        name: "Spicy Tuna Roll",
        price: 229,
        description: "Spicy tuna with cucumber and avocado",
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
        category: "Sushi",
      },
      {
        id: "3-4",
        name: "Edamame",
        price: 129,
        description: "Steamed soybeans with salt",
        image: "https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=400&h=300&fit=crop",
        category: "Appetizers",
      },
      {
        id: "3-5",
        name: "Miso Soup",
        price: 99,
        description: "Traditional miso soup with tofu",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
        category: "Soups",
      },
    ],
  },
  {
    id: "4",
    name: "Taco Fiesta",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop",
    rating: 4.4,
    description: "Authentic Mexican tacos and burritos",
    deliveryTime: "25-35 min",
    items: [
      {
        id: "4-1",
        name: "Chicken Tacos",
        price: 179,
        description: "Three soft tacos with grilled chicken",
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop",
        category: "Tacos",
      },
      {
        id: "4-2",
        name: "Beef Burrito",
        price: 219,
        description: "Flour tortilla with seasoned beef and beans",
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop",
        category: "Burritos",
      },
      {
        id: "4-3",
        name: "Vegetable Quesadilla",
        price: 189,
        description: "Grilled tortilla with cheese and veggies",
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop",
        category: "Quesadillas",
      },
      {
        id: "4-4",
        name: "Churros",
        price: 129,
        description: "Fried dough with cinnamon sugar",
        image: "https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=400&h=300&fit=crop",
        category: "Desserts",
      },
      {
        id: "4-5",
        name: "Guacamole & Chips",
        price: 149,
        description: "Fresh guacamole with tortilla chips",
        image: "https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=400&h=300&fit=crop",
        category: "Appetizers",
      },
    ],
  },
  {
    id: "5",
    name: "Biryani House",
    image: "https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=400&h=300&fit=crop",
    rating: 4.6,
    description: "Authentic Indian biryani and curries",
    deliveryTime: "30-40 min",
    items: [
      {
        id: "5-1",
        name: "Chicken Biryani",
        price: 249,
        description: "Fragrant rice with tender chicken",
        image: "https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=400&h=300&fit=crop",
        category: "Biryani",
      },
      {
        id: "5-2",
        name: "Mutton Biryani",
        price: 299,
        description: "Aromatic rice with tender mutton",
        image: "https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=400&h=300&fit=crop",
        category: "Biryani",
      },
      {
        id: "5-3",
        name: "Butter Chicken",
        price: 229,
        description: "Creamy tomato sauce with chicken",
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop",
        category: "Curries",
      },
      {
        id: "5-4",
        name: "Paneer Tikka",
        price: 189,
        description: "Grilled cottage cheese with spices",
        image: "https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=400&h=300&fit=crop",
        category: "Appetizers",
      },
      {
        id: "5-5",
        name: "Naan Bread",
        price: 79,
        description: "Traditional Indian flatbread",
        image: "https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=400&h=300&fit=crop",
        category: "Breads",
      },
    ],
  },
  {
    id: "6",
    name: "Poke Bowl Co",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    rating: 4.5,
    description: "Fresh poke bowls and salads",
    deliveryTime: "15-25 min",
    items: [
      {
        id: "6-1",
        name: "Salmon Poke Bowl",
        price: 279,
        description: "Fresh salmon with rice and toppings",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
        category: "Poke Bowls",
      },
      {
        id: "6-2",
        name: "Tuna Poke Bowl",
        price: 269,
        description: "Fresh tuna with rice and vegetables",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
        category: "Poke Bowls",
      },
      {
        id: "6-3",
        name: "Veggie Bowl",
        price: 189,
        description: "Mixed vegetables with quinoa",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
        category: "Bowls",
      },
      {
        id: "6-4",
        name: "Green Salad",
        price: 149,
        description: "Fresh mixed greens with dressing",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
        category: "Salads",
      },
      {
        id: "6-5",
        name: "Mango Smoothie",
        price: 129,
        description: "Fresh mango smoothie",
        image: "https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=400&h=300&fit=crop",
        category: "Beverages",
      },
    ],
  },
  {
    id: "7",
    name: "Pasta Perfetto",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop",
    rating: 4.4,
    description: "Premium pasta and Italian dishes",
    deliveryTime: "28-38 min",
    items: [
      {
        id: "7-1",
        name: "Lasagna",
        price: 289,
        description: "Layers of pasta with meat sauce",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop",
        category: "Pasta",
      },
      {
        id: "7-2",
        name: "Penne Arrabbiata",
        price: 249,
        description: "Spicy tomato sauce with penne",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop",
        category: "Pasta",
      },
      {
        id: "7-3",
        name: "Ravioli",
        price: 269,
        description: "Cheese-filled ravioli with sauce",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop",
        category: "Pasta",
      },
      {
        id: "7-4",
        name: "Garlic Bread",
        price: 99,
        description: "Toasted bread with garlic butter",
        image: "https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=400&h=300&fit=crop",
        category: "Sides",
      },
      {
        id: "7-5",
        name: "Tiramisu",
        price: 159,
        description: "Classic Italian dessert",
        image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&h=300&fit=crop",
        category: "Desserts",
      },
    ],
  },
  {
    id: "8",
    name: "Chicken Express",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop",
    rating: 4.2,
    description: "Crispy fried chicken and wings",
    deliveryTime: "20-30 min",
    items: [
      {
        id: "8-1",
        name: "Fried Chicken Bucket",
        price: 399,
        description: "8 pieces of crispy fried chicken",
        image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop",
        category: "Chicken",
      },
      {
        id: "8-2",
        name: "Chicken Wings",
        price: 249,
        description: "6 pieces of spicy wings",
        image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop",
        category: "Chicken",
      },
      {
        id: "8-3",
        name: "Chicken Tenders",
        price: 199,
        description: "4 crispy chicken tenders",
        image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop",
        category: "Chicken",
      },
      {
        id: "8-4",
        name: "Coleslaw",
        price: 79,
        description: "Fresh coleslaw salad",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
        category: "Sides",
      },
      {
        id: "8-5",
        name: "Soft Drink",
        price: 49,
        description: "250ml soft drink",
        image: "https://images.unsplash.com/photo-1554866585-acbb2f46b34c?w=400&h=300&fit=crop",
        category: "Beverages",
      },
    ],
  },
];
