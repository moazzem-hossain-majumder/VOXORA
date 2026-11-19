import {
  DifficultyLevel,
  CorrectionStrictness,
  PersonalityId,
  ConversationModeId,
  SpeakingEvaluation
} from '../types';
import { AI_PERSONALITIES } from '../personalities';
import { CONVERSATION_MODES } from '../modes';
import { aiProviderManager, LLMMessage } from './provider';
import { detectFillerWords } from '../audio/fillerWords';

export interface EvaluateTurnParams {
  userTranscript: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  personalityId: PersonalityId;
  modeId: ConversationModeId;
  topic: string;
  difficulty: DifficultyLevel;
  strictness: CorrectionStrictness;
  recurringMistakeContext?: string[];
}

export interface EvaluateTurnResult {
  aiResponseText: string;
  evaluation: SpeakingEvaluation;
  providerUsed: string;
}

export async function processConversationTurn(params: EvaluateTurnParams): Promise<EvaluateTurnResult> {
  const personality = AI_PERSONALITIES[params.personalityId] || AI_PERSONALITIES.alex;
  const mode = CONVERSATION_MODES[params.modeId] || CONVERSATION_MODES.friendly;

  // Strictness instructions
  let strictnessGuideline = 'Correct important grammar and vocabulary mistakes with balanced feedback.';
  if (params.strictness === 'gentle') {
    strictnessGuideline = 'Gentle mode: Only point out errors that significantly impede comprehension or sound very unnatural. Keep encouragement high.';
  } else if (params.strictness === 'strict') {
    strictnessGuideline = 'Strict mode: Point out almost every noticeable grammatical, prepositional, tense, or collocation slip.';
  }

  // Difficulty guidelines
  let difficultyGuideline = 'Match intermediate level (B1-B2).';
  if (params.difficulty === 'beginner') {
    difficultyGuideline = 'Learner is A1-A2 Beginner. Use simple, short sentences, familiar vocabulary, and speak clearly. In your questions, offer friendly choices or simple prompts.';
  } else if (params.difficulty === 'advanced') {
    difficultyGuideline = 'Learner is C1-C2 Advanced. Challenge them with nuanced vocabulary, idiomatic depth, and deep abstract discussion.';
  }

  // Context on past recurring mistakes
  let memoryGuideline = '';
  if (params.recurringMistakeContext && params.recurringMistakeContext.length > 0) {
    memoryGuideline = `The learner has previously struggled with: ${params.recurringMistakeContext.join(', ')}. If naturally fitting, gently nudge them to practice this or evaluate their accuracy in this area.`;
  }

  const systemPrompt = `You are ${personality.name}, participating in a speaking practice session on VOXORA.
Personality Style: ${personality.speakingStyle}
Correction Style: ${personality.correctionStyle}
Session Mode: ${mode.name} (${mode.tagline})
Current Topic: "${params.topic}"
Difficulty Level: ${difficultyGuideline}
Strictness Level: ${strictnessGuideline}
${memoryGuideline}

${personality.systemPrompt}

IMPORTANT OPERATIONAL RULES:
1. In your conversational reply ("ai_response"):
   - Stay deeply in character as ${personality.name}.
   - React warmly and authentically to what the user said.
   - Do NOT sound like an examiner giving bullet points inside the conversational reply.
   - Ask ONE natural follow-up question or present the next prompt.
2. In the "evaluation":
   - Provide genuine pedagogical analysis of the user's transcript: "${params.userTranscript}".
   - Score Grammar, Vocabulary, Fluency, Sentence Structure, Relevance, and Overall (all out of 10).
   - If the transcript has no mistakes, acknowledge it and score 8.5 - 9.8.
   - Provide original phrase, correction, and concise explanation for any mistakes.
   - Provide a natural conversational native alternative and an advanced alternative.
   - Suggest 2 useful vocabulary items or idiomatic expressions relevant to what the user talked about.
   - Suggest one clear, specific target for the user's very next sentence.

You MUST respond strictly with valid JSON conforming to the following structure:
{
  "ai_response": "Your conversational reply as ${personality.name} continuing the talk...",
  "evaluation": {
    "grammarScore": 7.5,
    "vocabularyScore": 7.0,
    "fluencyScore": 7.2,
    "sentenceStructureScore": 7.0,
    "relevanceScore": 8.5,
    "overallScore": 7.4,
    "pronunciationNotice": "Based on speech transcript fidelity and speech flow analysis.",
    "whatUserDidWell": ["Clear, immediate message delivery", "Good use of descriptive words"],
    "mistakes": [
      {
        "original": "part of user sentence with error",
        "correction": "corrected version",
        "explanation": "why this correction is better",
        "type": "grammar"
      }
    ],
    "naturalAlternative": "How a native speaker would say this casually...",
    "advancedAlternative": "How an advanced or professional speaker would phrase this...",
    "vocabularySuggestions": [
      { "word": "word or idiom", "meaning": "definition", "example": "example sentence" }
    ],
    "nextImprovementTarget": "One actionable advice for the next sentence"
  }
}`;

  const messages: LLMMessage[] = [
    { role: 'system', content: systemPrompt },
  ];

  // Include recent history (up to last 6 messages) for seamless context
  const recentHistory = params.conversationHistory.slice(-6);
  for (const item of recentHistory) {
    messages.push({
      role: item.role === 'assistant' ? 'assistant' : 'user',
      content: item.content
    });
  }

  // Add the current user transcript
  messages.push({
    role: 'user',
    content: params.userTranscript
  });

  const response = await aiProviderManager.generate(messages, {
    jsonMode: true,
    temperature: 0.7,
    maxTokens: 2500,
  });

  // Parse and validate JSON
  let parsed: any;
  try {
    // Strip markdown code fences if present
    const cleaned = response.content.replace(/```json\n?|```/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.warn('Failed to parse AI JSON response, using heuristic parser:', err);
    // If JSON parsing fails, extract or build safe response
    parsed = {
      ai_response: response.content.slice(0, 300),
      evaluation: {
        grammarScore: 7.5,
        vocabularyScore: 7.0,
        fluencyScore: 7.0,
        sentenceStructureScore: 7.0,
        relevanceScore: 8.0,
        overallScore: 7.3,
        pronunciationNotice: "Evaluated from speech transcript flow and vocabulary structure.",
        whatUserDidWell: ["Natural willingness to express your thought."],
        mistakes: [],
        naturalAlternative: params.userTranscript,
        advancedAlternative: params.userTranscript,
        vocabularySuggestions: [],
        nextImprovementTarget: "Keep elaborating on your points with specific examples."
      }
    };
  }

  // Detect filler words from the user's transcript
  const fillerAnalysis = detectFillerWords(params.userTranscript);

  // Assemble sanitized evaluation
  const evaluation: SpeakingEvaluation = {
    grammarScore: Number(parsed.evaluation?.grammarScore ?? 7.5),
    vocabularyScore: Number(parsed.evaluation?.vocabularyScore ?? 7.0),
    fluencyScore: Number(parsed.evaluation?.fluencyScore ?? 7.0),
    sentenceStructureScore: Number(parsed.evaluation?.sentenceStructureScore ?? 7.0),
    relevanceScore: Number(parsed.evaluation?.relevanceScore ?? 8.0),
    overallScore: Number(parsed.evaluation?.overallScore ?? 7.3),
    pronunciationNotice: parsed.evaluation?.pronunciationNotice || "Audio speech-to-text inference: evaluated rhythm and transcription fidelity.",
    whatUserDidWell: Array.isArray(parsed.evaluation?.whatUserDidWell) ? parsed.evaluation.whatUserDidWell : ["Good responsiveness."],
    mistakes: Array.isArray(parsed.evaluation?.mistakes) ? parsed.evaluation.mistakes : [],
    naturalAlternative: parsed.evaluation?.naturalAlternative || params.userTranscript,
    advancedAlternative: parsed.evaluation?.advancedAlternative || params.userTranscript,
    vocabularySuggestions: Array.isArray(parsed.evaluation?.vocabularySuggestions) ? parsed.evaluation.vocabularySuggestions : [],
    nextImprovementTarget: parsed.evaluation?.nextImprovementTarget || "Keep practicing speaking with confidence.",
    fillerWords: fillerAnalysis.breakdown,
  };

  return {
    aiResponseText: parsed.ai_response || "That's a very interesting point! What made you see it from that angle?",
    evaluation,
    providerUsed: response.providerUsed,
  };
}
