export type MeasurementSourceType = 'MEASURED' | 'ESTIMATED' | 'EXTERNAL_DATA' | 'USER_PROVIDED';

export type LightLevel = 'direct_sun' | 'bright_indirect' | 'medium_indirect' | 'low_light';

export type ZoneType = 'plant_zone' | 'furniture' | 'walkway' | 'obstacle' | 'existing_plant';

export interface SpaceZone {
  id: string;
  name: string;
  zoneType: ZoneType;
  lightLevel: LightLevel;
  color?: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  w: number; // percentage 0-100
  h: number; // percentage 0-100
  recommendedSize?: 'small' | 'medium' | 'large' | 'hanging';
  assignedPlantId?: string;
  notes?: string;
}

export interface SpaceProfile {
  id: string;
  name: string;
  spaceType: 'balcony' | 'indoor_room' | 'patio' | 'terrace' | 'window_nook';
  lengthFt: number;
  widthFt: number;
  usableAreaSqFt: number;
  confidence: number;
  measurementMethod: 'visual_estimation' | 'user_confirmed' | 'benchmark_scaled';
  requiresConfirmation: boolean;
  plantCapacityEstimate: number;
  currentUtilizationPct: number;
  zones: SpaceZone[];
  photoUrl?: string;
  safetyWarnings?: string[];
  referenceBenchmark?: string;
  lastScannedAt: string;
  isFallback?: boolean;
  dataSource?: 'cloud' | 'mock' | 'heuristic_fallback';
}

export interface PlantSpecies {
  id: string;
  plantId?: string; // alias for plant_id
  commonName: string;
  scientificName: string;
  aliases?: string[];
  plantCategory?: 'indoor_foliage' | 'succulent_cactus' | 'herb_edible' | 'flowering' | 'fern' | 'climbing_vine' | 'tree_like';
  indoorOutdoor: 'indoor' | 'outdoor' | 'both';
  difficulty: 'easy' | 'medium' | 'experienced';
  lightRequirement: LightLevel;
  minimumLight?: LightLevel;
  maximumLight?: LightLevel;
  waterRequirement?: 'very_low' | 'low' | 'moderate' | 'high';
  waterFrequencyDays: number;
  humidityPreference?: 'low' | 'moderate' | 'high';
  idealHumidityPct: number;
  temperatureRange?: string; // e.g. "15°C - 30°C (60°F - 86°F)"
  maintenanceLevel: 'very_low' | 'low' | 'moderate' | 'high';
  growthRate?: 'slow' | 'moderate' | 'fast';
  matureSize?: string; // e.g. "1 - 3 ft height, 1 - 2 ft spread"
  recommendedContainerSize?: string; // e.g. "6 - 8 inches with drainage"
  spaceRequirement?: 'compact' | 'medium' | 'generous';
  sizeCategory: 'small' | 'medium' | 'large' | 'hanging';
  imageUrl: string;
  description: string;
  petSafe: boolean;
  petSafetyNotes?: string;
  childSafetyNotes?: string;
  climateSuitability?: string[];
  nativeRegion?: string;
  careGuidelines?: {
    light: string;
    water: string;
    soil: string;
    pruning?: string;
    mistakeToAvoid: string;
  };
  environmentalInformation?: {
    transpirationRate: 'low' | 'moderate' | 'high';
    co2AbsorptionTime: 'day' | 'night_crassulacean' | 'standard';
    resilienceNote: string;
    scientificDisclaimer: string;
  };
  scientificFactSheet: {
    naturalHabitat: string;
    transpirationRate: 'low' | 'moderate' | 'high';
    resilienceNote: string;
  };
  source?: string;
  sourceLastUpdated?: string;
}

export type PlantStyleCategory =
  | 'all'
  | 'flowering'
  | 'herbs_edible'
  | 'decorative'
  | 'succulent_cactus'
  | 'indoor_greenery'
  | 'low_maintenance'
  | 'pet_friendly';

