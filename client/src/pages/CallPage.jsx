import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCall } from '../context/CallContext';
import { CALL_STATUS } from '../constants/callStatus';
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

  const { emit, on } = useSocket();
  const { isRecording, prepareStream, startRecording, stopRecording, recorderError } = useRecorder();
  const { speak, cancel, isSpeaking } = useSpeechSynthesis();
  const hasStartedRef = useRef(false);

  // Propagate recorder errors
  useEffect(() => {
    if (recorderError) {
      setError(recorderError);
    }
  }, [recorderError, setError]);

  // Pre-warm microphone stream as soon as CallPage mounts
  useEffect(() => {
    prepareStream();
  }, [prepareStream]);

  // Bind Socket Event Listeners
  useEffect(() => {
    // 1. call:greeting -> initial AI greeting
    const unbindGreeting = on('call:greeting', (payload) => {
      if (payload?.success && payload?.data?.text) {
        addMessage('ai', payload.data.text);
        setCallStatus(CALL_STATUS.SPEAKING);
        speak(payload.data.text, selectedLanguage, () => {
          setCallStatus(CALL_STATUS.LISTENING);
        });
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
          speak(text, selectedLanguage, () => {
            setCallStatus(CALL_STATUS.LISTENING);
          });
        }
      }
    });

    // 3. turn:error -> failure handling (silence / STT / API error)
    const unbindError = on('turn:error', (payload) => {
      console.warn('[CallPage] Received turn:error:', payload);
      setError(payload?.message || "Didn't catch that — please speak clearly and try again.");
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

    // 5. call:report_error -> error during report generation
    const unbindReportError = on('call:report_error', (payload) => {
      console.error('[CallPage] Received call:report_error:', payload);
      setError(payload?.message || 'Failed to generate intake report. Please try again.');
      setCallStatus(CALL_STATUS.LISTENING);
    });

    return () => {
      unbindGreeting();
      unbindResponse();
      unbindError();
      unbindReport();
      unbindReportError();
    };
  }, [on, addMessage, setCallStatus, setReport, setError, speak, cancel, navigate, selectedLanguage]);

  // Auto-start call on mount strictly ONCE (prevents StrictMode duplicate emissions)
  useEffect(() => {
    if (callStatus === CALL_STATUS.IDLE && !hasStartedRef.current) {
      hasStartedRef.current = true;
      setCallStatus(CALL_STATUS.CONNECTING);
      emit('call:start', { language: selectedLanguage });
    }
  }, [callStatus, setCallStatus, emit, selectedLanguage]);

  // Handle Toggle Recording (Click to Start / Click to Stop)
  const handleToggleRecording = useCallback(async () => {
    if (!isRecording) {
      clearError();
      cancel(); // Interrupt TTS if currently speaking
      setCallStatus(CALL_STATUS.LISTENING);
      await startRecording();
    } else {
      const result = await stopRecording();
      if (result && result.buffer) {
        setCallStatus(CALL_STATUS.THINKING);
        emit('turn:audio', {
          buffer: result.buffer,
          mimeType: result.mimeType
        });
      } else {
        setCallStatus(CALL_STATUS.LISTENING);
      }
    }
  }, [isRecording, clearError, cancel, setCallStatus, startRecording, stopRecording, emit]);

  // Handle Start Call manually
  const handleStartCall = useCallback(() => {
    clearError();
    hasStartedRef.current = true;
    setCallStatus(CALL_STATUS.CONNECTING);
    emit('call:start', { language: selectedLanguage });
  }, [clearError, setCallStatus, emit, selectedLanguage]);

  // Handle End Call manually (stops active recording first)
  const handleEndCall = useCallback(async () => {
    cancel();
    if (isRecording) {
      await stopRecording();
    }
    setCallStatus(CALL_STATUS.THINKING);
    emit('call:end');
  }, [cancel, isRecording, stopRecording, setCallStatus, emit]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
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
          onToggleRecording={handleToggleRecording}
          isSpeaking={isSpeaking}
        />
      </div>
    </div>
  );
};

export default CallPage;
