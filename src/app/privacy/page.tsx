"use client";

import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#f0f0f0]">
        <div className="flex items-center gap-3 px-4 h-14 max-w-md mx-auto">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-[#111]" />
          </button>
          <h1 className="text-[17px] font-bold text-[#111]">Privacy Policy</h1>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6 max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#f8f9fa] flex items-center justify-center border border-[#e5e7eb] shadow-sm">
            <ShieldCheck size={24} className="text-[#00AEEF]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#111]">Privacy Policy</h2>
            <p className="text-sm text-[#888]">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="prose prose-sm prose-slate max-w-none text-[#444]">
          <h3>1. Information We Collect</h3>
          <p>We collect information you provide directly to us when you create an account, make a purchase, or contact customer support. This may include your name, email address, phone number, shipping address, and payment information.</p>
          
          <h3>2. How We Use Your Information</h3>
          <p>We use the information we collect to fulfill your orders, provide customer support, send promotional communications (if you opt-in), and improve our website and services.</p>
          
          <h3>3. Sharing Your Information</h3>
          <p>We do not sell your personal information. We may share your information with trusted third-party service providers (like shipping carriers and payment processors) solely for the purpose of fulfilling your orders.</p>
          
          <h3>4. Data Security</h3>
          <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, or destruction.</p>
          
          <h3>5. Your Rights</h3>
          <p>You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us.</p>
          
          <h3>6. Contact Us</h3>
          <p>If you have any questions or concerns about our privacy practices, please contact our Data Protection Officer at hashtagprintsindia@gmail.com.</p>
        </div>
      </main>
    </div>
  );
}
