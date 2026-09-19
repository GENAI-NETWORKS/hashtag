'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, LayoutGrid, ShoppingBag, ClipboardList, UserCircle2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Store },
  { href: '/products', label: 'Categories', icon: LayoutGrid },
  { href: '/cart', label: 'Cart', icon: ShoppingBag, badge: true },
  { href: '/orders', label: 'Orders', icon: ClipboardList },
  { href: '/profile', label: 'Profile', icon: UserCircle2 },
];

export function BottomNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.getItemCount());
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If scroll down and we're not at the very top, hide
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } 
      // If scroll up, show
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Hide on admin pages
  if (pathname?.startsWith('/admin')) return null;

  return (
    <nav
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#e5e7eb] transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
      }}
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch h-16">
        {NAV_ITEMS.map(({ href, label, icon: Icon, badge }) => {
          const isActive =
            href === '/' ? pathname === '/' : pathname?.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors min-h-[44px]"
              style={{ color: isActive ? '#01a2fb' : '#888888' }}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span
                  className="absolute top-0 left-3 right-3 h-0.5 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #01a2fb, #fa028e)' }}
                />
              )}

              <span className="relative">
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className="transition-transform duration-150"
                  style={{ transform: isActive ? 'scale(1.1)' : 'scale(1)' }}
                />
                {isMounted && badge && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#fa028e] text-white text-[11px] font-bold flex items-center justify-center leading-none">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </span>

              <span
                className="text-[12px] font-semibold leading-none"
                style={{ color: isActive ? '#01a2fb' : '#888' }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
