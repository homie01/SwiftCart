import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Globe,
  AtSign,
  BookMarked,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className='bg-[#0a0a0a] text-[#a8a39a] pt-16 pb-8 mt-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#2a2825]'>
          {/* Brand */}
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 bg-[#d4a853] rounded-lg flex items-center justify-center'>
                <ShoppingBag size={16} className='text-[#0a0a0a]' />
              </div>
              <span className='font-display font-bold text-xl text-white'>
                Swift<span className='text-[#d4a853]'>Cart</span>
              </span>
            </div>
            <p className='text-sm leading-relaxed text-[#5a5550]'>
              Curated premium products delivered to your door. Quality,
              elegance, and convenience in one place.
            </p>
            <div className='flex gap-3'>
              {[Globe, AtSign, BookMarked].map((Icon, i) => (
                <a
                  key={i}
                  href='#'
                  className='w-9 h-9 rounded-full border border-[#2a2825] flex items-center justify-center hover:border-[#d4a853] hover:text-[#d4a853] transition-colors'
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className='text-white font-semibold mb-4 text-sm tracking-wide'>
              Shop
            </h4>
            <ul className='space-y-2.5'>
              {[
                ['All Products', '/shop'],
                ['Electronics', '/shop?category=smartphones'],
                ['Fashion', '/shop?category=womens-dresses'],
                ['Home & Living', '/shop?category=home-decoration'],
                ['Beauty', '/shop?category=skincare'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className='text-sm hover:text-[#d4a853] transition-colors'
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className='text-white font-semibold mb-4 text-sm tracking-wide'>
              Account
            </h4>
            <ul className='space-y-2.5'>
              {[
                ['My Account', '/account/profile'],
                ['Orders', '/account/orders'],
                ['Wishlist', '/wishlist'],
                ['Sign In', '/login'],
                ['Register', '/register'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className='text-sm hover:text-[#d4a853] transition-colors'
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className='text-white font-semibold mb-4 text-sm tracking-wide'>
              Contact
            </h4>
            <ul className='space-y-3'>
              {[
                [Mail, 'hello@SwiftCart.com'],
                [Phone, '+1 (800) 123-4567'],
                [MapPin, '123 Commerce St, NY'],
              ].map(([Icon, text], i) => (
                <li key={i} className='flex items-center gap-3 text-sm'>
                  <Icon size={14} className='text-[#d4a853] flex-shrink-0' />
                  {text}
                </li>
              ))}
            </ul>
            <div className='mt-6'>
              <p className='text-xs text-[#5a5550] mb-2'>Newsletter</p>
              <div className='flex gap-2'>
                <input
                  placeholder='your@email.com'
                  className='flex-1 bg-[#1a1917] border border-[#2a2825] rounded-lg px-3 py-2 text-xs text-white placeholder-[#5a5550] focus:outline-none focus:border-[#d4a853] transition-colors'
                />
                <button className='px-3 py-2 bg-[#d4a853] hover:bg-[#b8903e] text-[#0a0a0a] text-xs font-bold rounded-lg transition-colors'>
                  →
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#3d3a36]'>
          <p>© 2025 SwiftCart. All rights reserved.</p>
          <div className='flex gap-5'>
            <a href='#' className='hover:text-[#a8a39a] transition-colors'>
              Privacy Policy
            </a>
            <a href='#' className='hover:text-[#a8a39a] transition-colors'>
              Terms of Service
            </a>
            <a href='#' className='hover:text-[#a8a39a] transition-colors'>
              Returns
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
