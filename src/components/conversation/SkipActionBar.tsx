'use client';

import React from 'react';
import {
  ArrowRight,
  FastForward,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Lightbulb,
  LifeBuoy
} from 'lucide-react';

interface SkipActionBarProps {
  onContinue: () => void;
  onSkip: () => void;
  onTryAgain: () => void;
  onShowBetterAnswer: () => void;
  onPracticeMistake: () => void;
  onExplainMistake: () => void;
  onEmergencyRescue: () => void;
  isProcessing?: boolean;
  hasFeedback?: boolean;
}

export default function SkipActionBar({
  onContinue,
  onSkip,
  onTryAgain,
  onShowBetterAnswer,
  onPracticeMistake,
  onExplainMistake,
  onEmergencyRescue,
  isProcessing = false,
  hasFeedback = false,
}: SkipActionBarProps) {
  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Primary Actions */}
      <div className="flex items-center gap-3 w-full">
        <button
          onClick={onContinue}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm bg-[#D4F82A] text-black shadow-lg shadow-[#D4F82A]/15 hover:bg-[#c2e424] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <span>Continue Conversation</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onSkip}
          disabled={isProcessing}
          title="Skip topic or jump to next question"
          className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl font-semibold text-sm bg-[#161B26] hover:bg-[#1F2736] text-zinc-300 border border-[#242E40] transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <FastForward className="w-4 h-4 text-amber-400" />
          <span>Skip / Next</span>
        </button>
      </div>

      {/* Secondary Context Actions */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-[#181F2C]">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={onTryAgain}
            disabled={isProcessing}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white bg-[#11151D] hover:bg-[#181F2C] border border-[#1E2636] transition-colors"
          >
            <RotateCcw className="w-3 h-3 text-sky-400" />
            <span>Try Again</span>
          </button>

          {hasFeedback && (
            <>
              <button
                onClick={onShowBetterAnswer}
                disabled={isProcessing}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white bg-[#11151D] hover:bg-[#181F2C] border border-[#1E2636] transition-colors"
              >
                <Sparkles className="w-3 h-3 text-[#D4F82A]" />
                <span>Show Better Answer</span>
              </button>

              <button
                onClick={onPracticeMistake}
                disabled={isProcessing}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white bg-[#11151D] hover:bg-[#181F2C] border border-[#1E2636] transition-colors"
              >
                <Lightbulb className="w-3 h-3 text-amber-400" />
                <span>Practice My Mistake</span>
              </button>

              <button
                onClick={onExplainMistake}
                disabled={isProcessing}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white bg-[#11151D] hover:bg-[#181F2C] border border-[#1E2636] transition-colors"
              >
                <HelpCircle className="w-3 h-3 text-purple-400" />
                <span>Explain Simple</span>
              </button>
            </>
          )}
        </div>

        {/* Emergency Rescue Trigger */}
        <button
          onClick={onEmergencyRescue}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors ml-auto"
        >
          <LifeBuoy className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>Help Me Say It</span>
        </button>
      </div>
    </div>
  );
}
