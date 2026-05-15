import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  Settings,
} from 'lucide-react';
import {
  useAuthStore,
  useCartStore,
  useWishlistStore,
  useUIStore,
} from '../../store';
import { clsx } from 'clsx';

const NAV_LINKS = [
  { to: '/shop', label: 'Shop' },
  { to: '/shop?category=smartphones', label: 'Electronics' },
  { to: '/shop?category=womens-dresses', label: 'Fashion' },
  { to: '/shop?category=home-decoration', label: 'Home' },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { count, openCart, toggleCart } = useCartStore();
  const { items: wishlist } = useWishlistStore();
  const { searchQuery, setSearchQuery } = useUIStore();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const cartCount = useCartStore((s) =>
    s.items.reduce((a, i) => a + i.quantity, 0),
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled ? 'glass-nav shadow-sm' : 'bg-transparent',
        )}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16 md:h-18'>
            {/* Logo */}
            <Link to='/' className='flex items-center gap-2 flex-shrink-0'>
              <div className='w-8 h-8 bg-[#0a0a0a] rounded-lg flex items-center justify-center'>
                <ShoppingBag size={16} className='text-[#d4a853]' />
              </div>
              <span className='font-display font-bold text-xl text-[#0a0a0a] tracking-tight'>
                Swift<span className='text-[#d4a853]'>Cart</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className='hidden md:flex items-center gap-7'>
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={clsx(
                    'text-sm font-medium transition-colors duration-200 relative group',
                    location.pathname.startsWith(to.split('?')[0])
                      ? 'text-[#0a0a0a]'
                      : 'text-[#5a5550] hover:text-[#0a0a0a]',
                  )}
                >
                  {label}
                  <span className='absolute -bottom-0.5 left-0 w-0 group-hover:w-full h-px bg-[#d4a853] transition-all duration-300' />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className='flex items-center gap-1 md:gap-2'>
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className='w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f0ede7] transition-colors'
              >
                <Search size={18} className='text-[#5a5550]' />
              </button>

              {/* Wishlist */}
              <Link
                to='/wishlist'
                className='relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f0ede7] transition-colors'
              >
                <Heart size={18} className='text-[#5a5550]' />
                {wishlist.length > 0 && (
                  <span className='absolute top-1 right-1 w-3.5 h-3.5 bg-[#d4a853] rounded-full text-[9px] text-white font-bold flex items-center justify-center'>
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className='relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f0ede7] transition-colors'
              >
                <ShoppingBag size={18} className='text-[#5a5550]' />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className='absolute top-1 right-1 w-3.5 h-3.5 bg-[#0a0a0a] rounded-full text-[9px] text-white font-bold flex items-center justify-center'
                    >
                      {cartCount > 9 ? '9+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* User */}
              {isAuthenticated ? (
                <div className='relative' ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenu((v) => !v)}
                    className='flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-full hover:bg-[#f0ede7] transition-colors'
                  >
                    <div className='w-7 h-7 rounded-full bg-[#0a0a0a] flex items-center justify-center text-[#d4a853] text-xs font-bold'>
                      {user?.firstname?.[0]?.toUpperCase()}
                    </div>
                    <span className='text-sm font-medium text-[#0a0a0a] hidden md:block'>
                      {user?.firstname}
                    </span>
                    <ChevronDown
                      size={13}
                      className='text-[#a8a39a] hidden md:block'
                    />
                  </button>

                  <AnimatePresence>
                    {userMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className='absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-[#e4dfd6] py-2 z-50'
                      >
                        <div className='px-4 py-3 border-b border-[#f0ede7]'>
                          <p className='font-semibold text-[#0a0a0a] text-sm'>
                            {user?.firstname} {user?.lastname}
                          </p>
                          <p className='text-xs text-[#a8a39a] truncate'>
                            {user?.email}
                          </p>
                        </div>
                        {[
                          {
                            to: '/account/orders',
                            icon: Package,
                            label: 'My Orders',
                          },
                          {
                            to: '/account/profile',
                            icon: User,
                            label: 'Profile',
                          },
                          {
                            to: '/account/settings',
                            icon: Settings,
                            label: 'Settings',
                          },
                        ].map(({ to, icon: Icon, label }) => (
                          <Link
                            key={to}
                            to={to}
                            onClick={() => setUserMenu(false)}
                            className='flex items-center gap-3 px-4 py-2.5 text-sm text-[#3d3a36] hover:bg-[#faf8f5] transition-colors'
                          >
                            <Icon size={15} className='text-[#a8a39a]' />{' '}
                            {label}
                          </Link>
                        ))}
                        <div className='border-t border-[#f0ede7] mt-1 pt-1'>
                          <button
                            onClick={() => {
                              logout();
                              setUserMenu(false);
                              navigate('/');
                            }}
                            className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors'
                          >
                            <LogOut size={15} /> Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to='/login'
                  className='btn-dark text-xs px-5 py-2 hidden md:flex items-center'
                >
                  Sign in
                </Link>
              )}

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className='md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f0ede7] transition-colors'
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='md:hidden bg-[#faf8f5] border-t border-[#e4dfd6]'
            >
              <div className='max-w-7xl mx-auto px-4 py-4 space-y-1'>
                {NAV_LINKS.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className='flex items-center py-3 text-sm font-medium text-[#3d3a36] border-b border-[#f0ede7]'
                  >
                    {label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <div className='pt-3 flex gap-3'>
                    <Link
                      to='/login'
                      className='btn-dark flex-1 text-center text-sm py-2.5'
                    >
                      Sign in
                    </Link>
                    <Link
                      to='/register'
                      className='btn-outline flex-1 text-center text-sm py-2.5'
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4'
            onClick={() => setSearchOpen(false)}
          >
            <motion.form
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              onSubmit={handleSearch}
              onClick={(e) => e.stopPropagation()}
              className='w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden'
            >
              <div className='flex items-center px-5 py-4 gap-3'>
                <Search size={20} className='text-[#a8a39a] flex-shrink-0' />
                <input
                  ref={searchRef}
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search for products, brands, categories...'
                  className='flex-1 text-base text-[#0a0a0a] outline-none bg-transparent placeholder-[#a8a39a]'
                />
                <button type='button' onClick={() => setSearchOpen(false)}>
                  <X
                    size={18}
                    className='text-[#a8a39a] hover:text-[#0a0a0a] transition-colors'
                  />
                </button>
              </div>
              <div className='px-5 pb-4 flex gap-2 flex-wrap'>
                {['Smartphones', 'Laptops', 'Skincare', 'Shoes'].map((s) => (
                  <button
                    key={s}
                    type='button'
                    onClick={() => {
                      setSearchQuery(s);
                      navigate(`/shop?search=${s}`);
                      setSearchOpen(false);
                    }}
                    className='text-xs bg-[#f0ede7] text-[#5a5550] px-3 py-1.5 rounded-full hover:bg-[#e4dfd6] transition-colors'
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
