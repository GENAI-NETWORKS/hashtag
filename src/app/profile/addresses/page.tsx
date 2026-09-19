'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { MapPin, Plus, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Address } from '@/types';

export default function AddressesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    line1: '',
    line2: '',
    city: 'Salem',
    state: 'Tamil Nadu',
    pincode: '',
    isDefault: false,
  });

  const { data: addresses, isLoading } = useQuery<Address[]>({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await fetch('/api/addresses');
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      return data.data || [];
    },
  });

  const { mutate: addAddress, isPending } = useMutation({
    mutationFn: async (newAddress: typeof formData) => {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Address saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setShowForm(false);
      setFormData({
        name: '', phone: '', line1: '', line2: '', city: 'Salem', state: 'Tamil Nadu', pincode: '', isDefault: false,
      });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to save address');
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.line1 || !formData.city || !formData.pincode) {
      toast.error('Please fill all required fields');
      return;
    }
    addAddress(formData);
  };

  return (
    <div className="container-app py-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/profile" className="w-10 h-10 bg-[#f8f9fa] rounded-xl flex items-center justify-center text-[#111] hover:bg-[#e5e7eb] transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-black text-[#111]">Saved Addresses</h1>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary btn-sm flex items-center gap-2 w-auto"
          >
            <Plus size={16} /> Add New
          </button>
        )}
      </div>

      {showForm && (
        <div className="card p-6 mb-8 border-2 border-[#01a2fb]/20 shadow-xl animate-scaleIn">
          <h2 className="font-bold text-[#111] mb-4">Add New Address</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input"
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#444] mb-1.5">Address Line 1</label>
              <input
                type="text"
                value={formData.line1}
                onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                className="input"
                placeholder="House/Flat no., Street name"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#444] mb-1.5">Address Line 2 (optional)</label>
              <input
                type="text"
                value={formData.line2}
                onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                className="input"
                placeholder="Landmark, Area"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1.5">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1.5">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1.5">Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="input"
                  maxLength={6}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="w-4 h-4 rounded border-[#ccc] text-[#01a2fb] focus:ring-[#01a2fb]"
              />
              <span className="text-sm font-semibold text-[#444]">Set as Default Address</span>
            </label>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-ghost w-auto"
                disabled={isPending}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary w-auto" disabled={isPending}>
                {isPending ? (
                  <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Saving...</span>
                ) : (
                  'Save Address'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#888]">
          <Loader2 size={40} className="animate-spin mb-4" />
          <p>Loading addresses...</p>
        </div>
      ) : addresses?.length === 0 ? (
        <div className="text-center py-16 bg-[#f8f9fa] rounded-3xl border border-[#e5e7eb] border-dashed">
          <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-[#fa028e] shadow-sm">
            <MapPin size={24} />
          </div>
          <h2 className="text-xl font-bold text-[#111] mb-2">No Saved Addresses</h2>
          <p className="text-[#888] text-sm mb-6 max-w-[250px] mx-auto">
            You haven't added any delivery addresses yet. Add one now for faster checkout!
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary w-auto mx-auto shadow-lg shadow-[#01a2fb]/20"
            >
              Add Your First Address
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {addresses?.map((address) => (
            <div key={address.id} className="card p-5 border-l-4 transition-all hover:shadow-lg"
              style={{ borderLeftColor: address.isDefault ? '#01a2fb' : 'transparent' }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#f8f9fa] rounded-xl flex items-center justify-center text-[#444] flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[#111] text-lg truncate">{address.name}</h3>
                    {address.isDefault && (
                      <span className="badge flex items-center gap-1" style={{ background: '#01a2fb15', color: '#01a2fb' }}>
                        <CheckCircle2 size={10} /> Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-[#444] mb-2">{address.phone}</p>
                  <p className="text-sm text-[#888] leading-relaxed">
                    {address.line1}
                    {address.line2 && <>, <br />{address.line2}</>}
                    <br />
                    {address.city}, {address.state} - <span className="font-semibold text-[#111]">{address.pincode}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
