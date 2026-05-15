import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ShoppingBag, Loader2, Check } from 'lucide-react';
import { authAPI } from '../api';
import toast from 'react-hot-toast';

const perks = [
  'Free shipping on first order',
  'Exclusive member discounts',
  'Early access to sales',
  'Easy order tracking',
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    contact: '',
    password: '',
    confirm: '',
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!form.firstname || !form.email || !form.password)
      return 'Please fill in all required fields';
    if (form.password.length < 6)
      return 'Password must be at least 6 characters';
    if (form.password !== form.confirm) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);
    setLoading(true);
    try {
      const { firstname, lastname, email, contact, password } = form;
      const { data } = await authAPI.register({
        firstname,
        lastname,
        email,
        contact,
        password,
      });
      if (data.success) {
        toast.success('Account created! Please sign in.');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const ch = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* Left Branding */}
      <div className='hidden lg:flex flex-col justify-between p-12 bg-[#0a0a0a] relative overflow-hidden'>
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute top-1/3 -right-20 w-80 h-80 bg-[#d4a853]/10 rounded-full blur-3xl' />
          <div className='absolute bottom-1/4 left-0 w-64 h-64 bg-[#d4a853]/5 rounded-full blur-3xl' />
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
              Join Us Today
            </p>
            <h2 className='font-display text-4xl font-bold text-white leading-tight'>
              Unlock Your
              <br />
              Premium
              <br />
              Membership
            </h2>
          </div>
          <div className='space-y-3'>
            {perks.map((perk) => (
              <div key={perk} className='flex items-center gap-3'>
                <div className='w-5 h-5 rounded-full bg-[#d4a853]/20 flex items-center justify-center flex-shrink-0'>
                  <Check size={11} className='text-[#d4a853]' />
                </div>
                <span className='text-[#a8a39a] text-sm'>{perk}</span>
              </div>
            ))}
          </div>
        </div>
        <p className='relative text-[#2a2825] text-xs'>© 2025 SwiftCart.</p>
      </div>

      {/* Right Form */}
      <div className='flex items-center justify-center p-6 md:p-12 bg-[#faf8f5] overflow-y-auto'>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className='w-full max-w-md py-6'
        >
          <div className='flex items-center gap-2 mb-8 lg:hidden'>
            <div className='w-9 h-9 bg-[#0a0a0a] rounded-xl flex items-center justify-center'>
              <ShoppingBag size={18} className='text-[#d4a853]' />
            </div>
            <span className='font-display text-xl font-bold text-[#0a0a0a]'>
              Swift<span className='text-[#d4a853]'>Cart</span>
            </span>
          </div>

          <h1 className='font-display text-3xl font-bold text-[#0a0a0a] mb-1'>
            Create account
          </h1>
          <p className='text-[#a8a39a] text-sm mb-8'>
            Already have one?{' '}
            <Link
              to='/login'
              className='text-[#d4a853] hover:text-[#b8903e] font-semibold transition-colors'
            >
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='block text-xs font-semibold text-[#3d3a36] mb-1.5'>
                  First name *
                </label>
                <input
                  value={form.firstname}
                  onChange={ch('firstname')}
                  placeholder='John'
                  className='input-field text-sm'
                />
              </div>
              <div>
                <label className='block text-xs font-semibold text-[#3d3a36] mb-1.5'>
                  Last name
                </label>
                <input
                  value={form.lastname}
                  onChange={ch('lastname')}
                  placeholder='Doe'
                  className='input-field text-sm'
                />
              </div>
            </div>

            <div>
              <label className='block text-xs font-semibold text-[#3d3a36] mb-1.5'>
                Email address *
              </label>
              <input
                type='email'
                value={form.email}
                onChange={ch('email')}
                placeholder='you@example.com'
                className='input-field text-sm'
              />
            </div>

            <div>
              <label className='block text-xs font-semibold text-[#3d3a36] mb-1.5'>
                Phone number
              </label>
              <input
                type='tel'
                value={form.contact}
                onChange={ch('contact')}
                placeholder='+1 234 567 8900'
                className='input-field text-sm'
              />
            </div>

            <div>
              <label className='block text-xs font-semibold text-[#3d3a36] mb-1.5'>
                Password *
              </label>
              <div className='relative'>
                <input
                  type={show ? 'text' : 'password'}
                  value={form.password}
                  onChange={ch('password')}
                  placeholder='Min. 6 characters'
                  className='input-field pr-12 text-sm'
                />
                <button
                  type='button'
                  onClick={() => setShow((v) => !v)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-[#a8a39a] hover:text-[#5a5550]'
                >
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className='block text-xs font-semibold text-[#3d3a36] mb-1.5'>
                Confirm password *
              </label>
              <input
                type='password'
                value={form.confirm}
                onChange={ch('confirm')}
                placeholder='••••••••'
                className='input-field text-sm'
              />
            </div>

            <p className='text-xs text-[#a8a39a]'>
              By creating an account you agree to our{' '}
              <a href='#' className='text-[#d4a853]'>
                Terms
              </a>{' '}
              and{' '}
              <a href='#' className='text-[#d4a853]'>
                Privacy Policy
              </a>
              .
            </p>

            <button
              type='submit'
              disabled={loading}
              className='btn-dark w-full py-4 flex items-center justify-center gap-2 text-base'
            >
              {loading && <Loader2 size={18} className='animate-spin' />}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
