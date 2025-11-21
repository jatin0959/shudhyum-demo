import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Save,
  Crown,
  Shield
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { User as UserType } from '../../contexts/AppContext';
import { apiService } from '../../services/apiService';
import { toast } from 'sonner@2.0.3';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserType | null;
  mode: 'add' | 'edit' | 'view';
}

export function UserModal({ isOpen, onClose, user, mode }: UserModalProps) {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: '',
    role: 'customer' as 'customer' | 'admin',
    isActive: true,
    isEmailVerified: false,
    addresses: [],
    preferences: {
      dietaryRestrictions: [],
      favoriteGrains: [],
      orderFrequency: 'monthly',
      packagingPreference: 'eco-friendly',
      notifications: {
        email: true,
        sms: true,
        promotions: false
      }
    },
    loyaltyPoints: 0,
    totalOrders: 0,
    totalSpent: 0
  });

  useEffect(() => {
    if (user && (mode === 'edit' || mode === 'view')) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        role: user.role || 'customer',
        isActive: user.isActive || true,
        isEmailVerified: user.isEmailVerified || false,
        addresses: user.addresses || [],
        preferences: user.preferences || {
          dietaryRestrictions: [],
          favoriteGrains: [],
          orderFrequency: 'monthly',
          packagingPreference: 'eco-friendly',
          notifications: {
            email: true,
            sms: true,
            promotions: false
          }
        },
        loyaltyPoints: user.loyaltyPoints || 0,
        totalOrders: user.totalOrders || 0,
        totalSpent: user.totalSpent || 0
      });
    } else {
      // Reset form for add mode
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        avatar: '',
        role: 'customer',
        isActive: true,
        isEmailVerified: false,
        addresses: [],
        preferences: {
          dietaryRestrictions: [],
          favoriteGrains: [],
          orderFrequency: 'monthly',
          packagingPreference: 'eco-friendly',
          notifications: {
            email: true,
            sms: true,
            promotions: false
          }
        },
        loyaltyPoints: 0,
        totalOrders: 0,
        totalSpent: 0
      });
    }
  }, [user, mode, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      const userData: UserType = {
        id: user?.id || `user-${Date.now()}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        avatar: formData.avatar,
        role: formData.role,
        isActive: formData.isActive,
        isEmailVerified: formData.isEmailVerified,
        addresses: formData.addresses,
        preferences: formData.preferences,
        loyaltyPoints: formData.loyaltyPoints,
        totalOrders: formData.totalOrders,
        totalSpent: formData.totalSpent,
        createdAt: user?.createdAt || new Date().toISOString(),
        lastLogin: user?.lastLogin || new Date().toISOString()
      };

      if (mode === 'add') {
        try {
          const response = await apiService.register(userData);
          if (response.success && response.data) {
            dispatch({ type: 'ADD_USER', payload: response.data.user });
            toast.success('User created successfully!');
          } else {
            // Fallback to local creation
            dispatch({ type: 'ADD_USER', payload: userData });
            toast.success('User created successfully! (Local mode)');
          }
        } catch (error) {
          // Fallback to local creation
          dispatch({ type: 'ADD_USER', payload: userData });
          toast.success('User created successfully! (Local mode)');
        }
      } else if (mode === 'edit' && user) {
        try {
          const response = await apiService.updateUser(user.id, userData);
          if (response.success && response.data) {
            dispatch({ type: 'UPDATE_USER', payload: response.data });
            toast.success('User updated successfully!');
          } else {
            // Fallback to local update
            dispatch({ type: 'UPDATE_USER', payload: userData });
            toast.success('User updated successfully! (Local mode)');
          }
        } catch (error) {
          // Fallback to local update
          dispatch({ type: 'UPDATE_USER', payload: userData });
          toast.success('User updated successfully! (Local mode)');
        }
      }

      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const isReadOnly = mode === 'view';
  const title = mode === 'add' ? 'Add New User' : mode === 'edit' ? 'Edit User' : 'User Details';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-green-600" />
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' && "Add a new user to the system"}
            {mode === 'edit' && "Update user information"}
            {mode === 'view' && "View user details"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={formData.avatar} />
              <AvatarFallback>
                {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Label htmlFor="avatar">Profile Picture URL</Label>
              <Input
                id="avatar"
                value={formData.avatar}
                onChange={(e) => handleInputChange('avatar', e.target.value)}
                disabled={isReadOnly}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                disabled={isReadOnly}
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                disabled={isReadOnly}
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isReadOnly}
                  placeholder="user@example.com"
                  className="flex-1"
                />
                {formData.isEmailVerified && (
                  <Badge variant="secondary" className="text-green-600">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={isReadOnly}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {/* Role and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                disabled={isReadOnly}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
              {formData.role === 'admin' && (
                <Badge className="inline-flex items-center">
                  <Crown className="h-3 w-3 mr-1" />
                  Administrator
                </Badge>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                  disabled={isReadOnly}
                />
                <Label htmlFor="isActive">Active Account</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isEmailVerified"
                  checked={formData.isEmailVerified}
                  onCheckedChange={(checked) => handleInputChange('isEmailVerified', checked)}
                  disabled={isReadOnly}
                />
                <Label htmlFor="isEmailVerified">Email Verified</Label>
              </div>
            </div>
          </div>

          {/* Stats (Read-only for view/edit modes) */}
          {mode !== 'add' && (
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{formData.loyaltyPoints}</div>
                <div className="text-sm text-gray-600">Loyalty Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{formData.totalOrders}</div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">₹{formData.totalSpent.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
            </div>
          )}

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orderFrequency">Order Frequency</Label>
                <select
                  id="orderFrequency"
                  value={formData.preferences.orderFrequency}
                  onChange={(e) => handleNestedChange('preferences', 'orderFrequency', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="as-needed">As needed</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="packagingPreference">Packaging Preference</Label>
                <select
                  id="packagingPreference"
                  value={formData.preferences.packagingPreference}
                  onChange={(e) => handleNestedChange('preferences', 'packagingPreference', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="eco-friendly">Eco-friendly</option>
                  <option value="standard">Standard</option>
                  <option value="minimal">Minimal packaging</option>
                </select>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-4">
              <h4 className="font-medium">Notification Preferences</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="emailNotifications"
                    checked={formData.preferences.notifications.email}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          notifications: {
                            ...prev.preferences.notifications,
                            email: checked
                          }
                        }
                      }))
                    }
                    disabled={isReadOnly}
                  />
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="smsNotifications"
                    checked={formData.preferences.notifications.sms}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          notifications: {
                            ...prev.preferences.notifications,
                            sms: checked
                          }
                        }
                      }))
                    }
                    disabled={isReadOnly}
                  />
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="promotionalNotifications"
                    checked={formData.preferences.notifications.promotions}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          notifications: {
                            ...prev.preferences.notifications,
                            promotions: checked
                          }
                        }
                      }))
                    }
                    disabled={isReadOnly}
                  />
                  <Label htmlFor="promotionalNotifications">Promotional Notifications</Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {!isReadOnly && (
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              {mode === 'add' ? 'Add User' : 'Save Changes'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}