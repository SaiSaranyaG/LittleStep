import React, { useEffect } from 'react';
import {
  Calendar,
  Sparkles,
  Award,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  TrendingUp,
  Droplet,
  Wind,
  X,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface WeeklySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WeeklySummaryModal: React.FC<WeeklySummaryModalProps> = ({ isOpen, onClose }) => {
  const { weeklySummary, isLoadingWeeklySummary, refreshWeeklySummary, longestStreak, totalPoints } = useApp();

  useEffect(() => {
    if (isOpen && !weeklySummary) {
      refreshWeeklySummary();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-slate-900 border border-emerald-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-900/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">My LittleStep Week</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-900/80 text-teal-300 border border-teal-700/60 font-bold">
                  Week {weeklySummary?.weekNumber || 1}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {weeklySummary
                  ? `${weeklySummary.startDate} — ${weeklySummary.endDate}`
                  : 'Weekly Sustainability Summary'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isLoadingWeeklySummary ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-8 h-8 mx-auto border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400">Preparing your weekly care summary...</p>
          </div>
        ) : weeklySummary ? (
          <div className="space-y-5">
            {/* Key Metrics Bento */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
                <Leaf className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <p className="text-lg font-black text-white">{weeklySummary.plantsMaintainedCount}</p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Plants Maintained</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
                <CheckCircle2 className="w-4 h-4 text-teal-400 mx-auto mb-1" />
                <p className="text-lg font-black text-white">{weeklySummary.careTasksCompletedCount}</p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Care Tasks</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
                <TrendingUp className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <p className="text-lg font-black text-white">{weeklySummary.currentStreakDays}d</p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Care Streak</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
                <Award className="w-4 h-4 text-emerald-300 mx-auto mb-1" />
                <p className="text-lg font-black text-white">+{weeklySummary.pointsEarnedThisWeek}</p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Eco-Points</p>
              </div>
            </div>

            {/* Biggest LittleStep Spotlight */}
            {weeklySummary.biggestLittleStep && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950 to-slate-900 border border-emerald-600/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      Biggest LittleStep This Week
                    </span>
                  </div>
                  {weeklySummary.biggestLittleStep.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                      {weeklySummary.biggestLittleStep.badge}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white">
                  {weeklySummary.biggestLittleStep.title}
                </h4>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  {weeklySummary.biggestLittleStep.description}
                </p>
              </div>
            )}

            {/* Environmental & Air Summary */}
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <Wind className="w-4 h-4 text-teal-400" />
                <span>Microclimate & Environment Insight</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {weeklySummary.environmentalAqiOverview}
              </p>
            </div>

            {/* Next Week Guidance */}
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span>Looking Ahead to Next Week</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {weeklySummary.nextWeekGuidance}
              </p>
            </div>

            {/* Zero-Greenwashing Scientific Guardrail Note */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{weeklySummary.scientificDisclaimer}</span>
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black text-xs transition-colors"
          >
            Close Summary
          </button>
        </div>
      </div>
    </div>
  );
};
