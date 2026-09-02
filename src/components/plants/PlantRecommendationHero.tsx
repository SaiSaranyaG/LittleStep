import React, { useState } from 'react';
import {
  Sparkles,
  ShieldAlert,
  HeartHandshake,
  ArrowRight,
  Sun,
  Droplet,
  ShieldCheck,
  Compass,
  AlertTriangle,
  Info,
  HelpCircle,
  SlidersHorizontal,
  ChevronDown,
  RefreshCw,
  Flower2,
  Salad,
  Trees,
  Gem,
  LayoutGrid,
} from 'lucide-react';
import { PlantSpecies, RecommendationResult, UserPlantPreferences, SpaceZone, PlantStyleCategory } from '../../types';
import { PlantSuitabilityScorecard } from './PlantSuitabilityScorecard';

interface PlantRecommendationHeroProps {
  recommendation: RecommendationResult | null;
  isLoading: boolean;
  onAdopt: (species: PlantSpecies, zoneId: string) => void;
  onExplainRecommendation: (species: PlantSpecies, zone: SpaceZone) => void;
  userPreferences: UserPlantPreferences;
  onUpdatePreferences: (prefs: UserPlantPreferences) => void;
  onRefresh: () => void;
  targetZone?: SpaceZone;
}

export const CATEGORY_OPTIONS: {
  id: PlantStyleCategory;
  label: string;
  shortLabel: string;
  emoji: string;
  desc: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'all',
    label: 'All Companions',
    shortLabel: 'All Matches',
    emoji: '✨',
    desc: 'Best biological fit for your scanned space',
    badge: 'Space Optimized',
    icon: LayoutGrid,
  },
  {
    id: 'flowering',
    label: 'Plants with Flowers',
    shortLabel: '🌸 Flowers & Blooms',
    emoji: '🌸',
    desc: 'Indoor flowering spathes, orchids & vibrant blossoms',
    badge: 'Flowering & Blooming',
    icon: Flower2,
  },
  {
    id: 'herbs_edible',
    label: 'Veggies & Herbs',
    shortLabel: '🍅 Veggies & Herbs',
    emoji: '🍅',
    desc: 'Culinary herbs, fresh tea leaves & patio edibles',
    badge: 'Edible & Culinary',
    icon: Salad,
  },
  {
    id: 'decorative',
    label: 'Decorative Live Plants',
    shortLabel: '🌿 Decorative Foliage',
    emoji: '🌿',
    desc: 'Architectural leaves, prayer plants & trailing vines',
    badge: 'Decorative Foliage',
    icon: Trees,
  },
  {
    id: 'succulent_cactus',
    label: 'Succulents & Cacti',
    shortLabel: '🌵 Succulents',
    emoji: '🌵',
    desc: 'Drought-hardy rosettes with minimal watering',
    badge: 'Low-Water Succulent',
    icon: Gem,
  },
];

