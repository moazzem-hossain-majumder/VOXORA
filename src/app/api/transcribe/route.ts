import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudio } from '@/lib/ai/asr';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('audio') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Audio file is required.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const transcript = await transcribeAudio(buffer, file.name || 'speech.webm');

    return NextResponse.json({
      success: true,
      transcript,
      asrProvider: 'groq-whisper-large-v3-turbo',
    });
  } catch (error: any) {
    console.error('Whisper transcription error:', error);
    return NextResponse.json(
      { error: 'Transcription failed', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
