'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  BookmarkPlus,
  BookCheck,
  TrendingUp,
  Compass,
  MessageSquare
} from 'lucide-react';
import { SpeakingEvaluation, VocabularySuggestion } from '@/lib/types';
import { UserStore } from '@/lib/storage/userStore';

interface EvaluationCardProps {
  evaluation: SpeakingEvaluation;
  onSaveWord?: (word: VocabularySuggestion) => void;
  defaultExpanded?: boolean;
}

export default function EvaluationCard({
  evaluation,
  onSaveWord,
  defaultExpanded = false
}: EvaluationCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [savedWords, setSavedWords] = useState<Record<string, boolean>>({});

  const handleSaveWord = (vocab: VocabularySuggestion) => {
    UserStore.saveVocabularyWord({
      word: vocab.word,
      meaning: vocab.meaning,
      example: vocab.example,
      sourceContext: 'Conversation feedback',
    });
    setSavedWords(prev => ({ ...prev, [vocab.word]: true }));
    if (onSaveWord) onSaveWord(vocab);
  };

  const scoreColor = (score: number) => {
    if (score >= 8.5) return 'text-[#D4F82A] border-[#D4F82A]/30 bg-[#D4F82A]/10';
    if (score >= 7.0) return 'text-sky-400 border-sky-400/30 bg-sky-400/10';
    if (score >= 5.5) return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
    return 'text-rose-400 border-rose-400/30 bg-rose-400/10';
  };

  return (
    <div className="w-full bg-[#11141B]/95 rounded-2xl border border-[#202736] shadow-xl overflow-hidden backdrop-blur-md transition-all">
      {/* Compact Score Header */}
      <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-[#1A212E]/60">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-xl border text-base font-black font-mono tracking-tight ${scoreColor(evaluation.overallScore)}`}>
            {evaluation.overallScore.toFixed(1)} / 10
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Speaking Analysis</span>
              {evaluation.fillerWords && evaluation.fillerWords.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {evaluation.fillerWords.reduce((acc, curr) => acc + curr.count, 0)} fillers detected
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Target: <span className="text-zinc-200 font-medium">{evaluation.nextImprovementTarget}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 bg-[#171C26] hover:bg-[#202736] border border-[#263042] transition-colors"
        >
          <span>{isExpanded ? 'Hide Details' : 'View Full Feedback'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Quick Score Category Chips */}
      <div className="px-4 py-2.5 bg-[#0D1016] flex flex-wrap items-center gap-2 text-xs border-b border-[#171D28]">
        <span className="text-zinc-500 text-[11px] font-mono uppercase tracking-wider">Breakdown:</span>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#141822] border border-[#1E2533] text-zinc-300">
          <span className="text-zinc-400">Grammar:</span>
          <span className="font-mono font-bold text-[#D4F82A]">{evaluation.grammarScore.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#141822] border border-[#1E2533] text-zinc-300">
          <span className="text-zinc-400">Vocabulary:</span>
          <span className="font-mono font-bold text-sky-400">{evaluation.vocabularyScore.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#141822] border border-[#1E2533] text-zinc-300">
          <span className="text-zinc-400">Fluency:</span>
          <span className="font-mono font-bold text-teal-400">{evaluation.fluencyScore.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#141822] border border-[#1E2533] text-zinc-300">
          <span className="text-zinc-400">Relevance:</span>
          <span className="font-mono font-bold text-purple-400">{evaluation.relevanceScore.toFixed(1)}</span>
        </div>
      </div>

      {/* Expandable Deep Feedback Body */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 sm:p-6 space-y-6 bg-[#0E1118]"
          >
            {/* What you did well */}
            {evaluation.whatUserDidWell && evaluation.whatUserDidWell.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" /> What You Did Well
                </h4>
                <div className="space-y-1.5">
                  {evaluation.whatUserDidWell.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300 bg-emerald-950/20 border border-emerald-800/30 p-2.5 rounded-xl">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mistakes & Direct Corrections */}
            {evaluation.mistakes && evaluation.mistakes.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-rose-400 font-bold mb-2">
                  <AlertCircle className="w-3.5 h-3.5" /> Corrections &amp; Explanations
                </h4>
                <div className="space-y-2.5">
                  {evaluation.mistakes.map((mistake, idx) => (
                    <div key={idx} className="bg-[#141822] border border-rose-500/20 p-3 rounded-xl space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 font-bold">
                          {mistake.type}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-lg bg-black/40 border border-rose-500/20 text-rose-300">
                          <span className="text-[10px] uppercase block font-mono text-zinc-500 mb-0.5">Original</span>
                          <span className="line-through opacity-80">{mistake.original}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-[#D4F82A]/10 border border-[#D4F82A]/30 text-[#D4F82A]">
                          <span className="text-[10px] uppercase block font-mono text-zinc-400 mb-0.5">Correction</span>
                          <span className="font-semibold">{mistake.correction}</span>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-400 pl-1">{mistake.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Native Expression Generator (3 Versions) */}
            <div>
              <h4 className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400 font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" /> 3 Ways to Express This Naturally
              </h4>
              <div className="space-y-2 text-xs">
                {/* 1. Grammatically clean */}
                <div className="p-3 rounded-xl bg-[#141822] border border-[#202736]">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase mb-1">Level 1 • Grammatically Correct</div>
                  <div className="text-zinc-200">{evaluation.naturalAlternative}</div>
                </div>
                {/* 2. Conversational Native */}
                <div className="p-3 rounded-xl bg-[#141822] border border-[#D4F82A]/30 bg-[#D4F82A]/5">
                  <div className="text-[10px] font-mono text-[#D4F82A] uppercase font-bold mb-1">Level 2 • Natural Conversational Native</div>
                  <div className="text-zinc-100 font-medium">{evaluation.naturalAlternative}</div>
                </div>
                {/* 3. Advanced / Expressive */}
                <div className="p-3 rounded-xl bg-[#141822] border border-purple-500/30 bg-purple-500/5">
                  <div className="text-[10px] font-mono text-purple-300 uppercase font-bold mb-1">Level 3 • Advanced &amp; Eloquent</div>
                  <div className="text-zinc-100 font-medium">{evaluation.advancedAlternative}</div>
                </div>
              </div>
            </div>

            {/* Vocabulary Suggestions */}
            {evaluation.vocabularySuggestions && evaluation.vocabularySuggestions.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold mb-2">
                  <BookmarkPlus className="w-3.5 h-3.5" /> Useful Vocabulary Boosts
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {evaluation.vocabularySuggestions.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#141822] border border-[#222B3D] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white font-mono">{item.word}</span>
                          <button
                            onClick={() => handleSaveWord(item)}
                            className="flex items-center gap-1 text-[11px] text-[#D4F82A] hover:underline"
                          >
                            {savedWords[item.word] ? (
                              <span className="flex items-center gap-1 text-emerald-400"><BookCheck className="w-3 h-3" /> Saved</span>
                            ) : (
                              <span className="flex items-center gap-1"><BookmarkPlus className="w-3 h-3" /> Save</span>
                            )}
                          </button>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1">{item.meaning}</p>
                      </div>
                      <div className="mt-2 text-[11px] text-zinc-300 italic bg-black/30 p-1.5 rounded-lg border border-[#1C2331]">
                        "{item.example}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pronunciation Transparency Note */}
            <div className="p-2.5 rounded-xl bg-[#090C12] border border-[#171D28] text-[11px] text-zinc-500 flex items-center justify-between">
              <span>{evaluation.pronunciationNotice}</span>
              <span className="text-zinc-600 font-mono text-[10px]">Acoustic engine active</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