export const PlantRecommendationHero: React.FC<PlantRecommendationHeroProps> = ({
  recommendation,
  isLoading,
  onAdopt,
  onExplainRecommendation,
  userPreferences,
  onUpdatePreferences,
  onRefresh,
  targetZone,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeAltIdx, setActiveAltIdx] = useState<number | null>(null);

  const handleCategorySelect = (categoryId: PlantStyleCategory) => {
    const updated = { ...userPreferences, plantStyle: categoryId };
    onUpdatePreferences(updated);
    // Reset alt selection when switching categories
    setActiveAltIdx(null);
    onRefresh();
  };

  if (isLoading) {
    return (
      <div className="p-8 bg-slate-900/80 border border-emerald-800/40 rounded-2xl animate-pulse space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-emerald-500/30" />
          <div className="h-4 bg-slate-800 rounded w-1/3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-48 bg-slate-800/60 rounded-xl" />
          <div className="md:col-span-2 space-y-3">
            <div className="h-6 bg-slate-800 rounded w-2/3" />
            <div className="h-4 bg-slate-800 rounded w-full" />
            <div className="h-4 bg-slate-800 rounded w-4/5" />
            <div className="h-20 bg-slate-850 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!recommendation) return null;

  const { canAdoptMore, primaryRecommendation, alternatives, sustainabilityWarning, statusRationale } = recommendation;

  // Sustainability Gatekeeping Guard (Space Overcrowded or Struggling Plant)
  if (!canAdoptMore || !primaryRecommendation) {
    return (
      <div
        id="sustainability-gatekeeper-alert"
        className="p-6 bg-amber-950/40 border-2 border-amber-500/50 rounded-2xl space-y-4 animate-fadeIn"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-900/60 border border-amber-600/50 rounded-xl text-amber-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Sustainability Gatekeeper Active
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-900/80 text-[10px] font-semibold text-amber-200">
                LittleStep Principle
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">Focus on Your Current Living Space</h3>
            <p className="text-sm text-amber-200/90 leading-relaxed">
              {sustainabilityWarning || statusRationale || 'New plant adoption is temporarily paused to ensure existing companions thrive.'}
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-950/60 border border-amber-900/40 rounded-xl flex items-center justify-between text-xs text-amber-300">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Success metric: Complete existing care checks or nurse recovering companions before expanding.</span>
          </span>
          <button
            onClick={onRefresh}
            className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold underline"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-evaluate</span>
          </button>
        </div>
      </div>
    );
  }

  const activeDisplaySpecies =
    activeAltIdx !== null && alternatives[activeAltIdx]
      ? alternatives[activeAltIdx].species
      : primaryRecommendation.species;

  const activeDisplayScorecard =
    activeAltIdx !== null && alternatives[activeAltIdx]?.scorecard
      ? alternatives[activeAltIdx].scorecard!
      : primaryRecommendation.scorecard || {
          overallScore: 92,
          spaceScore: 90,
          lightScore: 95,
          climateScore: 90,
          maintenanceScore: 95,
          preferenceScore: 90,
          rationale: `${activeDisplaySpecies.commonName} matches target lighting and space constraints.`,
        };

  const currentCategory = CATEGORY_OPTIONS.find((c) => c.id === userPreferences.plantStyle) || CATEGORY_OPTIONS[0];

  // Helper for plant category badge
  const getCategoryBadge = (species: PlantSpecies) => {
    switch (species.plantCategory) {
      case 'flowering':
        return { label: '🌸 Flowering Plant', color: 'bg-rose-950/90 border-rose-600/50 text-rose-200' };
      case 'herb_edible':
        return { label: '🍅 Veggies & Culinary Herb', color: 'bg-amber-950/90 border-amber-600/50 text-amber-200' };
      case 'succulent_cactus':
        return { label: '🌵 Succulent / Drought-Hardy', color: 'bg-teal-950/90 border-teal-600/50 text-teal-200' };
      case 'climbing_vine':
        return { label: '🌿 Trailing Vine', color: 'bg-emerald-950/90 border-emerald-600/50 text-emerald-200' };
      case 'fern':
        return { label: '🌿 Feathery Fern', color: 'bg-emerald-950/90 border-emerald-600/50 text-emerald-200' };
      default:
        return { label: '🌿 Decorative Live Foliage', color: 'bg-emerald-950/90 border-emerald-600/50 text-emerald-200' };
    }
  };

  const currentBadge = getCategoryBadge(activeDisplaySpecies);

  return (
    <div
      id="plant-recommendation-hero"
      className="bg-gradient-to-b from-slate-900/90 to-slate-950 border border-emerald-800/60 rounded-2xl shadow-xl overflow-hidden space-y-6 p-6"
    >
      {/* Top Banner / Philosophy Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Botanical Recommendation Engine</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/60 text-[10px] font-bold text-emerald-300">
              Targeted 1-Plant Focus
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Recommended Companion: {activeDisplaySpecies.commonName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Calibrated to your scanned space light, humidity, and selected botanical preference.
          </p>
        </div>

        {/* Filter / Preference Toggle & Refresh */}
        <div className="flex items-center gap-2">
          <button
            id="toggle-preference-filters-btn"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
              showFilters
                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200 font-semibold'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Preferences</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button
            id="refresh-recommendation-btn"
            onClick={onRefresh}
            title="Re-evaluate Recommendation"
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* PLANT CATEGORY SELECTOR BAR (Choose Flowers, Veggies/Herbs, Decorative Foliage, Succulents, All) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Choose Plant Category</span>
          </label>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Click any type to instantly re-tailor your 1-plant recommendation
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5" id="plant-category-buttons">
          {CATEGORY_OPTIONS.map((cat) => {
            const isSelected = (userPreferences.plantStyle || 'all') === cat.id;
            const Icon = cat.icon;

            return (
              <button
                key={cat.id}
                id={`cat-btn-${cat.id}`}
                onClick={() => handleCategorySelect(cat.id)}
                className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-emerald-950/90 to-slate-900 border-emerald-400 shadow-md shadow-emerald-950/50 ring-1 ring-emerald-400/50'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-lg">{cat.emoji}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>
                <div>
                  <h4
                    className={`text-xs font-bold leading-tight ${
                      isSelected ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {cat.label}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    {cat.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expandable Preferences Drawer */}
      {showFilters && (
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs animate-fadeIn">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
              Plant Category / Purpose
            </label>
            <select
              value={userPreferences.plantStyle || 'all'}
              onChange={(e) => handleCategorySelect(e.target.value as PlantStyleCategory)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">✨ All Companions (Best Space Fit)</option>
              <option value="flowering">🌸 Plants with Flowers (Blooms)</option>
              <option value="herbs_edible">🍅 Veggies & Culinary Herbs (Edible)</option>
              <option value="decorative">🌿 Decorative Live Foliage & Vines</option>
              <option value="succulent_cactus">🌵 Succulents & Cacti (Low Water)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
              Maintenance Rhythm
            </label>
            <select
              value={userPreferences.maintenancePreference}
              onChange={(e) => {
                const updated = {
                  ...userPreferences,
                  maintenancePreference: e.target.value as UserPlantPreferences['maintenancePreference'],
                };
                onUpdatePreferences(updated);
                onRefresh();
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="low">Low (Forgiving / Drought Hardy)</option>
              <option value="medium">Medium (Weekly Rhythms)</option>
              <option value="high">High (High Humidity / Attentive)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
              Household Safety
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-700 rounded-lg cursor-pointer text-slate-200 h-[38px]">
              <input
                type="checkbox"
                checked={userPreferences.petInHousehold}
                onChange={(e) => {
                  const updated = {
                    ...userPreferences,
                    petInHousehold: e.target.checked,
                  };
                  onUpdatePreferences(updated);
                  onRefresh();
                }}
                className="rounded text-emerald-500 focus:ring-emerald-500 bg-slate-800 border-slate-700"
              />
              <span>Pets in Home (Pet-Safe)</span>
            </label>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
              Desired Location
            </label>
            <select
              value={userPreferences.desiredLocationType}
              onChange={(e) => {
                const updated = {
                  ...userPreferences,
                  desiredLocationType: e.target.value as UserPlantPreferences['desiredLocationType'],
                };
                onUpdatePreferences(updated);
                onRefresh();
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="shelf_table">Shelf / Tabletop Compact</option>
              <option value="floor_stand">Floor Planter / Large Accent</option>
              <option value="hanging">Hanging / Trailing Canopy</option>
              <option value="window_sill">Direct Windowsill</option>
              <option value="balcony_railing">Balcony Railing / Sunny Outdoor</option>
            </select>
          </div>
        </div>
      )}

      {/* Main Presentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Plant Imagery & Quick Specs (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-emerald-800/40 bg-slate-950 aspect-square group">
            <img
              src={activeDisplaySpecies.imageUrl}
              alt={activeDisplaySpecies.commonName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

            {/* Badges on image */}
            <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5">
              <span className={`px-2.5 py-1 rounded-full backdrop-blur-md border text-[11px] font-bold shadow ${currentBadge.color}`}>
                {currentBadge.label}
              </span>
              {activeDisplaySpecies.petSafe && (
                <span className="px-2.5 py-1 rounded-full bg-teal-950/85 backdrop-blur-md border border-teal-500/50 text-[11px] font-bold text-teal-200">
                  🐾 100% Pet Safe
                </span>
              )}
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
              <span className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeDisplaySpecies.lightRequirement.replace('_', ' ')}</span>
              </span>
              <span className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700">
                <Droplet className="w-3.5 h-3.5 text-blue-400" />
                <span>Every {activeDisplaySpecies.waterFrequencyDays}d</span>
              </span>
            </div>
          </div>

          {/* Species Scientific Name & Mature spread */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-300">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Botanical Name</span>
              <span className="italic font-medium text-emerald-300">{activeDisplaySpecies.scientificName}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Mature Size</span>
              <span className="font-medium text-slate-200">{activeDisplaySpecies.matureSize || 'Compact 1-2 ft'}</span>
            </div>
          </div>

          {/* Alternative tabs (Max 2) */}
          {alternatives.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Compare Suitable Alternatives (Max 2)
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setActiveAltIdx(null)}
                  className={`p-2 rounded-xl text-left border text-xs transition-all ${
                    activeAltIdx === null
                      ? 'bg-emerald-950/80 border-emerald-500 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <p className="truncate font-semibold">1. Primary</p>
                  <p className="text-[10px] opacity-75 truncate">{primaryRecommendation.species.commonName}</p>
                </button>

                {alternatives.slice(0, 2).map((alt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveAltIdx(idx)}
                    className={`p-2 rounded-xl text-left border text-xs transition-all ${
                      activeAltIdx === idx
                        ? 'bg-emerald-950/80 border-emerald-500 text-white font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <p className="truncate font-semibold">{idx + 2}. Alt</p>
                    <p className="text-[10px] opacity-75 truncate">{alt.species.commonName}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Botanical Fit & Recommendation Rationale (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Target Zone Callout */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-900/60 rounded-lg text-emerald-400">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-emerald-400 tracking-wider">
                  Target Zone Placement
                </span>
                <h4 className="text-sm font-bold text-white">
                  {primaryRecommendation.targetZoneName || 'Primary Zone'}
                </h4>
              </div>
            </div>
            <p className="text-xs text-slate-300 max-w-xs text-right hidden sm:block">
              {primaryRecommendation.placementTip}
            </p>
          </div>

          {/* 5-Factor Suitability Scorecard */}
          <PlantSuitabilityScorecard
            scorecard={activeDisplayScorecard}
            plantName={activeDisplaySpecies.commonName}
            onExplainClick={() => {
              const zone = targetZone || {
                id: primaryRecommendation.targetZoneId,
                name: primaryRecommendation.targetZoneName,
                zoneType: 'plant_zone',
                lightLevel: 'bright_indirect',
                color: '#10b981',
                x: 10,
                y: 10,
                w: 30,
                h: 30,
                recommendedSize: 'medium',
                notes: 'Primary targeted zone',
              };
              onExplainRecommendation(activeDisplaySpecies, zone);
            }}
          />

          {/* Match Reasons List */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Why this plant thrives here</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {(activeAltIdx !== null && alternatives[activeAltIdx]
                ? [alternatives[activeAltIdx].reason]
                : primaryRecommendation.matchReasons
              ).map((reason, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl text-slate-300 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTA Box */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
                <span>Begin Mindful Adoption (+10 Pts)</span>
              </div>
              <p className="text-[11px] text-emerald-200/80">
                Adopting registers your 1-plant commitment and unlocks the Day 1 setup journey.
              </p>
            </div>

            <button
              id="adopt-recommended-plant-btn"
              onClick={() => onAdopt(activeDisplaySpecies, primaryRecommendation.targetZoneId)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-lg transition-all whitespace-nowrap"
            >
              <span>Adopt {activeDisplaySpecies.commonName}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

