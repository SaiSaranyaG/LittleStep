import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  LogOut,
  Trash2,
  Check,
  AlertTriangle,
  RefreshCw,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, userProfile, updateUserProfileData, logout, deleteAccount, authError } = useAuth();
  const { totalPoints, currentLevel } = useApp();

  const [displayName, setDisplayName] = useState(userProfile?.displayName || user?.displayName || '');
  const [city, setCity] = useState(userProfile?.city || '');
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'enthusiast'>(
    userProfile?.experienceLevel || 'beginner'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    await updateUserProfileData({
      displayName: displayName.trim(),
      city: city.trim(),
      experienceLevel,
    });

    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    const success = await deleteAccount();
    setIsDeleting(false);
    if (success) {
      onClose();
    } else {
      setDeleteError(authError || 'Could not delete account. If you logged in a while ago, please log out and log back in before deleting.');
    }
  };

  return (
    <div
      id="user-profile-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-slate-900 border border-emerald-600/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/60 overflow-hidden my-8">
        {/* Close Button */}
        <button
          id="profile-modal-close-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-0.5 shadow-lg flex items-center justify-center text-slate-950 font-black text-xl">
            {userProfile?.displayName?.charAt(0).toUpperCase() ||
              user?.email?.charAt(0).toUpperCase() ||
              '🌱'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">
                {userProfile?.displayName || user.email?.split('@')[0] || 'Plant Caretaker'}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/90 text-emerald-300 border border-emerald-700/60 font-mono font-bold capitalize">
                {userProfile?.authProvider || 'Verified User'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              UID: {user.uid.slice(0, 10)}...{user.uid.slice(-4)}
            </p>
          </div>
        </div>

        {/* Level & Points Badges */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-800/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-400/80 font-medium block">Care Level</span>
              <span className="text-sm font-black text-white">Level {currentLevel}</span>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-teal-950/70 border border-teal-800/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-teal-400/80 font-medium block">Eco-Points</span>
              <span className="text-sm font-black text-white">{totalPoints} Pts</span>
            </div>
          </div>
        </div>

        {/* Profile Settings Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
              Display Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your preferred name"
                className="w-full bg-slate-950/80 border border-slate-700 focus:border-emerald-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                Account Contact
              </label>
              <div className="relative">
                {user.email ? (
                  <>
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      disabled
                      value={user.email}
                      className="w-full bg-slate-950/40 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-400 truncate"
                    />
                  </>
                ) : (
                  <>
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      disabled
                      value={user.phoneNumber || 'Phone Verified'}
                      className="w-full bg-slate-950/40 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-400 font-mono"
                    />
                  </>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                City / Region
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. San Francisco, CA"
                className="w-full bg-slate-950/80 border border-slate-700 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
              Plant Experience
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['beginner', 'intermediate', 'enthusiast'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setExperienceLevel(lvl)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                    experienceLevel === lvl
                      ? 'bg-emerald-600/90 text-white border-emerald-400 shadow-md'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Joined:{' '}
                {userProfile?.createdAt
                  ? new Date(userProfile.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Today'}
              </span>
            </div>

            <button
              id="save-profile-settings-btn"
              type="submit"
              disabled={isSaving}
              className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>

        {/* Actions & Account Management */}
        <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <button
              id="profile-logout-btn"
              type="button"
              onClick={async () => {
                await logout();
                onClose();
              }}
              className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-amber-400" />
              <span>Log Out</span>
            </button>

            {!isConfirmingDelete ? (
              <button
                id="profile-start-delete-account-btn"
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Account</span>
              </button>
            ) : null}
          </div>

          {/* Delete Account Confirmation Step */}
          {isConfirmingDelete && (
            <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-600/50 space-y-3 animate-fadeIn">
              <div className="flex items-start gap-2.5 text-rose-200 text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Delete your LittleStep account?</h4>
                  <p className="mt-0.5 leading-relaxed">
                    This will permanently remove your profile, registered spaces, plant adoptions, care history, and eco-points from Firestore. This action cannot be undone.
                  </p>
                </div>
              </div>

              {deleteError && (
                <p className="text-[11px] text-rose-300 font-semibold bg-rose-900/60 p-2 rounded-lg border border-rose-700">
                  {deleteError}
                </p>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  id="confirm-delete-account-btn"
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDeleteAccount}
                  className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  {isDeleting ? 'Deleting Account...' : 'Permanently Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsConfirmingDelete(false);
                    setDeleteError(null);
                  }}
                  className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
