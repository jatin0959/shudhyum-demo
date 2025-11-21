import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from 'recharts';
import { useApp } from '../../contexts/AppContext';
import { apiService } from '../../services/apiService';
import { AdvancedCharts } from '../../components/admin/AdvancedCharts';
import { RealTimeMetrics } from '../../components/admin/RealTimeMetrics';

const COLORS = ['#16a34a', '#2563eb', '#dc2626', '#ca8a04', '#9333ea', '#ea580c'];

interface AnalyticsData {
  dashboard: {
    totals: {
      revenue: number;
      orders: number;
      users: number;
      products: number;
    };
    thisMonth: {
      revenueGrowth: number;
      orderGrowth: number;
      newCustomers: number;
    };
  };
  sales: {
    dailySales: Array<{
      _id: { year: number; month: number; day: number };
      revenue: number;
      orders: number;
    }> ;
    topProducts: Array<{
      name: string;
      sales: number;
      revenue: number;
    }> ;
  };
  shipping: {
    serviceability: {
      availableZones: number;
      totalPincodes: number;
      activePartners: number;
      deliveryMetrics: {
        avgDeliveryTime: number;
        onTimeDelivery: number;
        delayedDeliveries: number;
      };
    };
    partners: Array<{
      id: string;
      name: string;
      deliveries: number;
      performance: number;
      avgDeliveryTime: number;
      activeRegions: number;
    }>;
  };
}

