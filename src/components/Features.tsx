import React from 'react';
import { Leaf, Clock, Shield, Heart, Truck, Award } from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: "Made to Order",
    description: "Every batch of atta is freshly ground only after you place your order, ensuring maximum freshness and nutrition."
  },
  {
    icon: Leaf,
    title: "No Preservatives",
    description: "Pure and natural flour without any chemicals, preservatives, or artificial additives for your family's health."
  },
  {
    icon: Shield,
    title: "Quality Grains",
    description: "We source only the finest quality grains from trusted farmers, ensuring consistent taste and nutrition."
  },
  {
    icon: Heart,
    title: "Healthy & Nutritious",
    description: "Packed with essential nutrients, fiber, and proteins to support your family's health and well-being."
  },
  {
    icon: Truck,
    title: "Fresh Delivery",
    description: "Quick and reliable delivery service to bring fresh atta directly to your doorstep within 24-48 hours."
  },
  {
    icon: Award,
    title: "Trust & Transparency",
    description: "Complete transparency in our process, from grain selection to grinding, building trust with every order."
  }
];

export function Features() {
  return (
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Shudhyum?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We understand the responsibility from cleanliness to quality product. 
            Our commitment to purity ensures your family gets the healthiest and freshest atta.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start space-x-4">
                <div className="bg-gray-100 p-3 rounded-lg flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-[#d17b45]" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-[#d17b45] text-white p-8 rounded-2xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Join Our Healthy Family Today!
            </h3>
            <p className="text-lg mb-6 text-white/90">
              Join thousands of families who have chosen healthier, fresher atta for their daily needs.
            </p>
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold">5000+</div>
                <div className="text-sm text-white/90">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">10+</div>
                <div className="text-sm text-white/90">Atta Varieties</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-white/90">Natural & Pure</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}