export interface UserPlantPreferences {
  plantStyle: PlantStyleCategory;
  maintenancePreference: 'very_low' | 'low' | 'moderate' | 'high';
  petInHousehold: boolean;
  priorExperience: 'beginner' | 'intermediate' | 'expert';
  desiredLocationType?: 'floor' | 'floor_stand' | 'shelf_table' | 'hanging' | 'vertical_hanging' | 'window_sill' | 'balcony_railing';
  budgetLevel?: 'starter' | 'standard' | 'premium';
}

export interface PlantRecommendationScore {
  spaceCompatibility: number; // 0-100
  lightCompatibility: number; // 0-100
  climateCompatibility: number; // 0-100
  maintenanceCompatibility: number; // 0-100
  preferenceScore: number; // 0-100
  overallSuitability: number; // 0-100
  label: string; // "LittleStep suitability score"
}

export interface RecommendationAlternative {
  species: PlantSpecies;
  reason: string;
  score: number;
  highlightDifference: string;
}

export interface PlantRecommendationPayload {
  recommendationId: string;
  userId: string;
  spaceId: string;
  plantId: string;
  zoneId: string;
  zoneName: string;
  suitabilityScore: number;
  scoreBreakdown: PlantRecommendationScore;
  reasons: string[];
  placementGuidance: string;
  scientificContext: string;
  alternatives: RecommendationAlternative[];
  createdAt: string;
  modelVersion: string;
}

export interface PlantJourneyMilestone {
  day: number;
  title: string;
  description: string;
  actionRequired?: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  completedAt?: string;
  pointsAwarded: number;
  badgeName?: string;
}

export interface PlantAdoption {
  id: string;
  speciesId: string;
  nickname: string;
  spaceId: string;
  zoneId: string;
  recommendationId?: string;
  adoptedAt: string;
  status: 'ADOPTED' | 'SETUP_COMPLETED' | 'MAINTAINING' | 'NEEDS_TRIAGE';
  setupConfirmedAt?: string;
  setupPhotoUrl?: string;
  healthStatus: 'thriving' | 'healthy' | 'needs_attention' | 'critical';
  streakDays: number;
  totalSurvivalDays: number;
  lastWateredAt?: string;
  lastHealthCheckAt?: string;
  nextCareDue: string;
  notes?: string;
  milestones?: PlantJourneyMilestone[];
  photos: Array<{
    id: string;
    url: string;
    timestamp: string;
    caption?: string;
    type?: 'setup' | 'progress' | 'triage';
  }>;
}

export interface CareTask {
  id: string;
  adoptionId: string;
  taskType: 'water' | 'misting' | 'rotate' | 'fertilize' | 'prune' | 'inspect';
  title: string;
  dueAt: string;
  completedAt?: string;
  isCompleted: boolean;
  notes?: string;
  pointsValue: number;
}

export type PlantHealthStatus = 'healthy' | 'watch' | 'needs_attention' | 'inconclusive' | 'thriving' | 'critical';
export type HealthConfidence = 'high' | 'medium' | 'low';

export interface ImageQualityAssessment {
  score: number; // 0 to 1
  status: 'GOOD' | 'FAIR' | 'POOR';
  isPlantVisible: boolean;
  isClear: boolean;
  hasAdequateLighting: boolean;
  feedback: string;
}

export interface HealthDiagnostic {
  id: string;
  adoptionId: string;
  timestamp: string;
  photoUrl: string;
  healthStatus: PlantHealthStatus;
  confidenceScore: number;
  confidenceLevel?: HealthConfidence;
  imageQuality?: ImageQualityAssessment;
  visualSymptoms: string[]; // OBSERVED characteristics
  possibleCauses: Array<{
    cause: string;
    likelihood: 'probable' | 'possible' | 'unlikely';
    description?: string;
  }>;
  recommendedActionPlan: string;
  recommendedActions?: string[]; // Step-by-step actionable list
  careHistoryContext?: string; // Cross-referenced watering/care note
  spaceContextAdvice?: string; // Light/location note
  urgency: 'low' | 'medium' | 'high';
  followUpDays?: number;
  userNotes?: string;
  isResolved?: boolean;
  resolutionTimestamp?: string;
  scientificDisclaimer: string;
  isFallback?: boolean;
  dataSource?: 'cloud' | 'mock' | 'heuristic_fallback';
}

