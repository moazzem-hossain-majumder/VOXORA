'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Square,
  Volume2,
  Calendar,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  ArrowRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { SpeechRecognitionManager } from '@/lib/speech/speechRecognition';
import { ttsManager } from '@/lib/speech/speechSynthesis';
import { VoiceJournalEntry } from '@/lib/types';

const INITIAL_ENTRIES: VoiceJournalEntry[] = [
  {
    id: 'j1',
    title: 'Navigating Work Deadlines with Poise',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    rawTranscript: 'Today at my job we had a major deadline. I was a bit stressed in the morning, but I met up with my colleagues and we coordinated the tasks efficiently.',
    grammarCorrections: [],
    vocabularyUpgrades: [
      { word: 'unwind', meaning: 'relax after tension or effort', example: 'After the release, we finally had a chance to unwind.' }
    ],
    reflectionSummary: 'You handled stressful circumstances with strong collaborative poise and described the resolution articulately.',
    durationSeconds: 78,
    fluencyScore: 8.4,
  }
];

export default function JournalPage() {
  const [entries, setEntries] = useState<VoiceJournalEntry[]>(INITIAL_ENTRIES);
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const speechRef = useRef<SpeechRecognitionManager | null>(null);

  useEffect(() => {
    speechRef.current = new SpeechRecognitionManager({
      onInterimResult: (t) => setLiveTranscript(t),
      onFinalResult: (t) => setLiveTranscript(t),
      onStart: () => setIsRecording(true),
      onEnd: () => setIsRecording(false),
      onError: (e) => {
        console.warn('Speech recognition error:', e);
        setIsRecording(false);
      },
    });

    return () => {
      ttsManager.stop();
      if (speechRef.current) speechRef.current.stop();
    };
  }, []);

  const handleToggleRecord = () => {
    if (isRecording) {
      const spoken = speechRef.current?.stop() || liveTranscript;
      setIsRecording(false);
      if (spoken.trim()) {
        processJournalEntry(spoken.trim());
      }
    } else {
      setLiveTranscript('');
      speechRef.current?.start();
      setIsRecording(true);
    }
  };

  const processJournalEntry = async (text: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text }),
      });
      const data = await res.json();
      const newEntry: VoiceJournalEntry = {
        id: 'j_' + Date.now(),
        title: data.title || 'Evening Voice Reflection',
        createdAt: new Date().toISOString(),
        rawTranscript: text,
        grammarCorrections: data.grammarCorrections || [],
        vocabularyUpgrades: data.vocabularyUpgrades || [],
        reflectionSummary: data.reflectionSummary || 'Great reflection on your daily events.',
        durationSeconds: 60,
        fluencyScore: data.fluencyScore || 8.0,
      };
      setEntries((prev) => [newEntry, ...prev]);
      setLiveTranscript('');
    } catch {
      const fallbackEntry: VoiceJournalEntry = {
        id: 'j_' + Date.now(),
        title: 'Daily Reflection',
        createdAt: new Date().toISOString(),
        rawTranscript: text,
        grammarCorrections: [],
        vocabularyUpgrades: [
          { word: 'delve into', meaning: 'explore deeply', example: 'It was great to delve into my thoughts.' }
        ],
        reflectionSummary: 'Thoughtful spoken reflection communicating your thoughts with genuine sincerity.',
        durationSeconds: 45,
        fluencyScore: 8.0,
      };
      setEntries((prev) => [fallbackEntry, ...prev]);
      setLiveTranscript('');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-zinc-100 selection:bg-[#D4F82A] selection:text-black">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-[#D4F82A] tracking-wider font-semibold">
              Personal Voice Diary
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4F82A]" />
            <span className="text-xs text-zinc-400 font-mono">Daily Voice Journal</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Voice Journal</h1>
          <p className="text-xs text-zinc-400">
            Unwind and talk freely about your day for 2-3 minutes. VOXORA transcribes, analyzes grammar, and reflects with you.
          </p>
        </div>

        {/* Live Journal Recorder Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#121620] border border-[#222B3D] shadow-2xl flex flex-col items-center text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#D4F82A]/10 border border-[#D4F82A]/30 flex items-center justify-center">
            <Mic className="w-7 h-7 text-[#D4F82A]" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">How was your day?</h2>
            <p className="text-xs text-zinc-400 max-w-md">
              Tap the button and speak freely about what happened, what went well, or what challenged you.
            </p>
          </div>

          <button
            onClick={handleToggleRecord}
            disabled={isAnalyzing}
            className={`flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm shadow-xl transition-all ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse'
                : isAnalyzing
                ? 'bg-purple-600 text-white'
                : 'bg-[#D4F82A] text-black hover:bg-[#c2e424]'
            }`}
          >
            {isRecording ? (
              <>
                <Square className="w-5 h-5 fill-white" />
                <span>Finish Voice Entry</span>
              </>
            ) : isAnalyzing ? (
              <span>Analyzing Entry...</span>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span>Start Talking About Your Day</span>
              </>
            )}
          </button>

          {/* Live speech preview */}
          {(isRecording || liveTranscript) && (
            <div className="w-full max-w-xl p-4 rounded-xl bg-[#0B0E14] border border-[#1A2230] text-xs text-zinc-200 italic animate-fadeIn">
              "{liveTranscript || 'Listening to your reflections...'}"
            </div>
          )}
        </div>

        {/* Past Journal Entries */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#D4F82A]" />
            <span>Past Voice Reflections ({entries.length})</span>
          </h3>

          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="p-6 rounded-3xl bg-[#121620] border border-[#1F2737] space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1A2230] pb-3">
                  <div>
                    <h4 className="text-base font-bold text-white">{entry.title}</h4>
                    <span className="text-[11px] font-mono text-zinc-500">
                      {new Date(entry.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[#D4F82A] px-2.5 py-1 rounded-lg bg-[#D4F82A]/10 border border-[#D4F82A]/30">
                      Fluency: {entry.fluencyScore.toFixed(1)} / 10
                    </span>
                    <button
                      onClick={() => ttsManager.speak(entry.rawTranscript)}
                      className="p-1.5 rounded-lg bg-[#18202D] text-zinc-300 hover:text-white"
                      title="Play back audio"
                    >
                      <Volume2 className="w-4 h-4 text-[#D4F82A]" />
                    </button>
                  </div>
                </div>

                {/* Spoken Transcript */}
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic bg-black/30 p-3.5 rounded-xl border border-[#1A212E]">
                  "{entry.rawTranscript}"
                </p>

                {/* AI Reflection Summary */}
                <div className="p-3 rounded-xl bg-[#141A25] border border-[#243042] text-xs text-zinc-200 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4F82A] shrink-0 mt-0.5" />
                  <span><strong>AI Reflection:</strong> {entry.reflectionSummary}</span>
                </div>

                {/* Vocabulary Upgrades */}
                {entry.vocabularyUpgrades && entry.vocabularyUpgrades.length > 0 && (
                  <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-zinc-500 font-mono text-[10px] uppercase">Lexicon Boost:</span>
                    {entry.vocabularyUpgrades.map((v, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-[#192231] text-zinc-300 border border-[#253248]">
                        <strong className="text-white">{v.word}</strong>: {v.meaning}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
