'use client';

import { Suspense } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Truck, CheckCircle2, Clock, XCircle, ChevronLeft, ChevronRight, RefreshCcw } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/Skeleton';

// Define the OrderStatus enum to match our DB
type OrderStatus = 'PENDING' | 'DESIGN_CONFIRMED' | 'PRINTING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

// Minimal Order type for the admin list
interface Order {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  address?: any;
  items?: any[];
}

const STATUS_OPTIONS: { label: string; value: string; color: string; icon: any }[] = [
  { label: 'All Orders', value: '', color: '#111111', icon: Package },
  { label: 'Pending', value: 'PENDING', color: '#f59e0b', icon: Clock },
  { label: 'Confirmed', value: 'DESIGN_CONFIRMED', color: '#3b82f6', icon: CheckCircle2 },
  { label: 'Printing', value: 'PRINTING', color: '#8b5cf6', icon: Package },
  { label: 'Shipped', value: 'SHIPPED', color: '#ec008c', icon: Truck },
  { label: 'Delivered', value: 'DELIVERED', color: '#10b981', icon: CheckCircle2 },
  { label: 'Cancelled', value: 'CANCELLED', color: '#ef4444', icon: XCircle },
];

const NEXT_STATUSES: Record<OrderStatus, OrderStatus | null> = {
  PENDING: 'DESIGN_CONFIRMED',
  DESIGN_CONFIRMED: 'PRINTING',
  PRINTING: 'SHIPPED',
  SHIPPED: 'DELIVERED',
  DELIVERED: null,
  CANCELLED: null,
};

async function fetchAdminOrders(status: string, page: number) {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (page) params.set('page', page.toString());

  const res = await fetch(`/api/admin/orders?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

async function updateOrderStatus(id: number, status: OrderStatus, note?: string) {
  const res = await fetch(`/api/admin/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, note }),
  });
  return res.json();
}

function OrderRow({ order, onStatusUpdate }: { order: Order; onStatusUpdate: (id: number, s: OrderStatus) => void }) {
  const config = STATUS_OPTIONS.find((s) => s.value === order.status);
  const StatusIcon = config?.icon || Package;
  const nextStatus = NEXT_STATUSES[order.status as OrderStatus];

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-[#111] text-sm">Order #{order.id}</span>
            <span
              className="badge text-[10px] flex items-center gap-1 px-2 py-0.5"
              style={{ background: `${config?.color}18`, color: config?.color }}
            >
              <StatusIcon size={10} />
              {config?.label}
            </span>
          </div>
          <p className="text-xs text-[#888] mt-0.5">
            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <p className="font-black text-[#111]">{formatPrice(Number(order.total))}</p>
      </div>

      {/* Customer info */}
      {(order as any).user && (
        <div className="text-xs text-[#888] space-y-0.5">
          <p className="font-semibold text-[#444]">{(order as any).user.name}</p>
          <p>{(order as any).user.email} | {(order as any).user.phone || 'No phone'}</p>
          {order.address && (
            <p>{order.address.city}, {(order.address as any).pincode}</p>
          )}
        </div>
      )}

      {/* Items preview */}
      <div className="text-xs text-[#888]">
        {order.items?.slice(0, 2).map((item) => (
          <span key={item.id} className="inline-block mr-2">
            {item.product?.name?.split(' ').slice(0, 3).join(' ')} x{item.quantity}
          </span>
        ))}
        {(order.items?.length || 0) > 2 && (
          <span>+{(order.items?.length || 0) - 2} more</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        <Link
          href={`/orders/${order.id}`}
          className="btn btn-ghost btn-sm text-[#00AEEF] text-xs px-3"
        >
          View Details
        </Link>

        {nextStatus && (
          <button
            onClick={() => onStatusUpdate(order.id, nextStatus)}
            className="btn btn-sm text-xs px-3"
            style={{ background: `${config?.color}18`, color: config?.color, border: `1px solid ${config?.color}30` }}
          >
            Mark as {STATUS_OPTIONS.find((s) => s.value === nextStatus)?.label}
          </button>
        )}

        {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
          <button
            onClick={() => onStatusUpdate(order.id, 'CANCELLED')}
            className="btn btn-sm text-xs px-3 text-[#dc2626]"
            style={{ background: '#fee2e2', border: '1px solid #fecaca' }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const status = searchParams.get('status') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-orders', status, page],
    queryFn: () => fetchAdminOrders(status, page),
    refetchInterval: 30 * 1000,
  });

  const mutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: number; newStatus: OrderStatus }) =>
      updateOrderStatus(id, newStatus),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Order status updated');
        queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      } else {
        toast.error(result.error || 'Failed to update status');
      }
    },
    onError: () => toast.error('Failed to update order status'),
  });

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.delete('page');
    router.push(`/admin/orders?${params.toString()}`);
  };

  const orders: Order[] = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="touch-target text-[#888] hover:text-[#111]">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-[#111]">Orders</h1>
            {data && <p className="text-xs text-[#888]">{data.total} total orders</p>}
          </div>
        </div>
        <button onClick={() => refetch()} className="touch-target text-[#888] hover:text-[#111]">
          <RefreshCcw size={16} />
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {STATUS_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isActive = status === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => updateParam('status', opt.value)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold flex-shrink-0 transition-all"
              style={{
                background: isActive ? opt.color : '#f8f9fa',
                color: isActive ? 'white' : '#888',
                border: isActive ? 'none' : '1px solid #e5e7eb',
              }}
            >
              <Icon size={12} />
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Orders list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={40} className="mx-auto text-[#ccc] mb-3" />
          <p className="text-[#888] font-medium">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onStatusUpdate={(id, newStatus) =>
                mutation.mutate({ id, newStatus })
              }
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            disabled={page <= 1}
            onClick={() => updateParam('page', (page - 1).toString())}
            className="btn btn-outline btn-sm disabled:opacity-40"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="text-sm text-[#888]">Page {page} / {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => updateParam('page', (page + 1).toString())}
            className="btn btn-outline btn-sm disabled:opacity-40"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <div className="max-w-4xl mx-auto p-5">
      <Suspense fallback={<div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}</div>}>
        <AdminOrdersContent />
      </Suspense>
    </div>
  );
}
