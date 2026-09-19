'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [loading, setLoading] = useState(false);
  const [roleType, setRoleType] = useState('');
  const [roleOther, setRoleOther] = useState('');
  const [gender, setGender] = useState('');
  const [source, setSource] = useState('');
  const [sourceOther, setSourceOther] = useState('');

  // Redirect if they are already onboarded or not logged in
  useEffect(() => {
    if (!isAuthenticated && !user) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent('/onboarding?callbackUrl=' + callbackUrl)}`);
    } else if (user && user.onboardingCompleted) {
      router.push(callbackUrl);
    }
  }, [user, isAuthenticated, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roleType || !gender || !source) {
      toast.error('Please answer all questions');
      return;
    }
    
    const finalRole = roleType === 'Other' ? roleOther : roleType;
    const finalSource = source === 'Other' ? sourceOther : source;
    
    if (roleType === 'Other' && !finalRole) {
      toast.error('Please specify who you are');
      return;
    }
    if (source === 'Other' && !finalSource) {
      toast.error('Please specify how you heard about us');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleType: finalRole,
          gender,
          source: finalSource,
        }),
      });

      const data = await res.json();

      if (data.success && data.data.user) {
        setUser(data.data.user);
        toast.success('Profile completed successfully!');
        router.push(callbackUrl);
      } else {
        toast.error(data.error || 'Failed to complete profile');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = ['Owner', 'Employee', 'College Student', 'Home Maker', 'Other'];
  const genderOptions = ['Male', 'Female', 'Others'];
  const sourceOptions = ['Instagram', 'WhatsApp', 'Facebook', 'Google', 'Others'];

  if (!user) return null; // Wait for redirect

  return (
    <div className="container-app py-12 md:py-20 flex justify-center items-center min-h-[80vh]">
      <div className="card p-6 sm:p-10 w-full max-w-lg border border-[#e5e7eb] shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#f0f9ff] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#01a2fb]">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-2xl font-black text-[#111] mb-2">Welcome to Hashtag!</h1>
          <p className="text-[#666] text-sm">
            Help us personalize your experience by answering a few quick questions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question 1 */}
          <div className="space-y-3">
            <label className="block font-bold text-[#111]">1. Who are you?</label>
            <div className="flex flex-wrap gap-2">
              {roleOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setRoleType(opt)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border-2 ${
                    roleType === opt
                      ? 'border-[#01a2fb] bg-[#01a2fb]/10 text-[#01a2fb]'
                      : 'border-[#f0f0f0] bg-white text-[#666] hover:border-[#01a2fb]/50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {roleType === 'Other' && (
              <input
                type="text"
                placeholder="Please specify"
                value={roleOther}
                onChange={(e) => setRoleOther(e.target.value)}
                className="input w-full mt-2"
                autoFocus
              />
            )}
          </div>

          {/* Question 2 */}
          <div className="space-y-3">
            <label className="block font-bold text-[#111]">2. Gender</label>
            <div className="flex flex-wrap gap-2">
              {genderOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setGender(opt)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border-2 ${
                    gender === opt
                      ? 'border-[#fa028e] bg-[#fa028e]/10 text-[#fa028e]'
                      : 'border-[#f0f0f0] bg-white text-[#666] hover:border-[#fa028e]/50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Question 3 */}
          <div className="space-y-3">
            <label className="block font-bold text-[#111]">3. How did you hear about us?</label>
            <div className="flex flex-wrap gap-2">
              {sourceOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSource(opt === 'Others' ? 'Other' : opt)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border-2 ${
                    (source === opt || (source === 'Other' && opt === 'Others'))
                      ? 'border-[#fcd502] bg-[#fcd502]/10 text-[#a16207]'
                      : 'border-[#f0f0f0] bg-white text-[#666] hover:border-[#fcd502]/50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {source === 'Other' && (
              <input
                type="text"
                placeholder="Please specify"
                value={sourceOther}
                onChange={(e) => setSourceOther(e.target.value)}
                className="input w-full mt-2"
                autoFocus
              />
            )}
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={loading || !roleType || !gender || !source}
              className="btn btn-primary btn-lg px-12 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={18} className="animate-spin" /> Saving...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Continue <ChevronRight size={18} />
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingContent />
    </Suspense>
  )
}
