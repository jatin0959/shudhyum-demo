import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ServiceTypeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  description: String,
  deliveryTime: String,
  isCODAvailable: {
    type: Boolean,
    default: false
  },
  isInsuranceAvailable: {
    type: Boolean,
    default: false
  },
  maxWeight: {
    type: Number,
    default: 50
  }
}, { _id: false });

const RateSchema = new Schema({
  weight: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryDays: {
    type: Number,
    required: true,
    min: 1
  }
}, { _id: false });

const ZoneSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  pincodes: [{
    type: String
  }],
  rates: [RateSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const ShippingPartnerSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['bluedart', 'dtdc', 'indiapost', 'fedex', 'delhivery', 'ecom', 'shadowfax', 'xpressbees']
  },
  displayName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  config: {
    apiKey: String,
    secretKey: String,
    vendorCode: String,
    username: String,
    password: String,
    environment: {
      type: String,
      enum: ['sandbox', 'production'],
      default: 'sandbox'
    }
  },
  serviceTypes: [ServiceTypeSchema],
  zones: [ZoneSchema],
  supportedServices: [{
    type: String,
    enum: ['standard', 'express', 'cod', 'tracking', 'insurance', 'reverse_pickup']
  }],
  logo: String,
  websiteUrl: String,
  trackingUrl: String,
  maxWeight: {
    type: Number,
    default: 50
  },
  maxDimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  features: [String],
  coverage: [{
    type: String,
    default: ['IN']
  }],
  averageDeliveryTime: {
    type: Number,
    default: 2
  },
  reliabilityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 85
  },
  costEffectiveness: {
    type: Number,
    min: 0,
    max: 100,
    default: 80
  },
  priority: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
ShippingPartnerSchema.index({ name: 1 });
ShippingPartnerSchema.index({ type: 1 });
ShippingPartnerSchema.index({ isActive: 1 });
ShippingPartnerSchema.index({ 'zones.pincodes': 1 });

// Virtual for overall rating
ShippingPartnerSchema.virtual('overallRating').get(function() {
  return Math.round((this.reliabilityScore + this.costEffectiveness) / 2);
});

// Method to check if partner supports a service
ShippingPartnerSchema.methods.supportsService = function(service: string): boolean {
  return this.supportedServices.includes(service);
};

// Method to check if partner covers a pincode
ShippingPartnerSchema.methods.coversPincode = function(pincode: string): boolean {
  return this.zones.some((zone: any) => 
    zone.isActive && zone.pincodes.includes(pincode)
  );
};

// Method to get shipping rate for pincode and weight
ShippingPartnerSchema.methods.getShippingRate = function(pincode: string, weight: string): any {
  const zone = this.zones.find((zone: any) => 
    zone.isActive && zone.pincodes.includes(pincode)
  );
  
  if (!zone) return null;
  
  const rate = zone.rates.find((rate: any) => rate.weight === weight);
  return rate || null;
};

// Method to calculate shipping cost
ShippingPartnerSchema.methods.calculateShippingCost = function(
  pincode: string, 
  weightInKg: number, 
  serviceType?: string
): any {
  const zone = this.zones.find((zone: any) => 
    zone.isActive && zone.pincodes.includes(pincode)
  );
  
  if (!zone) {
    return {
      success: false,
      error: 'Pincode not covered'
    };
  }

  // Find appropriate weight slab
  let applicableRate = null;
  for (const rate of zone.rates) {
    const [minWeight, maxWeight] = rate.weight.split('-').map((w: string) => {
      const num = parseFloat(w.replace(/[^\d.]/g, ''));
      return w.includes('kg') ? num : num / 1000; // Convert grams to kg
    });

    if (weightInKg >= minWeight && (maxWeight ? weightInKg <= maxWeight : true)) {
      applicableRate = rate;
      break;
    }
  }

  if (!applicableRate) {
    return {
      success: false,
      error: 'No rate found for given weight'
    };
  }

  return {
    success: true,
    cost: applicableRate.price,
    deliveryDays: applicableRate.deliveryDays,
    zone: zone.name,
    weightSlab: applicableRate.weight
  };
};

// Static method to get active partners
ShippingPartnerSchema.statics.getActivePartners = function() {
  return this.find({ isActive: true }).sort({ priority: -1 });
};

// Static method to get partners by pincode
ShippingPartnerSchema.statics.getPartnersByPincode = function(pincode: string) {
  return this.find({
    isActive: true,
    'zones.pincodes': pincode,
    'zones.isActive': true
  }).sort({ priority: -1 });
};

// Static method to get best rates for pincode and weight
ShippingPartnerSchema.statics.getBestRates = async function(pincode: string, weight: number) {
  const partners = await this.getPartnersByPincode(pincode);
  const rates = [];

  for (const partner of partners) {
    const result = partner.calculateShippingCost(pincode, weight);
    if (result.success) {
      rates.push({
        partner: partner.name,
        displayName: partner.displayName,
        cost: result.cost,
        deliveryDays: result.deliveryDays,
        reliabilityScore: partner.reliabilityScore
      });
    }
  }

  return rates.sort((a, b) => a.cost - b.cost);
};

export default mongoose.model('ShippingPartner', ShippingPartnerSchema);