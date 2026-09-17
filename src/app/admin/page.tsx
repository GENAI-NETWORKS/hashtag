'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3, Package, ShoppingBag, Users, TrendingUp,
  Printer, Truck, PackageCheck, Clock, CheckCircle2, XCircle,
  ChevronRight, RefreshCcw
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { AnalyticsData, OrderStatus } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';

async function fetchAnalytics(): Promise<AnalyticsData> {
  const res = await fetch('/api/admin/analytics');
  if (!res.ok) throw new Error('Forbidden');
  return (await res.json()).data;
}

const STATUS_ICONS: Record<OrderStatus, typeof Package> = {
  PENDING: Clock,
  DESIGN_CONFIRMED: PackageCheck,
  PRINTING: Printer,
  SHIPPED: Truck,
  DELIVERED: CheckCircle2,
  CANCELLED: XCircle,
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: '#d97706',
  DESIGN_CONFIRMED: '#2563eb',
  PRINTING: '#7c3aed',
  SHIPPED: '#0090c5',
  DELIVERED: '#16a34a',
  CANCELLED: '#dc2626',
};

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub?: string;
  icon: typeof BarChart3; color: string;
}) {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18` }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <p className="text-xs text-[#888] font-medium mb-1">{label}</p>
        <p className="text-2xl font-black text-[#111]">{value}</p>
        {sub && <p className="text-xs text-[#888] mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'ADMIN') router.push('/');
    if (!user) router.push('/auth/login');
  }, [user, router]);

  const { data: analytics, isLoading, refetch } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: fetchAnalytics,
    refetchInterval: 60 * 1000,
    enabled: user?.role === 'ADMIN',
  });

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Admin Header */}
      <div className="bg-[#111] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00AEEF, #EC008C)' }}>
            <span className="text-white font-black text-base leading-none">#</span>
          </div>
          <div>
            <p className="font-black text-sm">Hashtag Admin</p>
            <p className="text-[12px] text-white/50">Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => refetch()} className="text-white/60 hover:text-white transition-colors" aria-label="Refresh">
            <RefreshCcw size={16} />
          </button>
          <Link href="/" className="text-xs text-white/60 hover:text-white transition-colors">
            View Store
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-5 space-y-6">

        <div>
          <h1 className="text-xl font-black text-[#111]">Dashboard</h1>
          <p className="text-sm text-[#888]">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Orders Today" value={analytics?.ordersToday || 0} sub="Active orders" icon={ShoppingBag} color="#00AEEF" />
            <StatCard label="Revenue Today" value={formatPrice(analytics?.revenueToday || 0)} sub="Excl. cancelled" icon={TrendingUp} color="#EC008C" />
            <StatCard label="This Week" value={analytics?.ordersThisWeek || 0} sub="Total orders" icon={BarChart3} color="#FFD700" />
            <StatCard label="Total Revenue" value={formatPrice(analytics?.totalRevenue || 0)} sub="All time" icon={Package} color="#16a34a" />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-5">

          {/* Orders by Status */}
          <div className="card p-5 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-[#111] text-sm">Orders by Status</h2>
              <Link href="/admin/orders" className="text-xs text-[#00AEEF] font-semibold flex items-center gap-1">
                View all <ChevronRight size={12} />
              </Link>
            </div>
            {isLoading ? (
              <div className="space-y-2">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-8 rounded" />)}</div>
            ) : (
              <div className="space-y-2">
                {Object.entries(analytics?.ordersByStatus || {}).map(([status, count]) => {
                  const Icon = STATUS_ICONS[status as OrderStatus] || Package;
                  const color = STATUS_COLORS[status as OrderStatus] || '#888';
                  return (
                    <Link
                      key={status}
                      href={`/admin/orders?status=${status}`}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#f8f9fa] transition-colors"
                    >
                      <Icon size={15} style={{ color }} />
                      <span className="text-sm text-[#444] flex-1 capitalize">
                        {status.replace(/_/g, ' ').toLowerCase()}
                      </span>
                      <span className="font-bold text-sm" style={{ color }}>{count}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Top Products */}
          <div className="card p-5 lg:col-span-2">
            <h2 className="font-black text-[#111] text-sm mb-4">Top Products</h2>
            {isLoading ? (
              <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
            ) : (
              <div className="space-y-3">
                {analytics?.topProducts?.map(({ product, orderCount, revenue }, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f8f9fa] flex items-center justify-center font-black text-sm text-[#888]">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#111] line-clamp-1">{product?.name}</p>
                      <p className="text-xs text-[#888]">{orderCount} orders</p>
                    </div>
                    <p className="font-bold text-[#111] text-sm flex-shrink-0">{formatPrice(revenue)}</p>
                  </div>
                ))}
                {(!analytics?.topProducts || analytics.topProducts.length === 0) && (
                  <p className="text-sm text-[#888] text-center py-4">No data yet</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { href: '/admin/orders', label: 'Manage Orders', icon: ShoppingBag, color: '#00AEEF' },
            { href: '/admin/products', label: 'Manage Products', icon: Package, color: '#EC008C' },
            { href: '/admin/customers', label: 'Customers', icon: Users, color: '#FFD700' },
          ].map(({ href, label, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className="card p-4 flex items-center gap-3 hover:scale-[1.02] transition-transform"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}18` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <span className="font-semibold text-sm text-[#111]">{label}</span>
              <ChevronRight size={14} className="text-[#ccc] ml-auto" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
