import { NextRequest, NextResponse } from 'next/server';
import { processConversationTurn } from '@/lib/ai/evaluator';
import { DifficultyLevel, CorrectionStrictness, PersonalityId, ConversationModeId } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userTranscript,
      conversationHistory = [],
      personalityId = 'alex',
      modeId = 'friendly',
      topic = 'Casual Daily Conversation',
      difficulty = 'intermediate',
      strictness = 'balanced',
      recurringMistakeContext = []
    } = body;

    if (!userTranscript || typeof userTranscript !== 'string' || userTranscript.trim().length === 0) {
      return NextResponse.json(
        { error: 'User speech transcript is required.' },
        { status: 400 }
      );
    }

    const result = await processConversationTurn({
      userTranscript: userTranscript.trim(),
      conversationHistory,
      personalityId: personalityId as PersonalityId,
      modeId: modeId as ConversationModeId,
      topic,
      difficulty: difficulty as DifficultyLevel,
      strictness: strictness as CorrectionStrictness,
      recurringMistakeContext,
    });

    return NextResponse.json({
      success: true,
      aiResponseText: result.aiResponseText,
      evaluation: result.evaluation,
      providerUsed: result.providerUsed,
    });
  } catch (error: any) {
    console.error('API /api/conversation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process conversation turn.',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
