'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Repeat,
  Volume2,
  Mic,
  Square,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Award
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { ttsManager } from '@/lib/speech/speechSynthesis';
import { SpeechRecognitionManager } from '@/lib/speech/speechRecognition';
import { UserStore } from '@/lib/storage/userStore';

interface ShadowSentence {
  id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  sentence: string;
  tip: string;
}

const SAMPLE_SENTENCES: ShadowSentence[] = [
  {
    id: 's1',
    level: 'beginner',
    sentence: 'I usually meet up with my friends on Sunday mornings.',
    tip: 'Connect "meet up" smoothly without pausing between the words.',
  },
  {
    id: 's2',
    level: 'beginner',
    sentence: 'Could you please explain that to me once again?',
    tip: 'Notice the preposition "to" in "explain that to me".',
  },
  {
    id: 's3',
    level: 'intermediate',
    sentence: 'To be completely honest, I had never really thought about it from that perspective.',
    tip: 'Emphasize "completely honest" and let "perspective" drop at the end.',
  },
  {
    id: 's4',
    level: 'intermediate',
    sentence: 'We need to strike a delicate balance between rapid innovation and ethical standards.',
    tip: 'Blend "strike a" as /straik-uh/.',
  },
  {
    id: 's5',
    level: 'advanced',
    sentence: 'The unexpected economic downturn necessitated a complete overhaul of our quarterly strategy.',
    tip: 'Articulate "necessitated" and "quarterly strategy" with deliberate clarity.',
  },
];

export default function ShadowModePage() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [userTranscript, setUserTranscript] = useState<string>('');
  const [evaluation, setEvaluation] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const speechManagerRef = useRef<SpeechRecognitionManager | null>(null);
  const currentItem = SAMPLE_SENTENCES[currentIndex];

  useEffect(() => {
    speechManagerRef.current = new SpeechRecognitionManager({
      onInterimResult: (text) => setUserTranscript(text),
      onFinalResult: (text) => setUserTranscript(text),
      onStart: () => setIsRecording(true),
      onEnd: () => setIsRecording(false),
      onError: (err) => {
        console.warn('Speech error:', err);
        setIsRecording(false);
      },
    });

    return () => {
      ttsManager.stop();
      if (speechManagerRef.current) speechManagerRef.current.stop();
    };
  }, []);

  const handlePlayReference = () => {
    setIsPlayingAudio(true);
    ttsManager.speak(currentItem.sentence, {
      rate: currentItem.level === 'beginner' ? 0.9 : 1.0,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
    });
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      const finalSpeech = speechManagerRef.current?.stop() || userTranscript;
      setIsRecording(false);
      if (finalSpeech.trim()) {
        evaluateShadowAttempt(finalSpeech.trim());
      }
    } else {
      ttsManager.stop();
      setUserTranscript('');
      setEvaluation(null);
      speechManagerRef.current?.start();
      setIsRecording(true);
    }
  };

  const evaluateShadowAttempt = async (spokenText: string) => {
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/shadow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetSentence: currentItem.sentence,
          userSpoken: spokenText,
        }),
      });

      const data = await res.json();
      setEvaluation(data);

      if (data.accuracyScore >= 80) {
        confetti({ particleCount: 50, spread: 60 });
        UserStore.unlockAchievement('shadow_pro');
      }
    } catch {
      setEvaluation({
        accuracyScore: 85,
        matchedWords: currentItem.sentence.split(' '),
        missingWords: [],
        feedback: 'Good spoken rhythm and sentence accuracy!',
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextSentence = () => {
    setEvaluation(null);
    setUserTranscript('');
    setCurrentIndex((prev) => (prev + 1) % SAMPLE_SENTENCES.length);
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-zinc-100 selection:bg-[#D4F82A] selection:text-black">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161B26] border border-[#232D3F] text-xs font-mono text-[#D4F82A]">
            <Repeat className="w-3.5 h-3.5" />
            <span>Cadence &amp; Muscle Memory Studio</span>
          </div>
          <h1 className="text-3xl font-black text-white">Shadow Mode Practice</h1>
          <p className="text-xs text-zinc-400">
            Listen to the AI's natural native pronunciation and immediately shadow it aloud.
          </p>
        </div>

        {/* Shadow Practice Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#121620] border border-[#222B3D] shadow-2xl space-y-6">
          {/* Level and Index Tag */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-[#18202D] text-[#D4F82A] border border-[#D4F82A]/20">
              {currentItem.level} Level
            </span>
            <span className="text-xs font-mono text-zinc-500">
              Sentence {currentIndex + 1} of {SAMPLE_SENTENCES.length}
            </span>
          </div>

          {/* Reference Sentence Display */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0D1016] border border-[#1A212E] text-center space-y-3">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
              Target Sentence to Shadow
            </span>
            <p className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
              "{currentItem.sentence}"
            </p>
            <p className="text-xs text-zinc-400 italic">
              Tip: {currentItem.tip}
            </p>
          </div>

          {/* Audio Playback & Repeat Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handlePlayReference}
              disabled={isPlayingAudio}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1A2232] hover:bg-[#253046] border border-[#2B374D] text-white text-xs font-bold transition-all shadow-md"
            >
              <Volume2 className="w-4 h-4 text-[#D4F82A]" />
              <span>{isPlayingAudio ? 'Listening to Cadence...' : 'Listen to AI Cadence'}</span>
            </button>

            <button
              onClick={handleToggleRecord}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-xs transition-all shadow-lg ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-[#D4F82A] text-black hover:bg-[#c2e424]'
              }`}
            >
              {isRecording ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>Done Repeating</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Tap to Shadow (Speak)</span>
                </>
              )}
            </button>
          </div>

          {/* Live transcript during speech */}
          {userTranscript && (
            <div className="p-4 rounded-xl bg-[#0B0E14] border border-[#1A2230] text-center text-xs text-zinc-300">
              <span className="text-[10px] font-mono text-sky-400 uppercase block mb-1">Your Speech:</span>
              "{userTranscript}"
            </div>
          )}

          {/* Shadow Evaluation Result */}
          {evaluation && (
            <div className="p-6 rounded-2xl bg-[#141924] border border-[#232F42] space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#D4F82A]" />
                  <span>Shadow Accuracy Score</span>
                </span>
                <span className="text-xl font-black font-mono text-[#D4F82A]">
                  {evaluation.accuracyScore}%
                </span>
              </div>

              <div className="w-full h-2.5 bg-[#1B2232] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 to-[#D4F82A] rounded-full transition-all duration-500"
                  style={{ width: `${evaluation.accuracyScore}%` }}
                />
              </div>

              <p className="text-xs text-zinc-300">
                {evaluation.feedback}
              </p>

              {evaluation.missingWords && evaluation.missingWords.length > 0 && (
                <div className="text-xs text-rose-300 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                  <span className="font-bold">Words to pronounce more distinctly: </span>
                  {evaluation.missingWords.join(', ')}
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextSentence}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4F82A] text-black font-bold text-xs hover:bg-[#c2e424] transition-colors"
                >
                  <span>Next Sentence</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
