import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Truck, Shield, RotateCcw, Star } from 'lucide-react';
import { productsAPI } from '../api';
import ProductCard from '../components/product/ProductCard';
import { ProductSkeleton, SectionHeader } from '../components/ui';

const HERO_SLIDES = [
  {
    tag: 'New Arrivals 2025',
    title: 'Discover\nPremium Style',
    sub: 'Curated collections for the discerning buyer. Free shipping on orders over $99.',
    cta: 'Shop Now',
    to: '/shop',
    bg: 'from-[#1a1917] to-[#2a2825]',
    accent: '#d4a853',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
  },
  {
    tag: 'Tech Collection',
    title: 'Future-Ready\nElectronics',
    sub: 'The latest smartphones, laptops, and gadgets. Experience technology at its finest.',
    cta: 'Explore Tech',
    to: '/shop?category=smartphones',
    bg: 'from-[#0f172a] to-[#1e3a5f]',
    accent: '#60a5fa',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
  },
  {
    tag: 'Fashion Forward',
    title: 'Elevate Your\nWardrobe',
    sub: "Premium fashion from the world's best brands. Style that speaks before you do.",
    cta: 'Shop Fashion',
    to: '/shop?category=womens-dresses',
    bg: 'from-[#1a0a0a] to-[#2d1515]',
    accent: '#f87171',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
  },
];

const CATEGORIES = [
  { name: 'Smartphones', slug: 'smartphones', emoji: '📱', color: 'bg-blue-50' },
  { name: 'Laptops', slug: 'laptops', emoji: '💻', color: 'bg-purple-50' },
  { name: 'Fashion', slug: 'womens-dresses', emoji: '👗', color: 'bg-pink-50' },
  { name: 'Skincare', slug: 'skincare', emoji: '✨', color: 'bg-amber-50' },
  { name: 'Home Decor', slug: 'home-decoration', emoji: '🏠', color: 'bg-green-50' },
  { name: 'Watches', slug: 'mens-watches', emoji: '⌚', color: 'bg-slate-50' },
  { name: 'Shoes', slug: 'mens-shoes', emoji: '👟', color: 'bg-red-50' },
  { name: 'Furniture', slug: 'furniture', emoji: '🪑', color: 'bg-orange-50' },
];

