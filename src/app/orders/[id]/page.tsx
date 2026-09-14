'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PackageCheck, Printer, Truck, Home, Clock, XCircle, MapPin, CheckCircle2, Circle } from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatPrice } from '@/lib/utils';

const STATUS_STEPS: Array<{ status: OrderStatus; label: string; icon: typeof Clock; sub: string }> = [
  { status: 'PENDING', label: 'Order Placed', icon: Clock, sub: 'Your order has been received' },
  { status: 'DESIGN_CONFIRMED', label: 'Design Confirmed', icon: PackageCheck, sub: 'Design approved for printing' },
  { status: 'PRINTING', label: 'Printing', icon: Printer, sub: 'Your products are being printed' },
  { status: 'SHIPPED', label: 'Shipped', icon: Truck, sub: 'Out for delivery' },
  { status: 'DELIVERED', label: 'Delivered', icon: Home, sub: 'Enjoy your custom prints!' },
];

const STATUS_ORDER = ['PENDING', 'DESIGN_CONFIRMED', 'PRINTING', 'SHIPPED', 'DELIVERED'];

async function fetchOrder(id: string): Promise<Order> {
  const res = await fetch(`/api/orders/${id}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data;
}

function OrderTimeline({ status, history }: { status: OrderStatus; history: Order['statusHistory'] }) {
  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-[#fee2e2]">
        <XCircle size={20} className="text-[#dc2626]" />
        <div>
          <p className="font-bold text-[#dc2626]">Order Cancelled</p>
          <p className="text-xs text-[#dc2626]/70">
            {history?.find((h) => h.status === 'CANCELLED')?.note || 'This order was cancelled.'}
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_ORDER.indexOf(status);

  return (
    <div className="space-y-0">
      {STATUS_STEPS.map((step, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isPending = i > currentIndex;
        const historyEntry = history?.find((h) => h.status === step.status);
        const Icon = step.icon;

        return (
          <div key={step.status} className="flex gap-4">
            {/* Connector line + icon */}
            <div className="flex flex-col items-center">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500"
                style={{
                  background: isCompleted || isCurrent ? (isCurrent ? '#00AEEF' : '#16a34a') : '#f0f0f0',
                  border: isCurrent ? '3px solid #00AEEF44' : 'none',
                }}
              >
                {isCompleted ? (
                  <CheckCircle2 size={18} className="text-white" />
                ) : isCurrent ? (
                  <Icon size={17} className="text-white" />
                ) : (
                  <Circle size={17} className="text-[#ccc]" />
                )}
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div
                  className="w-0.5 flex-1 my-1 min-h-[32px]"
                  style={{ background: isCompleted ? '#16a34a' : '#e5e7eb' }}
                />
              )}
            </div>

            {/* Text */}
            <div className="pb-6 flex-1 pt-1.5">
              <p
                className="font-bold text-sm"
                style={{ color: isCurrent ? '#00AEEF' : isCompleted ? '#16a34a' : '#aaa' }}
              >
                {step.label}
              </p>
              <p className="text-xs text-[#888] mt-0.5">{step.sub}</p>
              {historyEntry && (
                <p className="text-[10px] text-[#aaa] mt-1">
                  {new Date(historyEntry.createdAt).toLocaleString('en-IN')}
                  {historyEntry.note ? ` - ${historyEntry.note}` : ''}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
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

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', params.id],
    queryFn: () => fetchOrder(params.id),
  });

  if (isLoading) {
    return (
      <div className="container-app py-4 space-y-4">
        <div className="skeleton h-8 w-40 rounded" />
        <div className="skeleton h-48 rounded-2xl" />
        <div className="skeleton h-32 rounded-2xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container-app py-20 text-center">
        <h1 className="text-xl font-black text-[#111] mb-2">Order not found</h1>
        <Link href="/orders" className="btn btn-primary">My Orders</Link>
      </div>
    );
  }

  return (
    <div className="container-app py-4 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#111]">Order #{order.id}</h1>
          <p className="text-xs text-[#888]">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>
        {order.estimatedDelivery && order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
          <div className="text-right">
            <p className="text-[10px] text-[#888]">Est. delivery</p>
            <p className="text-sm font-bold text-[#00AEEF]">
              {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
            </p>
          </div>
        )}
      </div>

      {/* Tracking Timeline */}
      <div className="card p-5">
        <h2 className="font-black text-[#111] text-sm mb-5">Order Tracking</h2>
        <OrderTimeline status={order.status} history={order.statusHistory} />
      </div>

      {/* Items */}
      <div className="card p-4">
        <h2 className="font-bold text-[#111] text-sm mb-4">Items Ordered</h2>
        <div className="space-y-3">
          {order.items?.map((item) => {
            return (
              <div key={item.id} className="flex gap-3 items-center">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#f8f9fa] flex-shrink-0">
                  <Image
                    src={getFirstImage(item.product?.images)}
                    alt={item.product?.name || 'Product'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#111] line-clamp-1">{item.product?.name}</p>
                  {(item.variant?.size || item.variant?.color) && (
                    <p className="text-[10px] text-[#888]">
                      {[item.variant.size, item.variant.color].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  <p className="text-xs text-[#888]">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-[#111] text-sm flex-shrink-0">{formatPrice(Number(item.totalPrice))}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Address */}
      {order.address && (
        <div className="card p-4">
          <h2 className="font-bold text-[#111] text-sm mb-3 flex items-center gap-2">
            <MapPin size={14} className="text-[#EC008C]" /> Delivery Address
          </h2>
          <p className="text-sm text-[#444] font-semibold">{order.address.name}</p>
          <p className="text-sm text-[#888]">{order.address.line1}</p>
          {order.address.line2 && <p className="text-sm text-[#888]">{order.address.line2}</p>}
          <p className="text-sm text-[#888]">{order.address.city}, {order.address.state} - {order.address.pincode}</p>
          <p className="text-sm text-[#888]">{order.address.phone}</p>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="card p-4 space-y-2">
        <h2 className="font-bold text-[#111] text-sm mb-3">Payment Summary</h2>
        <div className="flex justify-between text-sm text-[#444]">
          <span>Subtotal</span><span>{formatPrice(Number(order.subtotal))}</span>
        </div>
        {Number(order.discount) > 0 && (
          <div className="flex justify-between text-sm text-[#16a34a]">
            <span>Discount</span><span>− {formatPrice(Number(order.discount))}</span>
          </div>
        )}
        <div className="flex justify-between text-sm text-[#444]">
          <span>GST (18%)</span><span>{formatPrice(Number(order.tax))}</span>
        </div>
        <div className="cmyk-divider my-1" />
        <div className="flex justify-between font-black text-[#111]">
          <span>Total Paid</span><span>{formatPrice(Number(order.total))}</span>
        </div>
      </div>

    </div>
  );
}
