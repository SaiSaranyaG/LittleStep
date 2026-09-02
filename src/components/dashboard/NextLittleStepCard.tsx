import React, { useState } from 'react';
import {
  Sprout,
  CheckCircle2,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  ArrowRight,
  Info,
  Clock,
  ShieldCheck,
  RefreshCw,
  SlidersHorizontal,
  Calendar,
  AlertTriangle,
  HeartHandshake,
  Droplet,
  Compass,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PersonalizedRecommendation } from '../../types';

interface NextLittleStepCardProps {
  onOpenPreferences?: () => void;
  onOpenWeeklySummary?: () => void;
}

export const NextLittleStepCard: React.FC<NextLittleStepCardProps> = ({
  onOpenPreferences,
  onOpenWeeklySummary,
}) => {
  const {
    nextLittleStep,
    isLoadingNextStep,
    refreshNextLittleStep,
    completeNextLittleStep,
    dismissNextLittleStep,
    submitRecommendationFeedback,
    setActiveTab,
  } = useApp();

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackReason, setFeedbackReason] = useState<string>('already_completed');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  if (isLoadingNextStep && !nextLittleStep) {
    return (
      <div className="rounded-3xl bg-emerald-950/70 border border-emerald-800/60 p-8 text-center animate-pulse space-y-4">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-800/50 flex items-center justify-center">
          <RefreshCw className="w-6 h-6 text-emerald-300 animate-spin" />
        </div>
        <p className="text-emerald-300 font-medium text-sm">
          Reviewing your care routine and sanctuary conditions...
        </p>
      </div>
    );
  }

  const rec = nextLittleStep;
  const isNoAction = rec?.actionType === 'NO_ACTION';

  const handleActionClick = () => {
    if (!rec) return;
    if (rec.actionType === 'CARE_TASK') {
      completeNextLittleStep(rec.id);
    } else if (rec.targetTab) {
      setActiveTab(rec.targetTab);
    }
  };

  const handleFeedbackSubmit = (isHelpful: boolean) => {
    if (!rec) return;
    submitRecommendationFeedback(rec.id, isHelpful, feedbackReason, feedbackComment);
    setFeedbackSent(true);
    setTimeout(() => {
      setShowFeedbackModal(false);
      setFeedbackSent(false);
    }, 1200);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-[#062016] to-[#041710] border-2 border-emerald-500/50 shadow-2xl p-6 sm:p-8 space-y-6">
      {/* Decorative Atmosphere Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header: Next LittleStep Badge & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-800/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
            <Sprout className="w-4 h-4 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-widest text-emerald-300 font-black font-mono">
                Your Next LittleStep
              </span>
              {rec?.priority && (
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    rec.priority === 'HIGH' || rec.priority === 'URGENT'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-800/60 text-emerald-300 border border-emerald-600/40'
                  }`}
                >
                  {rec.priority}
                </span>
              )}
            </div>
            <p className="text-[11px] text-emerald-400/70">
              Personalized by your LittleStep Care Team
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenWeeklySummary && (
            <button
              id="open-weekly-summary-btn"
              onClick={onOpenWeeklySummary}
              className="px-3 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-700/60 text-emerald-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="View My LittleStep Week Summary"
            >
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">My Week</span>
            </button>
          )}

          {onOpenPreferences && (
            <button
              id="open-preferences-btn"
              onClick={onOpenPreferences}
              className="px-3 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-700/60 text-emerald-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Customize maintenance time and preferences"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Preferences</span>
            </button>
          )}

          <button
            id="refresh-next-step-btn"
            onClick={() => refreshNextLittleStep()}
            disabled={isLoadingNextStep}
            className="p-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-700/60 text-emerald-300 hover:text-white transition-all"
            title="Recalculate Next LittleStep"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingNextStep ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Recommendation Content: What, Why, Next */}
      {rec ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              {rec.title}
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              {rec.what}
            </p>
          </div>

          {/* Structured Context Box: WHY and NEXT STEP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-800/70 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                <Info className="w-3.5 h-3.5 text-teal-400" />
                <span>Why this LittleStep?</span>
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed">{rec.why}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-800/70 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Next Small Action</span>
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed">{rec.nextStep}</p>
            </div>
          </div>

          {/* Contributing Specialists Tagline */}
          {rec.sourceAgents && rec.sourceAgents.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-emerald-400/80 pt-1">
              <span className="font-mono text-emerald-500">Guided by:</span>
              {rec.sourceAgents.map((agent, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-emerald-900/50 border border-emerald-800/60 text-emerald-300"
                >
                  {agent}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons & Feedback Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-emerald-800/60">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {!isNoAction ? (
                <button
                  id="take-next-littlestep-btn"
                  onClick={handleActionClick}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 text-emerald-950 font-black text-sm shadow-lg shadow-emerald-900/50 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-950 group-hover:scale-110 transition-transform" />
                  <span>{rec.buttonActionText || 'Take This LittleStep'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-900/40 px-4 py-2.5 rounded-2xl border border-emerald-800/60">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Sanctuary is thriving • No intervention required</span>
                </div>
              )}

              {!isNoAction && (
                <button
                  id="dismiss-next-step-btn"
                  onClick={() => dismissNextLittleStep(rec.id)}
                  className="px-3.5 py-3 rounded-2xl bg-emerald-900/40 hover:bg-emerald-900/80 border border-emerald-800/60 text-emerald-300 hover:text-white text-xs font-semibold transition-colors"
                  title="Skip for now"
                >
                  Skip
                </button>
              )}
            </div>

            {/* Helpfulness Feedback Toggle */}
            <div className="flex items-center gap-2 text-xs text-emerald-400/80">
              <span className="text-[11px] font-medium hidden md:inline">Was this useful?</span>
              {rec.feedback ? (
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                  {rec.feedback.isHelpful ? '👍 Thanks for feedback!' : '👎 Feedback recorded'}
                </span>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    id="feedback-thumbs-up-btn"
                    onClick={() => handleFeedbackSubmit(true)}
                    className="p-2 rounded-xl bg-emerald-900/40 hover:bg-emerald-800 border border-emerald-700/50 text-emerald-300 hover:text-emerald-100 transition-colors"
                    title="Helpful recommendation"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    id="feedback-thumbs-down-btn"
                    onClick={() => setShowFeedbackModal(true)}
                    className="p-2 rounded-xl bg-emerald-900/40 hover:bg-emerald-800 border border-emerald-700/50 text-emerald-300 hover:text-rose-300 transition-colors"
                    title="Not helpful / Needs adjustment"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 space-y-2">
          <p className="text-emerald-200 text-sm">Ready to compute your next mindful LittleStep.</p>
          <button
            onClick={() => refreshNextLittleStep()}
            className="px-4 py-2 rounded-xl bg-emerald-400 text-emerald-950 font-bold text-xs"
          >
            Compute Next Action
          </button>
        </div>
      )}

      {/* Feedback Reason Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-emerald-950 border border-emerald-700 rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ThumbsDown className="w-4 h-4 text-amber-400" />
              <span>How can LittleStep improve?</span>
            </h3>
            <p className="text-xs text-emerald-200">
              Your feedback helps us personalize your daily recommendations and care pace.
            </p>

            <div className="space-y-2">
              {[
                { id: 'already_completed', label: 'Already completed this check' },
                { id: 'not_relevant', label: 'Not relevant to my current space' },
                { id: 'not_enough_time', label: 'Not enough time today' },
                { id: 'too_difficult', label: 'Too complex or unclear' },
                { id: 'other', label: 'Other reason' },
              ].map((reason) => (
                <label
                  key={reason.id}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-900/40 hover:bg-emerald-900/80 border border-emerald-800/60 cursor-pointer text-xs text-emerald-100"
                >
                  <input
                    type="radio"
                    name="feedbackReason"
                    value={reason.id}
                    checked={feedbackReason === reason.id}
                    onChange={(e) => setFeedbackReason(e.target.value)}
                    className="accent-emerald-400"
                  />
                  <span>{reason.label}</span>
                </label>
              ))}
            </div>

            <textarea
              placeholder="Optional notes or suggestions..."
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              className="w-full h-20 bg-emerald-900/60 border border-emerald-700 rounded-xl p-2.5 text-xs text-emerald-100 focus:outline-none focus:border-emerald-400"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2 rounded-xl bg-emerald-900/80 text-emerald-200 text-xs font-semibold hover:bg-emerald-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleFeedbackSubmit(false)}
                className="px-4 py-2 rounded-xl bg-emerald-400 text-emerald-950 text-xs font-bold hover:bg-emerald-300"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
