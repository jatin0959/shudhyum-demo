import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { toast } from 'sonner';
import { apiService } from '../services/apiService';

// Types
export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice: number;
  weight: string;
  category: string;
  subCategory: string;
  images: string[];
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  nutritionFacts: {
    nutrient: string;
    value: string;
    percentage: number;
  }[];
  features: {
    title: string;
    description: string;
    icon: string;
  }[];
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  preferences: UserPreferences;
  loyaltyPoints: number;
  totalOrders: number;
  totalSpent: number;
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
}

export interface Address {
  id: string;
  type: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

export interface UserPreferences {
  dietaryRestrictions: string[];
  favoriteGrains: string[];
  orderFrequency: string;
  packagingPreference: string;
  notifications: {
    email: boolean;
    sms: boolean;
    promotions: boolean;
  };
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  paymentGateway: string;
  shippingAddress: Address;
  billingAddress: Address;
  trackingId?: string;
  shippingPartner?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  weight: string;
  image: string;
}

export interface PaymentGateway {
  id: string;
  name: string;
  type: 'razorpay' | 'stripe' | 'paypal' | 'payu' | 'cashfree';
  isActive: boolean;
  config: {
    apiKey?: string;
    secretKey?: string;
    webhookSecret?: string;
    environment: 'sandbox' | 'production';
  };
  supportedMethods: string[];
  fees: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  minAmount: number;
  maxAmount: number;
}

export interface ShippingPartner {
  id: string;
  name: string;
  type: 'bluedart' | 'dtdc' | 'indiapost' | 'fedex' | 'delhivery' | 'ecom';
  isActive: boolean;
  config: {
    apiKey?: string;
    secretKey?: string;
    vendorCode?: string;
    environment: 'sandbox' | 'production';
  };
  serviceTypes: string[];
  zones: {
    name: string;
    pincodes: string[];
    rates: {
      weight: string;
      price: number;
      deliveryDays: number;
    }[];
  }[];
}

export interface AdminSettings {
  site: {
    name: string;
    logo: string;
    favicon: string;
    description: string;
    keywords: string[];
    currency: string;
    timezone: string;
  };
  business: {
    address: string;
    phone: string;
    email: string;
    gst: string;
    pan: string;
  };
  email: {
    smtp: {
      host: string;
      port: number;
      username: string;
      password: string;
      secure: boolean;
    };
    templates: {
      orderConfirmation: string;
      orderShipped: string;
      orderDelivered: string;
    };
  };
  tax: {
    gst: number;
    cgst: number;
    sgst: number;
    igst: number;
  };
  shipping: {
    freeShippingThreshold: number;
    defaultShippingCost: number;
  };
}

export interface AppState {
  products: Product[];
  users: User[];
  orders: Order[];
  paymentGateways: PaymentGateway[];
  shippingPartners: ShippingPartner[];
  settings: AdminSettings;
  currentUser: User | null;
  cart: OrderItem[];
  isAdminMode: boolean;
  loading: boolean;
  error: string | null;
}

// Actions
export type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ADMIN_MODE'; payload: boolean }
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'ADD_TO_CART'; payload: OrderItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: Order }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'SET_PAYMENT_GATEWAYS'; payload: PaymentGateway[] }
  | { type: 'ADD_PAYMENT_GATEWAY'; payload: PaymentGateway }
  | { type: 'UPDATE_PAYMENT_GATEWAY'; payload: PaymentGateway }
  | { type: 'DELETE_PAYMENT_GATEWAY'; payload: string }
  | { type: 'ADD_SHIPPING_PARTNER'; payload: ShippingPartner }
  | { type: 'UPDATE_SHIPPING_PARTNER'; payload: ShippingPartner }
  | { type: 'DELETE_SHIPPING_PARTNER'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AdminSettings> }
  | { type: 'SYNC_WITH_API'; payload: { products?: Product[]; users?: User[]; orders?: Order[] } };

