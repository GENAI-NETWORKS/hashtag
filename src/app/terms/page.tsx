"use client";

import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#f0f0f0]">
        <div className="flex items-center gap-3 px-4 h-14 max-w-md mx-auto">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-[#111]" />
          </button>
          <h1 className="text-[17px] font-bold text-[#111]">Terms & Conditions</h1>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6 max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#f8f9fa] flex items-center justify-center border border-[#e5e7eb] shadow-sm">
            <FileText size={24} className="text-[#111]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#111]">Terms of Use</h2>
            <p className="text-sm text-[#888]">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="prose prose-sm prose-slate max-w-none text-[#444]">
          <h3>1. Introduction</h3>
          <p>Welcome to Hashtag Custom Prints. By accessing or using our website, you agree to be bound by these Terms of Use.</p>
          
          <h3>2. User Accounts</h3>
          <p>When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password that you use to access the service.</p>
          
          <h3>3. Intellectual Property</h3>
          <p>The Service and its original content (excluding content provided by you), features and functionality are and will remain the exclusive property of Hashtag Custom Prints and its licensors.</p>
          
          <h3>4. Custom Prints & Copyright</h3>
          <p>You agree not to upload any content that infringes on the copyrights, trademarks, or intellectual property rights of any third party. We reserve the right to refuse printing of any materials that violate these terms.</p>
          
          <h3>5. Order Cancellation & Refunds</h3>
          <p>Due to the customized nature of our products, orders cannot be cancelled once production has started. Refunds are only issued for defective or damaged goods upon delivery.</p>
          
          <h3>6. Contact Us</h3>
          <p>If you have any questions about these Terms, please contact us at hashtagprintsindia@gmail.com.</p>
        </div>
      </main>
    </div>
  );
}
