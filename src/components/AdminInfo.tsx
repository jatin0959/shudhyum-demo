import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X, User, Shield } from 'lucide-react';

export function AdminInfo() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      {/* Info Trigger Button */}
      <button
        onClick={() => setShowInfo(true)}
        className="fixed bottom-4 left-4 z-40 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Demo Information"
      >
        <Info className="h-4 w-4" />
      </button>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setShowInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Shudhyum Demo</h3>
                <button
                  onClick={() => setShowInfo(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Customer Access</h4>
                    <p className="text-sm text-gray-600">
                      Browse products, create account, and experience the full customer journey.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Admin Access</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Manage products, users, and orders with full admin capabilities.
                    </p>
                    <div className="bg-gray-50 rounded p-2 text-xs font-mono">
                      📧 admin@shudhyum.com<br />
                      🔑 admin123
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-xs text-blue-800">
                    <strong>Note:</strong> This is a demo system with sample data. 
                    All features are fully functional with localStorage persistence.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowInfo(false)}
                className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}