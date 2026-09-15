"use client";

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import Image from 'next/image';

export function FloatingCartButton() {
  const { items } = useCartStore();

  if (items.length === 0) return null;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + ((item.product?.basePrice || 0) * item.quantity), 0);
  
  // Get last-added item's image for the pill thumbnail
  const lastItem = items[items.length - 1];
  const thumbSrc = lastItem?.product?.images?.[0] || null;

  return (
    <div className="fixed bottom-[72px] lg:bottom-6 left-0 right-0 z-[55] px-4">
      <div className="max-w-[600px] mx-auto">
        <Link
          href="/cart"
          className="flex items-center justify-between bg-[#0f8a3c] rounded-[16px] px-4 py-3 shadow-[0_8px_24px_rgba(15,138,60,0.35)] active:scale-[0.98] transition-transform"
        >
          {/* Left: thumbnail + text */}
          <div className="flex items-center gap-3">
            {thumbSrc ? (
              <div className="w-11 h-11 rounded-xl bg-white/20 overflow-hidden relative flex-shrink-0">
                <Image src={thumbSrc} alt="Cart item" fill className="object-contain p-1" unoptimized />
              </div>
            ) : (
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🛒</span>
              </div>
            )}
            <div>
              <p className="text-white font-black text-[15px] leading-tight">View cart</p>
              <p className="text-white/80 text-[12px] font-semibold">{totalItems} item{totalItems > 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Right: total + arrow */}
          <div className="flex items-center gap-2">
            <p className="text-white font-black text-[15px]">₹{totalPrice}</p>
            <ChevronRight size={20} className="text-white/80" />
          </div>
        </Link>
      </div>
    </div>
  );
}
