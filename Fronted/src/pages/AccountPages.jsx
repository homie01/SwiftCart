import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, User, Settings, LogOut, ChevronRight, ArrowLeft, Home, Plus, Trash2, Loader2, Eye, EyeOff, Check } from 'lucide-react';
import { useAuthStore } from '../store';
import { ordersAPI, usersAPI } from '../api';
import { PageLoader, EmptyState } from '../components/ui';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

// ── Layout ──────────────────────────────────────────────────────────────────
export function AccountLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const links = [
    { to: '/account/orders', icon: Package, label: 'My Orders' },
    { to: '/account/profile', icon: User, label: 'Profile' },
    { to: '/account/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="bg-[#f0ede7] border-b border-[#e4dfd6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0a0a0a] flex items-center justify-center text-[#d4a853] font-display font-bold text-xl">
              {user?.firstname?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-[#0a0a0a]">{user?.firstname} {user?.lastname}</h1>
              <p className="text-[#a8a39a] text-sm">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#f0ede7]">
              {links.map(({ to, icon: Icon, label }) => (
                <NavLink key={to} to={to}
                  className={({ isActive }) => clsx(
                    'flex items-center justify-between px-5 py-4 text-sm font-medium border-b border-[#f0ede7] last:border-0 transition-colors',
                    isActive ? 'bg-[#0a0a0a] text-white' : 'text-[#5a5550] hover:bg-[#faf8f5] hover:text-[#0a0a0a]'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} /> {label}
                  </div>
                  <ChevronRight size={14} />
                </NavLink>
              ))}
              <button
                onClick={() => { logout(); navigate('/'); toast.success('Signed out!'); }}
                className="w-full flex items-center gap-3 px-5 py-4 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </nav>
            <Link to="/" className="flex items-center gap-2 mt-4 text-sm text-[#a8a39a] hover:text-[#0a0a0a] transition-colors">
              <Home size={14} /> Back to store
            </Link>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Orders ──────────────────────────────────────────────────────────────────
export function OrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!user?._id) return setLoading(false);
    ordersAPI.getUserOrders(user._id)
      .then(({ data }) => setOrders(data.data || []))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, [user]);

  const statusColor = {
    CONFIRMED: 'bg-emerald-100 text-emerald-700',
    DRAFT: 'bg-amber-100 text-amber-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl text-[#0a0a0a]">My Orders</h2>
      {orders.length === 0 ? (
        <EmptyState icon={Package} title="No orders yet"
          description="When you place orders they'll appear here."
          action={<Link to="/shop" className="btn-dark text-sm">Start Shopping</Link>} />
      ) : orders.map((order, i) => (
        <motion.div key={order._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#f0ede7]">
          <div
            className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#faf8f5] transition-colors"
            onClick={() => setExpanded(expanded === order._id ? null : order._id)}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#f0ede7] rounded-xl flex items-center justify-center">
                <Package size={16} className="text-[#d4a853]" />
              </div>
              <div>
                <p className="font-semibold text-[#0a0a0a] text-sm">Order #{order._id?.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-[#a8a39a]">{order.totalItems} item{order.totalItems !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[order.status] || 'bg-[#f0ede7] text-[#5a5550]'}`}>
                {order.status}
              </span>
              <span className="font-bold text-[#0a0a0a] hidden sm:block">${order.totalAmount?.toFixed(2)}</span>
              <ChevronRight size={16} className={`text-[#a8a39a] transition-transform ${expanded === order._id ? 'rotate-90' : ''}`} />
            </div>
          </div>

          {expanded === order._id && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              className="border-t border-[#f0ede7] px-5 py-4 bg-[#faf8f5] space-y-2">
              <p className="text-xs font-semibold text-[#a8a39a] uppercase tracking-wider mb-3">Order Items</p>
              {order.orderItems?.map((item, j) => (
                <div key={j} className="flex justify-between text-sm bg-white rounded-xl px-4 py-3">
                  <span className="text-[#5a5550] font-mono text-xs">{item.productId?.slice(-12)}</span>
                  <span className="text-[#a8a39a]">×{item.quantity}</span>
                  <span className="font-semibold text-[#0a0a0a]">${item.price?.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-2 border-t border-[#e4dfd6]">
                <span className="text-[#5a5550]">Total</span>
                <span className="text-[#d4a853] text-lg">${order.totalAmount?.toFixed(2)}</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ── Profile ─────────────────────────────────────────────────────────────────
export function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({ firstname: user?.firstname || '', lastname: user?.lastname || '', contact: user?.contact || '' });
  const [loading, setLoading] = useState(false);
  const [addrModal, setAddrModal] = useState(false);
  const [addrForm, setAddrForm] = useState({ street: '', city: '', state: '', country: '', pincode: '', type: 'home' });
  const [addrLoading, setAddrLoading] = useState(false);
  const [addresses, setAddresses] = useState(user?.address || []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await usersAPI.update(user._id, form);
      updateUser(data.data);
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
    finally { setLoading(false); }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!addrForm.street || !addrForm.city) return toast.error('Street and city required');
    setAddrLoading(true);
    try {
      const { data } = await usersAPI.updateAddress(user._id, { ...addrForm, pincode: Number(addrForm.pincode) });
      updateUser(data.data);
      setAddresses(data.data.address || []);
      setAddrModal(false);
      setAddrForm({ street: '', city: '', state: '', country: '', pincode: '', type: 'home' });
      toast.success('Address saved!');
    } catch { toast.error('Failed to add address'); }
    finally { setAddrLoading(false); }
  };

  const handleDeleteAddr = async (addrId) => {
    try {
      const { data } = await usersAPI.deleteAddress(user._id, addrId);
      updateUser(data.data);
      setAddresses(data.data.address || []);
      toast.success('Address removed');
    } catch { toast.error('Failed to remove'); }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-[#0a0a0a]">Profile</h2>

      <form onSubmit={handleUpdate} className="bg-white rounded-2xl p-6 space-y-4 shadow-sm border border-[#f0ede7]">
        <h3 className="font-semibold text-[#0a0a0a] text-sm mb-2">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#3d3a36] mb-1.5">First name</label>
            <input value={form.firstname} onChange={e => setForm({ ...form, firstname: e.target.value })} className="input-field text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#3d3a36] mb-1.5">Last name</label>
            <input value={form.lastname} onChange={e => setForm({ ...form, lastname: e.target.value })} className="input-field text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#3d3a36] mb-1.5">Email</label>
          <input value={user?.email} disabled className="input-field text-sm opacity-50 cursor-not-allowed" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#3d3a36] mb-1.5">Phone</label>
          <input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="+1 234 567 8900" className="input-field text-sm" />
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="btn-dark text-sm flex items-center gap-2">
            {loading && <Loader2 size={14} className="animate-spin" />} Save Changes
          </button>
        </div>
      </form>

      {/* Addresses */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0ede7]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#0a0a0a] text-sm">Saved Addresses</h3>
          <button onClick={() => setAddrModal(true)} className="btn-outline text-xs px-4 py-2 flex items-center gap-1">
            <Plus size={12} /> Add
          </button>
        </div>
        {addresses.length === 0
          ? <p className="text-sm text-[#a8a39a] text-center py-4">No addresses saved yet.</p>
          : addresses.map(addr => (
            <div key={addr._id} className="flex items-start gap-3 p-3 bg-[#faf8f5] rounded-xl mb-2">
              <div className="w-8 h-8 bg-[#f0ede7] rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                {addr.type === 'home' ? '🏠' : '💼'}
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#0a0a0a] capitalize">{addr.type}</p>
                <p className="text-xs text-[#a8a39a] mt-0.5">{[addr.street, addr.city, addr.state, addr.country, addr.pincode].filter(Boolean).join(', ')}</p>
              </div>
              <button onClick={() => handleDeleteAddr(addr._id)} className="text-[#ccc8c0] hover:text-red-400 transition-colors p-1">
                <Trash2 size={13} />
              </button>
            </div>
          ))
        }

        {addrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="font-semibold text-[#0a0a0a] mb-4">Add New Address</h3>
              <form onSubmit={handleAddAddress} className="space-y-3">
                <select value={addrForm.type} onChange={e => setAddrForm({ ...addrForm, type: e.target.value })} className="input-field text-sm">
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                </select>
                {[['street', 'Street *'], ['city', 'City *'], ['state', 'State'], ['country', 'Country'], ['pincode', 'Pincode']].map(([f, l]) => (
                  <input key={f} value={addrForm[f]} onChange={e => setAddrForm({ ...addrForm, [f]: e.target.value })} placeholder={l} className="input-field text-sm" />
                ))}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setAddrModal(false)} className="btn-outline flex-1 text-sm">Cancel</button>
                  <button type="submit" disabled={addrLoading} className="btn-dark flex-1 text-sm flex items-center justify-center gap-2">
                    {addrLoading && <Loader2 size={13} className="animate-spin" />} Save
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Settings ─────────────────────────────────────────────────────────────────
export function SettingsPage() {
  const { user } = useAuthStore();
  const [pass, setPass] = useState({ old: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handlePassChange = async (e) => {
    e.preventDefault();
    if (pass.new !== pass.confirm) return toast.error("Passwords don't match");
    if (pass.new.length < 6) return toast.error('Min 6 characters');
    setLoading(true);
    try {
      await usersAPI.updatePassword(user._id, { old: pass.old, new: pass.new });
      toast.success('Password updated!');
      setPass({ old: '', new: '', confirm: '' });
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-[#0a0a0a]">Settings</h2>
      <form onSubmit={handlePassChange} className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0ede7] space-y-4">
        <h3 className="font-semibold text-[#0a0a0a] text-sm">Change Password</h3>
        {[['old', 'Current Password'], ['new', 'New Password'], ['confirm', 'Confirm New Password']].map(([f, l]) => (
          <div key={f}>
            <label className="block text-xs font-semibold text-[#3d3a36] mb-1.5">{l}</label>
            <div className="relative">
              <input type={show ? 'text' : 'password'} value={pass[f]}
                onChange={e => setPass({ ...pass, [f]: e.target.value })} placeholder="••••••••" className="input-field text-sm pr-12" />
              {f === 'old' && (
                <button type="button" onClick={() => setShow(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a8a39a]">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              )}
            </div>
          </div>
        ))}
        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="btn-dark text-sm flex items-center gap-2">
            {loading && <Loader2 size={14} className="animate-spin" />} Update Password
          </button>
        </div>
      </form>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0ede7]">
        <h3 className="font-semibold text-[#0a0a0a] text-sm mb-4">Account Details</h3>
        {[['Account ID', user?._id?.slice(-12)], ['Email', user?.email], ['Role', user?.role], ['Member since', 'N/A']].map(([l, v]) => (
          <div key={l} className="flex justify-between py-2.5 border-b border-[#f0ede7] last:border-0 text-sm">
            <span className="text-[#a8a39a]">{l}</span>
            <span className="font-medium text-[#0a0a0a] capitalize font-mono text-xs">{v || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
