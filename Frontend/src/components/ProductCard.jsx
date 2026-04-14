import { Link } from 'react-router-dom';
import {
  formatCurrency,
  formatRating,
  getDiscountedPrice,
  getProductImage,
} from '../utils/format';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <article className="product-tile">
      <div className="product-media">
        <img src={getProductImage(product)} alt={product.title} />
      </div>

      <div className="product-meta">
        <div className="product-meta-row">
          <span className="capsule-text">{product.category || 'Catalog'}</span>
          <span className="muted-text">{formatRating(product.rating)}</span>
        </div>

        <h3>{product.title}</h3>
        <p>{product.description || 'No description available for this product.'}</p>
      </div>

      <div className="product-actions">
        <div>
          <strong>{formatCurrency(getDiscountedPrice(product))}</strong>
          <span>{product.discountPercentage || 0}% off</span>
        </div>

        <div className="tile-buttons">
          <Link to="/cart" className="ghost-button">
            View cart
          </Link>
          <button
            type="button"
            className="primary-button"
            onClick={() => onAddToCart(product)}
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
