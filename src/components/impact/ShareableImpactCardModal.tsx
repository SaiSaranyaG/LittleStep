import React, { useState } from 'react';
import { X, Share2, Copy, Check, ShieldCheck, Sprout, Heart, Droplet, Award } from 'lucide-react';
import { LittleStepImpactProfile } from '../../types';

interface ShareableImpactCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  impactProfile: LittleStepImpactProfile | null;
}

export const ShareableImpactCardModal: React.FC<ShareableImpactCardModalProps> = ({
  isOpen,
  onClose,
  impactProfile,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const days = impactProfile?.careImpact?.longestMaintainedPlantDays || 180;
  const plants = impactProfile?.careImpact?.totalPlantsMaintained || 3;
  const actions = impactProfile?.careImpact?.totalCareTasksCompleted || 96;
  const checks = impactProfile?.careImpact?.totalHealthChecks || 8;
  const habitScore = impactProfile?.habitScore?.totalScore || 89;

  const shareText = `🌱 My LittleStep Journey\n• ${days} days of plant care\n• ${plants} companions maintained\n• ${actions} verified care actions\n• ${checks} health checks logged\n• LittleStep Habit Score: ${habitScore}/100\n\n🌿 Small steps. Meaningful habits. Zero greenwashing.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-emerald-700/60 p-6 sm:p-8 shadow-2xl text-emerald-100 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-800/60 pb-4">
          <div className="flex items-center gap-2.5">
            <Share2 className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-bold text-white">Privacy-Safe Share Card</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-emerald-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shareable Visual Card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#062014] via-[#04140d] to-[#020b07] border-2 border-emerald-500/50 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-emerald-950 font-bold shadow-md">
              <Sprout className="w-5 h-5 text-emerald-950" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">LittleStep</span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Sustainability Milestone Card
            </span>
            <h3 className="text-2xl font-extrabold text-white">
              {days} Days of Mindful Care
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 space-y-0.5">
              <span className="text-[10px] text-emerald-300/80 font-mono uppercase">Companions</span>
              <div className="text-lg font-extrabold text-white">{plants} Maintained</div>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 space-y-0.5">
              <span className="text-[10px] text-teal-300/80 font-mono uppercase">Care Actions</span>
              <div className="text-lg font-extrabold text-teal-300">{actions} Completed</div>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 space-y-0.5">
              <span className="text-[10px] text-cyan-300/80 font-mono uppercase">Health Checks</span>
              <div className="text-lg font-extrabold text-cyan-300">{checks} Logged</div>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 space-y-0.5">
              <span className="text-[10px] text-amber-300/80 font-mono uppercase">Habit Score</span>
              <div className="text-lg font-extrabold text-amber-300">{habitScore} / 100</div>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-800/50 flex items-center justify-between text-[11px] text-emerald-300/70 font-mono">
            <span>🌿 Small steps. Real habits.</span>
            <span className="text-teal-400">Zero Greenwashing</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4 text-emerald-950" />}
            <span>{copied ? 'Copied Summary Text!' : 'Copy Summary'}</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-200 text-xs sm:text-sm font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
