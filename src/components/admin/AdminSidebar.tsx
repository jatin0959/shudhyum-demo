import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  Truck,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Store
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface AdminSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'products', label: 'Products', icon: Package, badge: null },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: 'new' },
  { id: 'users', label: 'Users', icon: Users, badge: null },
  { id: 'payments', label: 'Payment Gateways', icon: CreditCard, badge: null },
  { id: 'shipping', label: 'Shipping Partners', icon: Truck, badge: null },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
  { id: 'settings', label: 'Settings', icon: Settings, badge: null },
];

export function AdminSidebar({ currentPage, onPageChange, collapsed, onToggleCollapsed }: AdminSidebarProps) {
  const { state } = useApp();

  const stats = {
    products: state.products?.length || 0,
    orders: state.orders?.length || 0,
    users: state.users?.filter(u => u.role === 'customer').length || 0,
    revenue: state.orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0
  };

  return (
    <motion.aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Store className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Shudhyum</h2>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              </motion.div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapsed}
              className="p-1"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 border-b border-gray-200"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-xs font-medium text-green-600">Products</p>
                <p className="text-lg font-bold text-green-900">{stats.products}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs font-medium text-blue-600">Orders</p>
                <p className="text-lg font-bold text-blue-900">{stats.orders}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-xs font-medium text-purple-600">Users</p>
                <p className="text-lg font-bold text-purple-900">{stats.users}</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-xs font-medium text-yellow-600">Revenue</p>
                <p className="text-sm font-bold text-yellow-900">₹{(stats.revenue / 1000).toFixed(1)}k</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Button
                  variant={currentPage === item.id ? "default" : "ghost"}
                  className={`w-full justify-start relative ${
                    collapsed ? 'px-2' : 'px-3'
                  } ${
                    currentPage === item.id 
                      ? 'bg-green-600 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => onPageChange(item.id)}
                >
                  <item.icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'}`} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                  
                  {/* Active indicator */}
                  {currentPage === item.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <p className="text-xs text-gray-500 mb-2">Admin Panel v1.0</p>
              <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-600">System Online</span>
              </div>
            </motion.div>
          )}
          
          {collapsed && (
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}