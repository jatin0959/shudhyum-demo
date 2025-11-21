import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { 
  Search, 
  Bell, 
  Menu, 
  Settings, 
  LogOut,
  User,
  Home
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface AdminHeaderProps {
  currentPage: string;
  onToggleSidebar: () => void;
}

export function AdminHeader({ currentPage, onToggleSidebar }: AdminHeaderProps) {
  const { state, dispatch } = useApp();

  const getPageTitle = (page: string) => {
    switch (page) {
      case 'dashboard': return 'Dashboard';
      case 'products': return 'Products Management';
      case 'orders': return 'Orders Management';
      case 'users': return 'Users Management';
      case 'payments': return 'Payment Gateways';
      case 'shipping': return 'Shipping Partners';
      case 'analytics': return 'Analytics';
      case 'settings': return 'Settings';
      default: return 'Admin Panel';
    }
  };

  const handleBackToSite = () => {
    dispatch({ type: 'SET_ADMIN_MODE', payload: false });
    window.location.hash = '#home';
  };

  const handleLogout = () => {
    dispatch({ type: 'SET_ADMIN_MODE', payload: false });
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
    window.location.hash = '#home';
  };

  return (
    <motion.header 
      className="bg-white border-b border-gray-200 px-6 py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {getPageTitle(currentPage)}
            </h1>
            <p className="text-sm text-gray-500">
              Welcome to Shudhyum Admin Panel
            </p>
          </div>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products, orders, customers..."
              className="pl-10 bg-gray-50 border-0"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
              >
                3
              </Badge>
            </Button>
          </motion.div>

          {/* Back to Site */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="outline" size="sm" onClick={handleBackToSite}>
              <Home className="h-4 w-4 mr-2" />
              Back to Site
            </Button>
          </motion.div>

          {/* User Menu */}
          <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {state.currentUser?.firstName || 'Admin'} {state.currentUser?.lastName || 'User'}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>

            <Avatar className="h-8 w-8">
              <AvatarImage src={state.currentUser?.avatar} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>

            {/* Settings */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </motion.div>

            {/* Logout */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}