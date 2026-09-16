'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, User, MapPin, X, Menu, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const itemCount = useCartStore((s) => s.getItemCount());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const user = useAuthStore((s) => s.user);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
    }
  };

  return (
    <header
      className="sticky-header bg-white border-b border-[#e5e7eb] transition-shadow duration-200"
      style={{ boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.08)' : 'none' }}
    >
      {/* Top bar - desktop only */}
      <div className="hidden lg:block bg-[#111111] text-white text-xs py-1.5 text-center">
        <span className="text-[#FFD700] font-semibold">Salem&apos;s #1 Custom Printing</span>
        &nbsp;·&nbsp; Same-day dispatch for orders before 12 PM &nbsp;·&nbsp;
        <span className="text-[#00AEEF]">Free delivery above ₹999</span>
      </div>

      <div className="container-app">
        <div className="flex items-center gap-2 sm:gap-3 h-16">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center group" aria-label="Hashtag - Home">
            <Image
              src="/HP_Logo.png"
              alt="Hashtag Custom Prints Logo"
              width={140}
              height={48}
              className="h-12 sm:h-14 w-auto object-contain transition-opacity duration-200 group-hover:opacity-85"
              priority
            />
          </Link>

          {/* Location pill - desktop */}
          <button className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#e5e7eb] hover:border-[#00AEEF] transition-colors text-sm text-[#444] hover:text-[#00AEEF] flex-shrink-0">
            <MapPin size={14} className="text-[#EC008C]" />
            <span className="font-medium">Salem, TN</span>
            <ChevronRight size={12} />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 mx-2 flex-shrink-0 text-[13px] font-bold text-[#444]">
            <Link href="/" className="hover:text-[#00AEEF] transition-colors">Home</Link>
            <Link href="/about" className="hover:text-[#00AEEF] transition-colors">About Us</Link>
            <Link href="/products?category=bulk-printing" className="hover:text-[#00AEEF] transition-colors">Bulk Order</Link>
            <Link href="/contact" className="hover:text-[#00AEEF] transition-colors">Contact Us</Link>
          </nav>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 relative max-w-2xl min-w-0">
            <div className={`flex items-center border-2 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-300 ${isSearchFocused ? 'border-[#00AEEF] bg-white shadow-[0_4px_15px_rgba(0,174,239,0.15)] ring-4 ring-[#00AEEF]/10' : 'bg-white border-[#e5e7eb] shadow-sm hover:border-[#00AEEF]/50 hover:shadow-md'}`}>
              <Search size={16} className={`flex-shrink-0 hidden sm:block transition-colors ${isSearchFocused ? 'text-[#00AEEF]' : 'text-[#888]'}`} />
              <Search size={14} className={`flex-shrink-0 sm:hidden transition-colors ${isSearchFocused ? 'text-[#00AEEF]' : 'text-[#888]'}`} />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
                className="flex-1 bg-transparent outline-none ml-2 sm:ml-2.5 text-xs sm:text-sm text-[#111] placeholder-[#888] font-medium w-full min-w-0"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[#888] hover:text-[#111] transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Cart button */}
            <Link
              href="/cart"
              className="relative touch-target rounded-full hover:bg-[#f0f9ff] transition-colors text-[#111] flex items-center justify-center"
              aria-label="Open cart"
            >
              <ShoppingCart size={22} />
              {isMounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#EC008C] text-white text-[10px] font-bold flex items-center justify-center leading-none animate-scaleIn">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* User */}
            <Link
              href={isMounted && user ? '/profile' : '/auth/login'}
              className="touch-target rounded-full hover:bg-[#f0f9ff] transition-colors text-[#111]"
              aria-label={isMounted && user ? 'My account' : 'Login'}
            >
              {isMounted && user ? (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #00AEEF, #EC008C)' }}>
                  {user.name[0].toUpperCase()}
                </div>
              ) : (
                <User size={22} />
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
