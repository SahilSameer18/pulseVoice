import { useState, useCallback, useEffect, useRef } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasSupport, setHasSupport] = useState(true);
  const [voices, setVoices] = useState([]);
  const synthRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      updateVoices();
      // Voices are loaded asynchronously in Chrome & Edge
      window.speechSynthesis.onvoiceschanged = updateVoices;
    } else {
      setHasSupport(false);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Chrome bug workaround: 15-second SpeechSynthesis freeze keep-alive interval
  useEffect(() => {
    const keepAlive = setInterval(() => {
      if (synthRef.current?.speaking && !synthRef.current?.paused) {
        synthRef.current.pause();
        synthRef.current.resume();
      }
    }, 10000);
    return () => clearInterval(keepAlive);
  }, []);

  const cancel = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Safe voice selection helper: dynamically picks best Hindi voice for Hindi text, best English voice for English text
  const getBestVoice = useCallback(
    (language, isHindiText) => {
      const currentVoices = synthRef.current ? synthRef.current.getVoices() : voices;
      if (!currentVoices || currentVoices.length === 0) return null;

      // Detect if text is Devanagari Hindi or if language is explicitly Hindi
      if (isHindiText || (language === 'hi' && isHindiText)) {
        // 1. Preferred Native Neural Hindi Voices
        const preferredHindi = ['Microsoft Swara', 'Microsoft Madhur', 'Google हिंदी', 'Swara', 'Madhur', 'Kalpana', 'Hemant'];
        for (const name of preferredHindi) {
          const match = currentVoices.find((v) => v.name.includes(name));
          if (match) return match;
        }

        // 2. Any voice starting with 'hi'
        const hiVoice = currentVoices.find((v) => v.lang.startsWith('hi'));
        if (hiVoice) return hiVoice;

        // 3. Indian English / Regional Fallback
        const inVoice = currentVoices.find((v) => v.lang.includes('IN') || v.name.includes('India') || v.name.includes('Heera') || v.name.includes('Ravi') || v.name.includes('Neerja'));
        if (inVoice) return inVoice;

        return null;
      } else {
        // Preferred English Voices (for English text or when switching to English mid-call)
        const preferredEnglish = ['Microsoft Jenny', 'Microsoft Guy', 'Google US English', 'Natural'];
        for (const name of preferredEnglish) {
          const match = currentVoices.find((v) => v.name.includes(name));
          if (match) return match;
        }
        return currentVoices.find((v) => v.lang.startsWith('en')) || null;
      }
    },
    [voices]
  );

  const speak = useCallback(
    (text, language = 'en', onEnd = null) => {
      if (!synthRef.current || !text) {
        if (onEnd) onEnd();
        return;
      }

      // Cancel any ongoing speech before starting new phrase
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const isHindiText = !!text.match(/[\u0900-\u097F]/);

      // Dynamically configure utterance language based on text content
      if (isHindiText) {
        utterance.lang = 'hi-IN';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
      } else {
        utterance.lang = 'en-US';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
      }

      // Select best voice dynamically for this specific turn
      const bestVoice = getBestVoice(language, isHindiText);
      if (bestVoice) {
        utterance.voice = bestVoice;
        utterance.lang = bestVoice.lang;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
      };

      utterance.onerror = (err) => {
        if (err.error !== 'interrupted' && err.error !== 'canceled') {
          console.warn('[useSpeechSynthesis] Speech utterance error:', err);
        }
        setIsSpeaking(false);
        if (onEnd) onEnd();
      };

      // Chrome bug workaround: speak() right after cancel() in the same tick can silently fail
      setTimeout(() => {
        if (synthRef.current) {
          synthRef.current.speak(utterance);
        }
      }, 50);
    },
    [getBestVoice]
  );

  return {
    speak,
    cancel,
    isSpeaking,
    hasSupport
  };
};

export default useSpeechSynthesis;
