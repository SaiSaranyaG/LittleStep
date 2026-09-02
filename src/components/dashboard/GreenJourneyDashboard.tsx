import React from 'react';
import {
  Sprout,
  Compass,
  HeartHandshake,
  Wind,
  Award,
  Cpu,
  Flame,
  Star,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Droplet,
  Stethoscope,
  Sparkles,
  Camera,
  Activity,
  CalendarCheck,
  MessageSquare,
  Globe,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { NextLittleStepCard } from './NextLittleStepCard';
import { SustainabilityPreferencesModal } from './SustainabilityPreferencesModal';
import { WeeklySummaryModal } from './WeeklySummaryModal';
import { LittleStepChatDrawer } from './LittleStepChatDrawer';

export const GreenJourneyDashboard: React.FC = () => {
  const {
    activeSpace,
    adoptions = [],
    careTasks = [],
    completeCareTask,
    totalPoints = 0,
    currentLevel = 1,
    longestStreak = 0,
    baseline,
    agentLogs = [],
    setActiveTab,
    isPreferencesModalOpen,
    setIsPreferencesModalOpen,
    isWeeklySummaryModalOpen,
    setIsWeeklySummaryModalOpen,
    isChatOpen,
    setIsChatOpen,
  } = useApp();

  const { user, userProfile, openAuthModal } = useAuth();

  const activePlantsInSpace = (adoptions || []).filter((a) => a.spaceId === activeSpace?.id);
  const utilization = activeSpace?.plantCapacityEstimate
    ? Math.round((activePlantsInSpace.length / activeSpace.plantCapacityEstimate) * 100)
    : 0;

  const nextPendingTask = careTasks.find((t) => !t.isCompleted);

  const journeySteps = [
    { num: '01', title: 'Scan', desc: 'Room & Sunlight' },
    { num: '02', title: 'Understand', desc: 'Space Capacity' },
    { num: '03', title: 'Adopt', desc: '1 Plant Match' },
    { num: '04', title: 'Care', desc: 'Watering Logs' },
    { num: '05', title: 'Measure', desc: 'Air & Climate' },
    { num: '06', title: 'Earn', desc: 'Eco-Points & Rewards' },
    { num: '07', title: 'Grow', desc: 'Thriving Sanctuary' },
  ];

  const appOptions = [
    {
      id: 'spaces',
      title: 'Space Scanner',
      subtitle: 'Room Layout, Sunlight & Capacity Check',
      badge: 'Space & Light Map',
      icon: Compass,
      accentColor: 'from-emerald-600 to-teal-500',
      badgeColor: 'bg-emerald-850 text-emerald-300 border-emerald-700/60',
      description:
        'Upload or capture your room, patio, or balcony photo. Check square footage, identify sunny & shaded spots, and make sure your plants have room to breathe.',
      statusLabel: 'Active Room Profile',
      statusValue: activeSpace
        ? `${activeSpace.name} (${activeSpace.usableAreaSqFt} sq.ft • ${utilization}% used)`
        : 'Space scan ready',
      actionText: 'Launch Space Scanner',
      buttonId: 'dashboard-open-spaces-btn',
    },
    {
      id: 'plants',
      title: 'Plant Companions',
      subtitle: 'Gentle 1-Plant Adoption & Visual Health Doctor',
      badge: 'Mindful Care & Health',
      icon: HeartHandshake,
      accentColor: 'from-teal-600 to-emerald-500',
      badgeColor: 'bg-teal-900/80 text-teal-300 border-teal-700/60',
      description:
        'Adopt drought-hardy, climate-matched companions one at a time. Log watering schedules, build daily streaks, and take leaf photos for instant care remedies.',
      statusLabel: 'Active Sanctuary',
      statusValue: `${adoptions.length} Companion(s) • ${nextPendingTask ? 'Task due today' : 'All care up to date'}`,
      actionText: 'Open Plant Companions',
      buttonId: 'dashboard-open-plants-btn',
    },
    {
      id: 'environment',
      title: 'Air & Climate',
      subtitle: 'Indoor Humidity & Outdoor AQI Tracking',
      badge: 'Climate Snapshot',
      icon: Wind,
      accentColor: 'from-cyan-600 to-teal-500',
      badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-700/60',
      description:
        'Check real outdoor AQI versus indoor humidity levels. Learn how humidity and plant care interact naturally in your home.',
      statusLabel: 'Air Quality Snapshot',
      statusValue: `Outdoor AQI: ${baseline.outdoorAqi.value} (${baseline.outdoorAqi.category}) • Humidity: ${baseline.indoorHumidity.value}%`,
      actionText: 'Explore Air & Climate',
      buttonId: 'dashboard-open-environment-btn',
    },
    {
      id: 'rewards',
      title: 'Eco-Points & Rewards',
      subtitle: 'Care Milestones & Eco-Store',
      badge: 'Care Milestones',
      icon: Award,
      accentColor: 'from-amber-600 to-emerald-500',
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-700/60',
      description:
        'Earn eco-points as your companion plants thrive over 30, 90, and 180 days. Redeem points for biodegradable planters, organic potting mix, and seeds.',
      statusLabel: 'Available Balance',
      statusValue: `${totalPoints} Eco-Points (Level ${currentLevel}) • ${longestStreak}d Streak`,
      actionText: 'View Points & Rewards',
      buttonId: 'dashboard-open-rewards-btn',
    },
    {
      id: 'impact',
      title: 'Impact & Community',
      subtitle: 'Care Consistency & Habit Score',
      badge: 'Your Growth',
      icon: Globe,
      accentColor: 'from-teal-500 to-emerald-400',
      badgeColor: 'bg-teal-950 text-teal-300 border-teal-700/60',
      description:
        'See what your small daily steps have added up to: care consistency, plant survival longevity, a transparent habit score, and community circles.',
      statusLabel: 'Your Care Record',
      statusValue: 'Full Care Profile & Community Milestones',
      actionText: 'View My Impact Journey',
      buttonId: 'dashboard-open-impact-btn',
    },
    {
      id: 'agents',
      title: 'Smart Advisors & Specialists',
      subtitle: 'Collaborative Plant Care Guides',
      badge: 'Care Specialists',
      icon: Cpu,
      accentColor: 'from-emerald-500 to-indigo-500',
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-700/60',
      description:
        'Meet your dedicated team of smart plant guides—specializing in room lighting, plant matching, watering routines, and leaf health.',
      statusLabel: 'Care Team Status',
      statusValue: `9 Guides Active • ${agentLogs.length} Activities Recorded`,
      actionText: 'Meet Your Specialists',
      buttonId: 'dashboard-open-agents-btn',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Welcome & Sustainable Philosophy Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950/90 via-emerald-900/80 to-teal-950/90 p-6 sm:p-10 border border-emerald-700/60 shadow-2xl backdrop-blur-md">
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold tracking-wider uppercase">
                <Sprout className="w-4 h-4 text-emerald-400" />
                <span>Small steps. Greener spaces. Bigger impact. — LittleStep</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {user
                  ? `Welcome back, ${userProfile?.displayName || user.email?.split('@')[0] || 'Plant Friend'} 🌱`
                  : 'Your Green Sanctuary Hub'}
              </h1>
              <p className="text-emerald-200/90 text-sm sm:text-base leading-relaxed">
                {user
                  ? 'Your biophilic living progress is securely backed up and synced with Google Cloud Firestore.'
                  : 'Welcome to your mindful plant parenting ecosystem. Sign in or register to sync your space maps, plant companions, and verified rewards across devices.'}
              </p>
              {!user && (
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    id="dashboard-hero-signup-btn"
                    onClick={() => openAuthModal('register')}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-emerald-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/80 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    id="dashboard-hero-signin-btn"
                    onClick={() => openAuthModal('login')}
                    className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-emerald-500/40 text-emerald-200 hover:text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>

            {/* High-Level Score Badges */}
            <div className="grid grid-cols-3 sm:flex items-center gap-3">
              <div
                onClick={() => setActiveTab('rewards')}
                className="p-3.5 sm:p-4 rounded-2xl bg-emerald-950/80 border border-amber-500/40 text-center cursor-pointer hover:border-amber-400 hover:scale-105 transition-all shadow"
              >
                <div className="flex items-center justify-center gap-1 text-amber-400 font-black text-lg sm:text-2xl">
                  <Flame className="w-5 h-5 fill-amber-400" />
                  <span>{longestStreak}d</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-amber-200/80 font-bold block mt-0.5">
                  Streak
                </span>
              </div>

              <div
                onClick={() => setActiveTab('rewards')}
                className="p-3.5 sm:p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-center cursor-pointer hover:border-emerald-400 hover:scale-105 transition-all shadow"
              >
                <div className="flex items-center justify-center gap-1 text-emerald-300 font-black text-lg sm:text-2xl">
                  <Star className="w-5 h-5 fill-emerald-400 text-emerald-400" />
                  <span>{totalPoints}</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-emerald-200/80 font-bold block mt-0.5">
                  Points (Lvl {currentLevel})
                </span>
              </div>

              <div
                onClick={() => setActiveTab('spaces')}
                className="p-3.5 sm:p-4 rounded-2xl bg-emerald-950/80 border border-teal-500/50 text-center cursor-pointer hover:border-teal-400 hover:scale-105 transition-all shadow"
              >
                <div className="flex items-center justify-center gap-1 text-teal-300 font-black text-lg sm:text-2xl">
                  <Layers className="w-5 h-5" />
                  <span>{utilization}%</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-teal-200/80 font-bold block mt-0.5">
                  Space Used
                </span>
              </div>
            </div>
          </div>

          {/* Quick Active Task Reminder Bar if pending */}
          {nextPendingTask && (
            <div className="p-3.5 rounded-2xl bg-emerald-900/60 border border-emerald-600/60 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0">
                  <Droplet className="w-4 h-4 text-cyan-300" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Daily Care Due: {nextPendingTask.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-200 font-mono">
                      +2 Eco-Points
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-300/80 truncate max-w-md">{nextPendingTask.notes}</p>
                </div>
              </div>
              <button
                id="dashboard-quick-complete-care-btn"
                onClick={() => completeCareTask(nextPendingTask.id)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs shadow transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Task Now</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PHASE 8: YOUR NEXT LITTLESTEP (Prominent Action Center) */}
      <NextLittleStepCard
        onOpenPreferences={() => setIsPreferencesModalOpen(true)}
        onOpenWeeklySummary={() => setIsWeeklySummaryModalOpen(true)}
      />

      {/* Sustainable Philosophy Progression Stepper */}
      <div className="rounded-3xl bg-slate-900/60 border border-emerald-800/40 p-5 space-y-3">
        <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>LittleStep 7-Stage Mindful Methodology</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {journeySteps.map((step, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-center space-y-0.5 hover:border-emerald-600/50 transition-colors"
            >
              <span className="text-[10px] text-emerald-400 font-mono font-bold">{step.num}. {step.title}</span>
              <p className="text-[10px] text-emerald-200/70 truncate">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Options Grid (What we offer) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Explore Ecosystem Modules
            </h2>
            <p className="text-xs sm:text-sm text-emerald-300/80">
              Select any core option below to manage and advance your sustainable green space.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-emerald-300 hidden sm:inline-block">
            5 Modules Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <div
                key={opt.id}
                id={`option-card-${opt.id}`}
                onClick={() => setActiveTab(opt.id as any)}
                className="group relative rounded-3xl bg-emerald-950/80 hover:bg-emerald-900/70 border border-emerald-800/70 hover:border-emerald-500/80 p-6 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-950/50 hover:-translate-y-1 cursor-pointer backdrop-blur-sm"
              >
                <div className="space-y-4">
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${opt.accentColor} flex items-center justify-center shadow-lg shadow-emerald-950/60 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-emerald-950" />
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${opt.badgeColor}`}>
                      {opt.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {opt.title}
                    </h3>
                    <p className="text-xs text-emerald-300/70 font-medium">{opt.subtitle}</p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-emerald-200/80 leading-relaxed">
                    {opt.description}
                  </p>
                </div>

                {/* Status bar & Action Button */}
                <div className="pt-5 mt-4 border-t border-emerald-800/50 space-y-3">
                  <div className="text-[11px] space-y-0.5">
                    <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">
                      {opt.statusLabel}:
                    </span>
                    <p className="text-emerald-100 font-medium truncate">{opt.statusValue}</p>
                  </div>

                  <button
                    id={opt.buttonId}
                    className="w-full py-2.5 rounded-xl bg-emerald-900/90 group-hover:bg-emerald-500 group-hover:text-emerald-950 text-emerald-200 border border-emerald-700/60 group-hover:border-emerald-400 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>{opt.actionText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase 8 Modals & Assistant */}
      <SustainabilityPreferencesModal
        isOpen={isPreferencesModalOpen}
        onClose={() => setIsPreferencesModalOpen(false)}
      />

      <WeeklySummaryModal
        isOpen={isWeeklySummaryModalOpen}
        onClose={() => setIsWeeklySummaryModalOpen(false)}
      />

      <LittleStepChatDrawer />
    </div>
  );
};

