import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PaymentGatewaySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['razorpay', 'stripe', 'paypal', 'payu', 'cashfree', 'phonepe']
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
    webhookSecret: String,
    environment: {
      type: String,
      enum: ['sandbox', 'production'],
      default: 'sandbox'
    }
  },
  supportedMethods: [{
    type: String,
    enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'emi', 'cod']
  }],
  supportedCurrencies: [{
    type: String,
    default: ['INR']
  }],
  fees: {
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    },
    value: {
      type: Number,
      required: true,
      min: 0
    }
  },
  minAmount: {
    type: Number,
    default: 1,
    min: 0
  },
  maxAmount: {
    type: Number,
    default: 1000000,
    min: 1
  },
  country: [{
    type: String,
    default: ['IN']
  }],
  logo: String,
  websiteUrl: String,
  documentationUrl: String,
  features: [String],
  settlementTime: {
    type: String,
    default: 'T+1'
  },
  priority: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
PaymentGatewaySchema.index({ name: 1 });
PaymentGatewaySchema.index({ type: 1 });
PaymentGatewaySchema.index({ isActive: 1 });

// Virtual for formatted fees
PaymentGatewaySchema.virtual('formattedFees').get(function() {
  if (this.fees.type === 'percentage') {
    return `${this.fees.value}%`;
  }
  return `₹${this.fees.value}`;
});

// Method to check if gateway supports a payment method
PaymentGatewaySchema.methods.supportsMethod = function(method: string): boolean {
  return this.supportedMethods.includes(method);
};

// Method to check if gateway supports a currency
PaymentGatewaySchema.methods.supportsCurrency = function(currency: string): boolean {
  return this.supportedCurrencies.includes(currency);
};

// Method to calculate fees for an amount
PaymentGatewaySchema.methods.calculateFees = function(amount: number): number {
  if (this.fees.type === 'percentage') {
    return (amount * this.fees.value) / 100;
  }
  return this.fees.value;
};

// Static method to get active gateways
PaymentGatewaySchema.statics.getActiveGateways = function() {
  return this.find({ isActive: true }).sort({ priority: -1 });
};

// Static method to get gateway by type
PaymentGatewaySchema.statics.getByType = function(type: string) {
  return this.findOne({ type, isActive: true });
};

export default mongoose.model('PaymentGateway', PaymentGatewaySchema);