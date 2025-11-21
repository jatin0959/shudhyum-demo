import React, { useState } from 'react';
import { ShoppingCart, Menu, Search, User, LogOut, Package, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { LoginModal } from './auth/LoginModal';
import { useApp } from '../contexts/AppContext';
import shudhyumLogo from '../assets/logo.svg';

export function Header() {
  const { state, dispatch } = useApp();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const currentUser = state.currentUser;
  const cartItemCount = state.cart?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleLogout = () => {
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
    setUserMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Compact height header */}
        <div className="flex items-center justify-between h-20">
          
          {/* Logo - visually large but doesn’t expand header height */}
          <div className="flex items-center relative">
            <div className="-my-8">
              <ImageWithFallback
                src={shudhyumLogo}
                alt="Shudhyum"
                className="h-32 w-auto select-none pointer-events-none"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {['Home', 'Products', 'About', 'Reviews', 'FAQ', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Search className="h-4 w-4" />
            </Button>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback>
                      {currentUser.firstName?.charAt(0)}
                      {currentUser.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-900">
                      {currentUser.firstName}
                    </span>
                    <span className="text-xs text-green-600">
                      {currentUser.loyaltyPoints} points
                    </span>
                  </div>
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {currentUser.firstName} {currentUser.lastName}
                      </p>
                      <p className="text-xs text-gray-600">{currentUser.email}</p>
                    </div>
                    <a href="#profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User className="h-4 w-4 mr-2" /> My Profile
                    </a>
                    <a href="#orders" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Package className="h-4 w-4 mr-2" /> My Orders
                    </a>
                    <a href="#wishlist" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Heart className="h-4 w-4 mr-2" /> Wishlist
                    </a>
                    <div className="border-t border-gray-100 mt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setLoginModalOpen(true)}>
                <User className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Sign In</span>
              </Button>
            )}

            {/* Cart */}
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-4 w-4" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-green-600">
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </header>
  );
}
