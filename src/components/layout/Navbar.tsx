import React, { useState } from 'react';
import {
  Sprout,
  Flame,
  Star,
  Award,
  ArrowLeft,
  Bot,
  Globe,
  LogIn,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { UserProfileModal } from '../auth/UserProfileModal';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    totalPoints = 0,
    currentLevel = 1,
    longestStreak = 0,
    rewards = [],
    isChatOpen,
    setIsChatOpen,
  } = useApp();

  const { user, userProfile, openAuthModal, openAuthGate } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const redeemedRewardsCount = rewards.filter((r) => r.isRedeemed).length;
  const isSubView = activeTab !== 'dashboard';

  const handleAssistantClick = () => {
    if (!user) {
      openAuthGate({
        actionType: 'chat',
        title: 'Sign In for LittleStep Care Assistant',
        message: 'Chat with our multi-agent AI team about your space, plant care, and microclimate guidance.',
      });
      return;
    }
    setIsChatOpen(!isChatOpen);
  };

  // 1. PUBLIC NAVBAR FOR UNAUTHENTICATED VISITORS
  if (!user) {
    return (
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#1E2B1E]/10 text-[#1E2B1E] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo & Name */}
            <div
              id="brand-logo-public-btn"
              onClick={() => setActiveTab('explore')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#3D6636] flex items-center justify-center shadow-md shadow-[#3D6636]/20 group-hover:scale-105 transition-transform text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span
                  className="font-bold text-xl sm:text-2xl tracking-tight text-[#1E2B1E]"
                  style={{ fontFamily: "'Gaegu', cursive, sans-serif" }}
                >
                  LittleStep
                </span>
                <span className="text-[10px] text-[#3A4A3A] font-medium tracking-tight hidden sm:inline">
                  Small steps. A greener home.
                </span>
              </div>
            </div>

            {/* Public Auth Actions */}
            <div className="flex items-center gap-3">
              <button
                id="public-header-signin-btn"
                onClick={() => openAuthModal('login')}
                className="py-2 px-3.5 sm:px-4 text-xs sm:text-sm font-semibold text-[#3A4A3A] hover:text-[#1E2B1E] transition-colors cursor-pointer"
              >
                Sign In
              </button>

              <button
                id="public-header-register-btn"
                onClick={() => openAuthModal('register')}
                className="py-2 sm:py-2.5 px-4 sm:px-5 rounded-full bg-[#3D6636] hover:bg-[#32542c] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#3D6636]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sprout className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // 2. AUTHENTICATED NAVBAR FOR SIGNED-IN USERS
  return (
    <>
      <header className="sticky top-0 z-40 bg-emerald-950/90 backdrop-blur-md border-b border-emerald-800/50 text-emerald-50 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo & Navigation Back */}
            <div className="flex items-center gap-3 sm:gap-4">
              {isSubView && (
                <button
                  id="back-to-dashboard-btn"
                  onClick={() => setActiveTab('dashboard')}
                  className="p-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700/60 text-emerald-200 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold shadow-sm cursor-pointer"
                  title="Return to Options Hub"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Options</span>
                </button>
              )}

              <div
                id="brand-logo-btn"
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-3 cursor-pointer group select-none"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-300 flex items-center justify-center shadow-lg shadow-emerald-900/50 group-hover:scale-105 transition-transform">
                  <Sprout className="w-6 h-6 text-emerald-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                      LittleStep
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-800/80 text-emerald-300 font-mono font-medium border border-emerald-600/40 hidden xs:inline-block">
                      Eco-Living
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-emerald-300/90 hidden md:block font-medium tracking-tight">
                    Small steps. Greener spaces. Bigger impact.
                  </p>
                </div>
              </div>
            </div>

            {/* Authenticated Metrics & Navigation Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Streak Information */}
              <div
                id="streak-badge-btn"
                onClick={() => setActiveTab('rewards')}
                className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-950/80 to-amber-900/50 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-bold cursor-pointer hover:border-amber-400 hover:scale-[1.02] transition-all shadow-sm"
                title="Daily plant care survival streak"
              >
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                </div>
                <div className="flex flex-col text-left leading-none">
                  <span className="text-white font-extrabold text-xs sm:text-sm">{longestStreak}d</span>
                  <span className="text-[9px] uppercase tracking-wider text-amber-300/80 font-mono">Streak</span>
                </div>
              </div>

              {/* Points Information */}
              <div
                id="points-badge-btn"
                onClick={() => setActiveTab('rewards')}
                className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:py-2 rounded-xl bg-emerald-900/70 border border-emerald-600/50 text-emerald-200 text-xs sm:text-sm font-bold cursor-pointer hover:border-emerald-400 hover:scale-[1.02] transition-all shadow-sm"
                title="Total verified ecological points"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Star className="w-4 h-4 text-emerald-300 fill-emerald-400" />
                </div>
                <div className="flex flex-col text-left leading-none">
                  <span className="text-emerald-100 font-extrabold text-xs sm:text-sm">{totalPoints} pts</span>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-300/80 font-mono">Level {currentLevel}</span>
                </div>
              </div>

              {/* Rewards Store */}
              <div
                id="rewards-badge-btn"
                onClick={() => setActiveTab('rewards')}
                className="hidden lg:flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-teal-900/80 to-emerald-900/80 border border-teal-500/50 text-teal-200 text-xs sm:text-sm font-bold cursor-pointer hover:border-teal-400 hover:scale-[1.02] transition-all shadow-sm group"
                title="Open Rewards & Eco-Points Store"
              >
                <div className="w-6 h-6 rounded-lg bg-teal-400/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <Award className="w-4 h-4 text-teal-300" />
                </div>
                <div className="flex flex-col text-left leading-none">
                  <span className="text-white font-bold text-xs sm:text-sm flex items-center gap-1">
                    Rewards
                    {redeemedRewardsCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-teal-400" />
                    )}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-teal-300/80 font-mono">
                    {redeemedRewardsCount > 0 ? `${redeemedRewardsCount} Redeemed` : 'Store'}
                  </span>
                </div>
              </div>

              {/* Impact Journey */}
              <button
                id="navbar-open-impact-btn"
                onClick={() => setActiveTab('impact')}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl border text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer ${
                  activeTab === 'impact'
                    ? 'bg-teal-400 text-teal-950 border-teal-300 font-extrabold'
                    : 'bg-emerald-950/80 hover:bg-emerald-900 border-emerald-600/50 text-emerald-200 hover:text-white'
                }`}
                title="View My LittleStep Impact Journey & Community Circles"
              >
                <Globe className="w-4 h-4 text-teal-300" />
                <span>Impact</span>
              </button>

              {/* Explore Catalog */}
              <button
                id="navbar-explore-btn"
                onClick={() => setActiveTab('explore')}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl border text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer ${
                  activeTab === 'explore'
                    ? 'bg-[#6FA85F] text-white border-emerald-400 font-extrabold shadow-emerald-900/40'
                    : 'bg-emerald-950/80 hover:bg-emerald-900 border-emerald-700/60 text-emerald-200 hover:text-white'
                }`}
                title="Browse public plant catalog & eco-living overview"
              >
                <Sprout className="w-4 h-4 text-emerald-300" />
                <span>Explore</span>
              </button>

              {/* Care Assistant */}
              <button
                id="navbar-open-assistant-btn"
                onClick={handleAssistantClick}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl border text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer ${
                  isChatOpen
                    ? 'bg-emerald-400 text-emerald-950 border-emerald-300 shadow-emerald-900/50'
                    : 'bg-emerald-900/60 hover:bg-emerald-800 border-emerald-600/50 text-emerald-200 hover:text-white'
                }`}
                title="Open LittleStep Care Assistant"
              >
                <Bot className="w-4 h-4" />
                <span className="hidden sm:inline">Ask AI</span>
              </button>

              {/* User Profile */}
              <button
                id="navbar-user-profile-btn"
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-white transition-all shadow-sm cursor-pointer group"
                title="Manage your profile & account settings"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                  {userProfile?.displayName?.charAt(0).toUpperCase() ||
                    user.email?.charAt(0).toUpperCase() ||
                    '🌱'}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-none">
                  <span className="text-xs font-bold text-white max-w-[90px] truncate">
                    {userProfile?.displayName || user.email?.split('@')[0] || 'My Account'}
                  </span>
                  <span className="text-[9px] text-emerald-400 font-mono">Profile</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};
