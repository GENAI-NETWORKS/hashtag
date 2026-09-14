'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, Tag, ArrowRight, ShoppingBag, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { LocalCartItem } from '@/types';
import toast from 'react-hot-toast';

const TAX_RATE = 0.18;

function CartItemRow({ item }: { item: LocalCartItem }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const basePrice = Number(item.product.basePrice);
  const variantMod = Number(item.variant?.priceModifier || 0);
  const unitPrice = basePrice + variantMod;
  const images = item.product.images as string[];

  const handleRemove = () => {
    removeItem(item.id);
    toast('Item removed from cart', {
      icon: null,
      style: { background: '#111', color: '#fff' },
      duration: 2000,
    });
  };

  return (
    <div className="card p-4 flex gap-3 items-start animate-fadeInUp">
      {/* Product Image */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-[#f8f9fa]">
        <Image
          src={images[0] || '/uploads/placeholder.jpg'}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-[#888] font-medium mb-0.5 truncate">
          {item.product.category?.name}
        </p>
        <h3 className="text-sm font-semibold text-[#111] line-clamp-2 leading-snug">
          {item.product.name}
        </h3>

        {/* Variant info */}
        {(item.variant?.size || item.variant?.color) && (
          <div className="flex gap-1.5 mt-1 flex-wrap">
            {item.variant.size && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0f9ff] text-[#00AEEF] font-semibold">
                {item.variant.size}
              </span>
            )}
            {item.variant.color && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f8f9fa] text-[#444] font-medium">
                {item.variant.color}
              </span>
            )}
          </div>
        )}

        {/* Customization indicator */}
        {item.customization && (
          <p className="text-[10px] text-[#EC008C] font-medium mt-1 flex items-center gap-1">
            <Tag size={9} /> Custom design applied
          </p>
        )}

        {/* Price + Qty */}
        <div className="flex items-center justify-between mt-2.5">
          <span className="font-black text-[#111] text-base">
            {formatPrice(unitPrice * item.quantity)}
          </span>

          <div className="flex items-center gap-2">
            {/* Delete */}
            <button
              onClick={handleRemove}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#ffe0f5] text-[#aaa] hover:text-[#EC008C] transition-colors"
              aria-label="Remove item"
            >
              <Trash2 size={13} />
            </button>

            {/* Qty Stepper */}
            <div className="qty-stepper">
              <button
                className="qty-btn"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                aria-label="Decrease quantity"
              >
                <Minus size={12} />
              </button>
              <span className="qty-count">{item.quantity}</span>
              <button
                className="qty-btn"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                aria-label="Increase quantity"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const discount = appliedCoupon?.discount || 0;
  const taxableAmount = subtotal - discount;
  const tax = Math.round(taxableAmount * TAX_RATE);
  const total = taxableAmount + tax;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    // Validate coupon against API
    try {
      const res = await fetch(`/api/coupons/validate?code=${couponCode.toUpperCase()}&subtotal=${subtotal}`);
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon({ code: couponCode.toUpperCase(), discount: data.data.discount });
        toast.success(`Coupon applied! You save ${formatPrice(data.data.discount)}`);
      } else {
        toast.error(data.error || 'Invalid coupon code');
      }
    } catch {
      toast.error('Failed to validate coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-app py-20 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
          style={{ background: 'linear-gradient(135deg, #e0f7ff, #ffe0f5)' }}>
          <ShoppingBag size={40} className="text-[#00AEEF]" />
        </div>
        <h1 className="text-2xl font-black text-[#111] mb-2">Your cart is empty</h1>
        <p className="text-[#888] text-sm mb-8 max-w-xs">
          Add some amazing custom prints to your cart and they&apos;ll show up here.
        </p>
        <Link href="/products" className="btn btn-primary px-5 sm:btn-lg sm:px-8 mx-auto w-max">
          Browse Products <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-4">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-black text-[#111]">
          Your Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>
        <button
          onClick={() => { clearCart(); toast('Cart cleared'); }}
          className="text-xs text-[#888] hover:text-[#EC008C] font-medium transition-colors flex items-center gap-1"
        >
          <Trash2 size={12} /> Clear all
        </button>
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3 mb-6 lg:mb-0">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-3">
          {/* Coupon */}
          <div className="card p-4">
            <h3 className="font-bold text-sm text-[#111] mb-3 flex items-center gap-2">
              <Tag size={14} className="text-[#00AEEF]" /> Coupon Code
            </h3>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#dcfce7] border border-[#16a34a]/20">
                <div>
                  <p className="font-bold text-[#16a34a] text-sm">{appliedCoupon.code}</p>
                  <p className="text-xs text-[#16a34a]">You save {formatPrice(appliedCoupon.discount)}</p>
                </div>
                <button
                  onClick={() => setAppliedCoupon(null)}
                  className="text-[#16a34a] hover:text-[#dc2626]"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="input flex-1 text-sm"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !couponCode.trim()}
                  className="btn btn-primary btn-sm px-4 disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="card p-4 space-y-3">
            <h3 className="font-bold text-sm text-[#111]">Order Summary</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[#444]">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#16a34a]">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span className="font-semibold">− {formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#444]">
                <span>GST (18%)</span>
                <span className="font-semibold">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-[#888] text-xs">
                <span>Delivery</span>
                <span className="text-[#16a34a] font-semibold">
                  {total >= 999 ? 'Free' : formatPrice(49)}
                </span>
              </div>
            </div>

            <div className="cmyk-divider" />

            <div className="flex justify-between font-black text-[#111] text-base">
              <span>Total</span>
              <span>{formatPrice(total + (total >= 999 ? 0 : 49))}</span>
            </div>

            {total < 999 && (
              <p className="text-[10px] text-[#888] text-center">
                Add {formatPrice(999 - total)} more for free delivery
              </p>
            )}
          </div>

          {/* Checkout CTA */}
          <Link
            href="/checkout"
            className="btn btn-primary btn-lg w-full"
            style={{ background: 'linear-gradient(135deg, #111, #1e1e1e)' }}
          >
            Proceed to Checkout
            <ChevronRight size={18} />
          </Link>
          <Link href="/products" className="btn btn-ghost btn-sm w-full text-[#888]">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
