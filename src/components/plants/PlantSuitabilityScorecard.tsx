import React from 'react';
import {
  CheckCircle2,
  Maximize2,
  Sun,
  Thermometer,
  Sparkles,
  Award,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { PlantRecommendationScore } from '../../types';

interface PlantSuitabilityScorecardProps {
  scorecard: PlantRecommendationScore;
  plantName: string;
  onExplainClick?: () => void;
  compact?: boolean;
}

export const PlantSuitabilityScorecard: React.FC<PlantSuitabilityScorecardProps> = ({
  scorecard,
  plantName,
  onExplainClick,
  compact = false,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
    if (score >= 70) return 'text-teal-400 border-teal-500/40 bg-teal-950/40';
    if (score >= 50) return 'text-amber-400 border-amber-500/40 bg-amber-950/40';
    return 'text-rose-400 border-rose-500/40 bg-rose-950/40';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-400';
    if (score >= 70) return 'bg-teal-400';
    if (score >= 50) return 'bg-amber-400';
    return 'bg-rose-400';
  };

  const dimensions = [
    { label: 'Space Fit', score: scorecard.spaceScore, icon: Maximize2, desc: 'Dimensions & footprint compatibility' },
    { label: 'Light Match', score: scorecard.lightScore, icon: Sun, desc: 'Zone Lux & daily solar hours alignment' },
    { label: 'Climate & Temp', score: scorecard.climateScore, icon: Thermometer, desc: 'Room temperature & humidity range' },
    { label: 'Care Schedule', score: scorecard.maintenanceScore, icon: Award, desc: 'Water & inspection rhythm fit' },
    { label: 'Preferences', score: scorecard.preferenceScore, icon: Sparkles, desc: 'Pet safety, experience, & style match' },
  ];

  if (compact) {
    return (
      <div id="suitability-scorecard-compact" className="p-3 bg-emerald-950/50 border border-emerald-800/40 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-300">Suitability Match</span>
          <span className="text-sm font-bold text-emerald-400">{scorecard.overallScore}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${getScoreBarColor(scorecard.overallScore)}`}
            style={{ width: `${scorecard.overallScore}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div id="plant-suitability-scorecard" className="p-5 bg-slate-900/90 border border-emerald-800/50 rounded-2xl space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              5-Factor Botanical Analysis
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-900/60 border border-emerald-700/50 text-[10px] font-medium text-emerald-300">
              Deterministic Engine
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">Suitability Scorecard: {plantName}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{scorecard.rationale}</p>
        </div>

        <div className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl border ${getScoreColor(scorecard.overallScore)}`}>
          <span className="text-2xl font-black">{scorecard.overallScore}%</span>
          <span className="text-[10px] font-medium uppercase tracking-wider opacity-80">Match Rate</span>
        </div>
      </div>

      {/* 5 Dimensions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
        {dimensions.map((dim, idx) => {
          const Icon = dim.icon;
          return (
            <div
              key={idx}
              className="p-3 bg-slate-950/60 border border-slate-800/70 rounded-xl space-y-1.5 hover:border-emerald-700/40 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Icon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{dim.label}</span>
                </span>
                <span className="font-bold text-white">{dim.score}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${getScoreBarColor(dim.score)}`}
                  style={{ width: `${dim.score}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 leading-tight truncate">{dim.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Action footer */}
      {onExplainClick && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Score evaluated against your spatial microclimate & lighting</span>
          </span>
          <button
            id="explain-recommendation-btn"
            onClick={onExplainClick}
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Ask AI: Why this plant?</span>
          </button>
        </div>
      )}
    </div>
  );
};
