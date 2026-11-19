import { NextRequest, NextResponse } from 'next/server';
import { aiProviderManager, LLMMessage } from '@/lib/ai/provider';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { idea, currentTopic } = await req.json();

    if (!idea || typeof idea !== 'string') {
      return NextResponse.json({ error: 'Idea description is required.' }, { status: 400 });
    }

    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: `You are the Emergency Rescue Speaking Assistant on VOXORA.
The user is stuck trying to express an idea in spoken English.
Topic context: "${currentTopic || 'General conversation'}"
User's thought/fragment: "${idea}"

Generate three distinct ways to say this idea naturally:
1. "simple": Clean, easy-to-pronounce A1-A2 sentence.
2. "natural": Smooth, conversational native expression (B1-B2).
3. "advanced": Polished, expressive C1-C2 formulation.
Provide a quick pronunciation or delivery tip.

Return ONLY a JSON object:
{
  "simple": "...",
  "natural": "...",
  "advanced": "...",
  "deliveryTip": "..."
}`
      },
      {
        role: 'user',
        content: `Help me say: "${idea}"`
      }
    ];

    const response = await aiProviderManager.generate(messages, { jsonMode: true, temperature: 0.6 });
    let parsed;
    try {
      const clean = response.content.replace(/```json\n?|```/g, '').trim();
      parsed = JSON.parse(clean);
    } catch {
      parsed = {
        simple: `I think that ${idea}.`,
        natural: `Basically, what I mean is that ${idea}.`,
        advanced: `To put it another way, ${idea}.`,
        deliveryTip: 'Pause slightly after the subject to keep your rhythm steady.'
      };
    }

    return NextResponse.json({ success: true, ...parsed });
  } catch (err: any) {
    return NextResponse.json({
      simple: 'I would like to say that this is important.',
      natural: 'What I really want to emphasize is how much this matters.',
      advanced: 'The core takeaway I wish to highlight is the sheer significance of this point.',
      deliveryTip: 'Speak with a relaxed breath and emphasize key verbs.'
    });
  }
}
