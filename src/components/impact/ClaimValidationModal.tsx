import React, { useState } from 'react';
import { X, ShieldCheck, AlertTriangle, CheckCircle2, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ImpactClaimValidation } from '../../types';

interface ClaimValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClaimValidationModal: React.FC<ClaimValidationModalProps> = ({ isOpen, onClose }) => {
  const { validateScientificClaim } = useApp();
  const [statement, setStatement] = useState('');
  const [validationResult, setValidationResult] = useState<ImpactClaimValidation | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  if (!isOpen) return null;

  const handleValidate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!statement.trim()) return;

    setIsValidating(true);
    const res = await validateScientificClaim(statement.trim());
    setValidationResult(res);
    setIsValidating(false);
  };

  const sampleClaims = [
    'My 3 indoor plants removed 10kg of CO2 this month.',
    'I maintained my Snake Plant for 180 days with punctual hydration.',
    'Each indoor potted plant cleans 500 liters of air per day.',
    'I checked soil moisture depth before watering for 30 consecutive days.',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-emerald-700/60 p-6 sm:p-8 shadow-2xl text-emerald-100 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-800/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                LittleStep Impact Claim Engine
              </h2>
              <p className="text-xs text-emerald-300/80">
                Live scientific verification against greenwashing guidelines
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-emerald-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input & Form */}
        <form onSubmit={handleValidate} className="space-y-3">
          <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider font-mono">
            Test an Environmental or Care Claim
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="e.g. My plants absorbed 5kg of carbon offset..."
              className="flex-1 bg-slate-950 border border-emerald-800/60 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-emerald-700/60 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={isValidating || !statement.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-emerald-950 font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5"
            >
              {isValidating ? <Search className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>Verify</span>
            </button>
          </div>
        </form>

        {/* Quick Samples */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-emerald-400/80">Try Sample Statements:</span>
          <div className="flex flex-wrap gap-2">
            {sampleClaims.map((claim, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setStatement(claim);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/50 text-emerald-300 hover:text-white text-left transition-colors truncate max-w-full"
              >
                "{claim}"
              </button>
            ))}
          </div>
        </div>

        {/* Validation Result Box */}
        {validationResult && (
          <div
            className={`p-5 rounded-2xl border space-y-3 animate-fade-in ${
              validationResult.validityStatus === 'VALIDATED'
                ? 'bg-emerald-950/70 border-emerald-600/60'
                : validationResult.validityStatus === 'ESTIMATED'
                ? 'bg-cyan-950/70 border-cyan-600/60'
                : 'bg-rose-950/70 border-rose-600/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-2">
                {validationResult.validityStatus === 'VALIDATED' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Status: VALIDATED BEHAVIORAL CLAIM</span>
                  </>
                ) : validationResult.validityStatus === 'ESTIMATED' ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-300">Status: ESTIMATED MICROCLIMATE MODEL</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span className="text-rose-300">Status: NOT SUPPORTED (REJECTED)</span>
                  </>
                )}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10">
                Confidence: {validationResult.confidence}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-white font-medium">
              "{validationResult.statement}"
            </p>

            <div className="pt-2 border-t border-white/10 text-xs text-emerald-200/80">
              <span className="font-bold text-white">Scientific Verdict: </span>
              {validationResult.userFacingExplanation}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-emerald-800/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 text-emerald-200 hover:text-white text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
