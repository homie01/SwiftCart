import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/format';

const initialAddress = {
  street: '',
  landmark: '',
  area: '',
  city: '',
  state: '',
  country: '',
  pincode: '',
  type: 'home',
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, cartProducts, cartSummary, placeOrder, addAddress } = useStore();
  const [address, setAddress] = useState(initialAddress);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await addAddress(address);
      await placeOrder(address);
      navigate('/orders');
    } catch (submitError) {
      setError(submitError.message || 'Unable to place order.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="split-layout">
      <section className="content-section">
        <div className="section-header">
          <div>
            <span className="section-kicker">Checkout</span>
            <h1>Checkout page</h1>
          </div>
        </div>

        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-grid">
            {Object.entries(address).map(([key, value]) =>
              key === 'type' ? (
                <label className="field" key={key}>
                  <span>Address type</span>
                  <select
                    className="text-input"
                    value={value}
                    onChange={(event) =>
                      setAddress((current) => ({
                        ...current,
                        [key]: event.target.value,
                      }))
                    }
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                  </select>
                </label>
              ) : (
                <label className="field" key={key}>
                  <span>{key}</span>
                  <input
                    className="text-input"
                    type="text"
                    value={value}
                    onChange={(event) =>
                      setAddress((current) => ({
                        ...current,
                        [key]: event.target.value,
                      }))
                    }
                    required={[
                      'street',
                      'city',
                      'state',
                      'country',
                      'pincode',
                    ].includes(key)}
                  />
                </label>
              )
            )}
          </div>

          <div className="checkout-note">
            <strong>Customer</strong>
            <span>{user?.firstname} {user?.lastname} | {user?.email}</span>
          </div>

          {error ? <p className="error-text">{error}</p> : null}

          <button
            className="primary-button wide-button"
            type="submit"
            disabled={submitting || !cartProducts.length}
          >
            {submitting ? 'Placing order...' : 'Place order'}
          </button>
        </form>
      </section>

      <aside className="summary-panel">
        <div className="section-kicker">Checkout summary</div>
        <h2>{cartProducts.length} products</h2>
        {cartProducts.map((item) => (
          <div className="summary-line" key={item._id}>
            <span>
              {item.title} x {item.productCount}
            </span>
            <strong>
              {formatCurrency(
                (item.price - (item.price * (item.discountPercentage || 0)) / 100) *
                  item.productCount
              )}
            </strong>
          </div>
        ))}
        <div className="summary-line total-line">
          <span>Grand total</span>
          <strong>{formatCurrency(cartSummary.grandTotal)}</strong>
        </div>
      </aside>
    </div>
  );
}
