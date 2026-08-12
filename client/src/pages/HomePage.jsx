import { useNavigate } from 'react-router-dom';
import { useCall } from '../context/CallContext';
import { CALL_STATUS } from '../constants/callStatus';
import { SUPPORTED_LANGUAGES } from '../constants/languages';

export const HomePage = () => {
  const navigate = useNavigate();
  const { selectedLanguage, setSelectedLanguage, setCallStatus, resetCall } = useCall();

  const handleStartCall = () => {
    resetCall();
    setCallStatus(CALL_STATUS.IDLE);
    navigate('/call');
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12 text-center overflow-hidden">
      {/* Background Resting Pulse Line Motif */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
        <svg className="w-full max-w-4xl h-64 animate-pulse-resting" viewBox="0 0 600 120" fill="none">
          <path
            d="M0,60 L200,60 L220,20 L240,100 L260,35 L280,85 L300,60 L600,60"
            stroke="#E4593F"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Main Hero Card */}
      <div className="relative z-10 max-w-2xl mx-auto space-y-8 animate-fadeIn">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E4593F]/10 border border-[#E4593F]/25 text-xs font-mono text-[#E4593F]">
          <span className="w-2 h-2 rounded-full bg-[#E4593F] animate-ping"></span>
          <span>Conversational Voice AI Screening</span>
        </div>

        {/* Hero Title in Spectral Serif */}
        <div className="space-y-3">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-tight">
            Speak naturally. <br />
            <span className="italic text-[#E4593F]">Get structured intake reports.</span>
          </h1>
          <p className="font-sans text-slate-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Conduct an adaptive voice-assisted health intake screening call in English or Hindi. 
            Speak your answers, and receive a concise clinical summary instantly.
          </p>
        </div>

        {/* Language Selection Bar */}
        <div className="bg-[#12191C]/80 border border-slate-800 p-2 rounded-2xl max-w-md mx-auto flex items-center justify-center gap-2 backdrop-blur-md">
          <span className="text-xs font-mono text-[#B9B2A0] px-2">Language:</span>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLanguage(lang.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedLanguage === lang.id
                  ? 'bg-[#E4593F] text-white shadow-lg shadow-[#E4593F]/25'
                  : 'text-[#B9B2A0] hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>

        {/* Primary CTA Button */}
        <div className="pt-2">
          <button
            onClick={handleStartCall}
            className="w-full sm:w-auto px-10 py-4 bg-[#E4593F] hover:bg-[#d4482e] text-white font-sans font-semibold rounded-2xl shadow-2xl shadow-[#E4593F]/30 transition-all transform hover:scale-105 active:scale-95 text-base flex items-center justify-center gap-3 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            Start Intake Call
          </button>
        </div>

        {/* Feature bullets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-slate-800/80 font-mono text-xs text-[#B9B2A0]">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#7FA98A]">✓</span>
            <span>English & Hindi</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#7FA98A]">✓</span>
            <span>Push-to-Talk Turn</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#7FA98A]">✓</span>
            <span>Structured Report</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
