/**
 * Browser SpeechSynthesis TTS Engine
 */

export interface VoicePlaybackOptions {
  pitch?: number;
  rate?: number;
  volume?: number;
  voiceGender?: 'female' | 'male';
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

class TTSManager {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public speak(text: string, options: VoicePlaybackOptions = {}) {
    if (this.isMuted || !this.synth) {
      if (options.onEnd) options.onEnd();
      return;
    }

    this.stop();

    // Clean text of markdown, asterisks, brackets for clean speech
    const cleanText = text
      .replace(/[*_#`~[\]]/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    if (!cleanText) {
      if (options.onEnd) options.onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.pitch = options.pitch ?? 1.0;
    utterance.rate = options.rate ?? 1.0;
    utterance.volume = options.volume ?? 1.0;

    // Select the best natural English voice available
    if (this.voices.length === 0) {
      this.loadVoices();
    }

    const englishVoices = this.voices.filter(v => v.lang.startsWith('en'));
    let chosenVoice: SpeechSynthesisVoice | undefined;

    // Prioritize natural Google or natural browser voices
    if (options.voiceGender === 'female') {
      chosenVoice = englishVoices.find(v => 
        /female|zira|samantha|karen|victoria|moira/i.test(v.name)
      ) || englishVoices.find(v => v.lang.includes('US') || v.lang.includes('GB'));
    } else {
      chosenVoice = englishVoices.find(v => 
        /male|david|alex|daniel|oliver|george/i.test(v.name)
      ) || englishVoices[0];
    }

    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    utterance.onstart = () => {
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      if (options.onError) options.onError(e);
      if (options.onEnd) options.onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }
}

export const ttsManager = new TTSManager();
