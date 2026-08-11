import { ScopeId, SensitivitySet } from '../types';

// ============================================================
// BASE SENSITIVITY - deterministic reference point
// 6.5" screen, 60 FPS, 4-finger claw, full gyro, balanced
// ============================================================

export const BASE_SENSITIVITY: {
  camera: SensitivitySet;
  ads: SensitivitySet;
  gyroscope: SensitivitySet;
  adsGyroscope: SensitivitySet;
} = {
  camera: {
    noScope: 100,
    redDot: 70,
    x2: 40,
    x3: 28,
    x4: 20,
    x6: 14,
    x8: 10,
    aimTPP: 80,
    aimFPP: 78
  },
  ads: {
    noScope: 85,
    redDot: 55,
    x2: 32,
    x3: 22,
    x4: 16,
    x6: 11,
    x8: 8,
    aimTPP: 72,
    aimFPP: 70
  },
  gyroscope: {
    noScope: 350,
    redDot: 350,
    x2: 330,
    x3: 290,
    x4: 250,
    x6: 180,
    x8: 140,
    aimTPP: 340,
    aimFPP: 335
  },
  adsGyroscope: {
    noScope: 350,
    redDot: 340,
    x2: 320,
    x3: 290,
    x4: 255,
    x6: 190,
    x8: 150,
    aimTPP: 345,
    aimFPP: 340
  }
};

// Sensitivity ranges used by both the general and weapon-aware calculators.
export const SENSITIVITY_RANGES = {
  camera: { min: 1, max: 200 },
  ads: { min: 1, max: 200 },
  gyroscope: { min: 0, max: 400 },
  adsGyroscope: { min: 0, max: 400 }
} as const;

// ============================================================
// GLOBAL GENERATOR MULTIPLIERS
// ============================================================

export const GRIP_MULTIPLIERS: Record<'normal' | 'gyroscope', Record<string, number>> = {
  normal: {
    thumbs: 0.95,
    'three-finger': 0.98,
    claw: 1.00,
    'five-claw': 1.02,
    'full-claw': 1.04
  },
  gyroscope: {
    thumbs: 1.12,
    'three-finger': 1.06,
    claw: 1.00,
    'five-claw': 0.97,
    'full-claw': 0.94
  }
};

export const GYRO_MODE_MULTIPLIERS: Record<string, Record<string, number>> = {
  camera: { off: 1.15, 'scope-only': 1.05, 'always-on': 1.00 },
  ads: { off: 1.12, 'scope-only': 1.03, 'always-on': 1.00 },
  gyroscope: { off: 0, 'scope-only': 0.85, 'always-on': 1.00 }
};

export const PLAYSTYLE_MULTIPLIERS: Record<string, Record<string, number>> = {
  camera: { aggressive: 1.08, 'close-aggressive': 1.04, 'tournament-elite': 1.03, balanced: 1.00, passive: 0.95 },
  ads: { aggressive: 1.05, 'close-aggressive': 1.03, 'tournament-elite': 1.02, balanced: 1.00, passive: 0.97 },
  gyroscope: { aggressive: 1.06, 'close-aggressive': 1.03, 'tournament-elite': 1.03, balanced: 1.00, passive: 0.95 },
  adsGyroscope: { aggressive: 1.04, 'close-aggressive': 1.03, 'tournament-elite': 1.03, balanced: 1.00, passive: 0.96 }
};

/** Advanced settings are calibration factors, not separate sensitivity data. */
export const FOV_MULTIPLIERS: Record<number, number> = {
  80: 1.04,
  82: 1.03,
  84: 1.02,
  86: 1.01,
  88: 1.00,
  90: 0.98
};

export const FPP_VIEW_MULTIPLIERS: Record<number, number> = {
  90: 1.03,
  93: 1.02,
  95: 1.01,
  98: 1.00,
  100: 0.99,
  103: 0.97
};

export const SKILL_LEVEL_MULTIPLIERS: Record<string, number> = {
  beginner: 0.90,
  intermediate: 0.96,
  advanced: 1.00,
  pro: 1.05
};

// ============================================================
// SCOPE MODEL
// ============================================================

/**
 * Scope profiles are not sensitivity values. They describe the job of a
 * scope: acquisition speed for low zoom and micro-control for high zoom.
 * The weapon calculator combines these profiles with the weapon/device data.
 */
