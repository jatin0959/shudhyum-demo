import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Truck,
  MapPin,
  Clock,
  DollarSign,
  Package,
  Settings,
  CheckCircle,
  Globe,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { apiService } from '../../services/apiService';
import { toast } from 'react-hot-toast';

export function ShippingPartners() {
  const { state, dispatch } = useApp();
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [serviceability, setServiceability] = useState<ShippingServiceability | null>(null);
  const [partners, setPartners] = useState<ShippingPartner[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Real-time data fetching
  useEffect(() => {
    async function fetchShippingData() {
      try {
        setLoading(true);
        setError(null);

        const [serviceabilityRes, partnersRes] = await Promise.all([
          apiService.checkServiceability(),
          apiService.getShippingPartners()
        ]);

        // Set serviceability data with fallback
        if (serviceabilityRes.success) {
          setServiceability(serviceabilityRes.data);
        } else {
          console.warn('Using fallback serviceability data');
          setServiceability(null);
        }

        // Set partners data with fallback
        if (partnersRes.success) {
          setPartners(partnersRes.data);
        } else {
          console.warn('Using fallback partners data');
          setPartners([]);
        }

      } catch (error) {
        console.error('Error fetching shipping data:', error);
        setError('Failed to load shipping data');
        toast.error('Failed to load shipping data');
      } finally {
        setLoading(false);
      }
    }

    // Initial fetch
    fetchShippingData();

    // Set up polling for real-time updates
    const pollingInterval = setInterval(fetchShippingData, 30000);

    return () => clearInterval(pollingInterval);
  }, []);

  const togglePartner = (partnerId: string, isActive: boolean) => {
    const partner = partners.find(p => p.id === partnerId);
    if (partner) {
      const updated = { ...partner, isActive };
      dispatch({ type: 'UPDATE_SHIPPING_PARTNER', payload: updated });
    }
  };

  const getPartnerIcon = (type: string) => {
    switch (type) {
      case 'bluedart': return '🔵';
      case 'delhivery': return '🚀';
      case 'dtdc': return '📦';
      case 'fedex': return '🟣';
      case 'indiapost': return '📮';
      case 'ecom': return '🛒';
      default: return '🚚';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  };

  const getReliabilityColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const calculateAverageDeliveryTime = (partners: ShippingPartner[]): string => {
    if (!partners.length) return '0d';
    const avg = partners.reduce((sum, p) => sum + (p.averageDeliveryTime || 0), 0) / partners.length;
    return `${avg.toFixed(1)}d`;
  };

  const calculateCoveragePercentage = (serviceability: ShippingServiceability | null): number => {
    return serviceability?.coverage?.national || 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shipping Partners</h1>
          <p className="text-gray-600 mt-1">Manage logistics providers and delivery services</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Partner
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Partners Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Partners</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? (
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    ) : (
                      partners.length || 0
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {loading ? 'Loading...' : partners.length > 0 ? 'Integrated carriers' : 'No partners yet'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Partners Card */}
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
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? (
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    ) : (
                      partners.filter(p => p.isActive).length || 0
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {loading ? 'Loading...' : 
                      `${((partners.filter(p => p.isActive).length / partners.length) * 100).toFixed(0)}% of total`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Average Delivery Time Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg. Delivery</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? (
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    ) : (
                      serviceability?.deliveryMetrics?.avgDeliveryTime 
                        ? `${serviceability.deliveryMetrics.avgDeliveryTime}d`
                        : calculateAverageDeliveryTime(partners)
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {loading ? 'Loading...' : 
                      `${serviceability?.deliveryMetrics?.onTimeDelivery || 95}% on time`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Coverage Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Coverage</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? (
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    ) : (
                      `${calculateCoveragePercentage(serviceability)}%`
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {loading ? 'Loading...' : 
                      `${serviceability?.totalPincodes?.toLocaleString() || '15,000'}+ pincodes`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Shipping Partners List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner, index) => (
          <motion.div
            key={partner.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getPartnerIcon(partner.type)}</div>
                    <div>
                      <CardTitle className="text-lg">{partner.displayName}</CardTitle>
                      <p className="text-sm text-gray-600">{partner.description}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(partner.isActive)}>
                    {partner.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Status Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Switch
                    checked={partner.isActive}
                    onCheckedChange={(checked) => togglePartner(partner.id, checked)}
                  />
                </div>

                {/* Service Types */}
                <div>
                  <span className="text-sm text-gray-600 block mb-2">Services</span>
                  <div className="flex flex-wrap gap-1">
                    {partner.serviceTypes?.slice(0, 3).map((service, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {service.name || service}
                      </Badge>
                    ))}
                    {partner.serviceTypes && partner.serviceTypes.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{partner.serviceTypes.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Coverage Zones */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Coverage Zones</span>
                  <span className="text-sm font-semibold">
                    {partner.zones?.length || 9} zones
                  </span>
                </div>

                {/* Delivery Time */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg. Delivery</span>
                  <span className="text-sm font-semibold">
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      partner.averageDeliveryTime > 0
                        ? `${partner.averageDeliveryTime} days`
                        : '2-3 days'
                    )}
                  </span>
                </div>

                {/* Reliability Score */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Reliability</span>
                  <span className={`text-sm font-semibold ${getReliabilityColor(partner.reliabilityScore || 0)}`}>
                    {partner.reliabilityScore ? `${partner.reliabilityScore}%` : 'N/A'}
                  </span>
                </div>

                {/* Cost Effectiveness */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cost Rating</span>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <DollarSign 
                        key={i} 
                        className={`h-3 w-3 ${
                          i < Math.floor((partner.costEffectiveness || 0) / 20) 
                            ? 'text-green-500' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <span className="text-sm text-gray-600 block mb-2">Features</span>
                  <div className="flex flex-wrap gap-1">
                    {partner.features?.slice(0, 2).map((feature, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {partner.features && partner.features.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{partner.features.length - 2}
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

                {/* Zone Details */}
                {selectedPartner === partner.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t pt-4 space-y-3"
                  >
                    <h4 className="font-medium text-sm">Coverage Zones</h4>
                    {partner.zones?.map((zone, i) => (
                      <div key={i} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{zone.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {zone.pincodes?.length || 0} pincodes
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          {zone.rates?.slice(0, 3).map((rate, j) => (
                            <div key={j} className="text-center">
                              <div className="font-medium">{rate.weight}</div>
                              <div className="text-gray-600">₹{rate.price}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Add New Partner Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: partners.length * 0.1 }}
        >
          <Card className="border-dashed border-2 border-gray-300 hover:border-green-400 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Add New Partner</h3>
              <p className="text-sm text-gray-600 mb-4">
                Configure a new shipping and logistics provider
              </p>
              <Button variant="outline" size="sm">
                Setup Partner
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {partners.length === 0 && (
        <div className="text-center py-12">
          <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No shipping partners configured</h3>
          <p className="text-gray-500 mb-6">Set up your first shipping partner to start delivering orders</p>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Partner
          </Button>
        </div>
      )}

      {/* Loading and Error States */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}