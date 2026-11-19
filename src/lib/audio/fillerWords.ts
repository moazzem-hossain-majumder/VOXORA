import { FillerWordCount } from '../types';

const FILLER_PATTERNS: Array<{ word: string; regex: RegExp }> = [
  { word: 'um / uh', regex: /\b(um|uh|umm|uhh|er|err)\b/gi },
  { word: 'like', regex: /\b(like)\b/gi },
  { word: 'you know', regex: /\b(you know)\b/gi },
  { word: 'actually', regex: /\b(actually)\b/gi },
  { word: 'basically', regex: /\b(basically)\b/gi },
  { word: 'literally', regex: /\b(literally)\b/gi },
  { word: 'sort of / kind of', regex: /\b(sort of|kind of|kinda|sorta)\b/gi },
  { word: 'i mean', regex: /\b(i mean)\b/gi },
];

export function detectFillerWords(transcript: string): {
  totalFillers: number;
  fillerRatioPercent: number;
  breakdown: FillerWordCount[];
  pacingNote: string;
} {
  if (!transcript || transcript.trim().length === 0) {
    return {
      totalFillers: 0,
      fillerRatioPercent: 0,
      breakdown: [],
      pacingNote: 'Clean speech pacing.'
    };
  }

  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const totalWords = words.length;
  const breakdown: FillerWordCount[] = [];
  let totalFillers = 0;

  for (const item of FILLER_PATTERNS) {
    const matches = transcript.match(item.regex);
    const count = matches ? matches.length : 0;
    if (count > 0) {
      breakdown.push({ word: item.word, count });
      totalFillers += count;
    }
  }

  const fillerRatioPercent = totalWords > 0 ? Math.round((totalFillers / totalWords) * 100) : 0;

  let pacingNote = 'Great pacing! Very minimal or no filler words detected.';
  if (fillerRatioPercent > 12) {
    pacingNote = 'High filler word density. Try taking a silent 1-second pause instead of using "um" or "like" while thinking.';
  } else if (fillerRatioPercent > 6) {
    pacingNote = 'Moderate filler usage. Replacing fillers with deliberate breath pauses will make you sound substantially more confident.';
  }

  return {
    totalFillers,
    fillerRatioPercent,
    breakdown,
    pacingNote
  };
}
