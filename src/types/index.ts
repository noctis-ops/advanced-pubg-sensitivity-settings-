// ============================================================
// PUBG Mobile Sensitivity Generator - Type Definitions
// ============================================================

// ==================== Device Types ====================

export type DeviceBrand =
  | 'apple'
  | 'samsung'
  | 'xiaomi'
  | 'oneplus'
  | 'oppo'
  | 'realme'
  | 'huawei'
  | 'honor'
  | 'poco'
  | 'redmi'
  | 'rog'
  | 'redmagic'
  | 'blackshark'
  | 'sony'
  | 'google'
  | 'zte'
  | 'lenovo'
  | 'iqoo'
  | 'other';

export type DeviceType = 'phone' | 'tablet';
export type DeviceOS = 'ios' | 'android';
export type ProcessorTier = 'flagship' | 'high' | 'mid' | 'low';
export type ChipsetVendor = 'Apple' | 'Qualcomm' | 'MediaTek' | 'Samsung' | 'Huawei' | 'Google' | 'Unisoc' | 'Other';
export type ThermalProfile = 'cool' | 'balanced' | 'warm' | 'hot';

export interface ProcessorMetadata {
  model: string;
  gpuModel: string;
  vendor: ChipsetVendor;
  processNodeNm: number | null;
  sustainedFPS: 30 | 60 | 90 | 120;
  thermalProfile: ThermalProfile;
  dataConfidence: DataConfidence;
  source: 'spec-sheet' | 'community' | 'modelled';
}

export interface DeviceSpecs {
  screenSize: number;
  screenWidth: number;
  screenHeight: number;
  ppi: number;
  refreshRate: number;
  touchSamplingRate: number;
  maxFPS: 30 | 60 | 90 | 120;
  gyroscopeQuality: number; // 1-10
  processorTier: ProcessorTier;
  processor?: ProcessorMetadata;
}

export interface Device {
  id: string;
  brand: DeviceBrand;
  name: string;
  nameAr: string;
  type: DeviceType;
  os: DeviceOS;
  releaseYear: number;
  specs: DeviceSpecs;
  dataConfidence?: DataConfidence;
  popularityRank?: number;
}

// ==================== Player Types ====================

export type FingerCount = 2 | 3 | 4 | 5 | 6;
export type HandSide = 'left' | 'right';
export type FingerId = 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';

export interface FingerAssignment {
  left: FingerId[];
  right: FingerId[];
}

export type GripStyle =
  | 'thumbs'
  | 'three-finger'
  | 'claw'
  | 'five-claw'
  | 'full-claw';

export type GyroscopeMode =
  | 'off'
  | 'scope-only'
  | 'always-on';

export type PlayStyle =
  | 'aggressive'
  | 'close-aggressive'
  | 'tournament-elite'
  | 'balanced'
  | 'passive';

export type SkillLevel =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'pro';

export type FPSOption = 30 | 60 | 90 | 120;
export type FOVOption = 80 | 82 | 84 | 86 | 88 | 90;
export type FPPViewOption = 90 | 93 | 95 | 98 | 100 | 103;

export interface PlayerSettings {
  fingerCount: FingerCount;
  gripStyle: GripStyle;
  gyroscopeMode: GyroscopeMode;
  playStyle: PlayStyle;
  skillLevel: SkillLevel;
  preferredFPS: FPSOption;
  fov: FOVOption;
  fppView: FPPViewOption;
  fingerAssignment?: FingerAssignment;
}

// ==================== Scope Types ====================

/**
 * Scope ids are deliberately separate from their display labels. This keeps
 * the calculator deterministic and prevents language changes from affecting
 * calculations or validation.
 */
export type ScopeId =
  | 'noScope'
  | 'redDot'
  | 'x2'
  | 'x3'
  | 'x4'
  | 'x6'
  | 'x8';

export type AttachmentType =
  | 'muzzle'
  | 'grip'
  | 'magazine'
  | 'stock'
  | 'sight';

export interface ScopeValues {
  noScope: number;
  redDot: number;
  x2: number;
  x3: number;
  x4: number;
  x6: number;
  x8: number;
}

