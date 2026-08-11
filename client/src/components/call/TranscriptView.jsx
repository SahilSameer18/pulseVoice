import React, { useRef, useEffect } from 'react';

export const TranscriptView = ({ messages = [] }) => {
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-[#12191C]/40 border border-slate-800/80 rounded-2xl text-center">
        <p className="text-[#B9B2A0] text-xs font-mono">
          Conversation history will appear here once the call begins...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 max-h-[380px] overflow-y-auto px-2 py-4 scrollbar-thin scrollbar-thumb-slate-800">
      {messages.map((msg) => {
        const isAi = msg.sender === 'ai' || msg.role === 'assistant';
        return (
          <div
            key={msg.id || `${msg.timestamp}-${Math.random()}`}
            className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} animate-fadeIn`}
          >
            {/* Sender Label */}
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#B9B2A0] mb-1 px-1">
              {isAi ? 'AI Intake Assistant' : 'You (Patient)'} • {msg.timestamp || 'Just now'}
            </span>

            {/* Message Bubble */}
            <div
              className={`p-4 rounded-2xl max-w-[85%] border shadow-lg ${
                isAi
                  ? 'bg-slate-900/90 border-slate-800 text-slate-100 rounded-tl-sm'
                  : 'bg-[#E4593F]/15 border-[#E4593F]/30 text-rose-100 rounded-tr-sm'
              }`}
            >
              <p
                className={`text-sm leading-relaxed ${
                  isAi
                    ? 'font-display italic text-slate-100 text-base' // Spectral serif for AI spoken lines
                    : 'font-sans font-medium' // IBM Plex Sans for user turns
                }`}
              >
                "{msg.text || msg.content}"
              </p>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default TranscriptView;
