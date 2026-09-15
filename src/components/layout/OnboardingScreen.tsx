'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

// Using existing product images for the background grid
const bgImages = [
  { src: '/uploads/products/tshirt.jpg', bg: '#ffe0f5' },
  { src: '/uploads/products/A5 Spiral Custom Notebook.png', bg: '#fffdf0' },
  { src: '/uploads/products/Custom Photo Magic Mug.png', bg: '#e0f7ff' },
  { src: '/uploads/products/Premium Canvas Photo Print.png', bg: '#f5f3ff' },
  { src: '/uploads/products/Standard Business Cards (100 pcs).png', bg: '#f0fff4' },
  { src: '/uploads/products/Corporate Gifting Set.png', bg: '#fffbeb' },
  { src: '/uploads/products/Custom Printed Hoodie.png', bg: '#ffe0f5' },
  { src: '/uploads/products/Oversized Drop Shoulder T-Shirt.png', bg: '#f8f9fa' },
  { src: '/uploads/products/Custom Pocket Notebook A6.png', bg: '#fffdf0' },
  { src: '/uploads/products/Enamel Campfire Mug.png', bg: '#e0f7ff' },
  { src: '/uploads/products/Frosted Glass Stein.png', bg: '#f5f3ff' },
  { src: '/uploads/products/Transparent Business Cards (100 pcs).png', bg: '#f0fff4' },
];

export function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[99998] bg-white lg:hidden flex flex-col h-full overflow-hidden">
      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scrollLeft 45s linear infinite;
          width: max-content;
        }
        .animate-scroll-right {
          animation: scrollRight 45s linear infinite;
          width: max-content;
        }
      `}</style>

      {/* Background Grid with Fade */}
      <div className="absolute top-0 left-0 right-0 h-[65%] overflow-hidden pointer-events-none">
        <div className="flex flex-col gap-3 p-3 opacity-90" style={{ transform: 'rotate(-6deg) scale(1.15) translateY(-5%)' }}>
          {/* Row 1 */}
          <div className="flex gap-3 animate-scroll-left">
            {[...bgImages, ...bgImages].map((img, i) => (
              <div key={i} className="w-[100px] h-[100px] flex-shrink-0 rounded-2xl overflow-hidden relative flex items-center justify-center p-2 shadow-sm" style={{ backgroundColor: img.bg }}>
                <Image src={img.src} alt="" fill className="object-contain p-2 mix-blend-multiply" unoptimized />
              </div>
            ))}
          </div>
          {/* Row 2 */}
          <div className="flex gap-3 animate-scroll-right" style={{ animationDuration: '50s' }}>
            {[...bgImages, ...bgImages].reverse().map((img, i) => (
              <div key={i} className="w-[100px] h-[100px] flex-shrink-0 rounded-2xl overflow-hidden relative flex items-center justify-center p-2 shadow-sm" style={{ backgroundColor: img.bg }}>
                <Image src={img.src} alt="" fill className="object-contain p-2 mix-blend-multiply" unoptimized />
              </div>
            ))}
          </div>
          {/* Row 3 */}
          <div className="flex gap-3 animate-scroll-left" style={{ animationDuration: '40s' }}>
            {[...bgImages.slice(4), ...bgImages.slice(0, 4), ...bgImages.slice(4), ...bgImages.slice(0, 4)].map((img, i) => (
              <div key={i} className="w-[100px] h-[100px] flex-shrink-0 rounded-2xl overflow-hidden relative flex items-center justify-center p-2 shadow-sm" style={{ backgroundColor: img.bg }}>
                <Image src={img.src} alt="" fill className="object-contain p-2 mix-blend-multiply" unoptimized />
              </div>
            ))}
          </div>
          {/* Row 4 */}
          <div className="flex gap-3 animate-scroll-right" style={{ animationDuration: '48s' }}>
            {[...bgImages.slice(2), ...bgImages.slice(0, 2), ...bgImages.slice(2), ...bgImages.slice(0, 2)].map((img, i) => (
              <div key={i} className="w-[100px] h-[100px] flex-shrink-0 rounded-2xl overflow-hidden relative flex items-center justify-center p-2 shadow-sm" style={{ backgroundColor: img.bg }}>
                <Image src={img.src} alt="" fill className="object-contain p-2 mix-blend-multiply" unoptimized />
              </div>
            ))}
          </div>
        </div>
        {/* Bottom Fade Gradient (slightly reduced opacity for more visibility) */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />
      </div>

      {/* Skip Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={onComplete}
          className="bg-white text-black font-semibold text-sm px-4 py-2 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.1)] hover:bg-gray-50 active:scale-95 transition-transform"
        >
          Skip login
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center justify-end h-full pb-8 px-6">
        
        {/* Logo */}
        <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 overflow-hidden p-2">
          <Image src="/HP_Logo.png" alt="Hashtag Logo" width={64} height={64} className="object-contain" />
        </div>

        {/* Headings */}
        <h1 className="text-[28px] font-black text-[#222] mb-2 text-center leading-tight">
          Salem&apos;s custom<br />printing app
        </h1>
        <p className="text-[#666] font-semibold text-base mb-8">
          Log In or Sign Up
        </p>

        {/* Input & Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
          <div className="flex gap-2 h-14">
            {/* Country Code Block */}
            <div className="flex items-center gap-1.5 px-3 bg-white border border-gray-300 rounded-xl shadow-sm">
              <span className="text-xl">🇮🇳</span>
              <ChevronDown size={16} className="text-gray-500" />
            </div>

            {/* Phone Input Block */}
            <div className="flex-1 flex items-center bg-white border border-gray-300 rounded-xl shadow-sm px-4 focus-within:border-[#00AEEF] focus-within:ring-1 focus-within:ring-[#00AEEF] transition-all">
              <span className="text-[#333] font-bold text-lg mr-2">+91</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter mobile number"
                className="w-full h-full bg-transparent outline-none text-[#111] font-semibold text-lg placeholder:text-gray-400 placeholder:font-medium"
              />
            </div>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={phone.length < 10}
            className={`h-14 w-full rounded-xl font-bold text-lg transition-all ${
              phone.length >= 10 
                ? 'bg-[#00AEEF] text-white shadow-md active:scale-[0.98]' 
                : 'bg-[#9ca3af] text-white cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </form>

        {/* Terms Text */}
        <p className="text-[11px] text-gray-400 font-medium text-center mt-8">
          By continuing, you agree to our <button className="underline underline-offset-2">Terms of service</button> & <button className="underline underline-offset-2">Privacy policy</button>
        </p>
      </div>
    </div>
  );
}
