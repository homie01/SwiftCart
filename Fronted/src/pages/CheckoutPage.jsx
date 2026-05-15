import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Truck, CreditCard, Check, Loader2, ArrowLeft } from 'lucide-react';
import { useCartStore, useAuthStore } from '../store';
import { ordersAPI, paymentsAPI } from '../api';
import toast from 'react-hot-toast';

const STEPS = ['Cart Review', 'Shipping', 'Payment'];
const PENDING_ORDER_KEY = 'sw_pending_order';

const getProductPrice = (product) => {
  const price = Number(product.price) || 0;
  const discount = Number(product.discountPercentage || 0);

  if (!Number.isFinite(discount) || discount <= 0) return price;

  return price * (1 - Math.min(discount, 100) / 100);
};

const readPendingOrder = () => {
  try {
    return JSON.parse(localStorage.getItem(PENDING_ORDER_KEY));
  } catch {
    return null;
  }
};

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentResult = searchParams.get('payment');
  const sessionId = searchParams.get('session_id');
  const hasHandledPaymentReturn = useRef(false);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const [address, setAddress] = useState({
    fullName: user ? `${user.firstname} ${user.lastname}` : '',
    email: user?.email || '',
    phone: user?.contact || '',
    street: '', city: '', state: '', country: '', zip: '',
  });

  const subtotal = items.reduce((s, i) => s + getProductPrice(i.product) * i.quantity, 0);
  const shipping = subtotal >= 99 ? 0 : 9.99;
  const total = subtotal + shipping;

  const buildOrderData = () => ({
    products: items.map(({ product, quantity }) => ({
      _id: product._id,
      productCount: quantity,
      price: getProductPrice(product),
    })),
    totalAmount: total,
    shippingAddress: address,
  });

  const buildCheckoutProducts = () =>
    items.map(({ product, quantity }) => ({
      _id: product._id,
      title: product.title,
      price: product.price,
      discountPercentage: product.discountPercentage || 0,
      thumbnail: product.thumbnail,
      productCount: quantity,
    }));

  useEffect(() => {
    if (!paymentResult || hasHandledPaymentReturn.current) return;
    if (!['success', 'canceled'].includes(paymentResult)) return;

    hasHandledPaymentReturn.current = true;

    if (paymentResult === 'canceled') {
      localStorage.removeItem(PENDING_ORDER_KEY);
      toast.error('Payment canceled.');
      navigate('/checkout', { replace: true });
      return;
    }

    const completePaidOrder = async () => {
      setLoading(true);

      try {
        if (!sessionId) {
          throw new Error('Missing Stripe checkout session.');
        }

        const pendingOrder = readPendingOrder();
        const userId = pendingOrder?.userId || user?._id;

        if (!userId || !pendingOrder?.orderData?.products?.length) {
          throw new Error('Unable to restore the pending order.');
        }

        const { data: session } = await paymentsAPI.getCheckoutSession(sessionId);

        if (session.paymentStatus !== 'paid') {
          throw new Error('Stripe payment was not completed.');
        }

        const expectedAmount = Math.round(
          Number(pendingOrder.orderData.totalAmount) * 100,
        );

        if (session.amountTotal !== expectedAmount) {
          throw new Error('Payment amount did not match the order total.');
        }

        await ordersAPI.placeOrder(userId, pendingOrder.orderData);
        localStorage.removeItem(PENDING_ORDER_KEY);
        clearCart();
        setDone(true);
        toast.success('Payment successful!');
        navigate('/checkout', { replace: true });
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            'Payment completed, but the order could not be saved.',
        );
      } finally {
        setLoading(false);
      }
    };

    completePaidOrder();
  }, [clearCart, navigate, paymentResult, sessionId, user?._id]);

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) { toast.error('Please sign in'); return navigate('/login'); }
    if (!items.length) { toast.error('Your cart is empty'); return; }
    if (!address.fullName || !address.email || !address.street || !address.city || !address.country) {
      toast.error('Please fill required fields');
      setStep(1);
      return;
    }

    setLoading(true);

    try {
      const orderData = buildOrderData();

      localStorage.setItem(
        PENDING_ORDER_KEY,
        JSON.stringify({ userId: user._id, orderData }),
      );

      const { data } = await paymentsAPI.createCheckoutSession({
        cartProducts: buildCheckoutProducts(),
        shippingAmount: shipping,
      });

      if (!data?.url) {
        throw new Error('Payment session did not return a redirect URL.');
      }

      window.location.assign(data.url);
    } catch (error) {
      localStorage.removeItem(PENDING_ORDER_KEY);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Unable to start payment. Please try again.',
      );
      setLoading(false);
    }
  };

  if (loading && paymentResult === 'success') {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-[#d4a853] mx-auto mb-4" />
          <h2 className="font-semibold text-[#0a0a0a] mb-2">Confirming payment</h2>
          <p className="text-sm text-[#a8a39a]">Please wait while we finish your order.</p>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', damping: 15 }}
            className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check size={40} className="text-emerald-600" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold text-[#0a0a0a] mb-2">Order Placed!</h1>
          <p className="text-[#a8a39a] mb-2">Thank you for your purchase, {user?.firstname}!</p>
          <p className="text-sm text-[#5a5550] mb-8">Your order is being processed. You'll receive a confirmation email shortly.</p>
          <div className="flex gap-3">
            <Link to="/account/orders" className="btn-dark flex-1 py-3.5 flex items-center justify-center gap-2 text-sm">
              View Orders
            </Link>
            <Link to="/shop" className="btn-outline flex-1 py-3.5 flex items-center justify-center gap-2 text-sm">
              Keep Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={48} className="text-[#ccc8c0] mx-auto mb-4" />
          <h2 className="font-semibold text-[#0a0a0a] mb-2">Your cart is empty</h2>
          <Link to="/shop" className="btn-dark text-sm">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => navigate(-1)} className="btn-ghost flex items-center gap-1 text-sm">
            <ArrowLeft size={15} /> Back
          </button>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-[#0a0a0a]">Checkout</h1>
          </div>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-[#0a0a0a] text-white' : 'bg-[#e4dfd6] text-[#a8a39a]'
              }`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${i === step ? 'text-[#0a0a0a]' : 'text-[#a8a39a]'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className="flex-1 h-px bg-[#e4dfd6]" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            {/* Step 0: Cart Review */}
            {step === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl p-6 space-y-4">
                <h2 className="font-semibold text-[#0a0a0a] flex items-center gap-2">
                  <ShoppingBag size={18} /> Review your items
                </h2>
                {items.map(({ product, quantity }) => (
                  <div key={product._id} className="flex gap-4 pb-4 border-b border-[#f0ede7] last:border-0 last:pb-0">
                    <img src={product.thumbnail} alt={product.title}
                      className="w-16 h-16 rounded-xl object-cover bg-[#f0ede7] flex-shrink-0"
                      onError={e => e.target.src = 'https://placehold.co/64x64'} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#0a0a0a] text-sm line-clamp-1">{product.title}</p>
                      <p className="text-xs text-[#a8a39a] capitalize">{product.category}</p>
                      <p className="text-xs text-[#5a5550] mt-1">Qty: {quantity}</p>
                    </div>
                    <span className="font-bold text-[#0a0a0a] text-sm flex-shrink-0">${(getProductPrice(product) * quantity).toFixed(2)}</span>
                  </div>
                ))}
                <button onClick={() => setStep(1)} className="btn-dark w-full py-4 flex items-center justify-center gap-2">
                  Continue to Shipping <Truck size={16} />
                </button>
              </motion.div>
            )}

            {/* Step 1: Shipping */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl p-6">
                <h2 className="font-semibold text-[#0a0a0a] mb-5 flex items-center gap-2">
                  <Truck size={18} /> Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    ['fullName', 'Full Name *', 'text', 'col-span-2'],
                    ['email', 'Email *', 'email', 'col-span-2'],
                    ['phone', 'Phone', 'tel', ''],
                    ['street', 'Street Address *', 'text', 'col-span-2'],
                    ['city', 'City *', 'text', ''],
                    ['state', 'State', 'text', ''],
                    ['country', 'Country *', 'text', ''],
                    ['zip', 'ZIP Code', 'text', ''],
                  ].map(([field, label, type, span]) => (
                    <div key={field} className={span}>
                      <label className="block text-xs font-semibold text-[#3d3a36] mb-1.5">{label}</label>
                      <input
                        type={type}
                        value={address[field]}
                        onChange={e => setAddress({ ...address, [field]: e.target.value })}
                        placeholder={label.replace(' *', '')}
                        className="input-field text-sm"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(0)} className="btn-outline flex-1 py-3.5 text-sm">Back</button>
                  <button
                    onClick={() => {
                      if (!address.fullName || !address.email || !address.street || !address.city || !address.country)
                        return toast.error('Please fill required fields');
                      setStep(2);
                    }}
                    className="btn-dark flex-1 py-3.5 text-sm flex items-center justify-center gap-2"
                  >
                    Continue to Payment <CreditCard size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl p-6">
                <h2 className="font-semibold text-[#0a0a0a] mb-5 flex items-center gap-2">
                  <CreditCard size={18} /> Payment Details
                </h2>
                <div className="p-5 bg-[#f0ede7] rounded-2xl mb-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#d4a853]">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0a0a0a]">Secure card payment</p>
                      <p className="text-xs text-[#5a5550] mt-0.5">Powered by Stripe Checkout</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {['Cards', 'Shipping', 'Receipt'].map((label) => (
                      <div key={label} className="bg-white rounded-xl px-3 py-2">
                        <p className="text-[11px] font-semibold text-[#5a5550]">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="btn-outline flex-1 py-3.5 text-sm">Back</button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="btn-amber flex-1 py-3.5 text-sm flex items-center justify-center gap-2"
                  >
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Starting payment...</> : <>Pay ${total.toFixed(2)}</>}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-3xl p-6 sticky top-24">
              <h3 className="font-semibold text-[#0a0a0a] mb-4">Order Summary</h3>
              <div className="space-y-3 pb-4 border-b border-[#f0ede7]">
                {items.map(({ product, quantity }) => (
                  <div key={product._id} className="flex justify-between text-sm">
                    <span className="text-[#5a5550] truncate flex-1 pr-2 text-xs">{product.title} ×{quantity}</span>
                    <span className="font-medium text-[#0a0a0a] flex-shrink-0 text-xs">${(getProductPrice(product) * quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#a8a39a]">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#a8a39a]">Shipping</span>
                  <span className={shipping === 0 ? 'text-emerald-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : `$${shipping}`}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-3 border-t border-[#f0ede7]">
                  <span>Total</span>
                  <span className="text-[#d4a853]">${total.toFixed(2)}</span>
                </div>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-[#a8a39a] mt-3 text-center">
                  Add ${(99 - subtotal).toFixed(2)} more for free shipping
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
