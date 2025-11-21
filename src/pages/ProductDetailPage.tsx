import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { 
  Star, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  Leaf, 
  Award,
  Clock,
  CheckCircle,
  ArrowLeft,
  Package,
  Users,
  Calendar
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useApp } from '../contexts/AppContext';

// Icon mapping for features
const iconMap: { [key: string]: any } = {
  leaf: Leaf,
  shield: Shield,
  clock: Clock,
  heart: Heart,
  star: Star,
  check: CheckCircle,
  grain: Package,
  mountain: Award
};

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

interface ProductDetailPageProps {
  productId?: string;
}

export function ProductDetailPage({ productId }: ProductDetailPageProps = {}) {
  const { state, dispatch } = useApp();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Get product from context - use first product if productId not specified
  const products = state.products || [];
  const product = productId 
    ? products.find(p => p.id === productId) 
    : products[0];

  // Handle case where product is not found
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Calculate expected delivery date
  const calculateDeliveryDate = () => {
    const today = new Date();
    const deliveryDays = 3; // Default 3 days
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + deliveryDays);
    return deliveryDate.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Default features if none provided
  const defaultFeatures = [
    { icon: 'leaf', title: '100% Organic', description: 'Certified organic ingredients' },
    { icon: 'shield', title: 'No Preservatives', description: 'Completely natural with no artificial additives' },
    { icon: 'clock', title: 'Fresh Ground', description: 'Ground to order for maximum freshness' },
    { icon: 'star', title: 'Premium Quality', description: 'Hand-selected grains for superior taste' }
  ];

  // Default nutrition facts if none provided
  const defaultNutrition = [
    { nutrient: 'Protein', value: '12.5g', percentage: 25 },
    { nutrient: 'Fiber', value: '11.2g', percentage: 45 },
    { nutrient: 'Iron', value: '4.2mg', percentage: 23 },
    { nutrient: 'Vitamin B6', value: '0.3mg', percentage: 18 }
  ];

  // Mock reviews for now
  const reviews = [
    {
      id: 1,
      user: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      comment: 'Absolutely love this atta! The rotis are so soft and taste incredibly fresh. You can really tell the difference in quality.',
      date: '2 weeks ago',
      verified: true
    },
    {
      id: 2,
      user: 'Rajesh Kumar',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      comment: 'Been ordering for 6 months now. Consistent quality and freshness every time. Highly recommended!',
      date: '1 month ago',
      verified: true
    }
  ];

  const updateQuantity = (change: number) => {
    setQuantity(Math.max(1, Math.min(product.stockCount || 50, quantity + change)));
  };

  // Use product data or fallback to defaults
  const features = product.features && product.features.length > 0 ? product.features : defaultFeatures;
  const nutritionFacts = product.nutritionFacts && product.nutritionFacts.length > 0 ? product.nutritionFacts : defaultNutrition;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <motion.section 
        className="bg-white py-4 border-b"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <motion.a 
              href="#home" 
              className="hover:text-green-600 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Home
            </motion.a>
            <span>/</span>
            <motion.a 
              href="#products" 
              className="hover:text-green-600 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Products
            </motion.a>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Products</span>
          </motion.button>
        </motion.div>

        <motion.div 
          className="grid lg:grid-cols-2 gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Product Images */}
          <motion.div className="space-y-4" variants={itemVariants}>
            {/* Main Image */}
            <motion.div 
              className="relative overflow-hidden rounded-xl shadow-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <ImageWithFallback
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">Out of Stock</span>
                </div>
              )}
            </motion.div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-3">
              {product.images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === index ? 'border-green-600' : 'border-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div className="space-y-6" variants={itemVariants}>
            {/* Title and Rating */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  Premium Quality
                </Badge>
                {product.inStock ? (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-lg font-semibold text-gray-900">{product.rating}</span>
                </div>
                <span className="text-gray-600">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
              <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
              <Badge className="bg-orange-100 text-orange-700">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </Badge>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Weight and Stock */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-gray-400" />
                <span className="font-semibold">Weight: {product.weight}</span>
              </div>
              {product.inStock && (
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{product.stockCount} left in stock</span>
                </div>
              )}
            </div>

            {/* Delivery Information */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Truck className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-800 mb-2">Delivery Information</h4>
                  <div className="space-y-1 text-sm text-green-700">
                    <div className="flex items-center justify-between">
                      <span>Expected Delivery:</span>
                      <span className="font-medium">{calculateDeliveryDate()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Shipping Partner:</span>
                      <span className="font-medium">Blue Dart Express</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Delivery Charge:</span>
                      <span className="font-medium text-green-600">FREE</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center space-x-2 text-xs text-green-600">
                    <Calendar className="h-3 w-3" />
                    <span>Order within 2 hours for same-day dispatch</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-2">
                  <motion.button
                    onClick={() => updateQuantity(-1)}
                    disabled={quantity <= 1}
                    className="p-1 hover:bg-white rounded transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Minus className="h-4 w-4" />
                  </motion.button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <motion.button
                    onClick={() => updateQuantity(1)}
                    className="p-1 hover:bg-white rounded transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.div 
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    size="lg" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart - ₹{product.price * quantity}
                  </Button>
                </motion.div>
                <motion.button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-3 border rounded-lg transition-all ${
                    isFavorite 
                      ? 'bg-red-50 border-red-200 text-red-600' 
                      : 'border-gray-300 text-gray-600 hover:border-red-200 hover:text-red-600'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                </motion.button>
                <motion.button
                  className="p-3 border border-gray-300 rounded-lg text-gray-600 hover:border-green-200 hover:text-green-600 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 className="h-5 w-5" />
                </motion.button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Truck className="h-4 w-4 text-green-600" />
                <span>Free delivery above ₹500</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 text-green-600" />
                <span>100% satisfaction guarantee</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4 text-green-600" />
                <span>Fresh ground to order</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>No preservatives added</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Product Details Tabs */}
        <motion.section 
          className="mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Product Description</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{product.longDescription}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Key Benefits:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Rich in fiber and essential nutrients</li>
                      <li>Stone ground to preserve natural oils</li>
                      <li>Perfect for making soft, fluffy rotis</li>
                      <li>Sourced from certified organic farms</li>
                      <li>No artificial preservatives or additives</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nutrition" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Nutrition Facts (per 100g)</h3>
                  <div className="space-y-4">
                    {nutritionFacts.map((fact, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{fact.nutrient}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <motion.div 
                              className="bg-green-600 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${fact.percentage}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-12">{fact.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="bg-green-100 p-3 rounded-lg">
                            {React.createElement(iconMap[feature.icon] || Leaf, { className: "h-6 w-6 text-green-600" })}
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">{feature.title}</h4>
                            <p className="text-gray-600">{feature.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Customer Reviews</span>
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">{product.rating}</span>
                        <span className="text-gray-500">({product.reviewCount} reviews)</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {reviews.map((review) => (
                      <motion.div
                        key={review.id}
                        className="border-b border-gray-100 pb-6 last:border-b-0"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarImage src={review.avatar} />
                            <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-semibold">{review.user}</span>
                              {review.verified && (
                                <Badge variant="secondary" className="text-green-600 bg-green-50">
                                  Verified Purchase
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="flex space-x-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.section>
      </div>
    </div>
  );
}