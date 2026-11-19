import { Achievement, DailyChallenge, UserProgress } from './types';

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_words',
    title: 'First Conversation',
    description: 'Broke the silence and completed your very first speaking session.',
    icon: 'Sparkles',
    category: 'speaking',
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'streak_3',
    title: 'Consistency Sparks',
    description: 'Maintained a 3-day active speaking streak.',
    icon: 'Flame',
    category: 'streak',
    progress: 0,
    maxProgress: 3,
  },
  {
    id: 'streak_7',
    title: 'Unstoppable Momentum',
    description: 'Practiced English speaking for 7 consecutive days.',
    icon: 'Zap',
    category: 'streak',
    progress: 0,
    maxProgress: 7,
  },
  {
    id: 'speaking_10_min',
    title: '10 Minutes of Voice',
    description: 'Accumulated 10 total minutes of active English speech.',
    icon: 'Clock',
    category: 'speaking',
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'speaking_60_min',
    title: 'Voice Marathoner',
    description: 'Accumulated 1 full hour of spoken English practice.',
    icon: 'Mic',
    category: 'speaking',
    progress: 0,
    maxProgress: 60,
  },
  {
    id: 'grammar_master',
    title: 'Grammar Master',
    description: 'Achieved an outstanding 9.0+ grammar score on a response.',
    icon: 'CheckCircle2',
    category: 'fluency',
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'vocab_explorer',
    title: 'Vocabulary Explorer',
    description: 'Saved 10 useful words or native idioms to your Vocabulary Vault.',
    icon: 'BookMarked',
    category: 'explorer',
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'interview_ready',
    title: 'Interview Ready',
    description: 'Completed a full behavioral or technical interview session with Michael.',
    icon: 'Briefcase',
    category: 'interview',
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'fearless_speaker',
    title: 'Fearless Speaker',
    description: 'Embraced mistakes and completed a session in Speak Without Fear mode.',
    icon: 'Shield',
    category: 'speaking',
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'shadow_pro',
    title: 'Shadow Pro',
    description: 'Scored 90%+ pronunciation & cadence accuracy in Shadow Mode.',
    icon: 'Repeat',
    category: 'fluency',
    progress: 0,
    maxProgress: 1,
  },
];

export const INITIAL_DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'dc_1',
    title: 'Morning Warm-up',
    description: 'Complete 3 minutes of conversation in Friendly Companion mode.',
    modeId: 'friendly',
    targetMinutes: 3,
    xpReward: 120,
    completed: false,
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 'dc_2',
    title: 'Grammar Discipline',
    description: 'Practice with Emma and repeat at least 2 improved sentences.',
    modeId: 'teacher',
    targetMinutes: 4,
    xpReward: 150,
    completed: false,
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 'dc_3',
    title: 'Shadow Drills',
    description: 'Complete 3 shadow sentences to train natural speech cadence.',
    modeId: 'friendly',
    targetMinutes: 3,
    xpReward: 100,
    completed: false,
    date: new Date().toISOString().split('T')[0],
  },
];

export function calculateLevel(xp: number): { level: number; title: string; currentLevelXp: number; nextLevelXp: number } {
  const levelThresholds = [
    { level: 1, minXp: 0, title: 'Novice Speaker' },
    { level: 2, minXp: 300, title: 'Curious Conversationalist' },
    { level: 3, minXp: 800, title: 'Fluent Explorer' },
    { level: 4, minXp: 1600, title: 'Articulate Thinker' },
    { level: 5, minXp: 2800, title: 'Confident Orator' },
    { level: 6, minXp: 4500, title: 'Eloquent Master' },
    { level: 7, minXp: 7000, title: 'Native-Level Virtuoso' },
  ];

  let current = levelThresholds[0];
  let next = levelThresholds[1];

  for (let i = 0; i < levelThresholds.length; i++) {
    if (xp >= levelThresholds[i].minXp) {
      current = levelThresholds[i];
      next = levelThresholds[i + 1] || { level: current.level + 1, minXp: current.minXp + 3000, title: 'Speaking Luminary' };
    } else {
      break;
    }
  }

  const range = next.minXp - current.minXp;
  const progressInLevel = xp - current.minXp;

  return {
    level: current.level,
    title: current.title,
    currentLevelXp: Math.max(0, progressInLevel),
    nextLevelXp: range,
  };
}
