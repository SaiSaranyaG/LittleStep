import React, { useState } from 'react';
import {
  Camera,
  Upload,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck,
  X,
  Compass,
} from 'lucide-react';
import { PlantAdoption, SpaceProfile } from '../../types';

interface PlantSetupJourneyModalProps {
  adoption: PlantAdoption;
  space: SpaceProfile;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSetup: (adoptionId: string, photoBase64?: string, notes?: string) => Promise<void>;
}

export const PlantSetupJourneyModal: React.FC<PlantSetupJourneyModalProps> = ({
  adoption,
  space,
  isOpen,
  onClose,
  onConfirmSetup,
}) => {
  const [setupPhoto, setSetupPhoto] = useState<string | null>(null);
  const [setupNotes, setSetupNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState<1 | 2>(1);

  if (!isOpen) return null;

  const targetZone = space.zones.find((z) => z.id === adoption.zoneId) || space.zones[0];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSetupPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCompleteSetup = async () => {
    setIsSubmitting(true);
    try {
      await onConfirmSetup(adoption.id, setupPhoto || undefined, setupNotes);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div
        id="plant-setup-journey-modal"
        className="bg-slate-900 border border-emerald-800/80 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-900/60 border border-emerald-700/50 rounded-xl text-emerald-400">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Day 1 Setup Journey
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-700/60 text-[10px] font-bold text-emerald-300">
                  +20 Points
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-0.5">
                Welcome {adoption.nickname} Home
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveStep(1)}
            className={`flex items-center gap-2 pb-2 border-b-2 transition-all ${
              activeStep === 1
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-emerald-900/80 text-emerald-300 flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Placement & Light Check</span>
          </button>
          <button
            onClick={() => setActiveStep(2)}
            className={`flex items-center gap-2 pb-2 border-b-2 transition-all ${
              activeStep === 2
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-emerald-900/80 text-emerald-300 flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Setup Photograph & Notes</span>
          </button>
        </div>

        {/* Step 1: Placement Guide */}
        {activeStep === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Optimal Placement Target: {targetZone?.name || 'Selected Growth Zone'}</span>
              </h4>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Light Requirement:</strong> {targetZone?.lightLevel?.replace('_', ' ') || 'Bright indirect'} light exposure.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Elevation:</strong> Keep pot 6-12 inches off drafty floor vents or cold drafts.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Drainage:</strong> Ensure the nursery pot sits in a saucer with drainage holes to avoid standing water.
                  </span>
                </li>
              </ul>
            </div>

            {/* LittleStep Principle Reminder */}
            <div className="p-4 bg-emerald-950/40 border border-emerald-800/40 rounded-xl flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                <strong>Mindful Habit:</strong> Your plant will spend the next 7 days acclimating to its new environment. Resist the urge to over-water during this transition.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                id="next-step-photo-btn"
                onClick={() => setActiveStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all"
              >
                <span>Continue to Photo Verification</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Setup Photo & Confirmation */}
        {activeStep === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Capture / Upload Baseline Setup Photograph (Optional)
              </label>
              <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl p-4 text-center transition-colors bg-slate-950/40">
                {setupPhoto ? (
                  <div className="space-y-3">
                    <img
                      src={setupPhoto}
                      alt="Plant Setup"
                      className="max-h-48 mx-auto rounded-lg object-cover border border-slate-700"
                    />
                    <button
                      onClick={() => setSetupPhoto(null)}
                      className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                    >
                      Remove and Retake
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 py-4">
                    <div className="flex justify-center gap-3 text-slate-400">
                      <Camera className="w-8 h-8 text-emerald-400" />
                      <Upload className="w-8 h-8 text-teal-400" />
                    </div>
                    <p className="text-xs text-slate-300 font-medium">
                      Take a photo of {adoption.nickname} placed in its new spot
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Establishes visual baseline for future AI health diagnostics
                    </p>
                    <label className="inline-block mt-2 cursor-pointer">
                      <span className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors">
                        Browse Photo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Setup Notes / Initial Observation
              </label>
              <textarea
                value={setupNotes}
                onChange={(e) => setSetupNotes(e.target.value)}
                placeholder="e.g., Placed on east-facing windowsill. Soil is lightly moist from nursery."
                rows={2}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Milestones Preview */}
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
              <h5 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Upcoming LittleStep Milestones</span>
              </h5>
              <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-300">
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="font-bold text-emerald-400">Day 1</span>
                  <p className="text-slate-400 truncate">Setup Completed</p>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="font-bold text-teal-400">Day 7</span>
                  <p className="text-slate-400 truncate">Acclimation Check</p>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="font-bold text-amber-400">Day 30</span>
                  <p className="text-slate-400 truncate">Root Establishment</p>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={() => setActiveStep(1)}
                className="text-xs text-slate-400 hover:text-white font-medium"
              >
                Back to Guidelines
              </button>
              <button
                id="confirm-setup-complete-btn"
                onClick={handleCompleteSetup}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-md transition-all disabled:opacity-50"
              >
                <Award className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving...' : 'Confirm Setup (+20 Pts)'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
