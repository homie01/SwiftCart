import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Search,
  Grid2X2,
  LayoutList,
} from 'lucide-react';
import { productsAPI } from '../api';
import ProductCard from '../components/product/ProductCard';
import { ProductSkeleton, EmptyState } from '../components/ui';
import { clsx } from 'clsx';

const CATEGORIES = [
  'smartphones',
  'laptops',
  'fragrances',
  'skincare',
  'groceries',
  'home-decoration',
  'furniture',
  'tops',
  'womens-dresses',
  'womens-shoes',
  'mens-shirts',
  'mens-shoes',
  'mens-watches',
  'womens-watches',
  'womens-bags',
  'womens-jewellery',
  'sunglasses',
  'automotive',
  'motorcycle',
  'lighting',
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'discount', label: 'Best Deals' },
  { value: 'name', label: 'Name A–Z' },
];

const PER_PAGE = 16;

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);

  // Filter state from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'default');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    productsAPI
      .getAll()
      .then(({ data }) => setAllProducts(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Sync URL params → local state
  useEffect(() => {
    const q = searchParams.get('search') || '';
    const cat = searchParams.get('category') || '';
    const s = searchParams.get('sort') || 'default';
    setSearch(q);
    setCategory(cat);
    setSort(s);
    setPage(1);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (search)
      list = list.filter((p) =>
        `${p.title} ${p.brand} ${p.category} ${p.description}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
    if (category) list = list.filter((p) => p.category === category);
    list = list.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );
    if (minRating > 0) list = list.filter((p) => (p.rating || 0) >= minRating);
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'discount':
        list.sort(
          (a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0),
        );
        break;
      case 'name':
        list.sort((a, b) => a.title?.localeCompare(b.title));
        break;
    }
    return list;
  }, [allProducts, search, category, sort, priceRange, minRating]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const applyFilter = (key, val) => {
    const params = new URLSearchParams(searchParams);
    if (val) params.set(key, val);
    else params.delete(key);
    setSearchParams(params);
    setPage(1);
  };

  const clearAll = () => {
    setSearchParams({});
    setPriceRange([0, 2000]);
    setMinRating(0);
    setPage(1);
  };

  const activeFilters = [
    search && { key: 'search', label: `"${search}"` },
    category && { key: 'category', label: category.replace(/-/g, ' ') },
    sort !== 'default' && {
      key: 'sort',
      label: SORT_OPTIONS.find((o) => o.value === sort)?.label,
    },
  ].filter(Boolean);

  return (
    <div className='min-h-screen bg-[#faf8f5]'>
      {/* Page Header */}
      <div className='bg-[#f0ede7] border-b border-[#e4dfd6]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <p className='section-label mb-1'>SwiftCart</p>
          <h1 className='font-display text-3xl md:text-4xl text-[#0a0a0a]'>
            {category
              ? category.replace(/-/g, ' ')
              : search
                ? `Results for "${search}"`
                : 'All Products'}
          </h1>
          <p className='text-[#a8a39a] text-sm mt-1'>
            {loading ? '...' : `${filtered.length} products`}
          </p>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Toolbar */}
        <div className='flex flex-col sm:flex-row gap-3 mb-6'>
          {/* Search */}
          <div className='relative flex-1'>
            <Search
              size={15}
              className='absolute left-4 top-1/2 -translate-y-1/2 text-[#a8a39a]'
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                applyFilter('search', e.target.value);
              }}
              placeholder='Search products...'
              className='input-field pl-10 text-sm'
            />
          </div>

          {/* Sort */}
          <div className='relative'>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                applyFilter('sort', e.target.value);
              }}
              className='input-field pr-10 text-sm appearance-none w-full sm:w-52 cursor-pointer'
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-[#a8a39a] pointer-events-none'
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={clsx(
              'flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all border',
              filtersOpen
                ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]'
                : 'bg-white text-[#5a5550] border-[#e4dfd6] hover:border-[#0a0a0a]',
            )}
          >
            <SlidersHorizontal size={15} /> Filters
          </button>

          {/* View toggle */}
          <div className='flex rounded-xl overflow-hidden border border-[#e4dfd6] bg-white'>
            <button
              onClick={() => setView('grid')}
              className={clsx(
                'px-3 py-2.5 transition-colors',
                view === 'grid'
                  ? 'bg-[#0a0a0a] text-white'
                  : 'text-[#a8a39a] hover:text-[#0a0a0a]',
              )}
            >
              <Grid2X2 size={15} />
            </button>
            <button
              onClick={() => setView('list')}
              className={clsx(
                'px-3 py-2.5 transition-colors',
                view === 'list'
                  ? 'bg-[#0a0a0a] text-white'
                  : 'text-[#a8a39a] hover:text-[#0a0a0a]',
              )}
            >
              <LayoutList size={15} />
            </button>
          </div>
        </div>

        {/* Active Filters */}
        <AnimatePresence>
          {activeFilters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className='flex flex-wrap gap-2 mb-5'
            >
              {activeFilters.map((f) => (
                <span
                  key={f.key}
                  className='flex items-center gap-1.5 bg-[#0a0a0a] text-white text-xs px-3 py-1.5 rounded-full font-medium capitalize'
                >
                  {f.label}
                  <button
                    onClick={() => applyFilter(f.key, '')}
                    className='hover:text-[#d4a853] transition-colors'
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
              <button
                onClick={clearAll}
                className='text-xs text-[#a8a39a] hover:text-[#0a0a0a] transition-colors underline underline-offset-2'
              >
                Clear all
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className='flex gap-6'>
          {/* Sidebar Filters */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.aside
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 256 }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                className='flex-shrink-0 overflow-hidden'
              >
                <div className='w-64 space-y-6'>
                  {/* Categories */}
                  <div className='bg-white rounded-2xl p-5'>
                    <h3 className='font-semibold text-[#0a0a0a] text-sm mb-4'>
                      Category
                    </h3>
                    <div className='space-y-1 max-h-72 overflow-y-auto pr-1'>
                      <button
                        onClick={() => applyFilter('category', '')}
                        className={clsx(
                          'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors capitalize',
                          !category
                            ? 'bg-[#0a0a0a] text-white font-medium'
                            : 'text-[#5a5550] hover:bg-[#f0ede7]',
                        )}
                      >
                        All Categories
                      </button>
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => applyFilter('category', cat)}
                          className={clsx(
                            'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors capitalize',
                            category === cat
                              ? 'bg-[#0a0a0a] text-white font-medium'
                              : 'text-[#5a5550] hover:bg-[#f0ede7]',
                          )}
                        >
                          {cat.replace(/-/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className='bg-white rounded-2xl p-5'>
                    <h3 className='font-semibold text-[#0a0a0a] text-sm mb-4'>
                      Price Range
                    </h3>
                    <div className='space-y-3'>
                      <div className='flex items-center gap-2'>
                        <input
                          type='number'
                          value={priceRange[0]}
                          onChange={(e) =>
                            setPriceRange([+e.target.value, priceRange[1]])
                          }
                          className='input-field text-xs text-center'
                          placeholder='Min'
                        />
                        <span className='text-[#a8a39a] text-sm flex-shrink-0'>
                          –
                        </span>
                        <input
                          type='number'
                          value={priceRange[1]}
                          onChange={(e) =>
                            setPriceRange([priceRange[0], +e.target.value])
                          }
                          className='input-field text-xs text-center'
                          placeholder='Max'
                        />
                      </div>
                      <p className='text-xs text-[#a8a39a] text-center'>
                        ${priceRange[0]} – ${priceRange[1]}
                      </p>
                    </div>
                  </div>

                  {/* Min Rating */}
                  <div className='bg-white rounded-2xl p-5'>
                    <h3 className='font-semibold text-[#0a0a0a] text-sm mb-4'>
                      Minimum Rating
                    </h3>
                    <div className='space-y-1'>
                      {[0, 3, 4, 4.5].map((r) => (
                        <button
                          key={r}
                          onClick={() => setMinRating(r)}
                          className={clsx(
                            'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2',
                            minRating === r
                              ? 'bg-[#0a0a0a] text-white font-medium'
                              : 'text-[#5a5550] hover:bg-[#f0ede7]',
                          )}
                        >
                          {r === 0 ? (
                            'Any rating'
                          ) : (
                            <>
                              <span>
                                {'★'.repeat(Math.ceil(r))}
                                {'☆'.repeat(5 - Math.ceil(r))}
                              </span>
                              <span>{r}+</span>
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className='flex-1 min-w-0'>
            {loading ? (
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {Array(PER_PAGE)
                  .fill(0)
                  .map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
              </div>
            ) : paginated.length === 0 ? (
              <EmptyState
                title='No products found'
                description='Try adjusting your filters or search query.'
                action={
                  <button onClick={clearAll} className='btn-dark text-sm'>
                    Clear Filters
                  </button>
                }
              />
            ) : view === 'grid' ? (
              <div
                className={clsx(
                  'grid gap-4',
                  filtersOpen
                    ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
                )}
              >
                <AnimatePresence>
                  {paginated.map((p, i) => (
                    <ProductCard key={p._id} product={p} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              /* List View */
              <div className='space-y-3'>
                {paginated.map((p, i) => {
                  const disc = p.discountPercentage
                    ? p.price * (1 - p.discountPercentage / 100)
                    : null;
                  return (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className='bg-white rounded-2xl flex gap-4 p-4 hover:shadow-md transition-all group'
                    >
                      <div className='w-24 h-24 rounded-xl bg-[#f0ede7] overflow-hidden flex-shrink-0'>
                        <img
                          src={p.thumbnail}
                          alt={p.title}
                          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                          onError={(e) =>
                            (e.target.src =
                              'https://placehold.co/96x96?text=img')
                          }
                        />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-xs text-[#a8a39a] capitalize mb-0.5'>
                          {p.brand || p.category}
                        </p>
                        <h3 className='font-semibold text-[#0a0a0a] text-sm mb-1 line-clamp-2'>
                          {p.title}
                        </h3>
                        <p className='text-xs text-[#a8a39a] line-clamp-2'>
                          {p.description}
                        </p>
                        <div className='flex items-center gap-3 mt-2'>
                          <span className='font-bold text-[#0a0a0a]'>
                            ${disc ? disc.toFixed(2) : p.price}
                          </span>
                          {disc && (
                            <span className='text-xs text-[#a8a39a] line-through'>
                              ${p.price}
                            </span>
                          )}
                          {p.discountPercentage > 0 && (
                            <span className='badge-sale text-[10px]'>
                              -{Math.round(p.discountPercentage)}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className='flex flex-col gap-2 flex-shrink-0 justify-center'>
                        <button
                          onClick={() => {
                            const { addItem, openCart } =
                              useCartStore.getState();
                            addItem(p);
                            openCart();
                          }}
                          className='btn-dark text-xs px-4 py-2'
                        >
                          Add to Cart
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='flex items-center justify-center gap-2 mt-10'>
                <button
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={page === 1}
                  className='btn-outline text-sm px-5 py-2.5 disabled:opacity-40'
                >
                  Previous
                </button>
                <div className='flex gap-1'>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let p = i + 1;
                    if (totalPages > 5) {
                      if (page <= 3) p = i + 1;
                      else if (page >= totalPages - 2) p = totalPages - 4 + i;
                      else p = page - 2 + i;
                    }
                    return (
                      <button
                        key={p}
                        onClick={() => {
                          setPage(p);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={clsx(
                          'w-10 h-10 rounded-full text-sm font-medium transition-all',
                          page === p
                            ? 'bg-[#0a0a0a] text-white'
                            : 'text-[#5a5550] hover:bg-[#f0ede7]',
                        )}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => {
                    setPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={page === totalPages}
                  className='btn-outline text-sm px-5 py-2.5 disabled:opacity-40'
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
