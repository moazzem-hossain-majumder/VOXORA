'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mic,
  Flame,
  Zap,
  Clock,
  Award,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  BookOpen,
  Compass,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { UserStore, LocalUserProfile } from '@/lib/storage/userStore';
import { UserProgress, ConversationSession, DailyChallenge } from '@/lib/types';
import { AI_PERSONALITIES } from '@/lib/personalities';
import { CONVERSATION_MODES } from '@/lib/modes';
import { calculateLevel } from '@/lib/gamification';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<LocalUserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);

  useEffect(() => {
    setUser(UserStore.getUser());
    setProgress(UserStore.getProgress());
    setSessions(UserStore.getSessions());
    setChallenges(UserStore.getDailyChallenges());
  }, []);

  const levelInfo = progress ? calculateLevel(progress.totalXp) : { level: 1, title: 'Novice', currentLevelXp: 0, nextLevelXp: 300 };
  const lastSession = sessions.length > 0 ? sessions[0] : null;

  const handleCompleteChallenge = (id: string) => {
    UserStore.completeChallenge(id);
    setChallenges(UserStore.getDailyChallenges());
    setProgress(UserStore.getProgress());
  };

  const dailyMinutesGoal = 10;
  const todayMinutes = 4; // Simulated daily speaking minutes today
  const dailyGoalPercent = Math.min(100, Math.round((todayMinutes / dailyMinutesGoal) * 100));

  return (
    <div className="min-h-screen bg-[#0A0C10] text-zinc-100 selection:bg-[#D4F82A] selection:text-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Welcome & Quick Start Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#141822] via-[#11141B] to-[#151B27] border border-[#222B3D] p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-[#D4F82A] tracking-wider font-semibold">
                  Speaking Hub
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4F82A]" />
                <span className="text-xs text-zinc-400 font-mono">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Welcome back, {user?.name || 'Explorer'}!
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                You're on a <strong className="text-amber-400">{progress?.streakDays || 1}-day active streak</strong>. Keep your momentum alive with today's practice session.
              </p>
            </div>

            {/* Hero Quick Start Button */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/conversation"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-[#D4F82A] text-black font-extrabold text-sm sm:text-base shadow-lg shadow-[#D4F82A]/20 hover:bg-[#c2e424] hover:scale-105 active:scale-95 transition-all"
              >
                <Mic className="w-5 h-5 fill-black" />
                <span>Quick Start Talking</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Gamification Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Streak Card */}
          <div className="p-5 rounded-2xl bg-[#121620] border border-[#1E2536] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Streak</span>
              <span className="text-xl font-bold font-mono text-white">{progress?.streakDays || 1} Days</span>
              <span className="text-[10px] text-amber-400 block font-medium">Daily practice on fire</span>
            </div>
          </div>

          {/* Level & XP */}
          <div className="p-5 rounded-2xl bg-[#121620] border border-[#1E2536] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D4F82A]/10 border border-[#D4F82A]/30 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-[#D4F82A] fill-[#D4F82A]" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Level {levelInfo.level}</span>
              <span className="text-xl font-bold font-mono text-white">{progress?.totalXp || 150} XP</span>
              <span className="text-[10px] text-[#D4F82A] block font-medium">{levelInfo.title}</span>
            </div>
          </div>

          {/* Speaking Minutes */}
          <div className="p-5 rounded-2xl bg-[#121620] border border-[#1E2536] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Total Voice Time</span>
              <span className="text-xl font-bold font-mono text-white">{progress?.totalSpeakingMinutes || 42} Mins</span>
              <span className="text-[10px] text-sky-400 block font-medium">Active speech logged</span>
            </div>
          </div>

          {/* Best Score */}
          <div className="p-5 rounded-2xl bg-[#121620] border border-[#1E2536] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Personal Record</span>
              <span className="text-xl font-bold font-mono text-white">{(progress?.bestScore || 8.8).toFixed(1)} / 10</span>
              <span className="text-[10px] text-emerald-400 block font-medium">Highest speaking score</span>
            </div>
          </div>
        </div>

        {/* Daily Goal Progress Bar */}
        <div className="p-5 rounded-2xl bg-[#11141B] border border-[#1E2536] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4F82A]" />
              <span className="text-xs font-bold text-white uppercase font-mono">Daily Speaking Goal: {todayMinutes} / {dailyMinutesGoal} Minutes</span>
            </div>
            <div className="w-full sm:w-80 h-2 bg-[#1A212E] rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-[#D4F82A] rounded-full transition-all duration-500"
                style={{ width: `${dailyGoalPercent}%` }}
              />
            </div>
          </div>
          <Link
            href="/conversation"
            className="text-xs font-bold text-[#D4F82A] hover:underline flex items-center gap-1"
          >
            <span>Complete today's {dailyMinutesGoal - todayMinutes} remaining minutes &rarr;</span>
          </Link>
        </div>

        {/* Main 2-Column Section: Left (Recommended & Personalities), Right (Daily Challenges & Memory) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 spans) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Continue Last Session */}
            {lastSession && (
              <div className="p-5 rounded-2xl bg-[#131722] border border-[#222B3D] flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">Continue Last Session</span>
                  <div className="text-sm font-bold text-white">
                    {lastSession.topic}
                  </div>
                  <div className="text-xs text-zinc-400">
                    With {AI_PERSONALITIES[lastSession.personalityId]?.name} &bull; Score: {lastSession.averageScore || '7.5'}
                  </div>
                </div>
                <Link
                  href={`/conversation?personality=${lastSession.personalityId}&mode=${lastSession.modeId}`}
                  className="px-4 py-2 rounded-xl bg-[#1B2232] hover:bg-[#253046] border border-[#26334A] text-xs font-bold text-zinc-200 flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#D4F82A]" />
                  <span>Resume</span>
                </Link>
              </div>
            )}

            {/* Choose Companion Personalities */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4F82A]" />
                  <span>Choose Your AI Speaking Companion</span>
                </h3>
                <Link href="/conversation" className="text-xs text-[#D4F82A] font-semibold hover:underline">
                  View All &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {Object.values(AI_PERSONALITIES).slice(0, 4).map((p) => (
                  <Link
                    key={p.id}
                    href={`/conversation?personality=${p.id}`}
                    className="p-4 rounded-2xl bg-[#121620] border border-[#1E2536] hover:border-[#D4F82A]/40 transition-all flex items-start gap-3 group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${p.avatarColor} flex items-center justify-center text-black font-black text-sm shrink-0 shadow-sm`}>
                      {p.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white group-hover:text-[#D4F82A] transition-colors">{p.name}</span>
                        <span className="text-[10px] font-mono text-zinc-400">{p.badge}</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{p.tagline}</p>
                      <div className="text-[11px] text-[#D4F82A] font-medium mt-2 flex items-center gap-1">
                        <span>Start Conversation</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Practice Modes Quick Select */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-sky-400" />
                  <span>Popular Conversation Modes</span>
                </h3>
                <Link href="/modes" className="text-xs text-sky-400 font-semibold hover:underline">
                  All 10 Modes &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['interview', 'ielts', 'debate'].map((mKey) => {
                  const mode = CONVERSATION_MODES[mKey as keyof typeof CONVERSATION_MODES];
                  if (!mode) return null;
                  return (
                    <Link
                      key={mode.id}
                      href={`/conversation?mode=${mode.id}`}
                      className="p-4 rounded-2xl bg-[#121620] border border-[#1E2536] hover:border-sky-500/40 transition-all space-y-2 group"
                    >
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#18202D] text-zinc-300 border border-[#222B3D]">
                        {mode.badge}
                      </span>
                      <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                        {mode.name}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-2">
                        {mode.tagline}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Challenges & Recurring Weaknesses */}
          <div className="space-y-6">
            {/* Today's Daily Challenges */}
            <div className="p-5 rounded-2xl bg-[#121620] border border-[#1E2536] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#D4F82A]" />
                  <span>Today's Challenges</span>
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">Resets in 9h</span>
              </div>

              <div className="space-y-2.5">
                {challenges.map((ch) => (
                  <div
                    key={ch.id}
                    className="p-3 rounded-xl bg-[#161B26] border border-[#222B3D] flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        {ch.completed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>{ch.title}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{ch.description}</p>
                      <span className="text-[10px] font-mono text-amber-400 font-bold">+{ch.xpReward} XP</span>
                    </div>

                    <button
                      onClick={() => handleCompleteChallenge(ch.id)}
                      disabled={ch.completed}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                        ch.completed
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-[#D4F82A] text-black hover:bg-[#c2e424]'
                      }`}
                    >
                      {ch.completed ? 'Done' : 'Claim'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversation Memory / Weaknesses Target */}
            <div className="p-5 rounded-2xl bg-[#121620] border border-[#1E2536] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>Targeted Learning Memory</span>
                </h3>
                <Link href="/analytics" className="text-[10px] font-mono text-rose-400 hover:underline">
                  Full Patterns &rarr;
                </Link>
              </div>
              <p className="text-xs text-zinc-400">
                VOXORA automatically detected these recurring slips from your speech:
              </p>

              <div className="space-y-2">
                {progress?.recurringMistakes.slice(0, 2).map((m) => (
                  <div key={m.id} className="p-3 rounded-xl bg-[#161B26] border border-rose-500/20 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-300">{m.category}</span>
                      <span className="text-[10px] font-mono text-zinc-500">{m.frequency}x noted</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 italic">{m.exampleSentence}</p>
                    <div className="text-[10px] text-zinc-400">Drill: {m.recommendedDrill}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Link to Shadow Mode & Voice Journal */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/shadow"
                className="p-4 rounded-2xl bg-[#121620] border border-[#1E2536] hover:border-[#D4F82A]/30 transition-all text-center space-y-1 group"
              >
                <div className="text-sm font-bold text-white group-hover:text-[#D4F82A]">Shadow Mode</div>
                <div className="text-[11px] text-zinc-400">Echo native speech</div>
              </Link>
              <Link
                href="/journal"
                className="p-4 rounded-2xl bg-[#121620] border border-[#1E2536] hover:border-amber-400/30 transition-all text-center space-y-1 group"
              >
                <div className="text-sm font-bold text-white group-hover:text-amber-300">Voice Journal</div>
                <div className="text-[11px] text-zinc-400">Reflect on your day</div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
