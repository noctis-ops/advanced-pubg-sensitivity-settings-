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
  popularityRank?: number;
}

// ==================== Player Types ====================

export type FingerCount = 2 | 3 | 4 | 5 | 6;

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
  | 'balanced'
  | 'passive';

export type FPSOption = 30 | 60 | 90 | 120;

export interface PlayerSettings {
  fingerCount: FingerCount;
  gripStyle: GripStyle;
  gyroscopeMode: GyroscopeMode;
  playStyle: PlayStyle;
  preferredFPS: FPSOption;
}

// ==================== Sensitivity Types ====================

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
  freeLook: number;
}

export interface ExplanationFactor {
  factor: string;
  factorAr: string;
  impact: string;
  impactAr: string;
  adjustment: number;
}

export interface GeneratedSensitivity {
  id: string;
  createdAt: Date;
  device: Device;
  playerSettings: PlayerSettings;
  sensitivity: SensitivityCategory;
  additional: AdditionalSettings;
  explanations: ExplanationFactor[];
}

// ==================== App State Types ====================

export type AppStep = 1 | 2 | 3 | 4 | 5 | 'results';

export interface AppState {
  currentStep: AppStep;
  selectedDevice: Device | null;
  playerSettings: PlayerSettings;
  generatedSensitivity: GeneratedSensitivity | null;
  language: 'ar' | 'en';
}

export type AppAction =
  | { type: 'SET_STEP'; payload: AppStep }
  | { type: 'SET_DEVICE'; payload: Device }
  | { type: 'SET_FPS'; payload: FPSOption }
  | { type: 'SET_FINGERS'; payload: FingerCount }
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
