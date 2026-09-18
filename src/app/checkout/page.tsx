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
  "Magic is happening in the print shop right now! 🪄",
  "You clicked 'Order', we clicked 'Go Mode'! ⚡",
  "Your custom prints are baking in the oven! 🍪",
  "We're firing up the printers just for you! 🔥",
  "Brace yourself for some awesome custom prints! 🎉",
  "Your order is locked, loaded, and ready for action! 🎯"
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
    } else if (items.length === 0 && step !== 3) {
      router.push('/cart');
    }
  }, [user, items, router, mounted, step]);

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
  useEffect(() => {
    if (step === 3 && placedOrderId) {
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.4 },
          colors: ['#00AEEF', '#EC008C', '#FFD700', '#16a34a'],
          zIndex: 9999
        });
      });
    }
  }, [step, placedOrderId]);

  if (step === 3 && placedOrderId) {
    const randomQuote = SUCCESS_QUOTES[placedOrderId % SUCCESS_QUOTES.length]; // Deterministic based on order ID for consistency during re-renders

    return (
      <div className="container-app min-h-[85vh] py-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-700">
        
        {/* Animated Checkmark and Glow */}
        <div className="relative mb-6 w-32 h-32 flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-[#16a34a]/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-0 bg-[#00AEEF]/20 rounded-full blur-2xl animate-pulse delay-75" style={{ animationDuration: '4s' }} />
          
          <div className="relative z-10 w-20 h-20 bg-gradient-to-tr from-[#16a34a] to-[#22c55e] rounded-full shadow-2xl shadow-green-500/30 flex items-center justify-center animate-bounce" style={{ animationDuration: '2s' }}>
            <CheckCircle2 size={48} className="text-white drop-shadow-md" />
          </div>
          
          {/* Confetti Elements */}
          <div className="absolute top-0 right-2 text-3xl animate-ping opacity-80" style={{ animationDuration: '3s' }}>🎉</div>
          <div className="absolute bottom-2 left-0 text-2xl animate-pulse opacity-90">✨</div>
          <div className="absolute top-6 left-2 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎈</div>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-[#111] mb-5 tracking-tight leading-tight">
          Woohoo! <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00AEEF] to-[#EC008C]">Order Placed!</span>
        </h1>
        
        <div className="relative px-6 py-5 rounded-2xl bg-gradient-to-br from-[#f8f9fa] to-white border border-[#e5e7eb] shadow-sm mb-6 w-full max-w-sm mx-auto">
          <div className="absolute -left-2 -top-3 text-4xl opacity-20 text-[#EC008C]">❝</div>
          <p className="text-[16px] font-bold text-[#444] z-10 relative leading-snug">
            {randomQuote}
          </p>
          <div className="absolute -right-1 -bottom-5 text-4xl opacity-20 text-[#00AEEF]">❞</div>
        </div>

        <div className="bg-[#f8f9fa] w-full max-w-sm mx-auto rounded-2xl p-4 mb-6 border border-[#e5e7eb] text-left grid grid-cols-2 gap-4">
          <div className="border-r border-[#e5e7eb]">
            <p className="text-[12px] sm:text-xs text-[#888] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
              <CheckCircle2 size={12} className="text-[#00AEEF]" /> Order ID
            </p>
            <p className="text-xl sm:text-2xl font-black text-[#111]">#{placedOrderId}</p>
          </div>
          <div className="pl-2">
             <p className="text-[12px] sm:text-xs text-[#888] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
               <MapPin size={12} className="text-[#EC008C]" /> Delivery By
             </p>
             <p className="text-lg sm:text-xl font-black text-[#16a34a]">
               {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                 weekday: 'short', day: '2-digit', month: 'short'
               })}
             </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm mx-auto">
          <Link href={`/orders/${placedOrderId}`} className="btn btn-primary px-6 w-full sm:w-fit font-bold shadow-xl shadow-[#00AEEF]/20 group">
            Track My Order <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/products" className="btn btn-outline px-6 w-full sm:w-fit font-bold border-2 hover:bg-black hover:text-white transition-colors">
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
              <span className="badge badge-cyan text-[12px]">Mock Mode</span>
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
