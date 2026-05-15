import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Mail,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
} from 'lucide-react';
import { authAPI } from '../api';
import toast from 'react-hot-toast';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Enter your email');
    setLoading(true);
    try {
      const { data } = await authAPI.forgotPassword(email);
      if (data.success) setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Email not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#faf8f5] flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#f0ede7] overflow-hidden'
      >
        <div className='h-1 bg-gradient-to-r from-[#d4a853] to-[#b8903e]' />
        <div className='p-8'>
          <Link to='/' className='flex items-center gap-2 mb-8'>
            <div className='w-9 h-9 bg-[#0a0a0a] rounded-xl flex items-center justify-center'>
              <ShoppingBag size={17} className='text-[#d4a853]' />
            </div>
            <span className='font-display text-xl font-bold text-[#0a0a0a]'>
              Swift<span className='text-[#d4a853]'>Cart</span>
            </span>
          </Link>

          {sent ? (
            <div className='text-center py-4'>
              <div className='w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                <Mail size={28} className='text-emerald-600' />
              </div>
              <h2 className='font-display text-2xl font-bold text-[#0a0a0a] mb-2'>
                Check your email
              </h2>
              <p className='text-[#a8a39a] text-sm mb-6'>
                We sent a reset link to{' '}
                <strong className='text-[#0a0a0a]'>{email}</strong>
              </p>
              <Link
                to='/login'
                className='btn-dark inline-flex items-center gap-2 text-sm'
              >
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          ) : (
            <>
              <h2 className='font-display text-2xl font-bold text-[#0a0a0a] mb-1'>
                Forgot password?
              </h2>
              <p className='text-[#a8a39a] text-sm mb-6'>
                We'll send a reset link to your email.
              </p>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label className='block text-xs font-semibold text-[#3d3a36] mb-1.5'>
                    Email address
                  </label>
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='you@example.com'
                    className='input-field'
                  />
                </div>
                <button
                  type='submit'
                  disabled={loading}
                  className='btn-dark w-full py-4 flex items-center justify-center gap-2'
                >
                  {loading && <Loader2 size={16} className='animate-spin' />}
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>
              <p className='text-center mt-5'>
                <Link
                  to='/login'
                  className='btn-ghost text-sm inline-flex items-center gap-1'
                >
                  <ArrowLeft size={13} /> Back to login
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function ResetPasswordPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Min 6 characters');
    if (form.password !== form.confirm)
      return toast.error("Passwords don't match");
    setLoading(true);
    try {
      const { data } = await authAPI.resetPassword(userId, form.password);
      if (data.success) setDone(true);
    } catch {
      toast.error('Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#faf8f5] flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#f0ede7] overflow-hidden'
      >
        <div className='h-1 bg-gradient-to-r from-[#d4a853] to-[#b8903e]' />
        <div className='p-8'>
          <Link to='/' className='flex items-center gap-2 mb-8'>
            <div className='w-9 h-9 bg-[#0a0a0a] rounded-xl flex items-center justify-center'>
              <ShoppingBag size={17} className='text-[#d4a853]' />
            </div>
            <span className='font-display text-xl font-bold text-[#0a0a0a]'>
              Swift<span className='text-[#d4a853]'>Cart</span>
            </span>
          </Link>

          {done ? (
            <div className='text-center py-4'>
              <div className='w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                <CheckCircle size={28} className='text-emerald-600' />
              </div>
              <h2 className='font-display text-2xl font-bold text-[#0a0a0a] mb-2'>
                Password reset!
              </h2>
              <p className='text-[#a8a39a] text-sm mb-6'>
                Your password has been updated successfully.
              </p>
              <button
                onClick={() => navigate('/login')}
                className='btn-dark text-sm'
              >
                Sign in now
              </button>
            </div>
          ) : (
            <>
              <h2 className='font-display text-2xl font-bold text-[#0a0a0a] mb-1'>
                Reset password
              </h2>
              <p className='text-[#a8a39a] text-sm mb-6'>
                Enter your new password below.
              </p>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label className='block text-xs font-semibold text-[#3d3a36] mb-1.5'>
                    New password
                  </label>
                  <div className='relative'>
                    <input
                      type={show ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      placeholder='Min. 6 characters'
                      className='input-field pr-12'
                    />
                    <button
                      type='button'
                      onClick={() => setShow((v) => !v)}
                      className='absolute right-4 top-1/2 -translate-y-1/2 text-[#a8a39a]'
                    >
                      {show ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className='block text-xs font-semibold text-[#3d3a36] mb-1.5'>
                    Confirm password
                  </label>
                  <input
                    type='password'
                    value={form.confirm}
                    onChange={(e) =>
                      setForm({ ...form, confirm: e.target.value })
                    }
                    placeholder='••••••••'
                    className='input-field'
                  />
                </div>
                <button
                  type='submit'
                  disabled={loading}
                  className='btn-dark w-full py-4 flex items-center justify-center gap-2'
                >
                  {loading && <Loader2 size={16} className='animate-spin' />}
                  {loading ? 'Updating…' : 'Set New Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
