import { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { initializeMockData } from '../services/mockData';

export function useDataInitialization() {
  const { state, dispatch } = useApp();

  useEffect(() => {
    // Initialize with mock data on first load
    if (state.products.length === 0) {
      const mockData = initializeMockData();
      
      // Load products
      mockData.products.forEach(product => {
        dispatch({ type: 'ADD_PRODUCT', payload: product });
      });

      // Load users
      mockData.users.forEach(user => {
        dispatch({ type: 'ADD_USER', payload: user });
      });

      // Load orders
      mockData.orders.forEach(order => {
        dispatch({ type: 'ADD_ORDER', payload: order });
      });

      // Load payment gateways
      mockData.paymentGateways.forEach(gateway => {
        dispatch({ type: 'ADD_PAYMENT_GATEWAY', payload: gateway });
      });

      // Load shipping partners
      mockData.shippingPartners.forEach(partner => {
        dispatch({ type: 'ADD_SHIPPING_PARTNER', payload: partner });
      });

      // Users must login manually - no auto-login

      console.log('✅ Mock data initialized successfully');
    }
  }, [state.products.length, dispatch]);

  return {
    isInitialized: state.products.length > 0,
    loading: state.loading,
    error: state.error
  };
}