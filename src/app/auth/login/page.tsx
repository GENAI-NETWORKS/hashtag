'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, LogIn, UserPlus, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

function LoginContent() {
  const searchParams = useSearchParams();
  const defaultMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const handleLogin = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!result.success) {
        toast.error(result.error || 'Login failed');
        return;
      }
      setUser(result.data.user);
      toast.success('Welcome back!');
      
      const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl') || '/';
      if (!result.data.user.onboardingCompleted) {
        router.push(`/onboarding?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      } else {
        router.push(callbackUrl);
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!result.success) {
        toast.error(result.error || 'Registration failed');
        return;
      }
      setUser(result.data.user);
      toast.success('Account created! Welcome to Hashtag');
      
      const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl') || '/';
      router.push(`/onboarding?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80dvh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4" aria-label="Hashtag - Home">
            <Image
              src="/HP_Logo.png"
              alt="Hashtag Custom Prints"
              width={160}
              height={56}
              className="h-14 w-auto mx-auto object-contain"
              priority
            />
          </Link>
          <h1 className="text-2xl font-black text-[#111]">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-sm text-[#888] mt-1">
            {mode === 'login'
              ? 'Login to track orders and save your designs'
              : 'Join Hashtag for custom printing in Salem'}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-xl overflow-hidden border border-[#e5e7eb] mb-6 w-fit mx-auto">
          <button
            onClick={() => setMode('login')}
            className="w-28 py-2 text-sm font-bold transition-all duration-200"
            style={{
              background: mode === 'login' ? '#111' : 'white',
              color: mode === 'login' ? 'white' : '#888',
            }}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            className="w-28 py-2 text-sm font-bold transition-all duration-200"
            style={{
              background: mode === 'register' ? '#111' : 'white',
              color: mode === 'register' ? 'white' : '#888',
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#444] mb-1.5">Email</label>
              <input
                {...loginForm.register('email')}
                type="email"
                placeholder="you@example.com"
                className="input"
                autoComplete="email"
              />
              {loginForm.formState.errors.email && (
                <p className="text-xs text-[#EC008C] mt-1">{loginForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#444] mb-1.5">Password</label>
              <div className="relative">
                <input
                  {...loginForm.register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#111]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-xs text-[#EC008C] mt-1">{loginForm.formState.errors.password.message}</p>
              )}
            </div>

            <div className="flex justify-center mt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg px-12"
                style={{ background: 'linear-gradient(135deg, #00AEEF, #0090c5)' }}
              >
                {loading ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Logging in...</span>
                ) : (
                  <><LogIn size={18} /> Login</>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#444] mb-1.5">Full Name</label>
              <input
                {...registerForm.register('name')}
                type="text"
                placeholder="Your name"
                className="input"
                autoComplete="name"
              />
              {registerForm.formState.errors.name && (
                <p className="text-xs text-[#EC008C] mt-1">{registerForm.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#444] mb-1.5">Email</label>
              <input
                {...registerForm.register('email')}
                type="email"
                placeholder="you@example.com"
                className="input"
                autoComplete="email"
              />
              {registerForm.formState.errors.email && (
                <p className="text-xs text-[#EC008C] mt-1">{registerForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#444] mb-1.5">Phone (optional)</label>
              <input
                {...registerForm.register('phone')}
                type="tel"
                placeholder="+91 9876543210"
                className="input"
                autoComplete="tel"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#444] mb-1.5">Password</label>
              <div className="relative">
                <input
                  {...registerForm.register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  className="input pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {registerForm.formState.errors.password && (
                <p className="text-xs text-[#EC008C] mt-1">{registerForm.formState.errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#444] mb-1.5">Confirm Password</label>
              <input
                {...registerForm.register('confirmPassword')}
                type="password"
                placeholder="••••••••"
                className="input"
                autoComplete="new-password"
              />
              {registerForm.formState.errors.confirmPassword && (
                <p className="text-xs text-[#EC008C] mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex justify-center mt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg px-12"
                style={{ background: 'linear-gradient(135deg, #EC008C, #c4006b)' }}
              >
                {loading ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</span>
                ) : (
                  <><UserPlus size={18} /> Create Account</>
                )}
              </button>
            </div>
          </form>
        )}

        <p className="text-center text-xs text-[#aaa] mt-6">
          By continuing, you agree to Hashtag&apos;s{' '}
          <Link href="/terms" className="text-[#00AEEF] hover:underline">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-[#00AEEF] hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  )
}
