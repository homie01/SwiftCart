import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        <motion.div
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="font-display text-[160px] md:text-[220px] font-bold leading-none select-none"
          style={{ color: '#f0ede7' }}
        >
          404
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="-mt-12 relative z-10"
        >
          <h1 className="font-display text-3xl font-bold text-[#0a0a0a] mb-3">
            Page Not Found
          </h1>
          <p className="text-[#a8a39a] mb-8 max-w-sm mx-auto">
            Looks like this page went out of stock. Let's get you back to shopping.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/" className="btn-dark flex items-center gap-2">
              <Home size={16} /> Go Home
            </Link>
            <Link to="/shop" className="btn-outline flex items-center gap-2">
              <Search size={16} /> Browse Shop
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
