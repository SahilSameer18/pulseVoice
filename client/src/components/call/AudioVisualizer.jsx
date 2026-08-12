import { CALL_STATUS } from '../../constants/callStatus';

export const AudioVisualizer = ({ callStatus, isRecording, isSpeaking }) => {
  const isListening = callStatus === CALL_STATUS.LISTENING || isRecording;
  const isThinking = callStatus === CALL_STATUS.THINKING;
  const isAiSpeaking = callStatus === CALL_STATUS.SPEAKING || isSpeaking;

  return (
    <div className="relative w-full max-w-md mx-auto py-8 flex flex-col items-center justify-center">
      {/* Dynamic breathing orb */}
      <div className="relative flex items-center justify-center">
        {/* Outer ambient glow */}
        <div
          className={`absolute w-36 h-36 rounded-full blur-2xl transition-all duration-700 pointer-events-none ${
            isListening
              ? 'bg-[#E4593F]/30 scale-125'
              : isThinking
              ? 'bg-amber-500/25 scale-110'
              : isAiSpeaking
              ? 'bg-[#7FA98A]/35 scale-125'
              : 'bg-slate-700/15 scale-100'
          }`}
        ></div>

        {/* Pulsing ring 1 */}
        <div
          className={`w-28 h-28 rounded-full border flex items-center justify-center transition-all duration-500 ${
            isListening
              ? 'border-[#E4593F]/60 bg-[#E4593F]/10 animate-pulse'
              : isThinking
              ? 'border-amber-500/50 bg-amber-500/10 animate-pulse'
              : isAiSpeaking
              ? 'border-[#7FA98A]/60 bg-[#7FA98A]/10 animate-pulse'
              : 'border-slate-800 bg-[#12191C]/60'
          }`}
        >
          {/* Inner core orb */}
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl ${
              isListening
                ? 'bg-[#E4593F] text-white shadow-[#E4593F]/40 scale-110 animate-pulse-resting'
                : isThinking
                ? 'bg-amber-500 text-white shadow-amber-500/40 animate-pulse'
                : isAiSpeaking
                ? 'bg-[#7FA98A] text-white shadow-[#7FA98A]/40 animate-pulse-resting'
                : 'bg-slate-800 text-[#B9B2A0]'
            }`}
          >
            {/* Center icon */}
            {isListening ? (
              <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            ) : isThinking ? (
              <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : isAiSpeaking ? (
              <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Signature Pulse Wave Line Motif */}
      <div className="w-full h-8 mt-6 flex items-center justify-center opacity-70">
        <svg className="w-full h-full max-w-sm" viewBox="0 0 300 40" fill="none">
          <path
            d="M0,20 L80,20 L95,8 L105,32 L115,12 L125,28 L135,20 L300,20"
            stroke={isListening ? '#E4593F' : isAiSpeaking ? '#7FA98A' : isThinking ? '#F59E0B' : '#495057'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-colors duration-500"
          />
        </svg>
      </div>
    </div>
  );
};

export default AudioVisualizer;


