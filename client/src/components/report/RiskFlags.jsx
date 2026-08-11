import React from 'react';

export const RiskFlags = ({ flags = [] }) => {
  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between border-b border-[#495057]/20 pb-2">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#495057] font-semibold flex items-center gap-1.5">
          <span>Highlights for Physician Review</span>
        </h3>
        <span className="text-[10px] font-mono text-[#495057]/70 italic">
          Non-diagnostic intake notes
        </span>
      </div>

      {flags && flags.length > 0 ? (
        <div className="space-y-2">
          {flags.map((flag, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 bg-[#E4593F]/5 border border-[#E4593F]/20 rounded-xl p-3 text-xs font-sans text-[#12191C]"
            >
              <span className="p-0.5 bg-[#E4593F]/15 rounded text-[#E4593F] font-mono font-bold shrink-0 text-xs">
                !
              </span>
              <span className="leading-relaxed font-medium">{flag}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[#495057] text-xs font-mono italic bg-white/40 p-3 rounded-xl border border-[#495057]/10">
          No specific red flags or critical points flagged during this intake session.
        </p>
      )}
    </div>
  );
};

export default RiskFlags;



