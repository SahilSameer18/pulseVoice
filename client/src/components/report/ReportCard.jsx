import React from 'react';
import SymptomsList from './SymptomsList';
import RiskFlags from './RiskFlags';

export const ReportCard = ({ report, onStartNewCall }) => {
  if (!report) return null;

  const {
    name = 'Patient Intake',
    concern = '',
    symptoms = [],
    duration = '',
    severity = '',
    flags = [],
    summary = '',
    isSubstantive = true
  } = report;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Chart Paper Surface Container */}
      <div className="bg-[#EDEEE7] text-[#12191C] border border-[#495057]/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        {/* Header Metadata Strip */}
        <div className="border-b border-[#495057]/20 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 font-mono text-[11px] uppercase tracking-wider text-[#495057]">
              <span className="w-2 h-2 rounded-full bg-[#7FA98A]"></span>
              <span>Automated Intake Note</span>
              {!isSubstantive && (
                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-700 border border-amber-500/30 rounded-full font-semibold">
                  Limited Info
                </span>
              )}
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-[#12191C]">
              {name && name !== 'null' ? name : 'Patient Intake Record'}
            </h1>
            <p className="text-xs font-mono text-[#495057] mt-1">
              Generated {new Date().toLocaleDateString()} • PulseVoice Intake System
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#12191C] hover:bg-slate-800 text-white font-mono text-xs font-medium rounded-xl transition-all flex items-center gap-2 shadow-md"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Record
            </button>
            {onStartNewCall && (
              <button
                onClick={onStartNewCall}
                className="px-4 py-2 bg-[#E4593F] hover:bg-[#d4482e] text-white font-sans text-xs font-semibold rounded-xl shadow-md transition-all"
              >
                New Intake Call
              </button>
            )}
          </div>
        </div>

        {/* Narrative Impression */}
        <div className="space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[#495057] font-semibold">
            Clinical Narrative Summary
          </h2>
          <p className="font-display italic text-[#12191C] text-base md:text-lg leading-relaxed bg-white/70 border border-[#495057]/15 p-4 rounded-2xl">
            "{summary}"
          </p>
        </div>

        {/* Structured Symptoms Grid */}
        <SymptomsList symptoms={symptoms} concern={concern} duration={duration} severity={severity} />

        {/* Physician Highlights */}
        <RiskFlags flags={flags} />

        {/* Footer Disclaimer */}
        <div className="border-t border-[#495057]/20 pt-4 text-center">
          <p className="text-[10px] font-mono text-[#495057]/70 uppercase tracking-wider">
            PulseVoice Confidential Intake • For Clinical Context Only • Not a Final Diagnosis
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;

