import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ShoppingBag, Loader2 } from 'lucide-react';
import { authAPI } from '../api';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password)
      return toast.error('Please fill in all fields');
    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      if (data.success) {
        setAuth(data.data, data.token);
        toast.success(`Welcome back, ${data.data.firstname}! 👋`);
        navigate(from, { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* Left - Branding */}
      <div className='hidden lg:flex flex-col justify-between p-12 bg-[#0a0a0a] relative overflow-hidden'>
        {/* Decorative */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute top-1/4 -left-20 w-72 h-72 bg-[#d4a853]/10 rounded-full blur-3xl' />
          <div className='absolute bottom-1/4 right-0 w-96 h-96 bg-[#d4a853]/5 rounded-full blur-3xl' />
        </div>

        <div className='relative flex items-center gap-3'>
          <div className='w-10 h-10 bg-[#d4a853] rounded-xl flex items-center justify-center'>
            <ShoppingBag size={20} className='text-[#0a0a0a]' />
          </div>
          <span className='font-display text-2xl font-bold text-white'>
            Swift<span className='text-[#d4a853]'>Cart</span>
          </span>
        </div>

        <div className='relative space-y-6'>
          <div>
            <p className='text-[#d4a853] text-sm font-semibold tracking-widest uppercase mb-3'>
              Welcome Back
            </p>
            <h2 className='font-display text-4xl xl:text-5xl font-bold text-white leading-tight'>
              Your Premium
              <br />
              Shopping
              <br />
              Experience
            </h2>
          </div>
          <p className='text-[#5a5550] leading-relaxed max-w-sm'>
            Thousands of curated products. Free shipping. Easy returns.
            Everything you need, all in one place.
          </p>

          {/* Stats */}
          <div className='grid grid-cols-3 gap-4 pt-4'>
            {[
              ['10K+', 'Products'],
              ['50K+', 'Customers'],
              ['4.9★', 'Rating'],
            ].map(([val, label]) => (
              <div
                key={label}
                className='border border-[#2a2825] rounded-xl p-3 text-center'
              >
                <p className='text-[#d4a853] font-bold text-xl'>{val}</p>
                <p className='text-[#5a5550] text-xs mt-0.5'>{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className='relative text-[#2a2825] text-xs'>
          © 2025 SwiftCart. All rights reserved.
        </p>
      </div>

      {/* Right - Form */}
      <div className='flex items-center justify-center p-6 md:p-12 bg-[#faf8f5]'>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className='w-full max-w-md'
        >
          {/* Mobile logo */}
          <div className='flex items-center gap-2 mb-8 lg:hidden'>
            <div className='w-9 h-9 bg-[#0a0a0a] rounded-xl flex items-center justify-center'>
              <ShoppingBag size={18} className='text-[#d4a853]' />
            </div>
            <span className='font-display text-xl font-bold text-[#0a0a0a]'>
              Swift<span className='text-[#d4a853]'>Cart</span>
            </span>
          </div>

          <h1 className='font-display text-3xl font-bold text-[#0a0a0a] mb-1'>
            Sign in
          </h1>
          <p className='text-[#a8a39a] text-sm mb-8'>
            Don't have an account?{' '}
            <Link
              to='/register'
              className='text-[#d4a853] hover:text-[#b8903e] font-semibold transition-colors'
            >
              Create one
            </Link>
          </p>

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label className='block text-sm font-semibold text-[#3d3a36] mb-2'>
                Email address
              </label>
              <input
                type='email'
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder='you@example.com'
                className='input-field'
                autoComplete='email'
              />
            </div>

            <div>
              <div className='flex justify-between mb-2'>
                <label className='text-sm font-semibold text-[#3d3a36]'>
                  Password
                </label>
                <Link
                  to='/forgot-password'
                  className='text-xs text-[#d4a853] hover:text-[#b8903e] transition-colors'
                >
                  Forgot password?
                </Link>
              </div>
              <div className='relative'>
                <input
                  type={show ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder='••••••••'
                  className='input-field pr-12'
                  autoComplete='current-password'
                />
                <button
                  type='button'
                  onClick={() => setShow((v) => !v)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-[#a8a39a] hover:text-[#5a5550] transition-colors'
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='btn-dark w-full py-4 text-base flex items-center justify-center gap-2'
            >
              {loading && <Loader2 size={18} className='animate-spin' />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className='relative my-6'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-[#e4dfd6]' />
            </div>
            <div className='relative flex justify-center'>
              <span className='px-3 text-xs text-[#a8a39a] bg-[#faf8f5]'>
                or continue with
              </span>
            </div>
          </div>

          <Link
            to='/shop'
            className='flex items-center justify-center gap-2 w-full py-3.5 border-2 border-[#e4dfd6] rounded-2xl text-sm font-medium text-[#5a5550] hover:border-[#d4a853] hover:text-[#0a0a0a] transition-all'
          >
            <ShoppingBag size={16} className='text-[#d4a853]' />
            Browse as Guest
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
