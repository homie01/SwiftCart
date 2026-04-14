import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

export default function ProductsPage() {
  const { products, categories, catalogStatus, addToCart } = useStore();
  const location = useLocation();
  const initialCategory =
    new URLSearchParams(location.search).get('category') || 'all';
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const categoryMatch =
        selectedCategory === 'all' ||
        product.category?.toLowerCase() === selectedCategory.toLowerCase();

      const searchMatch =
        !query ||
        product.title?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [products, search, selectedCategory]);

  return (
    <div className="page-stack">
      <section className="content-section">
        <div className="section-header">
          <div>
            <span className="section-kicker">Catalog</span>
            <h1>Product list page</h1>
          </div>
          <div className="results-badge">{filteredProducts.length} results</div>
        </div>

        <div className="filters-row">
          <input
            className="text-input"
            type="text"
            placeholder="Search products, brands, descriptions..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="chip-row">
            <button
              type="button"
              className={selectedCategory === 'all' ? 'filter-chip active' : 'filter-chip'}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category._id || category.slug}
                type="button"
                className={
                  selectedCategory === category.name
                    ? 'filter-chip active'
                    : 'filter-chip'
                }
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {catalogStatus.loading ? (
          <div className="placeholder-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <div className="placeholder-card" key={index} />
            ))}
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
