"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function FloatingCartButton() {
  const { items } = useCartStore();
  const pathname = usePathname();
  
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsScrolledDown(true);
      } else if (currentScrollY < lastScrollY) {
        setIsScrolledDown(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const [isBannerClosed, setIsBannerClosed] = useState(false);
  const [isProductSheetOpen, setIsProductSheetOpen] = useState(false);
  const [isProductSheetFullScreen, setIsProductSheetFullScreen] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleBannerClosed = () => setIsBannerClosed(true);
    const handleSheetOpened = () => setIsProductSheetOpen(true);
    const handleSheetClosed = () => setIsProductSheetOpen(false);
    const handleSheetFullScreen = () => setIsProductSheetFullScreen(true);
    const handleSheetPartial = () => setIsProductSheetFullScreen(false);
    
    window.addEventListener('bannerClosed', handleBannerClosed);
    window.addEventListener('productSheetOpened', handleSheetOpened);
    window.addEventListener('productSheetClosed', handleSheetClosed);
    window.addEventListener('productSheetFullScreen', handleSheetFullScreen);
    window.addEventListener('productSheetPartial', handleSheetPartial);
    
    return () => {
      window.removeEventListener('bannerClosed', handleBannerClosed);
      window.removeEventListener('productSheetOpened', handleSheetOpened);
      window.removeEventListener('productSheetClosed', handleSheetClosed);
      window.removeEventListener('productSheetFullScreen', handleSheetFullScreen);
      window.removeEventListener('productSheetPartial', handleSheetPartial);
    };
  }, []);

  if (!isMounted || items.length === 0) return null;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + ((item.product?.basePrice || 0) * item.quantity), 0);
  
  // Get last-added item's image for the pill thumbnail
  const lastItem = items[items.length - 1];
  const thumbSrc = lastItem?.product?.images?.[0] || null;

  const isHome = pathname === '/';
  const baseBottom = (isHome && !isBannerClosed) ? 'bottom-[136px]' : 'bottom-[80px]';
  
  // Slide to bottom edge when scrolled down, instead of completely hiding
  const hideClass = isScrolledDown ? 'translate-y-[calc(100%+16px)]' : 'translate-y-0';
  
  // We can just use the bottom position for everything to avoid conflict between bottom and translate.
  let bottomClass = isScrolledDown ? 'bottom-4' : `${baseBottom} lg:bottom-6`;
  if (isProductSheetOpen) {
    bottomClass = 'bottom-4';
  }
  
  // If the product bottom sheet is open, we need to translate the cart up so it doesn't overlap the "Add to Cart" sticky footer.
  // 64px translation gives a perfect tight gap above the 67px tall footer (which is at bottom-0).
  const sheetOffsetClass = (isProductSheetOpen && isProductSheetFullScreen) ? 'max-[1023px]:-translate-y-[64px]' : 'translate-y-0';

  return (
    <div className={`fixed ${bottomClass} left-0 right-0 z-[100000] px-4 pointer-events-none flex justify-center transition-all duration-300 ${sheetOffsetClass}`}>
      <div className="w-fit pointer-events-auto">
        <Link
          href="/cart"
          className="flex items-center gap-4 sm:gap-6 bg-gradient-to-r from-[#0a7032] to-[#16a34a] rounded-full px-3 py-2 sm:px-4 sm:py-2.5 shadow-[0_8px_30px_rgba(22,163,74,0.4)] active:scale-[0.98] hover:scale-[1.02] transition-all duration-300 ring-2 ring-white/20"
        >
          {/* Left: thumbnail + text */}
          <div className="flex items-center gap-2.5">
            {thumbSrc ? (
              <div className="w-9 h-9 rounded-full bg-white overflow-hidden relative flex-shrink-0 shadow-inner">
                <Image src={thumbSrc} alt="Cart item" fill className="object-cover" unoptimized />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
                <span className="text-sm">🛒</span>
              </div>
            )}
            <div className="flex flex-col justify-center">
              <p className="text-white font-black text-[13px] sm:text-[14px] leading-tight tracking-wide">View cart</p>
              <p className="text-white/90 text-[10px] sm:text-[11px] font-bold">{totalItems} item{totalItems > 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Right: total + arrow */}
          <div className="flex items-center gap-1 bg-black/20 rounded-full pl-3 pr-2 py-1 border border-white/10">
            <p className="text-white font-black text-[13px] sm:text-[14px]">₹{totalPrice}</p>
            <ChevronRight size={16} className="text-white/90 ml-0.5" />
          </div>
        </Link>
      </div>
    </div>
  );
}
