import React from 'react';
import { X, ShieldCheck, BookOpen, AlertCircle, CheckCircle2, FileText, Lock } from 'lucide-react';

interface DataMethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataMethodologyModal: React.FC<DataMethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-emerald-700/60 p-6 sm:p-8 shadow-2xl text-emerald-100 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-800/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                How LittleStep Calculates Impact
              </h2>
              <p className="text-xs text-emerald-300/80">
                Scientific Transparency & Zero-Greenwashing Framework
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

        {/* Core Principles */}
        <div className="space-y-4 text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/50 space-y-2">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>1. Strict Anti-Greenwashing Policy</span>
            </h3>
            <p className="text-xs text-emerald-200/80">
              LittleStep strictly avoids publishing ungrounded marketing metrics such as "X kg of CO2 removed" or "Cleaned X liters of air". NASA clean air studies were conducted in airtight sealed chamber boxes with high-volume mechanical fans; ordinary residential potted plants without indoor airflow sensors do not match these laboratory rates.
            </p>
          </div>

          {/* Mathematical Habit Score Formulation */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-800/50 space-y-3">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>2. Deterministic Habit Score Formulation (0–100)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-700/40">
                <span className="font-bold text-emerald-300">40% — Care Consistency</span>
                <p className="text-[11px] text-emerald-200/70 mt-0.5">
                  Proportion of scheduled soil moisture and watering checks executed within 24h of due date.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-700/40">
                <span className="font-bold text-teal-300">25% — Companion Lifespan</span>
                <p className="text-[11px] text-emerald-200/70 mt-0.5">
                  Survival and healthy status retention across days maintained in sanctuary spaces.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-700/40">
                <span className="font-bold text-cyan-300">15% — Health Check Diligence</span>
                <p className="text-[11px] text-emerald-200/70 mt-0.5">
                  Visual photo diagnostics performed to catch early leaf stress before irreversible damage.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-700/40">
                <span className="font-bold text-amber-300">20% — Long-Term Restraint</span>
                <p className="text-[11px] text-emerald-200/70 mt-0.5">
                  Rewarding sustained routines while preventing unsustainable impulse over-purchasing.
                </p>
              </div>
            </div>
          </div>

          {/* Environmental Sensing Scope */}
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/50 space-y-2">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-cyan-400" />
              <span>3. Environmental Data Scope</span>
            </h3>
            <p className="text-xs text-emerald-200/80">
              All environmental indicators (AQI, PM2.5, humidity) represent <strong>regional outdoor air conditions</strong> sourced from official government stations and open sensor networks. Potted houseplants do not alter outdoor weather; tracking is used to optimize indoor window ventilation and seasonal hydration cycles.
            </p>
          </div>

          {/* Privacy Protections */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-800/50 space-y-2">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>4. Privacy & Aggregated Community Data</span>
            </h3>
            <p className="text-xs text-emerald-200/80">
              Community figures are derived from aggregated care activities at city/district levels with privacy safeguards. Individual user photos, exact coordinates, and personal care timestamps are strictly private.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-emerald-800/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold text-xs sm:text-sm transition-all"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
