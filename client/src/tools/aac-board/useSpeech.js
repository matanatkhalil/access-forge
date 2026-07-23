import { useCallback, useEffect } from 'react';

export const useSpeech = () => {
  // Preload voices on mount to fix async voice loading in Chromium-based browsers
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback((text) => {
    if ('speechSynthesis' in window && text?.trim()) {
      window.speechSynthesis.cancel(); // Interrupt previous speech
      const utterance = new SpeechSynthesisUtterance(text);

      // Explicitly set language
      utterance.lang = 'en-US';

      // Query available voices and pick an English speaker
      const voices = window.speechSynthesis.getVoices();
      const englishVoice =
        voices.find((v) => v.lang === 'en-US') || voices.find((v) => v.lang.startsWith('en'));

      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, stop };
};
