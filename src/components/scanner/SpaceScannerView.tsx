import React, { useState, useRef } from 'react';
import {
  Compass,
  Camera,
  Upload,
  Layers,
  Sparkles,
  Sun,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Plus,
  Sliders,
  ChevronRight,
  Maximize2,
  DoorClosed,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { SpaceZone } from '../../types';

export const SpaceScannerView: React.FC = () => {
  const {
    spaces,
    activeSpace,
    setActiveSpace,
    isScanningSpace,
    scanSpacePhoto,
    confirmSpace,
    addOrUpdateZone,
    adoptions,
    setActiveTab,
  } = useApp();
  const { user, openAuthGate } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [selectedSpaceType, setSelectedSpaceType] = useState<'balcony' | 'indoor_room' | 'patio' | 'terrace'>(
    'balcony'
  );
  const [referenceBenchmark, setReferenceBenchmark] = useState('');
  const [selectedZone, setSelectedZone] = useState<SpaceZone | null>(activeSpace.zones[0] || null);

  // Edit / Calibration State
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [editLength, setEditLength] = useState(activeSpace.lengthFt);
  const [editWidth, setEditWidth] = useState(activeSpace.widthFt);
  const [editingZones, setEditingZones] = useState<SpaceZone[]>(activeSpace.zones);

  const activePlantsInSpace = adoptions.filter((a) => a.spaceId === activeSpace.id);

  // Sample quick images for testing without uploading personal files
  const sampleScans = [
    {
      name: 'Sunlit Urban Balcony',
      type: 'balcony',
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      benchmark: 'Standard balcony railing height = 3.5 ft',
    },
    {
      name: 'Window Sill Plant Nook',
      type: 'indoor_room',
      url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=80',
      benchmark: 'Window sill span = 4.5 ft',
    },
    {
      name: 'Shaded Patio Corner',
      type: 'patio',
      url: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=1000&q=80',
      benchmark: 'Paved terrace tile = 1.0 ft x 1.0 ft',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!user) {
      openAuthGate({
        actionType: 'space_scan',
        title: 'Sign In to Scan Your Space',
        message: 'To analyze your space photograph, estimate usable dimensions, and generate 2D sunlight zones with AI, please sign in or create a free account.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const createdSpace = await scanSpacePhoto(base64, selectedSpaceType, referenceBenchmark);
      setEditLength(createdSpace.lengthFt);
      setEditWidth(createdSpace.widthFt);
      setEditingZones(createdSpace.zones);
      setSelectedZone(createdSpace.zones[0] || null);
    };
    reader.readAsDataURL(file);
  };

  const handleSampleScan = async (sample: (typeof sampleScans)[0]) => {
    if (!user) {
      openAuthGate({
        actionType: 'space_scan',
        title: 'Sign In to Scan Your Space',
        message: 'To analyze your space photograph, estimate usable dimensions, and generate 2D sunlight zones with AI, please sign in or create a free account.',
      });
      return;
    }

    // Fetch sample image as base64
    try {
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const createdSpace = await scanSpacePhoto(base64, sample.type, sample.benchmark);
        setEditLength(createdSpace.lengthFt);
        setEditWidth(createdSpace.widthFt);
        setEditingZones(createdSpace.zones);
        setSelectedZone(createdSpace.zones[0] || null);
      };
      reader.readAsDataURL(blob);
    } catch {
      // Fallback
      const createdSpace = await scanSpacePhoto(sample.url, sample.type, sample.benchmark);
      setEditLength(createdSpace.lengthFt);
      setEditWidth(createdSpace.widthFt);
      setEditingZones(createdSpace.zones);
      setSelectedZone(createdSpace.zones[0] || null);
    }
  };

  const handleSaveCalibration = () => {
    confirmSpace(activeSpace.id, Number(editLength), Number(editWidth), editingZones);
    setIsCalibrating(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Space Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-emerald-900/40 p-6 rounded-2xl border border-emerald-800/60">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>AI Multimodal Spatial Perception</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">AI Space Scanner & 2D Zone Mapper</h1>
          <p className="text-emerald-200/80 text-sm mt-1">
            Gemini vision analyzes lighting, boundaries, and safe airflow before calculating sustainable plant capacity.
          </p>
        </div>

        {/* Space Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-emerald-300 font-medium whitespace-nowrap">Active Space:</label>
          <select
            id="active-space-select"
            value={activeSpace.id}
            onChange={(e) => {
              const sp = spaces.find((s) => s.id === e.target.value);
              if (sp) {
                setActiveSpace(sp);
                setEditLength(sp.lengthFt);
                setEditWidth(sp.widthFt);
                setEditingZones(sp.zones);
                setSelectedZone(sp.zones[0] || null);
              }
            }}
            className="bg-emerald-950 border border-emerald-700/70 text-emerald-100 text-sm rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {spaces.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.usableAreaSqFt} sq.ft)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Space Photo & Perception Scanner (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Photo Capture & Upload Box */}
          <div className="bg-emerald-950/60 rounded-2xl p-6 border border-emerald-800/60 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-400" />
                <span>Photograph & Calibration</span>
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-800/50 text-emerald-300 font-mono">
                Multimodal Input
              </span>
            </div>

            {/* Image Preview / Scan Area */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-emerald-700/50 bg-emerald-900/30 group">
              {activeSpace.photoUrl ? (
                <img
                  src={activeSpace.photoUrl}
                  alt={activeSpace.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-emerald-400/60 p-6 text-center">
                  <Camera className="w-10 h-10 mb-2 stroke-[1.5]" />
                  <p className="text-sm">No photo uploaded yet</p>
                </div>
              )}

              {isScanningSpace && (
                <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-emerald-300 p-6 text-center animate-fadeIn">
                  <div className="w-10 h-10 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="font-semibold text-sm">Space Assessment Agent Analyzing...</p>
                  <p className="text-xs text-emerald-400/80 mt-1">
                    Detecting perspective ratios, light vectors & usable planting zones
                  </p>
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-emerald-300/80 mb-1 block">Space Type</label>
                  <select
                    id="scan-space-type-select"
                    value={selectedSpaceType}
                    onChange={(e) => setSelectedSpaceType(e.target.value as any)}
                    className="w-full bg-emerald-900/80 border border-emerald-700/60 text-emerald-100 text-xs rounded-lg px-2.5 py-2"
                  >
                    <option value="balcony">Balcony</option>
                    <option value="indoor_room">Indoor Room / Nook</option>
                    <option value="patio">Patio</option>
                    <option value="terrace">Terrace / Rooftop</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-emerald-300/80 mb-1 block">Benchmark (Optional)</label>
                  <input
                    id="scan-benchmark-input"
                    type="text"
                    placeholder="e.g. Door = 3ft"
                    value={referenceBenchmark}
                    onChange={(e) => setReferenceBenchmark(e.target.value)}
                    className="w-full bg-emerald-900/80 border border-emerald-700/60 text-emerald-100 text-xs rounded-lg px-2.5 py-2 placeholder:text-emerald-600"
                  />
                </div>
              </div>

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

              <div className="grid grid-cols-2 gap-2">
                <button
                  id="take-camera-photo-btn"
                  disabled={isScanningSpace}
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-emerald-950 font-bold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Camera className="w-4 h-4 shrink-0" />
                  <span>Take Photo (Camera)</span>
                </button>
                <button
                  id="upload-space-photo-btn"
                  disabled={isScanningSpace}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700/60 text-emerald-100 font-bold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Upload className="w-4 h-4 shrink-0" />
                  <span>Upload (Gallery)</span>
                </button>
              </div>
            </div>

            {/* Quick Demo Scenarios */}
            <div className="pt-2 border-t border-emerald-800/40">
              <p className="text-xs font-medium text-emerald-400/90 mb-2">Or test sample environments:</p>
              <div className="flex flex-wrap gap-2">
                {sampleScans.map((sample) => (
                  <button
                    key={sample.name}
                    id={`sample-scan-${sample.type}`}
                    onClick={() => handleSampleScan(sample)}
                    disabled={isScanningSpace}
                    className="text-xs px-3 py-1.5 rounded-lg bg-emerald-900/70 hover:bg-emerald-800 border border-emerald-700/50 text-emerald-200 transition-colors"
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Estimation Transparency & Scientific Breakdown */}
          <div className="bg-emerald-950/60 rounded-2xl p-6 border border-emerald-800/60 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Spatial Estimation Transparency</span>
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-800 text-emerald-200">
                Confidence: {Math.round(activeSpace.confidence * 100)}%
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-900/40 border border-emerald-800/40 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-emerald-200">Directly Inferred: </span>
                  <span className="text-emerald-300/80">
                    Floor boundaries, safety railing geometry, and existing furniture obstacles.
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-900/40 border border-emerald-800/40 flex items-start gap-2">
                <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-teal-200">Estimated Assumptions: </span>
                  <span className="text-emerald-300/80">
                    Total area (~{activeSpace.usableAreaSqFt} sq.ft) scaled from standard doorway/railing baselines.
                  </span>
                </div>
              </div>

              {activeSpace.safetyWarnings && activeSpace.safetyWarnings.length > 0 && (
                <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/50 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-amber-200">Safety & Airflow Advisory: </span>
                    <span className="text-amber-300/80">{activeSpace.safetyWarnings.join('. ')}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 2D Space Visualizer (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-emerald-950/70 rounded-2xl p-6 border border-emerald-800/60 space-y-6">
            {/* Header & Calibration Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  <span>2D Green Space Map</span>
                </h2>
                <p className="text-xs text-emerald-300/80">
                  Approx. {activeSpace.lengthFt} ft x {activeSpace.widthFt} ft ({activeSpace.usableAreaSqFt} sq.ft usable)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="calibrate-dimensions-btn"
                  onClick={() => setIsCalibrating(!isCalibrating)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isCalibrating
                      ? 'bg-amber-500 text-amber-950 shadow-md'
                      : 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{isCalibrating ? 'Editing Measurements' : 'Calibrate Dimensions'}</span>
                </button>
              </div>
            </div>

            {/* Human-in-the-Loop Calibration Box */}
            {isCalibrating && (
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-medium">
                  <Info className="w-4 h-4" />
                  <span>
                    "I estimate this {activeSpace.spaceType} is approximately {activeSpace.lengthFt} ft wide and{' '}
                    {activeSpace.widthFt} ft deep. Is this approximately correct?"
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-amber-200/90 font-medium block mb-1">
                      Length (ft): <span className="text-white font-bold">{editLength}</span>
                    </label>
                    <input
                      id="calibrate-length-slider"
                      type="range"
                      min="3"
                      max="20"
                      step="0.5"
                      value={editLength}
                      onChange={(e) => setEditLength(parseFloat(e.target.value))}
                      className="w-full accent-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-amber-200/90 font-medium block mb-1">
                      Width / Depth (ft): <span className="text-white font-bold">{editWidth}</span>
                    </label>
                    <input
                      id="calibrate-width-slider"
                      type="range"
                      min="2"
                      max="15"
                      step="0.5"
                      value={editWidth}
                      onChange={(e) => setEditWidth(parseFloat(e.target.value))}
                      className="w-full accent-amber-400"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsCalibrating(false)}
                    className="px-3 py-1 text-xs text-amber-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    id="save-calibration-btn"
                    onClick={handleSaveCalibration}
                    className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs shadow"
                  >
                    Confirm Corrected Dimensions
                  </button>
                </div>
              </div>
            )}

            {/* Interactive 2D Canvas / Map Container */}
            <div className="relative w-full aspect-[4/3] rounded-2xl bg-emerald-950 border-2 border-emerald-700/60 overflow-hidden shadow-inner p-4 flex flex-col justify-between">
              {/* Grid Background Pattern */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, #34d399 1px, transparent 1px), radial-gradient(circle, #34d399 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Sunlight Orientation Indicator */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/70 border border-amber-700/50 text-amber-300 text-[11px] font-semibold">
                <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                <span>Morning Sun Vector (East)</span>
              </div>

              {/* Rendered Zones */}
              <div className="relative w-full h-full">
                {activeSpace.zones.map((zone) => {
                  const isSelected = selectedZone?.id === zone.id;
                  const isPlantZone = zone.zoneType === 'plant_zone';
                  const isWalkway = zone.zoneType === 'walkway';
                  const isFurniture = zone.zoneType === 'furniture';

                  return (
                    <div
                      key={zone.id}
                      id={`map-zone-${zone.id}`}
                      onClick={() => setSelectedZone(zone)}
                      style={{
                        left: `${zone.x}%`,
                        top: `${zone.y}%`,
                        width: `${zone.w}%`,
                        height: `${zone.h}%`,
                      }}
                      className={`absolute rounded-xl transition-all cursor-pointer p-2 flex flex-col justify-between select-none ${
                        isSelected ? 'ring-2 ring-white scale-[1.02] z-20 shadow-xl' : 'hover:scale-[1.01] z-10'
                      } ${
                        isPlantZone
                          ? zone.lightLevel === 'direct_sun'
                            ? 'bg-amber-500/25 border-2 border-amber-400/80 text-amber-200'
                            : 'bg-emerald-500/25 border-2 border-emerald-400/80 text-emerald-200'
                          : isWalkway
                          ? 'bg-slate-700/30 border-2 border-dashed border-slate-500/60 text-slate-300'
                          : 'bg-stone-700/40 border-2 border-stone-500/80 text-stone-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-[11px] font-bold truncate">{zone.name}</span>
                        {isPlantZone && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 font-mono">
                            {zone.lightLevel === 'direct_sun' ? '☀️ High Sun' : '🌤️ Bright'}
                          </span>
                        )}
                      </div>

                      {/* Plant badge in zone if assigned */}
                      <div className="flex items-center gap-1 text-[10px]">
                        {isPlantZone && (
                          <div className="flex items-center gap-1 font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            <span>Recommended: {zone.recommendedSize || 'Medium'} Plant</span>
                          </div>
                        )}
                        {isWalkway && <span className="italic text-slate-400">Clear Walkway</span>}
                        {isFurniture && <span className="text-stone-300">Obstacle / Seating</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Map Footer Legend */}
              <div className="z-10 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-800/40 text-[11px] text-emerald-300/80">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-amber-500/40 border border-amber-400" />
                    <span>High Sun Zone</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-emerald-500/40 border border-emerald-400" />
                    <span>Medium Light Zone</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-slate-700/40 border border-dashed border-slate-500" />
                    <span>Clearance Path</span>
                  </div>
                </div>
                <span className="font-mono text-emerald-400 font-semibold">
                  Utilization: {activeSpace.currentUtilizationPct}%
                </span>
              </div>
            </div>

            {/* Selected Zone Inspector & Recommendation Action */}
            {selectedZone && (
              <div className="p-4 rounded-xl bg-emerald-900/50 border border-emerald-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{selectedZone.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-800 text-emerald-300 uppercase font-mono">
                      {selectedZone.zoneType.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200/80">{selectedZone.notes || 'Identified functional zone'}</p>
                </div>

                {selectedZone.zoneType === 'plant_zone' && (
                  <button
                    id="find-plants-for-zone-btn"
                    onClick={() => setActiveTab('plants')}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs shadow transition-colors whitespace-nowrap"
                  >
                    <span>Match Plants for this Zone</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
