'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Mic,
  Flame,
  Zap,
  BarChart2,
  BookOpen,
  Volume2,
  Compass,
  Repeat,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { UserStore, LocalUserProfile } from '@/lib/storage/userStore';
import { UserProgress } from '@/lib/types';
import { calculateLevel } from '@/lib/gamification';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<LocalUserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setUser(UserStore.getUser());
    setProgress(UserStore.getProgress());
  }, []);

  const levelInfo = progress ? calculateLevel(progress.totalXp) : { level: 1, title: 'Novice' };

  const navLinks = [
    { href: '/app', label: 'Dashboard', icon: Sparkles },
    { href: '/conversation', label: 'Speak Now', icon: Mic, highlight: true },
    { href: '/modes', label: 'Modes', icon: Compass },
    { href: '/shadow', label: 'Shadow', icon: Repeat },
    { href: '/vocabulary', label: 'Vault', icon: BookOpen },
    { href: '/journal', label: 'Journal', icon: Volume2 },
    { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0A0C10]/80 border-b border-[#1A202C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D4F82A] to-[#80A300] flex items-center justify-center shadow-lg shadow-[#D4F82A]/20 transition-transform group-hover:scale-105">
                <span className="font-black text-black text-lg tracking-wider">V</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                  VOXORA
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4F82A] animate-pulse"></span>
                </span>
                <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase -mt-1">
                  AI Speaking Companion
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 bg-[#12161F]/60 p-1.5 rounded-full border border-[#1E2533]">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    link.highlight
                      ? 'bg-[#D4F82A] text-black font-semibold shadow-sm hover:bg-[#c2e424]'
                      : isActive
                      ? 'bg-[#202736] text-white shadow-inner'
                      : 'text-zinc-400 hover:text-white hover:bg-[#1A202C]/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${link.highlight ? 'text-black' : ''}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User Gamification Stats & Profile */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Streak Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161B26] border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
              <span>{progress?.streakDays || 1}d Streak</span>
            </div>

            {/* Level / XP Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161B26] border border-[#D4F82A]/20 text-[#D4F82A] text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 fill-[#D4F82A]" />
              <span>Lv.{levelInfo.level} • {progress?.totalXp || 150} XP</span>
            </div>

            {/* Profile Avatar / Quick Link */}
            <Link
              href="/app"
              className="w-8 h-8 rounded-full ring-2 ring-[#222B3D] overflow-hidden hover:ring-[#D4F82A] transition-all"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-[#161B26]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1E2533] bg-[#0E1117] px-4 pt-3 pb-5 space-y-2">
          <div className="flex items-center justify-between pb-3 border-b border-[#1A202C] mb-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-xs text-amber-300 font-bold">{progress?.streakDays || 1}-Day Streak</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#D4F82A] fill-[#D4F82A]" />
              <span className="text-xs text-[#D4F82A] font-bold">Level {levelInfo.level} ({progress?.totalXp} XP)</span>
            </div>
          </div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  link.highlight
                    ? 'bg-[#D4F82A] text-black font-bold'
                    : isActive
                    ? 'bg-[#1C2333] text-white'
                    : 'text-zinc-300 hover:bg-[#161B26]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
