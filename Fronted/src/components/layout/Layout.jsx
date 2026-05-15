import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';

const NO_FOOTER = ['/login', '/register', '/forgot-password'];

export default function Layout() {
  const { pathname } = useLocation();
  const showFooter = !NO_FOOTER.includes(pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CartDrawer />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
