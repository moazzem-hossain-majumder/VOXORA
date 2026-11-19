'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Compass,
  Mic,
  Dices,
  Swords,
  Timer,
  BookOpen,
  Award,
  Briefcase,
  GraduationCap,
  MessageSquareHeart,
  Drama,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { CONVERSATION_MODES } from '@/lib/modes';
import { AI_PERSONALITIES } from '@/lib/personalities';
import { ConversationModeId } from '@/lib/types';

export default function ModesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [rouletteTopic, setRouletteTopic] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  const modeList = Object.values(CONVERSATION_MODES);

  const handleSpinRoulette = async () => {
    setIsSpinning(true);
    try {
      const res = await fetch('/api/topics?category=intermediate');
      const data = await res.json();
      setRouletteTopic(data.topic);
    } catch {
      setRouletteTopic('If you could master any skill in 24 hours, what would you choose and why?');
    } finally {
      setIsSpinning(false);
    }
  };

  const getModeIcon = (id: ConversationModeId) => {
    switch (id) {
      case 'friendly': return MessageSquareHeart;
      case 'interview': return Briefcase;
      case 'teacher': return GraduationCap;
      case 'ielts': return Award;
      case 'debate': return Swords;
      case 'roulette': return Dices;
      case 'storytelling': return BookOpen;
      case 'roleplay': return Drama;
      case 'pressure': return Timer;
      case 'adventure': return Compass;
      case 'fearless': return ShieldCheck;
      default: return Sparkles;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-zinc-100 selection:bg-[#D4F82A] selection:text-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-[#D4F82A] tracking-wider font-semibold">
              Scenarios &amp; Arenas
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4F82A]" />
            <span className="text-xs text-zinc-400 font-mono">11 Tailored Modes</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Explore Conversation Personalities &amp; Arenas
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl">
            Choose a mode tailored for your goal: prepare for job interviews, sharpen your IELTS score, or overcome speaking anxiety in pressure-free arenas.
          </p>
        </div>

        {/* Live Topic Roulette Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#171D28] via-[#141924] to-[#12151D] border border-[#232E40] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-[#D4F82A]">
              <Dices className="w-5 h-5 animate-spin" />
              <span className="text-xs font-mono uppercase font-bold tracking-wider">Instant Topic Roulette</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Don't know what to talk about today?
            </h2>
            <p className="text-xs text-zinc-300">
              {rouletteTopic ? (
                <span className="text-sm text-white font-medium italic block bg-[#0F131C] p-3 rounded-xl border border-[#232D3F]">
                  "{rouletteTopic}"
                </span>
              ) : (
                'Spin the wheel to get an unexpected philosophical, imaginative, or situational wildcard question.'
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleSpinRoulette}
              disabled={isSpinning}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#1D2536] hover:bg-[#253046] border border-[#2C384E] text-xs font-bold text-zinc-200 transition-colors flex items-center justify-center gap-2"
            >
              <Dices className="w-4 h-4 text-[#D4F82A]" />
              <span>{isSpinning ? 'Rolling...' : 'Spin New Topic'}</span>
            </button>

            {rouletteTopic && (
              <Link
                href={`/conversation?mode=roulette&topic=${encodeURIComponent(rouletteTopic)}`}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#D4F82A] text-black text-xs font-extrabold hover:bg-[#c2e424] transition-colors flex items-center justify-center gap-1.5"
              >
                <Mic className="w-4 h-4" />
                <span>Talk on This Topic</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mode Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modeList.map((mode) => {
            const Icon = getModeIcon(mode.id);
            const companion = AI_PERSONALITIES[mode.primaryPersonality];

            return (
              <div
                key={mode.id}
                className="card-editorial p-6 rounded-3xl flex flex-col justify-between group hover:border-[#D4F82A]/30 transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: `${mode.color}15`, border: `1px solid ${mode.color}35` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: mode.color }} />
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-[#18202D] text-zinc-300 border border-[#222B3D]">
                      {mode.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#D4F82A] transition-colors">
                      {mode.name}
                    </h3>
                    <div className="text-xs text-zinc-400 mt-1 font-medium">{mode.tagline}</div>
                    <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed">
                      {mode.description}
                    </p>
                  </div>

                  {/* Sample topics */}
                  <div className="space-y-1 pt-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Sample Scenarios:</span>
                    <ul className="space-y-1">
                      {mode.topics.slice(0, 2).map((t, i) => (
                        <li key={i} className="text-[11px] text-zinc-300 flex items-center gap-1.5 truncate">
                          <span className="w-1 h-1 rounded-full bg-[#D4F82A]" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1C2433] flex items-center justify-between">
                  <div className="text-xs text-zinc-400">
                    Host: <strong className="text-white">{companion?.name}</strong>
                  </div>
                  <Link
                    href={`/conversation?mode=${mode.id}&personality=${mode.primaryPersonality}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4F82A] text-black text-xs font-bold hover:bg-[#c2e424] transition-colors shadow-sm"
                  >
                    <span>Enter Mode</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
