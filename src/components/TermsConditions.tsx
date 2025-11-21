import React from 'react';

export function TermsConditions() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using Shudhyum's services, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Products and Services</h2>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>We provide freshly ground atta and flour products made to order</li>
              <li>All products are made from quality grains without preservatives</li>
              <li>Product availability may vary based on grain availability and seasonal factors</li>
              <li>We reserve the right to modify or discontinue products without notice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Ordering and Payment</h2>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Orders are processed upon payment confirmation</li>
              <li>We accept various payment methods as displayed on our website</li>
              <li>Prices are subject to change without prior notice</li>
              <li>We reserve the right to refuse or cancel orders at our discretion</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Delivery</h2>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>We aim to deliver within 24-48 hours of order confirmation</li>
              <li>Delivery times may vary based on location and order volume</li>
              <li>Delivery charges may apply based on location and order value</li>
              <li>Risk of loss passes to you upon delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Product Quality and Freshness</h2>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>All products are freshly ground to order</li>
              <li>We recommend consuming within [X] days of delivery for optimal freshness</li>
              <li>Proper storage instructions will be provided with each order</li>
              <li>We are not responsible for quality degradation due to improper storage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. User Responsibilities</h2>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Provide accurate delivery information</li>
              <li>Be available to receive deliveries during specified hours</li>
              <li>Store products properly as per our instructions</li>
              <li>Report any issues within 24 hours of delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Limitation of Liability</h2>
            <p>Our liability shall not exceed the amount paid for the specific product in question. We are not liable for any indirect, incidental, or consequential damages.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Intellectual Property</h2>
            <p>All content on our website, including logos, text, images, and trademarks, is the property of Shudhyum and protected by intellectual property laws.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Privacy</h2>
            <p>Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Governing Law</h2>
            <p>These terms shall be governed by and construed in accordance with the laws of [Your State/Country], without regard to conflict of law provisions.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact Information</h2>
            <p>For questions about these Terms and Conditions, please contact us at:</p>
            <div className="ml-4 mt-2">
              <p>Email: legal@shudhyum.com</p>
              <p>Phone: +91 XXXXX XXXXX</p>
              <p>Address: [Your Business Address]</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website.</p>
          </section>

          <div className="bg-gray-50 p-4 rounded-lg mt-8">
            <p className="text-sm text-gray-600">
              <strong>Last updated:</strong> [Date]<br/>
              <strong>Effective date:</strong> [Date]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}