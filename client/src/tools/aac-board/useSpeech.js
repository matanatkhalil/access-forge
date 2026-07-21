import { useCallback } from 'react';

export const useSpeech = () => {
  const speak = useCallback((text) => {
    if ('speechSynthesis' in window && text?.trim()) {
      window.speechSynthesis.cancel(); // Interrupt previous speech
      const utterance = new SpeechSynthesisUtterance(text);
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
