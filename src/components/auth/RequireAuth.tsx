import React from 'react';
import { Sprout, Lock, ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
  targetTab?: string;
  onExplorePublic?: () => void;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({
  children,
  fallbackTitle = 'Authentication Required',
  fallbackDescription = 'Please sign in or create an account to access your personalized sanctuary, AI agents, and care schedule.',
  targetTab,
  onExplorePublic,
}) => {
  const { authStatus, openAuthModal, openAuthGate } = useAuth();

  // 1. Loading State: Smooth botanical spinner preventing auth flicker
  if (authStatus === 'AUTH_LOADING') {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-emerald-900/40 border border-emerald-600/40 flex items-center justify-center text-emerald-400 mb-4 animate-pulse">
          <Sprout className="w-8 h-8 animate-spin text-emerald-400" style={{ animationDuration: '3s' }} />
        </div>
        <h3
          className="text-2xl font-bold text-emerald-100"
          style={{ fontFamily: "'Gaegu', cursive, sans-serif" }}
        >
          Connecting your LittleStep Sanctuary...
        </h3>
        <p className="text-xs text-emerald-300/80 mt-1 max-w-sm">
          Verifying secure Firebase credentials and local microclimate state.
        </p>
      </div>
    );
  }

  // 2. Unauthenticated State: Render clean sanctuary card with sign in prompts
  if (authStatus === 'NOT_AUTHENTICATED') {
    return (
      <div className="max-w-xl mx-auto my-12 px-4 animate-fadeIn">
        <div className="bg-[#FDFBF7] text-[#2D3A26] border border-[#2D3A26]/15 rounded-[2rem] p-8 text-center shadow-xl shadow-black/20 relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#6FA85F]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="w-14 h-14 rounded-2xl bg-white border border-[#2D3A26]/15 flex items-center justify-center text-[#6FA85F] mx-auto mb-4 shadow-sm">
            <Lock className="w-6 h-6 text-[#6FA85F]" />
          </div>

          <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#6FA85F] block mb-1">
            🌱 Member Protected Area
          </span>

          <h2
            className="text-3xl sm:text-4xl font-bold text-[#2D3A26] leading-tight"
            style={{ fontFamily: "'Gaegu', cursive, sans-serif" }}
          >
            {fallbackTitle}
          </h2>

          <p className="text-sm text-[#2D3A26]/80 mt-2 max-w-md mx-auto leading-relaxed">
            {fallbackDescription}
          </p>

          {/* Value Checklist */}
          <div className="my-6 p-4 rounded-2xl bg-white/70 border border-[#2D3A26]/10 text-left text-xs space-y-2 text-[#2D3A26]/85 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6FA85F]" />
              <span>Personalized AI Space Scanner & Lighting Calculations</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6FA85F]" />
              <span>Diagnostic Leaf Doctor & Organic Care Remedies</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6FA85F]" />
              <span>Daily Care Streaks & Verified Eco-Points Ledger</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openAuthModal('register')}
              className="w-full sm:w-auto py-3 px-6 rounded-full bg-[#6FA85F] hover:bg-[#5e944f] text-white font-bold text-sm shadow-md shadow-[#6FA85F]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sprout className="w-4 h-4" />
              <span>Create Free Account</span>
            </button>

            <button
              onClick={() => openAuthModal('login')}
              className="w-full sm:w-auto py-3 px-6 rounded-full bg-white hover:bg-emerald-50/50 text-[#2D3A26] border-2 border-[#2D3A26] font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Sign In
            </button>
          </div>

          {onExplorePublic && (
            <div className="mt-4 pt-3 border-t border-[#2D3A26]/10">
              <button
                onClick={onExplorePublic}
                className="text-xs text-[#6FA85F] hover:text-[#2D3A26] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Browse Public Plant Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. Authenticated: Render children directly
  return <>{children}</>;
};
