import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { apiService } from '../services/apiService';
import { dbConfig } from '../config/database';

export function useProductionInitialization() {
  const { dispatch } = useApp();
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeProductionData();
  }, []);

  const initializeProductionData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🚀 Initializing Shudhyum Production System...');

      // Step 1: Enable system mode for data seeding only
      apiService.enableSystemMode();

      // Step 2: Connect to database
      console.log('📡 Connecting to MongoDB Atlas...');
      const dbConnected = await dbConfig.connect();
      
      if (!dbConnected) {
        console.log('📱 Operating in offline mode with localStorage');
        console.log('💡 All features available - data persists locally');
        setError(null); // Don't treat this as an error, it's a valid fallback
      } else {
        console.log('☁️  Connected to MongoDB Atlas successfully');
        console.log('🌐 Operating in online mode');
      }

      // Step 3: Check if data exists, if not seed initial data
      console.log('📊 Loading application data...');
      
      const productsResponse = await apiService.getProducts(1, 5);
      
      if (!productsResponse.success || (productsResponse.data && productsResponse.data.length === 0)) {
        console.log('📥 No existing data found, seeding initial data...');
        await seedInitialData();
      }

      // Step 4: Check for existing authentication token (no auto-login)
      const existingToken = localStorage.getItem('shudhyum_auth_token');
      if (existingToken) {
        console.log('🔐 Found existing authentication token');
        // Token validation would happen here in production
      } else {
        console.log('🔓 No existing authentication - ready for manual login');
      }

      // Step 5: Load all essential data into context
      console.log('🔄 Loading data into application context...');
      
      // Load products
      const allProductsResponse = await apiService.getProducts(1, 100);
      if (allProductsResponse.success && allProductsResponse.data) {
        allProductsResponse.data.forEach(product => {
          dispatch({ type: 'ADD_PRODUCT', payload: product });
        });
        console.log(`✅ Loaded ${allProductsResponse.data.length} products`);
      }

      // Load users
      try {
        const usersResponse = await apiService.getUsers(1, 100);
        if (usersResponse.success && usersResponse.data) {
          usersResponse.data.forEach(user => {
            dispatch({ type: 'ADD_USER', payload: user });
          });
          console.log(`✅ Loaded ${usersResponse.data.length} users`);
        }
      } catch (err) {
        console.log('ℹ️  User data loading skipped');
      }

      // Load orders
      try {
        const ordersResponse = await apiService.getOrders(1, 100);
        if (ordersResponse.success && ordersResponse.data) {
          ordersResponse.data.forEach(order => {
            dispatch({ type: 'ADD_ORDER', payload: order });
          });
          console.log(`✅ Loaded ${ordersResponse.data.length} orders`);
        }
      } catch (err) {
        console.log('ℹ️  Order data loading skipped');
      }

      // Step 6: Initialize analytics
      try {
        const analyticsResponse = await apiService.getAnalytics();
        if (analyticsResponse.success) {
          console.log('📈 Analytics system initialized');
        }
      } catch (err) {
        console.log('ℹ️  Analytics initialization skipped');
      }

      // Step 7: Validate existing authentication if present
      if (existingToken) {
        console.log('🔐 Validating existing authentication token');
        // Additional token validation logic would go here in production
      }

      // Step 8: Disable system mode after initialization
      apiService.disableSystemMode();

      // Step 7: Disable system mode and return to normal operation
      apiService.disableSystemMode();
      
      console.log('🎉 Production system initialization complete!');
      console.log('🔓 System ready for user authentication');
      setIsInitialized(true);

    } catch (err) {
      console.error('❌ Production initialization failed:', err);
      setError(err instanceof Error ? err.message : 'System initialization failed');
      
      // Load fallback data even on error
      console.log('🔄 Loading fallback data...');
      await seedInitialData();
      
      // Load fallback data into context
      const fallbackResponse = await apiService.getProducts(1, 100);
      if (fallbackResponse.success && fallbackResponse.data) {
        fallbackResponse.data.forEach(product => {
          dispatch({ type: 'ADD_PRODUCT', payload: product });
        });
      }
      
      setIsInitialized(true);
    } finally {
      setLoading(false);
    }
  };

  const getConnectionStatus = () => {
    return {
      database: dbConfig.isConnected(),
      initialized: isInitialized,
      error: error,
      connectionInfo: dbConfig.getConnectionInfo()
    };
  };

  const refreshData = async () => {
    await initializeProductionData();
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isInitialized,
    loading,
    error,
    refreshData,
    clearError,
    getConnectionStatus
  };
}

