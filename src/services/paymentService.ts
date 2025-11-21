import { apiService } from './apiService';

export interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
  methods: string[];
  fees: { percentage: number; fixed: number };
}

export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  keyId?: string;
  clientSecret?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
}

class PaymentService {
  // Get available payment methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/payments/methods`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch payment methods');
      }
    } catch (error) {
      console.error('Get payment methods error:', error);
      // Return default methods as fallback
      return [
        {
          id: 'cod',
          name: 'Cash on Delivery',
          enabled: true,
          methods: ['cash'],
          fees: { percentage: 0, fixed: 0 }
        }
      ];
    }
  }

  // Create Razorpay order
  async createRazorpayOrder(orderId: string, amount: number): Promise<PaymentOrder> {
    try {
      const token = localStorage.getItem('shudhyum_auth_token');
      const response = await fetch(`${this.getBaseUrl()}/payments/razorpay/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId,
          amount,
          currency: 'INR'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        return {
          orderId: data.data.orderId,
          amount: data.data.amount,
          currency: data.data.currency,
          keyId: data.data.keyId
        };
      } else {
        throw new Error(data.message || 'Failed to create Razorpay order');
      }
    } catch (error) {
      console.error('Create Razorpay order error:', error);
      throw error;
    }
  }

  // Verify Razorpay payment
  async verifyRazorpayPayment(paymentData: any, orderId: string): Promise<PaymentResult> {
    try {
      const token = localStorage.getItem('shudhyum_auth_token');
      const response = await fetch(`${this.getBaseUrl()}/payments/razorpay/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...paymentData,
          orderId
        })
      });

      const data = await response.json();
      
      return {
        success: data.success,
        paymentId: data.data?.paymentId,
        error: data.message
      };
    } catch (error) {
      console.error('Verify Razorpay payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment verification failed'
      };
    }
  }

  // Create Stripe payment intent
  async createStripePaymentIntent(orderId: string, amount: number): Promise<PaymentOrder> {
    try {
      const token = localStorage.getItem('shudhyum_auth_token');
      const response = await fetch(`${this.getBaseUrl()}/payments/stripe/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId,
          amount,
          currency: 'inr'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        return {
          orderId,
          amount,
          currency: 'inr',
          clientSecret: data.data.clientSecret
        };
      } else {
        throw new Error(data.message || 'Failed to create Stripe payment intent');
      }
    } catch (error) {
      console.error('Create Stripe payment intent error:', error);
      throw error;
    }
  }

  // Confirm Stripe payment
  async confirmStripePayment(paymentIntentId: string, orderId: string): Promise<PaymentResult> {
    try {
      const token = localStorage.getItem('shudhyum_auth_token');
      const response = await fetch(`${this.getBaseUrl()}/payments/stripe/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentIntentId,
          orderId
        })
      });

      const data = await response.json();
      
      return {
        success: data.success,
        paymentId: paymentIntentId,
        error: data.message
      };
    } catch (error) {
      console.error('Confirm Stripe payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment confirmation failed'
      };
    }
  }

  // Process Razorpay payment (frontend integration)
  async processRazorpayPayment(orderData: any): Promise<PaymentResult> {
    return new Promise((resolve) => {
      try {
        // Load Razorpay script if not already loaded
        if (!window.Razorpay) {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => this.openRazorpayCheckout(orderData, resolve);
          document.body.appendChild(script);
        } else {
          this.openRazorpayCheckout(orderData, resolve);
        }
      } catch (error) {
        resolve({
          success: false,
          error: error instanceof Error ? error.message : 'Payment processing failed'
        });
      }
    });
  }

  private openRazorpayCheckout(orderData: any, resolve: (result: PaymentResult) => void) {
    const options = {
      key: orderData.keyId,
      amount: orderData.amount * 100, // Convert to paise
      currency: orderData.currency,
      name: 'Shudhyum',
      description: 'Premium Atta Purchase',
      order_id: orderData.orderId,
      handler: async (response: any) => {
        // Verify payment on backend
        const verificationResult = await this.verifyRazorpayPayment(response, orderData.orderId);
        resolve(verificationResult);
      },
      modal: {
        ondismiss: () => {
          resolve({
            success: false,
            error: 'Payment cancelled by user'
          });
        }
      },
      theme: {
        color: '#16a34a'
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  }

  // Process Stripe payment (would require Stripe Elements integration)
  async processStripePayment(paymentIntent: PaymentOrder): Promise<PaymentResult> {
    // This would require Stripe Elements integration
    // For now, return a mock response
    return {
      success: false,
      error: 'Stripe integration requires additional frontend setup'
    };
  }

  // Check payment gateway serviceability
  async checkPaymentServiceability(pincode: string): Promise<any> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/shipping/check-serviceability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pincode })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Check payment serviceability error:', error);
      return {
        success: false,
        data: { serviceable: false, codAvailable: false }
      };
    }
  }

  private getBaseUrl(): string {
    return process.env.NODE_ENV === 'production' 
      ? 'https://your-backend-domain.com/api' 
      : 'http://localhost:3001/api';
  }
}

// Global Razorpay interface
declare global {
  interface Window {
    Razorpay: any;
  }
}

export const paymentService = new PaymentService();