// Initial state
const initialState: AppState = {
  products: [],
  users: [],
  orders: [],
  paymentGateways: [],
  shippingPartners: [],
  settings: {
    site: {
      name: 'Shudhyum',
      logo: '',
      favicon: '',
      description: 'Premium quality fresh atta delivered to your doorstep',
      keywords: ['atta', 'flour', 'organic', 'healthy', 'fresh'],
      currency: 'INR',
      timezone: 'Asia/Kolkata'
    },
    business: {
      address: '',
      phone: '',
      email: '',
      gst: '',
      pan: ''
    },
    email: {
      smtp: {
        host: '',
        port: 587,
        username: '',
        password: '',
        secure: false
      },
      templates: {
        orderConfirmation: '',
        orderShipped: '',
        orderDelivered: ''
      }
    },
    tax: {
      gst: 18,
      cgst: 9,
      sgst: 9,
      igst: 18
    },
    shipping: {
      freeShippingThreshold: 500,
      defaultShippingCost: 40
    }
  },
  currentUser: null,
  cart: [],
  isAdminMode: false,
  loading: false,
  error: null
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_ADMIN_MODE':
      return { ...state, isAdminMode: action.payload };
    
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.productId === action.payload.productId);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      return { ...state, cart: [...state.cart, action.payload] };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.productId !== action.payload)
      };
    
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        )
      };
    
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload)
      };
    
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        )
      };
    
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload)
      };
    
    case 'SET_USERS':
      return { ...state, users: action.payload };
    
    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload] };
    
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? action.payload : order
        )
      };
    
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    
    case 'SYNC_WITH_API':
      return {
        ...state,
        ...(action.payload.products && { products: action.payload.products }),
        ...(action.payload.users && { users: action.payload.users }),
        ...(action.payload.orders && { orders: action.payload.orders })
      };
    
    case 'SET_PAYMENT_GATEWAYS':
      return { ...state, paymentGateways: action.payload };
    
    case 'ADD_PAYMENT_GATEWAY':
      return { ...state, paymentGateways: [...state.paymentGateways, action.payload] };
    
    case 'UPDATE_PAYMENT_GATEWAY':
      return {
        ...state,
        paymentGateways: state.paymentGateways.map(gateway =>
          gateway.id === action.payload.id ? action.payload : gateway
        )
      };
    
    case 'DELETE_PAYMENT_GATEWAY':
      return {
        ...state,
        paymentGateways: state.paymentGateways.filter(gateway => gateway.id !== action.payload)
      };
    
    case 'ADD_SHIPPING_PARTNER':
      return { ...state, shippingPartners: [...state.shippingPartners, action.payload] };
    
    case 'UPDATE_SHIPPING_PARTNER':
      return {
        ...state,
        shippingPartners: state.shippingPartners.map(partner =>
          partner.id === action.payload.id ? action.payload : partner
        )
      };
    
    case 'DELETE_SHIPPING_PARTNER':
      return {
        ...state,
        shippingPartners: state.shippingPartners.filter(partner => partner.id !== action.payload)
      };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider Component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = React.useMemo(() => ({
    state,
    dispatch
  }), [state]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook as a named constant
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// UserModal.tsx
const handleSave = async () => {
  try {
    if (mode === 'add') {
      const response = await apiService.register(userData);
      if (response.success) {
        dispatch({ type: 'ADD_USER', payload: response.data.user });
        toast.success('User created successfully!');
      } else {
        toast.error(response.error || 'Failed to create user');
      }
    } else if (mode === 'edit' && user) {
      const response = await apiService.updateUser(user.id, userData);
      if (response.success) {
        dispatch({ type: 'UPDATE_USER', payload: response.data });
        toast.success('User updated successfully!');
      } else {
        toast.error(response.error || 'Failed to update user');
      }
    }
    onClose();
  } catch (error) {
    toast.error('An unexpected error occurred');
  }
};