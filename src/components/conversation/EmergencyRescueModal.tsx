'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LifeBuoy,
  X,
  Sparkles,
  Copy,
  Check,
  Volume2,
  Send,
  Loader2
} from 'lucide-react';
import { ttsManager } from '@/lib/speech/speechSynthesis';

interface EmergencyRescueModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTopic: string;
  onSelectSentence: (sentence: string) => void;
}

export default function EmergencyRescueModal({
  isOpen,
  onClose,
  currentTopic,
  onSelectSentence,
}: EmergencyRescueModalProps) {
  const [ideaInput, setIdeaInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    simple: string;
    natural: string;
    advanced: string;
    deliveryTip: string;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleRescue = async () => {
    if (!ideaInput.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/rescue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: ideaInput, currentTopic }),
      });
      const data = await res.json();
      setResult({
        simple: data.simple,
        natural: data.natural,
        advanced: data.advanced,
        deliveryTip: data.deliveryTip,
      });
    } catch {
      setResult({
        simple: `I think that ${ideaInput}.`,
        natural: `Basically, what I mean is that ${ideaInput}.`,
        advanced: `To put it another way, ${ideaInput}.`,
        deliveryTip: 'Pause slightly after the subject to keep your rhythm steady.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handlePlayAudio = (text: string) => {
    ttsManager.speak(text, { rate: 0.95 });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-[#11151E] border border-[#232C3D] rounded-2xl shadow-2xl overflow-hidden p-6 text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#1B2332]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
                <LifeBuoy className="w-4 h-4 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Help Me Say It</h3>
                <p className="text-xs text-zinc-400">Never get stuck. Describe your thought in rough words.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1A2230]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Input Prompt */}
          <div className="mt-4 space-y-3">
            <label className="text-xs font-mono uppercase text-zinc-400">
              What are you trying to say right now?
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={ideaInput}
                onChange={(e) => setIdeaInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRescue()}
                placeholder="e.g. I want to say that movie was very exciting and shocking..."
                className="flex-1 bg-[#161B26] border border-[#242E40] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4F82A]"
              />
              <button
                onClick={handleRescue}
                disabled={isLoading || !ideaInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#D4F82A] text-black font-bold text-sm hover:bg-[#c2e424] disabled:opacity-50 flex items-center gap-1.5"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Generate</span>
              </button>
            </div>
          </div>

          {/* Generated Suggestions */}
          {result && (
            <div className="mt-6 space-y-3">
              <div className="text-xs font-mono uppercase text-[#D4F82A] tracking-wider">
                Choose a version to speak:
              </div>

              {/* Simple */}
              <div className="p-3 rounded-xl bg-[#151A24] border border-[#212A3A] flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>LEVEL 1: SIMPLE</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handlePlayAudio(result.simple)} title="Hear pronunciation">
                      <Volume2 className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />
                    </button>
                    <button onClick={() => handleCopy(result.simple, 'simple')}>
                      {copiedKey === 'simple' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-zinc-200 font-medium">"{result.simple}"</p>
                <button
                  onClick={() => {
                    onSelectSentence(result.simple);
                    onClose();
                  }}
                  className="text-left text-xs text-[#D4F82A] font-semibold hover:underline"
                >
                  Use this sentence in conversation &rarr;
                </button>
              </div>

              {/* Natural */}
              <div className="p-3 rounded-xl bg-[#151A24] border border-[#D4F82A]/30 bg-[#D4F82A]/5 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#D4F82A] font-bold">
                  <span>LEVEL 2: NATURAL CONVERSATIONAL</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handlePlayAudio(result.natural)} title="Hear pronunciation">
                      <Volume2 className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />
                    </button>
                    <button onClick={() => handleCopy(result.natural, 'natural')}>
                      {copiedKey === 'natural' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-white font-medium">"{result.natural}"</p>
                <button
                  onClick={() => {
                    onSelectSentence(result.natural);
                    onClose();
                  }}
                  className="text-left text-xs text-[#D4F82A] font-bold hover:underline"
                >
                  Use this sentence in conversation &rarr;
                </button>
              </div>

              {/* Advanced */}
              <div className="p-3 rounded-xl bg-[#151A24] border border-purple-500/30 bg-purple-500/5 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-purple-300 font-bold">
                  <span>LEVEL 3: ELOQUENT &amp; ADVANCED</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handlePlayAudio(result.advanced)} title="Hear pronunciation">
                      <Volume2 className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />
                    </button>
                    <button onClick={() => handleCopy(result.advanced, 'advanced')}>
                      {copiedKey === 'advanced' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-zinc-100 font-medium">"{result.advanced}"</p>
                <button
                  onClick={() => {
                    onSelectSentence(result.advanced);
                    onClose();
                  }}
                  className="text-left text-xs text-purple-300 font-semibold hover:underline"
                >
                  Use this sentence in conversation &rarr;
                </button>
              </div>

              {/* Delivery Tip */}
              {result.deliveryTip && (
                <div className="p-2.5 rounded-xl bg-[#0B0E14] border border-[#19212E] text-xs text-zinc-400 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4F82A] shrink-0" />
                  <span>Tip: {result.deliveryTip}</span>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
