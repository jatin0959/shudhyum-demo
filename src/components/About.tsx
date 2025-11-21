import React from 'react';
import { Button } from './ui/button';
import { Users, Target, Eye } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function About() {
  return (
    <section id="about" className="py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1667328925477-1cc446534413?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGdyYWluJTIwZ3JpbmRpbmclMjBtaWxsfGVufDF8fHx8MTc1OTY1NTY3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Traditional grain grinding process"
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h4 className="text-xl font-bold mb-2">Traditional Methods</h4>
                <p className="text-sm opacity-90">Time-tested grinding techniques for optimal nutrition</p>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Our Story & Commitment
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  At Shudhyum, we believe that every family deserves access to pure, fresh, and healthy atta. 
                  Our journey began with a simple mission: to provide an alternative to preservative-filled 
                  commercial brands that compromise on health and taste.
                </p>
                <p>
                  We understand that atta is a basic necessity in every household, especially for busy working 
                  women who want the best for their families but may not have time to visit traditional chakki shops. 
                  That's why we bring the freshness of traditional grinding directly to your doorstep.
                </p>
              </div>
            </div>

            {/* Values */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <Target className="h-5 w-5 text-[#d17b45]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Our Mission</h4>
                  <p className="text-gray-600">To provide healthy, fresh, and preservative-free atta that brings the goodness of traditional grinding to modern households.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <Eye className="h-5 w-5 text-[#d17b45]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Our Vision</h4>
                  <p className="text-gray-600">To become the most trusted brand for fresh, quality grains and flours, building lasting relationships through transparency and care.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-[#d17b45]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Our Values</h4>
                  <p className="text-gray-600">Trust, transparency, commitment to purity, and personalized care for every customer and their family's health.</p>
                </div>
              </div>
            </div>

            <Button size="lg" className="bg-[#d17b45] hover:bg-[#b8643a] text-white px-8">
              Learn More About Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}