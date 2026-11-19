/**
 * Speech Recognition abstraction supporting Web Speech API & webkitSpeechRecognition
 */

export interface SpeechRecognitionCallbacks {
  onInterimResult?: (transcript: string) => void;
  onFinalResult?: (transcript: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (errorMessage: string) => void;
}

export class SpeechRecognitionManager {
  private recognition: any = null;
  private isListening: boolean = false;
  private currentFinalTranscript: string = '';
  private interimTranscript: string = '';
  private callbacks: SpeechRecognitionCallbacks = {};

  constructor(callbacks: SpeechRecognitionCallbacks = {}) {
    this.callbacks = callbacks;
    this.init();
  }

  public setCallbacks(callbacks: SpeechRecognitionCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  private init() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        if (this.callbacks.onStart) this.callbacks.onStart();
      };

      this.recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          const transcript = item[0].transcript;
          if (item.isFinal) {
            this.currentFinalTranscript += (this.currentFinalTranscript ? ' ' : '') + transcript.trim();
            if (this.callbacks.onFinalResult) {
              this.callbacks.onFinalResult(this.currentFinalTranscript);
            }
          } else {
            interim += transcript;
          }
        }
        this.interimTranscript = interim;
        if (this.callbacks.onInterimResult) {
          this.callbacks.onInterimResult(interim);
        }
      };

      this.recognition.onerror = (event: any) => {
        let msg = 'Speech recognition error.';
        if (event.error === 'not-allowed') {
          msg = 'Microphone permission was denied. Please allow microphone access in your browser.';
        } else if (event.error === 'no-speech') {
          msg = 'No speech was detected. Please try speaking clearly into your mic.';
        } else if (event.error === 'network') {
          msg = 'Speech recognition network error occurred.';
        }
        if (this.callbacks.onError) {
          this.callbacks.onError(msg);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.callbacks.onEnd) {
          this.callbacks.onEnd();
        }
      };
    } catch (e) {
      console.warn('SpeechRecognition initialization error:', e);
    }
  }

  public start() {
    if (!this.recognition) {
      this.init();
    }
    if (!this.recognition) {
      if (this.callbacks.onError) {
        this.callbacks.onError('Web Speech Recognition is not supported in this browser. Please use Google Chrome, Edge, or text mode.');
      }
      return;
    }

    this.currentFinalTranscript = '';
    this.interimTranscript = '';

    try {
      this.recognition.start();
    } catch (e) {
      // If already started, do nothing
    }
  }

  public stop(): string {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    this.isListening = false;
    const complete = (this.currentFinalTranscript + ' ' + this.interimTranscript).trim();
    return complete;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  public getCurrentTranscript(): string {
    return (this.currentFinalTranscript + ' ' + this.interimTranscript).trim();
  }

  public reset() {
    this.currentFinalTranscript = '';
    this.interimTranscript = '';
  }
}
