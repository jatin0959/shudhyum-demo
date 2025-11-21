import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Settings, 
  Globe, 
  Mail, 
  Shield, 
  Percent,
  Truck,
  Save,
  Upload
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function SettingsManagement() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(state.settings || {});

  const updateSetting = (section: string, key: string, value: any) => {
    const newSettings = {
      ...settings,
      [section]: {
        ...settings[section as keyof typeof settings],
        [key]: value
      }
    };
    setSettings(newSettings);
  };

  const handleSave = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    // In production, this would call the API
    console.log('Settings saved:', settings);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Configure your application settings</p>
        </div>
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="tax" className="flex items-center space-x-2">
            <Percent className="h-4 w-4" />
            <span>Tax</span>
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center space-x-2">
            <Truck className="h-4 w-4" />
            <span>Shipping</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Advanced</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.site?.name || ''}
                    onChange={(e) => updateSetting('site', 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    value={settings.site?.currency || 'INR'}
                    onChange={(e) => updateSetting('site', 'currency', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Site Description</Label>
                <Textarea
                  id="description"
                  value={settings.site?.description || ''}
                  onChange={(e) => updateSetting('site', 'description', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">SEO Keywords (comma separated)</Label>
                <Input
                  id="keywords"
                  value={settings.site?.keywords?.join(', ') || ''}
                  onChange={(e) => updateSetting('site', 'keywords', e.target.value.split(', '))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <Input
                    id="businessPhone"
                    value={settings.business?.phone || ''}
                    onChange={(e) => updateSetting('business', 'phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={settings.business?.email || ''}
                    onChange={(e) => updateSetting('business', 'email', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Textarea
                  id="businessAddress"
                  value={settings.business?.address || ''}
                  onChange={(e) => updateSetting('business', 'address', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gst">GST Number</Label>
                  <Input
                    id="gst"
                    value={settings.business?.gst || ''}
                    onChange={(e) => updateSetting('business', 'gst', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pan">PAN Number</Label>
                  <Input
                    id="pan"
                    value={settings.business?.pan || ''}
                    onChange={(e) => updateSetting('business', 'pan', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.email?.smtp?.host || ''}
                    onChange={(e) => updateSetting('email', 'smtp', { ...settings.email?.smtp, host: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={settings.email?.smtp?.port || ''}
                    onChange={(e) => updateSetting('email', 'smtp', { ...settings.email?.smtp, port: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">Username</Label>
                  <Input
                    id="smtpUsername"
                    value={settings.email?.smtp?.username || ''}
                    onChange={(e) => updateSetting('email', 'smtp', { ...settings.email?.smtp, username: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.email?.smtp?.password || ''}
                    onChange={(e) => updateSetting('email', 'smtp', { ...settings.email?.smtp, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="smtpSecure"
                  checked={settings.email?.smtp?.secure || false}
                  onCheckedChange={(checked) => updateSetting('email', 'smtp', { ...settings.email?.smtp, secure: checked })}
                />
                <Label htmlFor="smtpSecure">Use SSL/TLS</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Settings */}
        <TabsContent value="tax" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tax Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gstRate">GST Rate (%)</Label>
                  <Input
                    id="gstRate"
                    type="number"
                    step="0.01"
                    value={settings.tax?.gst || ''}
                    onChange={(e) => updateSetting('tax', 'gst', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cgstRate">CGST Rate (%)</Label>
                  <Input
                    id="cgstRate"
                    type="number"
                    step="0.01"
                    value={settings.tax?.cgst || ''}
                    onChange={(e) => updateSetting('tax', 'cgst', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sgstRate">SGST Rate (%)</Label>
                  <Input
                    id="sgstRate"
                    type="number"
                    step="0.01"
                    value={settings.tax?.sgst || ''}
                    onChange={(e) => updateSetting('tax', 'sgst', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="igstRate">IGST Rate (%)</Label>
                  <Input
                    id="igstRate"
                    type="number"
                    step="0.01"
                    value={settings.tax?.igst || ''}
                    onChange={(e) => updateSetting('tax', 'igst', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (₹)</Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    value={settings.shipping?.freeShippingThreshold || ''}
                    onChange={(e) => updateSetting('shipping', 'freeShippingThreshold', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultShippingCost">Default Shipping Cost (₹)</Label>
                  <Input
                    id="defaultShippingCost"
                    type="number"
                    value={settings.shipping?.defaultShippingCost || ''}
                    onChange={(e) => updateSetting('shipping', 'defaultShippingCost', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Password Requirements</h4>
                    <p className="text-sm text-gray-600">Enforce strong password policy</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Login Rate Limiting</h4>
                    <p className="text-sm text-gray-600">Limit failed login attempts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Maintenance Mode</h4>
                    <p className="text-sm text-gray-600">Put site in maintenance mode</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Debug Mode</h4>
                    <p className="text-sm text-gray-600">Enable debug logging</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Cache Enabled</h4>
                    <p className="text-sm text-gray-600">Enable application caching</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                    Clear All Cache
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}