import { Product, User, Order, PaymentGateway, ShippingPartner } from '../contexts/AppContext';

// Generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock Products Data
export const mockProducts: Product[] = [
  {
    id: generateId(),
    name: "Premium Whole Wheat Atta",
    description: "Freshly ground whole wheat flour made from premium quality grains",
    longDescription: "Our premium whole wheat atta is made from carefully selected wheat grains sourced directly from organic farms. Ground fresh using traditional stone mills to preserve maximum nutrition and authentic taste. Perfect for making soft, fluffy rotis that your family will love.",
    price: 45,
    originalPrice: 55,
    weight: "1 KG",
    category: "atta",
    subCategory: "wheat",
    images: [
      "https://images.unsplash.com/photo-1627744515559-a15ff44a8a50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGZsb3VyJTIwZ3JhaW5zJTIwaGVhbHRoeSUyMG9yZ2FuaWN8ZW58MXx8fHwxNzU5NjU1Njc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1667328925477-1cc446534413?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGdyYWluJTIwZ3JpbmRpbmclMjBtaWxsfGVufDF8fHx8MTc1OTY1NTY3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    inStock: true,
    stockCount: 150,
    rating: 4.8,
    reviewCount: 324,
    badge: "Best Seller",
    nutritionFacts: [
      { nutrient: "Protein", value: "12.5g", percentage: 25 },
      { nutrient: "Fiber", value: "11.2g", percentage: 45 },
      { nutrient: "Iron", value: "4.2mg", percentage: 23 },
      { nutrient: "Vitamin B6", value: "0.3mg", percentage: 18 }
    ],
    features: [
      { title: "100% Organic", description: "Certified organic wheat from trusted farms", icon: "leaf" },
      { title: "Stone Ground", description: "Traditional grinding preserves nutrients", icon: "settings" },
      { title: "Fresh Daily", description: "Ground to order for maximum freshness", icon: "clock" },
      { title: "No Preservatives", description: "Completely natural with no additives", icon: "shield" }
    ],
    tags: ["organic", "fresh", "premium", "stone-ground"],
    isActive: true,
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: generateId(),
    name: "Multi-Grain Health Atta",
    description: "Nutritious blend of multiple grains for complete family health",
    longDescription: "A perfect blend of wheat, oats, barley, and other nutritious grains. This multi-grain atta provides complete nutrition for growing families and health-conscious individuals.",
    price: 65,
    originalPrice: 75,
    weight: "1 KG",
    category: "atta",
    subCategory: "multigrain",
    images: [
      "https://images.unsplash.com/photo-1623066798929-946425dbe1b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZ3JhaW5zJTIwdmFyaWV0eSUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzU5NjU2MzY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    inStock: true,
    stockCount: 89,
    rating: 4.7,
    reviewCount: 198,
    badge: "New",
    nutritionFacts: [
      { nutrient: "Protein", value: "14.2g", percentage: 28 },
      { nutrient: "Fiber", value: "13.8g", percentage: 55 },
      { nutrient: "Iron", value: "5.1mg", percentage: 28 },
      { nutrient: "Calcium", value: "45mg", percentage: 15 }
    ],
    features: [
      { title: "7 Grain Blend", description: "Perfect combination of healthy grains", icon: "layers" },
      { title: "High Protein", description: "28% more protein than regular wheat", icon: "trending-up" },
      { title: "Fiber Rich", description: "Excellent source of dietary fiber", icon: "heart" },
      { title: "Family Health", description: "Suitable for all age groups", icon: "users" }
    ],
    tags: ["multigrain", "protein", "fiber", "healthy"],
    isActive: true,
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: generateId(),
    name: "Organic Jowar Atta",
    description: "Gluten-free sorghum flour perfect for healthy living",
    longDescription: "Made from premium quality sorghum (jowar) grains, this gluten-free flour is perfect for those with gluten sensitivity. Rich in antioxidants and minerals.",
    price: 55,
    originalPrice: 65,
    weight: "1 KG",
    category: "atta",
    subCategory: "jowar",
    images: [
      "https://images.unsplash.com/photo-1661174282476-43db0a70d7fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZ3JhaW5zJTIwd2hlYXQlMjBiYXJsZXl8ZW58MXx8fHwxNzU5NjU1Njc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    inStock: true,
    stockCount: 67,
    rating: 4.6,
    reviewCount: 142,
    badge: "Gluten Free",
    nutritionFacts: [
      { nutrient: "Protein", value: "11.3g", percentage: 23 },
      { nutrient: "Fiber", value: "6.7g", percentage: 27 },
      { nutrient: "Iron", value: "4.4mg", percentage: 24 },
      { nutrient: "Magnesium", value: "165mg", percentage: 41 }
    ],
    features: [
      { title: "Gluten Free", description: "Safe for celiac and gluten sensitive", icon: "shield-check" },
      { title: "Antioxidant Rich", description: "High in natural antioxidants", icon: "heart" },
      { title: "Mineral Dense", description: "Rich in essential minerals", icon: "gem" },
      { title: "Digestive Health", description: "Easy to digest and nutritious", icon: "activity" }
    ],
    tags: ["gluten-free", "organic", "antioxidants", "minerals"],
    isActive: true,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  }
];

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: generateId(),
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 98765 43210",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTY1NzM3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    role: "customer",
    addresses: [
      {
        id: generateId(),
        type: "Home",
        name: "Priya Sharma",
        address: "A-402, Green Valley Apartments, Sector 18",
        city: "Noida",
        state: "Uttar Pradesh",
        pincode: "201301",
        phone: "+91 98765 43210",
        isDefault: true
      }
    ],
    preferences: {
      dietaryRestrictions: ["organic-only"],
      favoriteGrains: ["wheat", "ragi"],
      orderFrequency: "monthly",
      packagingPreference: "eco-friendly",
      notifications: {
        email: true,
        sms: true,
        promotions: false
      }
    },
    loyaltyPoints: 1250,
    totalOrders: 24,
    totalSpent: 12450,
    isActive: true,
    createdAt: "2023-01-15T10:00:00Z",
    lastLogin: "2024-01-15T09:30:00Z"
  }
];

// Mock Orders Data
export const mockOrders: Order[] = [
  {
    id: "ORD-2024-001",
    userId: mockUsers[0].id,
    items: [
      {
        productId: mockProducts[0].id,
        name: mockProducts[0].name,
        price: mockProducts[0].price,
        quantity: 2,
        weight: mockProducts[0].weight,
        image: mockProducts[0].images[0]
      }
    ],
    subtotal: 90,
    shipping: 0,
    tax: 16.2,
    total: 106.2,
    status: "delivered",
    paymentStatus: "completed",
    paymentMethod: "UPI",
    paymentGateway: "razorpay",
    shippingAddress: mockUsers[0].addresses[0],
    billingAddress: mockUsers[0].addresses[0],
    trackingId: "TRK123456789",
    shippingPartner: "bluedart",
    estimatedDelivery: "2024-01-17",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-16T15:30:00Z"
  }
];

// Mock Payment Gateways Data
export const mockPaymentGateways: PaymentGateway[] = [
  {
    id: generateId(),
    name: "Razorpay",
    type: "razorpay",
    isActive: true,
    config: {
      apiKey: "rzp_live_***********",
      secretKey: "***********",
      webhookSecret: "***********",
      environment: "production"
    },
    supportedMethods: ["Credit Card", "Debit Card", "UPI", "Net Banking", "Wallets"],
    fees: { type: "percentage", value: 2.36 },
    minAmount: 100,
    maxAmount: 500000
  },
  {
    id: generateId(),
    name: "Stripe",
    type: "stripe",
    isActive: false,
    config: {
      apiKey: "pk_test_***********",
      secretKey: "sk_test_***********",
      webhookSecret: "whsec_***********",
      environment: "sandbox"
    },
    supportedMethods: ["Credit Card", "Debit Card", "Apple Pay", "Google Pay"],
    fees: { type: "percentage", value: 2.9 },
    minAmount: 50,
    maxAmount: 1000000
  }
];

// Mock Shipping Partners Data
export const mockShippingPartners: ShippingPartner[] = [
  {
    id: generateId(),
    name: "Blue Dart",
    type: "bluedart",
    isActive: true,
    config: {
      apiKey: "BD_***********",
      vendorCode: "BD12345",
      environment: "production"
    },
    serviceTypes: ["Express", "Ground", "Same Day"],
    zones: [
      {
        id: generateId(),
        name: "Metro Cities",
        pincodes: ["110001", "400001", "600001", "560001"],
        rates: [
          { weight: "0-500g", price: 50, deliveryDays: 1 },
          { weight: "500g-1kg", price: 70, deliveryDays: 1 },
          { weight: "1-2kg", price: 90, deliveryDays: 2 }
        ]
      }
    ]
  }
];

// Function to initialize mock data
export function initializeMockData() {
  return {
    products: mockProducts,
    users: mockUsers,
    orders: mockOrders,
    paymentGateways: mockPaymentGateways,
    shippingPartners: mockShippingPartners
  };
}