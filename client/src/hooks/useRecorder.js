import { useState, useRef, useCallback, useEffect } from 'react';

export const useRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recorderError, setRecorderError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  // Clean up media tracks on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Pre-request microphone stream so recording starts instantly (0ms latency)
  const prepareStream = useCallback(async () => {
    if (streamRef.current && streamRef.current.active) {
      return streamRef.current;
    }
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone access is not supported in this browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      return stream;
    } catch (err) {
      console.error('[useRecorder] Failed to obtain microphone stream:', err);
      setRecorderError(err.message || 'Permission denied or microphone unavailable.');
      return null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    setRecorderError(null);
    audioChunksRef.current = [];

    try {
      const stream = await prepareStream();
      if (!stream) return;

      // Select best supported MIME type
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
          mimeType = 'audio/ogg;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else {
          mimeType = '';
        }
      }

      const options = mimeType ? { mimeType } : undefined;
      const recorder = new MediaRecorder(stream, options);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current = recorder;
      // Start recording with 100ms timeslice to ensure continuous chunk emission
      recorder.start(100);
      setIsRecording(true);
    } catch (err) {
      console.error('[useRecorder] Failed to start recording:', err);
      setRecorderError(err.message || 'Could not start recording.');
      setIsRecording(false);
    }
  }, [prepareStream]);

  const stopRecording = useCallback(() => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        setIsRecording(false);
        resolve(null);
        return;
      }

      recorder.onstop = async () => {
        const mimeType = recorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        
        setIsRecording(false);
        mediaRecorderRef.current = null;

        // Convert Blob to ArrayBuffer for Socket.IO transfer
        const buffer = await audioBlob.arrayBuffer();
        resolve({ buffer, mimeType, blob: audioBlob });
      };

      recorder.stop();
    });
  }, []);

  return {
    isRecording,
    prepareStream,
    startRecording,
    stopRecording,
    recorderError
  };
};

export default useRecorder;
