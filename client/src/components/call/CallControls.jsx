import { CALL_STATUS } from '../../constants/callStatus';

export const CallControls = ({
  callStatus,
  onStartCall,
  onEndCall,
  isRecording,
  onToggleRecording,
  isSpeaking
}) => {
  const isCallActive =
    callStatus === CALL_STATUS.LISTENING ||
    callStatus === CALL_STATUS.THINKING ||
    callStatus === CALL_STATUS.SPEAKING ||
    callStatus === CALL_STATUS.CONNECTING;

  const isDisabled = callStatus === CALL_STATUS.THINKING || callStatus === CALL_STATUS.CONNECTING;

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-md mx-auto">
      {/* Call State Status Pill */}
      <div className="flex items-center gap-2.5 px-4 py-1.5 bg-[#12191C]/80 border border-slate-800 rounded-full text-xs font-mono backdrop-blur-md">
        <span
          className={`w-2 h-2 rounded-full ${
            isRecording
              ? 'bg-[#E4593F] animate-ping'
              : callStatus === CALL_STATUS.THINKING
              ? 'bg-amber-400 animate-pulse'
              : callStatus === CALL_STATUS.SPEAKING || isSpeaking
              ? 'bg-[#7FA98A] animate-pulse'
              : callStatus === CALL_STATUS.CONNECTING
              ? 'bg-indigo-400 animate-spin'
              : 'bg-[#B9B2A0]'
          }`}
        ></span>
        <span className="text-[#B9B2A0]">
          {callStatus === CALL_STATUS.IDLE && 'Ready to start'}
          {callStatus === CALL_STATUS.CONNECTING && 'Connecting AI Agent...'}
          {isRecording ? '🎙️ Recording... Click again when finished speaking' : callStatus === CALL_STATUS.THINKING ? 'Processing speech...' : callStatus === CALL_STATUS.SPEAKING || isSpeaking ? 'AI Agent speaking...' : 'Ready — Click mic to speak'}
        </span>
      </div>

      {/* Main Control Action Bar */}
      <div className="flex items-center justify-center gap-4 w-full">
        {!isCallActive ? (
          /* Start Screening Button */
          <button
            onClick={onStartCall}
            className="w-full sm:w-auto px-8 py-4 bg-[#E4593F] hover:bg-[#d4482e] text-white font-sans font-semibold rounded-2xl shadow-xl shadow-[#E4593F]/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 text-base cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            Start Intake Call
          </button>
        ) : (
          /* Active Call Controls */
          <div className="flex items-center gap-6">
            {/* Click to Record / Stop Mic Button */}
            <button
              onClick={onToggleRecording}
              disabled={isDisabled}
              className={`relative group w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-2xl cursor-pointer ${
                isRecording
                  ? 'bg-[#E4593F] text-white ring-8 ring-[#E4593F]/40 scale-110 animate-pulse'
                  : isDisabled
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                  : 'bg-[#E4593F] hover:bg-[#d4482e] text-white ring-4 ring-[#E4593F]/20 hover:scale-105'
              }`}
              title={isRecording ? 'Click to finish speaking' : 'Click to start speaking'}
            >
              {isRecording ? (
                /* Square Stop Icon */
                <div className="w-7 h-7 bg-white rounded-md"></div>
              ) : (
                /* Mic Icon */
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              )}
            </button>

            {/* End Call Button */}
            <button
              onClick={onEndCall}
              className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[#B9B2A0] hover:text-white text-xs font-mono font-medium rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.516l2.257-1.13a1 1 0 00.502-1.21L8.228 3.684A1 1 0 007.28 3H5z"
                />
              </svg>
              End Call
            </button>
          </div>
        )}
      </div>

      {isCallActive && (
        <p className="text-[#B9B2A0] text-xs font-mono">
          {isRecording
            ? '🔴 Recording active — Speak now, then click button to send'
            : isDisabled
            ? 'Processing turn...'
            : 'Click microphone button to answer'}
        </p>
      )}
    </div>
  );
};

export default CallControls;
