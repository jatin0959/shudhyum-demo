import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { CheckCircle, Leaf, Clock, Shield, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  return (
    <section id="home" className="relative bg-white py-16 lg:py-24 overflow-hidden">
      {/* Animated Background decoration */}
      <motion.div
        className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gray-50/50 to-transparent"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gray-200 rounded-full opacity-40"
            initial={{
              x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1200,
              y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 800,
              scale: 0
            }}
            animate={{
              y: [null, Math.random() * -100, Math.random() * 100],
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="space-y-4">
              <motion.div
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-[#515252] rounded-full font-medium text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <Leaf className="h-4 w-4 mr-2" />
                100% Natural & Fresh
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="h-4 w-4 ml-2 text-[#d17b45]" />
                </motion.div>
              </motion.div>

              <motion.h1
                className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Fresh, Pure &
                <motion.span
                  className="text-[#d17b45] block"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  Healthy Atta
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-lg text-gray-600 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                Experience the taste of purity with our freshly ground atta, made to order from premium quality grains. No preservatives, just natural goodness for your family's health.
              </motion.p>
            </div>

            {/* USP Pills */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              {[
                { icon: CheckCircle, text: "Made to Order" },
                { icon: Leaf, text: "No Preservatives" },
                { icon: Clock, text: "Freshly Ground" },
                { icon: Shield, text: "Quality Assured" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center bg-gray-100 text-[#515252] px-3 py-2 rounded-full"
                  whileHover={{ scale: 1.05, backgroundColor: "#f5f5f5", boxShadow: "0 4px 12px -2px rgb(0 0 0 / 0.1)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                  </motion.div>
                  <span className="text-sm">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-[#d17b45] hover:bg-[#b8643a] text-white px-8 shadow-lg hover:shadow-xl transition-shadow"
                  asChild
                >
                  <a href="#products">Shop Now</a>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#d17b45] text-[#d17b45] hover:bg-gray-50 hover:text-[#d17b45] px-8"
                  asChild
                >
                  <a href="#about">Learn More</a>
                </Button>

              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex items-center space-x-6 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              {[
                { value: "10,000+", label: "Happy Families" },
                { value: "4.9★", label: "Customer Rating" },
                { value: "24-48hrs", label: "Fresh Delivery" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  whileHover={{ scale: 1.1 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.6 + index * 0.1, type: "spring", stiffness: 200 }}
                >
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            <motion.div
              className="relative overflow-hidden rounded-2xl shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1627744515559-a15ff44a8a50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGZsb3VyJTIwZ3JhaW5zJTIwaGVhbHRoeSUyMG9yZ2FuaWN8ZW58MXx8fHwxNzU5NjU1Njc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Fresh wheat grains and flour"
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </motion.div>

            {/* Floating Card */}
            <motion.div
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border max-w-xs"
              initial={{ opacity: 0, y: 20, rotate: -5 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: 1.5, duration: 0.6, type: "spring" }}
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  className="bg-gray-100 p-2 rounded-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Leaf className="h-6 w-6 text-[#d17b45]" />
                </motion.div>
                <div>
                  <h4 className="font-semibold text-gray-900">100% Natural</h4>
                  <p className="text-sm text-gray-600">Free from chemicals</p>
                </div>
              </div>
            </motion.div>

            {/* Price Card */}
            <motion.div
              className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: -20, rotate: 5 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: 1.7, duration: 0.6, type: "spring" }}
              whileHover={{ scale: 1.1, rotate: -2 }}
            >
              <div className="text-center">
                <motion.p
                  className="text-lg font-bold text-[#d17b45]"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                >
                  ₹45
                </motion.p>
                <p className="text-sm text-gray-600">per KG</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}