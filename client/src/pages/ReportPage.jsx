import { useNavigate } from 'react-router-dom';
import { useCall } from '../context/CallContext';
import { CALL_STATUS } from '../constants/callStatus';
import ReportCard from '../components/report/ReportCard';

export const ReportPage = () => {
  const navigate = useNavigate();
  const { report, resetCall, setCallStatus } = useCall();

  const handleStartNewCall = () => {
    resetCall();
    setCallStatus(CALL_STATUS.IDLE);
    navigate('/call');
  };

  const handleCancelAndGoHome = () => {
    resetCall();
    setCallStatus(CALL_STATUS.IDLE);
    navigate('/');
  };

  if (!report) {
    return (
      <div className="w-full max-w-xl mx-auto py-16 text-center space-y-4">
        <p className="text-[#B9B2A0] text-sm font-mono">
          No active report session found. Complete an intake call to view a report.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleCancelAndGoHome}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-[#B9B2A0] hover:text-white font-mono text-xs font-semibold rounded-xl border border-slate-700 transition-all"
          >
            Cancel & Go Home
          </button>
          <button
            onClick={handleStartNewCall}
            className="px-6 py-2.5 bg-[#E4593F] hover:bg-[#d4482e] text-white font-sans text-xs font-semibold rounded-xl shadow-lg transition-all"
          >
            Start Intake Call
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">
      {/* Top Action & Session Navigation Bar */}
      <div className="w-full max-w-3xl mx-auto p-4 bg-[#12191C]/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md print:hidden">
        {/* Session Rhythm Cadence Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-xs text-[#B9B2A0]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7FA98A] animate-pulse"></span>
            <span>Intake Cadence Complete</span>
          </div>
          {/* Stylized turn cadence strip */}
          <div className="hidden md:flex items-center gap-1 opacity-70">
            <span className="w-3 h-2 rounded-xs bg-[#E4593F]"></span>
            <span className="w-6 h-2 rounded-xs bg-[#7FA98A]"></span>
            <span className="w-4 h-2 rounded-xs bg-[#E4593F]"></span>
            <span className="w-8 h-2 rounded-xs bg-[#7FA98A]"></span>
            <span className="w-5 h-2 rounded-xs bg-[#E4593F]"></span>
          </div>
        </div>

        {/* Top Cancel / Home Navigation Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCancelAndGoHome}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[#B9B2A0] hover:text-white font-mono text-xs font-medium rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Cancel & Go Home
          </button>
        </div>
      </div>

      {/* Main Clinical Report Card */}
      <ReportCard
        report={report}
        onStartNewCall={handleStartNewCall}
        onGoHome={handleCancelAndGoHome}
      />
    </div>
  );
};

export default ReportPage;

