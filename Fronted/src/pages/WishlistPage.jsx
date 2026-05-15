import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlistStore, useCartStore } from '../store';
import { EmptyState } from '../components/ui';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { items, toggle } = useWishlistStore();
  const { addItem, openCart } = useCartStore();
  const navigate = useNavigate();

  const handleMoveToCart = (product) => {
    addItem(product, 1);
    toggle(product);
    openCart();
    toast.success('Moved to cart!');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="bg-[#f0ede7] border-b border-[#e4dfd6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="section-label mb-1">Your</p>
          <h1 className="font-display text-4xl text-[#0a0a0a]">Wishlist</h1>
          <p className="text-[#a8a39a] text-sm mt-1">{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Save products you love and they'll appear here."
            action={<Link to="/shop" className="btn-dark inline-flex items-center gap-2">Browse Products <ArrowRight size={16} /></Link>}
          />
        ) : (
          <>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => { items.forEach(p => addItem(p, 1)); openCart(); toast.success('All items added to cart!'); }}
                className="btn-outline text-sm flex items-center gap-2"
              >
                <ShoppingBag size={15} /> Add All to Cart
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <AnimatePresence>
                {items.map((product, i) => {
                  const disc = product.discountPercentage
                    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
                    : null;

                  return (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, height: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-white rounded-2xl overflow-hidden group"
                    >
                      <Link to={`/product/${product._id}`} className="block relative aspect-square bg-[#f0ede7] overflow-hidden">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={e => e.target.src = 'https://placehold.co/300x300?text=img'}
                        />
                        <button
                          onClick={e => { e.preventDefault(); toggle(product); toast('Removed from wishlist', { icon: '💔' }); }}
                          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={13} />
                        </button>
                      </Link>

                      <div className="p-3">
                        <p className="text-[10px] text-[#a8a39a] capitalize mb-0.5">{product.brand || product.category}</p>
                        <Link to={`/product/${product._id}`}>
                          <h3 className="text-xs font-semibold text-[#0a0a0a] line-clamp-2 leading-snug mb-2 hover:text-[#d4a853] transition-colors">
                            {product.title}
                          </h3>
                        </Link>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-[#0a0a0a] text-sm">${disc || product.price}</span>
                            {disc && <span className="text-xs text-[#a8a39a] line-through ml-1">${product.price}</span>}
                          </div>
                        </div>
                        <button
                          onClick={() => handleMoveToCart(product)}
                          className="w-full mt-2 py-2 bg-[#0a0a0a] hover:bg-[#2a2825] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <ShoppingBag size={11} /> Add to Cart
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