export interface AirMetric {
  value: number;
  unit: string;
  sourceType: MeasurementSourceType;
  sourceLabel: string;
  confidence?: number;
}

export interface AirQualityBaseline {
  id: string;
  spaceId: string;
  locationName: string;
  establishedAt: string;
  outdoorAqi: AirMetric;
  outdoorPm25: AirMetric;
  outdoorPm10?: AirMetric;
  indoorTemp: AirMetric;
  indoorHumidity: AirMetric;
  indoorCo2?: AirMetric;
  isUserVerified: boolean;
}

export interface AirTimelineEntry {
  id: string;
  spaceId: string;
  dayNumber: number;
  date: string;
  milestoneTitle: string;
  activePlantsCount: number;
  outdoorAqi: AirMetric;
  indoorHumidity: AirMetric;
  indoorTemp: AirMetric;
  confoundingFactors: string[];
  scientificAnalysis: string;
}

export interface PointTransaction {
  id: string;
  actionType:
    | 'PLANT_ADOPTION'
    | 'PLANT_SETUP'
    | 'MILESTONE_7D'
    | 'MILESTONE_30D'
    | 'MILESTONE_90D'
    | 'MILESTONE_180D'
    | 'SUCCESSFUL_RECOVERY'
    | 'CARE_TASK'
    | 'PROGRESS_PHOTO'
    | 'AIR_BASELINE_SET'
    | 'LITTLESTEP_ACTION_COMPLETED';
  description: string;
  points: number;
  timestamp: string;
  adoptionId?: string;
  verifiedServerSide: boolean;
}

export interface RewardItem {
  id: string;
  title: string;
  category: 'badge' | 'seeds' | 'planter' | 'care_kit' | 'smart_hardware';
  pointsCost: number;
  description: string;
  iconName: string;
  isRedeemed?: boolean;
  redeemedAt?: string;
  deliveryType: 'instant_digital' | 'partner_delivery';
}

export interface AgentLogEntry {
  id: string;
  agentName:
    | 'LittleStep Orchestrator'
    | 'Space Assessment Agent'
    | 'Plant Recommendation Agent'
    | 'Plant Care Agent'
    | 'Plant Health Agent'
    | 'Air Environment Agent'
    | 'Progress Agent'
    | 'Reward Agent'
    | 'LittleStep Personalization Agent';
  action: string;
  timestamp: string;
  status: 'active' | 'success' | 'warning' | 'idle';
  details: Record<string, unknown>;
}

export type NextActionType =
  | 'CARE_TASK'
  | 'HEALTH_CHECK'
  | 'PLANT_RECOVERY'
  | 'ENVIRONMENT_CHECK'
  | 'SPACE_REVIEW'
  | 'PLANT_RECOMMENDATION'
  | 'MILESTONE'
  | 'REWARD_REDEMPTION'
  | 'EDUCATION'
  | 'NO_ACTION';

export type RecommendationPriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface UserSustainabilityPreferences {
  experienceLevel: 'beginner' | 'intermediate' | 'experienced';
  availableTimeDaily: '5_mins' | '15_mins' | '30_mins' | 'weekend_only';
  maintenanceTolerance: 'very_low' | 'low' | 'moderate' | 'high';
  preferredPlantCount: 'single_focus' | 'modest_2_3' | 'thriving_sanctuary';
  indoorOutdoorPreference: 'indoor_only' | 'balcony_patio' | 'both';
  petSafeStrict: boolean;
  lowMaintenanceFirst: boolean;
  notificationPacing: 'daily_single_step' | 'essential_only' | 'weekly_digest';
}

