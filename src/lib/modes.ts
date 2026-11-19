import { ConversationMode, ConversationModeId } from './types';

export const CONVERSATION_MODES: Record<ConversationModeId, ConversationMode> = {
  friendly: {
    id: 'friendly',
    name: 'Friendly Companion',
    badge: 'Relaxed',
    tagline: 'Casual everyday talks without pressure',
    description: 'Talk like you are hanging out with a friend. Perfect for warming up your speaking muscle on movies, hobbies, food, and daily life.',
    icon: 'MessageSquareHeart',
    primaryPersonality: 'alex',
    color: '#D4F82A',
    topics: [
      'Catching up on your day',
      'The best TV show or movie you watched this year',
      'Weekend plans and unwinding',
      'Crazy travel memories or mishaps',
      'Comfort food and favorite meals'
    ]
  },
  interview: {
    id: 'interview',
    name: 'Job & Behavioral Interview',
    badge: 'Professional',
    tagline: 'Simulate high-stakes interviews with executive feedback',
    description: 'Practice answering behavioral, technical, and leadership questions using the STAR framework. Gain executive presence.',
    icon: 'Briefcase',
    primaryPersonality: 'michael',
    color: '#38BDF8',
    topics: [
      'General Software Engineering interview',
      'Behavioral HR screening & culture fit',
      'University admission & scholarship interview',
      'Leadership & conflict resolution scenarios',
      'Handling failure and project setbacks'
    ]
  },
  teacher: {
    id: 'teacher',
    name: 'Teacher-Student Coaching',
    badge: 'Guided',
    tagline: 'Step-by-step grammatical drills & guided repetition',
    description: 'Learn why mistakes occur and repeat upgraded sentences until they become muscle memory.',
    icon: 'GraduationCap',
    primaryPersonality: 'emma',
    color: '#34D399',
    topics: [
      'Mastering past vs present perfect tense',
      'Prepositions of time and place (in, on, at)',
      'Describing routines with frequency adverbs',
      'Expressing hypothetical situations (Conditionals)',
      'Professional email & spoken etiquette'
    ]
  },
  ielts: {
    id: 'ielts',
    name: 'IELTS Speaking Simulator',
    badge: 'Exam Prep',
    tagline: 'Full Part 1, Part 2 Cue Cards, and Part 3 Discussions',
    description: 'Realistic timed exam conditions with IELTS rubric breakdown. Receive estimated band scores and lexical upgrades.',
    icon: 'Award',
    primaryPersonality: 'sophia',
    color: '#A855F7',
    topics: [
      'IELTS Speaking Full Mock: Technology & Culture',
      'IELTS Part 2 Cue Card: An impactful mentor',
      'IELTS Part 2 Cue Card: A historic building or city',
      'IELTS Part 3: Urbanization and rural preservation',
      'IELTS Part 3: The impact of automation on youth'
    ]
  },
  debate: {
    id: 'debate',
    name: 'The Arena: AI Debate',
    badge: 'Intellectual',
    tagline: 'Defend your viewpoints against an articulate challenger',
    description: 'Sharpen your persuasive logic, rhetorical stamina, and counter-argument phrasing on controversial topics.',
    icon: 'Swords',
    primaryPersonality: 'ryan',
    color: '#F43F5E',
    topics: [
      'Should artificial intelligence face strict international regulation?',
      'Is universal basic income (UBI) economically feasible?',
      'Has remote work killed deep professional mentorship?',
      'Should university degrees still be required for high-skill jobs?',
      'Is nuclear energy essential for solving climate change?'
    ]
  },
  roulette: {
    id: 'roulette',
    name: 'Topic Roulette',
    badge: 'Spontaneous',
    tagline: 'Unexpected, fun, and thought-provoking wildcards',
    description: 'Spin the wheel for creative, philosophical, or situational prompts that train quick verbal formulation.',
    icon: 'Dices',
    primaryPersonality: 'alex',
    color: '#FBBF24',
    topics: [
      'If you could add one hour to every day, how would you spend it?',
      'What obsolete technology do you strangely miss?',
      'Describe your dream treehouse in meticulous detail',
      'If animals could speak, which one would be the rudest?',
      'Would you rather travel 100 years into the past or 500 years into the future?'
    ]
  },
  storytelling: {
    id: 'storytelling',
    name: 'Collaborative Storytelling',
    badge: 'Creative',
    tagline: 'Co-create an unfolding narrative sentence by sentence',
    description: 'The AI starts a dramatic mystery or adventure; you narrate what happens next. Test your descriptive powers.',
    icon: 'BookOpen',
    primaryPersonality: 'daniel',
    color: '#2DD4BF',
    topics: [
      'The neon alleyway and the mysterious locked briefcase',
      'A space expedition landing on an ocean planet with two suns',
      'An abandoned antique shop where clocks run backward',
      'The runaway train through the snowy Alpine pass'
    ]
  },
  roleplay: {
    id: 'roleplay',
    name: 'Real-World Roleplay',
    badge: 'Practical',
    tagline: 'Real situations: restaurants, customs, hotel check-ins, negotiation',
    description: 'Never get flustered abroad again. Practice lifelike transactional and social English in safe roleplay setups.',
    icon: 'Drama',
    primaryPersonality: 'alex',
    color: '#FB923C',
    topics: [
      'Sending back an undercooked steak at a boutique restaurant',
      'Negotiating a salary increase and performance bonus',
      'Checking into a hotel with a missing reservation',
      'Explaining baggage trouble at an international airport',
      'Resolving a misunderstanding with a landlord'
    ]
  },
  pressure: {
    id: 'pressure',
    name: 'The Pressure Room',
    badge: '15-Sec Challenge',
    tagline: 'Spontaneous 15-second rapid fire responses',
    description: 'Conquer overthinking. Get immediate random questions where you have to speak without preparation.',
    icon: 'Timer',
    primaryPersonality: 'michael',
    color: '#EF4444',
    topics: [
      'Defend pineapple on pizza in 15 seconds',
      'Explain what the cloud is to a five-year-old',
      'Describe your greatest skill in two sentences',
      'Convince me to read your favorite book right now',
      'What makes a true friend?'
    ]
  },
  adventure: {
    id: 'adventure',
    name: 'Conversation Adventure',
    badge: 'Interactive Game',
    tagline: 'RPG story where your spoken choices dictate survival',
    description: 'Voice-directed quest: make spoken choices to solve puzzles, negotiate with guards, and navigate thrilling scenarios.',
    icon: 'Compass',
    primaryPersonality: 'daniel',
    color: '#818CF8',
    topics: [
      'Escape from the Cyberpunk Citadel',
      'The Secret of the Sunken Mayan Temple',
      'Survival on the Arctic Outpost'
    ]
  },
  fearless: {
    id: 'fearless',
    name: 'Speak Without Fear',
    badge: 'Zero Judgment',
    tagline: 'No scores, no interruptions, purely supportive',
    description: 'For anxious days. Speak your mind freely; scores and corrections are hidden until you decide to review them.',
    icon: 'ShieldCheck',
    primaryPersonality: 'mia',
    color: '#F472B6',
    topics: [
      'Whatever is on your mind today',
      'Something you feel proud of this week',
      'A small frustration you want to vent about',
      'A peaceful place that relaxes you'
    ]
  }
};
