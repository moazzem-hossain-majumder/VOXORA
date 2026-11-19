'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Volume2, Sparkles, Loader2 } from 'lucide-react';
import { AIPersonality } from '@/lib/types';

export type SpeakingState = 'idle' | 'listening' | 'processing' | 'speaking';

interface AvatarSphereProps {
  personality: AIPersonality;
  state: SpeakingState;
  audioLevel?: number; // 0 to 1
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function AvatarSphere({
  personality,
  state,
  audioLevel = 0,
  onClick,
  size = 'lg'
}: AvatarSphereProps) {
  // Dimension mappings
  const dimensions = {
    sm: 'w-24 h-24 sm:w-28 sm:h-28',
    md: 'w-36 h-36 sm:w-44 sm:h-44',
    lg: 'w-52 h-52 sm:w-64 sm:h-64'
  }[size];

  // Colors based on state
  const getStateGlow = () => {
    switch (state) {
      case 'listening':
        return 'rgba(56, 189, 248, 0.5)';
      case 'processing':
        return 'rgba(192, 132, 252, 0.45)';
      case 'speaking':
        return 'rgba(212, 248, 42, 0.5)';
      case 'idle':
      default:
        return 'rgba(212, 248, 42, 0.25)';
    }
  };

  const getSphereGradient = () => {
    switch (state) {
      case 'listening':
        return 'from-sky-300 via-cyan-500 to-blue-700';
      case 'processing':
        return 'from-purple-300 via-fuchsia-500 to-indigo-800';
      case 'speaking':
        return 'from-[#FAFF9E] via-[#D4F82A] to-[#608000]';
      case 'idle':
      default:
        return 'from-[#F3FFA8] via-[#BEEA14] to-[#425900]';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Outer Glow Halo */}
      <motion.div
        animate={{
          scale: state === 'listening' ? [1, 1.25, 1.05] : state === 'speaking' ? [1, 1.15, 1] : [1, 1.04, 1],
          opacity: state === 'idle' ? 0.4 : 0.85,
        }}
        transition={{
          duration: state === 'listening' ? 1.4 : state === 'speaking' ? 0.8 : 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute rounded-full filter blur-2xl pointer-events-none"
        style={{
          width: size === 'lg' ? '280px' : size === 'md' ? '200px' : '130px',
          height: size === 'lg' ? '280px' : size === 'md' ? '200px' : '130px',
          backgroundColor: getStateGlow(),
        }}
      />

      {/* Ripple Rings when Listening */}
      {state === 'listening' && (
        <>
          <motion.div
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
            className="absolute rounded-full border border-sky-400/40 pointer-events-none"
            style={{ width: '100%', height: '100%' }}
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 2.3, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2.2, delay: 0.7, ease: 'easeOut' }}
            className="absolute rounded-full border border-sky-400/20 pointer-events-none"
            style={{ width: '100%', height: '100%' }}
          />
        </>
      )}

      {/* Sphere Body */}
      <motion.div
        onClick={onClick}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        animate={{
          scale: state === 'speaking' ? [1, 1.05, 0.98, 1.04, 1] : state === 'listening' ? [1, 1.06, 1] : [1, 1.02, 1],
          rotate: state === 'processing' ? [0, 180, 360] : 0,
        }}
        transition={{
          scale: {
            duration: state === 'speaking' ? 0.7 : state === 'listening' ? 1.2 : 4,
            repeat: Infinity,
            ease: 'easeInOut',
          },
          rotate: {
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
        className={`relative ${dimensions} rounded-full bg-gradient-to-tr ${getSphereGradient()} p-[2px] shadow-2xl cursor-pointer flex items-center justify-center overflow-hidden`}
      >
        {/* Dynamic Inner Fluid Surface */}
        <div className="w-full h-full rounded-full relative flex items-center justify-center overflow-hidden bg-black/10 backdrop-blur-sm">
          {/* Surface Sheen */}
          <div className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full bg-gradient-to-br from-white/60 to-transparent filter blur-md pointer-events-none" />

          {/* Core State Icon / Waveform */}
          <div className="z-10 flex flex-col items-center justify-center">
            {state === 'listening' && (
              <div className="flex items-center gap-1">
                {[0.4, 0.9, 0.6, 1.0, 0.5].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ['8px', `${Math.max(12, h * 36)}px`, '8px'] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.5 + i * 0.1,
                      ease: 'easeInOut',
                    }}
                    className="w-1.5 rounded-full bg-white shadow-sm"
                  />
                ))}
              </div>
            )}

            {state === 'processing' && (
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}

            {state === 'speaking' && (
              <div className="flex items-center gap-1.5">
                {[0.5, 1.0, 0.7, 0.9, 0.4].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ['10px', `${Math.max(14, h * 42)}px`, '10px'] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.4 + i * 0.08,
                      ease: 'easeInOut',
                    }}
                    className="w-1.5 rounded-full bg-black/80"
                  />
                ))}
              </div>
            )}

            {state === 'idle' && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="w-4 h-4 rounded-full bg-black/40 backdrop-blur-sm shadow-inner"
              />
            )}
          </div>

          {/* Specular Edge Highlights */}
          <div className="absolute inset-0 rounded-full border border-white/40 pointer-events-none" />
        </div>
      </motion.div>

      {/* State Caption Pill */}
      <div className="mt-4 flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#141822]/90 border border-[#242C3E] backdrop-blur-md">
        <span
          className={`w-2 h-2 rounded-full ${
            state === 'listening'
              ? 'bg-sky-400 animate-ping'
              : state === 'speaking'
              ? 'bg-[#D4F82A] animate-pulse'
              : state === 'processing'
              ? 'bg-purple-400 animate-spin'
              : 'bg-zinc-500'
          }`}
        />
        <span className="text-xs font-mono font-medium tracking-wide uppercase text-zinc-300">
          {state === 'listening'
            ? 'Listening to you...'
            : state === 'speaking'
            ? `${personality.name} is speaking`
            : state === 'processing'
            ? 'Analyzing speech...'
            : 'Tap mic or press Space to talk'}
        </span>
      </div>
    </div>
  );
}
