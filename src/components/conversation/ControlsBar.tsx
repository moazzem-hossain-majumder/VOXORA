'use client';

import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  RotateCcw,
  Gauge,
  Keyboard,
  Type,
  Square
} from 'lucide-react';

interface ControlsBarProps {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  onToggleMic: () => void;
  onSendText: (text: string) => void;
  onReplayAudio: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  disabled?: boolean;
}

export default function ControlsBar({
  isListening,
  isSpeaking,
  isProcessing,
  onToggleMic,
  onSendText,
  onReplayAudio,
  isMuted,
  onToggleMute,
  playbackSpeed,
  onChangeSpeed,
  disabled = false,
}: ControlsBarProps) {
  const [showTextInput, setShowTextInput] = useState(false);
  const [typedMessage, setTypedMessage] = useState('');

  const speeds = [0.8, 1.0, 1.2];

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || isProcessing) return;
    onSendText(typedMessage.trim());
    setTypedMessage('');
    setShowTextInput(false);
  };

  const cycleSpeed = () => {
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    onChangeSpeed(speeds[nextIndex]);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Fallback Text Input Drawer */}
      {showTextInput && (
        <form onSubmit={handleTextSubmit} className="flex items-center gap-2 w-full animate-fadeIn">
          <input
            type="text"
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
            placeholder="Type your response here if microphone is noisy or unavailable..."
            disabled={isProcessing}
            className="flex-1 bg-[#131720] border border-[#242E40] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4F82A]"
            autoFocus
          />
          <button
            type="submit"
            disabled={!typedMessage.trim() || isProcessing}
            className="px-4 py-3 rounded-xl bg-[#D4F82A] text-black font-bold text-sm hover:bg-[#c2e424] disabled:opacity-50 flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      )}

      {/* Main Bottom Controls Toolbar */}
      <div className="flex items-center justify-between gap-3 p-3 bg-[#11141B]/95 rounded-2xl border border-[#202737] backdrop-blur-md">
        {/* Left Side: Audio Helpers */}
        <div className="flex items-center gap-1.5">
          {/* Mute/Unmute */}
          <button
            onClick={onToggleMute}
            className={`p-2.5 rounded-xl text-xs font-medium border transition-colors ${
              isMuted
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                : 'bg-[#161B26] text-zinc-300 border-[#242D3E] hover:text-white'
            }`}
            title={isMuted ? 'Unmute AI voice' : 'Mute AI voice'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Replay */}
          <button
            onClick={onReplayAudio}
            disabled={isProcessing || isSpeaking}
            className="p-2.5 rounded-xl text-xs font-medium bg-[#161B26] text-zinc-300 border border-[#242D3E] hover:text-white disabled:opacity-40 transition-colors"
            title="Replay AI response audio"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <button
            onClick={cycleSpeed}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-mono font-semibold bg-[#161B26] text-zinc-300 border border-[#242D3E] hover:text-white transition-colors"
            title="Voice playback speed"
          >
            <Gauge className="w-3.5 h-3.5 text-[#D4F82A]" />
            <span>{playbackSpeed}x</span>
          </button>
        </div>

        {/* Center: Hero Microphone Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={onToggleMic}
            disabled={disabled || isProcessing}
            className={`relative flex items-center justify-center px-6 py-3.5 rounded-full font-bold text-sm transition-all shadow-xl active:scale-95 disabled:opacity-50 ${
              isListening
                ? 'bg-rose-500 text-white shadow-rose-500/25 animate-pulse'
                : isProcessing
                ? 'bg-purple-600 text-white shadow-purple-600/20'
                : 'bg-[#D4F82A] text-black shadow-[#D4F82A]/20 hover:bg-[#c2e424]'
            }`}
          >
            {isListening ? (
              <div className="flex items-center gap-2">
                <Square className="w-4 h-4 fill-white" />
                <span>Done Speaking</span>
              </div>
            ) : isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 fill-current" />
                <span>Tap to Speak</span>
              </div>
            )}
          </button>
        </div>

        {/* Right Side: Text Mode Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowTextInput(!showTextInput)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border transition-colors ${
              showTextInput
                ? 'bg-[#D4F82A]/10 text-[#D4F82A] border-[#D4F82A]/30'
                : 'bg-[#161B26] text-zinc-400 border-[#242D3E] hover:text-white'
            }`}
            title="Switch to typing fallback"
          >
            <Type className="w-4 h-4" />
            <span className="hidden sm:inline">Type</span>
          </button>
        </div>
      </div>
    </div>
  );
}
