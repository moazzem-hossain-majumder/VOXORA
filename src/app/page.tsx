'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Mic,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Flame,
  Award,
  Play,
  CheckCircle2,
  HelpCircle,
  Compass,
  Repeat,
  Volume2,
  ChevronRight,
  TrendingUp,
  Brain,
  MessageSquare,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import AvatarSphere from '@/components/AvatarSphere';
import { AI_PERSONALITIES } from '@/lib/personalities';
import { CONVERSATION_MODES } from '@/lib/modes';
import { ttsManager } from '@/lib/speech/speechSynthesis';

export default function LandingPage() {
  const [activeDemoState, setActiveDemoState] = useState<'idle' | 'speaking' | 'listening'>('idle');
  const [playingPersonality, setPlayingPersonality] = useState<string | null>(null);

  const handlePlayVoiceSample = (name: string, text: string) => {
    setPlayingPersonality(name);
    ttsManager.speak(text, {
      onEnd: () => setPlayingPersonality(null),
    });
  };

  const samplePersonalities = Object.values(AI_PERSONALITIES);
  const sampleModes = Object.values(CONVERSATION_MODES);

  return (
    <div className="min-h-screen bg-[#0A0C10] text-zinc-100 selection:bg-[#D4F82A] selection:text-black">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden bg-editorial-gradient border-b border-[#1A212F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Tagline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161C27] border border-[#273244] text-xs font-mono text-[#D4F82A]">
              <span className="w-2 h-2 rounded-full bg-[#D4F82A] animate-pulse"></span>
              <span>Stop translating in your head. Start speaking naturally.</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Your English-speaking confidence{' '}
              <span className="text-[#D4F82A] text-brand-glow">starts here.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-zinc-400 font-normal leading-relaxed max-w-2xl mx-auto">
              Talk about anything. Get smarter pedagogical feedback. Practice without judgment and become a fluent, fearless English speaker.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link
                href="/conversation"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#D4F82A] text-black font-extrabold text-base shadow-xl shadow-[#D4F82A]/20 hover:bg-[#c2e424] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Mic className="w-5 h-5 fill-black" />
                <span>Start Talking</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                href="/modes"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#141822] hover:bg-[#1C2333] border border-[#232C3E] text-zinc-300 font-semibold text-base transition-all"
              >
                <Compass className="w-4 h-4 text-[#D4F82A]" />
                <span>Explore 10+ Modes</span>
              </Link>
            </div>

            {/* Micro Feature Tags */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Web Speech Powered
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Zero Judgment Space
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Instant Structured Feedback
              </span>
            </div>
          </div>

          {/* Interactive Hero AI Sphere Visual */}
          <div className="mt-14 max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#0F131C]/90 border border-[#20293A] shadow-2xl backdrop-blur-xl flex flex-col items-center">
            <div className="mb-4 text-xs font-mono text-zinc-400 uppercase tracking-widest">
              Live Interaction Preview
            </div>

            <AvatarSphere
              personality={AI_PERSONALITIES.alex}
              state={activeDemoState}
              size="md"
              onClick={() => {
                setActiveDemoState(activeDemoState === 'idle' ? 'speaking' : 'idle');
                if (activeDemoState === 'idle') {
                  ttsManager.speak("Hey there! Welcome to Voxora. What is on your mind today?", {
                    onEnd: () => setActiveDemoState('idle'),
                  });
                }
              }}
            />

            {/* Sample Dialogue Bubble */}
            <div className="mt-6 w-full space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#151B27] border border-[#242E40] text-xs sm:text-sm text-zinc-300">
                <span className="font-bold text-[#D4F82A] font-mono block mb-1">Alex (AI Companion):</span>
                "Hey! What did you do earlier today?"
              </div>
              <div className="p-3.5 rounded-2xl bg-[#1D2536] border border-sky-500/30 text-xs sm:text-sm text-zinc-100 ml-auto max-w-[90%]">
                <span className="font-bold text-sky-400 font-mono block mb-1">You (User Speech):</span>
                "Today I go to university and meet with my friends."
              </div>
              {/* Micro-Evaluation Result */}
              <div className="p-3.5 rounded-2xl bg-[#121620] border border-[#D4F82A]/30 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#D4F82A] uppercase font-bold">Instant Evaluation (7.4 / 10)</span>
                  <span className="text-[10px] text-zinc-500">Grammar + Natural Cadence</span>
                </div>
                <div className="text-zinc-300">
                  <span className="text-rose-400 line-through mr-1">I go to university</span> &rarr;{' '}
                  <span className="text-[#D4F82A] font-bold">I went to university</span>
                </div>
                <div className="text-zinc-400 text-[11px]">
                  Natural expression: <span className="text-white italic">"I met up with my friends."</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CONVERSATION MODES SHOWCASE */}
      <section className="py-20 border-b border-[#1A212F] bg-[#0A0C10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-mono uppercase text-[#D4F82A] tracking-wider">Practice Any Scenario</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Every Mode Has a Distinct Purpose
            </h2>
            <p className="text-sm text-zinc-400">
              From casual coffee talks to stressful technical interviews and timed IELTS mock exams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sampleModes.slice(0, 6).map((mode) => (
              <div
                key={mode.id}
                className="card-editorial p-6 rounded-2xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-[#18202E] text-zinc-300 border border-[#232D3E]">
                      {mode.badge}
                    </span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: mode.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#D4F82A] transition-colors">
                    {mode.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    {mode.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#1C2333] flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-mono">
                    Companion: {AI_PERSONALITIES[mode.primaryPersonality]?.name}
                  </span>
                  <Link
                    href={`/conversation?mode=${mode.id}`}
                    className="flex items-center gap-1 text-xs font-bold text-[#D4F82A] hover:underline"
                  >
                    <span>Practice</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/modes"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#D4F82A] hover:underline"
            >
              <span>View all modes including Pressure Room &amp; Adventure &rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. AI PERSONALITIES */}
      <section className="py-20 border-b border-[#1A212F] bg-[#0C0F15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-mono uppercase text-[#D4F82A] tracking-wider">Meet Your Companions</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              7 Distinct AI Speaking Personalities
            </h2>
            <p className="text-sm text-zinc-400">
              Each with unique speaking styles, correction intensities, voice profiles, and pedagogical approaches.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {samplePersonalities.slice(0, 4).map((personality) => (
              <div
                key={personality.id}
                className="bg-[#121620] border border-[#212A3A] p-5 rounded-2xl flex flex-col justify-between hover:border-[#D4F82A]/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${personality.avatarColor} flex items-center justify-center text-black font-black text-lg shadow-md`}>
                      {personality.name[0]}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171E2B] text-zinc-300 border border-[#232D3F]">
                      {personality.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-[#D4F82A] transition-colors">
                    {personality.name}
                  </h3>
                  <div className="text-xs text-[#D4F82A] font-medium">{personality.tagline}</div>
                  <p className="text-xs text-zinc-400 mt-2 line-clamp-3">
                    {personality.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#1C2433] flex items-center justify-between">
                  <button
                    onClick={() => handlePlayVoiceSample(personality.name, `Hi! I'm ${personality.name}. ${personality.tagline}. Let's practice speaking today!`)}
                    className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[#D4F82A]" />
                    <span>{playingPersonality === personality.name ? 'Playing...' : 'Voice Sample'}</span>
                  </button>
                  <Link
                    href={`/conversation?personality=${personality.id}`}
                    className="text-xs font-bold text-[#D4F82A] hover:underline"
                  >
                    Chat &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-20 border-b border-[#1A212F] bg-[#0A0C10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-mono uppercase text-[#D4F82A] tracking-wider">The Speaking Loop</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              How VOXORA Builds Speaking Muscle
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#121620] border border-[#20293A] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4F82A]/10 border border-[#D4F82A]/30 flex items-center justify-center text-[#D4F82A] font-mono font-bold">
                01
              </div>
              <h3 className="text-base font-bold text-white">Choose Scenario &amp; Speak</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Pick a topic or spin the roulette wheel. Tap the microphone and speak your thoughts freely in natural sentences.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121620] border border-[#20293A] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-mono font-bold">
                02
              </div>
              <h3 className="text-base font-bold text-white">Instant Multi-Tier Feedback</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Receive grammar corrections, filler word density, and 3 tiers of native alternatives without interrupting conversational flow.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121620] border border-[#20293A] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-bold">
                03
              </div>
              <h3 className="text-base font-bold text-white">Retain &amp; Personalize</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Useful vocabulary is automatically cataloged in your Vault. The AI notes recurring slips to challenge you gently next time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. UNIQUE INNOVATIVE FEATURES */}
      <section className="py-20 border-b border-[#1A212F] bg-[#0D1016]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-mono uppercase text-[#D4F82A] tracking-wider">Beyond Ordinary Chatbots</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Features Built for Serious Fluency
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#131722] border border-[#222B3D] space-y-2.5">
              <div className="flex items-center gap-2 text-[#D4F82A]">
                <Repeat className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Shadow Mode Studio</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The AI speaks native sentences. You repeat them. Get an exact match score, identify omitted prepositions, and hone rhythm.
              </p>
              <Link href="/shadow" className="text-xs text-[#D4F82A] font-semibold hover:underline block pt-1">
                Try Shadow Practice &rarr;
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-[#131722] border border-[#222B3D] space-y-2.5">
              <div className="flex items-center gap-2 text-rose-400">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Emergency Rescue: "Help Me Say It"</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Stuck mid-thought? Type or speak fragmented words. VOXORA instantly creates Simple, Conversational, and Eloquent versions.
              </p>
              <span className="text-xs text-zinc-500 block pt-1">Available on every speaking turn</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#131722] border border-[#222B3D] space-y-2.5">
              <div className="flex items-center gap-2 text-sky-400">
                <Brain className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Cross-Session Memory</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                If you struggled with past tense yesterday, today's companion naturally asks what you did last weekend to test improvement.
              </p>
              <Link href="/analytics" className="text-xs text-sky-400 font-semibold hover:underline block pt-1">
                View Pattern Detection &rarr;
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-[#131722] border border-[#222B3D] space-y-2.5">
              <div className="flex items-center gap-2 text-amber-400">
                <Volume2 className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Voice Journal</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Reflect verbally on your day in 2 minutes. The AI extracts a transcript, upgrades your vocabulary, and saves your audio archive.
              </p>
              <Link href="/journal" className="text-xs text-amber-400 font-semibold hover:underline block pt-1">
                Start Voice Journaling &rarr;
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-[#131722] border border-[#222B3D] space-y-2.5">
              <div className="flex items-center gap-2 text-teal-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Vocabulary Vault</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Save natural idioms and advanced collocations with one click. Replay audio pronunciations and mark words mastered.
              </p>
              <Link href="/vocabulary" className="text-xs text-teal-400 font-semibold hover:underline block pt-1">
                Explore Vault &rarr;
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-[#131722] border border-[#222B3D] space-y-2.5">
              <div className="flex items-center gap-2 text-purple-400">
                <Zap className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Speak Without Fear Mode</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                For high-anxiety days: zero scores and zero interruptions during talk. A completely safe sandbox to warm up your voice.
              </p>
              <Link href="/conversation?mode=fearless" className="text-xs text-purple-400 font-semibold hover:underline block pt-1">
                Enter Fearless Mode &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SAMPLE TESTIMONIALS (Clearly labeled beta learner feedback) */}
      <section className="py-20 border-b border-[#1A212F] bg-[#0A0C10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-mono uppercase text-[#D4F82A] tracking-wider">Learner Experiences</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              From Hesitant Thinker to Natural Speaker
            </h2>
            <p className="text-xs text-zinc-500 font-mono">
              [Sample Beta User Reflections — Educational Case Studies]
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#121620] border border-[#202737] space-y-3">
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                "I used to pause for 5 seconds before every sentence translating from my native language. Practicing 10 minutes a day with Alex made speaking automatic."
              </p>
              <div className="pt-2 border-t border-[#1C2333]">
                <div className="text-xs font-bold text-white">Kenji S.</div>
                <div className="text-[11px] text-zinc-500">Software Engineer • Tokyo</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#121620] border border-[#202737] space-y-3">
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                "Sophia's IELTS simulator gave me real Part 2 cue cards and challenged me on abstract Part 3 questions. It took the anxiety completely out of test day."
              </p>
              <div className="pt-2 border-t border-[#1C2333]">
                <div className="text-xs font-bold text-white">Elena R.</div>
                <div className="text-[11px] text-zinc-500">Master's Applicant • Madrid</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#121620] border border-[#202737] space-y-3">
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                "The 'Help Me Say It' button is a lifesaver. Whenever I got stuck in a behavioral interview question with Michael, it showed me how to phrase it with impact."
              </p>
              <div className="pt-2 border-t border-[#1C2333]">
                <div className="text-xs font-bold text-white">Arjun M.</div>
                <div className="text-[11px] text-zinc-500">Product Designer • Bengaluru</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 border-b border-[#1A212F] bg-[#0C0F15]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-mono uppercase text-[#D4F82A] tracking-wider">Got Questions?</span>
            <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-5 rounded-2xl bg-[#121620] border border-[#1E2636] space-y-1.5">
              <div className="font-bold text-white">Do I need to install any software or plugins?</div>
              <p className="text-zinc-400">
                No. VOXORA runs entirely inside modern web browsers (Chrome, Edge, Safari, Firefox) utilizing the standard Web Speech API.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#121620] border border-[#1E2636] space-y-1.5">
              <div className="font-bold text-white">What if my microphone doesn't work or I am in a noisy place?</div>
              <p className="text-zinc-400">
                You can toggle the text fallback input anytime. You can type your response and still receive the full speaking evaluation and listen to the AI's spoken reply.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#121620] border border-[#1E2636] space-y-1.5">
              <div className="font-bold text-white">Are the IELTS band scores official?</div>
              <p className="text-zinc-400">
                No. VOXORA's IELTS scores are AI-generated practice estimates aligned with IELTS public band descriptors for educational practice, not official exam marks.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#121620] border border-[#1E2636] space-y-1.5">
              <div className="font-bold text-white">How does the AI remember my recurring mistakes?</div>
              <p className="text-zinc-400">
                VOXORA tracks persistent patterns (such as irregular past tense verbs or preposition omissions) in your learning profile to intelligently re-introduce practice opportunities in future conversations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CALL TO ACTION */}
      <section className="py-24 bg-editorial-gradient text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to speak English with confidence?
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
            Take 5 minutes today. Choose a friendly companion, tap the microphone, and hear the difference.
          </p>
          <div className="pt-2">
            <Link
              href="/conversation"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#D4F82A] text-black font-extrabold text-base shadow-xl shadow-[#D4F82A]/20 hover:bg-[#c2e424] hover:scale-105 transition-all"
            >
              <Mic className="w-5 h-5 fill-black" />
              <span>Start Speaking Free</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="border-t border-[#181F2C] bg-[#0A0C10] py-10 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#D4F82A] flex items-center justify-center text-black font-black text-xs">
              V
            </div>
            <span className="font-bold text-zinc-300">VOXORA</span>
            <span>&bull; AI Speaking Companion</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/conversation" className="hover:text-zinc-300">Speak Now</Link>
            <Link href="/modes" className="hover:text-zinc-300">Modes</Link>
            <Link href="/shadow" className="hover:text-zinc-300">Shadow Studio</Link>
            <Link href="/vocabulary" className="hover:text-zinc-300">Vocabulary</Link>
            <Link href="/analytics" className="hover:text-zinc-300">Analytics</Link>
          </div>

          <p>&copy; {new Date().getFullYear()} VOXORA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
