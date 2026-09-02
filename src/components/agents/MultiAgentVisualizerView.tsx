import React, { useState } from 'react';
import {
  Cpu,
  Compass,
  Sprout,
  HeartHandshake,
  Stethoscope,
  Wind,
  TrendingUp,
  Award,
  ShieldCheck,
  Activity,
  Terminal,
  Layers,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Globe,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MultiAgentVisualizerView: React.FC = () => {
  const { agentLogs, activeSpace, adoptions, totalPoints, recommendation, impactProfile } = useApp();
  const [selectedLog, setSelectedLog] = useState<(typeof agentLogs)[0] | null>(agentLogs[0] || null);

  const agentsList = [
    {
      id: 'space-agent',
      name: 'Space & Light Specialist',
      icon: Compass,
      role: 'Room Layout, Sunlight & Zone Mapping',
      color: 'from-amber-500 to-orange-400',
      activeStatus: 'Ready to evaluate room photos & space dimensions',
      metrics: `${activeSpace.usableAreaSqFt} sq.ft mapped • ${activeSpace.zones.length} zones`,
    },
    {
      id: 'plant-agent',
      name: 'Plant Match Specialist',
      icon: Sprout,
      role: 'Gentle 1-Plant Adoption & Space Protection',
      color: 'from-emerald-500 to-teal-400',
      activeStatus: recommendation?.canAdoptMore ? 'Ready to suggest your next companion' : 'Mindful Check: Preventing Overcrowding',
      metrics: `${recommendation?.spaceUtilizationPct || 25}% space utilized`,
    },
    {
      id: 'care-agent',
      name: 'Daily Care Guide',
      icon: HeartHandshake,
      role: 'Personalized Watering & Care Routine',
      color: 'from-cyan-500 to-blue-400',
      activeStatus: 'Managing your daily care schedule & watering routine',
      metrics: `${adoptions.length} care schedule${adoptions.length === 1 ? '' : 's'} active`,
    },
    {
      id: 'health-agent',
      name: 'Plant Doctor & Health Guide',
      icon: Stethoscope,
      role: 'Visual Leaf Symptom Diagnosis & Remedies',
      color: 'from-rose-500 to-pink-400',
      activeStatus: 'Camera health check ready for leaf photos',
      metrics: 'Friendly care remedies & triage',
    },
    {
      id: 'air-agent',
      name: 'Air & Climate Specialist',
      icon: Wind,
      role: 'Outdoor AQI, Humidity & Weather Awareness',
      color: 'from-teal-500 to-emerald-400',
      activeStatus: 'Tracking real outdoor air quality & indoor humidity',
      metrics: 'Outdoor AQI + Indoor Humidity',
    },
    {
      id: 'progress-agent',
      name: 'Milestone & Habit Tracker',
      icon: TrendingUp,
      role: 'Companion Longevity & Daily Streaks',
      color: 'from-indigo-500 to-violet-400',
      activeStatus: 'Celebrating your 30-day, 90-day & 180-day growth',
      metrics: `${adoptions[0]?.streakDays || 1}d longest care streak`,
    },
    {
      id: 'reward-agent',
      name: 'Rewards & Recognition Guide',
      icon: Award,
      role: 'Eco-Points Verification & Rewards Store',
      color: 'from-yellow-500 to-amber-400',
      activeStatus: 'Verifying real care milestones for rewards',
      metrics: `${totalPoints} earned eco-points`,
    },
    {
      id: 'personalization-agent',
      name: 'Daily Step Companion',
      icon: Sprout,
      role: 'Personalized Daily Tips & Action Timing',
      color: 'from-emerald-400 to-teal-300',
      activeStatus: 'Finding your next simple action for today',
      metrics: 'Tailored to your daily schedule',
    },
    {
      id: 'impact-agent',
      name: 'Impact & Community Guide',
      icon: Globe,
      role: 'Habit Consistency & Collective Milestones',
      color: 'from-cyan-400 to-emerald-400',
      activeStatus: 'Tracking your care habits & community impact',
      metrics: 'Real habits, zero exaggeration',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-emerald-900/40 p-6 rounded-2xl border border-emerald-800/60">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>Intelligent Sanctuary Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">Meet Your Plant Care Specialists</h1>
          <p className="text-emerald-200/80 text-sm mt-1">
            See how your team of specialized smart guides collaborate behind the scenes to support your green space.
          </p>
        </div>

        <span className="text-xs px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 font-mono flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Care Team Active & In Sync</span>
        </span>
      </div>

      {/* Visual Orchestrator Architecture Map */}
      <div className="bg-emerald-950/70 rounded-2xl p-6 border border-emerald-800/60 space-y-6">
        <h2 className="text-sm font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4" />
          <span>How Your Guides Work Together</span>
        </h2>

        {/* Root Orchestrator Node */}
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 border-2 border-emerald-400/80 shadow-lg text-center space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">Lead Care Guide</span>
          <h3 className="text-base font-black text-white">LITTLESTEP ASSISTANT</h3>
          <p className="text-[11px] text-emerald-100/90">
            Coordinates your space layout, plant wellness, and daily habits seamlessly
          </p>
        </div>

        {/* Connection Branch */}
        <div className="flex justify-center -my-2 text-emerald-500">
          <ArrowDown className="w-6 h-6 animate-bounce" />
        </div>

        {/* 7 Specialized Agent Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {agentsList.map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.id}
                className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-800/60 space-y-2.5 flex flex-col justify-between hover:border-emerald-500/80 transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${agent.color} flex items-center justify-center text-emerald-950 shrink-0`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {agent.name}
                      </h4>
                      <p className="text-[10px] text-emerald-400/70 line-clamp-1">{agent.role}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-200/90 leading-snug">{agent.activeStatus}</p>
                </div>

                <div className="pt-2 border-t border-emerald-800/40 flex items-center justify-between text-[10px] font-mono text-emerald-400/80">
                  <span>{agent.metrics}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-Time Guide Activity & Insight Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Stream of Activities (6 Cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Recent Care & Advice Feed</span>
            </h2>
            <span className="text-xs text-emerald-400/70 font-medium">Live Sanctuary Feed</span>
          </div>

          <div className="bg-emerald-950/70 rounded-2xl p-4 border border-emerald-800/60 space-y-2.5 max-h-[500px] overflow-y-auto">
            {agentLogs.length === 0 ? (
              <div className="text-center py-8 text-emerald-300/70 text-xs">
                No care activities logged yet. Activities will appear as you scan rooms, care for plants, and log milestones.
              </div>
            ) : (
              agentLogs.map((log) => {
                const isSelected = selectedLog?.id === log.id;
                return (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-900/90 border-emerald-400 ring-1 ring-emerald-400 shadow-md'
                        : 'bg-emerald-900/30 border-emerald-800/50 hover:bg-emerald-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {log.agentName}
                      </span>
                      <span className="text-[10px] text-emerald-400/80">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-white mt-1.5 leading-snug font-medium">{log.action}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Selected Activity Breakdown (6 Cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Activity Summary & Insights</span>
            </h2>
            <span className="text-xs text-teal-300 font-medium">Verified Record</span>
          </div>

          <div className="bg-emerald-950 rounded-2xl p-6 border border-emerald-800/70 space-y-5">
            {selectedLog ? (
              <>
                {/* Header Info */}
                <div className="flex items-center justify-between border-b border-emerald-800/50 pb-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-300 block">{selectedLog.agentName}</span>
                    <span className="text-[11px] text-emerald-400/70">
                      {new Date(selectedLog.timestamp).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-800/80 text-emerald-200 font-medium border border-emerald-700/60 capitalize">
                    {selectedLog.status}
                  </span>
                </div>

                {/* Primary Action Description */}
                <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-800/50">
                  <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wide">Action Description</h3>
                  <p className="text-sm text-white font-medium mt-1 leading-relaxed">{selectedLog.action}</p>
                </div>

                {/* Human-Readable Details Grid */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wide">Key Details & Context</h3>
                  {selectedLog.details && Object.keys(selectedLog.details).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {Object.entries(selectedLog.details).map(([key, val]) => {
                        const formattedLabel = key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/_/g, ' ')
                          .trim()
                          .replace(/^\w/, (c) => c.toUpperCase());

                        let formattedVal = '';
                        if (typeof val === 'boolean') {
                          formattedVal = val ? 'Yes' : 'No';
                        } else if (Array.isArray(val)) {
                          formattedVal = val.join(', ');
                        } else if (typeof val === 'object' && val !== null) {
                          formattedVal = Object.entries(val)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(', ');
                        } else {
                          formattedVal = String(val ?? 'None');
                        }

                        return (
                          <div key={key} className="p-3 rounded-xl bg-emerald-900/20 border border-emerald-800/40">
                            <span className="text-[11px] text-emerald-400/80 font-medium block">{formattedLabel}</span>
                            <span className="text-xs text-emerald-100 font-semibold mt-0.5 block truncate" title={formattedVal}>
                              {formattedVal}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-emerald-900/20 border border-emerald-800/40 text-xs text-emerald-300/80">
                      Standard routine check successfully completed.
                    </div>
                  )}
                </div>

                {/* Sanctuary Value Callout */}
                <div className="p-3.5 rounded-xl bg-teal-950/60 border border-teal-800/40 flex items-start gap-2.5 text-xs text-teal-200">
                  <Sprout className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>
                    This guidance supports consistent care habits, healthy plant growth, and steady progress in your sanctuary.
                  </span>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-xs text-emerald-400/70">
                Select an activity from the feed on the left to view detailed insights.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
