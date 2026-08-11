import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCall, CALL_STATUS } from '../context/CallContext';
import { useSocket } from '../hooks/useSocket';
import { useRecorder } from '../hooks/useRecorder';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import AudioVisualizer from '../components/call/AudioVisualizer';
import TranscriptView from '../components/call/TranscriptView';
import CallControls from '../components/call/CallControls';
import ErrorAlert from '../components/common/ErrorAlert';

export const CallPage = () => {
  const navigate = useNavigate();
  const {
    callStatus,
    setCallStatus,
    selectedLanguage,
    messages,
    addMessage,
    setReport,
    error,
    setError,
    clearError
  } = useCall();

  const { emit, on, isConnected } = useSocket();
  const { isRecording, startRecording, stopRecording, recorderError } = useRecorder();
  const { speak, cancel, isSpeaking } = useSpeechSynthesis();

  // Propagate recorder errors to error state
  useEffect(() => {
    if (recorderError) {
      setError(recorderError);
    }
  }, [recorderError, setError]);

  // Bind Socket Event Listeners
  useEffect(() => {
    // 1. call:greeting -> initial AI greeting
    const unbindGreeting = on('call:greeting', (payload) => {
      if (payload?.success && payload?.data?.text) {
        addMessage('ai', payload.data.text);
        setCallStatus(CALL_STATUS.SPEAKING);
        speak(payload.data.text, selectedLanguage);
      }
    });

    // 2. turn:response -> AI response turn
    const unbindResponse = on('turn:response', (payload) => {
      if (payload?.success && payload?.data) {
        const { userText, text } = payload.data;
        if (userText) addMessage('user', userText);
        if (text) {
          addMessage('ai', text);
          setCallStatus(CALL_STATUS.SPEAKING);
          speak(text, selectedLanguage);
        }
      }
    });

    // 3. turn:error -> failure handling (silence / STT / API error)
    const unbindError = on('turn:error', (payload) => {
      console.warn('[CallPage] Received turn:error:', payload);
      setError(payload?.message || "Didn't catch that — try again.");
      setCallStatus(CALL_STATUS.LISTENING);
    });

    // 4. call:report -> report generated, navigate to /report page
    const unbindReport = on('call:report', (payload) => {
      if (payload?.success && payload?.data?.report) {
        cancel();
        setReport(payload.data.report);
        setCallStatus(CALL_STATUS.ENDED);
        navigate('/report');
      }
    });

    return () => {
      unbindGreeting();
      unbindResponse();
      unbindError();
      unbindReport();
    };
  }, [on, addMessage, setCallStatus, setReport, setError, speak, cancel, navigate, selectedLanguage]);

  // Auto-start call on mount if IDLE
  useEffect(() => {
    if (callStatus === CALL_STATUS.IDLE) {
      setCallStatus(CALL_STATUS.CONNECTING);
      emit('call:start', { language: selectedLanguage });
    }
  }, [callStatus, setCallStatus, emit, selectedLanguage]);

  // Handle Start Recording (Mouse down / Touch start)
  const handleStartRecording = useCallback(async () => {
    clearError();
    cancel(); // Stop TTS if currently speaking
    setCallStatus(CALL_STATUS.LISTENING);
    await startRecording();
  }, [clearError, cancel, setCallStatus, startRecording]);

  // Handle Stop Recording (Mouse up / Touch end)
  const handleStopRecording = useCallback(async () => {
    const result = await stopRecording();
    if (result && result.buffer) {
      setCallStatus(CALL_STATUS.THINKING);
      // Emit audio buffer + MIME type over socket
      emit('turn:audio', {
        buffer: result.buffer,
        mimeType: result.mimeType
      });
    } else {
      setCallStatus(CALL_STATUS.LISTENING);
    }
  }, [stopRecording, setCallStatus, emit]);

  // Handle Start Call manually
  const handleStartCall = useCallback(() => {
    clearError();
    setCallStatus(CALL_STATUS.CONNECTING);
    emit('call:start', { language: selectedLanguage });
  }, [clearError, setCallStatus, emit, selectedLanguage]);

  // Handle End Call manually
  const handleEndCall = useCallback(() => {
    cancel();
    setCallStatus(CALL_STATUS.THINKING);
    emit('call:end');
  }, [cancel, setCallStatus, emit]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-[#12191C]">
      {/* Top Banner / Error Display */}
      <ErrorAlert error={error} onDismiss={clearError} />

      {/* Signature Audio Visualizer / Pulse Orb */}
      <AudioVisualizer
        callStatus={callStatus}
        isRecording={isRecording}
        isSpeaking={isSpeaking}
      />

      {/* Spoken Turn Caption Display */}
      <TranscriptView messages={messages} />

      {/* Action Control Panel */}
      <div className="pt-6">
        <CallControls
          callStatus={callStatus}
          onStartCall={handleStartCall}
          onEndCall={handleEndCall}
          isRecording={isRecording}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          isSpeaking={isSpeaking}
        />
      </div>
    </div>
  );
};

export default CallPage;