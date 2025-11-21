export interface ShippingRate {
  fromPincode: string;
  toPincode: string;
  weight: number;
  paymentMode: string;
  totalAmount: number;
  freight: number;
  codCharges: number;
  deliveryDays: number;
}

export interface ShippingPartner {
  id: string;
  name: string;
  enabled: boolean;
  services: string[];
  coverage: string[];
  codSupported: boolean;
  estimatedDays: { [key: string]: number };
}

export interface ServiceabilityCheck {
  pincode: string;
  serviceable: boolean;
  codAvailable: boolean;
  deliveryDays?: number;
  city?: string;
  state?: string;
}

export interface TrackingInfo {
  waybill: string;
  status: string;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  currentLocation: string;
  timeline: Array<{
    status: string;
    location: string;
    timestamp: string;
    description: string;
  }>;
}

class ShippingService {
  // Get available shipping partners
  async getShippingPartners(): Promise<ShippingPartner[]> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/shipping/partners`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch shipping partners');
      }
    } catch (error) {
      console.error('Get shipping partners error:', error);
      // Return default partners as fallback
      return [
        {
          id: 'delhivery',
          name: 'Delhivery',
          enabled: true,
          services: ['surface', 'express'],
          coverage: ['pan-india'],
          codSupported: true,
          estimatedDays: { surface: 4, express: 2 }
        }
      ];
    }
  }

  // Check serviceability for a pincode
  async checkServiceability(pincode: string, partner = 'delhivery'): Promise<ServiceabilityCheck> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/shipping/check-serviceability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pincode, partner })
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        return {
          pincode,
          serviceable: false,
          codAvailable: false
        };
      }
    } catch (error) {
      console.error('Check serviceability error:', error);
      return {
        pincode,
        serviceable: false,
        codAvailable: false
      };
    }
  }

  // Get shipping rates
  async getShippingRates(
    fromPincode: string,
    toPincode: string,
    weight: number,
    paymentMode = 'Prepaid',
    partner = 'delhivery'
  ): Promise<ShippingRate | null> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/shipping/get-rates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fromPincode,
          toPincode,
          weight,
          paymentMode,
          partner
        })
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Get shipping rates error:', error);
      return null;
    }
  }

  // Track shipment
  async trackShipment(trackingId: string, partner = 'delhivery'): Promise<TrackingInfo | null> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/shipping/track/${trackingId}?partner=${partner}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Track shipment error:', error);
      return null;
    }
  }

  // Calculate shipping cost for checkout
  async calculateShippingCost(
    pincode: string,
    cartWeight: number,
    orderValue: number,
    paymentMode: 'Prepaid' | 'COD' = 'Prepaid'
  ): Promise<{
    cost: number;
    freeShipping: boolean;
    deliveryDays: number;
    partner: string;
  }> {
    try {
      // Check if eligible for free shipping
      const freeShippingThreshold = 500; // ₹500
      const freeShipping = orderValue >= freeShippingThreshold;

      if (freeShipping) {
        return {
          cost: 0,
          freeShipping: true,
          deliveryDays: orderValue >= 1000 ? 2 : 4, // Express for orders above ₹1000
          partner: 'delhivery'
        };
      }

      // Get shipping rates from API
      const defaultWarehousePincode = '400001'; // Mumbai warehouse
      const rates = await this.getShippingRates(
        defaultWarehousePincode,
        pincode,
        cartWeight,
        paymentMode
      );

      if (rates) {
        return {
          cost: rates.totalAmount,
          freeShipping: false,
          deliveryDays: rates.deliveryDays,
          partner: 'delhivery'
        };
      } else {
        // Fallback rates
        const baseRate = 50;
        const codCharges = paymentMode === 'COD' ? 20 : 0;
        
        return {
          cost: baseRate + codCharges,
          freeShipping: false,
          deliveryDays: 4,
          partner: 'delhivery'
        };
      }
    } catch (error) {
      console.error('Calculate shipping cost error:', error);
      
      // Return fallback shipping cost
      return {
        cost: orderValue >= 500 ? 0 : 50,
        freeShipping: orderValue >= 500,
        deliveryDays: 4,
        partner: 'delhivery'
      };
    }
  }

  // Validate pincode format
  validatePincode(pincode: string): boolean {
    const pincodeRegex = /^\d{6}$/;
    return pincodeRegex.test(pincode);
  }

  // Get estimated delivery date
  getEstimatedDeliveryDate(deliveryDays: number): string {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
    
    return deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Check if COD is available for pincode
  async checkCODAvailability(pincode: string): Promise<boolean> {
    try {
      const serviceability = await this.checkServiceability(pincode);
      return serviceability.codAvailable;
    } catch (error) {
      console.error('Check COD availability error:', error);
      return false;
    }
  }

  // Get shipping zones (for different pricing)
  getShippingZone(pincode: string): 'metro' | 'tier1' | 'tier2' | 'tier3' {
    const metroPincodes = ['110', '400', '500', '600', '700', '560']; // Delhi, Mumbai, Hyderabad, Chennai, Kolkata, Bangalore
    const tier1Pincodes = ['201', '302', '380', '411', '422', '462']; // Ghaziabad, Jaipur, Ahmedabad, Pune, etc.
    
    const pincodePrefix = pincode.substring(0, 3);
    
    if (metroPincodes.includes(pincodePrefix)) {
      return 'metro';
    } else if (tier1Pincodes.includes(pincodePrefix)) {
      return 'tier1';
    } else if (parseInt(pincodePrefix) >= 100 && parseInt(pincodePrefix) <= 799) {
      return 'tier2';
    } else {
      return 'tier3';
    }
  }

  // Get shipping recommendations based on order
  getShippingRecommendations(orderValue: number, weight: number, urgent: boolean = false) {
    const recommendations = [];

    if (orderValue >= 500) {
      recommendations.push({
        type: 'free_shipping',
        message: '🎉 Congratulations! You qualify for FREE shipping',
        method: 'standard',
        deliveryDays: orderValue >= 1000 ? 2 : 4
      });
    } else {
      const remaining = 500 - orderValue;
      recommendations.push({
        type: 'free_shipping_upgrade',
        message: `Add ₹${remaining} more to get FREE shipping!`,
        method: 'standard',
        deliveryDays: 4
      });
    }

    if (urgent) {
      recommendations.push({
        type: 'express_shipping',
        message: '⚡ Express delivery available - Get it in 1-2 days',
        method: 'express',
        deliveryDays: orderValue >= 1000 ? 1 : 2,
        extraCost: 100
      });
    }

    if (weight > 5) {
      recommendations.push({
        type: 'bulk_order',
        message: '📦 Bulk order detected - Special handling for heavy items',
        method: 'surface',
        deliveryDays: 5
      });
    }

    return recommendations;
  }

  private getBaseUrl(): string {
    return process.env.NODE_ENV === 'production' 
      ? 'https://your-backend-domain.com/api' 
      : 'http://localhost:3001/api';
  }
}

export const shippingService = new ShippingService();