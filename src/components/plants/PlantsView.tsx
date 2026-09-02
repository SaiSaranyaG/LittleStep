import React, { useState, useRef } from 'react';
import {
  HeartHandshake,
  Sprout,
  Calendar,
  Sparkles,
  Camera,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Droplet,
  Sun,
  ShieldAlert,
  HelpCircle,
  Plus,
  Flame,
  Award,
  ChevronRight,
  Info,
  Check,
  Stethoscope,
  Compass,
  CheckSquare,
  ArrowLeftRight,
  Trash2,
  Edit3,
  Eye,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { PlantSpecies, PlantAdoption, SpaceZone, PlantHealthStatus, HealthDiagnostic } from '../../types';
import { PlantRecommendationHero } from './PlantRecommendationHero';
import { PlantSetupJourneyModal } from './PlantSetupJourneyModal';
import { PlantExplanationModal } from './PlantExplanationModal';
import { PlantHealthCheckModal } from './PlantHealthCheckModal';
import { PlantHealthComparisonModal } from './PlantHealthComparisonModal';

export const PlantsView: React.FC = () => {
  const {
    plantCatalog,
    adoptions,
    activePlant,
    setActivePlant,
    adoptPlant,
    confirmPlantSetup,
    explainPlantRecommendation,
    careTasks,
    completeCareTask,
    activeSpace,
    runHealthCheck,
    isAnalyzingHealth,
    diagnostics,
    deleteHealthObservation,
    updateHealthObservationNotes,
    resolvePlantRecovery,
    recommendation,
    isLoadingRecommendation,
    refreshRecommendation,
    userPreferences,
    setUserPreferences,
  } = useApp();
  const { user, openAuthGate } = useAuth();

  const healthFileInputRef = useRef<HTMLInputElement>(null);
  const [isAdoptModalOpen, setIsAdoptModalOpen] = useState(false);
  const [modalCategoryFilter, setModalCategoryFilter] = useState<'all' | 'flowering' | 'herb_edible' | 'foliage' | 'succulent_cactus'>('all');
  const [selectedSpecies, setSelectedSpecies] = useState<PlantSpecies>(plantCatalog[0]);
  const [customNickname, setCustomNickname] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState<string>(activeSpace.zones[0]?.id || 'zone-1');
  const [healthNotes, setHealthNotes] = useState('');
  const [activeTabSub, setActiveTabSub] = useState<'profile' | 'milestones' | 'care_tasks' | 'health_camera' | 'gallery'>('profile');

  // Interactive Modals
  const [setupModalPlant, setSetupModalPlant] = useState<PlantAdoption | null>(null);
  const [explanationTarget, setExplanationTarget] = useState<{
    species: PlantSpecies;
    zone: SpaceZone;
  } | null>(null);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [editingObservationId, setEditingObservationId] = useState<string | null>(null);
  const [editNotesDraft, setEditNotesDraft] = useState('');

  // Sample quick leaf diagnostic photos for testing without uploading personal files
  const sampleHealthPhotos = [
    {
      name: 'Lower Leaf Yellowing (Chlorosis)',
      url: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?auto=format&fit=crop&w=600&q=80',
      notes: 'Noticed slight yellowing on bottom leaves over the last 3 days.',
    },
    {
      name: 'Dry Soil & Leaf Droop',
      url: 'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=600&q=80',
      notes: 'Soil surface is bone dry and leaves have lost tension.',
    },
    {
      name: 'Vibrant Thriving Shoot',
      url: 'https://images.unsplash.com/photo-1572688484438-313a6e50c333?auto=format&fit=crop&w=600&q=80',
      notes: 'New foliage unfurling, checking baseline vitality.',
    },
  ];

  const handleHealthPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activePlant) return;

    if (!user) {
      openAuthGate({
        actionType: 'plant_health',
        title: 'Sign In for Leaf Doctor AI Diagnostic',
        message: 'To analyze leaf symptoms, identify chlorosis or fungal issues, and receive organic treatment recipes, please sign in or create an account.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      await runHealthCheck(activePlant.id, base64, healthNotes);
      setActiveTabSub('health_camera');
    };
    reader.readAsDataURL(file);
  };

  const handleSampleHealthDiagnostic = async (sample: (typeof sampleHealthPhotos)[0]) => {
    if (!activePlant) return;

    if (!user) {
      openAuthGate({
        actionType: 'plant_health',
        title: 'Sign In for Leaf Doctor AI Diagnostic',
        message: 'To analyze leaf symptoms, identify chlorosis or fungal issues, and receive organic treatment recipes, please sign in or create an account.',
      });
      return;
    }

    try {
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        await runHealthCheck(activePlant.id, base64, sample.notes);
        setActiveTabSub('health_camera');
      };
      reader.readAsDataURL(blob);
    } catch {
      await runHealthCheck(activePlant.id, sample.url, sample.notes);
      setActiveTabSub('health_camera');
    }
  };

  const handleAdoptFromRecommendation = async (species: PlantSpecies, zoneId: string) => {
    if (!user) {
      openAuthGate({
        actionType: 'adopt_plant',
        title: 'Sign In to Adopt a Plant Companion',
        message: 'Create a free account to track watering reminders, maintain streaks, and earn verified points.',
      });
      return;
    }

    const newAdopt = await adoptPlant(
      species.id,
      activeSpace.id,
      zoneId,
      species.commonName,
      recommendation?.recommendationId
    );
    // Immediately launch setup journey modal
    setSetupModalPlant(newAdopt);
  };

  const handleConfirmManualAdoption = async () => {
    if (!selectedSpecies) return;

    if (!user) {
      openAuthGate({
        actionType: 'adopt_plant',
        title: 'Sign In to Adopt a Plant Companion',
        message: 'Create a free account to track watering reminders, maintain streaks, and earn verified points.',
      });
      return;
    }

    const newAdopt = await adoptPlant(
      selectedSpecies.id,
      activeSpace.id,
      selectedZoneId,
      customNickname || selectedSpecies.commonName,
      recommendation?.recommendationId
    );
    setIsAdoptModalOpen(false);
    setCustomNickname('');
    setSetupModalPlant(newAdopt);
  };

  const currentPlantSpecies = plantCatalog.find((p) => p.id === activePlant?.speciesId) || plantCatalog[0];
  const plantCareTasks = careTasks.filter((t) => t.adoptionId === activePlant?.id);
  const plantDiagnostics = diagnostics.filter((d) => d.adoptionId === activePlant?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-emerald-900/40 p-6 rounded-2xl border border-emerald-800/60">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4" />
            <span>Sustainable Plant Parenting</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">Plant Companions & AI Health Triage</h1>
          <p className="text-emerald-200/80 text-sm mt-1">
            Care for matched species, log maintenance tasks, and unlock long-term growth milestones.
          </p>
        </div>

        <button
          id="open-adopt-modal-btn"
          onClick={() => setIsAdoptModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-emerald-950 font-bold text-sm shadow-md transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Browse Full Catalog</span>
        </button>
      </div>

      {/* AI Recommendation Hero (Primary 1-Plant Adoption Focus & Gatekeeper) */}
      <PlantRecommendationHero
        recommendation={recommendation}
        isLoading={isLoadingRecommendation}
        onAdopt={handleAdoptFromRecommendation}
        onExplainRecommendation={(species, zone) => setExplanationTarget({ species, zone })}
        userPreferences={userPreferences}
        onUpdatePreferences={setUserPreferences}
        onRefresh={() => refreshRecommendation()}
        targetZone={activeSpace.zones[0]}
      />

      {/* Main Grid: Plant List (Left) + Detail & Diagnostic Hub (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Adopted Plant List (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>Adopted Companions ({adoptions.length})</span>
            </h2>
            <span className="text-xs text-emerald-300/80">Space: {activeSpace.name}</span>
          </div>

          <div className="space-y-3">
            {adoptions.map((plant) => {
              const species = plantCatalog.find((p) => p.id === plant.speciesId) || plantCatalog[0];
              const isSelected = activePlant?.id === plant.id;
              const isThriving = plant.healthStatus === 'thriving' || plant.healthStatus === 'healthy';

              return (
                <div
                  key={plant.id}
                  id={`plant-item-${plant.id}`}
                  onClick={() => setActivePlant(plant)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                    isSelected
                      ? 'bg-emerald-900/80 border-emerald-500 shadow-lg ring-1 ring-emerald-500/50'
                      : 'bg-emerald-950/60 border-emerald-800/60 hover:bg-emerald-900/50'
                  }`}
                >
                  <img
                    src={species.imageUrl}
                    alt={plant.nickname}
                    className="w-14 h-14 rounded-xl object-cover border border-emerald-700/60 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-sm font-bold text-white truncate">{plant.nickname}</h3>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          isThriving ? 'bg-emerald-800/80 text-emerald-200' : 'bg-amber-800/80 text-amber-200'
                        }`}
                      >
                        {plant.healthStatus.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-300/70 truncate">{species.commonName}</p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-emerald-200/90 font-medium">
                      <div className="flex items-center gap-1 text-amber-300">
                        <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{plant.streakDays}d streak</span>
                      </div>
                      <span className="text-emerald-500">•</span>
                      <span>Day {plant.totalSurvivalDays}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Plant Profile, Milestones, Care & Multimodal Health Camera (8 Cols) */}
        {activePlant ? (
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-emerald-950/70 rounded-2xl border border-emerald-800/60 overflow-hidden">
              {/* Plant Detail Hero Header */}
              <div className="p-6 bg-gradient-to-r from-emerald-900/90 to-emerald-950/80 border-b border-emerald-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={currentPlantSpecies.imageUrl}
                    alt={activePlant.nickname}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600/70 shadow"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">{activePlant.nickname}</h2>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-800 text-emerald-200 font-mono">
                        {currentPlantSpecies.scientificName}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-300/80 mt-0.5">
                      Adopted on {new Date(activePlant.adoptedAt).toLocaleDateString()} • Placed in{' '}
                      {activeSpace.zones.find((z) => z.id === activePlant.zoneId)?.name || 'Plant Zone'}
                    </p>
                  </div>
                </div>

                {/* Setup & Streak Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    id="verify-setup-cta-btn"
                    onClick={() => setSetupModalPlant(activePlant)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-emerald-700/60 text-xs font-semibold text-emerald-300 transition-colors"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Setup Journey</span>
                  </button>

                  <div className="text-right pl-2 border-l border-emerald-800/60">
                    <div className="text-[11px] text-emerald-400 font-medium">Care Streak</div>
                    <div className="text-base font-bold text-amber-300 flex items-center justify-end gap-1">
                      <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span>{activePlant.streakDays} Days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-Navigation Tabs */}
              <div className="flex items-center px-6 border-b border-emerald-800/40 gap-4 overflow-x-auto">
                {[
                  { id: 'profile', label: 'Overview & Science' },
                  { id: 'milestones', label: 'Survival Milestones' },
                  { id: 'care_tasks', label: `Care Tasks (${plantCareTasks.filter((t) => !t.isCompleted).length})` },
                  { id: 'health_camera', label: 'AI Health Triage Camera' },
                  { id: 'gallery', label: `Photos (${activePlant.photos.length})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    id={`plant-subtab-${tab.id}`}
                    onClick={() => setActiveTabSub(tab.id as any)}
                    className={`py-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                      activeTabSub === tab.id
                        ? 'border-emerald-400 text-emerald-300'
                        : 'border-transparent text-emerald-400/70 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Overview & Scientific Fact Sheet */}
              {activeTabSub === 'profile' && (
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-800/50 space-y-1">
                      <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                        <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Hydration Interval</span>
                      </span>
                      <p className="text-base font-bold text-white">Every {currentPlantSpecies.waterFrequencyDays} Days</p>
                      <p className="text-[11px] text-emerald-300/70">Allow topsoil to dry before watering</p>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-800/50 space-y-1">
                      <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>Light Requirement</span>
                      </span>
                      <p className="text-base font-bold text-white capitalize">
                        {currentPlantSpecies.lightRequirement.replace('_', ' ')}
                      </p>
                      <p className="text-[11px] text-emerald-300/70">Matched to current zone exposure</p>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-800/50 space-y-1">
                      <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-teal-400" />
                        <span>Care Difficulty</span>
                      </span>
                      <p className="text-base font-bold text-white capitalize">{currentPlantSpecies.difficulty}</p>
                      <p className="text-[11px] text-emerald-300/70">
                        {currentPlantSpecies.petSafe ? '🐾 Pet Friendly' : '⚠️ Keep Away From Pets'}
                      </p>
                    </div>
                  </div>

                  {/* Scientific Fact Sheet */}
                  <div className="p-5 rounded-2xl bg-emerald-900/30 border border-emerald-800/60 space-y-3">
                    <h4 className="text-sm font-bold text-emerald-200 flex items-center gap-2">
                      <Info className="w-4 h-4 text-emerald-400" />
                      <span>Scientific Botanical Fact Sheet</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-emerald-400 font-semibold">Natural Biome:</span>
                        <p className="text-emerald-100/90 mt-0.5">
                          {currentPlantSpecies.scientificFactSheet.naturalHabitat}
                        </p>
                      </div>
                      <div>
                        <span className="text-emerald-400 font-semibold">Transpiration Buffer Rate:</span>
                        <p className="text-emerald-100/90 mt-0.5 capitalize">
                          {currentPlantSpecies.scientificFactSheet.transpirationRate} (Localized microclimate)
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-emerald-400 font-semibold">Physiological Resilience:</span>
                        <p className="text-emerald-100/90 mt-0.5">
                          {currentPlantSpecies.scientificFactSheet.resilienceNote}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Survival Milestones Journey */}
              {activeTabSub === 'milestones' && (
                <div className="p-6 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Survival & Growth Milestones</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Progress through time-tested care intervals to earn badges and verified points.
                      </p>
                    </div>
                    <span className="text-xs px-3 py-1 bg-emerald-900/60 border border-emerald-700/50 rounded-full font-bold text-emerald-300">
                      Day {activePlant.totalSurvivalDays} Milestone
                    </span>
                  </div>

                  <div className="space-y-3">
                    {(activePlant.milestones || []).map((m) => {
                      const isReached = activePlant.totalSurvivalDays >= m.day;
                      return (
                        <div
                          key={m.day}
                          className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-all ${
                            isReached
                              ? 'bg-emerald-950/60 border-emerald-700/80 shadow'
                              : 'bg-slate-950/40 border-slate-800 opacity-60'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-xl mt-0.5 ${
                                isReached
                                  ? 'bg-emerald-900/80 text-emerald-400'
                                  : 'bg-slate-900 text-slate-600'
                              }`}
                            >
                              <Award className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white">{m.title}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 font-mono">
                                  +{m.pointsAwarded} pts
                                </span>
                              </div>
                              <p className="text-xs text-slate-300">{m.description}</p>
                              <p className="text-[11px] text-slate-400">
                                <strong>Action: </strong> {m.actionRequired}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            {isReached ? (
                              <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-700/50">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Unlocked</span>
                              </span>
                            ) : (
                              <span className="text-xs text-slate-500 font-medium">
                                In {m.day - activePlant.totalSurvivalDays} days
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 3: Care Tasks & Scheduler */}
              {activeTabSub === 'care_tasks' && (
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Scheduled Maintenance for {activePlant.nickname}</h3>
                    <span className="text-xs text-emerald-300 font-medium">Earn +2 pts per task</span>
                  </div>

                  <div className="space-y-3">
                    {plantCareTasks.map((task) => (
                      <div
                        key={task.id}
                        id={`care-task-${task.id}`}
                        className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                          task.isCompleted
                            ? 'bg-emerald-950/40 border-emerald-900/50 opacity-70'
                            : 'bg-emerald-900/50 border-emerald-700/60 hover:border-emerald-500'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-semibold ${
                                task.isCompleted ? 'line-through text-emerald-400/60' : 'text-white'
                              }`}
                            >
                              {task.title}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-800 text-emerald-300 font-mono">
                              +{task.pointsValue} pts
                            </span>
                          </div>
                          <p className="text-xs text-emerald-300/80">{task.notes}</p>
                          <p className="text-[11px] text-emerald-400/60">
                            Due: {new Date(task.dueAt).toLocaleDateString()}
                          </p>
                        </div>

                        {task.isCompleted ? (
                          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold px-3 py-1.5 rounded-lg bg-emerald-900/80">
                            <Check className="w-4 h-4" />
                            <span>Done</span>
                          </span>
                        ) : (
                          <button
                            id={`complete-task-btn-${task.id}`}
                            onClick={() => completeCareTask(task.id)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs shadow transition-colors"
                          >
                            <Check className="w-4 h-4" />
                            <span>Log & Water (+2 pts)</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Multimodal Health Camera Triage */}
              {activeTabSub === 'health_camera' && (
                <div className="p-6 space-y-6">
                  {/* Top Header & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/90 to-slate-900 border border-emerald-800/70 shadow-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-emerald-900/80 text-emerald-400 border border-emerald-700/60">
                          <Stethoscope className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-white">AI Plant Health & Visual Check</h3>
                      </div>
                      <p className="text-xs text-slate-300">
                        Upload or capture a photo of {activePlant.nickname} for cautious, multimodal visual health assessment.
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        id="compare-photos-btn"
                        onClick={() => setIsComparisonModalOpen(true)}
                        className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
                      >
                        <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Compare Photos</span>
                      </button>

                      <button
                        id="open-health-check-btn"
                        onClick={() => setIsHealthModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02]"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Check Plant Health (+5 pts)</span>
                      </button>
                    </div>
                  </div>

                  {/* Latest Health Diagnostic Summary Card */}
                  {plantDiagnostics.length > 0 ? (
                    <div className="space-y-4">
                      {(() => {
                        const latest = plantDiagnostics[0];
                        const isHealthy = latest.healthStatus === 'healthy' || latest.healthStatus === 'thriving';
                        const isWatch = latest.healthStatus === 'watch';
                        const isNeedsAttention = latest.healthStatus === 'needs_attention' || latest.healthStatus === 'critical';

                        return (
                          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                              <div className="flex items-center gap-2.5">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                                    isHealthy
                                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                                      : isWatch
                                      ? 'bg-amber-950/80 text-amber-300 border border-amber-700/60'
                                      : isNeedsAttention
                                      ? 'bg-orange-950/80 text-orange-300 border border-orange-700/60'
                                      : 'bg-slate-900 text-slate-300 border border-slate-700'
                                  }`}
                                >
                                  {isHealthy && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                                  {isWatch && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                                  {isNeedsAttention && <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />}
                                  <span>
                                    {latest.healthStatus === 'healthy' || latest.healthStatus === 'thriving'
                                      ? 'LOOKS HEALTHY'
                                      : latest.healthStatus.replace('_', ' ')}
                                  </span>
                                </span>

                                <span className="text-[11px] text-slate-400 font-medium">
                                  {latest.confidenceLevel?.toUpperCase() || 'MODERATE'} CONFIDENCE
                                </span>
                              </div>

                              <span className="text-xs text-slate-500">
                                Checked {new Date(latest.timestamp).toLocaleDateString()} at {new Date(latest.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            {/* Observed & Potential Causes Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              {/* Observed Section */}
                              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2">
                                <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Observed Visual Signs</span>
                                </div>
                                <ul className="space-y-1 text-slate-300">
                                  {latest.visualSymptoms.map((s, idx) => (
                                    <li key={idx} className="flex items-start gap-1.5">
                                      <span className="text-emerald-400 font-bold">•</span>
                                      <span>{s}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Possible Factors */}
                              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2">
                                <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  <span>Possible Contributing Factors</span>
                                </div>
                                <div className="space-y-1.5">
                                  {latest.possibleCauses.map((c, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-[11px]">
                                      <span className="text-slate-200 font-medium">{c.cause}</span>
                                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                                        {c.likelihood}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Recommended LittleSteps */}
                            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 space-y-2">
                              <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Recommended Actions</span>
                              </div>
                              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                                {latest.recommendedActionPlan}
                              </p>
                            </div>

                            {/* Recovery Milestone Action (If previously stressed/watch) */}
                            {latest.healthStatus !== 'healthy' && latest.healthStatus !== 'thriving' && (
                              <div className="p-4 rounded-xl bg-gradient-to-r from-teal-950/60 to-emerald-950/60 border border-teal-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                  <p className="text-xs font-bold text-teal-300">Resolved Symptoms or Improved Condition?</p>
                                  <p className="text-[11px] text-slate-400">
                                    Mark this plant restored to healthy status to claim the Plant Recovery Milestone (+50 pts).
                                  </p>
                                </div>
                                <button
                                  id={`resolve-recovery-${latest.id}`}
                                  onClick={() => resolvePlantRecovery(latest.id, activePlant.id)}
                                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs whitespace-nowrap shadow transition-colors"
                                >
                                  Mark Plant Recovered (+50 pts)
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* Health Observation History */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Health Observation History ({plantDiagnostics.length})
                          </h4>
                          <span className="text-[11px] text-slate-500">Multimodal Audit Trail</span>
                        </div>

                        <div className="space-y-2">
                          {plantDiagnostics.map((item) => (
                            <div
                              key={item.id}
                              className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 shrink-0">
                                  <img
                                    src={item.photoUrl}
                                    alt="Health inspection"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-white capitalize">
                                      {item.healthStatus.replace('_', ' ')}
                                    </span>
                                    <span className="text-[10px] text-slate-500">
                                      {new Date(item.timestamp).toLocaleDateString()}
                                    </span>
                                  </div>

                                  {editingObservationId === item.id ? (
                                    <div className="flex items-center gap-2 pt-1">
                                      <input
                                        type="text"
                                        value={editNotesDraft}
                                        onChange={(e) => setEditNotesDraft(e.target.value)}
                                        className="bg-slate-900 border border-slate-700 text-xs text-white rounded px-2 py-0.5"
                                        placeholder="Edit observation notes..."
                                      />
                                      <button
                                        onClick={() => {
                                          updateHealthObservationNotes(item.id, editNotesDraft);
                                          setEditingObservationId(null);
                                        }}
                                        className="text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-0.5 rounded"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingObservationId(null)}
                                        className="text-[10px] text-slate-400 hover:text-white"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <p className="text-[11px] text-slate-400 line-clamp-1">
                                      {item.userNotes ? `"${item.userNotes}" — ` : ''}
                                      {item.visualSymptoms.join(', ') || item.recommendedActionPlan}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 self-end sm:self-center">
                                <button
                                  onClick={() => {
                                    setEditingObservationId(item.id);
                                    setEditNotesDraft(item.userNotes || '');
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
                                  title="Edit notes"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => deleteHealthObservation(item.id)}
                                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors"
                                  title="Delete observation"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-slate-800 space-y-3">
                      <Stethoscope className="w-10 h-10 text-emerald-400/80 mx-auto" />
                      <h4 className="text-sm font-bold text-white">No Health Checks Yet</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Take your first health photo of {activePlant.nickname} to establish a visual baseline and earn +5 points.
                      </p>
                      <button
                        onClick={() => setIsHealthModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow inline-flex items-center gap-1.5"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Perform First Health Check</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 5: Progress Photo Gallery */}
              {activeTabSub === 'gallery' && (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {activePlant.photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="rounded-xl overflow-hidden border border-emerald-800/60 bg-emerald-950/80"
                      >
                        <img src={photo.url} alt={photo.caption} className="w-full h-36 object-cover" />
                        <div className="p-2 text-[11px]">
                          <p className="font-semibold text-white truncate">{photo.caption || 'Progress snapshot'}</p>
                          <p className="text-emerald-400/70 text-[10px]">
                            {new Date(photo.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 flex flex-col items-center justify-center p-12 bg-emerald-950/40 rounded-2xl border border-emerald-800/50 text-center">
            <Sprout className="w-12 h-12 text-emerald-400 mb-3" />
            <h3 className="text-lg font-bold text-white">No Plant Selected</h3>
            <p className="text-xs text-emerald-300/80 max-w-sm mt-1">
              Select an adopted companion from the left or adopt a new plant matched to your spatial zones.
            </p>
          </div>
        )}
      </div>

      {/* Full Catalog Adoption Modal */}
      {isAdoptModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-emerald-950 border border-emerald-700/80 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-emerald-800/50 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-emerald-400" />
                  <span>Adopt a Sustainable Companion</span>
                </h3>
                <p className="text-xs text-emerald-300/80 mt-0.5">
                  Select a species matched to your available light zone and space capacity.
                </p>
              </div>
              <button
                onClick={() => setIsAdoptModalOpen(false)}
                className="text-emerald-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Plants', emoji: '✨' },
                { id: 'flowering', label: 'Flowers & Blooms', emoji: '🌸' },
                { id: 'herb_edible', label: 'Veggies & Herbs', emoji: '🍅' },
                { id: 'foliage', label: 'Decorative Foliage', emoji: '🌿' },
                { id: 'succulent_cactus', label: 'Succulents & Cacti', emoji: '🌵' },
              ].map((tab) => {
                const isCurrent = modalCategoryFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setModalCategoryFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isCurrent
                        ? 'bg-emerald-500 text-emerald-950 border-emerald-400 font-bold shadow'
                        : 'bg-emerald-900/40 border-emerald-800/80 text-emerald-300 hover:bg-emerald-900/80 hover:text-white'
                    }`}
                  >
                    <span>{tab.emoji}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {plantCatalog
                .filter((p) => {
                  if (modalCategoryFilter === 'all') return true;
                  if (modalCategoryFilter === 'foliage') {
                    return p.plantCategory === 'foliage' || p.plantCategory === 'climbing_vine' || p.plantCategory === 'fern';
                  }
                  return p.plantCategory === modalCategoryFilter;
                })
                .map((p) => {
                  const isSelected = selectedSpecies.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedSpecies(p)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center gap-2 ${
                        isSelected
                          ? 'bg-emerald-900 border-emerald-400 ring-2 ring-emerald-400/50'
                          : 'bg-emerald-900/30 border-emerald-800/60 hover:bg-emerald-900/60'
                      }`}
                    >
                      <img src={p.imageUrl} alt={p.commonName} className="w-16 h-16 rounded-lg object-cover" />
                      <div>
                        <p className="text-xs font-bold text-white line-clamp-1">{p.commonName}</p>
                        <p className="text-[10px] text-emerald-300/70 capitalize">{p.lightRequirement.replace('_', ' ')}</p>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Selected Species Form */}
            <div className="space-y-4 pt-2 border-t border-emerald-800/40">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-emerald-300 font-medium block mb-1">Companion Nickname</label>
                  <input
                    id="adopt-nickname-input"
                    type="text"
                    placeholder={`e.g. ${selectedSpecies.commonName.split(' ')[0]}`}
                    value={customNickname}
                    onChange={(e) => setCustomNickname(e.target.value)}
                    className="w-full bg-emerald-900/80 border border-emerald-700/60 text-emerald-100 text-sm rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-xs text-emerald-300 font-medium block mb-1">Target Zone Placement</label>
                  <select
                    id="adopt-zone-select"
                    value={selectedZoneId}
                    onChange={(e) => setSelectedZoneId(e.target.value)}
                    className="w-full bg-emerald-900/80 border border-emerald-700/60 text-emerald-100 text-sm rounded-xl px-3 py-2"
                  >
                    {activeSpace.zones
                      .filter((z) => z.zoneType === 'plant_zone')
                      .map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name} ({z.lightLevel.replace('_', ' ')})
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsAdoptModalOpen(false)}
                className="px-4 py-2 text-xs text-emerald-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                id="confirm-adoption-btn"
                onClick={handleConfirmManualAdoption}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm shadow transition-colors"
              >
                Confirm Adoption (+10 pts)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Setup Journey Modal (Triggered immediately on adoption) */}
      {setupModalPlant && (
        <PlantSetupJourneyModal
          adoption={setupModalPlant}
          space={activeSpace}
          isOpen={Boolean(setupModalPlant)}
          onClose={() => setSetupModalPlant(null)}
          onConfirmSetup={confirmPlantSetup}
        />
      )}

      {/* AI Explanation Modal */}
      {explanationTarget && (
        <PlantExplanationModal
          species={explanationTarget.species}
          zone={explanationTarget.zone}
          isOpen={Boolean(explanationTarget)}
          onClose={() => setExplanationTarget(null)}
          onAskAi={(q) => explainPlantRecommendation(explanationTarget.species, explanationTarget.zone, q)}
        />
      )}

      {/* AI Plant Health Diagnostic Modal */}
      {activePlant && isHealthModalOpen && (
        <PlantHealthCheckModal
          plant={activePlant}
          species={currentPlantSpecies}
          isOpen={isHealthModalOpen}
          onClose={() => setIsHealthModalOpen(false)}
        />
      )}

      {/* Plant Photo Before & After Comparison Modal */}
      {activePlant && isComparisonModalOpen && (
        <PlantHealthComparisonModal
          plant={activePlant}
          diagnostics={plantDiagnostics}
          isOpen={isComparisonModalOpen}
          onClose={() => setIsComparisonModalOpen(false)}
        />
      )}
    </div>
  );
};
