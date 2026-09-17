import Link from 'next/link';
import { ArrowLeft, Home, Search, Package } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-app min-h-[70vh] flex flex-col items-center justify-center text-center py-20 px-4">

      {/* CMYK splash number */}
      <div className="relative mb-8 select-none">
        <span className="text-[122px] sm:text-[162px] font-black leading-none"
          style={{
            background: 'linear-gradient(135deg,#00AEEF 0%,#EC008C 50%,#FFD700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
          404
        </span>
        <div className="absolute inset-0 blur-3xl opacity-20 pointer-events-none"
          style={{ background: 'linear-gradient(135deg,#00AEEF,#EC008C,#FFD700)' }} />
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-[#111] mb-3">
        Page Not Found
      </h1>
      <p className="text-[#888] text-sm sm:text-base max-w-sm mb-8 leading-relaxed">
        Looks like this page went missing - just like ink on the wrong shirt.
        Let&apos;s get you back on track.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:w-auto">
        <Link href="/" className="btn btn-primary btn-lg">
          <Home size={18} /> Back to Home
        </Link>
        <Link href="/products" className="btn btn-outline btn-lg">
          <Search size={18} /> Browse Products
        </Link>
        <Link href="/orders" className="btn btn-ghost btn-lg text-[#888]">
          <Package size={18} /> My Orders
        </Link>
      </div>

    </div>
  );
}
