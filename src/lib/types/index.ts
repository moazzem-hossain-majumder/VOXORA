export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'not_sure';
export type CorrectionStrictness = 'gentle' | 'balanced' | 'strict';

export type PersonalityId =
  | 'alex'
  | 'emma'
  | 'michael'
  | 'sophia'
  | 'ryan'
  | 'mia'
  | 'daniel';

export type ConversationModeId =
  | 'friendly'
  | 'interview'
  | 'teacher'
  | 'ielts'
  | 'debate'
  | 'roulette'
  | 'storytelling'
  | 'roleplay'
  | 'pressure'
  | 'adventure'
  | 'fearless';

export interface AIPersonality {
  id: PersonalityId;
  name: string;
  tagline: string;
  description: string;
  avatarColor: string;
  badge: string;
  speakingStyle: string;
  correctionStyle: string;
  difficulty: DifficultyLevel;
  voicePitch: number;
  voiceRate: number;
  systemPrompt: string;
  suggestedTopics: string[];
}

export interface ConversationMode {
  id: ConversationModeId;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  icon: string;
  primaryPersonality: PersonalityId;
  color: string;
  topics: string[];
}

export interface MistakeDetail {
  original: string;
  correction: string;
  explanation: string;
  type: 'grammar' | 'vocab' | 'structure' | 'preposition' | 'tense';
}

export interface VocabularySuggestion {
  word: string;
  meaning: string;
  example: string;
}

export interface FillerWordCount {
  word: string;
  count: number;
}

export interface SpeakingEvaluation {
  grammarScore: number;
  vocabularyScore: number;
  fluencyScore: number;
  sentenceStructureScore: number;
  relevanceScore: number;
  overallScore: number;
  pronunciationNotice: string;
  whatUserDidWell: string[];
  mistakes: MistakeDetail[];
  naturalAlternative: string;
  advancedAlternative: string;
  vocabularySuggestions: VocabularySuggestion[];
  nextImprovementTarget: string;
  fillerWords?: FillerWordCount[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  evaluation?: SpeakingEvaluation;
  durationSeconds?: number;
  modeSpecificData?: {
    ieltsPart?: number;
    interviewQuestionNumber?: number;
    scenarioStep?: string;
  };
}

export interface ConversationSession {
  id: string;
  userId?: string;
  personalityId: PersonalityId;
  modeId: ConversationModeId;
  topic: string;
  difficulty: DifficultyLevel;
  strictness: CorrectionStrictness;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  durationSeconds: number;
  averageScore?: number;
  status: 'active' | 'completed' | 'abandoned';
}

export interface VocabularyWord {
  id: string;
  word: string;
  meaning: string;
  example: string;
  sourceContext?: string;
  savedAt: string;
  masteryStatus: 'new' | 'learning' | 'mastered';
  reviewCount: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'speaking' | 'fluency' | 'explorer' | 'interview';
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  modeId: ConversationModeId;
  targetMinutes: number;
  xpReward: number;
  completed: boolean;
  date: string;
}

export interface RecurringMistakePattern {
  id: string;
  mistakePattern: string;
  category: string;
  frequency: number;
  exampleSentence: string;
  recommendedDrill: string;
  lastEncountered: string;
}

export interface UserProgress {
  streakDays: number;
  lastActiveDate: string;
  totalXp: number;
  currentLevel: number;
  totalSpeakingMinutes: number;
  totalConversations: number;
  bestScore: number;
  preferredDifficulty: DifficultyLevel;
  preferredStrictness: CorrectionStrictness;
  weeklyScores: Array<{ week: string; score: number; conversations: number }>;
  recurringMistakes: RecurringMistakePattern[];
}

export interface ShadowSentence {
  id: string;
  difficulty: DifficultyLevel;
  category: string;
  text: string;
  naturalToneExplanation: string;
  audioKey?: string;
}

export interface ShadowEvaluation {
  accuracyScore: number;
  similarityRatio: number;
  missingWords: string[];
  extraWords: string[];
  matchedWords: string[];
  feedback: string;
}

export interface VoiceJournalEntry {
  id: string;
  title: string;
  createdAt: string;
  rawTranscript: string;
  grammarCorrections: MistakeDetail[];
  vocabularyUpgrades: VocabularySuggestion[];
  reflectionSummary: string;
  durationSeconds: number;
  fluencyScore: number;
}
