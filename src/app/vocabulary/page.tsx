'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Volume2,
  Trash2,
  CheckCircle2,
  Plus,
  Search,
  Sparkles,
  ArrowRight,
  BookmarkPlus
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { UserStore } from '@/lib/storage/userStore';
import { VocabularyWord } from '@/lib/types';
import { ttsManager } from '@/lib/speech/speechSynthesis';

export default function VocabularyPage() {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'learning' | 'mastered'>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newWord, setNewWord] = useState({ word: '', meaning: '', example: '' });

  useEffect(() => {
    setWords(UserStore.getVocabulary());
  }, []);

  const handleSpeak = (text: string) => {
    ttsManager.speak(text, { rate: 0.9 });
  };

  const handleUpdateStatus = (id: string, status: 'new' | 'learning' | 'mastered') => {
    UserStore.updateWordMastery(id, status);
    setWords(UserStore.getVocabulary());
  };

  const handleDelete = (id: string) => {
    UserStore.deleteWord(id);
    setWords(UserStore.getVocabulary());
  };

  const handleAddCustomWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.word.trim()) return;
    UserStore.saveVocabularyWord({
      word: newWord.word.trim(),
      meaning: newWord.meaning.trim() || 'Custom saved vocabulary',
      example: newWord.example.trim() || 'Used in natural conversation.',
      sourceContext: 'Manual Entry',
    });
    setWords(UserStore.getVocabulary());
    setNewWord({ word: '', meaning: '', example: '' });
    setIsAddOpen(false);
  };

  const filteredWords = words.filter((w) => {
    const matchesSearch =
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || w.masteryStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#0A0C10] text-zinc-100 selection:bg-[#D4F82A] selection:text-black">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-[#D4F82A] tracking-wider font-semibold">
                Personal Lexicon
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4F82A]" />
              <span className="text-xs text-zinc-400 font-mono">{words.length} Expressions Saved</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Vocabulary Vault</h1>
            <p className="text-xs text-zinc-400">
              Expressions and native idioms gathered across your conversation sessions.
            </p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4F82A] text-black font-bold text-xs hover:bg-[#c2e424] transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Word</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-2xl bg-[#121620] border border-[#1E2536] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search words or meanings..."
              className="w-full bg-[#161B26] border border-[#232D3E] rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4F82A]"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'new', 'learning', 'mastered'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${
                  filterStatus === st
                    ? 'bg-[#D4F82A] text-black border-[#D4F82A] font-bold'
                    : 'bg-[#161B26] text-zinc-400 border-[#232D3E] hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Words Grid */}
        {filteredWords.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#121620] border border-[#1E2536] space-y-3">
            <BookOpen className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-sm text-zinc-400">No expressions found matching your filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWords.map((word) => (
              <div
                key={word.id}
                className="p-5 rounded-2xl bg-[#121620] border border-[#1F2737] hover:border-[#D4F82A]/30 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-bold text-white font-mono tracking-tight">
                      {word.word}
                    </span>
                    <button
                      onClick={() => handleSpeak(word.word)}
                      className="p-1.5 rounded-lg bg-[#18202D] hover:bg-[#222C3E] text-zinc-300 hover:text-white"
                      title="Listen to native pronunciation"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#D4F82A]" />
                    </button>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                    {word.meaning}
                  </p>

                  <div className="mt-3 p-2.5 rounded-xl bg-[#0C0F15] border border-[#19202E] text-[11px] text-zinc-400 italic">
                    "{word.example}"
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1B2332] flex items-center justify-between text-xs">
                  {/* Status Toggle */}
                  <select
                    value={word.masteryStatus}
                    onChange={(e) => handleUpdateStatus(word.id, e.target.value as any)}
                    className="bg-[#161C27] border border-[#232E40] text-zinc-300 text-[11px] rounded-lg px-2 py-1 focus:outline-none"
                  >
                    <option value="new">New</option>
                    <option value="learning">Learning</option>
                    <option value="mastered">Mastered</option>
                  </select>

                  <button
                    onClick={() => handleDelete(word.id)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                    title="Remove word"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Modal */}
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <form onSubmit={handleAddCustomWord} className="bg-[#121620] border border-[#232D3F] p-6 rounded-2xl max-w-md w-full text-white space-y-4">
              <h3 className="text-base font-bold">Add Expression to Vault</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newWord.word}
                  onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
                  placeholder="Word or Idiom (e.g. resilient)"
                  required
                  className="w-full bg-[#161B26] border border-[#232D3E] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4F82A]"
                />
                <input
                  type="text"
                  value={newWord.meaning}
                  onChange={(e) => setNewWord({ ...newWord, meaning: e.target.value })}
                  placeholder="Definition / Meaning"
                  className="w-full bg-[#161B26] border border-[#232D3E] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4F82A]"
                />
                <textarea
                  value={newWord.example}
                  onChange={(e) => setNewWord({ ...newWord, example: e.target.value })}
                  placeholder="Example Sentence"
                  rows={2}
                  className="w-full bg-[#161B26] border border-[#232D3E] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4F82A]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#18202D] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#D4F82A] text-black text-xs font-bold hover:bg-[#c2e424]"
                >
                  Save Expression
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
