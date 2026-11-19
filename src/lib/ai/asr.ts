/**
 * Whisper Speech-to-Text (ASR) service powered by Groq
 * Models: whisper-large-v3-turbo, whisper-large-v3
 */

export async function transcribeAudio(audioBuffer: Buffer, filename = 'speech.webm'): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured for Whisper transcription.');
  }

  const asrModels = (process.env.ASR_MODELS || 'whisper-large-v3-turbo,whisper-large-v3')
    .split(',')
    .map(m => m.trim());

  let lastError: any = null;

  for (const model of asrModels) {
    try {
      const formData = new FormData();
      const blob = new Blob([audioBuffer], { type: 'audio/webm' });
      formData.append('file', blob, filename);
      formData.append('model', model);
      formData.append('language', 'en');
      formData.append('response_format', 'json');

      const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Groq Whisper [${model}] error (${res.status}): ${errorText}`);
      }

      const data = await res.json();
      return data.text || '';
    } catch (err) {
      lastError = err;
      console.warn(`ASR model [${model}] failed, trying fallback:`, err);
    }
  }

  throw lastError || new Error('All ASR models failed');
}
