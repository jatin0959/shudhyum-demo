import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Heart, Gift } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const cartItems = [
  {
    id: 1,
    name: "Whole Wheat Atta",
    price: 45,
    originalPrice: 55,
    quantity: 2,
    weight: "1 KG",
    image: "https://images.unsplash.com/photo-1627744515559-a15ff44a8a50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGZsb3VyJTIwZ3JhaW5zJTIwaGVhbHRoeSUyMG9yZ2FuaWN8ZW58MXx8fHwxNzU5NjU1Njc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    inStock: true
  },
  {
    id: 2,
    name: "Multi-Grain Atta",
    price: 65,
    originalPrice: 75,
    quantity: 1,
    weight: "1 KG",
    image: "https://images.unsplash.com/photo-1623066798929-946425dbe1b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZ3JhaW5zJTIwdmFyaWV0eSUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzU5NjU2MzY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    inStock: true
  },
  {
    id: 3,
    name: "Jowar Atta",
    price: 55,
    originalPrice: 65,
    quantity: 1,
    weight: "1 KG",
    image: "https://images.unsplash.com/photo-1661174282476-43db0a70d7fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZ3JhaW5zJTIwd2hlYXQlMjBiYXJsZXl8ZW58MXx8fHwxNzU5NjU1Njc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    inStock: true
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export function CartPage() {
  const [items, setItems] = useState(cartItems);
  const [promoCode, setPromoCode] = useState('');

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = items.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 40;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section 
        className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4"
            >
              <ShoppingBag className="h-8 w-8" />
            </motion.div>
            <motion.h1 
              className="text-4xl lg:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Shopping Cart
            </motion.h1>
            <motion.p 
              className="text-xl text-green-100 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Review your selected items and proceed to checkout
            </motion.p>
          </div>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-12">
        {items.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-gray-400 mb-6">
              <ShoppingBag className="h-24 w-24 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-4">Your cart is empty</h3>
            <p className="text-gray-500 mb-8">Discover our premium quality atta and fill your cart with healthy goodness</p>
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <a href="#products">Continue Shopping</a>
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            className="grid lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <motion.div 
                className="flex items-center justify-between mb-6"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-bold text-gray-900">
                  Cart Items ({items.length})
                </h2>
                <Badge variant="secondary" className="text-green-600 bg-green-50">
                  You saved ₹{savings} today!
                </Badge>
              </motion.div>

              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <motion.div 
                          className="flex-shrink-0"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        </motion.div>

                        {/* Product Details */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">{item.name}</h3>
                              <p className="text-sm text-gray-500">{item.weight}</p>
                            </div>
                            <motion.button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-2"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </motion.button>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-gray-900">₹{item.price}</span>
                            <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-1">
                              <motion.button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-2 hover:bg-white rounded-md transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </motion.button>
                              <span className="w-12 text-center font-semibold">{item.quantity}</span>
                              <motion.button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-white rounded-md transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Plus className="h-4 w-4" />
                              </motion.button>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">₹{item.price * item.quantity}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <motion.div variants={itemVariants}>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gift className="h-5 w-5 text-green-600" />
                    <span>Order Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Promo Code */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Promo Code</label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button variant="outline" size="sm">Apply</Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>You Save</span>
                      <span>-₹{savings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-gray-500">
                        Add ₹{500 - subtotal} more for free shipping
                      </p>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      size="lg" 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>

                  {/* Continue Shopping */}
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full"
                    asChild
                  >
                    <a href="#products">Continue Shopping</a>
                  </Button>

                  {/* Trust Badges */}
                  <div className="pt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Heart className="h-4 w-4 mr-2 text-red-500" />
                      <span>Loved by 10,000+ families</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-4 h-4 mr-2 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                      <span>Fresh guarantee or money back</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}