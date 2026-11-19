import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export async function POST(req: NextRequest) {
  try {
    const { targetSentence, userSpoken } = await req.json();

    if (!targetSentence || !userSpoken) {
      return NextResponse.json({ error: 'Both targetSentence and userSpoken are required.' }, { status: 400 });
    }

    const targetWords = normalizeWords(targetSentence);
    const spokenWords = normalizeWords(userSpoken);

    const matchedWords: string[] = [];
    const missingWords: string[] = [];
    const spokenSet = new Map<string, number>();

    for (const w of spokenWords) {
      spokenSet.set(w, (spokenSet.get(w) || 0) + 1);
    }

    for (const tw of targetWords) {
      const count = spokenSet.get(tw) || 0;
      if (count > 0) {
        matchedWords.push(tw);
        spokenSet.set(tw, count - 1);
      } else {
        missingWords.push(tw);
      }
    }

    const extraWords: string[] = [];
    spokenSet.forEach((count, w) => {
      for (let i = 0; i < count; i++) {
        extraWords.push(w);
      }
    });

    const totalTarget = Math.max(1, targetWords.length);
    const accuracyScore = Math.min(
      100,
      Math.max(0, Math.round((matchedWords.length / totalTarget) * 100 - extraWords.length * 5))
    );

    let feedback = 'Outstanding pronunciation match and speech rhythm!';
    if (accuracyScore < 60) {
      feedback = 'A few words were skipped or misrecognized. Try shadow-speaking at a slightly slower pace first.';
    } else if (accuracyScore < 85) {
      feedback = 'Solid rhythm! Focus on linking small prepositions and contractions smoothly.';
    }

    return NextResponse.json({
      success: true,
      accuracyScore,
      matchedWords,
      missingWords,
      extraWords,
      feedback,
      targetSentence,
      userSpoken,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Shadow evaluation error' }, { status: 500 });
  }
}
