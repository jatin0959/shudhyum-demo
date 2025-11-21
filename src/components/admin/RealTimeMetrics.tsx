import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Activity,
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  MapPin,
  Package,
  AlertCircle
} from 'lucide-react';

interface RealTimeEvent {
  id: string;
  type: 'sale' | 'signup' | 'order' | 'inventory';
  message: string;
  amount?: number;
  location?: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
}

interface LiveMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

export function RealTimeMetrics() {
  const [events, setEvents] = useState<RealTimeEvent[]>([]);
  const [metrics, setMetrics] = useState<LiveMetric[]>([
    {
      label: 'Revenue Today',
      value: 12450,
      change: 8.5,
      trend: 'up',
      icon: <DollarSign className="h-4 w-4" />,
      color: 'text-green-600'
    },
    {
      label: 'Orders Today',
      value: 23,
      change: 12.3,
      trend: 'up',
      icon: <ShoppingCart className="h-4 w-4" />,
      color: 'text-blue-600'
    },
    {
      label: 'Active Users',
      value: 157,
      change: -2.1,
      trend: 'down',
      icon: <Users className="h-4 w-4" />,
      color: 'text-purple-600'
    },
    {
      label: 'Low Stock Items',
      value: 5,
      change: 0,
      trend: 'neutral',
      icon: <Package className="h-4 w-4" />,
      color: 'text-orange-600'
    }
  ]);

  // Simulate real-time events
  useEffect(() => {
    const interval = setInterval(() => {
      const eventTypes = ['sale', 'signup', 'order', 'inventory'] as const;
      const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Kolkata'];
      const products = ['Premium Wheat Atta', 'Multi-Grain Atta', 'Jowar Atta', 'Ragi Atta'];
      
      const randomEvent: RealTimeEvent = {
        id: Date.now().toString(),
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        message: '',
        timestamp: new Date(),
        priority: 'medium'
      };

      switch (randomEvent.type) {
        case 'sale':
          randomEvent.amount = Math.floor(Math.random() * 500) + 100;
          randomEvent.location = locations[Math.floor(Math.random() * locations.length)];
          randomEvent.message = `New sale of ₹${randomEvent.amount} from ${randomEvent.location}`;
          randomEvent.priority = randomEvent.amount > 300 ? 'high' : 'medium';
          break;
        case 'signup':
          randomEvent.location = locations[Math.floor(Math.random() * locations.length)];
          randomEvent.message = `New customer signup from ${randomEvent.location}`;
          break;
        case 'order':
          randomEvent.location = locations[Math.floor(Math.random() * locations.length)];
          const product = products[Math.floor(Math.random() * products.length)];
          randomEvent.message = `New order for ${product} from ${randomEvent.location}`;
          break;
        case 'inventory':
          const lowStockProduct = products[Math.floor(Math.random() * products.length)];
          randomEvent.message = `Low stock alert: ${lowStockProduct}`;
          randomEvent.priority = 'high';
          break;
      }

      setEvents(prev => [randomEvent, ...prev.slice(0, 9)]); // Keep only last 10 events

      // Update metrics occasionally
      if (Math.random() < 0.3) {
        setMetrics(prev => prev.map(metric => ({
          ...metric,
          value: metric.value + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5),
          change: (Math.random() - 0.5) * 20
        })));
      }
    }, 5000); // New event every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'signup':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'order':
        return <ShoppingCart className="h-4 w-4 text-purple-600" />;
      case 'inventory':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEventColor = (type: string, priority: string) => {
    if (priority === 'high') return 'bg-red-50 border-red-200';
    switch (type) {
      case 'sale':
        return 'bg-green-50 border-green-200';
      case 'signup':
        return 'bg-blue-50 border-blue-200';
      case 'order':
        return 'bg-purple-50 border-purple-200';
      case 'inventory':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                    <motion.p 
                      className="text-2xl font-bold text-gray-900"
                      key={metric.value}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {metric.label.includes('Revenue') ? '₹' : ''}{metric.value.toLocaleString()}
                    </motion.p>
                    <div className="flex items-center mt-1">
                      {metric.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      ) : metric.trend === 'down' ? (
                        <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                      ) : null}
                      <span className={`text-xs ${
                        metric.trend === 'up' ? 'text-green-600' :
                        metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-full bg-opacity-20 ${metric.color}`}>
                    {metric.icon}
                  </div>
                </div>
                {/* Subtle pulse animation for active metrics */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                  animate={{
                    opacity: [0, 0.1, 0],
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Real-Time Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-green-600" />
            <span>Live Activity Feed</span>
            <Badge variant="outline" className="ml-auto">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`p-3 rounded-lg border ${getEventColor(event.type, event.priority)} 
                    hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {event.message}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {event.timestamp.toLocaleTimeString()}
                        </span>
                        {event.location && (
                          <>
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{event.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {event.priority === 'high' && (
                      <Badge variant="destructive" className="text-xs">
                        High
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {events.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Waiting for live events...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RealTimeMetrics;