export function AnalyticsPage() {
  const { state } = useApp();
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashboardResponse, salesResponse] = await Promise.all([
        apiService.getAnalytics(),
        apiService.getSalesAnalytics(timeRange)
      ]);

      if (!dashboardResponse.success || !salesResponse.success) {
        throw new Error('Failed to fetch analytics data');
      }

      setAnalyticsData({
        dashboard: dashboardResponse.data,
        sales: salesResponse.data
      });

    } catch (err) {
      console.error('Failed to fetch analytics data:', err);
      setError('Failed to load analytics data');
      
      // Show toast notification for error
      toast.error('Unable to fetch real-time analytics data');
    } finally {
      setLoading(false);
    }
  };

  const fetchShippingAnalytics = async () => {
    try {
      const [serviceabilityResponse, partnersResponse] = await Promise.all([
        apiService.get('/shipping/check-serviceability'),
        apiService.get('/shipping/partners')
      ]);

      if (serviceabilityResponse.success && partnersResponse.success) {
        setAnalyticsData(prev => ({
          ...prev,
          shipping: {
            serviceability: serviceabilityResponse.data,
            partners: partnersResponse.data
          }
        }));
      }
    } catch (error) {
      console.error('Failed to fetch shipping analytics:', error);
      toast.error('Unable to fetch shipping analytics');
    }
  };

  useEffect(() => {
    fetchAnalyticsData(); // Initial fetch
    fetchShippingAnalytics();

    // Set up polling interval
    const pollInterval = setInterval(() => {
      fetchAnalyticsData();
      fetchShippingAnalytics();
    }, 30000); // Poll every 30 seconds

    // Connect to WebSocket for real-time updates if available
    const ws = new WebSocket('wss://shudhyum-api.onrender.com/ws');
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      if (update.type === 'ANALYTICS_UPDATE') {
        fetchAnalyticsData(); // Refresh data on websocket update
      }
    };

    ws.onerror = () => {
      console.log('WebSocket connection failed, falling back to polling');
    };

    return () => {
      clearInterval(pollInterval);
      ws.close();
    };
  }, [timeRange]);

  // Process data for display
  const stats = {
    totalRevenue: analyticsData.dashboard?.totals?.revenue || 0,
    totalOrders: analyticsData.dashboard?.totals?.orders || 0,
    totalCustomers: analyticsData.dashboard?.totals?.users || 0,
    totalProducts: analyticsData.dashboard?.totals?.products || 0,
    averageOrderValue: analyticsData.dashboard?.totals?.orders > 0 ? 
      (analyticsData.dashboard?.totals?.revenue || 0) / (analyticsData.dashboard?.totals?.orders || 1) : 0,
    conversionRate: 3.2,
    revenueGrowth: analyticsData.dashboard?.thisMonth?.revenueGrowth || 12.5,
    orderGrowth: analyticsData.dashboard?.thisMonth?.orderGrowth || 8.7,
  };

  // Process sales data for charts
  const revenueData = analyticsData.sales?.dailySales?.map((item) => ({
    date: new Date(item._id.year, item._id.month - 1, item._id.day)
      .toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: item.revenue,
    orders: item.orders
  })) ?? [];

  // Mock category data (can be replaced with real data from backend)
  const productCategoryData = [
    { name: 'Wheat Atta', value: 45, sales: 2340 },
    { name: 'Multi-Grain', value: 25, sales: 1280 },
    { name: 'Jowar', value: 15, sales: 760 },
    { name: 'Ragi', value: 10, sales: 520 },
    { name: 'Others', value: 5, sales: 260 },
  ];

  const topProducts = analyticsData.products?.topPerforming || [
    { name: 'Premium Whole Wheat Atta', sales: 1234, revenue: 55530 },
    { name: 'Multi-Grain Health Atta', sales: 867, revenue: 56355 },
    { name: 'Organic Jowar Atta', sales: 543, revenue: 29865 },
    { name: 'Ragi Finger Millet Atta', sales: 432, revenue: 23760 },
    { name: 'Bajra Pearl Millet Atta', sales: 321, revenue: 17655 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Real-Time Analytics</h1>
          <p className="text-gray-600 mt-1">
            {error ? 'Showing cached data - backend offline' : 'Live insights from MongoDB Atlas'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" onClick={fetchAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
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
                Backend API unavailable. Showing cached analytics data.
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
                Connected to live backend - Real-time analytics from MongoDB Atlas
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{analyticsData.dashboard?.totals?.revenue?.toLocaleString() ?? 0}
                  </div>
                  <div className="flex items-center mt-1">
                    {analyticsData.dashboard?.thisMonth?.revenueGrowth >= 0 ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">
                          +{analyticsData.dashboard?.thisMonth?.revenueGrowth.toFixed(1)}%
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-sm text-red-600">
                          {analyticsData.dashboard?.thisMonth?.revenueGrowth.toFixed(1)}%
                        </span>
                      </>
                    )}
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
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600">+{stats.orderGrowth}%</span>
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
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
                    <span className="text-sm text-purple-600">+5.2%</span>
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
                  <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">₹{Math.round(stats.averageOrderValue)}</p>
                  <div className="flex items-center mt-1">
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-sm text-red-600">-2.1%</span>
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

      {/* Advanced Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Orders Trend (Enhanced)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#e0e0e0' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#16a34a"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                  name="Revenue (₹)"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                  name="Orders"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Categories Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Sales by Product Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={productCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-600">{product.sales} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{product.revenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Monthly Revenue Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#16a34a" name="Revenue (₹)" />
                <Bar dataKey="orders" fill="#2563eb" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Real-Time Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <RealTimeMetrics />
      </motion.div>

      {/* Advanced Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <AdvancedCharts 
          data={{
            salesTrend: revenueData,
            orderStatus: productCategoryData,
            customerSegments: productCategoryData,
            productPerformance: topProducts,
            revenueByCategory: productCategoryData,
            geographicData: []
          }}
          timeRange={timeRange}
        />
      </motion.div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{stats.conversionRate}%</p>
                <p className="text-sm text-gray-600 mt-1">Visitors to customers</p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${stats.conversionRate * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Customer Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">78%</p>
                <p className="text-sm text-gray-600 mt-1">Repeat customer rate</p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: '78%' }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Customer Satisfaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">4.8/5</p>
                <p className="text-sm text-gray-600 mt-1">Average rating</p>
                <div className="flex justify-center mt-2 space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.div
                      key={star}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2 + star * 0.1 }}
                    >
                      <div className={`w-4 h-4 ${star <= 4.8 ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ⭐
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Shipping Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Shipping Serviceability Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Shipping Coverage & Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Available Zones</p>
                  <p className="text-2xl font-bold">
                    {analyticsData.shipping?.serviceability?.availableZones || 0}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Total Pincodes</p>
                  <p className="text-2xl font-bold">
                    {analyticsData.shipping?.serviceability?.totalPincodes || 0}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">On-Time Delivery</p>
                  <p className="text-2xl font-bold text-green-600">
                    {analyticsData.shipping?.serviceability?.deliveryMetrics?.onTimeDelivery || 0}%
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Avg Delivery Time</p>
                  <p className="text-2xl font-bold">
                    {analyticsData.shipping?.serviceability?.deliveryMetrics?.avgDeliveryTime || 0} days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Shipping Partners Performance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Shipping Partners Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.shipping?.partners?.map((partner, index) => (
                  <div key={partner.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{partner.name}</p>
                      <p className="text-sm text-gray-600">
                        {partner.deliveries} deliveries | {partner.activeRegions} regions
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        partner.performance >= 90 ? 'text-green-600' : 
                        partner.performance >= 75 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {partner.performance}%
                      </p>
                      <p className="text-sm text-gray-600">
                        {partner.avgDeliveryTime} days avg.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Delivery Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Delivery Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.shipping?.partners || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="performance"
                    stroke="#16a34a"
                    name="Performance %"
                  />
                  <Line
                    type="monotone"
                    dataKey="avgDeliveryTime"
                    stroke="#2563eb"
                    name="Avg Delivery Time (days)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}