import { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/format';

export default function OrdersPage() {
  const { orders, fetchOrders } = useStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="page-stack">
      <section className="content-section">
        <div className="section-header">
          <div>
            <span className="section-kicker">Purchases</span>
            <h1>My orders page</h1>
          </div>
        </div>

        {orders.length ? (
          <div className="orders-stack">
            {orders.map((order) => (
              <article className="order-card" key={order._id}>
                <div className="order-head">
                  <div>
                    <span className="capsule-text">Order #{order._id.slice(-6)}</span>
                    <h3>{order.status}</h3>
                  </div>
                  <strong>{formatCurrency(order.totalAmount)}</strong>
                </div>

                <div className="order-meta">
                  <span>{order.totalItems} line items</span>
                  <span>{order.orderItems?.length || 0} products</span>
                </div>

                <div className="order-items">
                  {(order.orderItems || []).map((item, index) => (
                    <div className="summary-line" key={`${item.productId}-${index}`}>
                      <span>Product ID: {item.productId}</span>
                      <strong>
                        {item.quantity} x {formatCurrency(item.price)}
                      </strong>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-panel">
            <h3>No orders yet</h3>
            <p>Your confirmed backend orders will show here.</p>
          </div>
        )}
      </section>
    </div>
  );
}
