import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Users, Target, Eye, Award, Heart, Leaf, Clock, Shield } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const values = [
  {
    icon: Leaf,
    title: "Purity First",
    description: "We believe in providing 100% natural products without any chemicals or preservatives."
  },
  {
    icon: Clock,
    title: "Freshness Guaranteed",
    description: "Every product is made to order, ensuring maximum freshness and nutritional value."
  },
  {
    icon: Shield,
    title: "Quality Assurance",
    description: "Rigorous quality checks from grain selection to final packaging ensure consistent excellence."
  },
  {
    icon: Heart,
    title: "Family First",
    description: "Understanding families' health needs and providing personalized care for every customer."
  }
];

const team = [
  {
    name: "Founder & CEO",
    role: "Visionary Leader",
    description: "Passionate about bringing traditional nutrition to modern families",
    image: "https://images.unsplash.com/photo-1561731885-e0591a34659c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMG1hbnxlbnwxfHx8fDE3NTk2NTcwMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    name: "Head of Quality",
    role: "Quality Expert",
    description: "Ensures every grain meets our highest standards of purity and freshness",
    image: "https://images.unsplash.com/photo-1585554414787-09b821c321c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHdvbWFufGVufDF8fHx8MTc1OTYzNTA4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    name: "Operations Manager",
    role: "Process Expert",
    description: "Streamlines operations to deliver fresh products efficiently to every customer",
    image: "https://images.unsplash.com/photo-1752118464988-2914fb27d0f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcGVyYXRpb25zJTIwbWFuYWdlciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTk2NTcwMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
];

const milestones = [
  {
    year: "2023",
    title: "Shudhyum Founded",
    description: "Started with a mission to provide fresh, preservative-free atta to families"
  },
  {
    year: "2023",
    title: "First 100 Customers",
    description: "Achieved our first milestone with overwhelming positive feedback"
  },
  {
    year: "2024",
    title: "Product Range Expansion",
    description: "Introduced multiple grain varieties and specialty flours"
  },
  {
    year: "2024",
    title: "5000+ Happy Families",
    description: "Crossed 5000 satisfied customers across multiple cities"
  }
];

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">About Shudhyum</h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Bringing the taste of purity to every household with fresh, healthy, and preservative-free atta
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Shudhyum was born from a simple yet powerful realization: every family deserves access to pure, 
                  fresh, and healthy atta without compromising on quality or convenience. In today's fast-paced world, 
                  many families rely on commercial brands filled with preservatives and chemicals.
                </p>
                <p>
                  We saw busy working women and health-conscious families struggling to find time to visit traditional 
                  chakki shops while wanting the best nutrition for their loved ones. This gap inspired us to create 
                  Shudhyum - a brand that brings the goodness of traditional, freshly ground flour directly to your doorstep.
                </p>
                <p>
                  Our commitment goes beyond just providing products. We understand the responsibility that comes with 
                  feeding families, and we take that trust seriously. From sourcing the finest grains to ensuring 
                  every batch is ground fresh, we maintain the highest standards of quality and purity.
                </p>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1667328925477-1cc446534413?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGdyYWluJTIwZ3JpbmRpbmclMjBtaWxsfGVufDF8fHx8MTc1OTY1NTY3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Our traditional grinding process"
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Foundation</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Shudhyum
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-8">
              <CardContent className="space-y-4">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Our Mission</h3>
                <p className="text-gray-600">
                  To provide healthy, fresh, and preservative-free atta that brings the goodness of 
                  traditional grinding to modern households, making healthy eating accessible to every family.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardContent className="space-y-4">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Our Vision</h3>
                <p className="text-gray-600">
                  To become the most trusted brand for fresh, quality grains and flours, building lasting 
                  relationships through transparency, care, and unwavering commitment to purity.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardContent className="space-y-4">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Our Values</h3>
                <p className="text-gray-600">
                  Trust, transparency, commitment to purity, personalized care for every customer, 
                  and a deep understanding of family health needs drive everything we do.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Core Values */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
                    <value.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">{value.title}</h4>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Key milestones in our mission to bring healthy, fresh atta to every family
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-green-200 hidden lg:block"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                    <Card className="p-6">
                      <CardContent className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl font-bold text-green-600">{milestone.year}</span>
                          <Award className="h-5 w-5 text-green-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">{milestone.title}</h4>
                        <p className="text-gray-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="hidden lg:block w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow-md z-10"></div>
                  
                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The passionate people behind Shudhyum's commitment to quality and purity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6 text-center">
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h4>
                    <p className="text-green-600 font-semibold mb-3">{member.role}</p>
                    <p className="text-gray-600">{member.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-green-600 text-white p-12 rounded-2xl text-center">
            <h3 className="text-3xl font-bold mb-4">Join the Shudhyum Family</h3>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Experience the difference that comes with fresh, pure, and healthy atta. 
              Let us take care of your family's nutrition while you focus on what matters most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                Shop Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}