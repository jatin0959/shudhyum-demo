import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  CreditCard,
  DollarSign,
  Globe,
  Shield,
  Settings,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { apiService } from '../../services/apiService';
import { toast } from 'sonner'; // Changed from react-toastify to sonner

export function PaymentGateways() {
  const { state, dispatch } = useApp();
  const [showConfig, setShowConfig] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPaymentGateways();
  }, []);

  const fetchPaymentGateways = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPaymentGateways();
      
      if (response.success) {
        dispatch({ type: 'SET_PAYMENT_GATEWAYS', payload: response.data });
      } else {
        setError(response.error || 'Failed to fetch payment gateways');
      }
    } catch (err) {
      console.error('Error fetching payment gateways:', err);
      setError('Failed to load payment gateways');
    } finally {
      setLoading(false);
    }
  };

  const toggleGateway = async (gatewayId: string, isActive: boolean) => {
    try {
      const response = await apiService.updatePaymentGateway(gatewayId, { isActive });
      
      if (response.success) {
        dispatch({ type: 'UPDATE_PAYMENT_GATEWAY', payload: response.data });
      } else {
        toast.error(response.error || 'Failed to update gateway');
      }
    } catch (err) {
      console.error('Error updating payment gateway:', err);
      toast.error('Failed to update gateway status');
    }
  };

  const handleAddGateway = async (gatewayData: any) => {
    try {
      const response = await apiService.addPaymentGateway(gatewayData);
      
      if (response.success) {
        dispatch({ type: 'ADD_PAYMENT_GATEWAY', payload: response.data });
        toast.success('Payment gateway added successfully');
      } else {
        toast.error(response.error || 'Failed to add gateway');
      }
    } catch (err) {
      console.error('Error adding payment gateway:', err);
      toast.error('Failed to add payment gateway');
    }
  };

  const gateways = state.paymentGateways || [];

  const getGatewayIcon = (type: string) => {
    switch (type) {
      case 'razorpay': return '💳';
      case 'stripe': return '🌟';
      case 'paypal': return '🅿️';
      case 'payu': return '💰';
      case 'cashfree': return '💸';
      default: return '💳';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Loading payment gateways...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Gateways</h1>
          <p className="text-gray-600 mt-1">Configure and manage payment processing options</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Gateway
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Gateways</p>
                  <p className="text-2xl font-bold text-gray-900">{gateways.length}</p>
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
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{gateways.filter(g => g.isActive).length}</p>
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
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg. Fee</p>
                  <p className="text-2xl font-bold text-gray-900">2.4%</p>
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
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Globe className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Currencies</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Payment Gateways List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gateways.map((gateway, index) => (
          <motion.div
            key={gateway.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getGatewayIcon(gateway.type)}</div>
                    <div>
                      <CardTitle className="text-lg">{gateway.displayName}</CardTitle>
                      <p className="text-sm text-gray-600">{gateway.description}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(gateway.isActive)}>
                    {gateway.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Configuration Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Switch
                    checked={gateway.isActive}
                    onCheckedChange={(checked) => toggleGateway(gateway.id, checked)}
                  />
                </div>

                {/* Fee Information */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Processing Fee</span>
                  <span className="text-sm font-semibold">
                    {gateway.fees?.type === 'percentage' 
                      ? `${gateway.fees.value}%` 
                      : `₹${gateway.fees?.value}`
                    }
                  </span>
                </div>

                {/* Environment */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Environment</span>
                  <Badge variant={gateway.config?.environment === 'production' ? 'default' : 'secondary'}>
                    {gateway.config?.environment || 'Sandbox'}
                  </Badge>
                </div>

                {/* Supported Methods */}
                <div>
                  <span className="text-sm text-gray-600 block mb-2">Payment Methods</span>
                  <div className="flex flex-wrap gap-1">
                    {gateway.supportedMethods?.slice(0, 3).map((method, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {method.replace('_', ' ')}
                      </Badge>
                    ))}
                    {gateway.supportedMethods && gateway.supportedMethods.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{gateway.supportedMethods.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>

                {/* Configuration Preview */}
                {showConfig === gateway.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t pt-4 space-y-3"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">API Key</Label>
                      <div className="relative">
                        <Input
                          id="apiKey"
                          type="password"
                          value={gateway.config?.apiKey || ''}
                          placeholder="Enter API Key"
                          disabled
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        >
                          <EyeOff className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secretKey">Secret Key</Label>
                      <div className="relative">
                        <Input
                          id="secretKey"
                          type="password"
                          value={gateway.config?.secretKey || ''}
                          placeholder="Enter Secret Key"
                          disabled
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        >
                          <EyeOff className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Save Configuration
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowConfig(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Add New Gateway Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: gateways.length * 0.1 }}
        >
          <Card className="border-dashed border-2 border-gray-300 hover:border-green-400 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Add New Gateway</h3>
              <p className="text-sm text-gray-600 mb-4">
                Configure a new payment processing option
              </p>
              <Button variant="outline" size="sm">
                Setup Gateway
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {gateways.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No payment gateways configured</h3>
          <p className="text-gray-500 mb-6">Set up your first payment gateway to start accepting payments</p>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Gateway
          </Button>
        </div>
      )}
    </div>
  );
}