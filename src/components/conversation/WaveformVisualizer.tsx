'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface WaveformVisualizerProps {
  isListening: boolean;
  isSpeaking: boolean;
  barCount?: number;
}

export default function WaveformVisualizer({
  isListening,
  isSpeaking,
  barCount = 28,
}: WaveformVisualizerProps) {
  const bars = Array.from({ length: barCount }, (_, i) => i);

  const getBarColor = (index: number) => {
    if (isListening) return '#38BDF8'; // Sky blue
    if (isSpeaking) return '#D4F82A'; // Electric lime
    return '#273142'; // Idle dark
  };

  return (
    <div className="w-full flex items-center justify-center gap-1 sm:gap-1.5 h-12 px-4 py-2 bg-[#0C0F15]/90 rounded-2xl border border-[#1C2331] overflow-hidden">
      {bars.map((i) => {
        // Variable baseline heights for natural wave contour
        const distanceFromCenter = Math.abs(i - barCount / 2) / (barCount / 2);
        const baseHeight = Math.max(4, 28 * (1 - distanceFromCenter * 0.7));

        return (
          <motion.div
            key={i}
            animate={{
              height: isListening
                ? [`${Math.max(6, baseHeight * 0.4)}px`, `${Math.max(12, baseHeight * 1.5)}px`, `${Math.max(6, baseHeight * 0.6)}px`]
                : isSpeaking
                ? [`${Math.max(6, baseHeight * 0.3)}px`, `${Math.max(16, baseHeight * 1.8)}px`, `${Math.max(6, baseHeight * 0.5)}px`]
                : '4px',
              opacity: isListening || isSpeaking ? 1 : 0.35,
            }}
            transition={{
              duration: isListening ? 0.45 + (i % 5) * 0.08 : isSpeaking ? 0.35 + (i % 4) * 0.07 : 0.2,
              repeat: isListening || isSpeaking ? Infinity : 0,
              ease: 'easeInOut',
              delay: (i % 6) * 0.05,
            }}
            className="w-1 sm:w-1.5 rounded-full transition-colors"
            style={{
              backgroundColor: getBarColor(i),
            }}
          />
        );
      })}
    </div>
  );
}
