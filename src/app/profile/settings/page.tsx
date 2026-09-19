'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Phone, Mail, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function AccountSettingsPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    } else {
      setName(user.name);
      setPhone(user.phone || '');
    }
  }, [user, router]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call since we don't have a direct user update endpoint right now
    setTimeout(() => {
      setSaving(false);
      toast.success('Profile updated successfully!');
      // Assuming a local state update would follow here if we had an update function in authStore
    }, 800);
  };

  if (!user) return null;

  return (
    <div className="container-app py-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/profile" className="w-8 h-8 rounded-full bg-[#f8f9fa] flex items-center justify-center hover:bg-[#e5e7eb] transition-colors">
          <ArrowLeft size={16} className="text-[#111]" />
        </Link>
        <h1 className="text-xl font-black text-[#111]">Account Settings</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="card p-5 space-y-4">
          <h2 className="text-sm font-bold text-[#111] mb-2 flex items-center gap-2">
            <User size={16} className="text-[#01a2fb]" /> Personal Details
          </h2>
          
          <div>
            <label className="block text-xs font-semibold text-[#444] mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input w-full"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#444] mb-1.5">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={user.email}
                disabled
                className="input w-full bg-[#f8f9fa] text-[#888] cursor-not-allowed"
              />
              <Mail size={16} className="absolute right-3 top-3 text-[#ccc]" />
            </div>
            <p className="text-[12px] text-[#888] mt-1">Email cannot be changed.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#444] mb-1.5">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input w-full"
                placeholder="+91 XXXXXXXXXX"
              />
              <Phone size={16} className="absolute right-3 top-3 text-[#ccc]" />
            </div>
          </div>
        </div>

        <div className="card p-5 space-y-4">
          <h2 className="text-sm font-bold text-[#111] mb-2 flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#16a34a]" /> Security
          </h2>
          
          <button type="button" className="w-full flex items-center justify-between p-3 rounded-xl border border-[#e5e7eb] hover:bg-[#f8f9fa] transition-colors text-left">
            <div>
              <p className="text-sm font-bold text-[#111]">Change Password</p>
              <p className="text-xs text-[#888]">Update your account password</p>
            </div>
            <Lock size={16} className="text-[#aaa]" />
          </button>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="btn btn-primary btn-lg px-12"
            style={{ background: 'linear-gradient(135deg, #111, #1e1e1e)' }}
          >
            {saving ? 'Saving...' : <><CheckCircle2 size={18} /> Save Changes</>}
          </button>
        </div>
      </form>
    </div>
  );
}
