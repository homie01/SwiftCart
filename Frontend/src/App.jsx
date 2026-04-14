import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import { StoreProvider, useStore } from './context/StoreContext';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import ProfilePage from './pages/ProfilePage';

function AppRoutes() {
  const { authReady, user } = useStore();

  if (!authReady) {
    return (
      <div className="fullscreen-state">
        <div className="loader-card">
          <div className="loader-dot" />
          <p>Preparing your storefront...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/checkout"
          element={user ? <CheckoutPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={user ? <ProfilePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/orders"
          element={user ? <OrdersPage /> : <Navigate to="/login" replace />}
        />
      </Route>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppRoutes />
    </StoreProvider>
  );
}
