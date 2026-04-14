import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatRating } from '../utils/format';

export default function HomePage() {
  const { products, categories, catalogStatus, addToCart, cartSummary } = useStore();

  const featuredProducts = [...products]
    .sort(
      (a, b) =>
        (b.rating || 0) +
        (b.discountPercentage || 0) -
        ((a.rating || 0) + (a.discountPercentage || 0))
    )
    .slice(0, 4);

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="hero-copy-block">
          <span className="section-kicker">SwiftCart Ecommerce</span>
          <h1>Clean, modern shopping frontend connected to your backend.</h1>
          <p>
            Browse products, manage your cart, login, update profile, place
            orders, and review past purchases in one clean React experience.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="primary-button">
              Shop products
            </Link>
            <Link to="/orders" className="ghost-button">
              My orders
            </Link>
          </div>
        </div>

        <div className="hero-stats">
          <div className="glass-card">
            <span>Products live</span>
            <strong>{products.length}</strong>
          </div>
          <div className="glass-card">
            <span>Categories</span>
            <strong>{categories.length}</strong>
          </div>
          <div className="glass-card">
            <span>Cart value</span>
            <strong>{formatCurrency(cartSummary.grandTotal)}</strong>
          </div>
          <div className="glass-card accent-card">
            <span>Top rating</span>
            <strong>{formatRating(featuredProducts[0]?.rating)}</strong>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-header">
          <div>
            <span className="section-kicker">Explore</span>
            <h2>Shop by category</h2>
          </div>
          <Link to="/products" className="text-link">
            See all products
          </Link>
        </div>

        <div className="category-grid">
          {categories.slice(0, 4).map((category) => (
            <Link
              key={category._id || category.slug}
              className="category-card"
              to={`/products?category=${encodeURIComponent(category.name)}`}
            >
              <span>{category.slug || 'category'}</span>
              <strong>{category.name}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="section-header">
          <div>
            <span className="section-kicker">Highlights</span>
            <h2>Featured products</h2>
          </div>
        </div>

        {catalogStatus.loading ? (
          <div className="placeholder-grid">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="placeholder-card" key={index} />
            ))}
          </div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map((product) => (
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
