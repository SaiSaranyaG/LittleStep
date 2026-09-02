import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  SpaceProfile,
  SpaceZone,
  PlantAdoption,
  PlantSpecies,
  CareTask,
  HealthDiagnostic,
  AirQualityBaseline,
  AirTimelineEntry,
  PointTransaction,
  RewardItem,
  AgentLogEntry,
  RecommendationResult,
  UserPlantPreferences,
  PlantJourneyMilestone,
  PersonalizedRecommendation,
  UserSustainabilityPreferences,
  WeeklySustainabilitySummary,
  ChatMessage,
  RecommendationFeedback,
  LittleStepImpactProfile,
  CommunityImpactStats,
  ImpactClaimValidation,
} from '../types';
import { SAMPLE_SPACES, INITIAL_BASELINE, SAMPLE_AIR_TIMELINE, REWARD_CATALOG } from '../data/mockData';
import { PLANT_CATALOG } from '../data/plantCatalog';
import { useAuth } from './AuthContext';
import {
  CURRENT_DATA_MODE,
  saveSpaceToCloud,
  deleteSpaceFromCloud,
  subscribeToUserSpaces,
  saveAdoptionToCloud,
  deleteAdoptionFromCloud,
  subscribeToUserAdoptions,
  saveCareTaskToCloud,
  subscribeToUserCareTasks,
  saveDiagnosticToCloud,
  deleteDiagnosticFromCloud,
  subscribeToUserDiagnostics,
  saveAirBaselineToCloud,
  subscribeToUserAirBaseline,
  savePointTransactionToCloud,
  subscribeToUserPointsTransactions,
  saveRewardRedemptionToCloud,
  subscribeToUserRewardRedemptions,
  savePreferencesToCloud,
  loadPreferencesFromCloud,
  savePlantPreferencesToCloud,
  loadPlantPreferencesFromCloud,
} from '../services/dataService';
import { trackAnalyticsEvent } from '../services/analyticsService';


interface AppContextType {
  // Navigation State
  activeTab: 'explore' | 'dashboard' | 'spaces' | 'plants' | 'environment' | 'rewards' | 'agents' | 'impact';
  setActiveTab: (tab: 'explore' | 'dashboard' | 'spaces' | 'plants' | 'environment' | 'rewards' | 'agents' | 'impact') => void;

  // Space Management
  spaces: SpaceProfile[];
  activeSpace: SpaceProfile;
  setActiveSpace: (space: SpaceProfile) => void;
  isScanningSpace: boolean;
  scanSpacePhoto: (imageBase64: string, spaceType: string, referenceBenchmark?: string) => Promise<SpaceProfile>;
  confirmSpace: (spaceId: string, lengthFt: number, widthFt: number, zones: SpaceZone[]) => void;
  addOrUpdateZone: (spaceId: string, zone: SpaceZone) => void;

  // Plant Management & Adoptions
  plantCatalog: PlantSpecies[];
  adoptions: PlantAdoption[];
  activePlant: PlantAdoption | null;
  setActivePlant: (plant: PlantAdoption | null) => void;
  userPreferences: UserPlantPreferences;
  setUserPreferences: (prefs: UserPlantPreferences) => void;
  adoptPlant: (
    speciesId: string,
    spaceId: string,
    zoneId: string,
    nickname: string,
    recommendationId?: string
  ) => Promise<PlantAdoption>;
  confirmPlantSetup: (
    adoptionId: string,
    setupPhotoBase64?: string,
    setupNotes?: string
  ) => Promise<void>;
  explainPlantRecommendation: (
    species: PlantSpecies,
    targetZone: SpaceZone,
    question?: string
  ) => Promise<{ explanation: string; placementAdvice: string; careTip?: string }>;
  careTasks: CareTask[];
  completeCareTask: (taskId: string) => Promise<void>;

  // Health Diagnostics
  diagnostics: HealthDiagnostic[];
  isAnalyzingHealth: boolean;
  runHealthCheck: (
    adoptionId: string,
    imageBase64: string,
    notes?: string
  ) => Promise<HealthDiagnostic>;
  deleteHealthObservation: (observationId: string) => void;
  updateHealthObservationNotes: (observationId: string, notes: string) => void;
  resolvePlantRecovery: (diagnosticId: string, adoptionId: string) => Promise<void>;

  // Recommendation Engine & Sustainability
  recommendation: RecommendationResult | null;
  isLoadingRecommendation: boolean;
  refreshRecommendation: () => Promise<void>;

  // Air Environment Tracking
  baseline: AirQualityBaseline;
  airTimeline: AirTimelineEntry[];
  updateBaseline: (updated: Partial<AirQualityBaseline>) => Promise<void>;
  addAirLogEntry: (
    entry: Omit<AirTimelineEntry, 'id' | 'dayNumber' | 'date'>
  ) => Promise<void>;

  // Rewards & Verified Ledger
  totalPoints: number;
  currentLevel: number;
  longestStreak: number;
  transactions: PointTransaction[];
  rewards: RewardItem[];
  redeemReward: (rewardId: string) => Promise<boolean>;

  // Agent Telemetry & Analytics
  agentLogs: AgentLogEntry[];
  addAgentLog: (
    agentName: AgentLogEntry['agentName'],
    action: string,
    details: Record<string, unknown>,
    status?: AgentLogEntry['status']
  ) => void;
  trackAnalyticsEvent: (eventName: string, properties?: Record<string, unknown>) => Promise<void>;

  // Phase 8: Personalization & Orchestrator
  nextLittleStep: PersonalizedRecommendation | null;
  isLoadingNextStep: boolean;
  refreshNextLittleStep: () => Promise<void>;
  completeNextLittleStep: (recId: string) => Promise<void>;
  dismissNextLittleStep: (recId: string, feedback?: Partial<RecommendationFeedback>) => Promise<void>;
  submitRecommendationFeedback: (recId: string, isHelpful: boolean, reason?: string, comment?: string) => Promise<void>;
  sustainabilityPreferences: UserSustainabilityPreferences;
  updateSustainabilityPreferences: (prefs: Partial<UserSustainabilityPreferences>) => void;
  weeklySummary: WeeklySustainabilitySummary | null;
  isLoadingWeeklySummary: boolean;
  refreshWeeklySummary: () => Promise<void>;
  chatMessages: ChatMessage[];
  isChatSending: boolean;
  sendChatMessage: (text: string) => Promise<void>;
  clearChatHistory: () => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  isPreferencesModalOpen: boolean;
  setIsPreferencesModalOpen: (open: boolean) => void;
  isWeeklySummaryModalOpen: boolean;
  setIsWeeklySummaryModalOpen: (open: boolean) => void;

  // Phase 9: Impact, Insights & Community
  impactProfile: LittleStepImpactProfile | null;
  isLoadingImpact: boolean;
  refreshImpactProfile: () => Promise<void>;
  communityStats: CommunityImpactStats | null;
  isLoadingCommunity: boolean;
  refreshCommunityStats: () => Promise<void>;
  joinCommunityChallenge: (challengeId: string) => void;
  validateScientificClaim: (statement: string) => Promise<ImpactClaimValidation>;
  clearUserDataPermanently: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  SPACES: 'littlestep_spaces_v1',
  ADOPTIONS: 'littlestep_adoptions_v1',
  TASKS: 'littlestep_tasks_v1',
  DIAGNOSTICS: 'littlestep_diagnostics_v1',
  BASELINE: 'littlestep_baseline_v1',
  TIMELINE: 'littlestep_timeline_v1',
  POINTS: 'littlestep_points_v1',
  TRANSACTIONS: 'littlestep_transactions_v1',
  REWARDS: 'littlestep_rewards_v1',
  LOGS: 'littlestep_logs_v1',
  PREFERENCES: 'littlestep_preferences_v1',
  SUSTAINABILITY_PREFS: 'littlestep_sust_prefs_v1',
  NEXT_STEP: 'littlestep_next_step_v1',
  CHAT_MESSAGES: 'littlestep_chat_v1',
};

const DEFAULT_SUSTAINABILITY_PREFERENCES: UserSustainabilityPreferences = {
  experienceLevel: 'beginner',
  availableTimeDaily: '5_mins',
  maintenanceTolerance: 'low',
  preferredPlantCount: 'modest_2_3',
  indoorOutdoorPreference: 'both',
  petSafeStrict: false,
  lowMaintenanceFirst: true,
  notificationPacing: 'daily_single_step',
};

const DEFAULT_PREFERENCES: UserPlantPreferences = {
  plantStyle: 'low_maintenance',
  maintenancePreference: 'low',
  petInHousehold: false,
  priorExperience: 'beginner',
  desiredLocationType: 'shelf_table',
};

const INITIAL_MILESTONES = (adoptedDate: string, plantName: string): PlantJourneyMilestone[] => [
  {
    day: 1,
    title: 'Adoption & Setup Verification',
    description: `Placed ${plantName} in designated light zone and took initial baseline photo.`,
    actionRequired: 'Capture and confirm setup photograph in zone.',
    isUnlocked: true,
    isCompleted: true,
    completedAt: adoptedDate,
    pointsAwarded: 20,
    badgeName: 'First LittleStep',
  },
  {
    day: 7,
    title: '7-Day Acclimation & Hydration',
    description: 'First scheduled hydration & light check completed.',
    actionRequired: 'Check soil moisture depth and log condition.',
    isUnlocked: false,
    isCompleted: false,
    pointsAwarded: 20,
    badgeName: 'Green Acclimation',
  },
  {
    day: 30,
    title: '30-Day Root Establishment',
    description: 'Survived the crucial first month transition period.',
    actionRequired: 'Log 30-day health diagnostic photo.',
    isUnlocked: false,
    isCompleted: false,
    pointsAwarded: 50,
    badgeName: 'Root Guardian',
  },
  {
    day: 60,
    title: '60-Day Vegetative Growth',
    description: 'Healthy new growth shoots and consistent care rhythm.',
    isUnlocked: false,
    isCompleted: false,
    pointsAwarded: 75,
    badgeName: 'Foliage Friend',
  },
  {
    day: 90,
    title: '90-Day Seasonal Resilience',
    description: 'Adapted through quarterly temperature and light variations.',
    isUnlocked: false,
    isCompleted: false,
    pointsAwarded: 100,
    badgeName: 'LittleStep Master',
  },
  {
    day: 180,
    title: '180-Day Canopy Companion',
    description: 'Half-year continuous companionship and thriving status.',
    isUnlocked: false,
    isCompleted: false,
    pointsAwarded: 150,
    badgeName: 'Canopy Steward',
  },
  {
    day: 365,
    title: '365-Day Anniversary Milestone',
    description: 'One full year of thriving life created in your space!',
    isUnlocked: false,
    isCompleted: false,
    pointsAwarded: 300,
    badgeName: 'Ecosystem Hero',
  },
];

