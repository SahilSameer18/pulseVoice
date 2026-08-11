import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCall, CALL_STATUS } from '../context/CallContext';
import ReportCard from '../components/report/ReportCard';

export const ReportPage = () => {
  const navigate = useNavigate();
  const { report, resetCall, setCallStatus } = useCall();

  const handleStartNewCall = () => {
    resetCall();
    setCallStatus(CALL_STATUS.IDLE);
    navigate('/call');
  };

  if (!report) {
    return (
      <div className="w-full max-w-xl mx-auto py-16 text-center space-y-4">
        <p className="text-[#B9B2A0] text-sm font-mono">
          No report available yet. Complete a health intake call first.
        </p>
        <button
          onClick={handleStartNewCall}
          className="px-6 py-3 bg-[#E4593F] text-white font-sans text-xs font-semibold rounded-xl"
        >
          Start Intake Call
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Session Rhythm Strip (Signature Motif #3) */}
      <div className="w-full max-w-3xl mx-auto p-3 bg-[#12191C]/60 border border-slate-800 rounded-2xl flex items-center justify-between text-xs font-mono text-[#B9B2A0]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#7FA98A]"></span>
          <span>Session Rhythm Cadence</span>
        </div>
        {/* Stylized turn cadence strip */}
        <div className="flex items-center gap-1 opacity-70">
          <span className="w-3 h-2 rounded-xs bg-[#E4593F]"></span>
          <span className="w-6 h-2 rounded-xs bg-[#7FA98A]"></span>
          <span className="w-4 h-2 rounded-xs bg-[#E4593F]"></span>
          <span className="w-8 h-2 rounded-xs bg-[#7FA98A]"></span>
          <span className="w-5 h-2 rounded-xs bg-[#E4593F]"></span>
          <span className="w-[#7FA98A] w-7 h-2 rounded-xs bg-[#7FA98A]"></span>
        </div>
      </div>

      {/* Main Clinical Report Card */}
      <ReportCard report={report} onStartNewCall={handleStartNewCall} />
    </div>
  );
};

export default ReportPage;