export interface AimFeatures {
  aimTPP: number;
  aimFPP: number;
}

export interface SensitivitySet extends ScopeValues, AimFeatures {}

export interface SensitivityCategory {
  camera: SensitivitySet;
  ads: SensitivitySet;
  gyroscope: SensitivitySet;
  adsGyroscope: SensitivitySet;
}

export interface AdditionalSettings {
  movementButtonSize: number;
  fireButtonSize: number;
  peekButtonSize: number;
  freeLook: number;
  sprintSensitivity: number;
  fov: FOVOption;
  fppView: FPPViewOption;
}

export interface ExplanationFactor {
  factor: string;
  factorAr: string;
  impact: string;
  impactAr: string;
  adjustment: number;
}

// ==================== Weapon Types ====================

export type WeaponCategory = 'ar' | 'smg' | 'sniper' | 'dmr' | 'shotgun' | 'lmg';

export interface WeaponEffectiveRange {
  minMeters: number;
  optimalMeters: number;
  maxMeters: number;
}

export type WeaponFireMode = 'single' | 'burst' | 'auto';
export type WeaponDataSource = 'pubg-mobile-official' | 'official-patch' | 'training-ground' | 'community' | 'modelled';
export type VerificationStatus = 'verified-official' | 'verified-measured' | 'community' | 'unverified';

export interface WeaponDataProvenance {
  gameVersion: string;
  patchVersion: string;
  dataVersion: string;
  dataCollectedAt: string;
  dataSource: WeaponDataSource;
  sourceUrl?: string;
  verificationStatus: VerificationStatus;
  confidence: DataConfidence;
  notes?: string;
}

export interface WeaponPropertySnapshot {
  property: string;
  value: unknown;
  gameVersion: string;
  patchVersion: string;
  dataVersion: string;
  dataSource: WeaponDataSource;
  sourceUrl?: string;
  verificationStatus: VerificationStatus;
}

/** Normalized recoil telemetry for one bullet in a training-ground spray. */
export interface RecoilSample {
  bullet: number;
  horizontal: number;
  vertical: number;
  recovery: number;
}

export interface DataProvenance {
  datasetVersion: string;
  gamePatch: string;
  source: 'spec-sheet' | 'training-ground' | 'community' | 'modelled';
  measuredAt?: string;
  notes?: string;
}

export interface DatasetInfo {
  version: string;
  gamePatch: string;
  lastUpdated: string;
  status: 'modelled' | 'mixed' | 'measured';
}

export interface TrainingGroundMeasurement {
  id: string;
  weaponId: string;
  scope: ScopeId;
  distanceMeters: 10 | 30 | 50 | 100 | 200;
  shots: 10 | 20 | 30;
  verticalError: number;
  horizontalError: number;
  headshots: number;
  shotsHit: number;
  targetAcquisitionMs?: number;
  overshoots: number;
  recordedAt: string;
  notes?: string;
}

export interface OptimizationGoal {
  id: 'close' | 'mid' | 'long' | 'tournament';
  weights: {
    recoil: number;
    headshot: number;
    acquisition: number;
    microControl: number;
    overshoot: number;
  };
}

export interface PerformanceMetrics {
  shots: number;
  shotsHit: number;
  headshots: number;
  verticalError: number;
  horizontalError: number;
  targetAcquisitionMs: number;
  overshoots: number;
}

export interface ExperimentResult {
  id: string;
  profile: 'baseline' | 'candidate' | 'generated' | 'calibrated';
  weaponId: string;
  scope: ScopeId;
  metrics: PerformanceMetrics;
  createdAt: string;
}

export interface BayesianPosterior {
  mean: number;
  variance: number;
  observations: number;
}

export interface PlayerPersonalization {
  ads: BayesianPosterior;
  gyroscope: BayesianPosterior;
  camera: BayesianPosterior;
  lastUpdated: string;
}

export type DataConfidence = 'measured' | 'spec-sheet' | 'community' | 'modelled';

