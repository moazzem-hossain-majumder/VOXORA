'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Mic,
  Volume2,
  Clock,
  Sparkles,
  Settings,
  ChevronLeft,
  Flame,
  Award,
  Layers,
  CheckCircle,
  X,
  Play,
  RotateCcw,
  Zap
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import AvatarSphere, { SpeakingState } from '@/components/AvatarSphere';
import WaveformVisualizer from '@/components/conversation/WaveformVisualizer';
import EvaluationCard from '@/components/conversation/EvaluationCard';
import SkipActionBar from '@/components/conversation/SkipActionBar';
import ControlsBar from '@/components/conversation/ControlsBar';
import EmergencyRescueModal from '@/components/conversation/EmergencyRescueModal';

import { AI_PERSONALITIES } from '@/lib/personalities';
import { CONVERSATION_MODES } from '@/lib/modes';
import {
  PersonalityId,
  ConversationModeId,
  DifficultyLevel,
  CorrectionStrictness,
  ChatMessage,
  SpeakingEvaluation,
  ConversationSession
} from '@/lib/types';
import { ttsManager } from '@/lib/speech/speechSynthesis';
import { SpeechRecognitionManager } from '@/lib/speech/speechRecognition';
import { UserStore } from '@/lib/storage/userStore';

export default function ConversationPage() {
  const router = useRouter();

  // Settings & Modes
  const [personalityId, setPersonalityId] = useState<PersonalityId>('alex');
  const [modeId, setModeId] = useState<ConversationModeId>('friendly');
  const [topic, setTopic] = useState<string>('My favorite weekend hobbies and relaxing');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('intermediate');
  const [strictness, setStrictness] = useState<CorrectionStrictness>('balanced');

  // Conversation States
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [speakingState, setSpeakingState] = useState<SpeakingState>('idle');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [latestEvaluation, setLatestEvaluation] = useState<SpeakingEvaluation | null>(null);

  // Audio & Timing Controls
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Modals & Panels
  const [isRescueOpen, setIsRescueOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState<boolean>(false);
  const [showBetterAnswerModal, setShowBetterAnswerModal] = useState<boolean>(false);
  const [showPracticeModal, setShowPracticeModal] = useState<boolean>(false);
  const [showExplainModal, setShowExplainModal] = useState<boolean>(false);

  // Speech Recognition ref
  const speechManagerRef = useRef<SpeechRecognitionManager | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const currentPersonality = AI_PERSONALITIES[personalityId] || AI_PERSONALITIES.alex;
  const currentMode = CONVERSATION_MODES[modeId] || CONVERSATION_MODES.friendly;

  // Initialize session and greeting
  useEffect(() => {
    // Session timer interval
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);

    // Initial AI greeting message
    const initialGreeting = getInitialGreeting(personalityId, modeId, topic);
    setMessages([
      {
        id: 'msg_init',
        role: 'assistant',
        content: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    // Speak initial greeting aloud
    setTimeout(() => {
      ttsManager.speak(initialGreeting, {
        pitch: currentPersonality.voicePitch,
        rate: currentPersonality.voiceRate * playbackSpeed,
        voiceGender: personalityId === 'emma' || personalityId === 'sophia' || personalityId === 'mia' ? 'female' : 'male',
        onStart: () => setSpeakingState('speaking'),
        onEnd: () => setSpeakingState('idle'),
      });
    }, 600);

    // Setup speech recognition
    speechManagerRef.current = new SpeechRecognitionManager({
      onInterimResult: (text) => setLiveTranscript(text),
      onFinalResult: (text) => setLiveTranscript(text),
      onStart: () => {
        setIsListening(true);
        setSpeakingState('listening');
      },
      onEnd: () => {
        setIsListening(false);
      },
      onError: (errMsg) => {
        console.warn('Speech error:', errMsg);
        setIsListening(false);
        setSpeakingState('idle');
      },
    });

    return () => {
      clearInterval(timer);
      ttsManager.stop();
      if (speechManagerRef.current) {
        speechManagerRef.current.stop();
      }
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, liveTranscript, latestEvaluation]);

  function getInitialGreeting(pId: PersonalityId, mId: ConversationModeId, currentTopic: string) {
    if (mId === 'interview') {
      return `Welcome! I'm Michael, your executive interview coach today. We are exploring "${currentTopic}". When you are ready, could you introduce yourself and walk me through your recent background?`;
    }
    if (mId === 'ielts') {
      return `Good day. My name is Sophia, and I will be conducting your IELTS Speaking practice. Today's theme is "${currentTopic}". Let's begin with Part 1: could you tell me a little about where you grew up?`;
    }
    if (mId === 'debate') {
      return `Hey there! Ryan here. Today's debate topic is: "${currentTopic}". What is your stance on this, and what is your strongest argument?`;
    }
    if (mId === 'teacher') {
      return `Hello! I'm Emma, your English teacher. Today we're practicing: "${currentTopic}". Speak naturally, and don't worry about making mistakes—that's how we learn! How has your day been so far?`;
    }
    return `Hey! Great to meet you. I'm Alex. Today let's chat about "${currentTopic}". How is your day going so far?`;
  }

  // Toggle microphone
  const handleToggleMic = () => {
    if (isListening) {
      // Stop and send recognized text
      const transcript = speechManagerRef.current?.stop() || liveTranscript;
      setIsListening(false);
      setSpeakingState('idle');
      if (transcript.trim()) {
        handleSubmitUserSpeech(transcript.trim());
      }
      setLiveTranscript('');
    } else {
      // Start listening
      ttsManager.stop();
      setLiveTranscript('');
      speechManagerRef.current?.start();
      setIsListening(true);
      setSpeakingState('listening');
    }
  };

  // Submit spoken or typed response
  const handleSubmitUserSpeech = async (spokenText: string) => {
    if (!spokenText.trim() || isProcessing) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: 'msg_user_' + Date.now(),
      role: 'user',
      content: spokenText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsProcessing(true);
    setSpeakingState('processing');

    try {
      const res = await fetch('/api/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userTranscript: spokenText,
          conversationHistory: newHistory.map((m) => ({ role: m.role, content: m.content })),
          personalityId,
          modeId,
          topic,
          difficulty,
          strictness,
        }),
      });

      const data = await res.json();

      if (data.success && data.aiResponseText) {
        const aiMsg: ChatMessage = {
          id: 'msg_ai_' + Date.now(),
          role: 'assistant',
          content: data.aiResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          evaluation: data.evaluation,
        };

        setMessages((prev) => [...prev, aiMsg]);
        setLatestEvaluation(data.evaluation);

        // Speak AI response
        if (!isMuted) {
          ttsManager.speak(data.aiResponseText, {
            pitch: currentPersonality.voicePitch,
            rate: currentPersonality.voiceRate * playbackSpeed,
            voiceGender: personalityId === 'emma' || personalityId === 'sophia' || personalityId === 'mia' ? 'female' : 'male',
            onStart: () => setSpeakingState('speaking'),
            onEnd: () => setSpeakingState('idle'),
          });
        } else {
          setSpeakingState('idle');
        }
      }
    } catch (err) {
      console.error('Conversation turn error:', err);
      setSpeakingState('idle');
    } finally {
      setIsProcessing(false);
    }
  };

  // Replay AI response
  const handleReplayAudio = () => {
    const lastAiMsg = [...messages].reverse().find((m) => m.role === 'assistant');
    if (lastAiMsg) {
      ttsManager.speak(lastAiMsg.content, {
        pitch: currentPersonality.voicePitch,
        rate: currentPersonality.voiceRate * playbackSpeed,
        voiceGender: personalityId === 'emma' || personalityId === 'sophia' || personalityId === 'mia' ? 'female' : 'male',
        onStart: () => setSpeakingState('speaking'),
        onEnd: () => setSpeakingState('idle'),
      });
    }
  };

  // Skip / Next topic action
  const handleSkipTopic = async () => {
    try {
      const res = await fetch('/api/topics?category=intermediate');
      const data = await res.json();
      const newTopic = data.topic || 'Exploring cultural differences';
      setTopic(newTopic);

      const skipPrompt = `Let's switch gears and explore a new topic: "${newTopic}". What are your initial thoughts on this?`;
      const aiMsg: ChatMessage = {
        id: 'msg_skip_' + Date.now(),
        role: 'assistant',
        content: skipPrompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setLatestEvaluation(null);

      ttsManager.speak(skipPrompt, {
        pitch: currentPersonality.voicePitch,
        rate: currentPersonality.voiceRate * playbackSpeed,
        voiceGender: personalityId === 'emma' || personalityId === 'sophia' || personalityId === 'mia' ? 'female' : 'male',
        onStart: () => setSpeakingState('speaking'),
        onEnd: () => setSpeakingState('idle'),
      });
    } catch {
      setTopic('Favorite childhood memories');
    }
  };

  // End Session and Save
  const handleEndSession = () => {
    ttsManager.stop();
    if (speechManagerRef.current) speechManagerRef.current.stop();

    // Calculate session averages
    const evaluations = messages.map((m) => m.evaluation).filter(Boolean) as SpeakingEvaluation[];
    const avgScore =
      evaluations.length > 0
        ? Number((evaluations.reduce((sum, e) => sum + e.overallScore, 0) / evaluations.length).toFixed(1))
        : 7.5;

    const sessionRecord: ConversationSession = {
      id: 'session_' + Date.now(),
      personalityId,
      modeId,
      topic,
      difficulty,
      strictness,
      messages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      durationSeconds: sessionSeconds,
      averageScore: avgScore,
      status: 'completed',
    };

    UserStore.saveSession(sessionRecord);
    setIsEndModalOpen(true);
    confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
  };

  // Formatted timer
  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Current session average score
  const sessionEvaluations = messages.map((m) => m.evaluation).filter(Boolean) as SpeakingEvaluation[];
  const currentAvgScore =
    sessionEvaluations.length > 0
      ? (sessionEvaluations.reduce((acc, curr) => acc + curr.overallScore, 0) / sessionEvaluations.length).toFixed(1)
      : '—';

  return (
    <div className="min-h-screen bg-[#0A0C10] text-white flex flex-col justify-between selection:bg-[#D4F82A] selection:text-black">
      <Navbar />

      {/* Main Conversation Canvas */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-4 flex-1 flex flex-col gap-4">
        {/* Top Session Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#11141B]/80 border border-[#1E2535] backdrop-blur-md">
          {/* Personality & Mode Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/app')}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-[#1A212E] transition-colors"
              title="Return to Dashboard"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#D4F82A] animate-pulse" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{currentPersonality.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171D28] text-[#D4F82A] border border-[#D4F82A]/20">
                    {currentMode.name}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 max-w-sm sm:max-w-md truncate">
                  Topic: <span className="text-zinc-200">{topic}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Stats & Controls */}
          <div className="flex items-center gap-3">
            {/* Timer */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151923] border border-[#232C3E] text-xs font-mono text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>{formatTimer(sessionSeconds)}</span>
            </div>

            {/* Score */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151923] border border-[#D4F82A]/30 text-xs font-mono font-bold text-[#D4F82A]">
              <Award className="w-3.5 h-3.5" />
              <span>Score: {currentAvgScore}</span>
            </div>

            {/* Settings button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white bg-[#151923] border border-[#232C3E] hover:border-[#35435D] transition-colors"
              title="Session Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* End Session button */}
            <button
              onClick={handleEndSession}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
            >
              End Session
            </button>
          </div>
        </div>

        {/* Center Arena: Avatar Sphere + Visualizer */}
        <div className="flex flex-col items-center justify-center py-4 sm:py-6">
          <AvatarSphere
            personality={currentPersonality}
            state={speakingState}
            onClick={handleToggleMic}
            size="lg"
          />

          {/* Waveform Bar */}
          <div className="w-full max-w-lg mt-4">
            <WaveformVisualizer
              isListening={isListening}
              isSpeaking={speakingState === 'speaking'}
            />
          </div>
        </div>

        {/* Live Speech Recognition Transcript Box (Active when speaking) */}
        {(isListening || liveTranscript) && (
          <div className="w-full max-w-3xl mx-auto p-3.5 rounded-2xl bg-sky-950/20 border border-sky-500/30 text-center animate-fadeIn">
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-sky-400 uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span>Live Transcription</span>
            </div>
            <p className="text-sm sm:text-base text-zinc-100 font-medium italic">
              "{liveTranscript || 'Listening to your voice...'}"
            </p>
          </div>
        )}

        {/* Latest Evaluation & Pedagogical Feedback Card */}
        {latestEvaluation && modeId !== 'fearless' && (
          <div className="w-full max-w-3xl mx-auto">
            <EvaluationCard evaluation={latestEvaluation} />
          </div>
        )}

        {/* Skip & Primary Action Bar */}
        <div className="w-full max-w-3xl mx-auto">
          <SkipActionBar
            onContinue={handleToggleMic}
            onSkip={handleSkipTopic}
            onTryAgain={() => {
              ttsManager.stop();
              setLiveTranscript('');
              handleToggleMic();
            }}
            onShowBetterAnswer={() => setShowBetterAnswerModal(true)}
            onPracticeMistake={() => setShowPracticeModal(true)}
            onExplainMistake={() => setShowExplainModal(true)}
            onEmergencyRescue={() => setIsRescueOpen(true)}
            isProcessing={isProcessing}
            hasFeedback={Boolean(latestEvaluation)}
          />
        </div>

        {/* Conversation Dialogue History (Scrollable) */}
        <div
          ref={chatScrollRef}
          className="w-full max-w-3xl mx-auto mt-4 p-4 rounded-2xl bg-[#0D1016]/90 border border-[#19202D] max-h-60 overflow-y-auto space-y-3"
        >
          <div className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider pb-1 border-b border-[#181F2C]">
            Conversation History
          </div>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#18202E] text-zinc-100 border border-[#26334A] rounded-tr-none'
                    : 'bg-[#121620] text-zinc-200 border border-[#1D2535] rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1 text-[10px] font-mono text-zinc-500">
                  <span className={msg.role === 'user' ? 'text-sky-400 font-bold' : 'text-[#D4F82A] font-bold'}>
                    {msg.role === 'user' ? 'You' : currentPersonality.name}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>
                <p>{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Fixed-Style Controls Bar */}
        <div className="w-full max-w-3xl mx-auto pb-4">
          <ControlsBar
            isListening={isListening}
            isSpeaking={speakingState === 'speaking'}
            isProcessing={isProcessing}
            onToggleMic={handleToggleMic}
            onSendText={handleSubmitUserSpeech}
            onReplayAudio={handleReplayAudio}
            isMuted={isMuted}
            onToggleMute={() => {
              const nextMuted = !isMuted;
              setIsMuted(nextMuted);
              ttsManager.setMuted(nextMuted);
            }}
            playbackSpeed={playbackSpeed}
            onChangeSpeed={(spd) => setPlaybackSpeed(spd)}
          />
        </div>
      </main>

      {/* Emergency Rescue Modal */}
      <EmergencyRescueModal
        isOpen={isRescueOpen}
        onClose={() => setIsRescueOpen(false)}
        currentTopic={topic}
        onSelectSentence={(sentence) => {
          handleSubmitUserSpeech(sentence);
        }}
      />

      {/* Show Better Answer Modal */}
      {showBetterAnswerModal && latestEvaluation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121620] border border-[#232D3F] p-6 rounded-2xl max-w-md w-full text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B2332]">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Sparkles className="w-4 h-4 text-[#D4F82A]" />
                <span>Exemplar Answer</span>
              </div>
              <button onClick={() => setShowBetterAnswerModal(false)}>
                <X className="w-5 h-5 text-zinc-400 hover:text-white" />
              </button>
            </div>
            <div className="p-3.5 rounded-xl bg-[#171E2B] border border-[#D4F82A]/30 text-sm leading-relaxed text-zinc-100">
              "{latestEvaluation.naturalAlternative}"
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  ttsManager.speak(latestEvaluation.naturalAlternative);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#192231] hover:bg-[#222E42] text-xs font-semibold"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen</span>
              </button>
              <button
                onClick={() => setShowBetterAnswerModal(false)}
                className="px-4 py-2 rounded-xl bg-[#D4F82A] text-black text-xs font-bold"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Explain My Mistake Modal */}
      {showExplainModal && latestEvaluation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121620] border border-[#232D3F] p-6 rounded-2xl max-w-md w-full text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B2332]">
              <span className="text-sm font-bold text-purple-400">Simple Explanation</span>
              <button onClick={() => setShowExplainModal(false)}>
                <X className="w-5 h-5 text-zinc-400 hover:text-white" />
              </button>
            </div>
            <div className="space-y-3">
              {latestEvaluation.mistakes.map((m, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#171E2B] border border-[#232D3F] text-xs space-y-1.5">
                  <div className="text-rose-400 font-mono font-bold">Original: "{m.original}"</div>
                  <div className="text-[#D4F82A] font-mono font-bold">Better: "{m.correction}"</div>
                  <p className="text-zinc-300 pt-1">{m.explanation}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowExplainModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#D4F82A] text-black text-xs font-bold"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Practice My Mistake Modal */}
      {showPracticeModal && latestEvaluation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121620] border border-[#232D3F] p-6 rounded-2xl max-w-md w-full text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B2332]">
              <span className="text-sm font-bold text-amber-400">10-Second Repetition Drill</span>
              <button onClick={() => setShowPracticeModal(false)}>
                <X className="w-5 h-5 text-zinc-400 hover:text-white" />
              </button>
            </div>
            <p className="text-xs text-zinc-300">
              Read and speak this corrected sentence aloud 2 times to build muscle memory:
            </p>
            <div className="p-4 rounded-xl bg-[#171E2B] border border-amber-500/30 text-sm font-semibold text-amber-200 text-center">
              "{latestEvaluation.naturalAlternative}"
            </div>
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => ttsManager.speak(latestEvaluation.naturalAlternative)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#192231] text-xs"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear Cadence</span>
              </button>
              <button
                onClick={() => {
                  setShowPracticeModal(false);
                  handleToggleMic();
                }}
                className="px-4 py-2 rounded-xl bg-[#D4F82A] text-black text-xs font-bold"
              >
                Speak Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Drawer Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#11151E] border border-[#222B3D] p-6 rounded-2xl max-w-md w-full text-white space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A2231]">
              <span className="text-base font-bold">Conversation Settings</span>
              <button onClick={() => setIsSettingsOpen(false)}>
                <X className="w-5 h-5 text-zinc-400 hover:text-white" />
              </button>
            </div>

            {/* Difficulty */}
            <div>
              <label className="text-xs font-mono uppercase text-zinc-400 block mb-2">Difficulty Level</label>
              <div className="grid grid-cols-3 gap-2">
                {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setDifficulty(lvl)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all ${
                      difficulty === lvl
                        ? 'bg-[#D4F82A] text-black border-[#D4F82A]'
                        : 'bg-[#151924] text-zinc-400 border-[#222A3A] hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Strictness */}
            <div>
              <label className="text-xs font-mono uppercase text-zinc-400 block mb-2">Correction Frequency</label>
              <div className="grid grid-cols-3 gap-2">
                {(['gentle', 'balanced', 'strict'] as CorrectionStrictness[]).map((str) => (
                  <button
                    key={str}
                    onClick={() => setStrictness(str)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all ${
                      strictness === str
                        ? 'bg-sky-400 text-black border-sky-400'
                        : 'bg-[#151924] text-zinc-400 border-[#222A3A] hover:text-white'
                    }`}
                  >
                    {str}
                  </button>
                ))}
              </div>
            </div>

            {/* Personality Switcher */}
            <div>
              <label className="text-xs font-mono uppercase text-zinc-400 block mb-2">AI Personality</label>
              <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                {Object.values(AI_PERSONALITIES).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPersonalityId(p.id)}
                    className={`p-2 rounded-xl text-left border text-xs transition-all ${
                      personalityId === p.id
                        ? 'bg-[#192232] border-[#D4F82A] text-white'
                        : 'bg-[#141822] border-[#202737] text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold">{p.name}</div>
                    <div className="text-[10px] text-zinc-500 truncate">{p.badge}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsSettingsOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#D4F82A] text-black text-xs font-bold hover:bg-[#c2e424]"
            >
              Apply Settings
            </button>
          </div>
        </div>
      )}

      {/* End Session Celebration Summary Modal */}
      {isEndModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#11151E] border border-[#232C3E] rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white text-center space-y-5"
          >
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#D4F82A] to-[#80A300] flex items-center justify-center mx-auto shadow-xl shadow-[#D4F82A]/25">
              <Award className="w-8 h-8 text-black" />
            </div>

            <div>
              <h3 className="text-2xl font-black tracking-tight">Session Completed!</h3>
              <p className="text-sm text-zinc-400 mt-1">
                You spoke for {formatTimer(sessionSeconds)} with {currentPersonality.name}.
              </p>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#161B26] border border-[#232D3E]">
              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Average Score</span>
                <span className="text-xl font-bold font-mono text-[#D4F82A]">{currentAvgScore}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">XP Earned</span>
                <span className="text-xl font-bold font-mono text-amber-400">+120 XP</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Streak</span>
                <span className="text-xl font-bold font-mono text-sky-400">Active 🔥</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => router.push('/analytics')}
                className="w-full sm:flex-1 py-3 rounded-xl font-bold text-xs bg-[#1A2230] hover:bg-[#232D3F] border border-[#26334A] text-zinc-200 transition-colors"
              >
                View Analytics
              </button>
              <button
                onClick={() => router.push('/app')}
                className="w-full sm:flex-1 py-3 rounded-xl font-bold text-xs bg-[#D4F82A] hover:bg-[#c2e424] text-black transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
