import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { 
  X, 
  Plus, 
  Upload, 
  Save,
  Package,
  Tag,
  DollarSign,
  Weight,
  Star
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Product } from '../../contexts/AppContext';
import { apiService } from '../../services/apiService';
import { toast } from 'sonner@2.0.3';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  mode: 'add' | 'edit' | 'view';
}

export function ProductModal({ isOpen, onClose, product, mode }: ProductModalProps) {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    longDescription: '',
    price: '',
    originalPrice: '',
    weight: '',
    category: '',
    subCategory: '',
    images: [''],
    inStock: true,
    stockCount: '',
    rating: '',
    reviewCount: '',
    badge: '',
    sku: '',
    isOrganic: false,
    isGlutenFree: false,
    shelfLife: '',
    origin: '',
    manufacturer: 'Shudhyum Foods',
    tags: [''],
    nutritionFacts: [{ nutrient: '', value: '', percentage: '' }],
    features: [{ title: '', description: '', icon: 'leaf' }]
  });

  useEffect(() => {
    if (product && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        longDescription: product.longDescription || '',
        price: product.price?.toString() || '',
        originalPrice: product.originalPrice?.toString() || '',
        weight: product.weight || '',
        category: product.category || '',
        subCategory: product.subCategory || '',
        images: product.images || [''],
        inStock: product.inStock || true,
        stockCount: product.stockCount?.toString() || '',
        rating: product.rating?.toString() || '',
        reviewCount: product.reviewCount?.toString() || '',
        badge: product.badge || '',
        sku: product.sku || '',
        isOrganic: product.isOrganic || false,
        isGlutenFree: product.isGlutenFree || false,
        shelfLife: product.shelfLife?.toString() || '',
        origin: product.origin || '',
        manufacturer: product.manufacturer || 'Shudhyum Foods',
        tags: product.tags || [''],
        nutritionFacts: product.nutritionFacts || [{ nutrient: '', value: '', percentage: '' }],
        features: product.features || [{ title: '', description: '', icon: 'leaf' }]
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        description: '',
        longDescription: '',
        price: '',
        originalPrice: '',
        weight: '',
        category: '',
        subCategory: '',
        images: [''],
        inStock: true,
        stockCount: '',
        rating: '',
        reviewCount: '',
        badge: '',
        sku: '',
        isOrganic: false,
        isGlutenFree: false,
        shelfLife: '',
        origin: '',
        manufacturer: 'Shudhyum Foods',
        tags: [''],
        nutritionFacts: [{ nutrient: '', value: '', percentage: '' }],
        features: [{ title: '', description: '', icon: 'leaf' }]
      });
    }
  }, [product, mode, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].map((item: any, i: number) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field as keyof typeof prev], field === 'nutritionFacts' ? { nutrient: '', value: '', percentage: '' } : 
                field === 'features' ? { title: '', description: '', icon: 'leaf' } : '']
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        longDescription: formData.longDescription,
        price: parseFloat(formData.price) || 0,
        originalPrice: parseFloat(formData.originalPrice) || 0,
        weight: formData.weight,
        category: formData.category,
        subCategory: formData.subCategory,
        images: formData.images.filter(img => img.trim() !== ''),
        inStock: formData.inStock,
        stockCount: parseInt(formData.stockCount) || 0,
        rating: parseFloat(formData.rating) || 0,
        reviewCount: parseInt(formData.reviewCount) || 0,
        badge: formData.badge,
        sku: formData.sku,
        isOrganic: formData.isOrganic,
        isGlutenFree: formData.isGlutenFree,
        shelfLife: parseInt(formData.shelfLife) || 0,
        origin: formData.origin,
        manufacturer: formData.manufacturer,
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        nutritionFacts: formData.nutritionFacts.filter(nf => nf.nutrient.trim() !== ''),
        features: formData.features.filter(f => f.title.trim() !== ''),
        isActive: true,
        seoSlug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      };

      let response;
      if (mode === 'add') {
        response = await apiService.createProduct(productData as any);
        if (response.success && response.data) {
          dispatch({ type: 'ADD_PRODUCT', payload: response.data });
          toast.success('Product created successfully!');
        } else {
          // Fallback: create product locally if API fails
          const fallbackProduct = {
            ...productData,
            id: `product-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            seoSlug: productData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
          };
          dispatch({ type: 'ADD_PRODUCT', payload: fallbackProduct as any });
          toast.success('Product created successfully! (Local mode)');
        }
      } else if (mode === 'edit' && product) {
        response = await apiService.updateProduct(product.id, productData as any);
        if (response.success && response.data) {
          dispatch({ type: 'UPDATE_PRODUCT', payload: response.data });
          toast.success('Product updated successfully!');
        } else {
          // Fallback: update product locally if API fails
          const fallbackProduct = {
            ...product,
            ...productData,
            updatedAt: new Date().toISOString(),
            seoSlug: productData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
          };
          dispatch({ type: 'UPDATE_PRODUCT', payload: fallbackProduct as any });
          toast.success('Product updated successfully! (Local mode)');
        }
      }

      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const isReadOnly = mode === 'view';
  const title = mode === 'add' ? 'Add New Product' : mode === 'edit' ? 'Edit Product' : 'Product Details';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-green-600" />
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' && "Add a new product to your catalog"}
            {mode === 'edit' && "Update product information"}
            {mode === 'view' && "View product details"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={isReadOnly}
                placeholder="Enter product name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={isReadOnly}
                placeholder="Brief product description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longDescription">Detailed Description</Label>
              <Textarea
                id="longDescription"
                value={formData.longDescription}
                onChange={(e) => handleInputChange('longDescription', e.target.value)}
                disabled={isReadOnly}
                placeholder="Detailed product description"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  disabled={isReadOnly}
                  placeholder="e.g., atta"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subCategory">Sub Category</Label>
                <Input
                  id="subCategory"
                  value={formData.subCategory}
                  onChange={(e) => handleInputChange('subCategory', e.target.value)}
                  disabled={isReadOnly}
                  placeholder="e.g., wheat"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  disabled={isReadOnly}
                  placeholder="Product SKU"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Pricing & Inventory</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  disabled={isReadOnly}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price (₹)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                  disabled={isReadOnly}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  disabled={isReadOnly}
                  placeholder="e.g., 1 KG"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stockCount">Stock Count</Label>
                <Input
                  id="stockCount"
                  type="number"
                  value={formData.stockCount}
                  onChange={(e) => handleInputChange('stockCount', e.target.value)}
                  disabled={isReadOnly}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="inStock"
                checked={formData.inStock}
                onCheckedChange={(checked) => handleInputChange('inStock', checked)}
                disabled={isReadOnly}
              />
              <Label htmlFor="inStock">In Stock</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', e.target.value)}
                  disabled={isReadOnly}
                  placeholder="4.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reviewCount">Review Count</Label>
                <Input
                  id="reviewCount"
                  type="number"
                  value={formData.reviewCount}
                  onChange={(e) => handleInputChange('reviewCount', e.target.value)}
                  disabled={isReadOnly}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="badge">Badge</Label>
              <Input
                id="badge"
                value={formData.badge}
                onChange={(e) => handleInputChange('badge', e.target.value)}
                disabled={isReadOnly}
                placeholder="e.g., Best Seller"
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Product Attributes</h4>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isOrganic"
                    checked={formData.isOrganic}
                    onCheckedChange={(checked) => handleInputChange('isOrganic', checked)}
                    disabled={isReadOnly}
                  />
                  <Label htmlFor="isOrganic">Organic</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isGlutenFree"
                    checked={formData.isGlutenFree}
                    onCheckedChange={(checked) => handleInputChange('isGlutenFree', checked)}
                    disabled={isReadOnly}
                  />
                  <Label htmlFor="isGlutenFree">Gluten Free</Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Product Images</h3>
          {formData.images.map((image, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={image}
                onChange={(e) => handleArrayChange('images', index, e.target.value)}
                disabled={isReadOnly}
                placeholder="Image URL"
                className="flex-1"
              />
              {!isReadOnly && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem('images', index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {!isReadOnly && (
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('images')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Tags</h3>
          {formData.tags.map((tag, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={tag}
                onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                disabled={isReadOnly}
                placeholder="Tag"
                className="flex-1"
              />
              {!isReadOnly && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem('tags', index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {!isReadOnly && (
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('tags')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tag
            </Button>
          )}
        </div>

        {/* Nutrition Facts */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Nutrition Facts (per 100g)</h3>
          {formData.nutritionFacts.map((fact, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 items-center">
              <Input
                value={fact.nutrient}
                onChange={(e) => {
                  const updated = [...formData.nutritionFacts];
                  updated[index] = { ...updated[index], nutrient: e.target.value };
                  setFormData(prev => ({ ...prev, nutritionFacts: updated }));
                }}
                disabled={isReadOnly}
                placeholder="Nutrient (e.g., Protein)"
              />
              <Input
                value={fact.value}
                onChange={(e) => {
                  const updated = [...formData.nutritionFacts];
                  updated[index] = { ...updated[index], value: e.target.value };
                  setFormData(prev => ({ ...prev, nutritionFacts: updated }));
                }}
                disabled={isReadOnly}
                placeholder="Value (e.g., 12.5g)"
              />
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={fact.percentage}
                  onChange={(e) => {
                    const updated = [...formData.nutritionFacts];
                    updated[index] = { ...updated[index], percentage: parseInt(e.target.value) || 0 };
                    setFormData(prev => ({ ...prev, nutritionFacts: updated }));
                  }}
                  disabled={isReadOnly}
                  placeholder="% DV"
                  className="flex-1"
                />
                {!isReadOnly && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('nutritionFacts', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          {!isReadOnly && (
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('nutritionFacts')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Nutrition Fact
            </Button>
          )}
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Product Features</h3>
          {formData.features.map((feature, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
              <Input
                value={feature.title}
                onChange={(e) => {
                  const updated = [...formData.features];
                  updated[index] = { ...updated[index], title: e.target.value };
                  setFormData(prev => ({ ...prev, features: updated }));
                }}
                disabled={isReadOnly}
                placeholder="Feature Title (e.g., 100% Organic)"
              />
              <Input
                value={feature.description}
                onChange={(e) => {
                  const updated = [...formData.features];
                  updated[index] = { ...updated[index], description: e.target.value };
                  setFormData(prev => ({ ...prev, features: updated }));
                }}
                disabled={isReadOnly}
                placeholder="Description"
              />
              <div className="flex items-center space-x-2">
                <select
                  value={feature.icon}
                  onChange={(e) => {
                    const updated = [...formData.features];
                    updated[index] = { ...updated[index], icon: e.target.value };
                    setFormData(prev => ({ ...prev, features: updated }));
                  }}
                  disabled={isReadOnly}
                  className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="leaf">🌿 Organic</option>
                  <option value="shield">🛡️ Safe</option>
                  <option value="clock">⏰ Fresh</option>
                  <option value="heart">❤️ Healthy</option>
                  <option value="star">⭐ Premium</option>
                  <option value="check">✅ Certified</option>
                  <option value="grain">🌾 Natural</option>
                  <option value="mountain">🏔️ Pure</option>
                </select>
                {!isReadOnly && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('features', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          {!isReadOnly && (
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('features')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {!isReadOnly && (
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              {mode === 'add' ? 'Add Product' : 'Save Changes'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}