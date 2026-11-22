import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Sidebar from './components/common/Sidebar';
import BottomNav from './components/common/BottomNav';
import CartDrawer from './components/common/CartDrawer';
import BiteBot from './components/common/BiteBot';
import { useAuth } from './context/AuthContext';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import SplashScreen from './pages/customer/SplashScreen';
import OnboardingPage from './pages/customer/OnboardingPage';
import SearchExplorePage from './pages/customer/SearchExplorePage';
import RestaurantListingPage from './pages/customer/RestaurantListingPage';
import RestaurantDetailPage from './pages/customer/RestaurantDetailPage';
import WishlistPage from './pages/customer/WishlistPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';
import CustomerOrdersPage from './pages/customer/CustomerOrdersPage';
import CustomerProfilePage from './pages/customer/CustomerProfilePage';

// Vendor Pages
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorOrderManagement from './pages/vendor/VendorOrderManagement';
import VendorMenuManagement from './pages/vendor/VendorMenuManagement';
import VendorEarnings from './pages/vendor/VendorEarnings';
import VendorRestaurantSettings from './pages/vendor/VendorRestaurantSettings';
import VendorReviewsPage from './pages/vendor/VendorReviewsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUserManagement from './pages/admin/AdminUserManagement';
import AdminRestaurantManagement from './pages/admin/AdminRestaurantManagement';
import AdminVendorApprovals from './pages/admin/AdminVendorApprovals';
import AdminFoodManagement from './pages/admin/AdminFoodManagement';
import AdminCategoryManagement from './pages/admin/AdminCategoryManagement';
import AdminOrderManagement from './pages/admin/AdminOrderManagement';
import AdminPayments from './pages/admin/AdminPayments';
import AdminCouponManagement from './pages/admin/AdminCouponManagement';
import AdminReviewsComplaints from './pages/admin/AdminReviewsComplaints';
import AdminReportsAnalytics from './pages/admin/AdminReportsAnalytics';
import AdminAdminsPermissions from './pages/admin/AdminAdminsPermissions';
import AdminSettings from './pages/admin/AdminSettings';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Role Guard Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#FF7900' }}>
        Loading QuickBite session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Layout with Sidebar for Vendor and Admin
const DashboardLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)', backgroundColor: '#111111' }}>
      <Sidebar />
      <main style={{ flex: 1, backgroundColor: '#111111', overflowY: 'auto', paddingBottom: '40px' }}>
        {children}
      </main>
    </div>
  );
};

function App() {
  const location = useLocation();
  const isDashboardView = location.pathname.startsWith('/vendor') || location.pathname.startsWith('/admin');
  const isSplashOrOnboarding = location.pathname === '/splash' || location.pathname === '/onboarding';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#111111' }}>
      {!isSplashOrOnboarding && <Navbar />}

      <div style={{ flex: 1 }}>
        <Routes>
          {/* Customer & Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/search" element={<SearchExplorePage />} />
          <Route path="/restaurants" element={<RestaurantListingPage />} />
          <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders/:id" element={<OrderTrackingPage />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['customer', 'vendor', 'admin']}>
                <CustomerOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['customer', 'vendor', 'admin']}>
                <CustomerProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* Vendor Portal Routes */}
          <Route
            path="/vendor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['vendor', 'admin']}>
                <DashboardLayout>
                  <VendorDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/orders"
            element={
              <ProtectedRoute allowedRoles={['vendor', 'admin']}>
                <DashboardLayout>
                  <VendorOrderManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/menu"
            element={
              <ProtectedRoute allowedRoles={['vendor', 'admin']}>
                <DashboardLayout>
                  <VendorMenuManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/earnings"
            element={
              <ProtectedRoute allowedRoles={['vendor', 'admin']}>
                <DashboardLayout>
                  <VendorEarnings />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/reviews"
            element={
              <ProtectedRoute allowedRoles={['vendor', 'admin']}>
                <DashboardLayout>
                  <VendorReviewsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/settings"
            element={
              <ProtectedRoute allowedRoles={['vendor', 'admin']}>
                <DashboardLayout>
                  <VendorRestaurantSettings />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Portal Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <AdminUserManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/restaurants"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <AdminRestaurantManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/vendor-approvals"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <AdminVendorApprovals />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/food-management"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <AdminFoodManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <AdminCategoryManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <AdminOrderManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <AdminPayments />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/coupons"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <AdminCouponManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reviews-complaints"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <AdminReviewsComplaints />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <AdminReportsAnalytics />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/permissions"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <AdminAdminsPermissions />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <AdminSettings />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Cart Slide-Over Drawer */}
      <CartDrawer />

      {/* Interactive AI Food Assistant Chatbot */}
      {!isSplashOrOnboarding && <BiteBot />}

      {/* Mobile Bottom Navigation for Customer */}
      {!isDashboardView && !isSplashOrOnboarding && <BottomNav />}

      {/* Footer on public views */}
      {!isDashboardView && !isSplashOrOnboarding && <Footer />}
    </div>
  );
}

export default App;