export interface RecommendationFeedback {
  isHelpful: boolean;
  reason?: 'not_relevant' | 'already_completed' | 'too_difficult' | 'not_enough_time' | 'other';
  userComment?: string;
  submittedAt: string;
}

export interface PersonalizedRecommendation {
  id: string;
  userId: string;
  actionType: NextActionType;
  plantId?: string;
  plantNickname?: string;
  title: string;
  what: string;
  why: string;
  nextStep: string;
  priority: RecommendationPriority;
  priorityScore: number; // Deterministic 0-100 score
  sourceAgents: string[];
  status: 'ACTIVE' | 'COMPLETED' | 'DISMISSED';
  feedback?: RecommendationFeedback;
  createdAt: string;
  displayedAt?: string;
  completedAt?: string;
  dismissedAt?: string;
  buttonActionText?: string;
  targetTab?: 'dashboard' | 'spaces' | 'plants' | 'environment' | 'rewards' | 'agents';
  isFallback?: boolean;
}

export interface WeeklySustainabilitySummary {
  weekNumber: number;
  startDate: string;
  endDate: string;
  plantsMaintainedCount: number;
  careTasksCompletedCount: number;
  healthChecksLoggedCount: number;
  currentStreakDays: number;
  pointsEarnedThisWeek: number;
  environmentalAqiOverview: string;
  biggestLittleStep: {
    title: string;
    description: string;
    badge?: string;
  };
  nextWeekGuidance: string;
  scientificDisclaimer: string;
  isFallback?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'orchestrator' | 'agent';
  agentName?: string;
  text: string;
  timestamp: string;
  suggestedActions?: Array<{
    label: string;
    actionType: NextActionType;
    targetTab?: 'dashboard' | 'spaces' | 'plants' | 'environment' | 'rewards' | 'agents';
  }>;
  sourceAgents?: string[];
  contextUsed?: string[];
  isFallback?: boolean;
}

export interface RecommendationResult {
  canAdoptMore: boolean;
  statusRationale: string;
  spaceUtilizationPct: number;
  recommendationId?: string;
  generatedAt?: string;
  isFallback?: boolean;
  primaryRecommendation?: {
    species: PlantSpecies;
    targetZoneId: string;
    targetZoneName: string;
    matchReasons: string[];
    placementTip: string;
    suitabilityScore?: number;
    scoreBreakdown?: PlantRecommendationScore;
    scorecard?: {
      overallScore: number;
      spaceScore: number;
      lightScore: number;
      climateScore: number;
      maintenanceScore: number;
      preferenceScore: number;
      rationale: string;
    };
  };
  alternatives?: Array<{
    species: PlantSpecies;
    reason: string;
    score?: number;
    highlightDifference?: string;
    scorecard?: {
      overallScore: number;
      spaceScore: number;
      lightScore: number;
      climateScore: number;
      maintenanceScore: number;
      preferenceScore: number;
      rationale: string;
    };
  }>;
  sustainabilityWarning?: string;
  modelContextNotes?: string;
}

// =========================================================================
// PHASE 9: IMPACT, INSIGHTS, SUSTAINABILITY JOURNEY & COMMUNITY TYPES
// =========================================================================

export interface CareImpactMetrics {
  totalCareTasksCompleted: number;
  totalPlantsMaintained: number;
  longestMaintainedPlantDays: number;
  longestMaintainedPlantName: string;
  averageConsistencyRate: number; // e.g. 94%
  currentStreakDays: number;
  totalHealthChecks: number;
  successfulRecoveriesCount: number;
  totalCheckInsCount: number;
}

export interface PlantVitalityRecord {
  adoptionId: string;
  plantNickname: string;
  speciesCommonName: string;
  status: 'healthy' | 'improved_after_care' | 'watch' | 'needs_attention';
  statusLabel: string;
  daysCared: number;
  healthChecksCount: number;
  latestObservationText: string;
  confidence: 'HIGH' | 'MEDIUM' | 'ESTIMATED';
}

