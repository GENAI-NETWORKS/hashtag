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
  
  // Get unique images from cart items (up to 3)
  const uniqueImages = Array.from(new Set(items.map(item => item.product?.images?.[0]).filter(Boolean))).slice(0, 3);

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
  // 72px translation gives a perfect 8px gap above the 68px tall footer (which is inside a card at mb-3).
  const sheetOffsetClass = (isProductSheetOpen && isProductSheetFullScreen) ? 'max-[1023px]:-translate-y-[72px]' : 'translate-y-0';

  return (
    <div className={`fixed ${bottomClass} left-0 right-0 z-[100000] px-4 pointer-events-none flex justify-center transition-all duration-300 ${sheetOffsetClass}`}>
      <div className="w-fit pointer-events-auto">
        <Link
          href="/cart"
          className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-[#0a7032] to-[#16a34a] rounded-full px-2 py-1.5 sm:px-3 sm:py-2 shadow-[0_8px_30px_rgba(22,163,74,0.4)] active:scale-[0.98] hover:scale-[1.02] transition-all duration-300 ring-2 ring-white/20"
        >
          {/* Left: thumbnail(s) + text */}
          <div className="flex items-center gap-2.5">
            {uniqueImages.length > 0 ? (
              <div className="flex items-center relative h-9" style={{ width: `${36 + (uniqueImages.length - 1) * 20}px` }}>
                {uniqueImages.map((src, idx) => (
                  <div 
                    key={idx} 
                    className="w-9 h-9 rounded-full bg-white overflow-hidden absolute flex-shrink-0 shadow-sm border-2 border-[#0f8a3c]"
                    style={{ left: `${idx * 20}px`, zIndex: idx }}
                  >
                    <Image src={src as string} alt="Cart item" fill className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
                <span className="text-sm">🛒</span>
              </div>
            )}
            <div className="flex flex-col justify-center">
              <p className="text-white font-black text-[15px] sm:text-[16px] leading-tight tracking-wide">View cart</p>
              <p className="text-white/90 text-[12px] sm:text-[13px] font-bold">{totalItems} item{totalItems > 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Right: arrow */}
          <div className="flex items-center justify-center w-8 h-8 bg-black/20 rounded-full border border-white/10 ml-1">
            <ChevronRight size={18} className="text-white" />
          </div>
        </Link>
      </div>
    </div>
  );
}
