import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Star, Quote, Heart, Users, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai, Maharashtra",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTY1NzM3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 5,
    title: "Exceptional Quality & Freshness",
    testimonial: "I've been ordering from Shudhyum for over 6 months now, and the quality is consistently outstanding. The atta is always fresh, and you can really taste the difference compared to store-bought flour. My family loves the rotis made from their whole wheat atta!",
    product: "Whole Wheat Atta",
    verified: true,
    date: "2 weeks ago"
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "Delhi, NCR",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTk2NTczNzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 5,
    title: "Perfect for Health-Conscious Families",
    testimonial: "As someone who's diabetic, I needed high-quality, preservative-free flour. Shudhyum's multi-grain atta has been perfect for my dietary needs. The customer service is also excellent - they delivered even during lockdown!",
    product: "Multi-Grain Atta",
    verified: true,
    date: "1 month ago"
  },
  {
    id: 3,
    name: "Meera Patel",
    location: "Ahmedabad, Gujarat",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMHNtaWxpbmd8ZW58MXx8fHwxNzU5NjU3MzcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 5,
    title: "Gluten-Free Options are Amazing",
    testimonial: "My daughter has celiac disease, and finding good gluten-free flour was always a challenge. Shudhyum's jowar and bajra atta are not only safe but also incredibly tasty. She can finally enjoy her favorite snacks again!",
    product: "Jowar Atta",
    verified: true,
    date: "3 weeks ago"
  },
  {
    id: 4,
    name: "Anil Verma",
    location: "Pune, Maharashtra",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBzbWlsaW5nfGVufDF8fHx8MTc1OTY1NzM3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 5,
    title: "Convenient & Reliable Service",
    testimonial: "Working long hours, I barely have time to go to the market. Shudhyum's online ordering and prompt delivery have been a lifesaver. The packaging is excellent, and the atta stays fresh for weeks.",
    product: "Ragi Atta",
    verified: true,
    date: "1 week ago"
  },
  {
    id: 5,
    name: "Sunita Joshi",
    location: "Bangalore, Karnataka",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMGhhcHB5fGVufDF8fHx8MTc1OTY1NzM3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 5,
    title: "Best Investment for Family Health",
    testimonial: "After trying Shudhyum's atta, I can never go back to commercial brands. The nutrition value is exceptional, and my kids' health has improved significantly. Worth every penny spent on quality food!",
    product: "Besan (Gram Flour)",
    verified: true,
    date: "2 months ago"
  },
  {
    id: 6,
    name: "Vikram Singh",
    location: "Jaipur, Rajasthan",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzU5NjU3MzcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 5,
    title: "Traditional Quality Meets Modern Convenience",
    testimonial: "Shudhyum brings back the authentic taste of traditional chakki-ground flour. My grandmother would be proud of the quality! The online ordering process is smooth, and delivery is always on time.",
    product: "Bajra Atta",
    verified: true,
    date: "5 days ago"
  }
];

const stats = [
  { icon: Users, value: "10,000+", label: "Happy Families" },
  { icon: Star, value: "4.9/5", label: "Average Rating" },
  { icon: Award, value: "98%", label: "Satisfaction Rate" },
  { icon: Heart, value: "95%", label: "Repeat Customers" }
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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

export function TestimonialsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState('all');

  const filteredTestimonials = filter === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.product.toLowerCase().includes(filter.toLowerCase()));

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length);
  };

  return (
    <div className="min-h-screen bg-white">
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
              <Heart className="h-8 w-8" />
            </motion.div>
            <motion.h1 
              className="text-4xl lg:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Customer Stories
            </motion.h1>
            <motion.p 
              className="text-xl text-green-100 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Hear from families who've experienced the Shudhyum difference
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="space-y-3">
                    <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                      <stat.icon className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Testimonial */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Story</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stories that inspire us to keep delivering excellence
            </p>
          </motion.div>

          <motion.div 
            className="max-w-4xl mx-auto"
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-8 lg:p-12">
                <div className="text-center space-y-6">
                  <Quote className="h-12 w-12 text-green-600 mx-auto" />
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {filteredTestimonials[currentIndex]?.title}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                      "{filteredTestimonials[currentIndex]?.testimonial}"
                    </p>
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={filteredTestimonials[currentIndex]?.avatar} />
                      <AvatarFallback>{filteredTestimonials[currentIndex]?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">
                          {filteredTestimonials[currentIndex]?.name}
                        </h4>
                        {filteredTestimonials[currentIndex]?.verified && (
                          <Badge variant="secondary" className="text-green-600 bg-green-50">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-500">{filteredTestimonials[currentIndex]?.location}</p>
                      <p className="text-sm text-gray-400">{filteredTestimonials[currentIndex]?.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < (filteredTestimonials[currentIndex]?.rating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {filteredTestimonials[currentIndex]?.product}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-center space-x-4 mt-8">
              <motion.button
                onClick={prevTestimonial}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>
              <motion.button
                onClick={nextTestimonial}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* All Testimonials Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real experiences from real families across India
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      {testimonial.verified && (
                        <Badge variant="secondary" className="text-green-600 bg-green-50">
                          Verified
                        </Badge>
                      )}
                    </div>

                    <h4 className="font-semibold text-gray-900">{testimonial.title}</h4>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      "{testimonial.testimonial}"
                    </p>

                    <div className="flex items-center space-x-3 pt-2">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{testimonial.name}</p>
                        <p className="text-xs text-gray-500">{testimonial.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {testimonial.product}
                      </Badge>
                      <span className="text-gray-400">{testimonial.date}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="bg-green-600 text-white p-12 rounded-2xl text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold mb-4">Join Our Happy Family</h3>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Experience the quality and freshness that thousands of families trust every day
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                  Shop Now
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  Share Your Story
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}