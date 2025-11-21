import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Star, ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useApp } from '../contexts/AppContext';



export function ProductShowcase() {
  const { state } = useApp();

  // Get products from context and convert to display format
  const products = (state.products || []).slice(0, 4).map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: `₹${product.price}`,
    originalPrice: `₹${product.originalPrice}`,
    weight: product.weight,
    rating: product.rating,
    image: product.images[0] || 'https://via.placeholder.com/300',
    badge: product.badge
  }));
  return (
    <section id="products" className="py-16 lg:py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Our Premium Atta Collection
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our range of freshly ground, premium quality flour made from the finest grains. 
            Each product is crafted with care to bring you the purest taste and maximum nutrition.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card 
              key={product.id} 
              className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => window.location.href = '#product-detail'}
            >
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Badge */}
                  {product.badge && (
                    <span className={`absolute top-2 right-2 px-3 py-1 text-xs font-medium rounded-full ${
                      product.badge === 'Best Seller' ? 'bg-orange-100 text-orange-700' :
                      product.badge === 'New' ? 'bg-blue-100 text-blue-700' :
                      product.badge === 'Gluten Free' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-[#515252]'
                    }`}>
                      {product.badge}
                    </span>
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
                      size="sm" 
                      variant="outline"
                      className="flex-1 border-[#d17b45] text-[#d17b45] hover:bg-gray-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to cart logic here
                      }}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-[#d17b45] text-[#d17b45] hover:bg-gray-50 px-8">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}