export interface ScopeProfile {
  zoom: number;
  cameraSpeed: number;
  adsPrecision: number;
  gyroControl: number;
  acquisition: number;
  headshotFocus: number;
}

export interface ScopePlaystyleFactor {
  camera: number;
  ads: number;
  gyro: number;
  headshotFocus: number;
}

export const SCOPE_PROFILES: Record<ScopeId, ScopeProfile> = {
  noScope: { zoom: 0, cameraSpeed: 1.10, adsPrecision: 1.08, gyroControl: 0.94, acquisition: 1.15, headshotFocus: 1.03 },
  redDot: { zoom: 1, cameraSpeed: 1.06, adsPrecision: 1.04, gyroControl: 0.90, acquisition: 1.12, headshotFocus: 1.05 },
  x2: { zoom: 2, cameraSpeed: 0.98, adsPrecision: 0.97, gyroControl: 0.84, acquisition: 0.99, headshotFocus: 1.04 },
  x3: { zoom: 3, cameraSpeed: 0.91, adsPrecision: 0.91, gyroControl: 0.78, acquisition: 0.92, headshotFocus: 1.03 },
  x4: { zoom: 4, cameraSpeed: 0.84, adsPrecision: 0.85, gyroControl: 0.72, acquisition: 0.84, headshotFocus: 1.04 },
  x6: { zoom: 6, cameraSpeed: 0.72, adsPrecision: 0.74, gyroControl: 0.65, acquisition: 0.72, headshotFocus: 1.05 },
  x8: { zoom: 8, cameraSpeed: 0.62, adsPrecision: 0.64, gyroControl: 0.58, acquisition: 0.62, headshotFocus: 1.06 }
};

/** Close-aggressive is intentionally asymmetric: speed for low zoom, precision above 2x. */
export const SCOPE_PLAYSTYLE_FACTORS: Record<string, Partial<Record<ScopeId, ScopePlaystyleFactor>>> = {
  'close-aggressive': {
    noScope: { camera: 1.12, ads: 1.10, gyro: 1.08, headshotFocus: 1.03 },
    redDot: { camera: 1.10, ads: 1.08, gyro: 1.06, headshotFocus: 1.05 },
    x2: { camera: 1.06, ads: 1.04, gyro: 1.04, headshotFocus: 1.04 },
    x3: { camera: 0.94, ads: 0.90, gyro: 0.94, headshotFocus: 1.03 },
    x4: { camera: 0.88, ads: 0.84, gyro: 0.88, headshotFocus: 1.04 },
    x6: { camera: 0.80, ads: 0.76, gyro: 0.80, headshotFocus: 1.05 },
    x8: { camera: 0.72, ads: 0.68, gyro: 0.72, headshotFocus: 1.06 }
  },
  'tournament-elite': {
    noScope: { camera: 1.10, ads: 1.08, gyro: 1.07, headshotFocus: 1.08 },
    redDot: { camera: 1.08, ads: 1.07, gyro: 1.05, headshotFocus: 1.10 },
    x2: { camera: 1.04, ads: 1.03, gyro: 1.03, headshotFocus: 1.08 },
    x3: { camera: 0.93, ads: 0.89, gyro: 0.92, headshotFocus: 1.06 },
    x4: { camera: 0.87, ads: 0.82, gyro: 0.86, headshotFocus: 1.08 },
    x6: { camera: 0.79, ads: 0.74, gyro: 0.78, headshotFocus: 1.10 },
    x8: { camera: 0.71, ads: 0.66, gyro: 0.70, headshotFocus: 1.12 }
  }
};

export const SCOPE_KEYS = [
  'noScope',
  'redDot',
  'x2',
  'x3',
  'x4',
  'x6',
  'x8'
] as const satisfies readonly ScopeId[];

export const SCOPE_LABELS: Record<ScopeId, { en: string; ar: string }> = {
  noScope: { en: 'No Scope (TPP/FPP)', ar: 'بدون سكوب' },
  redDot: { en: 'Red Dot / Holographic', ar: 'ريد دوت / هولوغرافيك' },
  x2: { en: '2x Scope', ar: 'سكوب 2x' },
  x3: { en: '3x Scope', ar: 'سكوب 3x' },
  x4: { en: '4x Scope', ar: 'سكوب 4x' },
  x6: { en: '6x Scope', ar: 'سكوب 6x' },
  x8: { en: '8x Scope', ar: 'سكوب 8x' }
};
