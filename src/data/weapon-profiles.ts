import type { ScopeId, WeaponCategory, WeaponProfile } from '../types';

/**
 * PUBG Mobile does not expose a public, stable recoil telemetry API. These
 * values are therefore expert-defined normalized priors, not measurements
 * extracted from the game. A future Training Ground importer can replace a
 * field only after marking its source as measured.
 */
const DOMAIN_NOTE = {
  en: 'Expert-defined normalized prior; not direct PUBG telemetry.',
  ar: 'تقدير معياري معرف من خبرة المجال؛ وليس بيانات ارتداد مستخرجة مباشرة من PUBG.'
};

const SCOPE_USAGE_PRIORS: Partial<Record<ScopeId, number>> = {
  noScope: 1.04,
  redDot: 1.00,
  x2: 0.98,
  x3: 0.94,
  x4: 0.90,
  x6: 0.82,
  x8: 0.76
};

const scopes = (...ids: ScopeId[]): Partial<Record<ScopeId, number>> =>
  Object.fromEntries(ids.map((id) => [id, SCOPE_USAGE_PRIORS[id] ?? 1])) as Partial<Record<ScopeId, number>>;

function profile(
  id: string,
  category: WeaponCategory,
  pattern: WeaponProfile['recoilPatternCharacteristics'],
  vertical: number,
  horizontal: number,
  fireRate: number,
  burstLength: number,
  cadence: number,
  recoveryDemand: number,
  range: WeaponProfile['effectiveEngagementRange'],
  scopeUsage: Partial<Record<ScopeId, number>>,
  tracking: number,
  flick: number,
  stability: number,
  precision: number
): WeaponProfile {
  return {
    id,
    category,
    recoilPatternCharacteristics: pattern,
    verticalRecoilTendency: vertical,
    horizontalRecoilTendency: horizontal,
    fireRate,
    burstCharacteristics: {
      mode: category === 'sniper' || category === 'dmr' ? 'single' : category === 'ar' || category === 'smg' || category === 'lmg' ? 'auto' : 'single',
      burstLength,
      cadence,
      recoveryDemand
    },
    effectiveEngagementRange: range,
    scopeUsage,
    trackingDemand: tracking,
    flickDemand: flick,
    stabilityDemand: stability,
    precisionDemand: precision,
    source: 'expert-defined-normalized',
    measured: false,
    confidence: 0.52,
    notes: DOMAIN_NOTE
  };
}

