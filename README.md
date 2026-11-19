# VOXORA — Your AI Speaking Companion

> *"Stop translating in your head. Start speaking naturally."*

**VOXORA** is a complete, production-quality, AI-powered English-speaking practice platform designed to help people who understand English but struggle to speak fluently, confidently, or naturally.

It combines the warmth of a friendly companion, the pedagogy of an English teacher, the rigor of an IELTS examiner, and the precision of an executive interview coach into an addictive, positive educational experience.

---

## 🌟 Key Features

### 1. Real-Time Spoken Conversation Loop
- **Voice Recognition**: Browser Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) with interim live transcription and text input fallback.
- **Natural Speech Synthesis**: Browser `SpeechSynthesis` TTS with personality-specific pitch, cadence, and speed controls (0.8x, 1.0x, 1.2x).
- **Acoustic Waveforms & 3D Sphere**: Animated breathing audio orb inspired by modern voice assistant aesthetics, visually transitioning through *Idle*, *Listening*, *Processing*, and *Speaking* states.

### 2. Multi-Tier Pedagogical Speaking Evaluation
- **Honest Scoring Categories**:
  - Grammar (/10)
  - Vocabulary (/10)
  - Fluency (/10)
  - Sentence Structure (/10)
  - Relevance (/10)
  - Overall Speaking Score (/10)
  - *Acoustic Transparency*: Explicit disclaimer indicating transcript-based syntax vs. raw phoneme analysis.
- **3-Way Native Expression Generator**:
  - Level 1: Grammatically Correct
  - Level 2: Natural Conversational Native
  - Level 3: Advanced & Expressive (C1-C2)
- **Filler Word Detection**: Real-time tracking of *um*, *uh*, *like*, *you know*, *basically*, *actually*, and pacing recommendations.
- **Actionable Next Target**: One specific, bite-sized target for the next sentence.

### 3. Immediate Skip & Action Controls
- **Continue Conversation**: Immediate next turn.
- **Skip / Next Question**: Instant topic jump or roulette wildcard without waiting.
- **Try Again**: Re-speak the current sentence.
- **Show Better Answer**: Exemplar native response model with audio playback.
- **Practice My Mistake**: 10-second repetition drill to build muscle memory.
- **Explain My Mistake**: Jargon-free simple explanation.
- **Emergency Rescue ("Help Me Say It")**: Stuck mid-sentence? Type or speak fragmented words to receive Simple, Natural, and Advanced sentence formulations immediately.

### 4. 7 Authentic AI Personalities
1. **Alex**: Casual, funny, empathetic friend (Daily life, food, movies, travel).
2. **Emma**: Patient English teacher (Grammar drills, repetition exercises).
3. **Michael**: Executive interview coach (STAR method, behavioral & tech interviews).
4. **Sophia**: Certified IELTS examiner (Parts 1, 2, and 3 with cue card timers).
5. **Ryan**: Sharp debate partner (Respectful intellectual challenge).
6. **Mia**: Gentle beginner guide (Zero anxiety, simplified vocabulary).
7. **Daniel**: Nuance & native idiom master (Elevated, evocative expressions).

### 5. 11 Conversation Scenarios & Arenas
- **Friendly Companion**
- **Job & Behavioral Interview**
- **Teacher-Student Coaching**
- **IELTS Speaking Simulator**
- **The Arena: AI Debate**
- **Topic Roulette** (with dynamic spin wheel)
- **Collaborative Storytelling**
- **Real-World Roleplay** (restaurant, airport, salary negotiation, landlord)
- **The Pressure Room** (15-second spontaneous speaking challenge)
- **Conversation Adventure** (voice-directed branching RPG)
- **Speak Without Fear** (hidden mid-session scores for anxious speakers)

### 6. Unique Pedagogical Innovations
- **Shadow Mode Studio**: Listen to native cadence and echo it. Word-level diff and accuracy percentage.
- **Voice Journal**: 2-minute verbal reflections about your day with transcript, corrections, and empathetic AI reflection.
- **Vocabulary Vault**: One-click word collection with definitions, example sentences, audio pronunciation, and mastery status (*New*, *Learning*, *Mastered*).
- **Cross-Session Memory**: AI automatically tracks recurring mistakes (e.g. past tense verbs or preposition omissions) to create practice opportunities in future sessions.
- **Future Me Comparison**: Compare your baseline Day 1 recording with Day 30+ to hear fluency gains.

### 7. Gamification & Analytics
- Daily speaking streaks (with flame badges)
- XP progression & levels (*Novice* to *Native Virtuoso*)
- Daily & weekly challenges
- Full analytics dashboard with weekly score progression charts, weak area diagnosis, and speaking minute logs.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide React, Canvas Confetti.
- **AI Abstraction Layer**: Pluggable provider architecture supporting:
  - **Groq API** (`llama-3.3-70b-versatile` / `llama-3.1-8b-instant`) — ultra-low latency.
  - **Google Gemini API** (`gemini-1.5-flash`).
  - **OpenRouter API** (free models).
  - **Autonomous Pedagogical Fallback Engine** — zero-config offline/demo fallback guaranteeing 100% functionality even during quota limits or API outages!
- **Voice APIs**: Browser Web Speech API (`SpeechRecognition`) & `SpeechSynthesis`.
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) + Local-First offline sync mode.

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/voxora.git
cd voxora
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your desired AI provider and Supabase keys:
```env
# AI Providers (Groq recommended for fastest response)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# Or Google Gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# Active provider: "groq" | "gemini" | "openrouter" | "auto"
AI_PROVIDER=auto

# Optional: Supabase (Local mode active if left empty)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

*Note: VOXORA includes a built-in pedagogical fallback engine, allowing the app to run immediately even before configuring API keys!*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in Google Chrome or Edge for full Web Speech API microphone support.

---

## 🗄️ Database Setup (Supabase)

If using Supabase:
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in the Supabase Dashboard.
3. Open `src/lib/supabase/schema.sql` in this repo, copy its contents, and run it.
4. It will create all tables (`profiles`, `conversations`, `conversation_messages`, `speaking_evaluations`, `user_progress`, `vocabulary`, `user_achievements`, `learning_memory`, `daily_challenges`), indexes, and Row Level Security policies.
5. In Supabase **Authentication -> Providers**, enable **Email** and optionally **Google OAuth**.
6. Paste `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` into your `.env.local`.

---

## 🚢 Deployment

### Deploying to Vercel
1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import the VOXORA repository.
4. In **Environment Variables**, add:
   - `GROQ_API_KEY` (or `GEMINI_API_KEY`)
   - `NEXT_PUBLIC_SUPABASE_URL` (optional)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional)
5. Click **Deploy**. Vercel will automatically build and deploy the Next.js App Router application.

### Deploying to Render
1. Create a new **Web Service** on Render.
2. Select your GitHub repository.
3. Set **Build Command**: `npm install && npm run build`
4. Set **Start Command**: `npm run start`
5. Add your environment variables in the Render dashboard.

---

## 🛡️ Security Best Practices
- AI API keys (`GROQ_API_KEY`, `GEMINI_API_KEY`) are kept strictly server-side and never prefixed with `NEXT_PUBLIC_`.
- All database queries enforce Supabase Row-Level Security (`auth.uid() = user_id`).
- Input validation sanitizes transcript strings and guards against prompt injection.

---

## 📄 License
MIT License. Built with passion for English learners worldwide.
