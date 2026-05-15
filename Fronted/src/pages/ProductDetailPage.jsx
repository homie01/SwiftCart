import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Heart, Star, Truck, Shield, RotateCcw,
  ChevronLeft, ChevronRight, Minus, Plus, Check, Share2,
  Package, ArrowLeft
} from 'lucide-react';
import { productsAPI } from '../api';
import { useCartStore, useWishlistStore, useAuthStore } from '../store';
import { PageLoader, Breadcrumb, ProductSkeleton } from '../components/ui';
import ProductCard from '../components/product/ProductCard';
import { StarRating } from '../components/product/ProductCard';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, openCart } = useCartStore();
  const { toggle: toggleWish, has } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setImgIdx(0);
    setQty(1);
    setAdded(false);
    productsAPI.getById(id)
      .then(({ data }) => {
        setProduct(data.data);
        // Fetch related
        return productsAPI.getAll();
      })
      .then(({ data }) => {
        const all = data.data || [];
        const rel = all.filter(p => p._id !== id && p.category === data.data?.category).slice(0, 4);
        setRelated(rel.length ? rel : all.filter(p => p._id !== id).slice(0, 4));
      })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Package size={48} className="text-[#ccc8c0] mx-auto mb-4" />
        <h2 className="font-semibold text-[#0a0a0a] mb-2">Product not found</h2>
        <Link to="/shop" className="btn-dark text-sm">Back to Shop</Link>
      </div>
    </div>
  );

  const images = product.images?.length ? product.images : [product.thumbnail].filter(Boolean);
  const discountedPrice = product.discountPercentage
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : null;
  const isWished = has(product._id);

  const handleAddToCart = () => {
    addItem(product, qty);
    openCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    toast.success('Added to cart! 🛍️');
  };

  const handleWishlist = () => {
    toggleWish(product);
    toast(isWished ? 'Removed from wishlist' : '❤️ Added to wishlist');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <Breadcrumb items={[
          { label: 'Home', to: '/' },
          { label: 'Shop', to: '/shop' },
          { label: product.category, to: `/shop?category=${product.category}` },
          { label: product.title },
        ]} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          {/* Images */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-square bg-[#f0ede7] rounded-3xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={imgIdx}
                  src={images[imgIdx]}
                  alt={product.title}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                  onError={e => e.target.src = 'https://placehold.co/600x600?text=No+Image'}
                />
              </AnimatePresence>

              {product.discountPercentage > 0 && (
                <div className="absolute top-4 left-4">
                  <span className="badge-sale text-sm">-{Math.round(product.discountPercentage)}% OFF</span>
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setImgIdx(i => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={clsx(
                      'w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all',
                      i === imgIdx ? 'border-[#0a0a0a] opacity-100' : 'border-transparent opacity-60 hover:opacity-80'
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover"
                      onError={e => e.target.src = 'https://placehold.co/64x64?text=img'} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#d4a853] uppercase mb-2">
                {product.brand || product.category}
              </p>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-[#0a0a0a] leading-tight mb-3">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <StarRating rating={product.rating} size={14} />
                <span className="text-sm text-[#5a5550]">
                  {product.rating?.toFixed(1)} ({product.reviews?.length || 0} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              {discountedPrice ? (
                <>
                  <span className="font-display text-4xl font-bold text-[#0a0a0a]">${discountedPrice}</span>
                  <span className="text-xl text-[#a8a39a] line-through">${product.price}</span>
                  <span className="badge-sale text-sm">Save ${(product.price - discountedPrice).toFixed(2)}</span>
                </>
              ) : (
                <span className="font-display text-4xl font-bold text-[#0a0a0a]">${product.price}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-[#5a5550] text-sm leading-relaxed">{product.description}</p>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={clsx('w-2 h-2 rounded-full', product.stock > 0 ? 'bg-emerald-500' : 'bg-red-400')} />
              <span className="text-sm font-medium text-[#5a5550]">
                {product.stock > 0
                  ? product.stock <= 10 ? `Only ${product.stock} left in stock` : 'In Stock'
                  : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-[#0a0a0a]">Quantity</span>
              <div className="flex items-center border border-[#e4dfd6] rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#5a5550] hover:bg-[#f0ede7] transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center font-semibold text-[#0a0a0a] text-sm">{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(product.stock || 99, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#5a5550] hover:bg-[#f0ede7] transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-xs text-[#a8a39a]">Max {product.stock || 99}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                whileTap={{ scale: 0.97 }}
                className={clsx(
                  'flex-1 py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300',
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#0a0a0a] hover:bg-[#2a2825] text-white',
                  product.stock === 0 && 'opacity-50 cursor-not-allowed'
                )}
              >
                {added ? <><Check size={16} /> Added!</> : <><ShoppingBag size={16} /> Add to Cart — ${discountedPrice || product.price}</>}
              </motion.button>
              <button
                onClick={handleWishlist}
                className={clsx(
                  'w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all',
                  isWished
                    ? 'border-red-400 bg-red-50 text-red-500'
                    : 'border-[#e4dfd6] text-[#a8a39a] hover:border-[#0a0a0a] hover:text-[#0a0a0a]'
                )}
              >
                <Heart size={18} className={isWished ? 'fill-red-500' : ''} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Truck, text: 'Free Delivery', sub: 'Orders over $99' },
                { icon: Shield, text: 'Secure Payment', sub: 'SSL encrypted' },
                { icon: RotateCcw, text: 'Easy Returns', sub: '30-day policy' },
              ].map(({ icon: Icon, text, sub }) => (
                <div key={text} className="flex flex-col items-center text-center bg-[#f0ede7] rounded-xl p-3 gap-1.5">
                  <Icon size={16} className="text-[#d4a853]" />
                  <span className="text-xs font-semibold text-[#0a0a0a]">{text}</span>
                  <span className="text-[10px] text-[#a8a39a]">{sub}</span>
                </div>
              ))}
            </div>

            {/* Meta */}
            <div className="border-t border-[#e4dfd6] pt-5 space-y-2 text-sm">
              {product.sku && <div className="flex gap-3"><span className="text-[#a8a39a] w-20">SKU</span><span className="font-mono text-[#5a5550]">{product.sku}</span></div>}
              {product.category && <div className="flex gap-3"><span className="text-[#a8a39a] w-20">Category</span><Link to={`/shop?category=${product.category}`} className="capitalize text-[#d4a853] hover:text-[#b8903e] transition-colors">{product.category.replace(/-/g, ' ')}</Link></div>}
              {product.tags?.length > 0 && (
                <div className="flex gap-3">
                  <span className="text-[#a8a39a] w-20">Tags</span>
                  <div className="flex flex-wrap gap-1">
                    {product.tags.map(t => (
                      <span key={t} className="text-xs bg-[#f0ede7] text-[#5a5550] px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              )}
              {product.warrantyInformation && <div className="flex gap-3"><span className="text-[#a8a39a] w-20">Warranty</span><span className="text-[#5a5550]">{product.warrantyInformation}</span></div>}
              {product.returnPolicy && <div className="flex gap-3"><span className="text-[#a8a39a] w-20">Returns</span><span className="text-[#5a5550]">{product.returnPolicy}</span></div>}
            </div>
          </div>
        </div>

        {/* Reviews */}
        {product.reviews?.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl text-[#0a0a0a] mb-6">
              Customer Reviews <span className="text-[#a8a39a] text-lg font-normal">({product.reviews.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.reviews.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#0a0a0a] flex items-center justify-center text-[#d4a853] font-bold text-sm">
                        {r.reviewerName?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-[#0a0a0a] text-sm">{r.reviewerName}</p>
                        <p className="text-xs text-[#a8a39a]">{new Date(r.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <StarRating rating={r.rating} size={12} />
                  </div>
                  <p className="text-sm text-[#5a5550] leading-relaxed">{r.comment}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl text-[#0a0a0a] mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
