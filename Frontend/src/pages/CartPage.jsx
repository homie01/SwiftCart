import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import {
  formatCurrency,
  getDiscountedPrice,
  getProductImage,
} from '../utils/format';

export default function CartPage() {
  const { cartProducts, cartSummary, updateCartQuantity, removeFromCart, user } =
    useStore();

  return (
    <div className="split-layout">
      <section className="content-section">
        <div className="section-header">
          <div>
            <span className="section-kicker">Your cart</span>
            <h1>Cart page</h1>
          </div>
        </div>

        {cartProducts.length ? (
          <div className="cart-list-panel">
            {cartProducts.map((item) => (
              <article className="cart-row" key={item._id}>
                <img src={getProductImage(item)} alt={item.title} />

                <div className="cart-row-copy">
                  <h3>{item.title}</h3>
                  <p>{item.brand || item.category}</p>
                  <strong>{formatCurrency(getDiscountedPrice(item))}</strong>
                </div>

                <div className="qty-control">
                  <button
                    type="button"
                    onClick={() =>
                      updateCartQuantity(item._id, item.productCount - 1)
                    }
                  >
                    -
                  </button>
                  <span>{item.productCount}</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateCartQuantity(item._id, item.productCount + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="text-link danger-link"
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-panel">
            <h3>Your cart is empty</h3>
            <p>Add products from the catalog to start your order.</p>
            <Link to="/products" className="primary-button">
              Continue shopping
            </Link>
          </div>
        )}
      </section>

      <aside className="summary-panel">
        <div className="section-kicker">Summary</div>
        <h2>Order overview</h2>
        <div className="summary-line">
          <span>Items</span>
          <strong>{cartSummary.totalItems}</strong>
        </div>
        <div className="summary-line">
          <span>Subtotal</span>
          <strong>{formatCurrency(cartSummary.subtotal)}</strong>
        </div>
        <div className="summary-line">
          <span>Delivery</span>
          <strong>{formatCurrency(cartSummary.delivery)}</strong>
        </div>
        <div className="summary-line total-line">
          <span>Total</span>
          <strong>{formatCurrency(cartSummary.grandTotal)}</strong>
        </div>

        {user ? (
          <Link to="/checkout" className="primary-button wide-button">
            Proceed to checkout
          </Link>
        ) : (
          <Link to="/login" className="primary-button wide-button">
            Login to checkout
          </Link>
        )}
      </aside>
    </div>
  );
}
