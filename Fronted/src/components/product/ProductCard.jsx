import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore, useWishlistStore, useAuthStore } from '../../store';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

function StarRating({ rating = 0, max = 5, size = 11 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(rating) ? 'text-[#d4a853] fill-[#d4a853]' : 'text-[#e4dfd6] fill-[#e4dfd6]'}
        />
      ))}
    </div>
  );
}

export default function ProductCard({ product, index = 0 }) {
  const { addItem, openCart } = useCartStore();
  const { toggle: toggleWish, has } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isWished = has(product._id);
  const discountedPrice = product.discountPercentage
    ? product.price * (1 - product.discountPercentage / 100)
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product, 1);
    openCart();
    toast.success(`${product.title.slice(0, 28)}... added!`, {
      icon: '🛍️',
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWish(product);
    toast(isWished ? 'Removed from wishlist' : 'Added to wishlist ❤️', {
      icon: isWished ? '💔' : '❤️',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={`/product/${product._id}`}>
        <div
          className="product-card"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Image */}
          <div className="relative aspect-square bg-[#f0ede7] overflow-hidden">
            {!imgLoaded && <div className="absolute inset-0 skeleton" />}
            <img
              src={product.thumbnail}
              alt={product.title}
              className={clsx(
                'w-full h-full object-cover transition-transform duration-700',
                hovered ? 'scale-110' : 'scale-100',
                imgLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setImgLoaded(true)}
              onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=No+Image'; setImgLoaded(true); }}
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.discountPercentage > 0 && (
                <span className="badge-sale">-{Math.round(product.discountPercentage)}%</span>
              )}
              {product.stock <= 5 && product.stock > 0 && (
                <span className="badge-new">Low stock</span>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className={clsx(
                'absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm',
                isWished
                  ? 'bg-red-50 text-red-500 opacity-100'
                  : 'bg-white text-[#a8a39a] hover:text-red-400',
                hovered ? 'opacity-100' : 'opacity-0'
              )}
            >
              <Heart size={15} className={isWished ? 'fill-red-500' : ''} />
            </button>

            {/* Quick Actions */}
            <motion.div
              initial={false}
              animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-3 inset-x-3 flex gap-2"
            >
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#0a0a0a] hover:bg-[#2a2825] text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShoppingBag size={13} /> Add to Cart
              </button>
              <Link
                to={`/product/${product._id}`}
                onClick={(e) => e.stopPropagation()}
                className="w-10 bg-white hover:bg-[#f0ede7] text-[#0a0a0a] rounded-xl flex items-center justify-center transition-colors"
              >
                <Eye size={14} />
              </Link>
            </motion.div>
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-xs text-[#a8a39a] capitalize mb-1">{product.brand || product.category}</p>
            <h3 className="text-sm font-semibold text-[#0a0a0a] line-clamp-2 leading-snug mb-2">
              {product.title}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <StarRating rating={product.rating} />
              <span className="text-xs text-[#a8a39a]">({product.reviews?.length || 0})</span>
            </div>
            <div className="flex items-center gap-2">
              {discountedPrice ? (
                <>
                  <span className="font-bold text-[#0a0a0a]">${discountedPrice.toFixed(2)}</span>
                  <span className="text-xs text-[#a8a39a] line-through">${product.price}</span>
                </>
              ) : (
                <span className="font-bold text-[#0a0a0a]">${product.price}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export { StarRating };
