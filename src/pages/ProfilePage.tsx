import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Camera, 
  Shield, 
  Bell, 
  CreditCard,
  Save,
  Edit,
  CheckCircle,
  AlertCircle,
  Gift,
  Star
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useApp } from '../contexts/AppContext'; // Add this import

const profileData = {
  personal: {
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 98765 43210",
    dateOfBirth: "1990-05-15",
    gender: "female",
    avatar: "https://images.unsplash.com/photo-1758983308742-f4ba1f8c8cb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGFjY291bnQlMjBzZXR0aW5nc3xlbnwxfHx8fDE3NTk2OTEwOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  preferences: {
    dietaryRestrictions: ["gluten-free"],
    favoriteGrains: ["wheat", "ragi", "jowar"],
    orderFrequency: "monthly",
    packagingPreference: "eco-friendly"
  },
  notifications: {
    emailMarketing: true,
    smsNotifications: true,
    orderUpdates: true,
    promotions: false
  },
  privacy: {
    profileVisible: true,
    shareDataForRecommendations: true,
    allowAnalytics: true
  }
};

export function ProfilePage() {
  const { state } = useApp(); // Get the current user from global state
  const [formData, setFormData] = useState(profileData);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  const [isLoading, setIsLoading] = useState(true);

  // Initialize form data with logged-in user's details
  useEffect(() => {
    if (state.currentUser) {
      setFormData({
        personal: {
          firstName: state.currentUser.firstName,
          lastName: state.currentUser.lastName,
          email: state.currentUser.email,
          phone: state.currentUser.phone,
          dateOfBirth: state.currentUser.dateOfBirth || '',
          gender: state.currentUser.gender || '',
          avatar: state.currentUser.avatar || ''
        },
        preferences: {
          dietaryRestrictions: state.currentUser.preferences?.dietaryRestrictions || [],
          favoriteGrains: state.currentUser.preferences?.favoriteGrains || [],
          orderFrequency: state.currentUser.preferences?.orderFrequency || 'monthly',
          packagingPreference: state.currentUser.preferences?.packagingPreference || 'eco-friendly'
        },
        notifications: {
          emailMarketing: state.currentUser.preferences?.notifications?.email || false,
          smsNotifications: state.currentUser.preferences?.notifications?.sms || false,
          orderUpdates: true,
          promotions: state.currentUser.preferences?.notifications?.promotions || false
        },
        privacy: {
          profileVisible: true,
          shareDataForRecommendations: true,
          allowAnalytics: true
        }
      });
      setIsLoading(false);
    }
  }, [state.currentUser]);

  // Update handleSave to use the API
  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.updateUser(state.currentUser._id, {
        firstName: formData.personal.firstName,
        lastName: formData.personal.lastName,
        phone: formData.personal.phone,
        preferences: {
          dietaryRestrictions: formData.preferences.dietaryRestrictions,
          favoriteGrains: formData.preferences.favoriteGrains,
          orderFrequency: formData.preferences.orderFrequency,
          packagingPreference: formData.preferences.packagingPreference,
          notifications: {
            email: formData.notifications.emailMarketing,
            sms: formData.notifications.smsNotifications,
            promotions: formData.notifications.promotions
          }
        }
      });

      if (response.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }

  // Add authentication check
  if (!state.currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Please Log In</h2>
          <p className="text-gray-600">You need to be logged in to view this page.</p>
        </div>
      </div>
    );
  }

  // Update loyalty data with real user data
  const loyaltyData = {
    tier: "Silver",
    points: state.currentUser.loyaltyPoints || 0,
    nextTierPoints: 2000,
    benefits: [
      "5% discount on all orders",
      "Free delivery above ₹300",
      "Early access to new products",
      "Birthday special offers"
    ]
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

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const progressPercentage = (loyaltyData.points / loyaltyData.nextTierPoints) * 100;

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
            <motion.div className="relative" variants={itemVariants}>
              <Avatar className="w-24 h-24 border-4 border-white/20">
                <AvatarImage src={formData.personal.avatar} />
                <AvatarFallback className="text-2xl">
                  {formData.personal.firstName.charAt(0)}{formData.personal.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <motion.button
                className="absolute -bottom-2 -right-2 bg-white text-green-600 p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Camera className="h-4 w-4" />
              </motion.button>
            </motion.div>
            
            <motion.div className="text-center md:text-left flex-1" variants={itemVariants}>
              <h1 className="text-3xl font-bold mb-2">
                {formData.personal.firstName} {formData.personal.lastName}
              </h1>
              <p className="text-green-100 mb-4">{formData.personal.email}</p>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Badge className="bg-white/20 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  {loyaltyData.tier} Member
                </Badge>
                <Badge className="bg-white/20 text-white">
                  {loyaltyData.points} Points
                </Badge>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button 
                onClick={() => setIsEditing(!isEditing)}
                variant="secondary" 
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <Edit className="mr-2 h-4 w-4" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="grid lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Sidebar Navigation */}
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <nav className="space-y-2">
                  {[
                    { id: 'personal', label: 'Personal Info', icon: User },
                    { id: 'preferences', label: 'Preferences', icon: Shield },
                    { id: 'notifications', label: 'Notifications', icon: Bell },
                    { id: 'loyalty', label: 'Loyalty Program', icon: Gift }
                  ].map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === item.id
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </motion.button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div className="lg:col-span-3 space-y-6" variants={itemVariants}>
            {/* Personal Information */}
            {activeSection === 'personal' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Personal Information</span>
                    {isEditing && (
                      <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.personal.firstName}
                        onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.personal.lastName}
                        onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="email"
                        type="email"
                        value={formData.personal.email}
                        onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                        disabled={!isEditing}
                        className="flex-1"
                      />
                      <Badge variant="secondary" className="flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                        Verified
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="phone"
                        value={formData.personal.phone}
                        onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                        disabled={!isEditing}
                        className="flex-1"
                      />
                      <Badge variant="outline" className="flex items-center text-orange-600 border-orange-600">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Unverified
                      </Badge>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.personal.dateOfBirth}
                        onChange={(e) => handleInputChange('personal', 'dateOfBirth', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={formData.personal.gender}
                        onValueChange={(value) => handleInputChange('personal', 'gender', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Preferences */}
            {activeSection === 'preferences' && (
              <Card>
                <CardHeader>
                  <CardTitle>Food Preferences & Orders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Dietary Restrictions</Label>
                    <div className="flex flex-wrap gap-2">
                      {['gluten-free', 'organic-only', 'no-preservatives', 'low-sodium'].map((restriction) => (
                        <motion.button
                          key={restriction}
                          onClick={() => {
                            if (isEditing) {
                              const current = formData.preferences.dietaryRestrictions;
                              const updated = current.includes(restriction)
                                ? current.filter(r => r !== restriction)
                                : [...current, restriction];
                              handleInputChange('preferences', 'dietaryRestrictions', updated);
                            }
                          }}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            formData.preferences.dietaryRestrictions.includes(restriction)
                              ? 'bg-green-100 text-green-700 border border-green-300'
                              : 'bg-gray-100 text-gray-600 border border-gray-300'
                          } ${isEditing ? 'hover:scale-105' : 'cursor-default'}`}
                          disabled={!isEditing}
                          whileHover={isEditing ? { scale: 1.05 } : {}}
                          whileTap={isEditing ? { scale: 0.95 } : {}}
                        >
                          {restriction.replace('-', ' ')}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Favorite Grains</Label>
                    <div className="flex flex-wrap gap-2">
                      {['wheat', 'ragi', 'jowar', 'bajra', 'quinoa', 'oats'].map((grain) => (
                        <motion.button
                          key={grain}
                          onClick={() => {
                            if (isEditing) {
                              const current = formData.preferences.favoriteGrains;
                              const updated = current.includes(grain)
                                ? current.filter(g => g !== grain)
                                : [...current, grain];
                              handleInputChange('preferences', 'favoriteGrains', updated);
                            }
                          }}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            formData.preferences.favoriteGrains.includes(grain)
                              ? 'bg-green-100 text-green-700 border border-green-300'
                              : 'bg-gray-100 text-gray-600 border border-gray-300'
                          } ${isEditing ? 'hover:scale-105' : 'cursor-default'}`}
                          disabled={!isEditing}
                          whileHover={isEditing ? { scale: 1.05 } : {}}
                          whileTap={isEditing ? { scale: 0.95 } : {}}
                        >
                          {grain}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Order Frequency</Label>
                      <Select
                        value={formData.preferences.orderFrequency}
                        onValueChange={(value) => handleInputChange('preferences', 'orderFrequency', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="as-needed">As needed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Packaging Preference</Label>
                      <Select
                        value={formData.preferences.packagingPreference}
                        onValueChange={(value) => handleInputChange('preferences', 'packagingPreference', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eco-friendly">Eco-friendly</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="minimal">Minimal packaging</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {isEditing && (
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                      <Save className="mr-2 h-4 w-4" />
                      Save Preferences
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Notifications */}
            {activeSection === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries(formData.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {key === 'emailMarketing' && 'Receive promotional emails and newsletters'}
                          {key === 'smsNotifications' && 'Get SMS updates for orders and offers'}
                          {key === 'orderUpdates' && 'Notifications about order status changes'}
                          {key === 'promotions' && 'Special offers and discount notifications'}
                        </p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => handleInputChange('notifications', key, checked)}
                        disabled={!isEditing}
                      />
                    </div>
                  ))}

                  {isEditing && (
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                      <Save className="mr-2 h-4 w-4" />
                      Save Notification Settings
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Loyalty Program */}
            {activeSection === 'loyalty' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gift className="h-5 w-5 text-green-600" />
                    <span>Loyalty Program</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-green-900">{loyaltyData.tier} Member</h3>
                        <p className="text-green-700">{loyaltyData.points} points earned</p>
                      </div>
                      <Badge className="bg-green-600 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        {loyaltyData.tier}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress to Gold</span>
                        <span>{loyaltyData.nextTierPoints - loyaltyData.points} points to go</span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <motion.div 
                          className="bg-green-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Your Benefits</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {loyaltyData.benefits.map((benefit, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Recent Points Activity</h4>
                    <div className="space-y-3">
                      {[
                        { action: "Order #ORD-2024-001", points: 45, date: "2 days ago", type: "earned" },
                        { action: "Referral bonus", points: 100, date: "1 week ago", type: "earned" },
                        { action: "Birthday bonus", points: 50, date: "2 weeks ago", type: "earned" }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-gray-600">{activity.date}</p>
                          </div>
                          <div className={`font-semibold ${activity.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                            {activity.type === 'earned' ? '+' : '-'}{activity.points} pts
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}