'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, CreditCard, CheckCircle2, ChevronRight, Plus, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const TAX_RATE = 0.18;

const SUCCESS_QUOTES = [
  "Your design is about to become a masterpiece! 🎨",
  "From pixels to reality. We're on it! ✨",
  "Good vibes and great prints are on the way! 🚀",
  "Sit back and relax, your custom swag is being prepared! 👕",
  "Magic is happening in the print shop right now! 🪄"
];

const STEPS = [
  { id: 1, label: 'Address' },
  { id: 2, label: 'Review' },
  { id: 3, label: 'Payment' },
];

interface AddressForm {
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const clearCart = useCartStore((s) => s.clearCart);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<number | null>(null);
  const [address, setAddress] = useState<AddressForm>({
    name: user?.name || '',
    phone: user?.phone || '',
    line1: '',
    line2: '',
    city: 'Salem',
    state: 'Tamil Nadu',
    pincode: '',
  });

  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fetch user's saved addresses to pre-fill
    const fetchAddress = async () => {
      try {
        const res = await fetch('/api/addresses');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          const addr = data.data[0]; // latest/default address
          setAddress({
            name: addr.name,
            phone: addr.phone,
            line1: addr.line1,
            line2: addr.line2 || '',
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
          });
          setStep(2); // Jump straight to Review step
        }
      } catch (err) {
        console.error('Failed to fetch addresses', err);
      }
    };
    if (user && items.length > 0) {
      fetchAddress();
    }
  }, [user]);

  useEffect(() => {
    if (!mounted) return;

    if (!user) {
      router.push('/auth/login?mode=register&callbackUrl=/checkout');
    } else if (!user.onboardingCompleted) {
      router.push('/onboarding?callbackUrl=/checkout');
    } else if (items.length === 0) {
      router.push('/cart');
    }
  }, [user, items, router, mounted]);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // First create address
      const addrRes = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address),
      });
      const addrData = await addrRes.json();

      if (!addrData.success) {
        toast.error('Failed to save address');
        setLoading(false);
        return;
      }

      // Place order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addressId: addrData.data.id, items }),
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        toast.error(orderData.error || 'Failed to place order');
        setLoading(false);
        return;
      }

      clearCart();
      setPlacedOrderId(orderData.data.id);
      setStep(3);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Order success screen
  if (step === 3 && placedOrderId) {
    const randomQuote = SUCCESS_QUOTES[placedOrderId % SUCCESS_QUOTES.length]; // Deterministic based on order ID for consistency during re-renders

    return (
      <div className="container-app py-10 md:py-16 max-w-lg mx-auto text-center animate-fadeInUp">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#00AEEF] to-[#EC008C] rounded-[2rem] rotate-45 opacity-20 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-bl from-[#FFD700] to-[#16a34a] rounded-[2rem] rotate-12 opacity-20" />
          <div className="relative w-full h-full bg-white rounded-3xl shadow-xl flex items-center justify-center border-4 border-white z-10 animate-bounce" style={{ animationDuration: '2s' }}>
            <CheckCircle2 size={56} className="text-[#16a34a]" />
          </div>
          {/* Confetti specs (CSS) */}
          <div className="absolute -top-4 -left-4 text-2xl animate-spin" style={{ animationDuration: '4s' }}>✨</div>
          <div className="absolute -bottom-2 -right-4 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎉</div>
          <div className="absolute top-10 -right-8 text-xl animate-pulse">🚀</div>
        </div>

        <h1 className="text-3xl font-black text-[#111] mb-3 bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #111, #444)' }}>
          Order Confirmed!
        </h1>
        
        <div className="inline-block px-4 py-2 rounded-full bg-[#f8f9fa] border border-[#e5e7eb] mb-6 shadow-sm">
          <p className="text-sm font-bold text-[#EC008C] italic">
            &ldquo;{randomQuote}&rdquo;
          </p>
        </div>

        <p className="text-[#666] text-sm mb-8 leading-relaxed max-w-sm mx-auto">
          Your order <strong className="text-[#111] px-1 bg-[#e0f7ff] rounded">#{placedOrderId}</strong> has been placed successfully. 
          Our print masters are reviewing your design right now.
        </p>

        <div className="card p-5 mb-8 text-left bg-gradient-to-r from-[#f8f9fa] to-white border-l-4 border-l-[#00AEEF]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#e0f7ff] flex items-center justify-center">
              <MapPin size={16} className="text-[#00AEEF]" />
            </div>
            <div>
              <p className="text-xs text-[#888] font-bold uppercase tracking-wide">Delivery Expected By</p>
              <p className="font-black text-[#111] text-lg">
                {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                  weekday: 'short', day: '2-digit', month: 'long'
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={`/orders/${placedOrderId}`} className="btn btn-primary btn-lg flex-1 shadow-lg shadow-[#00AEEF]/20" style={{ background: 'linear-gradient(135deg,#00AEEF,#0090c5)' }}>
            Track My Order <ChevronRight size={18} />
          </Link>
          <Link href="/products" className="btn btn-outline btn-lg flex-1 border-2">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-4 max-w-2xl mx-auto">

      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: step >= s.id ? '#00AEEF' : '#f0f0f0',
                  color: step >= s.id ? 'white' : '#aaa',
                }}
              >
                {step > s.id ? <CheckCircle2 size={14} /> : s.id}
              </div>
              <span className="text-xs font-semibold hidden sm:block"
                style={{ color: step >= s.id ? '#00AEEF' : '#aaa' }}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-8 h-0.5 rounded" style={{ background: step > s.id ? '#00AEEF' : '#e5e7eb' }} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Address */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={18} className="text-[#EC008C]" />
            <h2 className="font-black text-[#111]">Delivery Address</h2>
          </div>

          <div className="card p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={address.name}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  className="input"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="input"
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#444] mb-1.5">Address Line 1</label>
              <input
                type="text"
                value={address.line1}
                onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                className="input"
                placeholder="House/Flat no., Street name"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#444] mb-1.5">Address Line 2 (optional)</label>
              <input
                type="text"
                value={address.line2}
                onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                className="input"
                placeholder="Landmark, Area"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1.5">City</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1.5">State</label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1.5">Pincode</label>
                <input
                  type="text"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="input"
                  maxLength={6}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                if (!address.name || !address.phone || !address.line1 || !address.city || !address.pincode) {
                  toast.error('Please fill all required fields');
                  return;
                }
                setStep(2);
              }}
              className="btn btn-primary btn-lg w-auto px-8"
            >
              Continue to Review <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Review & Payment */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard size={18} className="text-[#00AEEF]" />
            <h2 className="font-black text-[#111]">Review & Payment</h2>
          </div>

          {/* Address summary */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[#111]">Delivering to</h3>
              <button onClick={() => setStep(1)} className="text-xs text-[#00AEEF] font-semibold">Change</button>
            </div>
            <p className="text-sm font-semibold text-[#444]">{address.name}</p>
            <p className="text-xs text-[#888]">{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
            <p className="text-xs text-[#888]">{address.city}, {address.state} - {address.pincode}</p>
          </div>

          {/* Items */}
          <div className="card p-4">
            <h3 className="text-sm font-bold text-[#111] mb-3">{items.length} Items</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-[#444]">
                    {item.product.name.split(' ').slice(0, 4).join(' ')} �- {item.quantity}
                  </span>
                  <span className="font-semibold">
                    {formatPrice((Number(item.product.basePrice) + Number(item.variant?.priceModifier || 0)) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price summary */}
          <div className="card p-4 space-y-2">
            <div className="flex justify-between text-sm text-[#444]">
              <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-[#444]">
              <span>GST (18%)</span><span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between text-sm text-[#888]">
              <span>Delivery</span><span className="text-[#16a34a] font-semibold">{total >= 999 ? 'Free' : formatPrice(49)}</span>
            </div>
            <div className="cmyk-divider" />
            <div className="flex justify-between font-black text-[#111]">
              <span>Total</span><span>{formatPrice(total + (total >= 999 ? 0 : 49))}</span>
            </div>
          </div>

          {/* Mock Payment */}
          <div className="card p-4 border-2 border-[#00AEEF]/20">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard size={16} className="text-[#00AEEF]" />
              <h3 className="text-sm font-bold text-[#111]">Payment</h3>
              <span className="badge badge-cyan text-[10px]">Mock Mode</span>
            </div>
            <p className="text-xs text-[#888]">
              Payment gateway (Razorpay) will be integrated here. Click &ldquo;Place Order&rdquo; to simulate a successful payment.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="btn btn-primary btn-lg w-auto px-10"
              style={{ background: 'linear-gradient(135deg, #111, #1e1e1e)' }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  Placing Order...
                </span>
              ) : (
                <><CheckCircle2 size={18} /> Place Order - {formatPrice(total)}</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
