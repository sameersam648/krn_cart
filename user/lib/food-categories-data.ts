export type SubcategoryType = 'VEG' | 'NON-VEG' | 'EGG';

export interface Hotel {
    id: string;
    name: string;
    image: string;
    rating: number;
    description: string;
    deliveryTime: string;
    type?: SubcategoryType[];
}

export interface FoodCategory {
    id: string;
    name: string;
    icon: string;
    route: string;
    hasSubcategory: boolean;
}

export interface VegetableItem {
    id: string;
    name: string;
    price: number;
    unit: string;
    image: string;
}

export interface ServiceItem {
    id: string;
    name: string;
    description: string;
    image: string;
    hasSubmenu?: boolean;
    submenuItems?: { id: string; name: string }[];
}

// 9 Main Food Categories (Vegetables moved to Book Now section)
export const foodCategories: FoodCategory[] = [
    { id: '1', name: 'BREAKFAST', icon: '🌅', route: '/categories/breakfast', hasSubcategory: false },
    { id: '2', name: 'LUNCH', icon: '🍱', route: '/categories/lunch', hasSubcategory: true },
    { id: '3', name: 'DINNER', icon: '🌙', route: '/categories/dinner', hasSubcategory: true },
    { id: '4', name: 'BAKERY', icon: '🥐', route: '/categories/bakery', hasSubcategory: false },
    { id: '5', name: 'BLUES', icon: '🍦', route: '/categories/blues', hasSubcategory: false },
    { id: '6', name: 'CHATS', icon: '🥘', route: '/categories/chats', hasSubcategory: false },
    { id: '7', name: 'BEVERAGES', icon: '🥤', route: '/categories/beverages', hasSubcategory: false },
    { id: '8', name: 'DAIRY ITEMS', icon: '🥛', route: '/categories/dairy', hasSubcategory: false },
    { id: '9', name: 'SERVICES', icon: '🛎️', route: '/categories/services', hasSubcategory: false },
];

