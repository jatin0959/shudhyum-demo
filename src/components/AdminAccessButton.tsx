import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Settings, Lock, Eye, EyeOff, Shield } from 'lucide-react';

export function AdminAccessButton() {
  const [showDialog, setShowDialog] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAdminLogin = () => {
    // In a real app, this would verify credentials against a backend
    if (credentials.email === 'admin@shudhyum.com' && credentials.password === 'admin123') {
      window.location.hash = '#admin';
      setShowDialog(false);
    } else {
      alert('Invalid credentials. Use admin@shudhyum.com / admin123 for demo.');
    }
  };

  return (
    <>
      {/* Floating Admin Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5, type: "spring" }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <motion.button
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow relative group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="h-6 w-6" />
              
              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: 10, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 10, scale: 0.8 }}
                    className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-black text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap"
                  >
                    Admin Panel Access
                    <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-black border-t-2 border-t-transparent border-b-2 border-b-transparent" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pulse animation */}
              <motion.div
                className="absolute inset-0 bg-purple-400 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 0, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <span>Admin Access</span>
              </DialogTitle>
              <DialogDescription>
                Enter your admin credentials to access the management panel
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@shudhyum.com"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Demo Credentials Helper */}
              <motion.div 
                className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-start space-x-2">
                  <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium">
                    DEMO
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">Demo Credentials:</p>
                    <p className="text-blue-700 font-mono text-xs mt-1">
                      Email: admin@shudhyum.com<br />
                      Password: admin123
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAdminLogin}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={!credentials.email || !credentials.password}
              >
                <Lock className="h-4 w-4 mr-2" />
                Access Admin Panel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Development Badge */}
      <motion.div
        className="fixed top-4 right-4 z-40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300">
          🚀 Full-Stack Demo
        </Badge>
      </motion.div>
    </>
  );
}