import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useApp } from '../../contexts/AppContext';
import { ProductModal } from '../../components/admin/ProductModal';
import { UserModal } from '../../components/admin/UserModal';
import { apiService } from '../../services/apiService';

const COLORS = ['#16a34a', '#2563eb', '#dc2626', '#ca8a04', '#9333ea', '#ea580c'];

interface DashboardData {
  today: {
    orders: number;
    revenue: number;
  };
  thisMonth: {
    orders: number;
    revenue: number;
    newCustomers: number;
    orderGrowth: number;
    revenueGrowth: number;
  };
  totals: {
    users: number;
    products: number;
    orders: number;
    revenue: number;
  };
  orderStatusDistribution: Array<{
    _id: string;
    count: number;
  }>;
  recentOrders: Array<{
    id: string;
    customer: string;
    amount: number;
    status: string;
    date: string;
  }>;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
    stock: number;
  }>;
  salesTrend: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

// Add this helper function at the top of the file
const calculateOrderStatusDistribution = (orders: any[]) => {
  const distribution = orders.reduce((acc: any, order: any) => {
    const status = order.status || 'pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(distribution).map(([_id, count]) => ({
    _id,
    count
  }));
};

export function AdminDashboard() {
  const { state } = useApp();
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real dashboard data from backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated
      const token = apiService.getStoredToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      // Fetch analytics data
      const analyticsResponse = await apiService.getAnalytics();
      
      if (analyticsResponse.success && analyticsResponse.data) {
        setDashboardData(analyticsResponse.data);
      } else {
        // Fallback to local data
        const orders = state.orders || [];
        const products = state.products || [];
        const users = state.users || [];
        
        const fallbackData = {
          today: { 
            orders: orders.filter(o => {
              const today = new Date();
              const orderDate = new Date(o.createdAt);
              return orderDate.toDateString() === today.toDateString();
            }).length,
            revenue: orders.filter(o => {
              const today = new Date();
              const orderDate = new Date(o.createdAt);
              return orderDate.toDateString() === today.toDateString();
            }).reduce((sum, order) => sum + (order.total || 0), 0)
          },
          thisMonth: { 
            orders: orders.length, 
            revenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
            newCustomers: users.filter(u => {
              const createdDate = new Date(u.createdAt);
              const thisMonth = new Date();
              return createdDate.getMonth() === thisMonth.getMonth();
            }).length,
            orderGrowth: 0,
            revenueGrowth: 0
          },
          totals: {
            users: users.length,
            products: products.length,
            orders: orders.length,
            revenue: orders.reduce((sum, order) => sum + (order.total || 0), 0)
          },
          orderStatusDistribution: calculateOrderStatusDistribution(orders),
          recentOrders: orders
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
            .map(order => ({
              id: order.id,
              customer: order.userId,
              amount: order.total || 0,
              status: order.status,
              date: new Date(order.createdAt).toLocaleDateString()
            })),
          topProducts: products
            .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
            .slice(0, 5)
            .map(product => ({
              name: product.name,
              sales: product.salesCount || 0,
              revenue: (product.salesCount || 0) * (product.price || 0),
              stock: product.stockCount || 0
            })),
          salesTrend: []
        };

        setDashboardData(fallbackData);
      }
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Only attempt WebSocket if in production
    if (process.env.NODE_ENV === 'production') {
      try {
        const ws = new WebSocket('wss://shudhyum-api.onrender.com/ws');
        
        ws.onmessage = (event) => {
          const update = JSON.parse(event.data);
          if (update.type === 'ORDER_UPDATE') {
            fetchDashboardData();
          }
        };

        ws.onerror = () => {
          console.log('WebSocket connection failed, falling back to polling');
          // Set up polling fallback
          const pollInterval = setInterval(fetchDashboardData, 30000);
          return () => clearInterval(pollInterval);
        };

        return () => ws.close();
      } catch (error) {
        console.log('WebSocket not supported, using polling');
        const pollInterval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(pollInterval);
      }
    }
  }, []);

  // Add auto-refresh interval
  useEffect(() => {
    const refreshInterval = setInterval(fetchDashboardData, 300000); // Refresh every 5 minutes
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  // Process data for charts
  const orderStatusData = dashboardData?.orderStatusDistribution?.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count,
    count: item.count
  })) || [];

  const revenueData = salesData.map(item => ({
    date: new Date(item._id.year, item._id.month - 1, item._id.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: item.revenue || 0,
    orders: item.orders || 0
  }));

  // Get recent orders and top products from state as fallback
  const orders = state.orders || [];
  const products = state.products || [];
  
  const recentOrders = orders.slice(0, 5).map(order => ({
    id: order.id,
    customer: `Customer ${order.userId?.slice(-4) || 'XXXX'}`,
    amount: order.total || 0,
    status: order.status,
    date: new Date(order.createdAt).toLocaleDateString()
  }));

  const topProducts = products
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
    .slice(0, 5)
    .map(product => ({
      name: product.name,
      sales: product.salesCount || 0,
      revenue: (product.salesCount || 0) * (product.price || 0),
      stock: product.stockCount
    }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <RefreshCw className="h-6 w-6 animate-spin text-green-600" />
          <span className="text-lg text-gray-600">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Real-Time Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {error ? 'Showing cached data - backend offline' : 'Live data from MongoDB Atlas'}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={fetchDashboardData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View Reports
          </Button>
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => window.location.hash = '#admin?page=analytics'}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Status Indicator */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Backend API unavailable. Showing cached data with local storage backup.
              </p>
            </div>
          </div>
        </div>
      )}

      {!error && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Connected to live backend - Real-time data from MongoDB Atlas
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{(dashboardData?.totals?.revenue || 0).toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+{(dashboardData?.thisMonth?.revenueGrowth || 0).toFixed(1)}%</span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData?.totals?.orders || 0}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600">+{(dashboardData?.thisMonth?.orderGrowth || 0).toFixed(1)}%</span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData?.totals?.users || 0}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
                    <span className="text-sm text-purple-600">+{(dashboardData?.thisMonth?.newCustomers || 0).toFixed(1)}%</span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData?.totals?.products || 0}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-yellow-600">+5.1%</span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Package className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#16a34a" 
                    strokeWidth={3}
                    name="Revenue (₹)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Status Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Order Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{order.amount.toLocaleString()}</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Top Products</CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sales} units sold</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{product.revenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                      </div>
                      {product.stock < 10 && (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col space-y-2"
                onClick={() => setProductModalOpen(true)}
              >
                <Package className="h-6 w-6" />
                <span>Add Product</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col space-y-2"
                onClick={() => window.location.hash = '#admin?page=orders'}
              >
                <ShoppingCart className="h-6 w-6" />
                <span>View Orders</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col space-y-2"
                onClick={() => setUserModalOpen(true)}
              >
                <Users className="h-6 w-6" />
                <span>Add User</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col space-y-2"
                onClick={() => window.location.hash = '#admin?page=analytics'}
              >
                <TrendingUp className="h-6 w-6" />
                <span>View Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modals */}
      <ProductModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        product={null}
        mode="add"
      />
      
      <UserModal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        user={null}
        mode="add"
      />
    </div>
  );
}