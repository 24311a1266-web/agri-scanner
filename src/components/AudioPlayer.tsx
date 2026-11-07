import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Languages, Radio } from 'lucide-react';
import { speechManager } from '../services/speech';
import { requestTtsAudio } from '../services/api';
import { AudioScript, LanguageCode } from '../types';

interface AudioPlayerProps {
  audioScript: AudioScript;
  language: LanguageCode;
  productName: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioScript,
  language,
  productName,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(0.95);
  const [showEnglishText, setShowEnglishText] = useState(false);
  const [cachedAudioUri, setCachedAudioUri] = useState<string | null>(null);

  useEffect(() => {
    // Reset when audioScript or language changes
    speechManager.stop();
    setIsPlaying(false);
    setCachedAudioUri(null);
  }, [audioScript.targetLanguageText, language]);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      speechManager.stop();
      setIsPlaying(false);
      return;
    }

    const textToSpeak = showEnglishText
      ? audioScript.englishTranslationText
      : audioScript.targetLanguageText;

    setIsLoadingAudio(true);

    try {
      if (cachedAudioUri && !showEnglishText) {
        setIsPlaying(true);
        setIsLoadingAudio(false);
        await speechManager.playGeminiWavAudio(cachedAudioUri, () => setIsPlaying(false), playbackRate);
        return;
      }

      // Try server Gemini TTS first
      const ttsResult = await requestTtsAudio(textToSpeak, showEnglishText ? 'english' : language);

      if (ttsResult.audioData && !showEnglishText) {
        setCachedAudioUri(ttsResult.audioData);
        setIsPlaying(true);
        setIsLoadingAudio(false);
        await speechManager.playGeminiWavAudio(ttsResult.audioData, () => setIsPlaying(false), playbackRate);
      } else {
        // Instant Browser Web Speech API fallback
        setIsLoadingAudio(false);
        setIsPlaying(true);
        speechManager.speakWithBrowserSynthesis(
          textToSpeak,
          showEnglishText ? 'english' : language,
          playbackRate,
          () => setIsPlaying(false)
        );
      }
    } catch (err) {
      console.warn('Speech playback error:', err);
      // Fallback to browser synthesis
      setIsLoadingAudio(false);
      setIsPlaying(true);
      speechManager.speakWithBrowserSynthesis(
        textToSpeak,
        showEnglishText ? 'english' : language,
        playbackRate,
        () => setIsPlaying(false)
      );
    }
  };

  const handleRestart = () => {
    speechManager.stop();
    setIsPlaying(false);
    setTimeout(() => {
      handleTogglePlay();
    }, 150);
  };

  const handleRateChange = (newRate: number) => {
    setPlaybackRate(newRate);
    if (isPlaying) {
      speechManager.stop();
      setIsPlaying(false);
      setTimeout(() => {
        handleTogglePlay();
      }, 100);
    }
  };

  return (
    <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-700">
      
      {/* Top Bar with Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-700/60">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-amber-300">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-emerald-300 tracking-wider uppercase flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              Hear Your Farm Product Label
            </span>
            <h3 className="text-base font-bold text-white">
              Spoken Audio Explanation for Farmers
            </h3>
          </div>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1.5 bg-emerald-950/60 p-1 rounded-xl border border-emerald-700 text-xs font-semibold">
          <span className="text-emerald-300 text-[11px] px-2 hidden sm:inline">Speed:</span>
          {[0.8, 1.0, 1.2].map((rate) => (
            <button
              key={rate}
              onClick={() => handleRateChange(rate)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                playbackRate === rate
                  ? 'bg-emerald-500 text-emerald-950 font-bold shadow-sm'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              {rate === 0.8 ? 'Slow' : rate === 1.0 ? '1.0x' : 'Fast'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Playback Bar */}
      <div className="my-4 flex flex-col sm:flex-row items-center gap-4 bg-emerald-950/40 p-4 rounded-xl border border-emerald-700/40">
        
        {/* Play/Pause Button */}
        <button
          onClick={handleTogglePlay}
          disabled={isLoadingAudio}
          className="w-14 h-14 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-emerald-950 flex items-center justify-center font-black shadow-lg shadow-amber-400/20 transition-all shrink-0 cursor-pointer"
          title={isPlaying ? 'Pause Audio' : 'Play Audio Explanation'}
        >
          {isLoadingAudio ? (
            <div className="w-6 h-6 border-3 border-emerald-950 border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-7 h-7 fill-emerald-950" />
          ) : (
            <Play className="w-7 h-7 fill-emerald-950 ml-1" />
          )}
        </button>

        {/* Status & Equalizer Animation */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-sm font-bold text-white">
              {isLoadingAudio
                ? 'Preparing voice audio...'
                : isPlaying
                ? 'Playing voice narration...'
                : 'Click Play to hear instructions aloud'}
            </span>
            {isPlaying && (
              <span className="flex items-center gap-0.5 h-4 ml-1">
                <span className="w-1 bg-amber-400 h-2 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1 bg-amber-400 h-4 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1 bg-amber-400 h-3 rounded-full animate-bounce [animation-delay:300ms]" />
                <span className="w-1 bg-amber-400 h-5 rounded-full animate-bounce [animation-delay:75ms]" />
              </span>
            )}
          </div>
          <p className="text-xs text-emerald-200 mt-0.5">
            Designed for farmers to listen easily without having to read small label print.
          </p>
        </div>

        {/* Restart & Script Language Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRestart}
            className="p-2.5 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Replay from beginning"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden md:inline">Replay</span>
          </button>

          <button
            onClick={() => setShowEnglishText(!showEnglishText)}
            className="px-3 py-2.5 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Toggle between Regional Script and English translation"
          >
            <Languages className="w-4 h-4 text-amber-300" />
            <span>{showEnglishText ? 'Show Regional' : 'Show English'}</span>
          </button>
        </div>
      </div>

      {/* Spoken Text Display Box */}
      <div className="bg-emerald-950/60 rounded-xl p-4 border border-emerald-700/50">
        <div className="flex items-center justify-between text-xs text-emerald-300 mb-1.5 font-semibold">
          <span>{showEnglishText ? 'English Transcript' : `Regional Narration (${language.toUpperCase()})`}</span>
          <span className="text-[11px] text-emerald-400">Audio Script</span>
        </div>
        <p className="text-sm sm:text-base leading-relaxed text-emerald-50 font-medium">
          {showEnglishText
            ? audioScript.englishTranslationText
            : audioScript.targetLanguageText}
        </p>
      </div>

    </div>
  );
};
