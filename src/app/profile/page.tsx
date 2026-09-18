'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  User, Package, MapPin, LogOut, ChevronRight,
  ShoppingBag, Heart, Settings, Shield
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const clearCart = useCartStore((s) => s.clearCart);
  const router = useRouter();
  const wishlistItems = useWishlistStore((s) => s.items);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push('/auth/login');
    }
  }, [user, router, mounted]);

  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders');
      const json = await res.json();
      return json.data || [];
    },
    enabled: !!user,
  });

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    logout();
    clearCart();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const MENU_ITEMS = [
    { icon: Package, label: 'My Orders', sub: 'Track your print orders', href: '/orders', color: '#00AEEF' },
    { icon: Heart, label: 'Wishlist', sub: 'Products you love', href: '/profile/wishlist', color: '#FFD700' },
    { icon: Settings, label: 'Account Settings', sub: 'Update profile & password', href: '/profile/settings', color: '#7c3aed' },
  ];

  if (user.role === 'ADMIN') {
    MENU_ITEMS.push({ icon: Shield, label: 'Admin Dashboard', sub: 'Manage orders & products', href: '/admin', color: '#16a34a' });
  }

  return (
    <div className="container-app py-6 max-w-lg mx-auto">

      {/* Profile card */}
      <div className="card p-6 mb-5 text-center">
        <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-black"
          style={{ background: 'linear-gradient(135deg,#00AEEF,#EC008C)' }}>
          {user.name[0].toUpperCase()}
        </div>
        <h1 className="text-xl font-black text-[#111]">{user.name}</h1>
        <p className="text-sm text-[#888] mt-1">{user.email}</p>
        {user.phone && <p className="text-sm text-[#888]">{user.phone}</p>}
        {user.role === 'ADMIN' && (
          <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: '#dcfce7', color: '#16a34a' }}>
            <Shield size={11} /> Admin
          </span>
        )}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: 'Orders', value: orders?.length?.toString() || '0', icon: ShoppingBag, color: '#00AEEF' },
          { label: 'Wishlist', value: mounted ? wishlistItems.length.toString() : '-', icon: Heart, color: '#EC008C' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-4 text-center">
            <Icon size={20} className="mx-auto mb-1.5" style={{ color }} />
            <p className="text-lg font-black text-[#111]">{value}</p>
            <p className="text-[12px] text-[#888] font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="card overflow-hidden divide-y divide-[#f0f0f0] mb-5">
        {MENU_ITEMS.map(({ icon: Icon, label, sub, href, color }) => (
          <Link key={href} href={href}
            className="flex items-center gap-4 p-4 hover:bg-[#f8f9fa] transition-colors">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}18` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#111]">{label}</p>
              <p className="text-xs text-[#888]">{sub}</p>
            </div>
            <ChevronRight size={16} className="text-[#ccc] flex-shrink-0" />
          </Link>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="card w-full p-4 flex items-center gap-4 hover:bg-[#fff0f0] transition-colors text-left"
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#fee2e2] flex-shrink-0">
          <LogOut size={18} className="text-[#dc2626]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#dc2626]">Logout</p>
          <p className="text-xs text-[#888]">Sign out of your account</p>
        </div>
      </button>

    </div>
  );
}
