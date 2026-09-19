'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Package, ChevronRight, PackageCheck, Printer, Truck, Home, Clock, XCircle } from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatPrice } from '@/lib/utils';
import { OrderCardSkeleton } from '@/components/ui/Skeleton';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: typeof Package; color: string; bg: string }> = {
  PENDING: { label: 'Order Placed', icon: Clock, color: '#d97706', bg: '#fef3c7' },
  DESIGN_CONFIRMED: { label: 'Design Confirmed', icon: PackageCheck, color: '#2563eb', bg: '#dbeafe' },
  PRINTING: { label: 'Printing', icon: Printer, color: '#7c3aed', bg: '#ede9fe' },
  SHIPPED: { label: 'Shipped', icon: Truck, color: '#0090c5', bg: '#e0f7ff' },
  DELIVERED: { label: 'Delivered', icon: Home, color: '#16a34a', bg: '#dcfce7' },
  CANCELLED: { label: 'Cancelled', icon: XCircle, color: '#dc2626', bg: '#fee2e2' },
};

async function fetchOrders(): Promise<Order[]> {
  const res = await fetch('/api/orders');
  const data = await res.json();
  return data.data || [];
}

function getFirstImage(imagesData: any): string {
  if (!imagesData) return '/uploads/placeholder.jpg';
  if (Array.isArray(imagesData)) {
    return imagesData[0] || '/uploads/placeholder.jpg';
  }
  if (typeof imagesData === 'string') {
    if (imagesData.startsWith('[')) {
      try {
        const parsed = JSON.parse(imagesData);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      } catch {
        // ignore
      }
    }
    return imagesData; // fallback
  }
  return '/uploads/placeholder.jpg';
}

function OrderCard({ order }: { order: Order }) {
  const config = STATUS_CONFIG[order.status];
  const StatusIcon = config.icon;
  const itemCount = order.items?.length || 0;

  return (
    <Link href={`/orders/${order.id}`} className="card p-4 block hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-[#888] font-medium">Order #{order.id}</p>
          <p className="text-[12px] text-[#aaa]">
            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <span
          className="badge text-xs px-3 py-1 flex items-center gap-1.5"
          style={{ background: config.bg, color: config.color }}
        >
          <StatusIcon size={11} />
          {config.label}
        </span>
      </div>

      {/* Product thumbnails */}
      <div className="flex gap-2 mb-3">
        {order.items?.slice(0, 3).map((item) => (
          <div key={item.id} className="w-14 h-14 rounded-xl overflow-hidden bg-[#f8f9fa] flex-shrink-0">
            <img
              src={getFirstImage(item.product?.images)}
              alt={item.product?.name || 'Product'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
        {itemCount > 3 && (
          <div className="w-14 h-14 rounded-xl bg-[#f8f9fa] flex items-center justify-center text-xs font-bold text-[#888]">
            +{itemCount - 3}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[#888]">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
          <p className="font-black text-[#111] text-base">{formatPrice(Number(order.total))}</p>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-[#01a2fb]">
          View Details <ChevronRight size={14} />
        </div>
      </div>
    </Link>
  );
}

export default function OrdersPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push('/auth/login');
    }
  }, [user, router, mounted]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    enabled: !!user,
  });

  if (!mounted || !user) return null;

  return (
    <div className="container-app py-4">
      <h1 className="text-xl font-black text-[#111] mb-5">My Orders</h1>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <OrderCardSkeleton key={i} />)}
        </div>
      ) : !orders?.length ? (
        <div className="flex flex-col items-center text-center py-20">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
            style={{ background: 'linear-gradient(135deg, #e0f7ff, #ffe0f5)' }}>
            <Package size={36} className="text-[#01a2fb]" />
          </div>
          <h2 className="text-lg font-black text-[#111] mb-2">No orders yet</h2>
          <p className="text-sm text-[#888] mb-6">Your custom printing orders will appear here.</p>
          <Link href="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
