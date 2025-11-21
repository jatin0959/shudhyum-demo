import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminDashboard } from './admin/AdminDashboard';
import { PaymentGateways } from './admin/PaymentGateways';
import { ShippingPartners } from './admin/ShippingPartners';
import { ProductsManagement } from './admin/ProductsManagement';
import { OrdersManagement } from './admin/OrdersManagement';
import { UsersManagement } from './admin/UsersManagement';
import { SettingsManagement } from './admin/SettingsManagement';
import { AnalyticsPage } from './admin/AnalyticsPage';

const adminPages = {
  dashboard: AdminDashboard,
  products: ProductsManagement,
  orders: OrdersManagement,
  users: UsersManagement,
  payments: PaymentGateways,
  shipping: ShippingPartners,
  analytics: AnalyticsPage,
  settings: SettingsManagement,
};

type AdminPageKey = keyof typeof adminPages;

export function AdminPanel() {
  const [currentPage, setCurrentPage] = useState<AdminPageKey>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Handle URL parameter changes for page navigation
  useEffect(() => {
    const handleHashChange = () => {
      const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
      const page = urlParams.get('page') as AdminPageKey;
      if (page && adminPages[page]) {
        setCurrentPage(page);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check initial URL

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handlePageChange = (page: AdminPageKey) => {
    setCurrentPage(page);
    // Update URL without triggering a page reload
    const newUrl = `#admin${page !== 'dashboard' ? `?page=${page}` : ''}`;
    window.history.pushState(null, '', newUrl);
  };

  const CurrentPageComponent = adminPages[currentPage];

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar
        currentPage={currentPage}
        onPageChange={handlePageChange}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        {/* Header */}
        <AdminHeader
          currentPage={currentPage}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Page Content */}
        <motion.main
          key={currentPage}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="flex-1 p-6 overflow-auto"
        >
          <CurrentPageComponent />
        </motion.main>
      </div>
    </div>
  );
}