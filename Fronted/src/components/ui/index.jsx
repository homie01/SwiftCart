import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function Spinner({ size = 20, className = '' }) {
  return <Loader2 size={size} className={`animate-spin text-[#0a0a0a] ${className}`} />;
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <Spinner size={28} className="mx-auto mb-3 text-[#d4a853]" />
        <p className="text-sm text-[#a8a39a]">Loading...</p>
      </div>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-5 w-1/4 rounded" />
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-[#f0ede7] flex items-center justify-center mb-5">
        {Icon && <Icon size={32} className="text-[#ccc8c0]" />}
      </div>
      <h3 className="font-semibold text-[#0a0a0a] text-lg mb-2">{title}</h3>
      {description && <p className="text-sm text-[#a8a39a] max-w-xs">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}

export function SectionHeader({ label, title, subtitle, center = false }) {
  return (
    <div className={`mb-10 ${center ? 'text-center' : ''}`}>
      {label && <p className="section-label mb-2">{label}</p>}
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="text-[#5a5550] mt-2 max-w-xl">{subtitle}</p>}
    </div>
  );
}

export function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-[#a8a39a]">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span>/</span>}
          {item.to ? (
            <a href={item.to} className="hover:text-[#0a0a0a] transition-colors capitalize">
              {item.label}
            </a>
          ) : (
            <span className="text-[#0a0a0a] font-medium capitalize">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
