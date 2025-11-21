import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  CreditCard, 
  Bell, 
  Gift, 
  Star,
  Truck,
  Clock,
  CheckCircle,
  RotateCcw,
  Settings,
  LogOut,
  Edit,
  Plus,
  Eye
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useApp } from '../contexts/AppContext'; // Add this import

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

export function AccountPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { state } = useApp(); // Add this line
  const currentUser = state.currentUser; // Add this line

  // Add a check for logged-in user
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Please Log In</h2>
          <p className="text-gray-600">You need to be logged in to view this page.</p>
        </div>
      </div>
    );
  }

  // Replace static userData with currentUser data
  const userData = {
    name: `${currentUser.firstName} ${currentUser.lastName}`,
    email: currentUser.email,
    phone: currentUser.phone,
    avatar: currentUser.avatar || "",
    memberSince: new Date(currentUser.createdAt).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    }),
    loyaltyPoints: currentUser.loyaltyPoints,
    totalOrders: currentUser.totalOrders,
    totalSpent: currentUser.totalSpent
  };

  const recentOrders = [
    {
      id: "ORD-2024-001",
      date: "2024-01-15",
      status: "delivered",
      total: 545,
      items: 3,
      image: "https://images.unsplash.com/photo-1627744515559-a15ff44a8a50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGZsb3VyJTIwZ3JhaW5zJTIwaGVhbHRoeSUyMG9yZ2FuaWN8ZW58MXx8fHwxNzU5NjU1Njc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      trackingId: "TRK123456789"
    },
    {
      id: "ORD-2024-002",
      date: "2024-01-10",
      status: "processing",
      total: 320,
      items: 2,
      image: "https://images.unsplash.com/photo-1623066798929-946425dbe1b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZ3JhaW5zJTIwdmFyaWV0eSUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzU5NjU2MzY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      trackingId: "TRK123456790"
    },
    {
      id: "ORD-2024-003",
      date: "2024-01-05",
      status: "shipped",
      total: 425,
      items: 2,
      image: "https://images.unsplash.com/photo-1661174282476-43db0a70d7fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZ3JhaW5zJTIwd2hlYXQlMjBiYXJsZXl8ZW58MXx8fHwxNzU5NjU1Njc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      trackingId: "TRK123456791"
    }
  ];

  const favoriteProducts = [
    {
      id: 1,
      name: "Whole Wheat Atta",
      price: 45,
      image: "https://images.unsplash.com/photo-1627744515559-a15ff44a8a50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGZsb3VyJTIwZ3JhaW5zJTIwaGVhbHRoeSUyMG9yZ2FuaWN8ZW58MXx8fHwxNzU5NjU1Njc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      inStock: true
    },
    {
      id: 2,
      name: "Multi-Grain Atta",
      price: 65,
      image: "https://images.unsplash.com/photo-1623066798929-946425dbe1b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZ3JhaW5zJTIwdmFyaWV0eSUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzU5NjU2MzY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      inStock: true
    }
  ];

  const addresses = [
    {
      id: 1,
      type: "Home",
      name: "Priya Sharma",
      address: "A-402, Green Valley Apartments, Sector 18, Noida, UP - 201301",
      phone: "+91 98765 43210",
      isDefault: true
    },
    {
      id: 2,
      type: "Office",
      name: "Priya Sharma",
      address: "Tower B, 5th Floor, IT Park, Sector 62, Noida, UP - 201309",
      phone: "+91 98765 43210",
      isDefault: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'shipped': return Truck;
      case 'processing': return Clock;
      case 'cancelled': return RotateCcw;
      default: return Package;
    }
  };

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
          <motion.div 
            className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Avatar className="w-24 h-24 border-4 border-white/20">
                <AvatarImage src={userData.avatar} />
                <AvatarFallback className="text-2xl">{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </motion.div>
            
            <motion.div className="text-center md:text-left flex-1" variants={itemVariants}>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {userData.name}!</h1>
              <p className="text-green-100 mb-4">Member since {userData.memberSince}</p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold">{userData.totalOrders}</div>
                  <div className="text-green-100 text-sm">Total Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">₹{userData.totalSpent.toLocaleString()}</div>
                  <div className="text-green-100 text-sm">Total Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userData.loyaltyPoints}</div>
                  <div className="text-green-100 text-sm">Loyalty Points</div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Favorites</span>
              </TabsTrigger>
              <TabsTrigger value="addresses" className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Addresses</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
              >
                {/* Loyalty Status */}
                <motion.div variants={itemVariants}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2">
                        <Gift className="h-5 w-5 text-green-600" />
                        <span>Loyalty Status</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Current Points</span>
                          <span className="font-bold text-green-600">{userData.loyaltyPoints}</span>
                        </div>
                        <Progress value={62} className="h-2" />
                        <p className="text-xs text-gray-500">
                          750 more points to reach Gold status
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={itemVariants}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Package className="mr-2 h-4 w-4" />
                        Reorder Previous Items
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Truck className="mr-2 h-4 w-4" />
                        Track Current Orders
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Bell className="mr-2 h-4 w-4" />
                        Update Preferences
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Account Summary */}
                <motion.div variants={itemVariants}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle>Account Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Orders</span>
                        <span className="font-semibold">2</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Saved Items</span>
                        <span className="font-semibold">{favoriteProducts.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Addresses</span>
                        <span className="font-semibold">{addresses.length}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Recent Orders */}
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentOrders.slice(0, 3).map((order) => {
                        const StatusIcon = getStatusIcon(order.status);
                        return (
                          <motion.div
                            key={order.id}
                            className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                            whileHover={{ scale: 1.02 }}
                          >
                            <ImageWithFallback
                              src={order.image}
                              alt="Order"
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-semibold">{order.id}</span>
                                <Badge className={getStatusColor(order.status)}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {order.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{order.items} items • ₹{order.total}</p>
                              <p className="text-xs text-gray-500">{order.date}</p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentOrders.map((order) => {
                        const StatusIcon = getStatusIcon(order.status);
                        return (
                          <motion.div
                            key={order.id}
                            className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                            whileHover={{ scale: 1.01 }}
                          >
                            <ImageWithFallback
                              src={order.image}
                              alt="Order"
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-semibold text-lg">{order.id}</span>
                                <Badge className={getStatusColor(order.status)}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {order.status.toUpperCase()}
                                </Badge>
                              </div>
                              <p className="text-gray-600 mb-1">{order.items} items • Total: ₹{order.total}</p>
                              <p className="text-sm text-gray-500">Ordered on {order.date}</p>
                              <p className="text-sm text-gray-500">Tracking ID: {order.trackingId}</p>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                              <Button variant="outline" size="sm">
                                <Truck className="h-4 w-4 mr-2" />
                                Track Order
                              </Button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="space-y-6">
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Your Favorite Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoriteProducts.map((product) => (
                        <motion.div
                          key={product.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                          whileHover={{ scale: 1.03 }}
                        >
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <h3 className="font-semibold mb-2">{product.name}</h3>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                            <Badge variant={product.inStock ? "secondary" : "destructive"}>
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                              Add to Cart
                            </Button>
                            <Button variant="outline" size="sm">
                              <Heart className="h-4 w-4 fill-current text-red-500" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="space-y-6">
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Saved Addresses</CardTitle>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Address
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <motion.div
                          key={address.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-semibold">{address.type}</span>
                                {address.isDefault && (
                                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <p className="font-medium mb-1">{address.name}</p>
                              <p className="text-gray-600 mb-1">{address.address}</p>
                              <p className="text-sm text-gray-500">{address.phone}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                Delete
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <motion.div 
                className="grid md:grid-cols-2 gap-6"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Email Notifications</span>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>SMS Notifications</span>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Privacy Settings</span>
                        <Button variant="outline" size="sm">Manage</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Data Export</span>
                        <Button variant="outline" size="sm">Download</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Security</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Change Password</span>
                        <Button variant="outline" size="sm">Update</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Two-Factor Authentication</span>
                        <Button variant="outline" size="sm">Enable</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Login Sessions</span>
                        <Button variant="outline" size="sm">Manage</Button>
                      </div>
                      <div className="flex items-center justify-between text-red-600">
                        <span>Delete Account</span>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold mb-1">Sign Out</h3>
                        <p className="text-sm text-gray-600">Sign out from your account on this device</p>
                      </div>
                      <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}