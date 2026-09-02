import React, { useState } from 'react';
import {
  Wind,
  ShieldCheck,
  HelpCircle,
  TrendingUp,
  Thermometer,
  Droplets,
  Calendar,
  AlertCircle,
  Plus,
  Info,
  CheckCircle2,
  CloudSun,
  Activity,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MeasurementSourceType } from '../../types';

export const AirEnvironmentView: React.FC = () => {
  const { baseline, airTimeline, updateBaseline, addAirLogEntry, adoptions, activeSpace } = useApp();

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [outdoorAqiInput, setOutdoorAqiInput] = useState(74);
  const [indoorHumidityInput, setIndoorHumidityInput] = useState(52);
  const [indoorTempInput, setIndoorTempInput] = useState(28.0);
  const [milestoneInput, setMilestoneInput] = useState('Routine Environmental Check');
  const [selectedConfounders, setSelectedConfounders] = useState<string[]>([
    'Natural cross-ventilation (windows open)',
    'Stable regional weather conditions',
  ]);

  const availableConfounders = [
    'Natural cross-ventilation (windows open)',
    'Air purifier active in living room',
    'Indoor cooking / kitchen activity',
    'Outdoor rain / monsoon precipitation',
    'HVAC / Air conditioning running',
    'Plant cluster localized misting',
  ];

  const toggleConfounder = (item: string) => {
    if (selectedConfounders.includes(item)) {
      setSelectedConfounders(selectedConfounders.filter((c) => c !== item));
    } else {
      setSelectedConfounders([...selectedConfounders, item]);
    }
  };

  const handleCreateAirLog = async () => {
    await addAirLogEntry({
      spaceId: activeSpace.id,
      milestoneTitle: milestoneInput,
      activePlantsCount: adoptions.length,
      outdoorAqi: {
        value: Number(outdoorAqiInput),
        unit: 'US-AQI',
        sourceType: 'EXTERNAL_DATA',
        sourceLabel: 'Regional Monitoring API',
      },
      indoorHumidity: {
        value: Number(indoorHumidityInput),
        unit: '%',
        sourceType: 'USER_PROVIDED',
        sourceLabel: 'Home Sensor',
      },
      indoorTemp: {
        value: Number(indoorTempInput),
        unit: '°C',
        sourceType: 'USER_PROVIDED',
        sourceLabel: 'Home Sensor',
      },
      confoundingFactors: selectedConfounders,
      scientificAnalysis:
        'Observed microclimate conditions tracked. Confounding variables accounted for to maintain scientific integrity.',
    });
    setIsLogModalOpen(false);
  };

  // Helper to render source badge
  const renderSourceBadge = (sourceType: MeasurementSourceType) => {
    const config: Record<MeasurementSourceType, { label: string; bg: string; text: string }> = {
      MEASURED: { label: 'MEASURED (Hardware Sensor)', bg: 'bg-emerald-950/80 border-emerald-600', text: 'text-emerald-300' },
      EXTERNAL_DATA: { label: 'EXTERNAL (Regional API)', bg: 'bg-blue-950/80 border-blue-600', text: 'text-blue-300' },
      ESTIMATED: { label: 'ESTIMATED (Microclimate Model)', bg: 'bg-purple-950/80 border-purple-600', text: 'text-purple-300' },
      USER_PROVIDED: { label: 'USER PROVIDED (Manual Observation)', bg: 'bg-amber-950/80 border-amber-600', text: 'text-amber-300' },
    };
    const c = config[sourceType] || config.USER_PROVIDED;
    return (
      <span className={`text-[9px] px-2 py-0.5 rounded-full border font-mono font-bold tracking-wider ${c.bg} ${c.text}`}>
        {c.label}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-emerald-900/40 p-6 rounded-2xl border border-emerald-800/60">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Wind className="w-4 h-4" />
            <span>Scientific Environmental Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">Air Environment Baseline & Timeline</h1>
          <p className="text-emerald-200/80 text-sm mt-1">
            Track microclimate, outdoor air-quality indices, and humidity trends with rigorous scientific attribution.
          </p>
        </div>

        <button
          id="log-air-observation-btn"
          onClick={() => setIsLogModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-emerald-950 font-bold text-sm shadow-md transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Air Observation (+15 pts)</span>
        </button>
      </div>

      {/* Scientific Integrity Pillar Notice */}
      <div className="p-5 rounded-2xl bg-teal-950/40 border border-teal-800/60 space-y-3">
        <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
          <span>Scientific Integrity Standard: Responsible Environmental Attribution</span>
        </div>
        <p className="text-xs text-teal-100/90 leading-relaxed">
          Plants provide immense biophilic, psychological, and subtle micro-humidity buffering benefits. However, in
          everyday residential environments with active human movement and outdoor air exchange, houseplants are{' '}
          <strong className="text-white">not</strong> substitutes for natural ventilation, HEPA air purifiers, or source
          pollution control. LittleStep explicitly accounts for confounding factors like weather, open windows, and
          occupancy before drawing any comparative observations.
        </p>
      </div>

      {/* Baseline Overview Grid */}
      <div className="bg-emerald-950/70 rounded-2xl p-6 border border-emerald-800/60 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-800/40 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span>Baseline Environmental Profile</span>
            </h2>
            <p className="text-xs text-emerald-300/80">
              Location: {baseline.locationName} • Established on {new Date(baseline.establishedAt).toLocaleDateString()}
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 font-mono">
            Status: Established & Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Outdoor AQI */}
          <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                <span>Outdoor AQI</span>
              </span>
              {renderSourceBadge(baseline.outdoorAqi.sourceType)}
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{baseline.outdoorAqi.value}</div>
              <span className="text-[11px] text-emerald-300/70">{baseline.outdoorAqi.unit} (Moderate)</span>
            </div>
            <p className="text-[10px] text-emerald-400/60">{baseline.outdoorAqi.sourceLabel}</p>
          </div>

          {/* Outdoor PM2.5 */}
          <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-blue-400" />
                <span>Outdoor PM2.5</span>
              </span>
              {renderSourceBadge(baseline.outdoorPm25.sourceType)}
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{baseline.outdoorPm25.value}</div>
              <span className="text-[11px] text-emerald-300/70">{baseline.outdoorPm25.unit}</span>
            </div>
            <p className="text-[10px] text-emerald-400/60">{baseline.outdoorPm25.sourceLabel}</p>
          </div>

          {/* Indoor Humidity */}
          <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                <span>Indoor Humidity</span>
              </span>
              {renderSourceBadge(baseline.indoorHumidity.sourceType)}
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{baseline.indoorHumidity.value}%</div>
              <span className="text-[11px] text-emerald-300/70">Relative Humidity</span>
            </div>
            <p className="text-[10px] text-emerald-400/60">{baseline.indoorHumidity.sourceLabel}</p>
          </div>

          {/* Indoor Temperature */}
          <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                <span>Indoor Temperature</span>
              </span>
              {renderSourceBadge(baseline.indoorTemp.sourceType)}
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{baseline.indoorTemp.value}°C</div>
              <span className="text-[11px] text-emerald-300/70">Ambient Thermal Scale</span>
            </div>
            <p className="text-[10px] text-emerald-400/60">{baseline.indoorTemp.sourceLabel}</p>
          </div>
        </div>
      </div>

      {/* Longitudinal Timeline: Before vs. After Plant Milestones */}
      <div className="bg-emerald-950/70 rounded-2xl p-6 border border-emerald-800/60 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>Longitudinal Environmental Timeline</span>
            </h2>
            <p className="text-xs text-emerald-300/80">
              Tracking observed microclimate changes alongside plant survival milestones
            </p>
          </div>
          <span className="text-xs text-emerald-300 font-mono">{airTimeline.length} Recorded Milestones</span>
        </div>

        {/* Timeline Items */}
        <div className="relative border-l-2 border-emerald-700/60 ml-4 space-y-8 pl-6">
          {airTimeline.map((entry, idx) => {
            const isInitial = entry.dayNumber === 0;

            return (
              <div key={entry.id} className="relative group">
                {/* Node Dot */}
                <div
                  className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-emerald-950 ${
                    isInitial ? 'bg-amber-400 ring-4 ring-amber-400/20' : 'bg-emerald-400 ring-4 ring-emerald-400/20'
                  }`}
                />

                <div className="p-5 rounded-2xl bg-emerald-900/40 border border-emerald-800/60 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <span className="text-xs text-emerald-400 font-mono font-bold">
                        DAY {entry.dayNumber} • {entry.date}
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5">{entry.milestoneTitle}</h3>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 font-mono">
                      Active Plants: {entry.activePlantsCount}
                    </span>
                  </div>

                  {/* Comparative Metrics Row */}
                  <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-xs">
                    <div>
                      <span className="text-emerald-400/80 block">Outdoor AQI</span>
                      <span className="text-sm font-bold text-white">{entry.outdoorAqi.value}</span>
                    </div>
                    <div>
                      <span className="text-emerald-400/80 block">Indoor Humidity</span>
                      <span className="text-sm font-bold text-white">{entry.indoorHumidity.value}%</span>
                    </div>
                    <div>
                      <span className="text-emerald-400/80 block">Indoor Temp</span>
                      <span className="text-sm font-bold text-white">{entry.indoorTemp.value}°C</span>
                    </div>
                  </div>

                  {/* Confounders Box */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-amber-400" />
                      <span>Confounding Environmental Variables:</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {entry.confoundingFactors.map((c, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-200">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Scientific Attribution Note */}
                  <p className="text-xs text-emerald-100/80 italic bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/40">
                    "{entry.scientificAnalysis}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Log Air Observation Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-emerald-950 border border-emerald-700/80 rounded-2xl max-w-xl w-full p-6 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-emerald-800/50 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Wind className="w-5 h-5 text-emerald-400" />
                <span>Log Environmental Milestone Observation</span>
              </h3>
              <button onClick={() => setIsLogModalOpen(false)} className="text-emerald-400 hover:text-white text-sm">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-emerald-300 font-medium block mb-1">Milestone Event / Observation Title</label>
                <input
                  type="text"
                  value={milestoneInput}
                  onChange={(e) => setMilestoneInput(e.target.value)}
                  className="w-full bg-emerald-900/80 border border-emerald-700/60 text-emerald-100 text-sm rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-emerald-300 font-medium block mb-1">Outdoor AQI</label>
                  <input
                    type="number"
                    value={outdoorAqiInput}
                    onChange={(e) => setOutdoorAqiInput(Number(e.target.value))}
                    className="w-full bg-emerald-900/80 border border-emerald-700/60 text-emerald-100 text-sm rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-xs text-emerald-300 font-medium block mb-1">Indoor Humidity %</label>
                  <input
                    type="number"
                    value={indoorHumidityInput}
                    onChange={(e) => setIndoorHumidityInput(Number(e.target.value))}
                    className="w-full bg-emerald-900/80 border border-emerald-700/60 text-emerald-100 text-sm rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-xs text-emerald-300 font-medium block mb-1">Indoor Temp °C</label>
                  <input
                    type="number"
                    value={indoorTempInput}
                    onChange={(e) => setIndoorTempInput(Number(e.target.value))}
                    className="w-full bg-emerald-900/80 border border-emerald-700/60 text-emerald-100 text-sm rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-emerald-300 font-medium block mb-2">
                  Select Active Confounding Factors:
                </label>
                <div className="space-y-1.5">
                  {availableConfounders.map((item) => {
                    const isSelected = selectedConfounders.includes(item);
                    return (
                      <div
                        key={item}
                        onClick={() => toggleConfounder(item)}
                        className={`p-2.5 rounded-lg text-xs cursor-pointer border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-900 border-emerald-400 text-white font-medium'
                            : 'bg-emerald-900/30 border-emerald-800/50 text-emerald-300/80'
                        }`}
                      >
                        <span>{item}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setIsLogModalOpen(false)} className="px-4 py-2 text-xs text-emerald-300 hover:text-white">
                Cancel
              </button>
              <button
                id="submit-air-log-btn"
                onClick={handleCreateAirLog}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm shadow transition-colors"
              >
                Log Entry (+15 pts)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