// Seed initial data function
async function seedInitialData() {
  console.log('🌱 Seeding initial data...');
  
  // Create sample products
  const sampleProducts = [
    {
      name: 'Premium Whole Wheat Atta',
      description: 'Premium quality whole wheat flour, freshly ground from selected wheat grains',
      longDescription: 'Our premium whole wheat atta is made from carefully selected wheat grains sourced directly from organic farms. Ground fresh using traditional stone mills to preserve maximum nutrition and authentic taste.',
      price: 45,
      originalPrice: 55,
      weight: '1 KG',
      category: 'wheat',
      subCategory: 'whole-wheat',
      images: ['https://images.unsplash.com/photo-1627744515559-a15ff44a8a50?w=500&h=500&fit=crop'],
      inStock: true,
      stockCount: 47,
      rating: 4.8,
      reviewCount: 324,
      badge: 'Best Seller',
      nutritionFacts: [
        { nutrient: 'Protein', value: '12.5g', percentage: 25 },
        { nutrient: 'Fiber', value: '11.2g', percentage: 45 },
        { nutrient: 'Iron', value: '4.2mg', percentage: 23 },
        { nutrient: 'Vitamin B6', value: '0.3mg', percentage: 18 }
      ],
      features: [
        { title: '100% Organic', description: 'Certified organic wheat from trusted farms', icon: 'leaf' },
        { title: 'Stone Ground', description: 'Traditional stone milling preserves nutrients', icon: 'grain' },
        { title: 'Fresh Daily', description: 'Ground to order for maximum freshness', icon: 'clock' },
        { title: 'Premium Quality', description: 'Hand-selected grains for superior taste', icon: 'star' }
      ],
      tags: ['organic', 'whole-wheat', 'healthy', 'stone-ground'],
      isActive: true,
      sku: 'WW-ATT-001',
      isOrganic: true,
      isGlutenFree: false,
      shelfLife: 180,
      origin: 'Punjab, India',
      manufacturer: 'Shudhyum Foods'
    },
    {
      name: 'Multi-Grain Atta',
      description: 'Nutritious blend of wheat, oats, barley, and millet for enhanced nutrition',
      longDescription: 'Our multi-grain atta combines the goodness of multiple grains to provide complete nutrition. Perfect for health-conscious families who want variety and nutrition in their daily meals.',
      price: 65,
      originalPrice: 75,
      weight: '1 KG',
      category: 'multigrain',
      subCategory: 'mixed-grains',
      images: ['https://images.unsplash.com/photo-1623066798929-946425dbe1b0?w=500&h=500&fit=crop'],
      inStock: true,
      stockCount: 32,
      rating: 4.9,
      reviewCount: 186,
      badge: 'Nutritious',
      nutritionFacts: [
        { nutrient: 'Protein', value: '15.2g', percentage: 30 },
        { nutrient: 'Fiber', value: '13.8g', percentage: 55 },
        { nutrient: 'Iron', value: '5.1mg', percentage: 28 },
        { nutrient: 'Magnesium', value: '89mg', percentage: 22 }
      ],
      features: [
        { title: 'Multi-Grain Power', description: 'Wheat, oats, barley, and millet blend', icon: 'grain' },
        { title: 'High Protein', description: '15g protein per 100g serving', icon: 'heart' },
        { title: 'Rich in Fiber', description: 'Supports digestive health', icon: 'leaf' },
        { title: 'Balanced Nutrition', description: 'Complete amino acid profile', icon: 'star' }
      ],
      tags: ['multigrain', 'protein-rich', 'healthy', 'nutritious'],
      isActive: true,
      sku: 'MG-ATT-001',
      isOrganic: true,
      isGlutenFree: false,
      shelfLife: 150,
      origin: 'Maharashtra, India',
      manufacturer: 'Shudhyum Foods'
    },
    {
      name: 'Jowar Atta (Sorghum)',
      description: 'Pure sorghum flour, gluten-free and rich in fiber and protein',
      longDescription: 'Jowar atta is a gluten-free alternative that\'s perfect for those with gluten sensitivity. Rich in antioxidants and minerals, it\'s a healthy choice for modern lifestyles.',
      price: 55,
      originalPrice: 65,
      weight: '1 KG',
      category: 'millet',
      subCategory: 'sorghum',
      images: ['https://images.unsplash.com/photo-1661174282476-43db0a70d7fe?w=500&h=500&fit=crop'],
      inStock: true,
      stockCount: 28,
      rating: 4.7,
      reviewCount: 142,
      badge: 'Gluten Free',
      nutritionFacts: [
        { nutrient: 'Protein', value: '11.3g', percentage: 23 },
        { nutrient: 'Fiber', value: '6.7g', percentage: 27 },
        { nutrient: 'Iron', value: '4.4mg', percentage: 24 },
        { nutrient: 'Calcium', value: '28mg', percentage: 3 }
      ],
      features: [
        { title: 'Gluten Free', description: 'Safe for celiac and gluten-sensitive individuals', icon: 'shield' },
        { title: 'Rich in Antioxidants', description: 'Natural antioxidants for health', icon: 'heart' },
        { title: 'Low Glycemic Index', description: 'Better blood sugar control', icon: 'check' },
        { title: 'Traditional Grain', description: 'Ancient superfood for modern health', icon: 'mountain' }
      ],
      tags: ['gluten-free', 'millet', 'healthy', 'antioxidant-rich'],
      isActive: true,
      sku: 'JW-ATT-001',
      isOrganic: true,
      isGlutenFree: true,
      shelfLife: 120,
      origin: 'Karnataka, India',
      manufacturer: 'Shudhyum Foods'
    }
  ];

  // Create products using API service
  for (const productData of sampleProducts) {
    try {
      await apiService.createProduct(productData as any);
    } catch (error) {
      console.warn('Failed to create sample product:', error);
    }
  }

  console.log('✅ Initial data seeding complete');
}