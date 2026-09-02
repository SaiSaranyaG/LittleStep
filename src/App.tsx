import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { AuthModal } from './components/auth/AuthModal';
import { AuthGateModal } from './components/auth/AuthGateModal';
import { PublicLandingView } from './components/landing/PublicLandingView';
import { GreenJourneyDashboard } from './components/dashboard/GreenJourneyDashboard';
import { SpaceScannerView } from './components/scanner/SpaceScannerView';
import { PlantsView } from './components/plants/PlantsView';
import { AirEnvironmentView } from './components/environment/AirEnvironmentView';
import { RewardsView } from './components/rewards/RewardsView';
import { MultiAgentVisualizerView } from './components/agents/MultiAgentVisualizerView';
import { ImpactJourneyView } from './components/impact/ImpactJourneyView';
import { LittleStepChatDrawer } from './components/dashboard/LittleStepChatDrawer';
import { Sprout, ShieldCheck } from 'lucide-react';
import botanicalGrowthBg from './assets/images/growth_botanical_bg_1787406183694.jpg';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const { user, loading, authStatus } = useAuth();

  // 1. AUTH LOADING STATE — No flash of mock/dashboard content
  if (loading || authStatus === 'AUTH_LOADING') {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3 p-8">
          <div className="w-12 h-12 rounded-2xl bg-[#3D6636]/10 text-[#3D6636] flex items-center justify-center shadow-xs">
            <Sprout className="w-6 h-6 animate-bounce" />
          </div>
          <span
            className="text-lg font-bold text-[#1E2B1E]"
            style={{ fontFamily: "'Gaegu', cursive, sans-serif" }}
          >
            LittleStep
          </span>
          <p className="text-xs text-[#3A4A3A]/70">Gathering sunshine & fresh air...</p>
        </div>
      </div>
    );
  }

  // 2. UNAUTHENTICATED EXPERIENCE — Pure public home page with zero user/mock data
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#243324] flex flex-col font-sans selection:bg-[#5B8C51]/20">
        {/* Minimal Public Navigation */}
        <Navbar />

        {/* Global Auth Modals */}
        <AuthModal />
        <AuthGateModal />

        {/* Public Landing View */}
        <main className="flex-1">
          <PublicLandingView />
        </main>

        {/* Minimal Public Footer */}
        <footer className="border-t border-[#1E2B1E]/10 bg-[#F4EFE6] py-8 text-xs text-[#3A4A3A]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-[#3D6636] flex items-center justify-center text-white">
                <Sprout className="w-4 h-4" />
              </div>
              <span
                className="font-bold text-base text-[#1E2B1E]"
                style={{ fontFamily: "'Gaegu', cursive" }}
              >
                LittleStep
              </span>
              <span className="text-[11px] text-[#3A4A3A]/70 hidden sm:inline">
                • Small steps. A greener home.
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#3A4A3A]/80">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5B8C51]" />
              <span>Firebase Authentication & Cloud Security Enforced</span>
            </div>

            <p className="text-[11px] text-[#3A4A3A]/70">
              © {new Date().getFullYear()} LittleStep.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // 3. AUTHENTICATED EXPERIENCE — Personalized LittleStep sanctuary & dashboard
  return (
    <div className="min-h-screen relative bg-[#040e09] text-emerald-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-emerald-950 overflow-x-hidden">
      {/* Botanical Growth Progression Background (Bud to Greenery) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <img
          src={botanicalGrowthBg}
          alt="Growth progression from emerging bud to lush greenery"
          className="w-full h-full object-cover object-center opacity-35 scale-105 filter saturate-125 brightness-90"
          referrerPolicy="no-referrer"
        />
        {/* Soft Vignette & Subtle Emerald Atmosphere Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#040e09]/80 via-[#07130e]/75 to-[#040e09]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-850/25 via-transparent to-black/60" />
      </div>

      {/* Primary Top Header & Navigation (Streak, Points, Rewards, Auth) */}
      <Navbar />

      {/* Global Auth Modals & Interactive Action Gate */}
      <AuthModal />
      <AuthGateModal />

      {/* Main Content Area with View Router */}
      <main className="relative z-10 flex-1 pb-16">
        {activeTab === 'explore' && <PublicLandingView />}
        {activeTab === 'dashboard' && <GreenJourneyDashboard />}
        {activeTab === 'spaces' && <SpaceScannerView />}
        {activeTab === 'plants' && <PlantsView />}
        {activeTab === 'environment' && <AirEnvironmentView />}
        {activeTab === 'rewards' && <RewardsView />}
        {activeTab === 'agents' && <MultiAgentVisualizerView />}
        {activeTab === 'impact' && <ImpactJourneyView />}
      </main>

      {/* LittleStep Floating Care Assistant Drawer */}
      <LittleStepChatDrawer />

      {/* Authenticated Application Footer */}
      <footer className="relative z-10 border-t border-emerald-900/60 bg-[#030906]/90 backdrop-blur-md py-8 text-xs text-emerald-400/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-emerald-950 font-bold shadow-md shadow-emerald-900/40">
                <Sprout className="w-5 h-5 text-emerald-950" />
              </div>
              <div>
                <span className="font-extrabold text-white text-sm tracking-tight">LittleStep</span>
                <p className="text-[11px] text-emerald-300/80">
                  Small steps. Greener spaces. Bigger impact.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-300/80 font-medium">
              <button onClick={() => setActiveTab('dashboard')} className="hover:text-white transition-colors cursor-pointer">
                My Journey Hub
              </button>
              <span>•</span>
              <button onClick={() => setActiveTab('spaces')} className="hover:text-white transition-colors cursor-pointer">
                Space Scanner
              </button>
              <span>•</span>
              <button onClick={() => setActiveTab('plants')} className="hover:text-white transition-colors cursor-pointer">
                Plant Companions
              </button>
              <span>•</span>
              <button onClick={() => setActiveTab('environment')} className="hover:text-white transition-colors cursor-pointer">
                Air Environment
              </button>
              <span>•</span>
              <button onClick={() => setActiveTab('rewards')} className="hover:text-white transition-colors cursor-pointer">
                Verified Ledger & Rewards
              </button>
              <span>•</span>
              <button onClick={() => setActiveTab('impact')} className="hover:text-white transition-colors font-bold text-teal-300 cursor-pointer">
                Impact & Community
              </button>
              <span>•</span>
              <button onClick={() => setActiveTab('agents')} className="hover:text-white transition-colors cursor-pointer">
                Smart Guides
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-900/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-emerald-500/70">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Firebase Authentication & Cloud Firestore Security Rules Enforced</span>
            </div>
            <p>© {new Date().getFullYear()} LittleStep. Dedicated to sustainable biophilic living.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