// Hotels by Category
export const categoryHotels: Record<string, Hotel[]> = {
    // BREAKFAST
    breakfast: [
        {
            id: 'udupi',
            name: 'Udupi Hotel',
            image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
            rating: 4.5,
            description: 'Traditional South Indian breakfast',
            deliveryTime: '20-30 min',
        },
        {
            id: 'shree',
            name: 'Shree Hotel',
            image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&h=300&fit=crop',
            rating: 4.4,
            description: 'Delicious breakfast options',
            deliveryTime: '25-35 min',
        },
        {
            id: 'shree-tiffanis',
            name: 'Shree Tiffanis Hotel',
            image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop',
            rating: 4.3,
            description: 'Fresh tiffin items',
            deliveryTime: '20-30 min',
        },
        {
            id: 'shree-kanteshwara',
            name: 'Shree Kanteshwara Hotel',
            image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop',
            rating: 4.6,
            description: 'Quality breakfast meals',
            deliveryTime: '25-30 min',
        },
        {
            id: 'mahanteshanna',
            name: 'Mahanteshanna Hotel',
            image: 'https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=400&h=300&fit=crop',
            rating: 4.4,
            description: 'Authentic local breakfast',
            deliveryTime: '30-35 min',
        },
    ],

    // LUNCH - VEG
    'lunch-veg': [
        {
            id: 'udupi-lunch',
            name: 'Udupi Hotel',
            image: 'https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=400&h=300&fit=crop',
            rating: 4.5,
            description: 'Pure vegetarian meals',
            deliveryTime: '30-40 min',
            type: ['VEG'],
        },
        {
            id: 'sri-kanteshwara-lunch',
            name: 'Sri Kanteshwara Hotel',
            image: 'https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=400&h=300&fit=crop',
            rating: 4.6,
            description: 'Traditional vegetarian',
            deliveryTime: '30-40 min',
            type: ['VEG'],
        },
        {
            id: 'halli-mane-uta-veg',
            name: 'Halli Mane Uta',
            image: 'https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=400&h=300&fit=crop',
            rating: 4.7,
            description: 'Village style veg meals',
            deliveryTime: '35-45 min',
            type: ['VEG'],
        },
    ],

    // LUNCH - NON-VEG
    'lunch-nonveg': [
        {
            id: 'gowda-palav',
            name: 'Gowda Palav',
            image: 'https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=400&h=300&fit=crop',
            rating: 4.6,
            description: 'Special non-veg palav',
            deliveryTime: '40-50 min',
            type: ['NON-VEG'],
        },
        {
            id: 'ganis-family',
            name: "Gani's Family Resturents",
            image: 'https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=400&h=300&fit=crop',
            rating: 4.5,
            description: 'Family restaurant',
            deliveryTime: '35-45 min',
            type: ['NON-VEG'],
        },
        {
            id: 'halli-mane-uta-nonveg',
            name: 'Halli Mane Uta',
            image: 'https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=400&h=300&fit=crop',
            rating: 4.7,
            description: 'Village style non-veg',
            deliveryTime: '35-45 min',
            type: ['NON-VEG'],
        },
    ],

    // LUNCH - EGG
    'lunch-egg': [
        {
            id: 'gowda-palav-egg',
            name: 'Gowda Palav',
            image: 'https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=400&h=300&fit=crop',
            rating: 4.6,
            description: 'Egg specialties',
            deliveryTime: '40-50 min',
            type: ['EGG'],
        },
        {
            id: 'ganis-family-egg',
            name: "Gani's Family Resturents",
            image: 'https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=400&h=300&fit=crop',
            rating: 4.5,
            description: 'Egg preparations',
            deliveryTime: '35-45 min',
            type: ['EGG'],
        },
        {
            id: 'halli-mane-uta-egg',
            name: 'Halli Mane Uta',
            image: 'https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=400&h=300&fit=crop',
            rating: 4.7,
            description: 'Village style egg dishes',
            deliveryTime: '35-45 min',
            type: ['EGG'],
        },
    ],

    // DINNER - VEG
    'dinner-veg': [
        {
            id: 'udupi-dinner',
            name: 'Udupi Hotel',
            image: 'https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=400&h=300&fit=crop',
            rating: 4.5,
            description: 'Pure vegetarian dinner',
            deliveryTime: '30-40 min',
            type: ['VEG'],
        },
        {
            id: 'sri-kanteshwara-dinner',
            name: 'Sri Kanteshwara Hotel',
            image: 'https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=400&h=300&fit=crop',
            rating: 4.6,
            description: 'Traditional vegetarian dinner',
            deliveryTime: '30-40 min',
            type: ['VEG'],
        },
        {
            id: 'halli-mane-uta-veg-dinner',
            name: 'Halli Mane Uta',
            image: 'https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=400&h=300&fit=crop',
            rating: 4.7,
            description: 'Village style veg dinner',
            deliveryTime: '35-45 min',
            type: ['VEG'],
        },
    ],

    // DINNER - NON-VEG
    'dinner-nonveg': [
        {
            id: 'gowda-palav-dinner',
            name: 'Gowda Palav',
            image: 'https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=400&h=300&fit=crop',
            rating: 4.6,
            description: 'Special non-veg dinner',
            deliveryTime: '40-50 min',
            type: ['NON-VEG'],
        },
        {
            id: 'ganis-family-dinner',
            name: "Gani's Family Resturents",
            image: 'https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=400&h=300&fit=crop',
            rating: 4.5,
            description: 'Family dinner specials',
            deliveryTime: '35-45 min',
            type: ['NON-VEG'],
        },
        {
            id: 'halli-mane-uta-nonveg-dinner',
            name: 'Halli Mane Uta',
            image: 'https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=400&h=300&fit=crop',
            rating: 4.7,
            description: 'Village style non-veg dinner',
            deliveryTime: '35-45 min',
            type: ['NON-VEG'],
        },
    ],

    // DINNER - EGG
    'dinner-egg': [
        {
            id: 'gowda-palav-egg-dinner',
            name: 'Gowda Palav',
            image: 'https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=400&h=300&fit=crop',
            rating: 4.6,
            description: 'Egg dinner specials',
            deliveryTime: '40-50 min',
            type: ['EGG'],
        },
        {
            id: 'ganis-family-egg-dinner',
            name: "Gani's Family Resturents",
            image: 'https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=400&h=300&fit=crop',
            rating: 4.5,
            description: 'Egg dinner options',
            deliveryTime: '35-45 min',
            type: ['EGG'],
        },
        {
            id: 'halli-mane-uta-egg-dinner',
            name: 'Halli Mane Uta',
            image: 'https://images.unsplash.com/photo-1585937421612-70a19fb6930b?w=400&h=300&fit=crop',
            rating: 4.7,
            description: 'Village style egg dinner',
            deliveryTime: '35-45 min',
            type: ['EGG'],
        },
    ],

    // BAKERY
    bakery: [
        {
            id: 'vb-bakery',
            name: 'V B Bakery',
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
            rating: 4.4,
            description: 'Fresh baked goods',
            deliveryTime: '15-25 min',
        },
        {
            id: 'vasavi-bakery',
            name: 'Vasavi Bakery',
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
            rating: 4.5,
            description: 'Premium bakery items',
            deliveryTime: '15-25 min',
        },
        {
            id: 'kamadenu-bakery',
            name: 'Kamadenu Bakery',
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
            rating: 4.3,
            description: 'Traditional bakery',
            deliveryTime: '20-30 min',
        },
    ],

    // BLUES (Ice Cream)
    blues: [
        {
            id: 'ice-magic',
            name: 'Ice Magic',
            image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop',
            rating: 4.7,
            description: 'Premium ice creams',
            deliveryTime: '15-20 min',
        },
    ],

    // CHATS
    chats: [
        {
            id: 'raj-kumar-panipuri',
            name: 'Raj Kumar Panipuri',
            image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
            rating: 4.6,
            description: 'Spicy panipuri specialist',
            deliveryTime: '10-20 min',
        },
        {
            id: 'disha-gobi',
            name: 'Disha Gobi',
            image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
            rating: 4.4,
            description: 'Gobi manchurian and snacks',
            deliveryTime: '15-25 min',
        },
        {
            id: 'bajji-bonda-store',
            name: 'Bajji-Bonda Store',
            image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
            rating: 4.3,
            description: 'Hot bajjis and bondas',
            deliveryTime: '10-15 min',
        },
        {
            id: 'udupi-chats',
            name: 'Udupi Hotel',
            image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
            rating: 4.5,
            description: 'Chat items',
            deliveryTime: '20-30 min',
        },
    ],

    // BEVERAGES
    beverages: [
        {
            id: 'tirumala-juice',
            name: 'Tirumala Juice',
            image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop',
            rating: 4.6,
            description: 'Fresh fruit juices',
            deliveryTime: '10-15 min',
        },
        {
            id: 'ice-magic-beverages',
            name: 'Ice Magic',
            image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop',
            rating: 4.7,
            description: 'Shakes and beverages',
            deliveryTime: '15-20 min',
        },
        {
            id: 'udupi-beverages',
            name: 'Udupi Hotel',
            image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop',
            rating: 4.5,
            description: 'Traditional beverages',
            deliveryTime: '20-30 min',
        },
    ],

    // DAIRY
    dairy: [
        {
            id: 'nandini-milk',
            name: 'Nandini MILK',
            image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop',
            rating: 4.8,
            description: 'Fresh dairy products',
            deliveryTime: '10-15 min',
        },
    ],
};

