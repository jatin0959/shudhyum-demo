import React from 'react';

export function ReturnPolicy() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Return and Refund Policy</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Our Commitment</h2>
            <p>At Shudhyum, we are committed to providing the highest quality fresh atta. If you're not completely satisfied with your purchase, we're here to help.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Return Eligibility</h2>
            <p>You may return products under the following conditions:</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Product received is damaged or contaminated during delivery</li>
              <li>Wrong product delivered (different from your order)</li>
              <li>Product quality issues reported within 24 hours of delivery</li>
              <li>Product packaging is severely damaged affecting product quality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Non-Returnable Items</h2>
            <p>Due to the nature of our fresh food products, the following items cannot be returned:</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Products that have been opened and used</li>
              <li>Products damaged due to improper storage by customer</li>
              <li>Products returned after 24 hours of delivery without valid quality concerns</li>
              <li>Products ordered with special customizations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Return Process</h2>
            <p>To initiate a return, please follow these steps:</p>
            <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
              <li>Contact our customer service within 24 hours of delivery</li>
              <li>Provide your order number and reason for return</li>
              <li>Send photos of the product/packaging if damaged</li>
              <li>Our team will review and approve eligible returns</li>
              <li>We will arrange pickup of the returned item</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Refund Policy</h2>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Approved returns will be refunded within 3-7 business days</li>
              <li>Refunds will be processed to the original payment method</li>
              <li>In case of quality issues, we may offer replacement instead of refund</li>
              <li>Delivery charges are non-refundable unless the return is due to our error</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Replacement Policy</h2>
            <p>For quality-related issues, we may offer a free replacement of the same product. Replacement conditions:</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Same product must be available in stock</li>
              <li>Replacement will be delivered within 2-3 business days</li>
              <li>If same product is unavailable, store credit or refund will be offered</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Quality Guarantee</h2>
            <p>We guarantee that our products are:</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Freshly ground within 24 hours of delivery</li>
              <li>Made from premium quality grains</li>
              <li>Free from preservatives and chemicals</li>
              <li>Properly packaged to maintain freshness</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Customer Responsibilities</h2>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Inspect products immediately upon delivery</li>
              <li>Store products according to provided instructions</li>
              <li>Report any issues within 24 hours</li>
              <li>Provide accurate information during the return process</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact for Returns</h2>
            <p>To initiate a return or for any questions about our return policy:</p>
            <div className="ml-4 mt-2">
              <p>Email: returns@shudhyum.com</p>
              <p>Phone: +91 XXXXX XXXXX</p>
              <p>WhatsApp: +91 XXXXX XXXXX</p>
              <p>Business Hours: Monday-Saturday, 9:00 AM - 7:00 PM</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Special Circumstances</h2>
            <p>In case of:</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Delivery delays beyond 48 hours: Full refund available</li>
              <li>Bulk orders: Custom return policy may apply</li>
              <li>Seasonal products: Limited return window may apply</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Policy Updates</h2>
            <p>We reserve the right to update this return policy. Any changes will be communicated to customers and posted on our website.</p>
          </section>

          <div className="bg-green-50 p-4 rounded-lg mt-8">
            <h3 className="font-semibold text-green-800 mb-2">Our Promise</h3>
            <p className="text-green-700 text-sm">
              We stand behind the quality of our products. If you're not satisfied, we'll make it right. Your trust in Shudhyum is our priority.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mt-4">
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