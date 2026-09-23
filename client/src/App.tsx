import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Customer Pages
import { LandingPage } from './pages/customer/LandingPage';
import { CatalogPage } from './pages/customer/CatalogPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { CartPage } from './pages/customer/CartPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrderSuccessPage } from './pages/customer/OrderSuccessPage';
import { OrderHistoryPage } from './pages/customer/OrderHistoryPage';
import { OrderTrackingPage } from './pages/customer/OrderTrackingPage';

// Vendor Pages
import { VendorLoginPage } from './pages/vendor/VendorLoginPage';
import { VendorDashboardPage } from './pages/vendor/VendorDashboardPage';
import { VendorOrdersPage } from './pages/vendor/VendorOrdersPage';
import { VendorInventoryPage } from './pages/vendor/VendorInventoryPage';
import { VendorSettingsPage } from './pages/vendor/VendorSettingsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminVendorsPage } from './pages/admin/AdminVendorsPage';

import { FloraChatbot } from './components/common/FloraChatbot';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen relative">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              {/* Public & Customer Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
              <Route path="/orders" element={<OrderHistoryPage />} />
              <Route path="/orders/:orderId" element={<OrderTrackingPage />} />

              {/* Vendor Portal Routes */}
              <Route path="/vendor/login" element={<VendorLoginPage />} />
              <Route path="/vendor/register" element={<VendorLoginPage />} />
              <Route path="/vendor/dashboard" element={<VendorDashboardPage />} />
              <Route path="/vendor/orders" element={<VendorOrdersPage />} />
              <Route path="/vendor/inventory" element={<VendorInventoryPage />} />
              <Route path="/vendor/settings" element={<VendorSettingsPage />} />

              {/* Administrative Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/vendors" element={<AdminVendorsPage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Floating AI Floral & Cold-Chain Chatbot */}
          <FloraChatbot />

          <Footer />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
