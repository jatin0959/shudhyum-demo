import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CartPage } from './pages/CartPage';
import { AccountPage } from './pages/AccountPage';
import { ProfilePage } from './pages/ProfilePage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { FAQPage } from './pages/FAQPage';
import { AdminPanel } from './pages/AdminPanel';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsConditions } from './components/TermsConditions';
import { ReturnPolicy } from './components/ReturnPolicy';
import { AdminAccessButton } from './components/AdminAccessButton';
import { SystemStatus } from './components/SystemStatus';
import { AdminInfo } from './components/AdminInfo';
import { AppProvider, useApp } from './contexts/AppContext';
import { useDataInitialization } from './hooks/useDataInitialization';
import { useProductionInitialization } from './hooks/useProductionInitialization';
import { Toaster } from 'sonner';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const { state, dispatch } = useApp();

  // still run initialization hook, just not blocking UI with a loader
  const { isInitialized, loading, error } = useProductionInitialization();
  // if you want, you can also call:
  // useDataInitialization();

  const renderPage = () => {
    // Admin mode always shows admin panel
    if (state.isAdminMode || currentPage === 'admin') {
      return <AdminPanel />;
    }

    switch (currentPage) {
      case 'products':
        return <ProductsPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'cart':
        return <CartPage />;
      case 'account':
        return <AccountPage />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return <AdminPanel />;
      case 'testimonials':
        return <TestimonialsPage />;
      case 'faq':
        return <FAQPage />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsConditions />;
      case 'returns':
        return <ReturnPolicy />;
      default:
        return <HomePage />;
    }
  };

  // Simple hash-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const path = window.location.hash.replace('#', '');
      const validPages = [
        'home',
        'products',
        'product-detail',
        'about',
        'contact',
        'cart',
        'account',
        'profile',
        'testimonials',
        'faq',
        'privacy',
        'terms',
        'returns',
        'admin',
      ];

      if (path === 'admin') {
        dispatch({ type: 'SET_ADMIN_MODE', payload: true });
        setCurrentPage('admin');
      } else if (validPages.includes(path)) {
        dispatch({ type: 'SET_ADMIN_MODE', payload: false });
        setCurrentPage(path);
      } else {
        dispatch({ type: 'SET_ADMIN_MODE', payload: false });
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // initial load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [dispatch]);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  // No loader — app always renders immediately
  if (state.isAdminMode || currentPage === 'admin') {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={pageTransition}
        >
          {renderPage()}
        </motion.main>
      </AnimatePresence>

      <Footer />

      {/* Admin Access Button - only on customer-facing pages */}
      {!state.isAdminMode && <AdminAccessButton />}

      {/* System Status Indicator */}
      <SystemStatus />

      {/* Demo / Admin Info */}
      {!state.isAdminMode && <AdminInfo />}
    </div>
  );
}

// Main App component
export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <Toaster />
    </AppProvider>
  );
}
