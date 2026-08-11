import { useState, useCallback, useEffect, useRef } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasSupport, setHasSupport] = useState(true);
  const synthRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    } else {
      setHasSupport(false);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const cancel = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(
    (text, language = 'en') => {
      if (!synthRef.current || !text) return;

      // Cancel any ongoing speech before starting new phrase
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Language configuration
      if (language === 'hi' || text.match(/[\u0900-\u097F]/)) {
        utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'en-US';
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Voice selection helper if voices are available
      const voices = synthRef.current.getVoices();
      if (voices && voices.length > 0) {
        const matchingVoice = voices.find((v) => v.lang.startsWith(utterance.lang.slice(0, 2)));
        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (err) => {
        console.warn('[useSpeechSynthesis] Speech utterance error:', err);
        setIsSpeaking(false);
      };

      synthRef.current.speak(utterance);
    },
    []
  );

  return {
    speak,
    cancel,
    isSpeaking,
    hasSupport
  };
};

export default useSpeechSynthesis;
