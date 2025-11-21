import { apiService } from '../services/apiService';

export async function seedInitialData() {
  console.log('🌱 Seeding production data...');
  
  try {
    // Sample products with comprehensive data
    const sampleProducts = [
      {
        name: 'Premium Whole Wheat Atta',
        description: 'Premium quality whole wheat flour, freshly ground from selected wheat grains',
        longDescription: 'Our premium whole wheat atta is made from carefully selected wheat grains sourced directly from organic farms across Punjab and Madhya Pradesh. Ground fresh using traditional stone mills to preserve maximum nutrition and authentic taste. Each batch is quality tested to ensure consistency and purity.',
        price: 45,
        originalPrice: 55,
        weight: '1 KG',
        category: 'wheat',
        subCategory: 'whole-wheat',
        images: [
          'https://images.unsplash.com/photo-1627744515559-a15ff44a8a50?w=500&h=500&fit=crop',
          'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=500&fit=crop'
        ],
        inStock: true,
        stockCount: 47,
        rating: 4.8,
        reviewCount: 324,
        badge: 'Best Seller',
        nutritionFacts: [
          { nutrient: 'Protein', value: '12.5g', percentage: 25 },
          { nutrient: 'Fiber', value: '11.2g', percentage: 45 },
          { nutrient: 'Iron', value: '4.2mg', percentage: 23 },
          { nutrient: 'Vitamin B6', value: '0.3mg', percentage: 18 },
          { nutrient: 'Magnesium', value: '126mg', percentage: 30 },
          { nutrient: 'Phosphorus', value: '295mg', percentage: 24 }
        ],
        features: [
          { title: '100% Organic', description: 'Certified organic wheat from trusted farms', icon: 'leaf' },
          { title: 'Stone Ground', description: 'Traditional stone milling preserves nutrients', icon: 'grain' },
          { title: 'Fresh Daily', description: 'Ground to order for maximum freshness', icon: 'clock' },
          { title: 'Premium Quality', description: 'Hand-selected grains for superior taste', icon: 'star' }
        ],
        tags: ['organic', 'whole-wheat', 'healthy', 'stone-ground', 'fresh'],
        isActive: true,
        sku: 'SHD-WW-001',
        isOrganic: true,
        isGlutenFree: false,
        shelfLife: 180,
        origin: 'Punjab, India',
        manufacturer: 'Shudhyum Foods'
      },
      {
        name: 'Multi-Grain Power Atta',
        description: 'Nutritious blend of wheat, oats, barley, and millet for enhanced nutrition',
        longDescription: 'Our signature multi-grain atta combines the goodness of five carefully selected grains to provide complete nutrition. Perfect for health-conscious families who want variety and nutrition in their daily meals. Each grain is sourced from certified organic farms and processed using traditional methods.',
        price: 65,
        originalPrice: 75,
        weight: '1 KG',
        category: 'multigrain',
        subCategory: 'mixed-grains',
        images: [
          'https://images.unsplash.com/photo-1623066798929-946425dbe1b0?w=500&h=500&fit=crop',
          'https://images.unsplash.com/photo-1702061895070-15d7972d3eef?w=500&h=500&fit=crop'
        ],
        inStock: true,
        stockCount: 32,
        rating: 4.9,
        reviewCount: 186,
        badge: 'Nutritious',
        nutritionFacts: [
          { nutrient: 'Protein', value: '15.2g', percentage: 30 },
          { nutrient: 'Fiber', value: '13.8g', percentage: 55 },
          { nutrient: 'Iron', value: '5.1mg', percentage: 28 },
          { nutrient: 'Magnesium', value: '89mg', percentage: 22 },
          { nutrient: 'Zinc', value: '2.8mg', percentage: 25 },
          { nutrient: 'Vitamin B1', value: '0.4mg', percentage: 33 }
        ],
        features: [
          { title: 'Multi-Grain Power', description: 'Wheat, oats, barley, millet, and ragi blend', icon: 'grain' },
          { title: 'High Protein', description: '15g protein per 100g serving', icon: 'heart' },
          { title: 'Rich in Fiber', description: 'Supports digestive health naturally', icon: 'leaf' },
          { title: 'Balanced Nutrition', description: 'Complete amino acid profile', icon: 'star' }
        ],
        tags: ['multigrain', 'protein-rich', 'healthy', 'nutritious', 'balanced'],
        isActive: true,
        sku: 'SHD-MG-001',
        isOrganic: true,
        isGlutenFree: false,
        shelfLife: 150,
        origin: 'Maharashtra, India',
        manufacturer: 'Shudhyum Foods'
      },
      {
        name: 'Jowar Atta (Sorghum)',
        description: 'Pure sorghum flour, gluten-free and rich in fiber and protein',
        longDescription: 'Jowar atta is a gluten-free alternative that\'s perfect for those with gluten sensitivity or celiac disease. Rich in antioxidants, minerals, and B-vitamins, it\'s a healthy choice for modern lifestyles. Sourced from drought-resistant sorghum crops that require minimal water.',
        price: 55,
        originalPrice: 65,
        weight: '1 KG',
        category: 'millet',
        subCategory: 'sorghum',
        images: [
          'https://images.unsplash.com/photo-1661174282476-43db0a70d7fe?w=500&h=500&fit=crop'
        ],
        inStock: true,
        stockCount: 28,
        rating: 4.7,
        reviewCount: 142,
        badge: 'Gluten Free',
        nutritionFacts: [
          { nutrient: 'Protein', value: '11.3g', percentage: 23 },
          { nutrient: 'Fiber', value: '6.7g', percentage: 27 },
          { nutrient: 'Iron', value: '4.4mg', percentage: 24 },
          { nutrient: 'Calcium', value: '28mg', percentage: 3 },
          { nutrient: 'Potassium', value: '350mg', percentage: 7 },
          { nutrient: 'Antioxidants', value: 'High', percentage: 0 }
        ],
        features: [
          { title: 'Gluten Free', description: 'Safe for celiac and gluten-sensitive individuals', icon: 'shield' },
          { title: 'Rich in Antioxidants', description: 'Natural antioxidants for cellular health', icon: 'heart' },
          { title: 'Low Glycemic Index', description: 'Better blood sugar control', icon: 'check' },
          { title: 'Sustainable Grain', description: 'Drought-resistant and eco-friendly', icon: 'mountain' }
        ],
        tags: ['gluten-free', 'millet', 'healthy', 'antioxidant-rich', 'sustainable'],
        isActive: true,
        sku: 'SHD-JW-001',
        isOrganic: true,
        isGlutenFree: true,
        shelfLife: 120,
        origin: 'Karnataka, India',
        manufacturer: 'Shudhyum Foods'
      },
      {
        name: 'Bajra Atta (Pearl Millet)',
        description: 'Nutrient-dense pearl millet flour, perfect for healthy rotis and snacks',
        longDescription: 'Bajra atta is made from pearl millet, a superfood that\'s packed with iron, protein, and essential amino acids. Known for its warming properties in Ayurveda, it\'s perfect for winter months and provides sustained energy throughout the day.',
        price: 50,
        originalPrice: 60,
        weight: '1 KG',
        category: 'millet',
        subCategory: 'pearl-millet',
        images: [
          'https://images.unsplash.com/photo-1623066798929-946425dbe1b0?w=500&h=500&fit=crop'
        ],
        inStock: true,
        stockCount: 35,
        rating: 4.6,
        reviewCount: 98,
        badge: 'High Protein',
        nutritionFacts: [
          { nutrient: 'Protein', value: '11.6g', percentage: 23 },
          { nutrient: 'Iron', value: '8mg', percentage: 44 },
          { nutrient: 'Fiber', value: '1.2g', percentage: 5 },
          { nutrient: 'Magnesium', value: '137mg', percentage: 33 },
          { nutrient: 'Phosphorus', value: '296mg', percentage: 24 },
          { nutrient: 'Folate', value: '45mcg', percentage: 11 }
        ],
        features: [
          { title: 'Iron Rich', description: '8mg iron per 100g - great for anemia', icon: 'heart' },
          { title: 'Warming Properties', description: 'Ayurvedic benefits for winter months', icon: 'grain' },
          { title: 'High Energy', description: 'Sustained energy release for active lifestyles', icon: 'star' },
          { title: 'Gluten Free', description: 'Naturally gluten-free ancient grain', icon: 'shield' }
        ],
        tags: ['iron-rich', 'millet', 'energy', 'ayurvedic', 'gluten-free'],
        isActive: true,
        sku: 'SHD-BJ-001',
        isOrganic: true,
        isGlutenFree: true,
        shelfLife: 120,
        origin: 'Rajasthan, India',
        manufacturer: 'Shudhyum Foods'
      },
      {
        name: 'Ragi Atta (Finger Millet)',
        description: 'Finger millet flour rich in calcium and iron, perfect for healthy meals',
        longDescription: 'Ragi atta is a powerhouse of nutrition, containing more calcium than milk and rich in natural amino acids. Perfect for growing children, pregnant women, and elderly people. Our ragi is sourced from traditional farmers in South India.',
        price: 60,
        originalPrice: 70,
        weight: '1 KG',
        category: 'millet',
        subCategory: 'finger-millet',
        images: [
          'https://images.unsplash.com/photo-1661174282476-43db0a70d7fe?w=500&h=500&fit=crop'
        ],
        inStock: true,
        stockCount: 25,
        rating: 4.8,
        reviewCount: 156,
        badge: 'High Calcium',
        nutritionFacts: [
          { nutrient: 'Calcium', value: '344mg', percentage: 27 },
          { nutrient: 'Protein', value: '7.3g', percentage: 15 },
          { nutrient: 'Iron', value: '3.9mg', percentage: 22 },
          { nutrient: 'Fiber', value: '3.6g', percentage: 14 },
          { nutrient: 'Vitamin D', value: 'Natural', percentage: 0 },
          { nutrient: 'Amino Acids', value: 'Complete', percentage: 0 }
        ],
        features: [
          { title: 'Calcium Rich', description: 'More calcium than milk - 344mg per 100g', icon: 'heart' },
          { title: 'Natural Vitamin D', description: 'One of the rare grains with Vitamin D', icon: 'star' },
          { title: 'Complete Protein', description: 'Contains all essential amino acids', icon: 'grain' },
          { title: 'Baby Friendly', description: 'Perfect weaning food for infants', icon: 'check' }
        ],
        tags: ['calcium-rich', 'millet', 'vitamin-d', 'baby-food', 'complete-protein'],
        isActive: true,
        sku: 'SHD-RG-001',
        isOrganic: true,
        isGlutenFree: true,
        shelfLife: 120,
        origin: 'Karnataka, India',
        manufacturer: 'Shudhyum Foods'
      },
      {
        name: 'Besan (Gram Flour)',
        description: 'Pure chickpea flour, protein-rich and perfect for snacks and cooking',
        longDescription: 'Our premium besan is made from carefully selected Bengal gram (chana dal) that\'s roasted to perfection and ground into fine flour. Rich in protein and essential amino acids, it\'s perfect for making pakoras, cheela, and traditional sweets.',
        price: 70,
        originalPrice: 80,
        weight: '1 KG',
        category: 'dal',
        subCategory: 'chickpea',
        images: [
          'https://images.unsplash.com/photo-1627744515559-a15ff44a8a50?w=500&h=500&fit=crop'
        ],
        inStock: true,
        stockCount: 42,
        rating: 4.5,
        reviewCount: 203,
        badge: 'Protein Rich',
        nutritionFacts: [
          { nutrient: 'Protein', value: '22.8g', percentage: 46 },
          { nutrient: 'Fiber', value: '11.1g', percentage: 44 },
          { nutrient: 'Folate', value: '437mcg', percentage: 109 },
          { nutrient: 'Iron', value: '4.9mg', percentage: 27 },
          { nutrient: 'Magnesium', value: '166mg', percentage: 40 },
          { nutrient: 'Zinc', value: '2.8mg', percentage: 25 }
        ],
        features: [
          { title: 'High Protein', description: '22.8g protein per 100g serving', icon: 'heart' },
          { title: 'Folate Rich', description: 'Essential for pregnant women', icon: 'star' },
          { title: 'Versatile Use', description: 'Snacks, sweets, and savory dishes', icon: 'grain' },
          { title: 'Gluten Free', description: 'Naturally gluten-free legume flour', icon: 'shield' }
        ],
        tags: ['protein-rich', 'folate', 'versatile', 'gluten-free', 'traditional'],
        isActive: true,
        sku: 'SHD-BS-001',
        isOrganic: true,
        isGlutenFree: true,
        shelfLife: 180,
        origin: 'Madhya Pradesh, India',
        manufacturer: 'Shudhyum Foods'
      }
    ];

    // Create products
    for (const productData of sampleProducts) {
      try {
        const response = await apiService.createProduct(productData as any);
        if (response.success) {
          console.log(`✅ Created product: ${productData.name}`);
        } else {
          console.warn(`⚠️  Failed to create product: ${productData.name}`, response.error);
        }
      } catch (error) {
        console.warn(`❌ Error creating product ${productData.name}:`, error);
      }
    }

    // Create sample users
    console.log('👥 Creating sample users...');
    const sampleUsers = [
      {
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya.sharma@example.com',
        phone: '+91 98765 43210',
        role: 'customer' as const
      },
      {
        firstName: 'Rajesh',
        lastName: 'Kumar', 
        email: 'rajesh.kumar@example.com',
        phone: '+91 98765 43211',
        role: 'customer' as const
      },
      {
        firstName: 'Anita',
        lastName: 'Patel',
        email: 'anita.patel@example.com', 
        phone: '+91 98765 43212',
        role: 'customer' as const
      }
    ];

    for (const userData of sampleUsers) {
      try {
        const response = await apiService.register(userData);
        if (response.success) {
          console.log(`✅ Created user: ${userData.firstName} ${userData.lastName}`);
        }
      } catch (error) {
        console.warn(`⚠️  Failed to create user: ${userData.firstName} ${userData.lastName}`);
      }
    }

    // Create sample orders
    console.log('📦 Creating sample orders...');
    const sampleOrders = [
      {
        userId: 'user-1',
        items: [
          {
            productId: 'prod-1',
            name: 'Premium Whole Wheat Atta',
            price: 45,
            quantity: 2,
            weight: '1 KG',
            image: 'https://images.unsplash.com/photo-1627744515559-a15ff44a8a50?w=100&h=100&fit=crop'
          }
        ],
        subtotal: 90,
        shipping: 0,
        tax: 9,
        total: 99,
        status: 'delivered' as const,
        paymentMethod: 'razorpay',
        paymentStatus: 'completed' as const,
        shippingAddress: {
          name: 'Priya Sharma',
          address: '123 Green Valley, Sector 12',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          phone: '+91 98765 43210'
        },
        trackingId: 'BD1234567890',
        shippingPartner: 'Blue Dart',
        estimatedDelivery: new Date(Date.now() + 86400000 * 2).toISOString()
      },
      {
        userId: 'user-2',
        items: [
          {
            productId: 'prod-2',
            name: 'Multi-Grain Power Atta',
            price: 65,
            quantity: 1,
            weight: '1 KG',
            image: 'https://images.unsplash.com/photo-1623066798929-946425dbe1b0?w=100&h=100&fit=crop'
          },
          {
            productId: 'prod-3',
            name: 'Jowar Atta (Sorghum)',
            price: 55,
            quantity: 1,
            weight: '1 KG',
            image: 'https://images.unsplash.com/photo-1661174282476-43db0a70d7fe?w=100&h=100&fit=crop'
          }
        ],
        subtotal: 120,
        shipping: 0,
        tax: 12,
        total: 132,
        status: 'shipped' as const,
        paymentMethod: 'stripe',
        paymentStatus: 'completed' as const,
        shippingAddress: {
          name: 'Rajesh Kumar',
          address: '456 Health Street, Block A',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001',
          phone: '+91 98765 43211'
        },
        trackingId: 'DHL9876543210',
        shippingPartner: 'Delhivery',
        estimatedDelivery: new Date(Date.now() + 86400000 * 3).toISOString()
      }
    ];

    for (const orderData of sampleOrders) {
      try {
        const response = await apiService.createOrder(orderData as any);
        if (response.success) {
          console.log(`✅ Created order: ${response.data?.orderNumber}`);
        }
      } catch (error) {
        console.warn(`⚠️  Failed to create sample order`);
      }
    }

    console.log('🎉 Initial data seeding complete!');
    return true;
  } catch (error) {
    console.error('❌ Failed to seed initial data:', error);
    return false;
  }
}