import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { ChevronDown, Search, HelpCircle, Phone, Mail, MessageCircle, Truck, Shield, Clock, Leaf } from 'lucide-react';

const faqCategories = [
  { id: 'all', name: 'All Questions', icon: HelpCircle },
  { id: 'orders', name: 'Orders & Delivery', icon: Truck },
  { id: 'products', name: 'Products & Quality', icon: Leaf },
  { id: 'payment', name: 'Payment & Pricing', icon: Shield },
  { id: 'account', name: 'Account & Support', icon: Phone }
];

const faqs = [
  {
    id: 1,
    category: 'products',
    question: "How fresh is your atta?",
    answer: "All our atta is ground fresh to order. We only grind your atta after you place an order, ensuring maximum freshness and nutritional value. Our atta is delivered within 24-48 hours of grinding, maintaining its natural oils and nutrients.",
    popular: true
  },
  {
    id: 2,
    category: 'orders',
    question: "What is your delivery time?",
    answer: "We deliver within 24-48 hours of order confirmation in most cities. Delivery times may vary based on your location and order volume. We also offer same-day delivery in select metro areas for orders placed before 12 PM.",
    popular: true
  },
  {
    id: 3,
    category: 'products',
    question: "Do you use any preservatives or chemicals?",
    answer: "Absolutely not! We are committed to providing 100% natural, preservative-free atta. Our grains are sourced directly from farmers, and we use traditional stone grinding methods without adding any chemicals, preservatives, or artificial additives.",
    popular: true
  },
  {
    id: 4,
    category: 'orders',
    question: "Do you offer bulk orders?",
    answer: "Yes, we accept bulk orders for families, offices, and businesses. We offer special pricing for orders above 25kg. Contact our customer support team for customized bulk order pricing and delivery arrangements.",
    popular: false
  },
  {
    id: 5,
    category: 'payment',
    question: "What payment methods do you accept?",
    answer: "We accept all major payment methods including credit/debit cards, net banking, UPI payments, digital wallets, and cash on delivery (where available). All online payments are secured with 256-bit SSL encryption.",
    popular: false
  },
  {
    id: 6,
    category: 'products',
    question: "What is the shelf life of your atta?",
    answer: "Our freshly ground atta has a shelf life of 2-3 months when stored in a cool, dry place in an airtight container. Since we don't use preservatives, we recommend consuming within this period for best taste and nutrition.",
    popular: true
  },
  {
    id: 7,
    category: 'orders',
    question: "Can I modify or cancel my order?",
    answer: "You can modify or cancel your order within 2 hours of placing it, provided the grinding process hasn't started. Contact our customer support immediately for order modifications. Once grinding begins, cancellation may not be possible.",
    popular: false
  },
  {
    id: 8,
    category: 'products',
    question: "Do you have gluten-free options?",
    answer: "Yes! We offer several gluten-free options including Jowar (Sorghum), Bajra (Pearl Millet), Ragi (Finger Millet), and Besan (Gram Flour). All our gluten-free products are processed in dedicated facilities to prevent cross-contamination.",
    popular: true
  },
  {
    id: 9,
    category: 'payment',
    question: "Do you offer any discounts or loyalty programs?",
    answer: "Yes, we have a loyalty program where you earn points with every purchase. We also offer first-time customer discounts, bulk order discounts, and seasonal promotions. Subscribe to our newsletter for exclusive offers.",
    popular: false
  },
  {
    id: 10,
    category: 'orders',
    question: "What if I'm not satisfied with the product?",
    answer: "We offer a 100% satisfaction guarantee. If you're not happy with the quality, contact us within 24 hours of delivery for a replacement or full refund. We stand behind the quality of our products and want every customer to be completely satisfied.",
    popular: true
  },
  {
    id: 11,
    category: 'account',
    question: "How do I track my order?",
    answer: "Once your order is confirmed, you'll receive a tracking link via SMS and email. You can also log into your account on our website or app to track your order status in real-time, from grinding to delivery.",
    popular: false
  },
  {
    id: 12,
    category: 'products',
    question: "Where do you source your grains from?",
    answer: "We source our grains directly from certified organic farmers across India. Our wheat comes from Punjab and MP, millets from Karnataka and Rajasthan, and other grains from regions known for their quality. All grains undergo quality testing before processing.",
    popular: false
  },
  {
    id: 13,
    category: 'orders',
    question: "Do you deliver in my area?",
    answer: "We currently deliver in 25+ major cities across India including Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune, and more. Enter your pincode on our website to check delivery availability in your area. We're expanding to new cities regularly.",
    popular: false
  },
  {
    id: 14,
    category: 'payment',
    question: "Is there a minimum order value?",
    answer: "The minimum order value is ₹300. Orders above ₹500 qualify for free delivery. This helps us maintain the quality of our delivery service while keeping costs reasonable for our customers.",
    popular: false
  },
  {
    id: 15,
    category: 'account',
    question: "How do I contact customer support?",
    answer: "You can reach our customer support team via phone (+91 XXXXX XXXXX), email (support@shudhyum.com), or WhatsApp. Our support hours are Monday-Saturday 9 AM to 7 PM, and Sunday 10 AM to 5 PM.",
    popular: false
  }
];

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

