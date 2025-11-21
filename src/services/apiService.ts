import { environment } from '../config/environment';
import { Product, User, Order } from '../contexts/AppContext';

// API Response Types
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}
 
interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Login Response Type
interface LoginResponse extends ApiResponse<{ user: User; token: string }> {}

// Payment Gateway Interfaces
interface PaymentGatewayConfig {
  apiKey: string;
  secretKey: string;
  environment: 'sandbox' | 'production';
  webhookUrl?: string;
}

interface PaymentGatewayFees {
  type: 'percentage' | 'fixed';
  value: number;
}

interface PaymentGateway {
  id: string;
  type: string;
  displayName: string;
  description: string;
  isActive: boolean;
  config: PaymentGatewayConfig;
  fees: PaymentGatewayFees;
  supportedMethods: string[];
  createdAt: string;
  updatedAt: string;
}

// Add this interface near other interfaces at the top
interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  keyId: string;
}

// Add these interfaces at the top
interface ShippingServiceability {
  availableZones: number;
  totalPincodes: number;
  activePartners: number;
  deliveryMetrics: {
    avgDeliveryTime: number;
    onTimeDelivery: number;
    delayedDeliveries: number;
  };
  coverage: {
    national: number;
    regional: string[];
    restrictedAreas: string[];
  };
}

interface ShippingPartner {
  id: string;
  name: string;
  type: string;
  displayName: string;
  description: string;
  isActive: boolean;
  serviceTypes: string[];
  zones: ShippingZone[];
  averageDeliveryTime: number;
  reliabilityScore: number;
  costEffectiveness: number;
  features: string[];
}

interface ShippingZone {
  id: string;
  name: string;
  pincodes: string[];
  rates: ShippingRate[];
}

interface ShippingRate {
  weight: string;
  price: number;
}

// Enhanced localStorage-based API that simulates MongoDB operations
class ApiService {
  private baseUrl: string;
  private authToken: string | null = null;
  private isSystemMode: boolean = false;
  private useRealAPI: boolean = true; // Toggle for real API vs simulation

  constructor() {
    // Use real backend API URL
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://shudhyum-api.onrender.com/api'  // Updated production URL
      : 'https://shudhyum-api.onrender.com/api';  // Using same URL for development
    
    const storedToken = this.getStoredToken();
    if (storedToken && this.isTokenValid(storedToken)) {
      this.authToken = storedToken;
    } else {
      this.removeAuthToken();
    }
    
    // Check if backend is available
    this.checkBackendHealth();
  }

  private async checkBackendHealth(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/products`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log('✅ Backend API connected successfully');
        this.useRealAPI = true;
      } else {
        console.warn('⚠️ Backend API not responding, using simulation mode');
        this.useRealAPI = false;
      }
    } catch (error) {
      console.warn('⚠️ Backend API unavailable, using simulation mode');
      this.useRealAPI = false;
    }
  }

  // Enable system mode for seeding and initialization
  enableSystemMode() {
    this.isSystemMode = true;
    // Generate a system token for seeding operations
    this.authToken = this.generateSystemToken();
    console.log('🔧 System mode enabled for data seeding');
  }

  disableSystemMode() {
    this.isSystemMode = false;
    // Keep user token if it exists, otherwise clear system token
    const userToken = localStorage.getItem('shudhyum_auth_token');
    this.authToken = userToken;
    console.log('🔧 System mode disabled');
  }

  private generateSystemToken(): string {
    const systemPayload = {
      userId: 'system',
      email: 'system@shudhyum.internal',
      role: 'system',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };
    
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify(systemPayload));
    const signature = btoa(`system_signature_${Date.now()}`);
    
    return `${header}.${payload}.${signature}`;
  }

  // Authentication Methods
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data: LoginResponse = await response.json();

      if (data.success) {
        // Store the JWT token
        this.setAuthToken(data.data.token);
      }

      return data;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
        data: null
      } as LoginResponse;
    }
  }

// Inside the ApiService class

async register(userData: Partial<User>): Promise<ApiResponse<{ user: User; token: string }>> {
  try {
    // Use real API if available
    if (this.useRealAPI) {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData), // Send userData directly in the request body
      });

      const data = await response.json();

      if (response.ok && data.success && data.data) {
        // Assuming the response has the token and user data
        this.setAuthToken(data.data.token); // Store token in localStorage
        return {
          success: true,
          data: data.data, // Return user and token
          message: data.message || 'Registration successful!',
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          success: false,
          error: data.message || 'Registration failed',
          timestamp: new Date().toISOString()
        };
      }
    }

    // Fallback to simulation if no real API is used
    await this.simulateNetworkDelay();

    // Simulating user creation (for development purposes only)
    const newUser: User = {
      id: `user-${Date.now()}`,
      firstName: userData.firstName || 'John',
      lastName: userData.lastName || 'Doe',
      email: userData.email || '',
      phone: userData.phone || '',
      avatar: userData.avatar || '',
      role: 'customer',
      isActive: true,
      isEmailVerified: false,
      addresses: [],
      preferences: {
        dietaryRestrictions: [],
        favoriteGrains: [],
        orderFrequency: 'monthly',
        packagingPreference: 'eco-friendly',
        notifications: {
          email: true,
          sms: true,
          promotions: false,
        },
      },
      loyaltyPoints: 100, // Welcome bonus
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    // Simulate successful registration
    const token = this.generateJWTToken(newUser);
    this.setAuthToken(token); // Save the token

    return {
      success: true,
      data: { user: newUser, token },
      message: 'Registration successful!',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return this.handleError('Registration failed', error);
  }
}


  async logout(): Promise<ApiResponse> {
    this.authToken = null;
    localStorage.removeItem('shudhyum_auth_token');
    
    return {
      success: true,
      message: 'Logout successful',
      timestamp: new Date().toISOString()
    };
  }

  // Product Methods
  async getProducts(page = 1, limit = 20, filters?: any): Promise<PaginatedResponse<Product>> {
  try {
    console.log('Fetching products from:', `${this.baseUrl}/products`);
    
    const response = await fetch(`${this.baseUrl}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    console.log('API Response status:', response.status);
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch products');
    }

