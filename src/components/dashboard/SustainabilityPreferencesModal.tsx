import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Clock,
  Heart,
  Shield,
  Leaf,
  Bell,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserSustainabilityPreferences } from '../../types';

interface SustainabilityPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SustainabilityPreferencesModal: React.FC<SustainabilityPreferencesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { sustainabilityPreferences, updateSustainabilityPreferences, refreshNextLittleStep } = useApp();

  const [formData, setFormData] = useState<UserSustainabilityPreferences>({
    ...sustainabilityPreferences,
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    updateSustainabilityPreferences(formData);
    setSavedSuccess(true);
    refreshNextLittleStep();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-slate-900 border border-emerald-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-emerald-900/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Sustainability Preferences</h2>
              <p className="text-xs text-emerald-400/80">
                Personalize your mindful routine and care tips pacing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preferences Form Fields */}
        <div className="space-y-5">
          {/* Daily Time Availability */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>Available Time for Plant Care Daily</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '2_mins', label: '2 mins', sub: 'Micro-checks' },
                { id: '5_mins', label: '5 mins', sub: 'Standard routine' },
                { id: '15_mins', label: '15+ mins', sub: 'Deep gardening' },
              ].map((time) => (
                <button
                  key={time.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, availableTimeDaily: time.id as any })}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    formData.availableTimeDaily === time.id
                      ? 'bg-emerald-950 border-emerald-400 text-white shadow-md shadow-emerald-950'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <p className="font-bold text-xs">{time.label}</p>
                  <p className="text-[10px] text-slate-400">{time.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Plant Count Ambition */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sanctuary Scale Ambition</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'single_1', label: '1 Companion', sub: 'Focused single bond' },
                { id: 'modest_2_3', label: '2–3 Plants', sub: 'Balanced microclimate' },
                { id: 'dense_4_plus', label: '4+ Jungle', sub: 'High biophilic density' },
              ].map((scale) => (
                <button
                  key={scale.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, preferredPlantCount: scale.id as any })}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    formData.preferredPlantCount === scale.id
                      ? 'bg-emerald-950 border-emerald-400 text-white'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <p className="font-bold text-xs">{scale.label}</p>
                  <p className="text-[10px] text-slate-400">{scale.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Maintenance Tolerance */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>Plant Maintenance Tolerance</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'low', label: 'Low (Hardy)', sub: 'Survives forgetfulness' },
                { id: 'medium', label: 'Medium', sub: 'Weekly rhythm' },
                { id: 'high', label: 'High (Delicate)', sub: 'Frequent misting/care' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, maintenanceTolerance: m.id as any })}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    formData.maintenanceTolerance === m.id
                      ? 'bg-emerald-950 border-emerald-400 text-white'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <p className="font-bold text-xs">{m.label}</p>
                  <p className="text-[10px] text-slate-400">{m.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Safety & Pacing Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/80 cursor-pointer">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-xs font-bold text-white">Strict Pet-Safe Filtering</p>
                  <p className="text-[11px] text-slate-400">
                    Disallow toxic species for cats and dogs (ASPCA certified).
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.petSafeStrict}
                onChange={(e) => setFormData({ ...formData, petSafeStrict: e.target.checked })}
                className="w-4 h-4 rounded accent-emerald-400"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/80 cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-white">Single-Step Mindful Pacing</p>
                  <p className="text-[11px] text-slate-400">
                    Never overwhelm with multiple tasks at once. One step at a time.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.notificationPacing === 'daily_single_step'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    notificationPacing: e.target.checked ? 'daily_single_step' : 'on_demand_only',
                  })
                }
                className="w-4 h-4 rounded accent-emerald-400"
              />
            </label>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-emerald-950"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                <span>Preferences Saved!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-950" />
                <span>Save & Recalibrate</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
