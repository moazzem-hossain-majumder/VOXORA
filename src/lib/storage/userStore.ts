import {
  UserProgress,
  ConversationSession,
  VocabularyWord,
  Achievement,
  DailyChallenge,
  RecurringMistakePattern,
  DifficultyLevel,
  CorrectionStrictness
} from '../types';
import { ALL_ACHIEVEMENTS, INITIAL_DAILY_CHALLENGES } from '../gamification';

const STORAGE_KEYS = {
  PROGRESS: 'voxora_user_progress',
  SESSIONS: 'voxora_sessions',
  VOCABULARY: 'voxora_vocabulary',
  ACHIEVEMENTS: 'voxora_achievements',
  CHALLENGES: 'voxora_challenges',
  CURRENT_USER: 'voxora_current_user',
};

export interface LocalUserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isGuest: boolean;
}

const DEFAULT_PROFILE: LocalUserProfile = {
  id: 'guest_speaker_01',
  name: 'Fluent Explorer',
  email: 'learner@voxora.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isGuest: true,
};

const DEFAULT_PROGRESS: UserProgress = {
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalXp: 850,
  currentLevel: 3,
  totalSpeakingMinutes: 42,
  totalConversations: 12,
  bestScore: 8.8,
  preferredDifficulty: 'intermediate',
  preferredStrictness: 'balanced',
  weeklyScores: [
    { week: 'Week 1', score: 6.2, conversations: 3 },
    { week: 'Week 2', score: 6.8, conversations: 4 },
    { week: 'Week 3', score: 7.4, conversations: 5 },
    { week: 'Week 4', score: 8.1, conversations: 6 },
  ],
  recurringMistakes: [
    {
      id: 'm1',
      mistakePattern: 'Irregular past tense verbs (went vs go)',
      category: 'Tenses',
      frequency: 4,
      exampleSentence: 'Yesterday I go to market -> Yesterday I went to the market',
      recommendedDrill: 'Past tense story continuation',
      lastEncountered: 'Yesterday'
    },
    {
      id: 'm2',
      mistakePattern: 'Indirect object preposition ("explain me")',
      category: 'Prepositions',
      frequency: 3,
      exampleSentence: 'Can you explain me? -> Can you explain to me?',
      recommendedDrill: 'Preposition pair repetition',
      lastEncountered: '3 days ago'
    },
    {
      id: 'm3',
      mistakePattern: 'Excessive filler word ("like / you know")',
      category: 'Fluency',
      frequency: 5,
      exampleSentence: 'Like, it was, you know, very nice -> It was genuinely enjoyable',
      recommendedDrill: '2-second silent breath technique',
      lastEncountered: 'Today'
    }
  ],
};

const INITIAL_VOCAB: VocabularyWord[] = [
  {
    id: 'v1',
    word: 'resilient',
    meaning: 'able to withstand or recover quickly from difficult conditions',
    example: 'She proved to be remarkably resilient under intense interview pressure.',
    sourceContext: 'Interview coaching session with Michael',
    savedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    masteryStatus: 'learning',
    reviewCount: 3
  },
  {
    id: 'v2',
    word: 'met up with',
    meaning: 'gathered or met socially with friends',
    example: 'I met up with my former colleagues for Sunday brunch.',
    sourceContext: 'Casual conversation with Alex',
    savedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    masteryStatus: 'mastered',
    reviewCount: 5
  },
  {
    id: 'v3',
    word: 'delve into',
    meaning: 'to investigate or examine something deeply and thoroughly',
    example: 'Let’s delve into the environmental impact of modern urbanization.',
    sourceContext: 'IELTS Part 3 discussion with Sophia',
    savedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    masteryStatus: 'new',
    reviewCount: 1
  }
];

export class UserStore {
  public static getUser(): LocalUserProfile {
    if (typeof window === 'undefined') return DEFAULT_PROFILE;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  }

  public static setUser(user: LocalUserProfile) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  public static getProgress(): UserProgress {
    if (typeof window === 'undefined') return DEFAULT_PROGRESS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      return data ? JSON.parse(data) : DEFAULT_PROGRESS;
    } catch {
      return DEFAULT_PROGRESS;
    }
  }

  public static saveProgress(progress: UserProgress) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  }

  public static getSessions(): ConversationSession[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static saveSession(session: ConversationSession) {
    if (typeof window === 'undefined') return;
    const sessions = this.getSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.unshift(session);
    }
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));

    // Update overall user stats
    const progress = this.getProgress();
    progress.totalConversations += 1;
    progress.totalSpeakingMinutes += Math.max(1, Math.round(session.durationSeconds / 60));
    if (session.averageScore && session.averageScore > progress.bestScore) {
      progress.bestScore = session.averageScore;
    }
    progress.totalXp += 120;
    this.saveProgress(progress);
  }

  public static getVocabulary(): VocabularyWord[] {
    if (typeof window === 'undefined') return INITIAL_VOCAB;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VOCABULARY);
      return data ? JSON.parse(data) : INITIAL_VOCAB;
    } catch {
      return INITIAL_VOCAB;
    }
  }

  public static saveVocabularyWord(word: Omit<VocabularyWord, 'id' | 'savedAt' | 'reviewCount' | 'masteryStatus'> & { masteryStatus?: 'new' | 'learning' | 'mastered' }): VocabularyWord {
    const list = this.getVocabulary();
    const existing = list.find(w => w.word.toLowerCase() === word.word.toLowerCase());
    if (existing) return existing;

    const newWord: VocabularyWord = {
      masteryStatus: word.masteryStatus || 'new',
      ...word,
      id: 'vocab_' + Date.now(),
      savedAt: new Date().toISOString(),
      reviewCount: 0,
    };
    list.unshift(newWord);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(list));
    }
    return newWord;
  }

  public static updateWordMastery(id: string, status: 'new' | 'learning' | 'mastered') {
    const list = this.getVocabulary();
    const target = list.find(w => w.id === id);
    if (target) {
      target.masteryStatus = status;
      target.reviewCount += 1;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(list));
      }
    }
  }

  public static deleteWord(id: string) {
    const list = this.getVocabulary().filter(w => w.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(list));
    }
  }

  public static getAchievements(): Achievement[] {
    if (typeof window === 'undefined') return ALL_ACHIEVEMENTS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return data ? JSON.parse(data) : ALL_ACHIEVEMENTS;
    } catch {
      return ALL_ACHIEVEMENTS;
    }
  }

  public static unlockAchievement(id: string) {
    const list = this.getAchievements();
    const item = list.find(a => a.id === id);
    if (item && !item.unlockedAt) {
      item.progress = item.maxProgress;
      item.unlockedAt = new Date().toISOString();
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(list));
      }
    }
  }

  public static getDailyChallenges(): DailyChallenge[] {
    if (typeof window === 'undefined') return INITIAL_DAILY_CHALLENGES;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
      return data ? JSON.parse(data) : INITIAL_DAILY_CHALLENGES;
    } catch {
      return INITIAL_DAILY_CHALLENGES;
    }
  }

  public static completeChallenge(id: string) {
    const list = this.getDailyChallenges();
    const challenge = list.find(c => c.id === id);
    if (challenge && !challenge.completed) {
      challenge.completed = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(list));
      }
      const progress = this.getProgress();
      progress.totalXp += challenge.xpReward;
      this.saveProgress(progress);
    }
  }
}
