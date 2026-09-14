'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function CartBar() {
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const itemCount = useCartStore((s) => s.getItemCount());
  const subtotal = useCartStore((s) => s.getSubtotal());
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in when items are added
    if (itemCount > 0) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [itemCount]);

  // Don't show on cart/checkout/admin/product pages or when empty
  const hiddenPaths = ['/cart', '/checkout', '/admin', '/products'];
  const shouldHide = hiddenPaths.some((p) => pathname?.startsWith(p)) || !visible;

  if (shouldHide) return null;

  return (
    <div
      className="fixed bottom-[64px] lg:bottom-6 left-3 right-3 lg:left-auto lg:right-6 lg:w-80 z-40 animate-slideInBottom"
      role="status"
      aria-live="polite"
      aria-label={`${itemCount} items in cart`}
    >
      <Link
        href="/cart"
        className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: 'linear-gradient(135deg, #111111 0%, #1e1e1e 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.06)',
        }}
      >
        {/* Cart icon with badge */}
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(0, 174, 239, 0.15)' }}>
            <ShoppingCart size={18} className="text-[#00AEEF]" />
          </div>
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#EC008C] text-white text-[10px] font-bold flex items-center justify-center">
            {itemCount}
          </span>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="text-xs text-[#aaa] leading-none mb-0.5">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </div>
          <div className="font-bold text-sm text-white leading-none">
            {formatPrice(subtotal)}
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-1 text-[#00AEEF] font-semibold text-sm flex-shrink-0">
          View Cart
          <ArrowRight size={16} />
        </div>
      </Link>
    </div>
  );
}