export const WEAPON_PROFILES: WeaponProfile[] = [
  profile('m416', 'ar', 'straight', 0.42, 0.25, 0.62, 30, 0.62, 0.35, { minMeters: 10, optimalMeters: 90, maxMeters: 300 }, scopes('noScope', 'redDot', 'x2', 'x3', 'x4', 'x6'), 0.68, 0.45, 0.78, 0.58),
  profile('akm', 'ar', 'left-drift', 0.86, 0.58, 0.50, 30, 0.48, 0.72, { minMeters: 10, optimalMeters: 70, maxMeters: 250 }, scopes('noScope', 'redDot', 'x2', 'x3', 'x4', 'x6'), 0.55, 0.56, 0.35, 0.60),
  profile('m762', 'ar', 'right-drift', 0.96, 0.72, 0.70, 30, 0.70, 0.86, { minMeters: 10, optimalMeters: 65, maxMeters: 240 }, scopes('noScope', 'redDot', 'x2', 'x3', 'x4', 'x6'), 0.62, 0.60, 0.26, 0.66),
  profile('aug', 'ar', 'straight', 0.31, 0.23, 0.62, 30, 0.62, 0.28, { minMeters: 10, optimalMeters: 100, maxMeters: 320 }, scopes('noScope', 'redDot', 'x2', 'x3', 'x4', 'x6'), 0.70, 0.44, 0.84, 0.62),
  profile('scarl', 'ar', 'straight', 0.30, 0.20, 0.54, 30, 0.54, 0.30, { minMeters: 10, optimalMeters: 85, maxMeters: 300 }, scopes('noScope', 'redDot', 'x2', 'x3', 'x4', 'x6'), 0.65, 0.43, 0.82, 0.60),
  profile('groza', 'ar', 'straight', 0.70, 0.46, 0.82, 30, 0.82, 0.65, { minMeters: 10, optimalMeters: 75, maxMeters: 250 }, scopes('noScope', 'redDot', 'x2', 'x3', 'x4', 'x6'), 0.76, 0.63, 0.44, 0.58),
  profile('famas', 'ar', 'burst-kick', 0.64, 0.42, 0.86, 25, 0.86, 0.61, { minMeters: 10, optimalMeters: 65, maxMeters: 220 }, scopes('noScope', 'redDot', 'x2', 'x3', 'x4'), 0.80, 0.70, 0.48, 0.56),
  profile('ump45', 'smg', 'straight', 0.24, 0.18, 0.56, 30, 0.56, 0.24, { minMeters: 5, optimalMeters: 40, maxMeters: 150 }, scopes('noScope', 'redDot', 'x2', 'x3'), 0.82, 0.64, 0.82, 0.47),
  profile('vector', 'smg', 'straight', 0.48, 0.38, 0.94, 30, 0.94, 0.48, { minMeters: 5, optimalMeters: 25, maxMeters: 90 }, scopes('noScope', 'redDot', 'x2'), 0.91, 0.71, 0.55, 0.44),
  profile('uzi', 'smg', 'zigzag', 0.60, 0.57, 1.00, 30, 1.00, 0.62, { minMeters: 3, optimalMeters: 25, maxMeters: 80 }, scopes('noScope', 'redDot', 'x2'), 0.94, 0.76, 0.40, 0.40),
  profile('dp28', 'lmg', 'straight', 0.52, 0.31, 0.45, 30, 0.45, 0.42, { minMeters: 10, optimalMeters: 100, maxMeters: 300 }, scopes('noScope', 'redDot', 'x2', 'x3', 'x4', 'x6'), 0.57, 0.43, 0.62, 0.63),
  profile('m249', 'lmg', 'straight', 0.68, 0.46, 0.82, 30, 0.82, 0.58, { minMeters: 10, optimalMeters: 85, maxMeters: 270 }, scopes('noScope', 'redDot', 'x2', 'x3', 'x4', 'x6'), 0.74, 0.55, 0.43, 0.55),
  profile('sks', 'dmr', 'straight', 0.52, 0.34, 0.38, 1, 0.38, 0.46, { minMeters: 40, optimalMeters: 170, maxMeters: 450 }, scopes('redDot', 'x2', 'x3', 'x4', 'x6', 'x8'), 0.46, 0.58, 0.50, 0.80),
  profile('mini14', 'dmr', 'straight', 0.27, 0.21, 0.44, 1, 0.44, 0.28, { minMeters: 40, optimalMeters: 180, maxMeters: 500 }, scopes('redDot', 'x2', 'x3', 'x4', 'x6', 'x8'), 0.52, 0.62, 0.76, 0.84),
  profile('slr', 'dmr', 'straight', 0.72, 0.46, 0.34, 1, 0.34, 0.58, { minMeters: 50, optimalMeters: 200, maxMeters: 500 }, scopes('redDot', 'x2', 'x3', 'x4', 'x6', 'x8'), 0.50, 0.62, 0.38, 0.84),
  profile('mk14', 'dmr', 'straight', 0.82, 0.57, 0.57, 1, 0.57, 0.72, { minMeters: 40, optimalMeters: 170, maxMeters: 450 }, scopes('redDot', 'x2', 'x3', 'x4', 'x6', 'x8'), 0.65, 0.69, 0.28, 0.72),
  profile('kar98k', 'sniper', 'single-shot', 0.20, 0.13, 0.08, 1, 0.08, 0.20, { minMeters: 100, optimalMeters: 250, maxMeters: 600 }, scopes('redDot', 'x3', 'x4', 'x6', 'x8'), 0.25, 0.82, 0.82, 0.96),
  profile('m24', 'sniper', 'single-shot', 0.24, 0.15, 0.09, 1, 0.09, 0.22, { minMeters: 100, optimalMeters: 280, maxMeters: 650 }, scopes('redDot', 'x3', 'x4', 'x6', 'x8'), 0.28, 0.85, 0.80, 0.98),
  profile('awm', 'sniper', 'single-shot', 0.34, 0.18, 0.07, 1, 0.07, 0.30, { minMeters: 150, optimalMeters: 350, maxMeters: 800 }, scopes('redDot', 'x3', 'x4', 'x6', 'x8'), 0.22, 0.90, 0.68, 1.00)
];

const profileMap = new Map(WEAPON_PROFILES.map((item) => [item.id, item]));

export const REQUIRED_WEAPON_PROFILE_IDS = [
  'm416', 'akm', 'm762', 'aug', 'scarl', 'ump45', 'vector', 'uzi', 'dp28', 'm249',
  'groza', 'famas', 'sks', 'mini14', 'slr', 'mk14', 'kar98k', 'm24', 'awm'
] as const;

export function getWeaponProfile(weaponId: string): WeaponProfile | undefined {
  return profileMap.get(weaponId);
}

export function getRequiredWeaponProfiles(): WeaponProfile[] {
  return REQUIRED_WEAPON_PROFILE_IDS.map((id) => profileMap.get(id)).filter((item): item is WeaponProfile => Boolean(item));
}

export function validateWeaponProfiles(): string[] {
  const errors: string[] = [];
  for (const id of REQUIRED_WEAPON_PROFILE_IDS) {
    const item = profileMap.get(id);
    if (!item) {
      errors.push(`Missing expert weapon profile: ${id}`);
      continue;
    }
    const bounded = [item.verticalRecoilTendency, item.horizontalRecoilTendency, item.fireRate, item.trackingDemand, item.flickDemand, item.stabilityDemand, item.precisionDemand];
    if (bounded.some((value) => value < 0 || value > 1)) errors.push(`${id}: normalized domain characteristic is outside 0..1.`);
    if (item.source !== 'expert-defined-normalized' || item.measured) errors.push(`${id}: unmeasured profile must be marked expert-defined-normalized.`);
  }
  return errors;
}
