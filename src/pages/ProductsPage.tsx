import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Star, ShoppingCart, Filter, Search, AlertTriangle } from 'lucide-react';
import { Input } from '../components/ui/input';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useApp } from '../contexts/AppContext';
import { apiService } from '../services/apiService';
import { toast } from 'sonner';
import { Product } from '../contexts/AppContext'; // Add this import



export function ProductsPage() {
  const { state, dispatch } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getProducts();
      // console.log('Products response:', response);
      
      if (response.success && Array.isArray(response.data)) {
        setProducts(response.data);
        dispatch({ type: 'SET_PRODUCTS', payload: response.data });
      } else {
        setError('Failed to load products');
        toast.error('Could not load products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again.');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Map the products directly from the API response
  const allProducts = products.map(product => ({
    id: product._id, // Use _id from MongoDB
    name: product.name,
    description: product.description,
    price: `₹${product.price}`,
    originalPrice: `₹${product.originalPrice}`,
    weight: product.weight,
    rating: product.rating,
    category: product.category,
    // Handle both image URLs with fallback
    image: product.images?.[0] || 'src\assets\a36ce34b924cd8a740857c1d08e4dee614169a30.png',
    secondaryImage: product.images?.[1] || 'src\assets\a36ce34b924cd8a740857c1d08e4dee614169a30.png',
    badge: product.badge,
    inStock: product.inStock
  }));

  // Generate categories from actual products
  const categories = [
    { id: 'all', name: 'All Products' },
    ...Array.from(new Set(allProducts.map(p => p.category)))
      .map(category => ({
        id: category,
        name: category.charAt(0).toUpperCase() + category.slice(1)
      }))
  ];

  const filteredProducts = allProducts
    .filter(product => 
      (selectedCategory === 'all' || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseInt(a.price.replace('₹', '')) - parseInt(b.price.replace('₹', ''));
        case 'price-high':
          return parseInt(b.price.replace('₹', '')) - parseInt(a.price.replace('₹', ''));
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Add this effect to detect when internet comes back online
  useEffect(() => {
    const handleOnline = () => {
      if (error) {
        fetchProducts();
      }
    };
    
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Our Products</h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Discover our complete range of freshly ground, premium quality atta and flour varieties
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <AlertTriangle className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-800 font-semibold">{error}</p>
            <Button 
              onClick={fetchProducts} 
              className="mt-4 bg-green-600 hover:bg-green-700"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  {/* Product Image Container */}
                  <div className="relative overflow-hidden rounded-t-lg h-48">
                    {/* Primary Image */}
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-300 ease-in-out group-hover:opacity-0"
                    />
                    {/* Secondary Image */}
                    <ImageWithFallback
                      src={product.secondaryImage}
                      alt={`${product.name} - alternate view`}
                      className="w-full h-full object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
                    />
                    {/* Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <Badge 
                        variant={product.badge === 'Best Seller' ? 'destructive' : 'secondary'}
                        className={`${
                          product.badge === 'Best Seller' ? 'bg-orange-500' :
                          product.badge === 'New' ? 'bg-blue-500' :
                          product.badge === 'Ancient Grain' ? 'bg-purple-500' :
                          'bg-green-500'
                        } text-white`}
                      >
                        {product.badge}
                      </Badge>
                    </div>
                    {/* Stock Status */}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                        <span className="text-white font-semibold bg-red-500 px-3 py-1 rounded">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                      <span className="text-sm text-gray-500">(50+ reviews)</span>
                    </div>

                    {/* Price and Weight */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-900">{product.price}</span>
                          <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                        </div>
                        <span className="text-xs text-gray-500">{product.weight}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        disabled={!product.inStock}
                        size="sm"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href="#product-detail">View</a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-green-600 text-white p-8 rounded-2xl mt-12 text-center">
          <h3 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h3>
          <p className="text-lg mb-6 text-green-100">
            Contact us for custom orders or to request specific grain varieties
          </p>
          <Button variant="secondary" size="lg" className="bg-white text-green-600 hover:bg-gray-100">
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
}