import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  weight: String,
  image: String,
  sku: String
}, { _id: false });

const AddressSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  landmark: String,
  addressType: {
    type: String,
    enum: ['home', 'office', 'other'],
    default: 'home'
  }
}, { _id: false });

const PaymentSchema = new Schema({
  method: {
    type: String,
    required: true,
    enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'cod', 'emi']
  },
  gateway: {
    type: String,
    required: true
  },
  transactionId: String,
  gatewayTransactionId: String,
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  fees: {
    type: Number,
    default: 0
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: String,
  failureReason: String,
  processedAt: Date,
  refundedAt: Date
}, { _id: false });

const ShippingSchema = new Schema({
  partner: {
    type: String,
    required: true
  },
  serviceType: String,
  trackingId: String,
  estimatedDelivery: Date,
  actualDelivery: Date,
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  pickupDate: Date,
  deliveryAttempts: [{
    date: Date,
    status: String,
    remarks: String
  }]
}, { _id: false });

const OrderSchema = new Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [OrderItemSchema],
  
  // Pricing
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shipping: {
    type: Number,
    default: 0,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded'],
    default: 'pending'
  },
  
  // Addresses
  shippingAddress: {
    type: AddressSchema,
    required: true
  },
  billingAddress: AddressSchema,
  
  // Payment
  payment: PaymentSchema,
  
  // Shipping
  shipping: ShippingSchema,
  
  // Metadata
  notes: String,
  adminNotes: String,
  source: {
    type: String,
    enum: ['web', 'mobile', 'admin'],
    default: 'web'
  },
  
  // Timestamps for status changes
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    notes: String,
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Customer communication
  notifications: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'push']
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'failed']
    },
    sentAt: Date,
    content: String
  }],
  
  // Reviews and feedback
  review: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    reviewedAt: Date
  },
  
  // Cancellation/Return
  cancellation: {
    reason: String,
    requestedAt: Date,
    approvedAt: Date,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'failed']
    }
  },
  
  return: {
    reason: String,
    requestedAt: Date,
    approvedAt: Date,
    pickupScheduled: Date,
    returnTrackingId: String,
    refundAmount: Number,
    restockingFee: Number,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'failed']
    }
  }
}, {
  timestamps: true
});

// Indexes
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ 'payment.status': 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ 'shippingAddress.pincode': 1 });

// Virtual for order age
OrderSchema.virtual('orderAge').get(function() {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to generate order number
OrderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Get the last order number for today
    const lastOrder = await this.constructor.findOne({
      orderNumber: new RegExp(`^SH${year}${month}${day}`)
    }).sort({ orderNumber: -1 });
    
    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
      sequence = lastSequence + 1;
    }
    
    this.orderNumber = `SH${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
  }
  next();
});

// Method to add status history
OrderSchema.methods.addStatusHistory = function(status: string, notes?: string, updatedBy?: string) {
  this.statusHistory.push({
    status,
    notes,
    updatedBy,
    timestamp: new Date()
  });
  this.status = status;
};

// Method to calculate totals
OrderSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  this.total = this.subtotal + this.shipping + this.tax - this.discount;
};

// Method to check if order can be cancelled
OrderSchema.methods.canBeCancelled = function(): boolean {
  return ['pending', 'confirmed', 'processing'].includes(this.status);
};

// Method to check if order can be returned
OrderSchema.methods.canBeReturned = function(): boolean {
  if (this.status !== 'delivered') return false;
  const deliveryDate = this.shipping?.actualDelivery || this.updatedAt;
  const daysSinceDelivery = (Date.now() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceDelivery <= 7; // 7 days return policy
};

// Static method to get orders by status
OrderSchema.statics.getByStatus = function(status: string) {
  return this.find({ status }).populate('userId', 'firstName lastName email');
};

// Static method to get recent orders
OrderSchema.statics.getRecentOrders = function(limit: number = 10) {
  return this.find()
    .populate('userId', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get orders by date range
OrderSchema.statics.getByDateRange = function(startDate: Date, endDate: Date) {
  return this.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  }).populate('userId', 'firstName lastName email');
};

// Static method to get revenue stats
OrderSchema.statics.getRevenueStats = async function(period: string = '30d') {
  const days = parseInt(period.replace('d', ''));
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: { $in: ['delivered', 'shipped'] }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$total' },
        totalOrders: { $sum: 1 },
        averageOrderValue: { $avg: '$total' }
      }
    }
  ]);
};

export default mongoose.model('Order', OrderSchema);