export const EMPTY_SPACE_PROFILE: SpaceProfile = {
  id: 'space-empty',
  name: 'No Space Added Yet',
  spaceType: 'indoor_room',
  lengthFt: 0,
  widthFt: 0,
  usableAreaSqFt: 0,
  plantCapacityEstimate: 4,
  currentUtilizationPct: 0,
  measurementMethod: 'user_confirmed',
  confidence: 1.0,
  requiresConfirmation: false,
  zones: [],
  lastScannedAt: new Date().toISOString(),
};

export const EMPTY_BASELINE: AirQualityBaseline = {
  id: 'baseline-uncalibrated',
  spaceId: '',
  locationName: 'Uncalibrated Sanctuary',
  establishedAt: new Date().toISOString(),
  outdoorAqi: {
    value: 0,
    unit: 'US-AQI',
    sourceType: 'EXTERNAL_DATA',
    sourceLabel: 'Not calibrated',
    confidence: 0,
  },
  outdoorPm25: {
    value: 0,
    unit: 'µg/m³',
    sourceType: 'EXTERNAL_DATA',
    sourceLabel: 'Not calibrated',
    confidence: 0,
  },
  outdoorPm10: {
    value: 0,
    unit: 'µg/m³',
    sourceType: 'EXTERNAL_DATA',
    sourceLabel: 'Not calibrated',
    confidence: 0,
  },
  indoorTemp: {
    value: 24.0,
    unit: '°C',
    sourceType: 'USER_PROVIDED',
    sourceLabel: 'Standard ambient baseline',
    confidence: 0.5,
  },
  indoorHumidity: {
    value: 50,
    unit: '%',
    sourceType: 'USER_PROVIDED',
    sourceLabel: 'Standard ambient baseline',
    confidence: 0.5,
  },
  isUserVerified: false,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, getAuthIdToken } = useAuth();

  const [activeTab, setActiveTab] = useState<'explore' | 'dashboard' | 'spaces' | 'plants' | 'environment' | 'rewards' | 'agents' | 'impact'>(
    'dashboard'
  );

  // Helper to make authenticated API calls with token
  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    try {
      const token = await getAuthIdToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Failed to retrieve auth token for request:', e);
    }
    return headers;
  };

  // Spaces
  const [spaces, setSpaces] = useState<SpaceProfile[]>(() => {
    if (CURRENT_DATA_MODE === 'mock') {
      const saved = localStorage.getItem(STORAGE_KEYS.SPACES);
      return saved ? JSON.parse(saved) : SAMPLE_SPACES;
    }
    return [];
  });
  const [activeSpace, setActiveSpace] = useState<SpaceProfile>(() => spaces[0] || EMPTY_SPACE_PROFILE);
  const [isScanningSpace, setIsScanningSpace] = useState(false);

  // Plants & Adoptions
  const [plantCatalog] = useState<PlantSpecies[]>(PLANT_CATALOG);
  const [adoptions, setAdoptions] = useState<PlantAdoption[]>(() => {
    if (CURRENT_DATA_MODE === 'mock') {
      const saved = localStorage.getItem(STORAGE_KEYS.ADOPTIONS);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [activePlant, setActivePlant] = useState<PlantAdoption | null>(null);

  // Care Tasks
  const [careTasks, setCareTasks] = useState<CareTask[]>(() => {
    if (CURRENT_DATA_MODE === 'mock') {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Health Diagnostics
  const [diagnostics, setDiagnostics] = useState<HealthDiagnostic[]>(() => {
    if (CURRENT_DATA_MODE === 'mock') {
      const saved = localStorage.getItem(STORAGE_KEYS.DIAGNOSTICS);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [isAnalyzingHealth, setIsAnalyzingHealth] = useState(false);

  // Air Baseline & Timeline
  const [baseline, setBaseline] = useState<AirQualityBaseline>(() => {
    if (CURRENT_DATA_MODE === 'mock') {
      const saved = localStorage.getItem(STORAGE_KEYS.BASELINE);
      return saved ? JSON.parse(saved) : INITIAL_BASELINE;
    }
    return EMPTY_BASELINE;
  });
  const [airTimeline, setAirTimeline] = useState<AirTimelineEntry[]>(() => {
    if (CURRENT_DATA_MODE === 'mock') {
      const saved = localStorage.getItem(STORAGE_KEYS.TIMELINE);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Points & Rewards
  const [totalPoints, setTotalPoints] = useState<number>(() => {
    if (CURRENT_DATA_MODE === 'mock') {
      const saved = localStorage.getItem(STORAGE_KEYS.POINTS);
      return saved ? JSON.parse(saved) : 0;
    }
    return 0;
  });
  const [transactions, setTransactions] = useState<PointTransaction[]>(() => {
    if (CURRENT_DATA_MODE === 'mock') {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [rewards, setRewards] = useState<RewardItem[]>(REWARD_CATALOG);

  // Agent Telemetry Logs
  const [agentLogs, setAgentLogs] = useState<AgentLogEntry[]>([]);

  // Recommendation State
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);

  // Phase 8: Sustainability Preferences
  const [sustainabilityPreferences, setSustainabilityPreferences] = useState<UserSustainabilityPreferences>(
    DEFAULT_SUSTAINABILITY_PREFERENCES
  );

  // Phase 8: Next LittleStep Action
  const [nextLittleStep, setNextLittleStep] = useState<PersonalizedRecommendation | null>(null);
  const [isLoadingNextStep, setIsLoadingNextStep] = useState(false);

  // Phase 8: Weekly Summary & Chat State
  const [weeklySummary, setWeeklySummary] = useState<WeeklySustainabilitySummary | null>(null);
  const [isLoadingWeeklySummary, setIsLoadingWeeklySummary] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatSending, setIsChatSending] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const [isWeeklySummaryModalOpen, setIsWeeklySummaryModalOpen] = useState(false);

  // Phase 9: Impact & Community States
  const [impactProfile, setImpactProfile] = useState<LittleStepImpactProfile | null>(null);
  const [isLoadingImpact, setIsLoadingImpact] = useState(false);
  const [communityStats, setCommunityStats] = useState<CommunityImpactStats | null>(null);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState(false);

  // Sync to LocalStorage ONLY when user is authenticated or in explicit mock development mode
  useEffect(() => {
    if (!user?.uid && CURRENT_DATA_MODE !== 'mock') return;
    localStorage.setItem(STORAGE_KEYS.SPACES, JSON.stringify(spaces));
  }, [spaces, user?.uid]);
  useEffect(() => {
    if (!user?.uid && CURRENT_DATA_MODE !== 'mock') return;
    localStorage.setItem(STORAGE_KEYS.ADOPTIONS, JSON.stringify(adoptions));
  }, [adoptions, user?.uid]);
  useEffect(() => {
    if (!user?.uid && CURRENT_DATA_MODE !== 'mock') return;
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(careTasks));
  }, [careTasks, user?.uid]);
  useEffect(() => {
    if (!user?.uid && CURRENT_DATA_MODE !== 'mock') return;
    localStorage.setItem(STORAGE_KEYS.DIAGNOSTICS, JSON.stringify(diagnostics));
  }, [diagnostics, user?.uid]);
  useEffect(() => {
    if (!user?.uid && CURRENT_DATA_MODE !== 'mock') return;
    localStorage.setItem(STORAGE_KEYS.BASELINE, JSON.stringify(baseline));
  }, [baseline, user?.uid]);
  useEffect(() => {
    if (!user?.uid && CURRENT_DATA_MODE !== 'mock') return;
    localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(airTimeline));
  }, [airTimeline, user?.uid]);
  useEffect(() => {
    if (!user?.uid && CURRENT_DATA_MODE !== 'mock') return;
    localStorage.setItem(STORAGE_KEYS.POINTS, JSON.stringify(totalPoints));
  }, [totalPoints, user?.uid]);
  useEffect(() => {
    if (!user?.uid && CURRENT_DATA_MODE !== 'mock') return;
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions, user?.uid]);
  useEffect(() => {
    if (!user?.uid && CURRENT_DATA_MODE !== 'mock') return;
    localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
  }, [rewards, user?.uid]);
  useEffect(() => {
    if (!user?.uid && CURRENT_DATA_MODE !== 'mock') return;
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(agentLogs));
  }, [agentLogs, user?.uid]);
  useEffect(() => {
    if (!user?.uid && CURRENT_DATA_MODE !== 'mock') return;
    localStorage.setItem(STORAGE_KEYS.SUSTAINABILITY_PREFS, JSON.stringify(sustainabilityPreferences));
  }, [sustainabilityPreferences, user?.uid]);
  useEffect(() => {
    if (!user?.uid && CURRENT_DATA_MODE !== 'mock') return;
    if (nextLittleStep) {
      localStorage.setItem(STORAGE_KEYS.NEXT_STEP, JSON.stringify(nextLittleStep));
    }
  }, [nextLittleStep, user?.uid]);
  useEffect(() => {
    if (!user?.uid && CURRENT_DATA_MODE !== 'mock') return;
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(chatMessages));
  }, [chatMessages, user?.uid]);

  // Real-time Firestore Cloud Sync (Active when user is authenticated)
  useEffect(() => {
    if (!user?.uid) {
      if (CURRENT_DATA_MODE !== 'mock') {
        setSpaces([]);
        setActiveSpace(EMPTY_SPACE_PROFILE);
        setAdoptions([]);
        setActivePlant(null);
        setCareTasks([]);
        setDiagnostics([]);
        setBaseline(EMPTY_BASELINE);
        setAirTimeline([]);
        setTotalPoints(0);
        setTransactions([]);
        setAgentLogs([]);
        setRecommendation(null);
        setNextLittleStep(null);
        setWeeklySummary(null);
        setImpactProfile(null);
        setCommunityStats(null);
        setChatMessages([]);
      }
      return;
    }

    if (CURRENT_DATA_MODE === 'mock') return;

    // 1. Subscribe to Spaces
    const unsubSpaces = subscribeToUserSpaces(user.uid, (cloudSpaces) => {
      if (cloudSpaces && cloudSpaces.length > 0) {
        setSpaces(cloudSpaces);
        setActiveSpace((prev) => {
          const match = cloudSpaces.find((s) => s.id === prev?.id);
          return match || cloudSpaces[0];
        });
      } else {
        setSpaces([]);
        setActiveSpace(EMPTY_SPACE_PROFILE);
      }
    });

    // 2. Subscribe to Adoptions
    const unsubAdoptions = subscribeToUserAdoptions(user.uid, (cloudAdoptions) => {
      if (cloudAdoptions && cloudAdoptions.length > 0) {
        setAdoptions(cloudAdoptions);
        setActivePlant((prev) => {
          const match = cloudAdoptions.find((a) => a.id === prev?.id);
          return match || cloudAdoptions[0];
        });
      } else {
        setAdoptions([]);
        setActivePlant(null);
      }
    });

    // 3. Subscribe to Care Tasks
    const unsubTasks = subscribeToUserCareTasks(user.uid, (cloudTasks) => {
      setCareTasks(cloudTasks || []);
    });

    // 4. Subscribe to Diagnostics
    const unsubDiags = subscribeToUserDiagnostics(user.uid, (cloudDiags) => {
      setDiagnostics(cloudDiags || []);
    });

    // 5. Subscribe to Air Baseline
    const unsubBaseline = subscribeToUserAirBaseline(user.uid, (cloudBaseline) => {
      if (cloudBaseline) {
        setBaseline(cloudBaseline);
      }
    });

    // 6. Subscribe to Points Transactions
    const unsubTx = subscribeToUserPointsTransactions(user.uid, (cloudTx) => {
      if (cloudTx && cloudTx.length > 0) {
        setTransactions(cloudTx);
        const total = cloudTx.reduce((sum, t) => sum + (t.points || 0), 0);
        setTotalPoints(Math.max(0, total));
      } else {
        setTransactions([]);
        setTotalPoints(0);
      }
    });

    // 7. Subscribe to Reward Redemptions
    const unsubRewards = subscribeToUserRewardRedemptions(user.uid, (redeemedMap) => {
      setRewards((prev) =>
        prev.map((r) => ({
          ...r,
          isRedeemed: !!redeemedMap[r.id] || r.isRedeemed,
        }))
      );
    });

    // 8. Load user preferences
    loadPreferencesFromCloud(user.uid).then((prefs) => {
      if (prefs) {
        setSustainabilityPreferences(prefs);
      }
    });
    loadPlantPreferencesFromCloud(user.uid).then((prefs) => {
      if (prefs) {
        setUserPreferencesState(prefs);
      }
    });

    return () => {
      unsubSpaces?.();
      unsubAdoptions?.();
      unsubTasks?.();
      unsubDiags?.();
      unsubBaseline?.();
      unsubTx?.();
      unsubRewards?.();
    };
  }, [user?.uid]);


  // Derived metrics
  const currentLevel = Math.floor(totalPoints / 100) + 1;
  const longestStreak = adoptions.reduce((max, a) => Math.max(max, a.streakDays), 0);

  const addAgentLog = (
    agentName: AgentLogEntry['agentName'],
    action: string,
    details: Record<string, unknown>,
    status: AgentLogEntry['status'] = 'success'
  ) => {
    const entry: AgentLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      agentName,
      action,
      timestamp: new Date().toISOString(),
      status,
      details,
    };
    setAgentLogs((prev) => [entry, ...prev.slice(0, 49)]);
  };

  // Trigger server-side verified points award
  const awardPoints = async (
    actionType: PointTransaction['actionType'],
    description: string,
    adoptionId?: string
  ) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/points/verify', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          actionType,
          currentTotal: totalPoints,
          currentStreakDays: longestStreak,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTotalPoints(data.newTotal);
        const newTx: PointTransaction = {
          id: `tx-${Date.now()}`,
          actionType,
          description,
          points: data.pointsAwarded,
          timestamp: data.timestamp,
          adoptionId,
          verifiedServerSide: true,
        };
        setTransactions((prev) => [newTx, ...prev]);

        if (user?.uid) {
          savePointTransactionToCloud(user.uid, newTx).catch((err) =>
            console.warn('Point transaction cloud sync failed:', err)
          );
        }

        addAgentLog('Reward Agent', `Verified & awarded +${data.pointsAwarded} points for ${actionType}`, {
          actionType,
          pointsAwarded: data.pointsAwarded,
          newTotal: data.newTotal,
          serverVerified: true,
        });

        // Trigger celebratory confetti for milestones or big actions
        if (data.pointsAwarded >= 20) {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#10b981', '#34d399', '#059669', '#f59e0b'],
          });
        }
      }
    } catch {
      // Fallback
      const fallbackPoints = 5;
      setTotalPoints((prev) => prev + fallbackPoints);
      const fallbackTx: PointTransaction = {
        id: `tx-${Date.now()}`,
        actionType,
        description,
        points: fallbackPoints,
        timestamp: new Date().toISOString(),
        adoptionId,
        verifiedServerSide: false,
      };
      setTransactions((prev) => [fallbackTx, ...prev]);

      if (user?.uid) {
        savePointTransactionToCloud(user.uid, fallbackTx).catch((err) =>
          console.warn('Point transaction fallback cloud sync failed:', err)
        );
      }
    }
  };

  // Space Scan Flow
  const scanSpacePhoto = async (
    imageBase64: string,
    spaceType: string,
    referenceBenchmark?: string
  ): Promise<SpaceProfile> => {
    setIsScanningSpace(true);
    addAgentLog('Space Assessment Agent', `Initiating multimodal perception scan on ${spaceType} photograph`, {
      spaceType,
      referenceBenchmark: referenceBenchmark || 'Auto-calibrating via doorway/railing cues',
    });

    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/agents/space-scan', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          imageBase64,
          spaceType,
          referenceBenchmark,
        }),
      });
      const data = await res.json();
      const result = data?.data || {};

      const newSpace: SpaceProfile = {
        id: `space-${Date.now()}`,
        name: `Scanned ${spaceType.charAt(0).toUpperCase() + spaceType.slice(1)}`,
        spaceType: result.space_type || spaceType,
        lengthFt: result.estimated_length_ft || 7.5,
        widthFt: result.estimated_width_ft || 4.5,
        usableAreaSqFt: result.usable_area_sqft || 24,
        confidence: result.confidence || 0.85,
        measurementMethod: result.measurement_method || 'visual_estimation',
        requiresConfirmation: result.requires_user_confirmation ?? true,
        plantCapacityEstimate: result.plant_capacity_estimate || 6,
        currentUtilizationPct: 0,
        photoUrl: imageBase64,
        safetyWarnings: result.safety_warnings || [],
        referenceBenchmark: referenceBenchmark || result.confirmation_prompt,
        lastScannedAt: new Date().toISOString(),
        zones: (result.zones || []).map((z: any, idx: number) => ({
          id: z.id || `zone-${idx + 1}`,
          name: z.name || `Zone ${idx + 1}`,
          zoneType: z.zoneType || 'plant_zone',
          lightLevel: z.lightLevel || 'bright_indirect',
          color: z.color || (idx === 0 ? '#f59e0b' : '#10b981'),
          x: z.x ?? (idx * 30 + 10),
          y: z.y ?? 15,
          w: z.w ?? 35,
          h: z.h ?? 35,
          recommendedSize: z.recommendedSize || 'medium',
          notes: z.notes || 'Identified plant growth zone',
        })),
      };

      setSpaces((prev) => [newSpace, ...prev]);
      setActiveSpace(newSpace);

      if (user?.uid) {
        saveSpaceToCloud(user.uid, newSpace).catch((err) =>
          console.warn('Space cloud save failed:', err)
        );
      }

      addAgentLog(
        'Space Assessment Agent',
        `Space mapped successfully: ${newSpace.usableAreaSqFt} sq.ft usable area, estimated capacity ${newSpace.plantCapacityEstimate} plants`,
        {
          usableAreaSqFt: newSpace.usableAreaSqFt,
          confidence: newSpace.confidence,
          zonesCount: newSpace.zones.length,
          requiresConfirmation: newSpace.requiresConfirmation,
        }
      );

      trackAnalyticsEvent('space_assessed', {
        spaceId: newSpace.id,
        spaceType: newSpace.spaceType,
        usableAreaSqFt: newSpace.usableAreaSqFt,
        confidence: newSpace.confidence,
      });

      return newSpace;
    } catch (err) {
      console.warn('Space scan fallback activated:', err);
      const fallbackSpace: SpaceProfile = {
        id: `space-${Date.now()}`,
        name: `Scanned ${spaceType.charAt(0).toUpperCase() + spaceType.slice(1)} (Heuristic Estimate)`,
        spaceType: (spaceType as SpaceProfile['spaceType']) || 'balcony',
        lengthFt: 7.5,
        widthFt: 4.5,
        usableAreaSqFt: 25.3,
        confidence: 0.5,
        measurementMethod: 'visual_estimation',
        requiresConfirmation: true,
        plantCapacityEstimate: 6,
        currentUtilizationPct: 0,
        photoUrl: imageBase64,
        safetyWarnings: ['Ensure pots have stable drainage saucers.'],
        referenceBenchmark: referenceBenchmark || 'Estimated via standard architectural heuristics.',
        lastScannedAt: new Date().toISOString(),
        isFallback: true,
        dataSource: 'heuristic_fallback',
        zones: [
          {
            id: 'zone-1-sun',
            name: 'Zone A (Window / Railing Sun)',
            zoneType: 'plant_zone',
            lightLevel: 'bright_indirect',
            color: '#f59e0b',
            x: 12,
            y: 12,
            w: 48,
            h: 32,
            recommendedSize: 'medium',
            notes: 'Highest light exposure.',
          },
          {
            id: 'zone-2-ambient',
            name: 'Zone B (Shaded Floor Stand)',
            zoneType: 'plant_zone',
            lightLevel: 'medium_indirect',
            color: '#10b981',
            x: 64,
            y: 12,
            w: 28,
            h: 36,
            recommendedSize: 'small',
            notes: 'Gentle ambient illumination.',
          },
        ],
      };
      setSpaces((prev) => [fallbackSpace, ...prev]);
      setActiveSpace(fallbackSpace);

      if (user?.uid) {
        saveSpaceToCloud(user.uid, fallbackSpace).catch((err) =>
          console.error('Fallback space cloud save failed:', err)
        );
      }

      addAgentLog(
        'Space Assessment Agent',
        `Space mapped using rule-based architectural heuristics (multimodal AI service unavailable)`,
        { isFallback: true, usableAreaSqFt: fallbackSpace.usableAreaSqFt },
        'warning'
      );

      return fallbackSpace;
    } finally {
      setIsScanningSpace(false);
    }
  };

  const confirmSpace = (spaceId: string, lengthFt: number, widthFt: number, zones: SpaceZone[]) => {
    const usableArea = Math.round(lengthFt * widthFt * 0.75 * 10) / 10;
    const capacity = Math.max(2, Math.round(usableArea / 3.5));

    setSpaces((prev) =>
      prev.map((s) => {
        if (s.id === spaceId) {
          const updated: SpaceProfile = {
            ...s,
            lengthFt,
            widthFt,
            usableAreaSqFt: usableArea,
            plantCapacityEstimate: capacity,
            measurementMethod: 'user_confirmed',
            requiresConfirmation: false,
            zones,
          };
          if (activeSpace.id === spaceId) setActiveSpace(updated);
          if (user?.uid) {
            saveSpaceToCloud(user.uid, updated).catch((err) =>
              console.warn('Confirm space cloud save failed:', err)
            );
          }
          return updated;
        }
        return s;
      })
    );

    addAgentLog('Space Assessment Agent', `User verified & calibrated spatial dimensions: ${lengthFt}ft x ${widthFt}ft`, {
      spaceId,
      lengthFt,
      widthFt,
      usableArea,
      capacity,
    });
  };

  const addOrUpdateZone = (spaceId: string, zone: SpaceZone) => {
    setSpaces((prev) =>
      prev.map((s) => {
        if (s.id === spaceId) {
          const exists = s.zones.some((z) => z.id === zone.id);
          const updatedZones = exists ? s.zones.map((z) => (z.id === zone.id ? zone : z)) : [...s.zones, zone];
          const updated = { ...s, zones: updatedZones };
          if (activeSpace.id === spaceId) setActiveSpace(updated);
          if (user?.uid) {
            saveSpaceToCloud(user.uid, updated).catch((err) =>
              console.warn('Zone update space cloud save failed:', err)
            );
          }
          return updated;
        }
        return s;
      })
    );
  };

  // Preferences State
  const [userPreferences, setUserPreferencesState] = useState<UserPlantPreferences>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
  });

  const setUserPreferences = (prefs: UserPlantPreferences) => {
    setUserPreferencesState(prefs);
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
    if (user?.uid) {
      savePlantPreferencesToCloud(user.uid, prefs).catch((err) =>
        console.error('Plant preferences cloud save failed:', err)
      );
    }
    refreshRecommendation(prefs);
  };

  // Analytics Event Tracker
  const trackAnalyticsEvent = async (eventName: string, properties: Record<string, unknown> = {}) => {
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName,
          properties: {
            ...properties,
            spaceId: activeSpace?.id,
            totalPoints,
            activePlantsCount: adoptions.length,
          },
        }),
      });
    } catch {
      // Non-blocking telemetry
    }
  };

  // Plant Adoption Flow
  const adoptPlant = async (
    speciesId: string,
    spaceId: string,
    zoneId: string,
    nickname: string,
    recommendationId?: string
  ): Promise<PlantAdoption> => {
    const species = plantCatalog.find((p) => p.id === speciesId) || plantCatalog[0];
    const newAdoption: PlantAdoption = {
      id: `adopt-${Date.now()}`,
      speciesId: species.id,
      nickname: nickname || species.commonName,
      spaceId,
      zoneId,
      recommendationId,
      adoptedAt: new Date().toISOString(),
      status: 'ADOPTED',
      healthStatus: 'thriving',
      streakDays: 1,
      totalSurvivalDays: 1,
      lastWateredAt: new Date().toISOString(),
      lastHealthCheckAt: new Date().toISOString(),
      nextCareDue: new Date(Date.now() + species.waterFrequencyDays * 86400000).toISOString(),
      notes: `Placed in ${activeSpace.zones.find((z) => z.id === zoneId)?.name || 'Plant Zone'}.`,
      milestones: INITIAL_MILESTONES(new Date().toISOString(), nickname || species.commonName),
      photos: [
        {
          id: `photo-${Date.now()}`,
          url: species.imageUrl,
          timestamp: new Date().toISOString(),
          caption: `Day 1: Welcomed ${nickname} home!`,
          type: 'setup',
        },
      ],
    };

    // Update space utilization
    setSpaces((prev) =>
      prev.map((s) => {
        if (s.id === spaceId) {
          const existingCount = adoptions.filter((a) => a.spaceId === spaceId).length + 1;
          const pct = Math.min(100, Math.round((existingCount / s.plantCapacityEstimate) * 100));
          return { ...s, currentUtilizationPct: pct };
        }
        return s;
      })
    );

    // Create Initial Care Tasks
    const initialTasks: CareTask[] = [
      {
        id: `task-${Date.now()}-1`,
        adoptionId: newAdoption.id,
        taskType: 'water',
        title: `Water ${nickname}`,
        dueAt: new Date(Date.now() + species.waterFrequencyDays * 86400000).toISOString(),
        isCompleted: false,
        pointsValue: 2,
        notes: `Ideal frequency: Every ${species.waterFrequencyDays} days for ${species.commonName}.`,
      },
      {
        id: `task-${Date.now()}-2`,
        adoptionId: newAdoption.id,
        taskType: 'inspect',
        title: `First Week Acclimation Check for ${nickname}`,
        dueAt: new Date(Date.now() + 7 * 86400000).toISOString(),
        isCompleted: false,
        pointsValue: 5,
        notes: 'Inspect leaves for moisture adaptation and light placement.',
      },
    ];

    setAdoptions((prev) => [newAdoption, ...prev]);
    setActivePlant(newAdoption);
    setCareTasks((prev) => [...initialTasks, ...prev]);

    if (user?.uid) {
      saveAdoptionToCloud(user.uid, newAdoption).catch((err) =>
        console.warn('Adoption cloud save failed:', err)
      );
      initialTasks.forEach((t) => {
        saveCareTaskToCloud(user.uid, t).catch((err) =>
          console.warn('Care task cloud save failed:', err)
        );
      });
    }

    // Points & Log
    await awardPoints('PLANT_ADOPTION', `Adopted ${newAdoption.nickname} (${species.commonName})`, newAdoption.id);
    addAgentLog('Plant Recommendation Agent', `Confirmed adoption of ${newAdoption.nickname} in zone ${zoneId}`, {
      nickname: newAdoption.nickname,
      species: species.commonName,
      lightReq: species.lightRequirement,
      waterInterval: species.waterFrequencyDays,
    });

    trackAnalyticsEvent('plant_adopted', {
      plantId: species.id,
      commonName: species.commonName,
      zoneId,
      recommendationId,
    });

    return newAdoption;
  };

  // Confirm Plant Setup Flow (Placement & Photograph Verification)
  const confirmPlantSetup = async (
    adoptionId: string,
    setupPhotoBase64?: string,
    setupNotes?: string
  ) => {
    const timestamp = new Date().toISOString();
    setAdoptions((prev) =>
      prev.map((a) => {
        if (a.id === adoptionId) {
          const updatedPhotos = setupPhotoBase64
            ? [
                {
                  id: `photo-setup-${Date.now()}`,
                  url: setupPhotoBase64,
                  timestamp,
                  caption: `Physical setup confirmed in ${activeSpace?.name || 'Space'}`,
                  type: 'setup' as const,
                },
                ...a.photos,
              ]
            : a.photos;

          const updated: PlantAdoption = {
            ...a,
            status: 'SETUP_COMPLETED',
            setupConfirmedAt: timestamp,
            setupPhotoUrl: setupPhotoBase64 || a.photos[0]?.url,
            notes: setupNotes ? `${a.notes ? a.notes + ' ' : ''}${setupNotes}` : a.notes,
            photos: updatedPhotos,
          };
          if (activePlant?.id === adoptionId) setActivePlant(updated);
          if (user?.uid) {
            saveAdoptionToCloud(user.uid, updated).catch((err) =>
              console.warn('Adoption setup cloud save failed:', err)
            );
          }
          return updated;
        }
        return a;
      })
    );

    await awardPoints('PLANT_SETUP', 'Completed plant setup and zone placement verification', adoptionId);
    addAgentLog('Plant Care Agent', `Verified physical setup and placement for adoption ${adoptionId}`, {
      adoptionId,
      setupConfirmed: true,
      hasPhoto: Boolean(setupPhotoBase64),
    });

    trackAnalyticsEvent('plant_setup_completed', {
      adoptionId,
      hasSetupPhoto: Boolean(setupPhotoBase64),
    });
  };

  // Explain Plant Recommendation Interactive AI
  const explainPlantRecommendation = async (
    species: PlantSpecies,
    targetZone: SpaceZone,
    question?: string
  ) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/plants/explain', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          species,
          spaceProfile: activeSpace,
          targetZone,
          userPreferences,
          question,
        }),
      });
      const data = await res.json();
      return data?.data || {
        explanation: `${species.commonName} is recommended because its light and watering needs match ${targetZone.name}.`,
        placementAdvice: `Place in ${targetZone.name} away from direct air drafts.`,
        careTip: `Water every ${species.waterFrequencyDays} days when soil feels dry.`,
      };
    } catch {
      return {
        explanation: `${species.commonName} is ideal for your ${activeSpace.name} due to its high tolerance and compact footprint.`,
        placementAdvice: `Place in ${targetZone.name}.`,
        careTip: `Water every ${species.waterFrequencyDays} days.`,
      };
    }
  };

  // Complete Care Task Flow
  const completeCareTask = async (taskId: string) => {
    const task = careTasks.find((t) => t.id === taskId);
    if (!task || task.isCompleted) return;

    const completedTask: CareTask = { ...task, isCompleted: true, completedAt: new Date().toISOString() };

    setCareTasks((prev) =>
      prev.map((t) => (t.id === taskId ? completedTask : t))
    );

    if (user?.uid) {
      saveCareTaskToCloud(user.uid, completedTask).catch((err) =>
        console.warn('Care task cloud update failed:', err)
      );
    }

    // Update plant streak & watering date
    if (task.adoptionId) {
      setAdoptions((prev) =>
        prev.map((a) => {
          if (a.id === task.adoptionId) {
            const updated = {
              ...a,
              streakDays: a.streakDays + 1,
              totalSurvivalDays: a.totalSurvivalDays + 1,
              lastWateredAt: task.taskType === 'water' ? new Date().toISOString() : a.lastWateredAt,
            };
            if (activePlant?.id === a.id) setActivePlant(updated);
            if (user?.uid) {
              saveAdoptionToCloud(user.uid, updated).catch((err) =>
                console.warn('Adoption task sync failed:', err)
              );
            }
            return updated;
          }
          return a;
        })
      );
    }

    await awardPoints('CARE_TASK', `Completed care task: ${task.title}`, task.adoptionId);
    addAgentLog('Plant Care Agent', `Logged care task execution: ${task.title}`, {
      taskId: task.id,
      taskType: task.taskType,
      points: task.pointsValue,
    });
  };

  // Health Diagnostic Agent Flow (Phase 6 AI Visual Plant Check)
  const runHealthCheck = async (
    adoptionId: string,
    imageBase64: string,
    notes?: string
  ): Promise<HealthDiagnostic> => {
    setIsAnalyzingHealth(true);
    const targetPlant = adoptions.find((a) => a.id === adoptionId);
    const species = plantCatalog.find((p) => p.id === targetPlant?.speciesId);
    const zone = activeSpace.zones.find((z) => z.id === targetPlant?.zoneId) || activeSpace.zones[0];
    const previousDiag = diagnostics.find((d) => d.adoptionId === adoptionId);
    const previousStatus = previousDiag?.healthStatus || targetPlant?.healthStatus || 'healthy';

    // Calculate days since last watered
    const lastWateredDaysAgo = targetPlant?.lastWateredAt
      ? Math.max(0, Math.floor((Date.now() - new Date(targetPlant.lastWateredAt).getTime()) / (1000 * 60 * 60 * 24)))
      : 3;

    trackAnalyticsEvent('plant_health_check_started', {
      adoptionId,
      speciesId: species?.id,
      previousStatus,
    });

    addAgentLog('Plant Health Agent', `Initiating multimodal leaf diagnostic for ${targetPlant?.nickname || 'Plant'}`, {
      adoptionId,
      species: species?.commonName,
      zone: zone?.name,
      lastWateredDaysAgo,
      userNotes: notes,
    });

    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/agents/health-check', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          imageBase64,
          plantNickname: targetPlant?.nickname,
          speciesName: species?.commonName,
          speciesDetails: species,
          spaceZone: zone,
          careHistory: {
            lastWateredDaysAgo,
            streakDays: targetPlant?.streakDays || 0,
            survivalDays: targetPlant?.totalSurvivalDays || 1,
          },
          userNotes: notes,
        }),
      });
      const data = await res.json();
      const result = data?.data || {};

      const diagnostic: HealthDiagnostic = {
        id: `diag-${Date.now()}`,
        adoptionId,
        timestamp: new Date().toISOString(),
        photoUrl: imageBase64,
        healthStatus: result.healthStatus || 'watch',
        confidenceScore: result.confidenceScore || 0.85,
        confidenceLevel: result.confidenceLevel || 'medium',
        imageQuality: result.imageQuality || {
          score: 0.9,
          status: 'GOOD',
          isPlantVisible: true,
          isClear: true,
          hasAdequateLighting: true,
          feedback: 'Plant photo captured with good clarity and framing.',
        },
        visualSymptoms: result.visualSymptoms || ['Foliage posture recorded; monitoring hydration and light balance.'],
        possibleCauses: result.possibleCauses || [
          { cause: 'Moisture dry-cycle overdue', likelihood: 'probable', description: 'Evaluate soil dampness before watering.' },
          { cause: 'Natural lower leaf aging', likelihood: 'possible', description: 'Older leaf senescence is standard botanical growth.' },
        ],
        recommendedActionPlan: result.recommendedActionPlan || 'Inspect soil moisture depth and hydrate if dry.',
        recommendedActions: result.recommendedActions || [
          'Perform tactile finger test 2 inches into soil',
          'Empty drainage saucer after watering',
          'Continue observing over next 5-7 days',
        ],
        careHistoryContext: result.careHistoryContext || `Last watered approximately ${lastWateredDaysAgo} days ago.`,
        spaceContextAdvice: result.spaceContextAdvice || `Zone ${zone?.name || 'A'} provides consistent ambient light.`,
        urgency: result.urgency || 'low',
        followUpDays: result.followUpDays || 7,
        userNotes: notes,
        scientificDisclaimer:
          result.scientificDisclaimer ||
          'Visual analysis is advisory guidance and should be verified with physical soil moisture testing.',
      };

      setDiagnostics((prev) => [diagnostic, ...prev]);

      if (user?.uid) {
        saveDiagnosticToCloud(user.uid, diagnostic).catch((err) =>
          console.warn('Diagnostic cloud save failed:', err)
        );
      }

      // Check for health improvement from previous distressed state
      const wasDistressed = previousStatus === 'needs_attention' || previousStatus === 'critical' || previousStatus === 'watch';
      const isNowHealthy = diagnostic.healthStatus === 'healthy' || diagnostic.healthStatus === 'thriving';
      const isImproved = wasDistressed && isNowHealthy;

      // Update plant status & append progress photo
      setAdoptions((prev) =>
        prev.map((a) => {
          if (a.id === adoptionId) {
            const updated: PlantAdoption = {
              ...a,
              healthStatus: diagnostic.healthStatus,
              lastHealthCheckAt: diagnostic.timestamp,
              photos: [
                {
                  id: `photo-${Date.now()}`,
                  url: imageBase64,
                  timestamp: diagnostic.timestamp,
                  caption: `Health Check: ${diagnostic.healthStatus.toUpperCase()} (${diagnostic.visualSymptoms[0] || 'Inspection'})`,
                  type: 'triage' as const,
                },
                ...a.photos,
              ],
            };
            if (activePlant?.id === adoptionId) setActivePlant(updated);
            if (user?.uid) {
              saveAdoptionToCloud(user.uid, updated).catch((err) =>
                console.warn('Adoption health status sync failed:', err)
              );
            }
            return updated;
          }
          return a;
        })
      );

      // Award points for completing legitimate visual check (+5 pts)
      await awardPoints('PROGRESS_PHOTO', `Logged visual health check for ${targetPlant?.nickname}`, adoptionId);

      // If plant recovered, award recovery milestone (+50 pts)
      if (isImproved) {
        await awardPoints('SUCCESSFUL_RECOVERY', `Successfully helped ${targetPlant?.nickname} recover to healthy state!`, adoptionId);
        trackAnalyticsEvent('plant_health_improved', {
          adoptionId,
          speciesId: species?.id,
          previousStatus,
          currentStatus: diagnostic.healthStatus,
        });
      } else if (diagnostic.healthStatus === 'needs_attention' || diagnostic.healthStatus === 'critical') {
        trackAnalyticsEvent('plant_health_attention_detected', {
          adoptionId,
          speciesId: species?.id,
          urgency: diagnostic.urgency,
        });
      }

      trackAnalyticsEvent('plant_health_check_completed', {
        adoptionId,
        speciesId: species?.id,
        status: diagnostic.healthStatus,
        confidence: diagnostic.confidenceScore,
        imageQualityStatus: diagnostic.imageQuality?.status,
      });

      trackAnalyticsEvent('plant_health_observation_created', {
        observationId: diagnostic.id,
        adoptionId,
        symptomsCount: diagnostic.visualSymptoms.length,
      });

      addAgentLog(
        'Plant Health Agent',
        `Diagnostic complete for ${targetPlant?.nickname}: ${diagnostic.healthStatus.toUpperCase()} (Confidence: ${diagnostic.confidenceLevel?.toUpperCase() || 'MEDIUM'})`,
        {
          symptoms: diagnostic.visualSymptoms,
          urgency: diagnostic.urgency,
          isImproved,
          causesCount: diagnostic.possibleCauses.length,
          imageQuality: diagnostic.imageQuality?.status,
        },
        diagnostic.healthStatus === 'critical' ? 'warning' : 'success'
      );

      return diagnostic;
    } catch (err) {
      console.warn('Health check fallback activated:', err);
      const fallbackDiag: HealthDiagnostic = {
        id: `diag-${Date.now()}`,
        adoptionId,
        timestamp: new Date().toISOString(),
        photoUrl: imageBase64,
        healthStatus: 'watch',
        confidenceScore: 0.5,
        confidenceLevel: 'low',
        isFallback: true,
        dataSource: 'heuristic_fallback',
        imageQuality: {
          score: 0.7,
          status: 'FAIR',
          isPlantVisible: true,
          isClear: true,
          hasAdequateLighting: true,
          feedback: 'Visual observation recorded for rule-based evaluation.',
        },
        visualSymptoms: ['Rule-based physical inspection recorded; checking moisture and light conditions.'],
        possibleCauses: [{ cause: 'Moisture cycle review', likelihood: 'probable', description: 'Test soil depth before watering.' }],
        recommendedActionPlan: 'Perform tactile finger check 2 inches down in soil before watering.',
        recommendedActions: [
          'Perform tactile finger test in soil to 2 inches depth',
          'Empty drainage tray to prevent root stagnation',
          'Monitor over the next 5-7 days',
        ],
        careHistoryContext: `Last recorded watering approximately ${lastWateredDaysAgo} days ago.`,
        spaceContextAdvice: `Positioned in ${zone?.name || 'Space'}.`,
        urgency: 'low',
        followUpDays: 7,
        userNotes: notes,
        scientificDisclaimer: '⚡ Rule-based heuristic guidance (AI vision model offline). Verify with tactile check.',
      };
      setDiagnostics((prev) => [fallbackDiag, ...prev]);

      if (user?.uid) {
        saveDiagnosticToCloud(user.uid, fallbackDiag).catch((err) =>
          console.error('Fallback diagnostic save failed:', err)
        );
      }

      addAgentLog(
        'Plant Health Agent',
        `Health evaluation recorded via rule-based heuristics fallback (vision AI unavailable)`,
        { adoptionId, isFallback: true },
        'warning'
      );

      return fallbackDiag;
    } finally {
      setIsAnalyzingHealth(false);
    }
  };

  // Delete Health Observation
  const deleteHealthObservation = (observationId: string) => {
    setDiagnostics((prev) => prev.filter((d) => d.id !== observationId));
    if (user?.uid) {
      deleteDiagnosticFromCloud(user.uid, observationId).catch((err) =>
        console.warn('Delete diagnostic from cloud failed:', err)
      );
    }
    addAgentLog('Plant Health Agent', `Removed health observation record ${observationId}`, {
      observationId,
    });
  };

  // Update Health Observation Notes
  const updateHealthObservationNotes = (observationId: string, notes: string) => {
    setDiagnostics((prev) =>
      prev.map((d) => {
        if (d.id === observationId) {
          const updated = { ...d, userNotes: notes };
          if (user?.uid) {
            saveDiagnosticToCloud(user.uid, updated).catch((err) =>
              console.warn('Update diagnostic notes cloud save failed:', err)
            );
          }
          return updated;
        }
        return d;
      })
    );
  };

  // Resolve Plant Recovery (Reward Milestone)
  const resolvePlantRecovery = async (diagnosticId: string, adoptionId: string) => {
    setDiagnostics((prev) =>
      prev.map((d) => {
        if (d.id === diagnosticId) {
          const updated: HealthDiagnostic = {
            ...d,
            isResolved: true,
            resolutionTimestamp: new Date().toISOString(),
            healthStatus: 'healthy',
          };
          if (user?.uid) {
            saveDiagnosticToCloud(user.uid, updated).catch((err) =>
              console.warn('Resolve diagnostic cloud save failed:', err)
            );
          }
          return updated;
        }
        return d;
      })
    );

    setAdoptions((prev) =>
      prev.map((a) => {
        if (a.id === adoptionId) {
          const updated: PlantAdoption = { ...a, healthStatus: 'healthy' };
          if (activePlant?.id === adoptionId) setActivePlant(updated);
          if (user?.uid) {
            saveAdoptionToCloud(user.uid, updated).catch((err) =>
              console.warn('Resolve adoption health cloud save failed:', err)
            );
          }
          return updated;
        }
        return a;
      })
    );

    await awardPoints('SUCCESSFUL_RECOVERY', `Successfully nurtured plant back to healthy state!`, adoptionId);
    trackAnalyticsEvent('plant_health_improved', {
      adoptionId,
      resolvedViaManualCheck: true,
    });
    addAgentLog('Progress Agent', `Plant recovery confirmed for adoption ${adoptionId}. Awarded +75 milestone points!`, {
      adoptionId,
      status: 'restored_healthy',
    });
  };

  // Refresh Recommendation Flow (with Sustainability Gatekeeper & 5-Factor Scoring)
  const refreshRecommendation = async (prefsOverride?: UserPlantPreferences) => {
    if (!user?.uid || spaces.length === 0 || !activeSpace?.id || activeSpace.id === 'space-empty') {
      return;
    }
    setIsLoadingRecommendation(true);
    const prefs = prefsOverride || userPreferences;
    try {
      const existingPlantsCount = adoptions.filter((a) => a.spaceId === activeSpace.id).length;
      const strugglingPlantsCount = adoptions.filter(
        (a) => a.spaceId === activeSpace.id && (a.healthStatus === 'needs_attention' || a.healthStatus === 'critical')
      ).length;

      const headers = await getAuthHeaders();
      const res = await fetch('/api/agents/plant-recommend', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          spaceProfile: activeSpace,
          userPreferences: prefs,
          existingPlantsCount,
          strugglingPlantsCount,
          catalog: plantCatalog,
        }),
      });
      const data = await res.json();
      const result = data?.data || {};

      // Find full species object
      let fullSpecies: PlantSpecies | undefined = undefined;
      if (result.primaryRecommendation?.speciesId) {
        fullSpecies = plantCatalog.find((p) => p.id === result.primaryRecommendation.speciesId);
      }
      if (!fullSpecies) fullSpecies = plantCatalog[0];

      const formattedResult: RecommendationResult = {
        recommendationId: result.recommendationId || `rec-${Date.now()}`,
        generatedAt: result.generatedAt || new Date().toISOString(),
        canAdoptMore: result.canAdoptMore ?? true,
        statusRationale: result.statusRationale || 'Space has capacity for a starter companion.',
        spaceUtilizationPct: result.spaceUtilizationPct ?? Math.round((existingPlantsCount / (activeSpace?.plantCapacityEstimate || 6)) * 100),
        sustainabilityWarning: result.sustainabilityWarning,
        primaryRecommendation: result.primaryRecommendation
          ? {
              species: fullSpecies,
              targetZoneId: result.primaryRecommendation.targetZoneId || activeSpace.zones[0]?.id || 'zone-1',
              targetZoneName: result.primaryRecommendation.targetZoneName || activeSpace.zones[0]?.name || 'Zone A',
              matchReasons: result.primaryRecommendation.matchReasons || [
                'Optimal light and humidity balance for this zone',
              ],
              placementTip: result.primaryRecommendation.placementTip || 'Place on stable surface with good drainage.',
              scorecard: result.primaryRecommendation.scorecard || {
                overallScore: 92,
                spaceScore: 90,
                lightScore: 95,
                climateScore: 90,
                maintenanceScore: 95,
                preferenceScore: 90,
                rationale: `${fullSpecies.commonName} exhibits high physiological compatibility with this environment.`,
              },
            }
          : (result.canAdoptMore !== false ? {
              species: fullSpecies,
              targetZoneId: activeSpace.zones[0]?.id || 'zone-1',
              targetZoneName: activeSpace.zones[0]?.name || 'Zone A',
              matchReasons: ['Optimal tolerance to light and climate conditions'],
              placementTip: 'Place on a stable surface with good drainage.',
              scorecard: {
                overallScore: 88,
                spaceScore: 85,
                lightScore: 90,
                climateScore: 88,
                maintenanceScore: 92,
                preferenceScore: 85,
                rationale: 'High resilience starter companion.',
              },
            } : undefined),
        alternatives: (result.alternatives || []).map((alt: any) => ({
          species: plantCatalog.find((p) => p.id === alt.speciesId) || plantCatalog[1],
          reason: alt.reason || 'Alternative companion for this space.',
          scorecard: alt.scorecard,
        })),
      };

      setRecommendation(formattedResult);
      addAgentLog(
        'Plant Recommendation Agent',
        formattedResult.canAdoptMore
          ? `Evaluated capacity: Recommended 1 plant (${formattedResult.primaryRecommendation?.species?.commonName || 'Starter Plant'})`
          : `Sustainability Gatekeeper engaged: "${formattedResult.sustainabilityWarning || 'Space full'}"`,
        {
          canAdoptMore: formattedResult.canAdoptMore,
          utilizationPct: formattedResult.spaceUtilizationPct,
        }
      );
    } catch (err) {
      console.warn('Plant recommendation fallback activated:', err);
      const isHighSun = activeSpace?.zones?.some((z) => z.lightLevel === 'direct_sun');
      let fallbackSpecies: PlantSpecies | undefined;

      if (prefs.plantStyle === 'flowering') {
        fallbackSpecies = plantCatalog.find((p) => p.plantCategory === 'flowering') || plantCatalog.find((p) => p.id === 'peace-lily');
      } else if (prefs.plantStyle === 'herbs_edible') {
        fallbackSpecies = plantCatalog.find((p) => p.plantCategory === 'herb_edible') || plantCatalog.find((p) => p.id === 'sweet-basil');
      } else if (prefs.plantStyle === 'succulent_cactus') {
        fallbackSpecies = plantCatalog.find((p) => p.plantCategory === 'succulent_cactus') || plantCatalog.find((p) => p.id === 'snake-plant');
      } else if (prefs.plantStyle === 'decorative') {
        fallbackSpecies = plantCatalog.find((p) => p.plantCategory === 'foliage' || p.plantCategory === 'climbing_vine') || plantCatalog.find((p) => p.id === 'calathea-orbifolia');
      }

      if (!fallbackSpecies) {
        fallbackSpecies = isHighSun ? (plantCatalog.find((p) => p.id === 'snake-plant') || plantCatalog[0]) : (plantCatalog.find((p) => p.id === 'zz-plant') || plantCatalog[0]);
      }

      const defaultRec: RecommendationResult = {
        recommendationId: `rec-fallback-${Date.now()}`,
        generatedAt: new Date().toISOString(),
        canAdoptMore: true,
        isFallback: true,
        statusRationale: 'Botanical rule-based companion selection applied (AI matching offline).',
        spaceUtilizationPct: 25,
        primaryRecommendation: {
          species: fallbackSpecies,
          targetZoneId: activeSpace?.zones?.[0]?.id || 'zone-1',
          targetZoneName: activeSpace?.zones?.[0]?.name || 'Zone A',
          matchReasons: [
            `Rule-based match for ${prefs.plantStyle && prefs.plantStyle !== 'all' ? prefs.plantStyle.replace('_', ' ') : 'indoor space'} style`,
            'High biological resilience to standard residential indoor humidity'
          ],
          placementTip: 'Place elevated on a stand or windowsill with bright indirect light.',
          scorecard: {
            overallScore: 85,
            spaceScore: 85,
            lightScore: 85,
            climateScore: 85,
            maintenanceScore: 85,
            preferenceScore: 85,
            rationale: `Rule-based fallback compatibility for ${prefs.plantStyle || 'all'}.`,
          },
        },
        alternatives: plantCatalog
          .filter((p) => p.id !== fallbackSpecies!.id && (prefs.plantStyle === 'all' || !prefs.plantStyle || p.plantCategory === (prefs.plantStyle === 'decorative' ? 'foliage' : prefs.plantStyle)))
          .slice(0, 2)
          .map((alt) => ({
            species: alt,
            reason: 'Rule-based complementary resilient species.',
          })),
        sustainabilityWarning: '🌱 Rule-based recommendation: Adopt one plant at a time to build sustainable habits.',
      };
      setRecommendation(defaultRec);

      addAgentLog(
        'Plant Recommendation Agent',
        `Generated recommendation using botanical rule-based heuristics (AI model unavailable)`,
        { isFallback: true },
        'warning'
      );
    } finally {
      setIsLoadingRecommendation(false);
    }
  };

  useEffect(() => {
    if (user?.uid && spaces.length > 0 && activeSpace?.id && activeSpace.id !== 'space-empty') {
      refreshRecommendation();
    }
  }, [user?.uid, activeSpace?.id, adoptions.length, spaces.length]);

  // Air Baseline Updates
  const updateBaseline = async (updated: Partial<AirQualityBaseline>) => {
    const newBaseline = { ...baseline, ...updated };
    setBaseline(newBaseline);

    if (user?.uid) {
      saveAirBaselineToCloud(user.uid, newBaseline).catch((err) =>
        console.warn('Air baseline cloud save failed:', err)
      );
    }

    await awardPoints('AIR_BASELINE_SET', 'Updated environmental telemetry & baseline measurements');
    addAgentLog('Air Environment Agent', `Updated Air Baseline for ${newBaseline.locationName}`, {
      location: newBaseline.locationName,
      outdoorAqi: newBaseline.outdoorAqi.value,
      indoorHumidity: newBaseline.indoorHumidity.value,
    });
  };

  const addAirLogEntry = async (entry: Omit<AirTimelineEntry, 'id' | 'dayNumber' | 'date'>) => {
    const dayNumber = airTimeline.length * 15;
    const newEntry: AirTimelineEntry = {
      ...entry,
      id: `timeline-d${dayNumber}-${Date.now()}`,
      dayNumber,
      date: new Date().toISOString().split('T')[0],
    };
    setAirTimeline((prev) => [...prev, newEntry]);

    addAgentLog('Air Environment Agent', `Logged environmental milestone: ${newEntry.milestoneTitle}`, {
      dayNumber: newEntry.dayNumber,
      activePlants: newEntry.activePlantsCount,
      confoundingFactors: newEntry.confoundingFactors,
    });
  };

  // Reward Redemption Flow
  const redeemReward = async (rewardId: string): Promise<boolean> => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward || totalPoints < reward.pointsCost) return false;

    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/rewards/redeem', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          rewardId: reward.id,
          pointsCost: reward.pointsCost,
          currentTotalPoints: totalPoints,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        console.error('Reward redemption server rejection:', data.error);
        return false;
      }

      setTotalPoints(data.newTotalPoints);
      const redeemedReward: RewardItem = { ...reward, isRedeemed: true, redeemedAt: new Date().toISOString() };
      setRewards((prev) =>
        prev.map((r) => (r.id === rewardId ? redeemedReward : r))
      );

      const tx: PointTransaction = {
        id: `tx-${Date.now()}`,
        actionType: 'CARE_TASK',
        description: `Redeemed reward: ${reward.title}`,
        points: -reward.pointsCost,
        timestamp: new Date().toISOString(),
        verifiedServerSide: true,
      };
      setTransactions((prev) => [tx, ...prev]);

      if (user?.uid) {
        saveRewardRedemptionToCloud(user.uid, redeemedReward).catch((err) =>
          console.error('Reward redemption cloud save failed:', err)
        );
        savePointTransactionToCloud(user.uid, tx).catch((err) =>
          console.error('Reward point transaction cloud save failed:', err)
        );
      }

      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#3b82f6', '#10b981', '#f59e0b'],
      });

      addAgentLog('Reward Agent', `Redeemed ${reward.title} for ${reward.pointsCost} points`, {
        rewardId,
        deliveryType: reward.deliveryType,
        remainingPoints: data.newTotalPoints,
      });

      return true;
    } catch (err) {
      console.error('Failed to redeem reward:', err);
      return false;
    }
  };

  // =========================================================================
  // Phase 8: Personalization & Orchestrator Implementation Handlers
  // =========================================================================

  const refreshNextLittleStep = async () => {
    if (!user?.uid) return;
    setIsLoadingNextStep(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/littlestep/next-action', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          adoptions,
          careTasks,
          healthDiagnostics: diagnostics,
          baseline,
          space: activeSpace,
          preferences: sustainabilityPreferences,
          totalPoints,
          longestStreak,
        }),
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.recommendation) {
          setNextLittleStep(resData.recommendation);
          addAgentLog(
            'LittleStep Personalization Agent',
            `Computed Next LittleStep: ${resData.recommendation.title}`,
            {
              actionType: resData.recommendation.actionType,
              priority: resData.recommendation.priority,
              priorityScore: resData.recommendation.priorityScore,
              sourceAgents: resData.recommendation.sourceAgents,
            },
            'success'
          );
          trackAnalyticsEvent('recommendation_created', {
            actionType: resData.recommendation.actionType,
            priority: resData.recommendation.priority,
          });
        }
      }
    } catch (err) {
      console.warn('Fallback computing local next action', err);
      // Fallback local calculation
      const pendingTask = careTasks.find((t) => !t.isCompleted);
      if (pendingTask) {
        const target = adoptions.find((a) => a.id === pendingTask.adoptionId);
        setNextLittleStep({
          id: `local-rec-${Date.now()}`,
          userId: user.uid,
          actionType: 'CARE_TASK',
          plantId: target?.id,
          plantNickname: target?.nickname || 'Plant',
          title: `Check ${target?.nickname || 'Plant'}'s soil moisture`,
          what: `${pendingTask.title} for ${target?.nickname || 'your plant'}.`,
          why: `Your scheduled check is due today. Tactile check prevents overhydration.`,
          nextStep: pendingTask.notes || 'Perform a quick 1-minute tactile check.',
          priority: 'HIGH',
          priorityScore: 88,
          sourceAgents: ['Plant Care Agent', 'LittleStep Personalization Agent'],
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          buttonActionText: 'Complete Soil Check',
          targetTab: 'dashboard',
        });
      } else {
        setNextLittleStep({
          id: `local-rec-${Date.now()}`,
          userId: user.uid,
          actionType: 'NO_ACTION',
          title: "You're doing great 🌱",
          what: 'No urgent tasks required today.',
          why: 'All companions are healthy, hydrated, and tracking smoothly.',
          nextStep: 'Enjoy your thriving green space and check back tomorrow.',
          priority: 'INFO',
          priorityScore: 10,
          sourceAgents: ['LittleStep Orchestrator', 'LittleStep Personalization Agent'],
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          buttonActionText: 'Explore Sanctuary',
          targetTab: 'dashboard',
        });
      }
    } finally {
      setIsLoadingNextStep(false);
    }
  };

  // Re-compute Next LittleStep whenever core states change for authenticated user
  useEffect(() => {
    if (user?.uid) {
      refreshNextLittleStep();
    }
  }, [user?.uid, adoptions.length, careTasks, diagnostics.length, activeSpace?.id, baseline?.outdoorAqi?.value]);

  const completeNextLittleStep = async (recId: string) => {
    if (!nextLittleStep || nextLittleStep.id !== recId) return;

    // If it is a care task, complete the pending task
    if (nextLittleStep.actionType === 'CARE_TASK') {
      const pendingTask = careTasks.find((t) => !t.isCompleted);
      if (pendingTask) {
        await completeCareTask(pendingTask.id);
      }
    } else {
      // Award action completion points
      await awardPoints('LITTLESTEP_ACTION_COMPLETED', `Completed Next LittleStep: ${nextLittleStep.title}`);
    }

    setNextLittleStep((prev) => (prev ? { ...prev, status: 'COMPLETED', completedAt: new Date().toISOString() } : null));

    addAgentLog('LittleStep Personalization Agent', `Completed LittleStep action: ${nextLittleStep.title}`, {
      recId,
      actionType: nextLittleStep.actionType,
    });

    trackAnalyticsEvent('recommendation_completed', {
      recId,
      actionType: nextLittleStep.actionType,
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#6ee7b7'],
    });

    // Refresh after completion
    setTimeout(() => {
      refreshNextLittleStep();
    }, 1200);
  };

  const dismissNextLittleStep = async (recId: string, feedback?: Partial<RecommendationFeedback>) => {
    if (!nextLittleStep) return;

    setNextLittleStep((prev) =>
      prev
        ? {
            ...prev,
            status: 'DISMISSED',
            dismissedAt: new Date().toISOString(),
            feedback: feedback
              ? {
                  isHelpful: false,
                  reason: feedback.reason || 'other',
                  userComment: feedback.userComment,
                  submittedAt: new Date().toISOString(),
                }
              : undefined,
          }
        : null
    );

    addAgentLog('LittleStep Personalization Agent', `Dismissed recommendation: ${nextLittleStep.title}`, {
      recId,
      reason: feedback?.reason || 'User skipped',
    });

    trackAnalyticsEvent('recommendation_dismissed', {
      recId,
      reason: feedback?.reason,
    });
  };

  const submitRecommendationFeedback = async (
    recId: string,
    isHelpful: boolean,
    reason?: string,
    comment?: string
  ) => {
    setNextLittleStep((prev) =>
      prev && prev.id === recId
        ? {
            ...prev,
            feedback: {
              isHelpful,
              reason: reason as any,
              userComment: comment,
              submittedAt: new Date().toISOString(),
            },
          }
        : prev
    );

    addAgentLog(
      'LittleStep Personalization Agent',
      `User feedback: ${isHelpful ? '👍 Helpful' : '👎 Not helpful'} on "${nextLittleStep?.title}"`,
      { recId, isHelpful, reason, comment }
    );

    trackAnalyticsEvent(isHelpful ? 'recommendation_helpful' : 'recommendation_not_helpful', {
      recId,
      reason,
    });
  };

  const updateSustainabilityPreferences = (prefs: Partial<UserSustainabilityPreferences>) => {
    const updated = { ...sustainabilityPreferences, ...prefs };
    setSustainabilityPreferences(updated);
    if (user?.uid) {
      savePreferencesToCloud(user.uid, updated).catch((err) =>
        console.warn('Sustainability preferences cloud save failed:', err)
      );
    }
    addAgentLog('LittleStep Orchestrator', 'Updated user sustainability preferences', prefs);
  };

  const refreshWeeklySummary = async () => {
    setIsLoadingWeeklySummary(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/littlestep/weekly-summary', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          adoptions,
          careTasks,
          totalPoints,
          longestStreak,
          baseline,
        }),
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.summary) {
          setWeeklySummary(resData.summary);
        }
      }
    } catch (err) {
      console.warn('Error fetching weekly summary:', err);
    } finally {
      setIsLoadingWeeklySummary(false);
    }
  };

  const sendChatMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatSending(true);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/littlestep/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: text,
          adoptions,
          careTasks,
          healthDiagnostics: diagnostics,
          baseline,
          space: activeSpace,
          preferences: sustainabilityPreferences,
          totalPoints,
          longestStreak,
        }),
      });

      if (response.ok) {
        const resData = await response.json();
        const orchestratorMsg: ChatMessage = {
          id: `msg-a-${Date.now()}`,
          sender: 'orchestrator',
          agentName: 'LittleStep Orchestrator',
          text: resData.reply || 'Your request has been processed.',
          timestamp: new Date().toISOString(),
          suggestedActions: resData.suggestedActions || [],
          sourceAgents: resData.sourceAgents || ['LittleStep Orchestrator'],
          contextUsed: resData.routingReasoning ? [resData.routingReasoning] : [],
        };
        setChatMessages((prev) => [...prev, orchestratorMsg]);

        addAgentLog(
          'LittleStep Orchestrator',
          `Orchestrated chat response: "${text.substring(0, 30)}..."`,
          {
            sourceAgents: resData.sourceAgents,
            routingReasoning: resData.routingReasoning,
          }
        );
      }
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `msg-fallback-${Date.now()}`,
        sender: 'orchestrator',
        agentName: 'LittleStep Orchestrator',
        text: "⚡ Offline Mode: Your botanical care data is securely saved. LittleStep Orchestrator AI service is currently unavailable.",
        timestamp: new Date().toISOString(),
        isFallback: true,
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsChatSending(false);
    }
  };

  const clearChatHistory = () => {
    setChatMessages([
      {
        id: 'msg-welcome-reset',
        sender: 'orchestrator',
        agentName: 'LittleStep Orchestrator',
        text: 'Chat history cleared. How can LittleStep support your mindful sanctuary today?',
        timestamp: new Date().toISOString(),
        suggestedActions: [
          { label: 'What should I do today?', actionType: 'CARE_TASK', targetTab: 'dashboard' },
          { label: 'Can I add another plant?', actionType: 'PLANT_RECOMMENDATION', targetTab: 'spaces' },
        ],
      },
    ]);
  };

  // Phase 9: Impact Profile Retrieval
  const refreshImpactProfile = async () => {
    setIsLoadingImpact(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/littlestep/impact-summary', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          adoptions,
          careTasks,
          healthDiagnostics: diagnostics,
          baseline,
          longestStreak,
          totalPoints,
          rewards,
          space: activeSpace,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setImpactProfile(data.impactProfile);
        addAgentLog(
          'LittleStep Personalization Agent',
          'Calculated comprehensive LittleStep Impact Profile & Habit Score',
          { habitScore: data.impactProfile?.habitScore?.totalScore }
        );
      }
    } catch (err) {
      console.error('Failed to load impact profile:', err);
    } finally {
      setIsLoadingImpact(false);
    }
  };

  // Phase 9: Community Stats Retrieval
  const refreshCommunityStats = async () => {
    setIsLoadingCommunity(true);
    try {
      const response = await fetch('/api/littlestep/community-impact');
      if (response.ok) {
        const data = await response.json();
        setCommunityStats(data.community);
      }
    } catch (err) {
      console.error('Failed to load community stats:', err);
    } finally {
      setIsLoadingCommunity(false);
    }
  };

  useEffect(() => {
    refreshCommunityStats();
  }, []);

  const joinCommunityChallenge = (challengeId: string) => {
    if (!communityStats) return;
    setCommunityStats({
      ...communityStats,
      activeChallenges: communityStats.activeChallenges.map((c) =>
        c.id === challengeId ? { ...c, isUserJoined: true, participantsCount: c.participantsCount + 1 } : c
      ),
    });
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
  };

  const validateScientificClaim = async (statement: string) => {
    try {
      const res = await fetch('/api/littlestep/validate-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statement }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.validation;
      }
    } catch (err) {
      console.error('Claim validation error:', err);
    }
    return {
      claimId: `claim-${Date.now()}`,
      statement,
      validityStatus: 'NOT_SUPPORTED',
      confidence: 'LOW',
      userFacingExplanation: 'Insufficient experimental measurement data.',
    };
  };

  const clearUserDataPermanently = () => {
    localStorage.clear();
    setAdoptions([]);
    setCareTasks([]);
    setDiagnostics([]);
    setTotalPoints(0);
    setTransactions([]);
    setChatMessages([]);
    window.location.reload();
  };

  // Initial load for Phase 9 telemetry (authenticated only)
  useEffect(() => {
    if (user?.uid) {
      refreshImpactProfile();
      refreshCommunityStats();
    }
  }, [user?.uid, adoptions.length, careTasks.filter((t) => t.isCompleted).length, longestStreak]);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        spaces,
        activeSpace,
        setActiveSpace,
        isScanningSpace,
        scanSpacePhoto,
        confirmSpace,
        addOrUpdateZone,
        plantCatalog,
        adoptions,
        activePlant,
        setActivePlant,
        userPreferences,
        setUserPreferences,
        adoptPlant,
        confirmPlantSetup,
        explainPlantRecommendation,
        careTasks,
        completeCareTask,
        diagnostics,
        isAnalyzingHealth,
        runHealthCheck,
        deleteHealthObservation,
        updateHealthObservationNotes,
        resolvePlantRecovery,
        recommendation,
        isLoadingRecommendation,
        refreshRecommendation,
        baseline,
        airTimeline,
        updateBaseline,
        addAirLogEntry,
        totalPoints,
        currentLevel,
        longestStreak,
        transactions,
        rewards,
        redeemReward,
        agentLogs,
        addAgentLog,
        trackAnalyticsEvent,
        nextLittleStep,
        isLoadingNextStep,
        refreshNextLittleStep,
        completeNextLittleStep,
        dismissNextLittleStep,
        submitRecommendationFeedback,
        sustainabilityPreferences,
        updateSustainabilityPreferences,
        weeklySummary,
        isLoadingWeeklySummary,
        refreshWeeklySummary,
        chatMessages,
        isChatSending,
        sendChatMessage,
        clearChatHistory,
        isChatOpen,
        setIsChatOpen,
        isPreferencesModalOpen,
        setIsPreferencesModalOpen,
        isWeeklySummaryModalOpen,
        setIsWeeklySummaryModalOpen,
        impactProfile,
        isLoadingImpact,
        refreshImpactProfile,
        communityStats,
        isLoadingCommunity,
        refreshCommunityStats,
        joinCommunityChallenge,
        validateScientificClaim,
        clearUserDataPermanently,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
