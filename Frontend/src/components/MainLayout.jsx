import { NavLink, Outlet } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? 'nav-link nav-link-active' : 'nav-link'
      }
    >
      {children}
    </NavLink>
  );
}

export default function MainLayout() {
  const { user, logout, cartSummary, feedback, setFeedback } = useStore();

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <header className="site-header">
        <div className="brand-area">
          <span className="brand-label">Modern Commerce</span>
          <NavLink to="/" className="brand-name">
            SwiftCart
          </NavLink>
        </div>

        <nav className="site-nav">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/products">Products</NavItem>
          <NavItem to="/cart">Cart</NavItem>
          {user ? <NavItem to="/orders">My Orders</NavItem> : null}
          {user ? <NavItem to="/profile">Profile</NavItem> : null}
        </nav>

        <div className="header-actions">
          <NavLink to="/cart" className="cart-chip">
            Cart
            <span>{cartSummary.totalItems}</span>
          </NavLink>
          {user ? (
            <button className="ghost-button" type="button" onClick={logout}>
              Logout
            </button>
          ) : (
            <NavLink to="/login" className="primary-button">
              Login
            </NavLink>
          )}
        </div>
      </header>

      {feedback ? (
        <div className="feedback-banner">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback('')}>
            Dismiss
          </button>
        </div>
      ) : null}

      <main className="page-frame">
        <Outlet />
      </main>
    </div>
  );
}
