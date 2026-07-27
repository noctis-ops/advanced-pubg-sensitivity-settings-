import { SensitivitySet } from '../types';

// ============================================================
// BASE SENSITIVITY - Reference point for calculations
// Based on: 6.5" screen, 60 FPS, 4 fingers claw, full gyro, balanced
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

// Sensitivity ranges
export const SENSITIVITY_RANGES = {
  camera: { min: 1, max: 200 },
  ads: { min: 1, max: 200 },
  gyroscope: { min: 1, max: 400 },
  adsGyroscope: { min: 1, max: 400 }
};

// ============================================================
// MULTIPLIERS
// ============================================================

// Screen size multipliers
export const SCREEN_SIZE_MULTIPLIERS: Record<'normal' | 'gyroscope', Record<number, number>> = {
  normal: {
    4.7: 1.15,
    5.0: 1.12,
    5.4: 1.08,
    5.5: 1.06,
    5.8: 1.04,
    6.0: 1.02,
    6.1: 1.00,
    6.2: 0.99,
    6.4: 0.97,
    6.5: 0.96,
    6.7: 0.94,
    6.8: 0.92,
    6.9: 0.91,
    7.0: 0.90,
    7.9: 0.84,
    8.3: 0.82,
    10.2: 0.72,
    10.9: 0.68,
    11.0: 0.67,
    12.4: 0.60,
    12.9: 0.55,
    13.0: 0.54,
    14.6: 0.48
  },
  gyroscope: {
    4.7: 1.05,
    5.0: 1.04,
    5.4: 1.03,
    5.5: 1.02,
    5.8: 1.01,
    6.0: 1.00,
    6.1: 1.00,
    6.2: 0.99,
    6.4: 0.98,
    6.5: 0.97,
    6.7: 0.96,
    6.8: 0.95,
    6.9: 0.94,
    7.0: 0.93,
    7.9: 0.91,
    8.3: 0.90,
    10.2: 0.85,
    10.9: 0.82,
    11.0: 0.81,
    12.4: 0.75,
    12.9: 0.70,
    13.0: 0.69,
    14.6: 0.62
  }
};

// FPS multipliers
export const FPS_MULTIPLIERS: Record<'normal' | 'gyroscope', Record<number, number>> = {
  normal: {
    30: 0.92,
    60: 1.00,
    90: 1.04,
    120: 1.08
  },
  gyroscope: {
    30: 0.85,
    60: 1.00,
    90: 1.08,
    120: 1.15
  }
};

// Gyroscope quality multipliers (1-10 scale)
export const GYRO_QUALITY_MULTIPLIERS: Record<number, number> = {
  1: 0.70,
  2: 0.75,
  3: 0.80,
  4: 0.85,
  5: 0.90,
  6: 0.94,
  7: 0.97,
  8: 1.00,
  9: 1.03,
  10: 1.06
};

// Grip style multipliers
export const GRIP_MULTIPLIERS: Record<'normal' | 'gyroscope', Record<string, number>> = {
  normal: {
    'thumbs': 0.95,
    'three-finger': 0.98,
    'claw': 1.00,
    'five-claw': 1.02,
    'full-claw': 1.04
  },
  gyroscope: {
    'thumbs': 1.12,
    'three-finger': 1.06,
    'claw': 1.00,
    'five-claw': 0.97,
    'full-claw': 0.94
  }
};

// Gyroscope mode multipliers
export const GYRO_MODE_MULTIPLIERS: Record<string, Record<string, number>> = {
  camera: {
    'off': 1.15,
    'scope-only': 1.05,
    'always-on': 1.00
  },
  ads: {
    'off': 1.12,
    'scope-only': 1.03,
    'always-on': 1.00
  },
  gyroscope: {
    'off': 0,
    'scope-only': 0.85,
    'always-on': 1.00
  }
};

// Playstyle multipliers
export const PLAYSTYLE_MULTIPLIERS: Record<string, Record<string, number>> = {
  camera: {
    'aggressive': 1.08,
    'balanced': 1.00,
    'passive': 0.95
  },
  ads: {
    'aggressive': 1.05,
    'balanced': 1.00,
    'passive': 0.97
  },
  gyroscope: {
    'aggressive': 1.06,
    'balanced': 1.00,
    'passive': 0.95
  },
  adsGyroscope: {
    'aggressive': 1.04,
    'balanced': 1.00,
    'passive': 0.96
  }
};

// ============================================================
// HELPER FUNCTION
// ============================================================

export function getClosestMultiplier(
  value: number,
  multiplierMap: Record<number, number>
): number {
  const keys = Object.keys(multiplierMap).map(Number).sort((a, b) => a - b);
  
  if (value <= keys[0]) return multiplierMap[keys[0]];
  if (value >= keys[keys.length - 1]) return multiplierMap[keys[keys.length - 1]];
  
  for (let i = 0; i < keys.length - 1; i++) {
    if (value >= keys[i] && value <= keys[i + 1]) {
      const lower = keys[i];
      const upper = keys[i + 1];
      const ratio = (value - lower) / (upper - lower);
      return multiplierMap[lower] + ratio * (multiplierMap[upper] - multiplierMap[lower]);
    }
  }
  
  return 1.0;
}

// ============================================================
// SCOPE LABELS
// ============================================================

export const SCOPE_KEYS = ['noScope', 'redDot', 'x2', 'x3', 'x4', 'x6', 'x8'] as const;

export const SCOPE_LABELS: Record<string, { en: string; ar: string }> = {
  noScope: { en: 'No Scope (TPP/FPP)', ar: 'بدون سكوب' },
  redDot: { en: 'Red Dot / Holo', ar: 'ريد دوت / هولو' },
  x2: { en: '2x Scope', ar: 'سكوب 2x' },
  x3: { en: '3x Scope', ar: 'سكوب 3x' },
  x4: { en: '4x Scope', ar: 'سكوب 4x' },
  x6: { en: '6x Scope', ar: 'سكوب 6x' },
  x8: { en: '8x Scope', ar: 'سكوب 8x' },
  aimTPP: { en: 'Aim TPP', ar: 'Aim TPP' },
  aimFPP: { en: 'Aim FPP', ar: 'Aim FPP' }
};
