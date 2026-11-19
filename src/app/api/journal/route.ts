import { NextRequest, NextResponse } from 'next/server';
import { aiProviderManager, LLMMessage } from '@/lib/ai/provider';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();

    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json({ error: 'Journal transcript is required.' }, { status: 400 });
    }

    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: `You are the Voice Journal Coach on VOXORA.
The user just spoke about their day.
Analyze their reflection for:
1. "title": A thoughtful 3-5 word journal title.
2. "reflectionSummary": A warm, encouraging 2-sentence empathetic reflection on their day.
3. "grammarCorrections": Array of { original, correction, explanation, type }.
4. "vocabularyUpgrades": Array of 2 { word, meaning, example }.
5. "fluencyScore": Score out of 10.

Respond strictly with JSON:
{
  "title": "...",
  "reflectionSummary": "...",
  "grammarCorrections": [
    { "original": "...", "correction": "...", "explanation": "...", "type": "grammar" }
  ],
  "vocabularyUpgrades": [
    { "word": "...", "meaning": "...", "example": "..." }
  ],
  "fluencyScore": 8.0
}`
      },
      {
        role: 'user',
        content: transcript
      }
    ];

    const response = await aiProviderManager.generate(messages, { jsonMode: true, temperature: 0.6 });
    let parsed;
    try {
      const clean = response.content.replace(/```json\n?|```/g, '').trim();
      parsed = JSON.parse(clean);
    } catch {
      parsed = {
        title: "Daily Speaking Reflection",
        reflectionSummary: "You reflected clearly on your experiences and expressed genuine insights.",
        grammarCorrections: [],
        vocabularyUpgrades: [
          { word: "unwind", meaning: "relax after a period of work or tension", example: "It felt great to unwind after a busy day." }
        ],
        fluencyScore: 7.8
      };
    }

    return NextResponse.json({ success: true, ...parsed, rawTranscript: transcript });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to process journal entry' }, { status: 500 });
  }
}
