import React, { useState } from 'react';
import {
  Globe,
  Award,
  Heart,
  Droplet,
  Camera,
  Share2,
  Download,
  Info,
  ShieldCheck,
  CheckCircle2,
  Users,
  TrendingUp,
  Sparkles,
  Leaf,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Flame,
  Star,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DataMethodologyModal } from './DataMethodologyModal';
import { ShareableImpactCardModal } from './ShareableImpactCardModal';
import { ClaimValidationModal } from './ClaimValidationModal';

export const ImpactJourneyView: React.FC = () => {
  const {
    impactProfile,
    isLoadingImpact,
    refreshImpactProfile,
    communityStats,
    joinCommunityChallenge,
    longestStreak,
    totalPoints,
    setActiveTab,
  } = useApp();

  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isClaimValidationOpen, setIsClaimValidationOpen] = useState(false);
  const [activeScoreTab, setActiveScoreTab] = useState<'overview' | 'breakdown'>('overview');

  if (isLoadingImpact && !impactProfile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto animate-spin">
          <RefreshCw className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Synthesizing Your LittleStep Impact Profile...</h2>
        <p className="text-sm text-emerald-300/80 max-w-md mx-auto">
          Analyzing your care history, plant vitality, and daily habit consistency.
        </p>
      </div>
    );
  }

  const {
    careImpact,
    plantWellBeing = [],
    environmentalAwareness,
    habitScore,
    personalStory,
    beforeAfter,
    achievements = [],
    journeyMilestonesTimeline = [],
  } = impactProfile || {
    careImpact: {
      totalCareTasksCompleted: 96,
      totalPlantsMaintained: 3,
      longestMaintainedPlantDays: 180,
      longestMaintainedPlantName: 'Aura (Snake Plant)',
      averageConsistencyRate: 94,
      currentStreakDays: longestStreak,
      totalHealthChecks: 8,
      successfulRecoveriesCount: 1,
      totalCheckInsCount: 104,
    },
    plantWellBeing: [],
    environmentalAwareness: {
      daysTracked: 90,
      observationsCount: 78,
      averageOutdoorAqiCategory: 'Moderate',
      aqiTrendDescription: 'Stable' as const,
      pm25TrendSummary: 'Outdoor environment observed across seasonal shifts.',
      seasonalInsight: 'Care pacing adjusted for seasonal sunlight variance.',
      scientificDisclaimer: 'Outdoor ambient sensors observe regional air quality. Potted plants do not alter outdoor weather.',
    },
    habitScore: {
      careConsistencyScore: 36,
      plantMaintenanceScore: 23,
      healthCheckScore: 12,
      longTermCommitmentScore: 18,
      totalScore: 89,
      strongestHabitDescription: 'Punctual tactile soil moisture checks & steady hydration routine',
      growthOpportunity: 'Maintain weekly photo diagnostics to catch subtle leaf stress earlier.',
    },
    personalStory:
      "Your LittleStep journey started with a single companion. Over the last 180 days, you maintained 3 plants, completed 96 verified care actions, and performed 8 health checks. Your biggest achievement isn't accumulating plants — it's the quiet, mindful consistency with which you care for them.",
    beforeAfter: {
      whenStarted: {
        plantsMaintained: 0,
        careActions: 0,
        healthChecks: 0,
        environmentalTrackingDays: 0,
        habitScore: 10,
      },
      today: {
        plantsMaintained: 3,
        careActions: 96,
        healthChecks: 8,
        environmentalTrackingDays: 90,
        habitScore: 89,
      },
    },
    achievements: [],
    journeyMilestonesTimeline: [],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-800/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              Impact & Habits
            </span>
            <span className="text-xs text-emerald-400/80 font-mono">Zero-Greenwashing Grounded</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            🌍 My LittleStep Impact & Sustainability Journey
          </h1>
          <p className="text-sm text-emerald-200/80 max-w-2xl mt-1">
            A scientifically honest reflection of your real actions, mindful habits, companion well-being, and community progress.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="open-methodology-btn"
            onClick={() => setIsMethodologyOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-emerald-700/50 text-emerald-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <HelpCircle className="w-4 h-4 text-teal-400" />
            <span>How is this calculated?</span>
          </button>

          <button
            id="open-claim-validator-btn"
            onClick={() => setIsClaimValidationOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/40 text-emerald-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Claim Validator</span>
          </button>

          <button
            id="share-impact-card-btn"
            onClick={() => setIsShareModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-emerald-950 text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all hover:scale-[1.02]"
          >
            <Share2 className="w-4 h-4 text-emerald-950" />
            <span>Share My Journey</span>
          </button>
        </div>
      </div>

      {/* 2. Personal Story Spotlight (Gemini Synthesis grounded strictly in verified actions) */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-900/60 via-slate-900/80 to-emerald-950/70 border border-emerald-700/50 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Leaf className="w-48 h-48 text-emerald-300" />
        </div>
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider font-mono">
            <Sparkles className="w-4 h-4 text-teal-300 animate-pulse" />
            <span>My LittleStep Story</span>
          </div>
          <p className="text-base sm:text-lg text-emerald-50 font-medium leading-relaxed italic">
            "{personalStory}"
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-emerald-300/80 font-mono">
            <span>✨ Behavioral Consistency Verified</span>
            <span>•</span>
            <span>🌱 No Fabricated Offsets</span>
            <span>•</span>
            <span>❤️ 100% Paced Biophilic Growth</span>
          </div>
        </div>
      </div>

      {/* 3. Four Core Impact Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Pillar 1: Care Impact */}
        <div className="rounded-3xl bg-slate-900/70 border border-emerald-800/40 p-5 space-y-4 shadow-md hover:border-emerald-600/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <Droplet className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              Verified Actions
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300/80">🌱 Care Impact</span>
            <div className="text-3xl font-extrabold text-white mt-1">{careImpact.totalCareTasksCompleted}</div>
            <p className="text-xs text-emerald-300/80 mt-0.5">Care tasks completed</p>
          </div>
          <div className="pt-3 border-t border-emerald-900/60 space-y-1.5 text-xs text-emerald-200/80">
            <div className="flex justify-between">
              <span>Plants Maintained:</span>
              <span className="font-bold text-white">{careImpact.totalPlantsMaintained}</span>
            </div>
            <div className="flex justify-between">
              <span>Longest Companion:</span>
              <span className="font-bold text-emerald-300">{careImpact.longestMaintainedPlantDays} days</span>
            </div>
            <div className="flex justify-between">
              <span>Consistency Rate:</span>
              <span className="font-bold text-teal-300">{careImpact.averageConsistencyRate}%</span>
            </div>
          </div>
        </div>

        {/* Pillar 2: Plant Well-Being */}
        <div className="rounded-3xl bg-slate-900/70 border border-emerald-800/40 p-5 space-y-4 shadow-md hover:border-emerald-600/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-950 text-teal-400 border border-teal-800">
              Vitality Logs
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300/80">❤️ Plant Well-Being</span>
            <div className="text-3xl font-extrabold text-white mt-1">
              {plantWellBeing.filter((p) => p.status === 'healthy' || p.status === 'improved_after_care').length} / {Math.max(1, plantWellBeing.length)}
            </div>
            <p className="text-xs text-emerald-300/80 mt-0.5">Companions currently thriving</p>
          </div>
          <div className="pt-3 border-t border-emerald-900/60 space-y-1.5 text-xs text-emerald-200/80">
            <div className="flex justify-between">
              <span>Visual Health Checks:</span>
              <span className="font-bold text-white">{careImpact.totalHealthChecks} checks</span>
            </div>
            <div className="flex justify-between">
              <span>Stress Recoveries:</span>
              <span className="font-bold text-teal-300">{careImpact.successfulRecoveriesCount} recorded</span>
            </div>
            <div className="flex justify-between">
              <span>Confidence Model:</span>
              <span className="font-mono text-[10px] text-emerald-400 font-bold">HIGH (Vision Diag)</span>
            </div>
          </div>
        </div>

        {/* Pillar 3: Environmental Awareness */}
        <div className="rounded-3xl bg-slate-900/70 border border-emerald-800/40 p-5 space-y-4 shadow-md hover:border-emerald-600/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              Outdoor Sensors
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300/80">🌍 Outdoor Awareness</span>
            <div className="text-3xl font-extrabold text-white mt-1">{environmentalAwareness.daysTracked}d</div>
            <p className="text-xs text-emerald-300/80 mt-0.5">Environmental tracking period</p>
          </div>
          <div className="pt-3 border-t border-emerald-900/60 space-y-1.5 text-xs text-emerald-200/80">
            <div className="flex justify-between">
              <span>Average Ambient AQI:</span>
              <span className="font-bold text-white">{environmentalAwareness.averageOutdoorAqiCategory}</span>
            </div>
            <div className="flex justify-between">
              <span>7-Day Weather Shift:</span>
              <span className="font-bold text-cyan-300">{environmentalAwareness.aqiTrendDescription}</span>
            </div>
            <div className="flex justify-between">
              <span>Sensor Disclaimer:</span>
              <span className="text-[10px] text-emerald-400 truncate max-w-[130px]">Regional Outdoor</span>
            </div>
          </div>
        </div>

        {/* Pillar 4: Habit Score */}
        <div className="rounded-3xl bg-gradient-to-br from-emerald-900/80 to-slate-900/90 border border-amber-500/40 p-5 space-y-4 shadow-md hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <button
              onClick={() => setIsMethodologyOpen(true)}
              className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-600/50 hover:bg-amber-900"
            >
              Formula Info ⓘ
            </button>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">🌱 LittleStep Habit Score</span>
            <div className="text-3xl font-extrabold text-white mt-1">
              {habitScore.totalScore} <span className="text-sm font-normal text-amber-200/80">/ 100</span>
            </div>
            <p className="text-xs text-amber-200/90 mt-0.5 truncate">{habitScore.strongestHabitDescription}</p>
          </div>
          <div className="pt-3 border-t border-emerald-900/60 space-y-1 text-xs text-emerald-200/80">
            <div className="w-full bg-emerald-950 rounded-full h-2 overflow-hidden border border-emerald-800">
              <div
                className="bg-gradient-to-r from-emerald-400 to-amber-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${habitScore.totalScore}%` }}
              />
            </div>
            <span className="text-[10px] text-emerald-300/80 block text-right pt-0.5">Deterministic 4-Factor Model</span>
          </div>
        </div>
      </div>

      {/* 4. Habit Score Transparency & Breakdown */}
      <div className="rounded-3xl bg-slate-900/60 border border-emerald-800/40 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-400" />
              <span>Habit Score Deterministic Formulation</span>
            </h3>
            <p className="text-xs text-emerald-300/80">
              No arbitrary claims. Every point is calculated with full transparency based on verifiable care actions.
            </p>
          </div>
          <button
            id="view-full-methodology-link"
            onClick={() => setIsMethodologyOpen(true)}
            className="text-xs text-teal-300 hover:text-white font-semibold flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View Full Mathematical Weightings</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/50 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-emerald-200">1. Care Consistency</span>
              <span className="font-mono font-extrabold text-emerald-400">{habitScore.careConsistencyScore} / 40 pts</span>
            </div>
            <div className="w-full bg-emerald-900/60 rounded-full h-1.5">
              <div
                className="bg-emerald-400 h-full rounded-full"
                style={{ width: `${(habitScore.careConsistencyScore / 40) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-emerald-300/70">
              Evaluates punctuality in checking soil moisture and hydration schedules.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/50 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-emerald-200">2. Plant Maintenance</span>
              <span className="font-mono font-extrabold text-teal-400">{habitScore.plantMaintenanceScore} / 25 pts</span>
            </div>
            <div className="w-full bg-emerald-900/60 rounded-full h-1.5">
              <div
                className="bg-teal-400 h-full rounded-full"
                style={{ width: `${(habitScore.plantMaintenanceScore / 25) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-emerald-300/70">
              Evaluates continuous companion survival days and healthy status retention.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/50 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-emerald-200">3. Health Check Diligence</span>
              <span className="font-mono font-extrabold text-cyan-400">{habitScore.healthCheckScore} / 15 pts</span>
            </div>
            <div className="w-full bg-emerald-900/60 rounded-full h-1.5">
              <div
                className="bg-cyan-400 h-full rounded-full"
                style={{ width: `${(habitScore.healthCheckScore / 15) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-emerald-300/70">
              Routine photo logs to detect subtle leaf stress before severe decline.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/50 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-emerald-200">4. Long-Term Commitment</span>
              <span className="font-mono font-extrabold text-amber-400">{habitScore.longTermCommitmentScore} / 20 pts</span>
            </div>
            <div className="w-full bg-emerald-900/60 rounded-full h-1.5">
              <div
                className="bg-amber-400 h-full rounded-full"
                style={{ width: `${(habitScore.longTermCommitmentScore / 20) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-emerald-300/70">
              Sustained streak habits while avoiding rapid impulse additions.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Before vs. Today Comparison (Clear, Honest Progression) */}
      <div className="rounded-3xl bg-slate-900/60 border border-emerald-800/40 p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white">🌱 Your Journey: When You Started vs. Today</h3>
          <p className="text-xs sm:text-sm text-emerald-300/80">
            Real behavioral growth from your very first LittleStep.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* When You Started */}
          <div className="p-6 rounded-2xl bg-slate-950/70 border border-emerald-900/60 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>When You Started</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40 text-xs">
                <span className="text-emerald-300/80">🌱 Plants Maintained</span>
                <span className="font-bold text-white">0</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40 text-xs">
                <span className="text-emerald-300/80">❤️ Care Actions Logged</span>
                <span className="font-bold text-white">0</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40 text-xs">
                <span className="text-emerald-300/80">📸 Health Checks Completed</span>
                <span className="font-bold text-white">0</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40 text-xs">
                <span className="text-emerald-300/80">🌍 Environmental Tracking</span>
                <span className="font-bold text-white">No baseline set</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40 text-xs">
                <span className="text-emerald-300/80">⭐ Habit Score</span>
                <span className="font-bold text-white">10 / 100</span>
              </div>
            </div>
          </div>

          {/* Today */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-teal-950/70 border border-emerald-600/50 space-y-4 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-300 uppercase tracking-wider font-mono">
              <CheckCircle2 className="w-4 h-4 text-teal-300" />
              <span>Today (Verified Care Record)</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-900/40 border border-emerald-700/50 text-xs">
                <span className="text-emerald-200">🌱 Plants Maintained</span>
                <span className="font-extrabold text-white text-sm">{beforeAfter.today.plantsMaintained} companions</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-900/40 border border-emerald-700/50 text-xs">
                <span className="text-emerald-200">❤️ Care Actions Logged</span>
                <span className="font-extrabold text-teal-300 text-sm">{beforeAfter.today.careActions} actions</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-900/40 border border-emerald-700/50 text-xs">
                <span className="text-emerald-200">📸 Health Checks Completed</span>
                <span className="font-extrabold text-cyan-300 text-sm">{beforeAfter.today.healthChecks} checks</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-900/40 border border-emerald-700/50 text-xs">
                <span className="text-emerald-200">🌍 Environmental Tracking</span>
                <span className="font-extrabold text-emerald-300 text-sm">{beforeAfter.today.environmentalTrackingDays} days tracked</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-900/40 border border-emerald-700/50 text-xs">
                <span className="text-emerald-200">⭐ Habit Score</span>
                <span className="font-extrabold text-amber-300 text-sm">{beforeAfter.today.habitScore} / 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Milestone Timeline & Behavioral Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Milestones Timeline */}
        <div className="rounded-3xl bg-slate-900/60 border border-emerald-800/40 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>Journey Progression Timeline</span>
            </h3>
            <span className="text-xs text-emerald-400 font-mono">{longestStreak} Days Active</span>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-800/60">
            {journeyMilestonesTimeline.map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-900 shadow" />
                <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 hover:border-emerald-600/50 transition-all space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{item.title}</span>
                    <span className="text-[10px] font-mono text-emerald-400">{item.date}</span>
                  </div>
                  <p className="text-xs text-emerald-200/70">{item.description}</p>
                  <span className="text-[10px] text-teal-400/80 font-mono block pt-0.5">{item.phase}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Meaningful Achievements */}
        <div className="rounded-3xl bg-slate-900/60 border border-emerald-800/40 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Mindful Achievements</span>
            </h3>
            <span className="text-xs text-amber-300 font-mono">{totalPoints} Lifetime Pts</span>
          </div>

          <div className="space-y-3">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                  ach.isUnlocked
                    ? 'bg-emerald-950/60 border-emerald-600/50 text-white'
                    : 'bg-slate-950/40 border-emerald-900/30 opacity-50 text-emerald-300/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                      ach.isUnlocked
                        ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-emerald-950'
                        : 'bg-emerald-950 text-emerald-600'
                    }`}
                  >
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-2">
                      <span>{ach.title}</span>
                      {ach.isUnlocked && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                          Unlocked
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-emerald-300/70">{ach.description}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-amber-400">+{ach.pointsEarned} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Community Collective Progress & Challenges */}
      {communityStats && (
        <div className="rounded-3xl bg-slate-900/60 border border-emerald-800/40 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/40 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-teal-300 uppercase tracking-wider font-mono">
                <Users className="w-4 h-4 text-teal-400" />
                <span>Privacy-Safe Collective Impact</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">LittleStep Community Network</h3>
              <p className="text-xs text-emerald-300/80">
                Coarse aggregate data from thousands of mindful plant-care guardians. No private user coordinates or photos are exposed.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-300 font-mono bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>{communityStats.activeCommunityUsers.toLocaleString()} Active Guardians</span>
            </div>
          </div>

          {/* Collective Behavioral Goal */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-950 to-teal-950/80 border border-teal-600/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <span className="font-bold text-white uppercase tracking-wider font-mono">
                🌱 Collective Milestone: {communityStats.communityGoal.title}
              </span>
              <span className="font-mono text-teal-300 font-bold">
                {communityStats.communityGoal.currentPlantCareDays.toLocaleString()} /{' '}
                {communityStats.communityGoal.targetPlantCareDays.toLocaleString()} days ({communityStats.communityGoal.progressPercentage}%)
              </span>
            </div>
            <div className="w-full bg-emerald-950 rounded-full h-3 overflow-hidden border border-emerald-800">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-1000"
                style={{ width: `${communityStats.communityGoal.progressPercentage}%` }}
              />
            </div>
            <p className="text-[11px] text-emerald-300/70">
              Behavioral metric tracking genuine plant companion longevity across all verified member sanctuaries.
            </p>
          </div>

          {/* Community Challenges */}
          <div>
            <h4 className="text-sm font-bold text-emerald-200 uppercase tracking-wider font-mono mb-3">
              Active Community Care Circles
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {communityStats.activeChallenges.map((chal) => (
                <div
                  key={chal.id}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-800/40 flex flex-col justify-between space-y-3 hover:border-emerald-600/40 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white">{chal.title}</span>
                      <span className="text-[10px] font-mono text-amber-400 font-bold">+{chal.completionPoints} pts</span>
                    </div>
                    <p className="text-xs text-emerald-200/70">{chal.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-emerald-900/40 text-xs">
                    <span className="text-[11px] text-emerald-400/80 font-mono">
                      {chal.participantsCount.toLocaleString()} joined
                    </span>
                    {chal.isUserJoined ? (
                      <span className="text-[11px] font-bold text-teal-300 flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Participating
                      </span>
                    ) : (
                      <button
                        onClick={() => joinCommunityChallenge(chal.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold transition-colors"
                      >
                        Join Circle
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. Modals */}
      <DataMethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      <ShareableImpactCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        impactProfile={impactProfile}
      />

      <ClaimValidationModal
        isOpen={isClaimValidationOpen}
        onClose={() => setIsClaimValidationOpen(false)}
      />
    </div>
  );
};