    // The API returns data in data.data
    const products = data.data || [];

    return {
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: products.length,
        totalPages: Math.ceil(products.length / Number(limit))
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      success: false,
      data: [],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: 0,
        totalPages: 0
      },
      timestamp: new Date().toISOString()
    };
  }
}

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${id}`, {
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch product');
      }

      return {
        success: true,
        data: data.product,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError('Failed to fetch product', error);
    }
  }

  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Product>> {
    try {
      const response = await fetch(`${this.baseUrl}/products`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(productData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create product');
      }

      return {
        success: true,
        data: data.product,
        message: 'Product created successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError('Failed to create product', error);
    }
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<ApiResponse<Product>> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update product');
      }

      return {
        success: true,
        data: data.product,
        message: 'Product updated successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError('Failed to update product', error);
    }
  }

  async deleteProduct(id: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete product');
      }

      return {
        success: true,
        message: 'Product deleted successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError('Failed to delete product', error);
    }
  }

  // User Methods
  async getUsers(page = 1, limit = 20): Promise<PaginatedResponse<User>> {
  try {
    const token = this.getStoredToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('Fetching users with token:', token);
    
    const response = await fetch(`${this.baseUrl}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    console.log('Users API Response:', data);

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      data: data.data || [],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: data.total || 0,
        totalPages: Math.ceil((data.total || 0) / limit)
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in getUsers:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Failed to fetch users',
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: 0,
        totalPages: 0
      },
      timestamp: new Date().toISOString()
    };
  }
}

  async updateUser(id: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    try {
      await this.simulateNetworkDelay();

      const users = this.getCollection<User>('users');
      const index = users.findIndex(u => u.id === id);

      if (index === -1) {
        return {
          success: false,
          error: 'User not found',
          timestamp: new Date().toISOString()
        };
      }

      const updatedUser = {
        ...users[index],
        ...updates
      };

      users[index] = updatedUser;
      this.saveCollection('users', users);

      return {
        success: true,
        data: updatedUser,
        message: 'User updated successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError('Failed to update user', error);
    }
  }

  // Order Methods
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Order>> {
    try {
      this.requireAuth();
      await this.simulateNetworkDelay();

      const orders = this.getCollection<Order>('orders');
      
      const newOrder: Order = {
        ...orderData,
        id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        orderNumber: `SHD${Date.now().toString().slice(-8)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      orders.push(newOrder);
      this.saveCollection('orders', orders);
      this.updateMetadata('orders', orders.length);

      return {
        success: true,
        data: newOrder,
        message: 'Order created successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError('Failed to create order', error);
    }
  }

  async getOrders(page = 1, limit = 20, filters?: any): Promise<PaginatedResponse<Order>> {
    try {
      this.requireAuth();
      await this.simulateNetworkDelay();

      let orders = this.getCollection<Order>('orders');
      
      // Apply filters
      if (filters?.status && filters.status !== 'all') {
        orders = orders.filter(o => o.status === filters.status);
      }

      if (filters?.userId) {
        orders = orders.filter(o => o.userId === filters.userId);
      }

      // Sort by creation date (newest first)
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Pagination
      const total = orders.length;
      const startIndex = (page - 1) * limit;
      const paginatedOrders = orders.slice(startIndex, startIndex + limit);

      return {
        success: true,
        data: paginatedOrders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError('Failed to fetch orders', error);
    }
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<ApiResponse<Order>> {
    try {
      this.requireAuth();
      await this.simulateNetworkDelay();

      const orders = this.getCollection<Order>('orders');
      const index = orders.findIndex(o => o.id === id);

      if (index === -1) {
        return {
          success: false,
          error: 'Order not found',
          timestamp: new Date().toISOString()
        };
      }

      const updatedOrder = {
        ...orders[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      orders[index] = updatedOrder;
      this.saveCollection('orders', orders);

      return {
        success: true,
        data: updatedOrder,
        message: 'Order updated successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError('Failed to update order', error);
    }
  }

  // Analytics Methods
  async getAnalytics(): Promise<ApiResponse<any>> {
    try {
      // Check for auth token
      const token = this.getStoredToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.baseUrl}/analytics/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('Analytics Response:', data);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Clear invalid token
          this.removeAuthToken();
          throw new Error('Invalid or expired token. Please login again.');
        }
        throw new Error(data.message || 'Failed to fetch analytics');
      }

      return {
        success: true,
        data: data.data || data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError('Failed to fetch analytics', error);
    }
  }

  async getSalesAnalytics(period: string = '30d'): Promise<ApiResponse<any>> {
    try {
      this.requireAuth();

      // Use real API if available
      if (this.useRealAPI) {
        const response = await fetch(`${this.baseUrl}/analytics/sales?period=${period}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.authToken}`
          }
        });

        const data = await response.json();
        
        if (data.success) {
          return {
            success: true,
            data: data.data,
            timestamp: new Date().toISOString()
          };
        } else {
          throw new Error(data.message || 'Failed to fetch sales analytics');
        }
      }

      // Fallback to simulation
      await this.simulateNetworkDelay();

      const salesData = {
        dailySales: [
          { _id: { year: 2024, month: 12, day: 1 }, revenue: 2500, orders: 12 },
          { _id: { year: 2024, month: 12, day: 2 }, revenue: 3200, orders: 15 },
          { _id: { year: 2024, month: 12, day: 3 }, revenue: 2800, orders: 13 },
          { _id: { year: 2024, month: 12, day: 4 }, revenue: 4100, orders: 18 },
          { _id: { year: 2024, month: 12, day: 5 }, revenue: 3600, orders: 16 },
          { _id: { year: 2024, month: 12, day: 6 }, revenue: 2900, orders: 14 },
          { _id: { year: 2024, month: 12, day: 7 }, revenue: 3800, orders: 17 }
        ],
        topProducts: [],
        paymentMethodDistribution: []
      };

      return {
        success: true,
        data: salesData,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError('Failed to fetch sales analytics', error);
    }
  }

  async getCustomerAnalytics(): Promise<ApiResponse<any>> {
    try {
      this.requireAuth();

      // Use real API if available
      if (this.useRealAPI) {
        const response = await fetch(`${this.baseUrl}/analytics/customers`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.authToken}`
          }
        });

        const data = await response.json();
        
        if (data.success) {
          return {
            success: true,
            data: data.data,
            timestamp: new Date().toISOString()
          };
        } else {
          throw new Error(data.message || 'Failed to fetch customer analytics');
        }
      }

      // Fallback to simulation
      await this.simulateNetworkDelay();

      const customerData = {
        segments: [],
        geographic: [],
        acquisition: [],
        retention: []
      };

      return {
        success: true,
        data: customerData,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError('Failed to fetch customer analytics', error);
    }
  }

  // Payment Gateway Methods
  async getPaymentGateways(): Promise<ApiResponse<PaymentGateway[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/methods`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      console.log('Payment Methods Response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch payment methods');
      }

      // Transform the response data to match PaymentGateway interface
      const gateways: PaymentGateway[] = data.data.map((method: any) => ({
        id: method.id,
        type: method.type,
        displayName: method.name,
        description: method.description || '',
        isActive: method.enabled,
        config: {
          apiKey: method.config?.apiKey || '',
          secretKey: method.config?.secretKey || '',
          environment: method.config?.environment || 'sandbox',
          webhookUrl: method.config?.webhookUrl
        },
        fees: {
          type: method.fees?.type || 'percentage',
          value: method.fees?.value || 0
        },
        supportedMethods: method.methods || [],
        createdAt: method.createdAt || new Date().toISOString(),
        updatedAt: method.updatedAt || new Date().toISOString()
      }));

      return {
        success: true,
        data: gateways,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError('Failed to fetch payment gateways', error);
    }
  }

  async updatePaymentGateway(id: string, updates: Partial<PaymentGateway>): Promise<ApiResponse<PaymentGateway>> {
  try {
    const response = await fetch(`${this.baseUrl}/payments/methods/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update payment method');
    }

    return {
      success: true,
      data: data.data,
      message: 'Payment method updated successfully',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return this.handleError('Failed to update payment method', error);
  }
}

  async addPaymentGateway(gatewayData: Omit<PaymentGateway, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<PaymentGateway>> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/methods`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(gatewayData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add payment method');
      }

      return {
        success: true,
        data: data.data,
        message: 'Payment method added successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError('Failed to add payment method', error);
    }
  }

  // Add this method inside ApiService class
  async createRazorpayOrder(orderId: string, amount: number): Promise<ApiResponse<RazorpayOrder>> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/razorpay/create-order`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          orderId,
          amount,
          currency: 'INR'
        })
      });

      const data = await response.json();
      console.log('Razorpay Order Creation Response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create Razorpay order');
      }

      return {
        success: true,
        data: {
          id: data.data.id,
          amount: data.data.amount,
          currency: data.data.currency,
          receipt: data.data.receipt,
          status: data.data.status,
          keyId: data.data.key_id
        },
        message: 'Razorpay order created successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError('Failed to create Razorpay order', error);
    }
  }

  // Shipping Methods
  async checkServiceability(): Promise<ApiResponse<ShippingServiceability>> {
    try {
      const response = await fetch(`${this.baseUrl}/shipping/check-serviceability`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to check serviceability');
      }

      const data = await response.json();

      return {
        success: true,
        data: data.data || this.getFallbackServiceability(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.warn('Using fallback serviceability data:', error);
      return {
        success: true,
        data: this.getFallbackServiceability(),
        timestamp: new Date().toISOString()
      };
    }
  }

  async getShippingPartners(): Promise<ApiResponse<ShippingPartner[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/shipping/partners`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch shipping partners');
      }

      const data = await response.json();

      return {
        success: true,
        data: data.data || this.getFallbackPartners(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.warn('Using fallback shipping partners data:', error);
      return {
        success: true,
        data: this.getFallbackPartners(),
        timestamp: new Date().toISOString()
      };
    }
  }

  // Add these private methods for fallback data
  private getFallbackServiceability(): ShippingServiceability {
    return {
      availableZones: 4,
      totalPincodes: 15000,
      activePartners: 3,
      deliveryMetrics: {
        avgDeliveryTime: 2.5,
        onTimeDelivery: 95,
        delayedDeliveries: 5
      },
      coverage: {
        national: 85,
        regional: ['North', 'South', 'East', 'West'],
        restrictedAreas: ['Remote Islands', 'High Altitude Regions']
      }
    };
  }

  private getFallbackPartners(): ShippingPartner[] {
    return [
      {
        id: 'delhivery-1',
        name: 'Delhivery',
        type: 'delhivery',
        displayName: 'Delhivery Express',
        description: 'Pan India Express Delivery',
        isActive: true,
        serviceTypes: ['Express', 'Surface', 'Heavy Cargo'],
        zones: [
          {
            id: 'zone-1',
            name: 'North Zone',
            pincodes: ['110001', '110002'],
            rates: [
              { weight: '0-500g', price: 50 },
              { weight: '501g-1kg', price: 80 }
            ]
          }
        ],
        averageDeliveryTime: 2,
        reliabilityScore: 95,
        costEffectiveness: 85,
        features: ['Real-time Tracking', 'POD', 'Insurance']
      },
      {
        id: 'bluedart-1',
        name: 'Blue Dart',
        type: 'bluedart',
        displayName: 'Blue Dart Premium',
        description: 'Premium Courier Service',
        isActive: true,
        serviceTypes: ['Premium', 'Express'],
        zones: [
          {
            id: 'zone-2',
            name: 'Metro Cities',
            pincodes: ['400001', '400002'],
            rates: [
              { weight: '0-500g', price: 65 },
              { weight: '501g-1kg', price: 95 }
            ]
          }
        ],
        averageDeliveryTime: 1.5,
        reliabilityScore: 98,
        costEffectiveness: 75,
        features: ['Priority Handling', 'Insurance', 'Saturday Delivery']
      }
    ];
  }

  // Utility Methods
  private getCollection<T>(name: string): T[] {
    try {
      const data = localStorage.getItem(`shudhyum_${name}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error loading collection ${name}:`, error);
      return [];
    }
  }

  private saveCollection<T>(name: string, data: T[]): void {
    try {
      localStorage.setItem(`shudhyum_${name}`, JSON.stringify(data));
      this.updateMetadata(name, data.length);
    } catch (error) {
      console.error(`Error saving collection ${name}:`, error);
    }
  }

  private updateMetadata(collection: string, count: number): void {
    try {
      const metadata = JSON.parse(localStorage.getItem('shudhyum_metadata') || '{}');
      metadata.lastUpdated = new Date().toISOString();
      metadata[`${collection}Count`] = count;
      localStorage.setItem('shudhyum_metadata', JSON.stringify(metadata));
    } catch (error) {
      console.error('Error updating metadata:', error);
    }
  }

  private getUniqueValues<T>(array: T[], key: keyof T): string[] {
    return [...new Set(array.map(item => String(item[key])))];
  }

  private generateJWTToken(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
    }));
    const signature = btoa(`signature_${user.id}_${Date.now()}`);
    
    return `${header}.${payload}.${signature}`;
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('shudhyum_auth_token');
  }

  private setAuthToken(token: string): void {
    this.authToken = token;
    localStorage.setItem('shudhyum_auth_token', token);
  }

  private removeAuthToken(): void {
    this.authToken = null;
    localStorage.removeItem('shudhyum_auth_token');
  }

  private isTokenValid(token: string): boolean {
    try {
      const [, payload] = token.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      const expirationTime = decodedPayload.exp * 1000; // Convert to milliseconds
      return Date.now() < expirationTime;
    } catch {
      return false;
    }
  }

  public getAuthHeaders(): HeadersInit {
    const token = this.getStoredToken();
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    };
  }

  // Add this public method
  public getToken(): string | null {
    return this.getStoredToken();
  }

  private requireAuth(): void {
    if (!this.authToken && !this.isSystemMode) {
      throw new Error('Authentication required');
    }
  }

  private async simulateNetworkDelay(): Promise<void> {
    const delay = Math.random() * 500 + 200; // 200-700ms delay
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private handleError(message: string, error: any): ApiResponse {
    console.error(message, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : message,
      timestamp: new Date().toISOString()
    };
  }
}

// Create a single instance and export it as a named export
export const apiService = new ApiService();

// Example usage in a checkout component
async function handlePayment(orderDetails: { orderId: string; amount: number }) {
  try {
    // 1. Create Razorpay order
    const response = await apiService.createRazorpayOrder(
      orderDetails.orderId, 
      orderDetails.amount
    );

    if (!response.success) {
      toast.error(response.error || 'Failed to create order');
      return;
    }

    // 2. Initialize Razorpay
    const options = {
      key: response.data.keyId,
      amount: response.data.amount,
      currency: response.data.currency,
      name: 'Shudhyum',
      description: 'Order Payment',
      order_id: response.data.id,
      handler: async (response: any) => {
        // Handle payment success
        console.log('Payment successful:', response);
        toast.success('Payment successful!');
      },
      prefill: {
        name: user.firstName + ' ' + user.lastName,
        email: user.email,
        contact: user.phone
      },
      theme: {
        color: '#16a34a'
      }
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();

  } catch (error) {
    console.error('Payment error:', error);
    toast.error('Payment failed. Please try again.');
  }
}



// Add this in a types file or at the top of your payment component
