import React from 'react';
import { Sprout, X, ShieldCheck, Sparkles, Compass, HeartHandshake, Stethoscope, Bot, Award, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthGateModal: React.FC = () => {
  const {
    isAuthGateOpen,
    closeAuthGate,
    authGateContext,
    openAuthModal,
  } = useAuth();

  if (!isAuthGateOpen) return null;

  const getFeatureIcon = () => {
    switch (authGateContext?.actionType) {
      case 'space_scan':
        return <Compass className="w-7 h-7 text-[#6FA85F]" />;
      case 'plant_health':
        return <Stethoscope className="w-7 h-7 text-emerald-400" />;
      case 'plant_recommend':
        return <Sparkles className="w-7 h-7 text-amber-400" />;
      case 'chat':
        return <Bot className="w-7 h-7 text-teal-400" />;
      case 'adopt_plant':
        return <HeartHandshake className="w-7 h-7 text-[#6FA85F]" />;
      case 'rewards':
        return <Award className="w-7 h-7 text-amber-400" />;
      case 'impact':
        return <Globe className="w-7 h-7 text-teal-400" />;
      default:
        return <Sprout className="w-7 h-7 text-[#6FA85F]" />;
    }
  };

  const title = authGateContext?.title || 'Your LittleStep starts here';
  const defaultMessage =
    'To analyze your space, diagnose plant health, and receive personalized care recommendations, please create a free account.';
  const message = authGateContext?.message || defaultMessage;

  const handleSignUp = () => {
    closeAuthGate();
    openAuthModal('register');
  };

  const handleSignIn = () => {
    closeAuthGate();
    openAuthModal('login');
  };

  return (
    <div
      id="littlestep-auth-gate-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthGate();
      }}
    >
      <div className="relative w-full max-w-lg bg-[#FDFBF7] text-[#2D3A26] border border-[#2D3A26]/15 rounded-[2rem] p-6 sm:p-8 shadow-2xl shadow-black/40 overflow-hidden transform transition-all">
        {/* Soft Background Accents */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#6FA85F]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-emerald-700/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          id="auth-gate-close-btn"
          onClick={closeAuthGate}
          className="absolute top-5 right-5 p-2 rounded-full text-[#2D3A26]/60 hover:text-[#2D3A26] hover:bg-[#2D3A26]/10 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-white border border-[#2D3A26]/15 flex items-center justify-center shadow-md mb-4">
            {getFeatureIcon()}
          </div>

          <span className="text-[11px] uppercase tracking-[0.18em] font-extrabold text-[#6FA85F] mb-1 font-sans">
            🌱 Eco-Living Sanctuary Gate
          </span>

          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2D3A26] leading-tight"
            style={{ fontFamily: "'Gaegu', cursive, sans-serif" }}
          >
            {title}
          </h2>

          <p className="text-sm sm:text-base text-[#2D3A26]/80 mt-2 max-w-md leading-relaxed font-sans">
            {message}
          </p>
        </div>

        {/* Value Prop Micro Checklist */}
        <div className="mt-5 mb-6 p-4 rounded-2xl bg-white/80 border border-[#2D3A26]/10 space-y-2 text-xs font-medium text-[#2D3A26]/85 font-sans">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#6FA85F] shrink-0" />
            <span>AI Space Assessment & 2D Sunlight Zone Mapping</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#6FA85F] shrink-0" />
            <span>1-Plant Mindful Adoption & Real-Time Leaf Doctor</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#6FA85F] shrink-0" />
            <span>Verified Eco-Points, Care Streaks & Private Cloud Sync</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              id="auth-gate-signup-btn"
              onClick={handleSignUp}
              className="w-full py-3.5 px-5 rounded-full bg-[#6FA85F] hover:bg-[#5e944f] text-white font-bold text-sm shadow-md shadow-[#6FA85F]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 font-sans"
            >
              <Sprout className="w-4 h-4" />
              <span>Sign Up</span>
            </button>

            <button
              id="auth-gate-signin-btn"
              onClick={handleSignIn}
              className="w-full py-3.5 px-5 rounded-full bg-white hover:bg-emerald-50/50 text-[#2D3A26] border-2 border-[#2D3A26] font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 font-sans"
            >
              <span>Sign In</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              id="auth-gate-maybe-later-btn"
              onClick={closeAuthGate}
              className="text-xs text-[#2D3A26]/60 hover:text-[#2D3A26] font-semibold py-1.5 px-3 rounded-lg hover:bg-[#2D3A26]/5 transition-colors cursor-pointer font-sans"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
