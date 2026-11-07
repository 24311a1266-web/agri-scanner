import { LanguageCode } from '../types';

class SpeechManager {
  private currentAudio: HTMLAudioElement | null = null;
  private isSpeakingWebSpeech = false;

  private langMap: Record<LanguageCode, string> = {
    english: 'en-IN',
    telugu: 'te-IN',
    hindi: 'hi-IN',
    tamil: 'ta-IN',
    kannada: 'kn-IN',
    marathi: 'mr-IN',
  };

  public stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeakingWebSpeech = false;
    }
  }

  public async playGeminiWavAudio(
    audioDataUri: string,
    onEnded?: () => void,
    playbackRate: number = 1.0
  ): Promise<HTMLAudioElement> {
    this.stop();
    const audio = new Audio(audioDataUri);
    audio.playbackRate = playbackRate;
    this.currentAudio = audio;

    audio.onended = () => {
      this.currentAudio = null;
      if (onEnded) onEnded();
    };

    audio.onerror = (e) => {
      console.warn('Audio playback error, falling back to speech synthesis:', e);
      this.currentAudio = null;
      if (onEnded) onEnded();
    };

    await audio.play();
    return audio;
  }

  public speakWithBrowserSynthesis(
    text: string,
    lang: LanguageCode = 'english',
    rate: number = 0.95,
    onEnd?: () => void
  ): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return false;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLangTag = this.langMap[lang] || 'en-IN';
    utterance.lang = targetLangTag;
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Pick best available regional voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(targetLangTag.slice(0, 2)) || v.lang === targetLangTag);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      this.isSpeakingWebSpeech = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeakingWebSpeech = false;
      if (onEnd) onEnd();
    };

    this.isSpeakingWebSpeech = true;
    window.speechSynthesis.speak(utterance);
    return true;
  }

  public isBusy(): boolean {
    return (this.currentAudio !== null && !this.currentAudio.paused) || this.isSpeakingWebSpeech;
  }
}

export const speechManager = new SpeechManager();
