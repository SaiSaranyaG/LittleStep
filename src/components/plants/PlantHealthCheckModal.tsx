import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Stethoscope,
  Sparkles,
  Info,
  ShieldAlert,
  ArrowRight,
  Sun,
  Droplet,
  Compass,
  FileText,
  Clock,
  Eye,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PlantAdoption, PlantSpecies, HealthDiagnostic, PlantHealthStatus, HealthConfidence } from '../../types';

interface PlantHealthCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  plant: PlantAdoption;
  species: PlantSpecies;
  onDiagnosticComplete?: (diag: HealthDiagnostic) => void;
}

export const PlantHealthCheckModal: React.FC<PlantHealthCheckModalProps> = ({
  isOpen,
  onClose,
  plant,
  species,
  onDiagnosticComplete,
}) => {
  const { runHealthCheck, isAnalyzingHealth, activeSpace } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<'upload' | 'analyzing' | 'result'>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userNotes, setUserNotes] = useState('');
  const [currentResult, setCurrentResult] = useState<HealthDiagnostic | null>(null);

  // Pre-configured sample plant photographs for quick evaluation
  const sampleScenarios = [
    {
      name: 'Foliage Chlorosis (Yellowing)',
      url: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?auto=format&fit=crop&w=600&q=80',
      notes: 'Noticed slight pale yellowing on bottom leaves over the last 3 days.',
      hint: 'Simulates lower-canopy nutrient & moisture cycling check',
    },
    {
      name: 'Moisture Drought & Droop',
      url: 'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=600&q=80',
      notes: 'Soil surface is dry and leaves have lost tension.',
      hint: 'Simulates dry-cycle evaluation and hydration advice',
    },
    {
      name: 'Vibrant Thriving Canopy',
      url: 'https://images.unsplash.com/photo-1572688484438-313a6e50c333?auto=format&fit=crop&w=600&q=80',
      notes: 'New foliage unfurling, checking baseline vitality.',
      hint: 'Simulates routine healthy check-in',
    },
  ];

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: (typeof sampleScenarios)[0]) => {
    setSelectedImage(sample.url);
    if (!userNotes) {
      setUserNotes(sample.notes);
    }
  };

  const handleStartAnalysis = async () => {
    if (!selectedImage) return;
    setStep('analyzing');

    try {
      let imagePayload = selectedImage;
      if (selectedImage.startsWith('http')) {
        // Convert remote URL to base64 for API if needed
        try {
          const res = await fetch(selectedImage);
          const blob = await res.blob();
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve) => {
            reader.onload = () => resolve(reader.result as string);
          });
          reader.readAsDataURL(blob);
          imagePayload = await base64Promise;
        } catch {
          imagePayload = selectedImage;
        }
      }

      const diag = await runHealthCheck(plant.id, imagePayload, userNotes);
      setCurrentResult(diag);
      setStep('result');
      if (onDiagnosticComplete) onDiagnosticComplete(diag);
    } catch (err) {
      console.error('Health check failed', err);
      setStep('upload');
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setUserNotes('');
    setCurrentResult(null);
    setStep('upload');
  };

  const getStatusBadge = (status: PlantHealthStatus) => {
    switch (status) {
      case 'healthy':
      case 'thriving':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
          title: 'LOOKS HEALTHY',
          subtext: 'Foliage and posture show positive vitality',
          bg: 'bg-emerald-950/80 border-emerald-600/60 text-emerald-300',
        };
      case 'watch':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
          title: 'WATCH',
          subtext: 'Minor visual signs detected; monitor routine conditions',
          bg: 'bg-amber-950/80 border-amber-600/60 text-amber-300',
        };
      case 'needs_attention':
      case 'critical':
        return {
          icon: <ShieldAlert className="w-5 h-5 text-orange-400" />,
          title: 'NEEDS ATTENTION',
          subtext: 'Visual symptoms suggest reviewing soil moisture or light',
          bg: 'bg-orange-950/80 border-orange-600/60 text-orange-300',
        };
      case 'inconclusive':
      default:
        return {
          icon: <HelpCircle className="w-5 h-5 text-slate-400" />,
          title: 'INCONCLUSIVE',
          subtext: 'Photo detail insufficient to assess condition with certainty',
          bg: 'bg-slate-900 border-slate-700 text-slate-300',
        };
    }
  };

  const getConfidenceBadge = (confidence?: HealthConfidence) => {
    const level = confidence || 'medium';
    switch (level) {
      case 'high':
        return {
          label: 'High Confidence',
          desc: 'Clear visual cues observed',
          color: 'text-emerald-400 bg-emerald-950/60 border-emerald-700/50',
        };
      case 'medium':
        return {
          label: 'Moderate Confidence',
          desc: 'Good visual assessment',
          color: 'text-amber-300 bg-amber-950/60 border-amber-700/50',
        };
      case 'low':
      default:
        return {
          label: 'Low Confidence',
          desc: 'Advisory visual guidance',
          color: 'text-slate-400 bg-slate-900 border-slate-700',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-emerald-800/80 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-slate-800 p-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-900/60 text-emerald-400 border border-emerald-700/50">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Check Plant Health</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-300 font-medium">
                  {plant.nickname}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                AI Multimodal Visual Triage • {species.commonName} ({species.scientificName})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* STEP 1: Upload & Photo Selection */}
          {step === 'upload' && (
            <div className="space-y-6">
              {/* Photo Tips Guidance */}
              <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-800/60 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Tips for a Reliable Visual Check</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <Camera className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Include whole plant</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Use natural light</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Capture affected leaves</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Avoid blur & shadows</span>
                  </div>
                </div>
              </div>

              {/* Upload Drop Zone / Preview */}
              <div className="space-y-3">
                <input
                  type="file"
                  ref={cameraInputRef}
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />

                {selectedImage ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-600/70 bg-black/60 aspect-video max-h-64 flex items-center justify-center">
                    <img
                      src={selectedImage}
                      alt="Selected plant"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4 justify-between">
                      <span className="text-xs font-semibold text-white bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700">
                        📸 Photo Compressed & Ready for AI Inspection
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => cameraInputRef.current?.click()}
                          className="text-xs px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow flex items-center gap-1 cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Camera</span>
                        </button>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-600 cursor-pointer"
                        >
                          Gallery
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center bg-slate-950/40 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 text-emerald-400 border border-emerald-700/50 flex items-center justify-center mx-auto">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Capture or Upload Plant Photo</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Images are automatically compressed for 20x faster AI diagnosis
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto pt-1">
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-emerald-950 font-bold text-xs shadow flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="w-4 h-4 shrink-0" />
                        <span>Take Photo (Camera)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-4 h-4 shrink-0" />
                        <span>Upload (Gallery)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sample Scenarios for Testing */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400">Or simulate with verified diagnostic samples:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {sampleScenarios.map((sample) => (
                    <button
                      key={sample.name}
                      onClick={() => handleSelectSample(sample)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedImage === sample.url
                          ? 'bg-emerald-950/80 border-emerald-500 ring-1 ring-emerald-500'
                          : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <p className="text-xs font-bold text-white line-clamp-1">{sample.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{sample.hint}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* User Notes Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Add your observation notes (optional):</span>
                </label>
                <input
                  type="text"
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="e.g., Noticed yellowing leaves 2 days ago, moved near balcony window..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  id="start-health-analysis-btn"
                  disabled={!selectedImage || isAnalyzingHealth}
                  onClick={handleStartAnalysis}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start AI Visual Health Assessment (+5 pts)</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Analyzing Pulse */}
          {step === 'analyzing' && (
            <div className="py-12 text-center space-y-6 animate-fadeIn">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping" />
                <div className="relative w-20 h-20 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
                  <Stethoscope className="w-10 h-10 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">Analyzing Plant Photo</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  The Plant Health Agent is inspecting leaf color, posture, soil surface, and cross-referencing recent watering records in {activeSpace.name}...
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-emerald-400/80">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Applying non-definitive scientific assessment rules...</span>
              </div>
            </div>
          )}

          {/* STEP 3: Diagnostic Assessment Result */}
          {step === 'result' && currentResult && (
            <div className="space-y-6 animate-fadeIn">
              {/* Primary Status Banner */}
              {(() => {
                const statusInfo = getStatusBadge(currentResult.healthStatus);
                const confInfo = getConfidenceBadge(currentResult.confidenceLevel);
                return (
                  <div className={`p-5 rounded-2xl border ${statusInfo.bg} space-y-3`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {statusInfo.icon}
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider">
                            PLANT CHECK • {statusInfo.title}
                          </span>
                          <p className="text-xs text-slate-300 mt-0.5">{statusInfo.subtext}</p>
                        </div>
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${confInfo.color}`}>
                        {confInfo.label}
                      </span>
                    </div>

                    {/* Image Quality Indicator */}
                    {currentResult.imageQuality && (
                      <div className="flex items-center gap-2 pt-2 border-t border-white/10 text-[11px] text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>
                          <strong>Image Quality: </strong> {currentResult.imageQuality.feedback}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* 1. OBSERVED SECTION */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <Eye className="w-4 h-4" />
                  <span>WHAT I OBSERVE</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {currentResult.visualSymptoms.map((symptom, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 text-sm leading-none">•</span>
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2. POSSIBLE CONCERNS / CAUSES */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>POSSIBLE FACTORS & CONCERNS</span>
                </div>
                <div className="space-y-2">
                  {currentResult.possibleCauses.map((causeItem, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-white">{causeItem.cause}</span>
                        {causeItem.description && (
                          <p className="text-[11px] text-slate-400">{causeItem.description}</p>
                        )}
                      </div>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded shrink-0 ${
                          causeItem.likelihood === 'probable'
                            ? 'bg-amber-900/60 text-amber-300 border border-amber-700/50'
                            : causeItem.likelihood === 'possible'
                            ? 'bg-blue-900/60 text-blue-300 border border-blue-700/50'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {causeItem.likelihood}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. WHAT TO DO / RECOMMENDED ACTIONS */}
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>RECOMMENDED NEXT LITTLESTEPS</span>
                </div>
                <div className="space-y-2 text-xs text-slate-200">
                  {(currentResult.recommendedActions && currentResult.recommendedActions.length > 0
                    ? currentResult.recommendedActions
                    : currentResult.recommendedActionPlan.split('\n')
                  ).map((stepText, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-900 text-emerald-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{stepText.replace(/^[0-9]+\.\s*/, '')}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. CARE & SPACE CONTEXT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {currentResult.careHistoryContext && (
                  <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                      <Droplet className="w-3.5 h-3.5" />
                      <span>Care History Context</span>
                    </div>
                    <p className="text-[11px] text-slate-300">{currentResult.careHistoryContext}</p>
                  </div>
                )}
                {currentResult.spaceContextAdvice && (
                  <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                      <Sun className="w-3.5 h-3.5" />
                      <span>Space & Light Context</span>
                    </div>
                    <p className="text-[11px] text-slate-300">{currentResult.spaceContextAdvice}</p>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <p className="text-[10px] text-slate-500 leading-relaxed italic border-t border-slate-800 pt-3">
                ⚖️ <strong>Scientific Disclaimer: </strong>
                {currentResult.scientificDisclaimer}
              </p>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Check Another Photo
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Save to Plant Journey</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
