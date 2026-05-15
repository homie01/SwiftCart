import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Layout from './components/layout/Layout';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { ForgotPasswordPage, ResetPasswordPage } from './pages/AuthPages';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import { AccountLayout, OrdersPage, ProfilePage, SettingsPage } from './pages/AccountPages';
import NotFoundPage from './pages/NotFoundPage';
import { useAuthStore } from './store';

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function GuestOnly({ children }) {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '14px',
            background: '#0a0a0a',
            color: '#faf8f5',
            fontSize: '13px',
            fontWeight: '500',
            padding: '12px 16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          },
          success: { iconTheme: { primary: '#d4a853', secondary: '#0a0a0a' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />

          <Route path="/checkout" element={
            <RequireAuth><CheckoutPage /></RequireAuth>
          } />

          <Route path="/account" element={
            <RequireAuth><AccountLayout /></RequireAuth>
          }>
            <Route index element={<Navigate to="orders" replace />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
        <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />
        <Route path="/forgot-password" element={<GuestOnly><ForgotPasswordPage /></GuestOnly>} />
        <Route path="/reset-password/:userId/:token" element={<ResetPasswordPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