export interface EnvironmentalAwarenessMetrics {
  daysTracked: number;
  observationsCount: number;
  averageOutdoorAqiCategory: string;
  aqiTrendDescription: 'Improving' | 'Stable' | 'Variable' | 'Seasonal Shift';
  pm25TrendSummary: string;
  seasonalInsight: string;
  scientificDisclaimer: string;
}

export interface HabitScoreBreakdown {
  careConsistencyScore: number; // Max 40
  plantMaintenanceScore: number; // Max 25
  healthCheckScore: number; // Max 15
  longTermCommitmentScore: number; // Max 20
  totalScore: number; // 0-100
  strongestHabitDescription: string;
  growthOpportunity: string;
}

export interface ImpactBeforeAfter {
  whenStarted: {
    plantsMaintained: number;
    careActions: number;
    healthChecks: number;
    environmentalTrackingDays: number;
    habitScore: number;
  };
  today: {
    plantsMaintained: number;
    careActions: number;
    healthChecks: number;
    environmentalTrackingDays: number;
    habitScore: number;
  };
}

export interface ImpactAchievementBadge {
  id: string;
  title: string;
  description: string;
  category: 'CARE' | 'OBSERVATION' | 'MILESTONE' | 'COMMUNITY' | 'ENVIRONMENT';
  unlockedAt?: string;
  isUnlocked: boolean;
  iconName: string;
  pointsEarned: number;
}

export interface LittleStepImpactProfile {
  userId: string;
  generatedAt: string;
  careImpact: CareImpactMetrics;
  plantWellBeing: PlantVitalityRecord[];
  environmentalAwareness: EnvironmentalAwarenessMetrics;
  habitScore: HabitScoreBreakdown;
  personalStory: string;
  beforeAfter: ImpactBeforeAfter;
  achievements: ImpactAchievementBadge[];
  lifetimePoints: number;
  rewardsUnlockedCount: number;
  rewardsRedeemedCount: number;
  journeyMilestonesTimeline: Array<{
    dayNumber: number;
    title: string;
    description: string;
    date: string;
    icon: string;
    phase: string;
  }>;
}

export interface CommunityImpactStats {
  totalPlantsMaintained: number;
  totalCareActionsCompleted: number;
  totalHealthChecksConducted: number;
  totalPlantCareDays: number;
  activeCommunityUsers: number;
  communityGoal: {
    title: string;
    targetPlantCareDays: number;
    currentPlantCareDays: number;
    progressPercentage: number;
    participatingGardensCount: number;
  };
  activeChallenges: Array<{
    id: string;
    title: string;
    description: string;
    durationDays: number;
    participantsCount: number;
    completionPoints: number;
    isUserJoined?: boolean;
  }>;
  regionalCoarseDistributions: Array<{
    regionName: string;
    anonymizedPlantsCount: number;
    activeCareKeepers: number;
  }>;
}

export type ClaimValidityStatus = 'VALIDATED' | 'ESTIMATED' | 'INSUFFICIENT_DATA' | 'NOT_SUPPORTED';

export interface ImpactClaimValidation {
  claimId: string;
  claimType: 'BEHAVIORAL' | 'OBSERVATIONAL' | 'ENVIRONMENTAL_MODEL';
  statement: string;
  source: string;
  methodology: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  validityStatus: ClaimValidityStatus;
  userFacingExplanation: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  phoneNumber: string | null;
  displayName: string;
  photoURL?: string;
  authProvider: 'email' | 'phone' | 'anonymous' | 'google';
  createdAt: string;
  lastLoginAt: string;
  onboardingCompleted: boolean;
  experienceLevel?: 'beginner' | 'intermediate' | 'enthusiast';
  city?: string;
  plantPreferences?: {
    indoorOutdoor?: 'indoor' | 'outdoor' | 'both';
    maintenanceLevel?: 'low' | 'moderate' | 'high';
    spaceType?: string;
  };
}


