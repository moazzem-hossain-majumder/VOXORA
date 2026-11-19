'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  LogIn,
  UserPlus
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { UserStore } from '@/lib/storage/userStore';

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = getSupabase();

    if (!supabase) {
      // Offline/Local Demo Mode
      UserStore.setUser({
        id: 'user_' + Date.now(),
        name: fullName || email.split('@')[0] || 'Fluent Speaker',
        email: email || 'demo@voxora.ai',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        isGuest: false,
      });
      setMessage({
        text: 'Signed in with local profile! Redirecting to dashboard...',
        type: 'success',
      });
      setTimeout(() => router.push('/app'), 800);
      return;
    }

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        setMessage({
          text: 'Account created successfully! Check your email or continue to sign in.',
          type: 'success',
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage({ text: 'Signed in successfully! Redirecting...', type: 'success' });
        setTimeout(() => router.push('/app'), 800);
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Authentication failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const supabase = getSupabase();
    if (!supabase) {
      UserStore.setUser({
        id: 'google_user_demo',
        name: 'Google Explorer',
        email: 'google.learner@voxora.ai',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        isGuest: false,
      });
      router.push('/app');
      return;
    }

    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app`,
        },
      });
    } catch (err: any) {
      setMessage({ text: err.message || 'Google OAuth failed', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-zinc-100 selection:bg-[#D4F82A] selection:text-black">
      <Navbar />

      <main className="max-w-md mx-auto px-4 py-16 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D4F82A] to-[#80A300] flex items-center justify-center mx-auto shadow-lg shadow-[#D4F82A]/20">
            <span className="font-black text-black text-xl">V</span>
          </div>
          <h1 className="text-2xl font-black text-white">
            {isSignUp ? 'Create your VOXORA Account' : 'Welcome to VOXORA'}
          </h1>
          <p className="text-xs text-zinc-400">
            Save your speaking streaks, vocabulary vaults, and audio history.
          </p>
        </div>

        {/* Supabase Status Banner */}
        <div className="p-3.5 rounded-xl bg-[#121620] border border-[#212A3A] text-xs flex items-center justify-between">
          <span className="text-zinc-400">Database Status:</span>
          {isSupabaseConfigured ? (
            <span className="text-emerald-400 font-mono flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Supabase Connected
            </span>
          ) : (
            <span className="text-sky-400 font-mono font-medium">
              Zero-Config Local Mode Active
            </span>
          )}
        </div>

        {/* Auth Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#121620] border border-[#222B3D] shadow-2xl space-y-5">
          {message && (
            <div
              className={`p-3 rounded-xl text-xs ${
                message.type === 'success'
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#161C27] hover:bg-[#202736] border border-[#273246] text-xs font-bold text-white transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#1F2738] w-full" />
            <span className="bg-[#121620] px-3 text-[10px] font-mono text-zinc-500 uppercase absolute">
              Or with Email
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleAuth} className="space-y-3.5">
            {isSignUp && (
              <div>
                <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full bg-[#161B26] border border-[#232D3E] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4F82A]"
                />
              </div>
            )}

            <div>
              <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-[#161B26] border border-[#232D3E] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4F82A]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#161B26] border border-[#232D3E] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4F82A]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#D4F82A] text-black font-extrabold text-xs hover:bg-[#c2e424] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Processing...</span>
              ) : isSignUp ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle Sign Up / Sign In */}
          <div className="text-center pt-2">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              {isSignUp ? (
                <span>Already have an account? <strong className="text-[#D4F82A]">Sign in</strong></span>
              ) : (
                <span>Don't have an account? <strong className="text-[#D4F82A]">Sign up free</strong></span>
              )}
            </button>
          </div>
        </div>

        {/* Guest Demo Bypass Button */}
        <div className="text-center">
          <Link
            href="/app"
            className="text-xs text-zinc-500 hover:text-zinc-300 font-mono underline"
          >
            Continue as Guest without account &rarr;
          </Link>
        </div>
      </main>
    </div>
  );
}