export function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularFAQs = faqs.filter(faq => faq.popular);

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

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
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4"
            >
              <HelpCircle className="h-8 w-8" />
            </motion.div>
            <motion.h1 
              className="text-4xl lg:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Frequently Asked Questions
            </motion.h1>
            <motion.p 
              className="text-xl text-green-100 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Find answers to common questions about our products and services
            </motion.p>
          </div>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filters */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 justify-center">
            {faqCategories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <category.icon className="h-4 w-4" />
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Popular Questions */}
        {selectedCategory === 'all' && !searchTerm && (
          <section className="mb-12">
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Most Popular Questions</h2>
              <p className="text-gray-600">Quick answers to our most frequently asked questions</p>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-2 gap-4 mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {popularFAQs.slice(0, 4).map((faq) => (
                <motion.div
                  key={faq.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => toggleExpanded(faq.id)}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary" className="text-orange-600 bg-orange-50">
                              Popular
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                          <AnimatePresence>
                            {!expandedItems.includes(faq.id) && (
                              <motion.p 
                                className="text-gray-600 text-sm line-clamp-2"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              >
                                {faq.answer.substring(0, 100)}...
                              </motion.p>
                            )}
                            {expandedItems.includes(faq.id) && (
                              <motion.p 
                                className="text-gray-600 text-sm"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                {faq.answer}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedItems.includes(faq.id) ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* All FAQs */}
        <section>
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">All Questions</h2>
            <p className="text-gray-600">
              {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''} found
            </p>
          </motion.div>

          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredFAQs.map((faq) => (
              <motion.div
                key={faq.id}
                variants={itemVariants}
                whileHover={{ boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)" }}
              >
                <Card>
                  <CardContent 
                    className="p-6 cursor-pointer"
                    onClick={() => toggleExpanded(faq.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {faq.popular && (
                            <Badge variant="secondary" className="text-orange-600 bg-orange-50">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                        <AnimatePresence>
                          {expandedItems.includes(faq.id) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedItems.includes(faq.id) ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="ml-4 flex-shrink-0"
                      >
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredFAQs.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No questions found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search terms or browse different categories</p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </section>

        {/* Contact Support */}
        <motion.section 
          className="mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Can't find the answer you're looking for? Our friendly customer support team is here to help.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <CardContent className="space-y-2">
                      <Phone className="h-8 w-8 text-green-600 mx-auto" />
                      <h4 className="font-semibold">Call Us</h4>
                      <p className="text-sm text-gray-600">+91 XXXXX XXXXX</p>
                      <p className="text-xs text-gray-500">Mon-Sat: 9 AM - 7 PM</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <CardContent className="space-y-2">
                      <Mail className="h-8 w-8 text-green-600 mx-auto" />
                      <h4 className="font-semibold">Email Us</h4>
                      <p className="text-sm text-gray-600">support@shudhyum.com</p>
                      <p className="text-xs text-gray-500">Response within 24 hours</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <CardContent className="space-y-2">
                      <MessageCircle className="h-8 w-8 text-green-600 mx-auto" />
                      <h4 className="font-semibold">WhatsApp</h4>
                      <p className="text-sm text-gray-600">Chat with us</p>
                      <p className="text-xs text-gray-500">Quick responses</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Contact Support
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline">
                    Visit Help Center
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}