// Vegetables (Direct Items - No Hotels)
export const vegetableItems: VegetableItem[] = [
    {
        id: 'veg-1',
        name: 'Tomato',
        price: 40,
        unit: 'per kg',
        image: 'https://images.unsplash.com/photo-1546470427-227e1bbd0fdc?w=400&h=300&fit=crop',
    },
    {
        id: 'veg-2',
        name: 'Potato',
        price: 30,
        unit: 'per kg',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
    },
    {
        id: 'veg-3',
        name: 'Onion',
        price: 35,
        unit: 'per kg',
        image: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb7?w=400&h=300&fit=crop',
    },
    {
        id: 'veg-4',
        name: 'Carrot',
        price: 50,
        unit: 'per kg',
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop',
    },
    {
        id: 'veg-5',
        name: 'Cabbage',
        price: 25,
        unit: 'per piece',
        image: 'https://images.unsplash.com/photo-1594282486551-0b0fe6e87248?w=400&h=300&fit=crop',
    },
    {
        id: 'veg-6',
        name: 'Cauliflower',
        price: 40,
        unit: 'per piece',
        image: 'https://images.unsplash.com/photo-1568584711271-6b8c2f7c3e52?w=400&h=300&fit=crop',
    },
    {
        id: 'veg-7',
        name: 'Beans',
        price: 60,
        unit: 'per kg',
        image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&h=300&fit=crop',
    },
    {
        id: 'veg-8',
        name: 'Capsicum',
        price: 70,
        unit: 'per kg',
        image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=300&fit=crop',
    },
    {
        id: 'veg-9',
        name: 'Brinjal',
        price: 45,
        unit: 'per kg',
        image: 'https://images.unsplash.com/photo-1659261200833-ec6fb3f50691?w=400&h=300&fit=crop',
    },
    {
        id: 'veg-10',
        name: 'Spinach',
        price: 40,
        unit: 'per bunch',
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop',
    },
    {
        id: 'veg-11',
        name: 'Coriander',
        price: 20,
        unit: 'per bunch',
        image: 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400&h=300&fit=crop',
    },
    {
        id: 'veg-12',
        name: 'Green Chilli',
        price: 80,
        unit: 'per kg',
        image: 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400&h=300&fit=crop',
    },
];

// Services
export const serviceItems: ServiceItem[] = [
    {
        id: 'service-1',
        name: 'Milk Service',
        description: 'Daily milk delivery',
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop',
    },
    {
        id: 'service-2',
        name: '20 Liter Water Can',
        description: 'Water delivery service',
        image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop',
    },
    {
        id: 'service-3',
        name: 'Meats',
        description: 'Fresh meat delivery',
        image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop',
        hasSubmenu: true,
        submenuItems: [
            { id: 'meat-1', name: 'Mutton' },
            { id: 'meat-2', name: 'Fish' },
            { id: 'meat-3', name: 'Chicken' },
        ],
    },
];
