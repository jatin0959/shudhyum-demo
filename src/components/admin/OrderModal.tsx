import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Save
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Order } from '../../contexts/AppContext';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order | null;
  mode: 'view' | 'edit';
}

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-orange-100 text-orange-700', icon: Clock },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  { value: 'processing', label: 'Processing', color: 'bg-yellow-100 text-yellow-700', icon: Package },
  { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: Truck },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
  { value: 'returned', label: 'Returned', color: 'bg-gray-100 text-gray-700', icon: RotateCcw }
];

export function OrderModal({ isOpen, onClose, order, mode }: OrderModalProps) {
  const { dispatch } = useApp();
  const [currentStatus, setCurrentStatus] = useState(order?.status || 'pending');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (order) {
      setCurrentStatus(order.status);
      setNotes('');
    }
  }, [order, isOpen]);

  const handleUpdateStatus = () => {
    if (order && currentStatus !== order.status) {
      const updatedOrder = {
        ...order,
        status: currentStatus,
        updatedAt: new Date().toISOString()
      };
      
      dispatch({ type: 'UPDATE_ORDER', payload: updatedOrder });
      onClose();
    }
  };

  if (!order) return null;

  const isReadOnly = mode === 'view';
  const title = mode === 'edit' ? 'Update Order' : 'Order Details';

  const currentStatusInfo = statusOptions.find(s => s.value === currentStatus);
  const StatusIcon = currentStatusInfo?.icon || Package;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-green-600" />
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription>
            Order ID: {order.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <StatusIcon className="h-6 w-6 text-gray-600" />
              <div>
                <h3 className="font-semibold">Current Status</h3>
                <Badge className={currentStatusInfo?.color}>
                  {currentStatusInfo?.label}
                </Badge>
              </div>
            </div>
            {!isReadOnly && (
              <div className="flex items-center space-x-3">
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Items */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Order Items</h3>
              <div className="space-y-3">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <img
                      src={item.image || 'https://via.placeholder.com/60'}
                      alt={item.name}
                      className="w-15 h-15 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.weight}</p>
                      <p className="text-sm">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">₹{item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Order Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{order.shipping?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{order.tax?.toFixed(2) || '0.00'}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{order.total?.toFixed(2) || '0.00'}</span>
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-2">
                <h4 className="font-medium">Payment Information</h4>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-gray-600" />
                  <span>{order.paymentMethod || 'Not specified'}</span>
                  <Badge variant={order.paymentStatus === 'completed' ? 'secondary' : 'destructive'}>
                    {order.paymentStatus || 'Pending'}
                  </Badge>
                </div>
              </div>

              {/* Shipping Information */}
              {order.trackingId && (
                <div className="space-y-2">
                  <h4 className="font-medium">Shipping Information</h4>
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-gray-600" />
                    <span>Tracking ID: {order.trackingId}</span>
                  </div>
                  {order.shippingPartner && (
                    <p className="text-sm text-gray-600">Via {order.shippingPartner}</p>
                  )}
                  {order.estimatedDelivery && (
                    <p className="text-sm text-gray-600">
                      Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Details */}
              <div className="space-y-2">
                <h4 className="font-medium flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Customer</span>
                </h4>
                <p>Customer ID: {order.userId}</p>
              </div>

              {/* Shipping Address */}
              <div className="space-y-2">
                <h4 className="font-medium flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Shipping Address</span>
                </h4>
                {order.shippingAddress && (
                  <div className="text-sm text-gray-600">
                    <p>{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                    <p>{order.shippingAddress.phone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Order Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Order Placed</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {order.updatedAt !== order.createdAt && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          {!isReadOnly && (
            <div className="space-y-2">
              <label htmlFor="notes" className="font-medium">Add Notes (Optional)</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this status update..."
                className="w-full p-3 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {isReadOnly ? 'Close' : 'Cancel'}
          </Button>
          {!isReadOnly && (
            <Button 
              onClick={handleUpdateStatus} 
              className="bg-green-600 hover:bg-green-700"
              disabled={currentStatus === order.status}
            >
              <Save className="h-4 w-4 mr-2" />
              Update Status
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}