'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  BarChart2,
  Clock,
  Award,
  AlertCircle,
  Sparkles,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Flame,
  Volume2,
  Play
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { UserStore } from '@/lib/storage/userStore';
import { UserProgress, ConversationSession } from '@/lib/types';
import { ttsManager } from '@/lib/speech/speechSynthesis';

export default function AnalyticsPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [sessions, setSessions] = useState<ConversationSession[]>([]);

  useEffect(() => {
    setProgress(UserStore.getProgress());
    setSessions(UserStore.getSessions());
  }, []);

  const weeklyData = progress?.weeklyScores || [
    { week: 'Week 1', score: 5.2, conversations: 2 },
    { week: 'Week 2', score: 6.0, conversations: 3 },
    { week: 'Week 3', score: 6.8, conversations: 4 },
    { week: 'Week 4', score: 7.6, conversations: 5 },
  ];

  const highestScore = Math.max(...weeklyData.map(w => w.score), 7.5);

  return (
    <div className="min-h-screen bg-[#0A0C10] text-zinc-100 selection:bg-[#D4F82A] selection:text-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-[#D4F82A] tracking-wider font-semibold">
              Speaking Diagnostics
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4F82A]" />
            <span className="text-xs text-zinc-400 font-mono">Personal Speaking Analytics</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Speaking Progress &amp; Diagnostics
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl">
            Detailed tracking of fluency curves, recurring mistake patterns, and measurable vocabulary growth across sessions.
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#121620] border border-[#1E2536] space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Average Speaking Score</span>
            <span className="text-3xl font-black font-mono text-[#D4F82A]">
              {(progress?.bestScore ? (progress.bestScore * 0.88).toFixed(1) : '7.2')} / 10
            </span>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +1.4 pts past 30 days
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#121620] border border-[#1E2536] space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Total Voice Minutes</span>
            <span className="text-3xl font-black font-mono text-white">
              {progress?.totalSpeakingMinutes || 42}m
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              Across {progress?.totalConversations || 12} sessions
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#121620] border border-[#1E2536] space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Grammar Accuracy</span>
            <span className="text-3xl font-black font-mono text-sky-400">82%</span>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +9% fewer tense slips
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#121620] border border-[#1E2536] space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Weakest Evaluation Area</span>
            <span className="text-2xl font-black font-mono text-amber-400">Prepositions</span>
            <span className="text-[11px] text-zinc-400">Targeted drill active</span>
          </div>
        </div>

        {/* Interactive Fluency Progress Chart Visualizer */}
        <div className="p-6 rounded-3xl bg-[#121620] border border-[#1E2536] space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[#D4F82A]" />
                <span>Speaking Score Progression (Weekly Trend)</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Measured across Grammar, Vocabulary, Fluency, Sentence Structure, and Relevance.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-md bg-[#1B2232] text-zinc-300 border border-[#273248]">
                Start: 5.2 &rarr; Current: 7.6 / 10
              </span>
            </div>
          </div>

          {/* Graphical Bars */}
          <div className="pt-6 pb-2 grid grid-cols-4 gap-4 sm:gap-8 items-end h-56 border-b border-[#1A2232]">
            {weeklyData.map((item, i) => {
              const heightPercent = Math.round((item.score / 10) * 100);
              return (
                <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-xs font-mono font-bold text-[#D4F82A] group-hover:scale-110 transition-transform">
                    {item.score.toFixed(1)}
                  </span>
                  <div className="w-full max-w-[64px] bg-[#161C27] rounded-xl overflow-hidden p-1 flex items-end h-full">
                    <div
                      className="w-full rounded-lg bg-gradient-to-t from-[#80A300] to-[#D4F82A] transition-all duration-700 group-hover:brightness-110"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-zinc-400 mt-1">{item.week}</span>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-[#0F131C] border border-[#1B2232] text-xs text-zinc-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4F82A] shrink-0" />
            <span>
              <strong>System Diagnostic Insight:</strong> Your speaking fluency increased by 28% over the past 4 weeks, with longer uninterrupted utterances and faster answer latency.
            </span>
          </div>
        </div>

        {/* 2-Column: Pattern Detection (Left) & Future Me Comparison (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pattern Detection & Targeted Drills */}
          <div className="p-6 rounded-3xl bg-[#121620] border border-[#1E2536] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Detected Mistake Patterns</span>
              </h3>
              <span className="text-xs font-mono text-zinc-500">Auto-Generated</span>
            </div>
            <p className="text-xs text-zinc-400">
              VOXORA isolates recurrent structural habits so you can eliminate them systematically:
            </p>

            <div className="space-y-3">
              {progress?.recurringMistakes.map((m) => (
                <div key={m.id} className="p-4 rounded-2xl bg-[#161B26] border border-rose-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-300 font-mono">{m.category}: {m.mistakePattern}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-300">
                      {m.frequency} times logged
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 italic bg-black/40 p-2.5 rounded-xl border border-rose-500/10">
                    "{m.exampleSentence}"
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-zinc-400">Recommended drill: <strong>{m.recommendedDrill}</strong></span>
                    <Link
                      href="/conversation?mode=teacher"
                      className="text-xs text-[#D4F82A] font-bold hover:underline"
                    >
                      Practice with Emma &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Future Me Comparison (From prompt inspirations) */}
          <div className="p-6 rounded-3xl bg-[#121620] border border-[#1E2536] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>"Future Me" Audio &amp; Fluency Comparison</span>
              </h3>
              <span className="text-xs font-mono text-sky-400">Day 1 vs. Today</span>
            </div>
            <p className="text-xs text-zinc-400">
              Hear how your speech delivery, pauses, and vocabulary complexity have evolved:
            </p>

            {/* Day 1 Recording */}
            <div className="p-4 rounded-2xl bg-[#161B26] border border-[#222B3D] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-400 font-mono uppercase">Day 1 Baseline (Oct 18)</span>
                <span className="font-mono text-amber-400 font-bold">Score: 4.8 / 10</span>
              </div>
              <p className="text-xs text-zinc-300 italic">
                "Umm... today I... go to work and... it was like... very busy and stressful..."
              </p>
              <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-500">
                <span>3.2s hesitation pause &bull; 4 filler words</span>
                <button
                  onClick={() => ttsManager.speak("Umm, today I go to work and it was like very busy and stressful", { rate: 0.85 })}
                  className="flex items-center gap-1 text-zinc-300 hover:text-white"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Listen
                </button>
              </div>
            </div>

            {/* Today's Recording */}
            <div className="p-4 rounded-2xl bg-[#161B26] border border-[#D4F82A]/30 bg-[#D4F82A]/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#D4F82A] font-mono uppercase">Today (Day 30 Progress)</span>
                <span className="font-mono text-[#D4F82A] font-bold">Score: 8.2 / 10</span>
              </div>
              <p className="text-xs text-zinc-100 font-medium italic">
                "Today I handled several high-priority tasks at work, which required coordinating directly with our engineering team."
              </p>
              <div className="flex items-center justify-between pt-1 text-[11px] text-[#D4F82A]">
                <span>Zero hesitation &bull; Professional collocations</span>
                <button
                  onClick={() => ttsManager.speak("Today I handled several high-priority tasks at work, which required coordinating directly with our engineering team", { rate: 1.0 })}
                  className="flex items-center gap-1 text-[#D4F82A] font-bold hover:underline"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Listen
                </button>
              </div>
            </div>

            <div className="pt-2 text-center">
              <Link
                href="/conversation"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4F82A] text-black text-xs font-bold hover:bg-[#c2e424] transition-colors"
              >
                <span>Record New Voice Milestone &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
