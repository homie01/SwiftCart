import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore, useAuthStore } from '../../store';
import toast from 'react-hot-toast';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to checkout');
      closeCart();
      navigate('/login');
      return;
    }
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-[#faf8f5] z-[80] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e4dfd6]">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-[#0a0a0a]" />
                <h2 className="font-semibold text-[#0a0a0a] text-base">
                  Cart
                  {count > 0 && (
                    <span className="ml-2 text-xs font-medium text-[#a8a39a]">({count} items)</span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f0ede7] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-[#f0ede7] flex items-center justify-center">
                    <ShoppingBag size={32} className="text-[#ccc8c0]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0a0a0a]">Your cart is empty</p>
                    <p className="text-sm text-[#a8a39a] mt-1">Add some products to get started</p>
                  </div>
                  <button onClick={() => { closeCart(); navigate('/shop'); }} className="btn-dark text-sm">
                    Browse Products
                  </button>
                </div>
              ) : (
                items.map(({ product, quantity }) => (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-3 bg-white rounded-2xl p-3"
                  >
                    <div className="w-18 h-18 rounded-xl overflow-hidden bg-[#f0ede7] flex-shrink-0 w-[72px] h-[72px]">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://placehold.co/72x72?text=img'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0a0a0a] line-clamp-1 leading-snug">{product.title}</p>
                      <p className="text-xs text-[#a8a39a] mt-0.5 capitalize">{product.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-[#0a0a0a] text-sm">${(product.price * quantity).toFixed(2)}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(product._id, quantity - 1)}
                            className="w-6 h-6 rounded-full bg-[#f0ede7] hover:bg-[#e4dfd6] flex items-center justify-center transition-colors"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="text-sm font-semibold w-4 text-center">{quantity}</span>
                          <button
                            onClick={() => updateQty(product._id, quantity + 1)}
                            className="w-6 h-6 rounded-full bg-[#f0ede7] hover:bg-[#e4dfd6] flex items-center justify-center transition-colors"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(product._id)}
                      className="self-start p-1 text-[#ccc8c0] hover:text-red-400 transition-colors mt-0.5"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[#e4dfd6] px-6 py-5 space-y-4 bg-white">
                <div className="flex justify-between items-center">
                  <span className="text-[#5a5550] text-sm">Subtotal</span>
                  <span className="font-bold text-xl text-[#0a0a0a]">${total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-[#a8a39a] text-center">Shipping calculated at checkout</p>
                <button onClick={handleCheckout} className="btn-dark w-full flex items-center justify-center gap-2 py-4">
                  Checkout <ArrowRight size={16} />
                </button>
                <button onClick={closeCart} className="btn-ghost w-full text-center text-sm">
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