export interface RecoilStats {
  verticalMean: number;
  verticalMin: number;
  verticalMax: number;
  horizontalMean: number;
  horizontalMin: number;
  horizontalMax: number;
  variance: number;
  durationMs: number;
  recoveryMs: number;
}

export interface WeaponSpreadProfile {
  hipFire: number;
  ads: number;
  movement: number;
  standing: number;
  crouch: number;
  jump: number;
  variance: number;
}

export interface WeaponVisualBehavior {
  screenShake: number;
  muzzleMovement: number;
  weaponMovement: number;
}

export interface Weapon {
  id: string;
  name: string;
  nameAr: string;
  category: WeaponCategory;
  icon: string;
  ammoType?: string;
  fireMode?: WeaponFireMode;
  burstSize?: number;
  timeBetweenShotsMs?: number;
  bulletVelocityMps?: number;
  reloadTimeMs?: number;
  magazineCapacity?: number;
  drawTimeMs?: number;
  firstShotMultiplier?: number;
  recoilStats?: RecoilStats;
  spreadProfile?: WeaponSpreadProfile;
  visualBehavior?: WeaponVisualBehavior;
  provenance?: WeaponDataProvenance;
  propertyHistory?: WeaponPropertySnapshot[];
  recoil: {
    vertical: number;   // 1-10
    horizontal: number; // 1-10
    pattern: 'straight' | 'left' | 'right' | 'zigzag';
  };
  recoilCurve: RecoilSample[];
  recoilDataConfidence: DataConfidence;
  fireRate: number;     // RPM
  sprayStability: number; // 1-10; higher means easier to keep a spray stable
  effectiveRange: WeaponEffectiveRange;
  attachmentCompatibility: AttachmentType[];
  scopeCompatibility: ScopeId[];
  difficulty: 'easy' | 'medium' | 'hard';
  bestScopes: string[];
  tips: {
    en: string;
    ar: string;
  };
}

export interface WeaponScopeFactors {
  recoilLoad: number;
  fireRateLoad: number;
  stability: number;
  deviceNormalFactor: number;
  deviceGyroFactor: number;
  attachmentSupport: number;
  scopeZoom: number;
  headshotFocus: number;
  spreadLoad: number;
  firstShotLoad: number;
}

export interface WeaponAimSensitivity {
  camera: AimFeatures;
  ads: AimFeatures;
  gyroscope: AimFeatures;
  adsGyroscope: AimFeatures;
}

export interface WeaponScopeSensitivity {
  scope: ScopeId;
  camera: number;
  ads: number;
  gyroscope: number;
  adsGyroscope: number;
  factors: WeaponScopeFactors;
  reason: {
    en: string;
    ar: string;
  };
  headshotTip: {
    en: string;
    ar: string;
  };
}

export interface WeaponSensitivityResult {
  weapon: Weapon;
  valid: boolean;
  validationErrors: string[];
  values: WeaponScopeSensitivity[];
  aimFeatures: WeaponAimSensitivity;
}

// ==================== Confidence and Calibration ====================

export interface ConfidenceBreakdown {
  dataCoverage: number;
  deviceSpecificity: number;
  modelStability: number;
  empiricalCalibration: number;
  reproducibility: number;
}

export interface LocalizedText {
  en: string;
  ar: string;
}

export interface SensitivityConfidence {
  score: number;
  level: 'low' | 'medium' | 'high';
  breakdown: ConfidenceBreakdown;
  caveats: LocalizedText[];
}

export type CalibrationIssue =
  | 'overshoot'
  | 'undershoot'
  | 'vertical-recoil'
  | 'horizontal-left'
  | 'horizontal-right'
  | 'slow-acquisition'
  | 'stable';

export interface CalibrationObservation {
  weaponId: string;
  scope: ScopeId;
  issue: CalibrationIssue;
  severity: 1 | 2 | 3;
}

export interface CalibrationAdjustment {
  cameraDelta: number;
  adsDelta: number;
  gyroscopeDelta: number;
  adsGyroscopeDelta: number;
  rationale: { en: string; ar: string };
}