const FEATURES = [
  { icon: Truck, title: 'Free Shipping', desc: 'On all orders over $99' },
  { icon: Shield, title: 'Secure Payment', desc: '100% safe & encrypted' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: Star, title: 'Premium Quality', desc: 'Curated products only' },
];

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Auto-slide
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    productsAPI.getAll().then(({ data }) => {
      const all = data.data || [];
      // Highest rated → featured, random → new arrivals
      const sorted = [...all].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      setFeatured(sorted.slice(0, 4));
      setProducts(all.sort(() => Math.random() - 0.5).slice(0, 8));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const current = HERO_SLIDES[slide];

  return (
    <div>
      {/* ── Hero ── */}
      <section ref={heroRef} className="relative h-[92vh] min-h-[600px] overflow-hidden">
        {HERO_SLIDES.map((s, i) => (
          <motion.div
            key={i}
            className={`absolute inset-0 bg-gradient-to-br ${s.bg}`}
            animate={{ opacity: i === slide ? 1 : 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        ))}

        {/* Parallax image */}
        <motion.div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block" style={{ y: heroY, opacity: heroOpacity }}>
          {HERO_SLIDES.map((s, i) => (
            <motion.img
              key={i}
              src={s.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-40"
              animate={{ opacity: i === slide ? 0.4 : 0 }}
              transition={{ duration: 0.8 }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-current to-transparent" />
        </motion.div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <motion.div
            key={slide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold mb-6 tracking-wider uppercase"
              style={{ borderColor: `${current.accent}40`, color: current.accent, background: `${current.accent}15` }}
            >
              <Sparkles size={12} />
              {current.tag}
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 whitespace-pre-line">
              {current.title}
            </h1>
            <p className="text-white/60 text-lg mb-8 leading-relaxed">{current.sub}</p>
            <div className="flex gap-4">
              <Link
                to={current.to}
                className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm transition-all duration-300 active:scale-[0.97]"
                style={{ background: current.accent, color: '#0a0a0a' }}
              >
                {current.cta} <ArrowRight size={16} />
              </Link>
              <Link
                to="/shop"
                className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm border border-white/20 text-white hover:bg-white/10 transition-all duration-300"
              >
                View All
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Slide controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`rounded-full transition-all duration-300 ${i === slide ? 'w-8 h-2 bg-[#d4a853]' : 'w-2 h-2 bg-white/30 hover:bg-white/50'}`}
            />
          ))}
        </div>

        {/* Arrow controls */}
        <button
          onClick={() => setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all backdrop-blur-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setSlide((s) => (s + 1) % HERO_SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all backdrop-blur-sm"
        >
          <ChevronRight size={20} />
        </button>
      </section>

      {/* ── Features Bar ── */}
      <section className="bg-[#0a0a0a] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 py-2"
              >
                <div className="w-9 h-9 rounded-full bg-[#d4a853]/15 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-[#d4a853]" />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold leading-tight">{title}</p>
                  <p className="text-[#5a5550] text-[11px]">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader label="Browse" title="Shop by Category" center />
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {CATEGORIES.map(({ name, slug, emoji, color }, i) => (
            <motion.div
              key={slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/shop?category=${slug}`}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`${color} w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300 shadow-sm group-hover:shadow-md`}>
                  {emoji}
                </div>
                <span className="text-xs font-medium text-[#5a5550] group-hover:text-[#0a0a0a] transition-colors text-center leading-tight">
                  {name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-10 bg-[#f0ede7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <SectionHeader label="Handpicked" title="Top Rated" subtitle="Our highest-rated products, loved by thousands." />
            <Link to="/shop?sort=rating" className="btn-ghost hidden md:flex items-center gap-1 text-sm mb-10">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {loading
              ? Array(4).fill(0).map((_, i) => <ProductSkeleton key={i} />)
              : featured.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)
            }
          </div>
        </div>
      </section>

      {/* ── Promo Banner ── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-gradient-to-r from-[#0a0a0a] to-[#1a1917] rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4a853]/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-20 w-48 h-48 bg-[#d4a853]/5 rounded-full translate-y-1/2 pointer-events-none" />

          <div className="relative">
            <span className="badge-sale text-xs mb-4 inline-block">Limited Time</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
              Up to <span className="text-[#d4a853]">40% Off</span><br />
              on Premium Brands
            </h2>
            <p className="text-white/50 text-sm max-w-sm">
              Don't miss out on our biggest sale of the season. Shop thousands of discounted products now.
            </p>
          </div>
          <Link
            to="/shop?sort=discount"
            className="btn-amber flex items-center gap-2 text-sm whitespace-nowrap flex-shrink-0 relative"
          >
            Shop Sale <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <SectionHeader label="Just In" title="New Arrivals" />
          <Link to="/shop" className="btn-ghost hidden md:flex items-center gap-1 text-sm mb-10">
            See all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {loading
            ? Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)
            : products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)
          }
        </div>
        <div className="text-center mt-10">
          <Link to="/shop" className="btn-outline inline-flex items-center gap-2">
            Browse All Products <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-label text-[#5a5550] mb-3">Testimonials</p>
          <h2 className="font-display text-3xl md:text-4xl text-white mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah M.', review: 'Absolutely love the quality! My order arrived quickly and everything was exactly as described. Will definitely shop again.', rating: 5 },
              { name: 'James K.', review: 'The best online shopping experience I have had. Premium products, fast shipping, and excellent customer service.', rating: 5 },
              { name: 'Priya S.', review: 'Incredible selection and the prices are very competitive. The returns process was seamless too. Highly recommend!', rating: 5 },
            ].map(({ name, review, rating }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#1a1917] rounded-2xl p-6 text-left"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array(rating).fill(0).map((_, j) => (
                    <Star key={j} size={14} className="text-[#d4a853] fill-[#d4a853]" />
                  ))}
                </div>
                <p className="text-[#a8a39a] text-sm leading-relaxed mb-4">"{review}"</p>
                <p className="text-white font-semibold text-sm">{name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
