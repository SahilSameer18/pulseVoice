
export const SymptomsList = ({ symptoms = [], concern = '', duration = '', severity = '' }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-mono uppercase tracking-wider text-[#495057] font-semibold border-b border-[#495057]/20 pb-2">
        Symptom & Intake Metadata
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
        {/* Primary Concern */}
        <div className="bg-white/60 rounded-xl p-3.5 border border-[#495057]/20">
          <span className="text-[#495057]/70 text-[10px] uppercase tracking-wider block mb-1">
            Primary Complaint
          </span>
          <p className="text-[#12191C] font-semibold text-sm">
            {concern || 'Not specified'}
          </p>
        </div>

        {/* Onset / Duration */}
        <div className="bg-white/60 rounded-xl p-3.5 border border-[#495057]/20">
          <span className="text-[#495057]/70 text-[10px] uppercase tracking-wider block mb-1">
            Onset / Duration
          </span>
          <p className="text-[#12191C] font-semibold text-sm">
            {duration || 'Not stated'}
          </p>
        </div>
      </div>

      {/* Severity & Symptoms Tags */}
      <div className="bg-white/60 rounded-xl p-3.5 border border-[#495057]/20 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[#495057]/70 text-[10px] uppercase tracking-wider">
            Severity Rating
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E4593F]/10 text-[#E4593F] border border-[#E4593F]/20">
            {severity || 'Unstated'}
          </span>
        </div>

        <div>
          <span className="text-[#495057]/70 text-[10px] uppercase tracking-wider block mb-2">
            Identified Secondary Symptoms
          </span>
          {symptoms && symptoms.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {symptoms.map((symptom, idx) => (
                <span
                  key={idx}
                  className="bg-[#12191C]/5 text-[#12191C] border border-[#495057]/20 px-2.5 py-1 rounded-lg text-xs font-medium"
                >
                  {symptom}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[#495057] italic text-xs">No secondary symptoms mentioned.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomsList;