export type ControlButtonId =
  | 'movement'
  | 'fire'
  | 'aim'
  | 'scope'
  | 'jump'
  | 'crouch'
  | 'prone'
  | 'peekLeft'
  | 'peekRight'
  | 'reload'
  | 'weaponPrimary'
  | 'weaponSecondary'
  | 'grenade'
  | 'heal'
  | 'map'
  | 'freeLook';

export interface ControlButtonLayout {
  id: ControlButtonId;
  label: string;
  labelAr: string;
  x: number;
  y: number;
  size: number;
  assignedHand: HandSide;
  assignedFinger: FingerId;
  priority: 'core' | 'combat' | 'utility';
  reason: { en: string; ar: string };
}

export interface ControlLayoutConflict {
  type: 'overlap' | 'unreachable' | 'duplicate-responsibility' | 'safe-area';
  buttonIds: ControlButtonId[];
  severity: 'warning' | 'error';
  reason: { en: string; ar: string };
}

export interface ControlLayoutAnalysis {
  player: { fingerCount: FingerCount; assignmentValid: boolean; leftCount: number; rightCount: number };
  device: { screenWidth: number; screenHeight: number; aspectRatio: number; screenSize: number; safeArea: { left: number; right: number; top: number; bottom: number } };
  responsibilities: Array<{ buttonId: ControlButtonId; hand: HandSide; finger: FingerId }>;
  reachZones: Array<{ hand: HandSide; finger: FingerId; x: number; y: number; radius: number }>;
  conflicts: ControlLayoutConflict[];
  passed: boolean;
}

export interface ControlLayoutProfile {
  id: string;
  deviceId: string;
  fingerAssignment: FingerAssignment;
  analysis: ControlLayoutAnalysis;
  buttons: ControlButtonLayout[];
  safeArea: { left: number; right: number; top: number; bottom: number };
  screenAspectRatio: number;
  generatedAt: string;
  confidence: number;
  rationale: { en: string; ar: string }[];
}

// ==================== Generated Result Types ====================

export interface GeneratedSensitivity {
  id: string;
  createdAt: Date;
  device: Device;
  playerSettings: PlayerSettings;
  baselineSensitivity: SensitivityCategory;
  sensitivity: SensitivityCategory;
  weaponSensitivities: WeaponSensitivityResult[];
  confidence: SensitivityConfidence;
  controlLayout?: ControlLayoutProfile;
  additional: AdditionalSettings;
  explanations: ExplanationFactor[];
}

// ==================== App State Types ====================

export type AppStep = 1 | 2 | 3 | 4 | 5 | 6 | 'results';

export interface AppState {
  currentStep: AppStep;
  selectedDevice: Device | null;
  playerSettings: PlayerSettings;
  generatedSensitivity: GeneratedSensitivity | null;
  language: 'ar' | 'en';
}

export interface SavedSensitivityProfile {
  id: string;
  name: string;
  savedAt: string;
  profile: GeneratedSensitivity;
}

export type AppAction =
  | { type: 'SET_STEP'; payload: AppStep }
  | { type: 'SET_DEVICE'; payload: Device }
  | { type: 'SET_FPS'; payload: FPSOption }
  | { type: 'SET_FOV'; payload: FOVOption }
  | { type: 'SET_FPP_VIEW'; payload: FPPViewOption }
  | { type: 'SET_SKILL_LEVEL'; payload: SkillLevel }
  | { type: 'SET_FINGERS'; payload: FingerCount }
  | { type: 'SET_FINGER_ASSIGNMENT'; payload: FingerAssignment }
  | { type: 'SET_GRIP'; payload: GripStyle }
  | { type: 'SET_GYROSCOPE'; payload: GyroscopeMode }
  | { type: 'SET_PLAYSTYLE'; payload: PlayStyle }
  | { type: 'SET_SENSITIVITY'; payload: GeneratedSensitivity }
  | { type: 'SET_LANGUAGE'; payload: 'ar' | 'en' }
  | { type: 'RESET' };

// ==================== UI Types ====================

export interface StepInfo {
  number: number;
  title: string;
  titleAr: string;
  isCompleted: boolean;
  isActive: boolean;
}
