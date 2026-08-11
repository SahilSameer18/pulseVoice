import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCall, CALL_STATUS } from '../../context/CallContext';
import { SUPPORTED_LANGUAGES } from '../../constants/languages';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { callStatus, selectedLanguage, setSelectedLanguage, resetCall } = useCall();

  const isCallActive =
    callStatus === CALL_STATUS.LISTENING ||
    callStatus === CALL_STATUS.THINKING ||
    callStatus === CALL_STATUS.SPEAKING ||
    callStatus === CALL_STATUS.CONNECTING;

  const handleHomeClick = () => {
    if (isCallActive) {
      if (window.confirm('Ending your active screening call to return Home. Proceed?')) {
        resetCall();
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#12191C]/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Brand Title */}
      <button
        onClick={handleHomeClick}
        className="flex items-center gap-3 group focus:outline-none"
      >
        <div className="w-9 h-9 rounded-xl bg-[#E4593F]/15 border border-[#E4593F]/30 flex items-center justify-center text-[#E4593F] group-hover:scale-105 transition-all">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="text-left">
          <span className="font-display text-xl md:text-2xl font-semibold tracking-tight text-white block leading-none">
            PulseVoice
          </span>
          <span className="text-[10px] font-mono tracking-wider uppercase text-[#B9B2A0] block mt-0.5">
            AI Voice Health Intake
          </span>
        </div>
      </button>

      {/* Right controls: Language Selector & Status */}
      <div className="flex items-center gap-4">
        {/* Active call pill */}
        {isCallActive && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#E4593F]/10 border border-[#E4593F]/25 rounded-full text-xs font-mono text-[#E4593F]">
            <span className="w-2 h-2 rounded-full bg-[#E4593F] animate-ping"></span>
            <span>Live Session</span>
          </div>
        )}

        {/* Language selector toggle */}
        {!isCallActive && location.pathname !== '/report' && (
          <div className="flex items-center bg-[#12191C] border border-slate-800 p-1 rounded-xl">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${
                  selectedLanguage === lang.id
                    ? 'bg-[#E4593F] text-white shadow-md'
                    : 'text-[#B9B2A0] hover:text-white'
                }`}
              >
                <span>{lang.flag}</span>
                <span className="hidden md:inline">{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;