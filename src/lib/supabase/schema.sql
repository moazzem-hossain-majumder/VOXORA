-- ==============================================================================
-- VOXORA: Full Supabase PostgreSQL Schema & Security Policies
-- ==============================================================================

-- 1. Profiles Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  preferred_difficulty TEXT DEFAULT 'intermediate' CHECK (preferred_difficulty IN ('beginner', 'intermediate', 'advanced', 'not_sure')),
  preferred_strictness TEXT DEFAULT 'balanced' CHECK (preferred_strictness IN ('gentle', 'balanced', 'strict')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  personality_id TEXT NOT NULL,
  mode_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  strictness TEXT NOT NULL,
  duration_seconds INTEGER DEFAULT 0,
  average_score NUMERIC(3, 1),
  status TEXT DEFAULT 'completed' CHECK (status IN ('active', 'completed', 'abandoned')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Conversation Messages Table
CREATE TABLE IF NOT EXISTS public.conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  duration_seconds NUMERIC(4, 1),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Speaking Evaluations Table
CREATE TABLE IF NOT EXISTS public.speaking_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.conversation_messages(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  grammar_score NUMERIC(3, 1) NOT NULL,
  vocabulary_score NUMERIC(3, 1) NOT NULL,
  fluency_score NUMERIC(3, 1) NOT NULL,
  sentence_structure_score NUMERIC(3, 1) NOT NULL,
  relevance_score NUMERIC(3, 1) NOT NULL,
  overall_score NUMERIC(3, 1) NOT NULL,
  pronunciation_notice TEXT,
  what_user_did_well JSONB DEFAULT '[]'::JSONB,
  mistakes JSONB DEFAULT '[]'::JSONB,
  natural_alternative TEXT,
  advanced_alternative TEXT,
  vocabulary_suggestions JSONB DEFAULT '[]'::JSONB,
  next_improvement_target TEXT,
  filler_words JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. User Progress & Gamification Table
CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  streak_days INTEGER DEFAULT 1,
  last_active_date DATE DEFAULT CURRENT_DATE,
  total_xp INTEGER DEFAULT 150,
  current_level INTEGER DEFAULT 1,
  total_speaking_minutes INTEGER DEFAULT 0,
  total_conversations INTEGER DEFAULT 0,
  best_score NUMERIC(3, 1) DEFAULT 7.5,
  weekly_scores JSONB DEFAULT '[]'::JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Vocabulary Vault Table
CREATE TABLE IF NOT EXISTS public.vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  meaning TEXT NOT NULL,
  example TEXT NOT NULL,
  source_context TEXT,
  mastery_status TEXT DEFAULT 'new' CHECK (mastery_status IN ('new', 'learning', 'mastered')),
  review_count INTEGER DEFAULT 0,
  saved_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. User Achievements Table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- 8. Learning Memory Table (Cross-session recurring weaknesses)
CREATE TABLE IF NOT EXISTS public.learning_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  mistake_pattern TEXT NOT NULL,
  category TEXT NOT NULL,
  frequency INTEGER DEFAULT 1,
  example_sentence TEXT,
  recommended_drill TEXT,
  last_encountered TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Daily Challenges Table
CREATE TABLE IF NOT EXISTS public.daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenge_key TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 100,
  completed BOOLEAN DEFAULT FALSE,
  challenge_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR HIGH QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_conversations_user ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.conversation_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_user ON public.speaking_evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_user ON public.vocabulary(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_memory_user ON public.learning_memory(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speaking_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Conversations: Users can read/write their own conversations
CREATE POLICY "Users can manage own conversations" ON public.conversations FOR ALL USING (auth.uid() = user_id);

-- Messages: Users can manage messages in their conversations
CREATE POLICY "Users can manage messages" ON public.conversation_messages FOR ALL USING (
  EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_messages.conversation_id AND user_id = auth.uid())
);

-- Speaking Evaluations: Users can view own evaluations
CREATE POLICY "Users can view own evaluations" ON public.speaking_evaluations FOR ALL USING (auth.uid() = user_id);

-- User Progress: Users can view and update own progress
CREATE POLICY "Users can manage own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id);

-- Vocabulary: Users can manage own vocabulary vault
CREATE POLICY "Users can manage own vocabulary" ON public.vocabulary FOR ALL USING (auth.uid() = user_id);

-- Achievements: Users can manage own achievements
CREATE POLICY "Users can manage own achievements" ON public.user_achievements FOR ALL USING (auth.uid() = user_id);

-- Learning Memory: Users can manage own memory entries
CREATE POLICY "Users can manage own memory" ON public.learning_memory FOR ALL USING (auth.uid() = user_id);

-- Daily Challenges: Users can manage own daily challenges
CREATE POLICY "Users can manage own daily challenges" ON public.daily_challenges FOR ALL USING (auth.uid() = user_id);
