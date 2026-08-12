import {
  SCOPE_KEYS,
  SCOPE_LABELS,
  SCOPE_PLAYSTYLE_FACTORS,
  SCOPE_PROFILES,
  SENSITIVITY_RANGES
} from '../data/constants';
import type {
  Device,
  PlayerSettings,
  ScopeId,
  SensitivityCategory,
  Weapon,
  WeaponAimSensitivity,
  WeaponCategory,
  WeaponSensitivityResult,
  WeaponScopeFactors,
  WeaponScopeSensitivity
} from '../types';
import { calculateDeviceFactors } from './sensitivity-engine';
import { getWeaponProfile } from '../data/weapon-profiles';
import { createPlayerSkillProfile } from './player-model';
import { optimizeSensitivity } from './sensitivity-optimizer';

export { calculateDeviceFactors } from './sensitivity-engine';

/**
 * Weapon/scope sensitivity model.
 *
 * PUBG Mobile exposes sensitivity by scope rather than by weapon. This
 * calculator therefore produces a deterministic weapon profile that can be
 * used as a per-weapon training/preset reference while retaining the game's
 * global scope settings as the input baseline.
 */

interface CategoryModel {
  cameraSpeed: number;
  adsControl: number;
  gyroCompensation: number;
}

/** Small category priors; weapon telemetry still controls the majority of the result. */
const CATEGORY_MODEL: Record<WeaponCategory, CategoryModel> = {
  ar: { cameraSpeed: 1.00, adsControl: 1.00, gyroCompensation: 1.00 },
  smg: { cameraSpeed: 1.04, adsControl: 1.01, gyroCompensation: 1.04 },
  sniper: { cameraSpeed: 0.94, adsControl: 0.93, gyroCompensation: 0.94 },
  dmr: { cameraSpeed: 0.97, adsControl: 0.95, gyroCompensation: 0.97 },
  shotgun: { cameraSpeed: 1.08, adsControl: 1.05, gyroCompensation: 1.06 },
  lmg: { cameraSpeed: 0.99, adsControl: 0.97, gyroCompensation: 1.03 }
};

const SCOPE_IDEAL_RANGES: Record<ScopeId, number> = {
  noScope: 20,
  redDot: 35,
  x2: 60,
  x3: 90,
  x4: 130,
  x6: 220,
  x8: 320
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const round = (value: number): number => Math.round(value);

const boundedValue = (
  value: number,
  category: keyof typeof SENSITIVITY_RANGES
): number => {
  const range = SENSITIVITY_RANGES[category];
  return round(clamp(value, range.min, range.max));
};

const normalized = (value: number, min: number, max: number): number =>
  clamp((value - min) / (max - min), 0, 1);

export function getWeaponTelemetry(weapon: Weapon): {
  recoilLoad: number;
  fireRateLoad: number;
  stability: number;
  attachmentSupport: number;
  spreadLoad: number;
  firstShotLoad: number;
  cameraFactor: number;
  adsFactor: number;
  gyroFactor: number;
} {
  const verticalLoad = normalized(weapon.recoil.vertical, 1, 10);
  const horizontalLoad = normalized(weapon.recoil.horizontal, 1, 10);
  const stability = normalized(weapon.sprayStability, 1, 10);
  const curveVertical = weapon.recoilCurve.reduce((sum, point) => sum + Math.abs(point.vertical), 0)
    / Math.max(weapon.recoilCurve.length, 1);
  const curveHorizontal = weapon.recoilCurve.reduce((sum, point) => sum + Math.abs(point.horizontal), 0)
    / Math.max(weapon.recoilCurve.length, 1);
  const curveRecovery = weapon.recoilCurve.reduce((sum, point) => sum + point.recovery, 0)
    / Math.max(weapon.recoilCurve.length, 1);
  const curveVariance = weapon.recoilCurve.length > 1
    ? weapon.recoilCurve.slice(1).reduce((sum, point, index) => {
        const previous = weapon.recoilCurve[index];
        return sum + Math.abs(point.horizontal - previous.horizontal);
      }, 0) / (weapon.recoilCurve.length - 1)
    : 0;
  const scalarRecoilLoad = verticalLoad * 0.50 + horizontalLoad * 0.30 + (1 - stability) * 0.20;
  const curveRecoilLoad = curveVertical * 0.50
    + curveHorizontal * 0.25
    + curveVariance * 0.15
    + (1 - curveRecovery) * 0.10;
  const spreadLoad = weapon.spreadProfile
    ? clamp((weapon.spreadProfile.ads + weapon.spreadProfile.movement) / 2, 0, 1)
    : 0;
  const firstShotLoad = clamp((weapon.firstShotMultiplier ?? 1) - 1, 0, 1);
  const visualLoad = weapon.visualBehavior
    ? (weapon.visualBehavior.screenShake + weapon.visualBehavior.muzzleMovement + weapon.visualBehavior.weaponMovement) / 3
    : 0;
  const statsRecoilLoad = weapon.recoilStats
    ? clamp(weapon.recoilStats.verticalMean * 0.50 + weapon.recoilStats.horizontalMean * 0.30 + weapon.recoilStats.variance * 0.20, 0, 1)
    : curveRecoilLoad;
  const recoilLoad = clamp(
    scalarRecoilLoad * 0.20
      + curveRecoilLoad * 0.45
      + statsRecoilLoad * 0.25
      + spreadLoad * 0.06
      + firstShotLoad * 0.02
      + visualLoad * 0.02,
    0,
    1
  );
  const fireRateLoad = normalized(weapon.fireRate, 300, 1100);
  const attachmentSupport = clamp(
    1
      + (weapon.attachmentCompatibility.includes('grip') ? 0.025 : 0)
      + (weapon.attachmentCompatibility.includes('stock') ? 0.015 : 0)
      + (weapon.attachmentCompatibility.includes('muzzle') ? 0.010 : 0)
      + (weapon.attachmentCompatibility.includes('magazine') ? 0.005 : 0),
    1,
    1.055
  );
  const adjustedRecoilLoad = clamp(recoilLoad / attachmentSupport, 0, 1);
  const category = CATEGORY_MODEL[weapon.category];

  // ADS favours a stable reticle; gyro favours authority to counter spray.
  const cameraFactor = clamp(
    category.cameraSpeed * (1 + fireRateLoad * 0.04 + (1 - stability) * 0.03),
    0.82,
    1.16
  );
  const adsFactor = clamp(
    category.adsControl
      * (1 - adjustedRecoilLoad * 0.12 - fireRateLoad * 0.05 + stability * 0.04)
      * attachmentSupport,
    0.76,
    1.10
  );
  const gyroFactor = clamp(
    category.gyroCompensation
      * (1 + adjustedRecoilLoad * 0.15 + fireRateLoad * 0.08 - stability * 0.03)
      / (1 + (attachmentSupport - 1) * 0.45),
    0.82,
    1.22
  );

  return {
    recoilLoad,
    fireRateLoad,
    stability,
    attachmentSupport,
    spreadLoad,
    firstShotLoad,
    cameraFactor,
    adsFactor,
    gyroFactor
  };
}

function calculateRangeFit(weapon: Weapon, scope: ScopeId): number {
  const span = Math.max(weapon.effectiveRange.maxMeters - weapon.effectiveRange.minMeters, 1);
  const distance = Math.abs(SCOPE_IDEAL_RANGES[scope] - weapon.effectiveRange.optimalMeters);
  return clamp(0.92 + (1 - distance / span) * 0.08, 0.90, 1.02);
}

function buildReason(
  scope: ScopeId,
  telemetry: ReturnType<typeof getWeaponTelemetry>
): { en: string; ar: string } {
  const profile = SCOPE_PROFILES[scope];
  const scopeReason = profile.zoom <= 1
    ? {
        en: 'fast target acquisition and head-level tracking',
        ar: 'التقاط الهدف بسرعة وتتبع مستوى الرأس'
      }
    : {
        en: 'lower zoom speed with micro-control priority',
        ar: 'سرعة أقل مع أولوية للتحكم الميكروي'
      };

  const recoilReason = telemetry.recoilLoad >= 0.65
    ? {
        en: 'high recoil compensation',
        ar: 'تعويض الارتداد العالي'
      }
    : telemetry.recoilLoad <= 0.30
      ? {
          en: 'stable reticle control',
          ar: 'ثبات أعلى للنقطة'
        }
      : {
          en: 'balanced recoil control',
          ar: 'توازن في التحكم بالارتداد'
        };

  const rateReason = telemetry.fireRateLoad >= 0.60
    ? {
        en: 'fast fire-rate correction',
        ar: 'تعويض معدل الإطلاق السريع'
      }
    : {
        en: 'controlled firing rhythm',
        ar: 'إيقاع إطلاق متحكم به'
      };

  return {
    en: `${scopeReason.en}; ${recoilReason.en}; ${rateReason.en}.`,
    ar: `${scopeReason.ar}؛ ${recoilReason.ar}؛ ${rateReason.ar}.`
  };
}

function buildHeadshotTip(weapon: Weapon, scope: ScopeId): { en: string; ar: string } {
  if (weapon.category === 'shotgun') {
    return {
      en: 'Aim upper chest and let the spread/recoil finish at head level.',
      ar: 'صوّب أعلى الصدر واجعل الانتشار والارتداد ينتهيان عند مستوى الرأس.'
    };
  }

  if (scope === 'redDot' || scope === 'noScope') {
    return {
      en: 'Pre-aim at head level, then make a short horizontal correction.',
      ar: 'صوّب مسبقاً على مستوى الرأس ثم نفّذ تصحيحاً أفقياً قصيراً.'
    };
  }

  if (weapon.category === 'sniper' || weapon.category === 'dmr') {
    return {
      en: 'Hold the head line and use a small micro-flick; avoid long swipes.',
      ar: 'حافظ على خط الرأس واستخدم حركة ميكرو قصيرة، وتجنب السحب الطويل.'
    };
  }

  return {
    en: 'Keep the crosshair at head level and pull down smoothly during the spray.',
    ar: 'حافظ على المؤشر عند مستوى الرأس واسحب للأسفل بسلاسة أثناء الرش.'
  };
}

export function validateWeapon(weapon: Weapon): string[] {
  const errors: string[] = [];
  const scopeSet = new Set(weapon.scopeCompatibility);

  if (weapon.recoil.vertical < 1 || weapon.recoil.vertical > 10) {
    errors.push('Vertical recoil must be between 1 and 10.');
  }
  if (weapon.recoil.horizontal < 1 || weapon.recoil.horizontal > 10) {
    errors.push('Horizontal recoil must be between 1 and 10.');
  }
  if (weapon.sprayStability < 1 || weapon.sprayStability > 10) {
    errors.push('Spray stability must be between 1 and 10.');
  }
  if (weapon.recoilCurve.length < 3 || weapon.recoilCurve.some((point, index) =>
    point.bullet !== index + 1
    || !Number.isFinite(point.horizontal)
    || !Number.isFinite(point.vertical)
    || !Number.isFinite(point.recovery)
    || Math.abs(point.horizontal) > 1
    || point.vertical < 0
    || point.vertical > 1
    || point.recovery < 0
    || point.recovery > 1
  )) {
    errors.push('Recoil curve must contain ordered normalized samples.');
  }
  if (weapon.fireRate <= 0) {
    errors.push('Fire rate must be positive.');
  }
  if (weapon.effectiveRange.minMeters < 0
    || weapon.effectiveRange.optimalMeters < weapon.effectiveRange.minMeters
    || weapon.effectiveRange.maxMeters < weapon.effectiveRange.optimalMeters) {
    errors.push('Effective range must be ordered and non-negative.');
  }
  if (scopeSet.size === 0) {
    errors.push('At least one compatible scope is required.');
  }
  if (scopeSet.size !== weapon.scopeCompatibility.length) {
    errors.push('Scope compatibility cannot contain duplicates.');
  }
  if (weapon.bestScopes.some((scope) => {
    const scopeId = scopeToId(scope);
    return scopeId === null || !scopeSet.has(scopeId);
  })) {
    errors.push('Every recommended scope must be compatible with the weapon.');
  }
  if (['ar', 'smg', 'shotgun', 'lmg'].includes(weapon.category) && scopeSet.has('x8')) {
    errors.push('This weapon class cannot expose an 8x scope in this model.');
  }
  if (weapon.category === 'shotgun' && (scopeSet.has('x2') || scopeSet.has('x3') || scopeSet.has('x4') || scopeSet.has('x6'))) {
    errors.push('Shotguns are limited to no-scope and the shared Red Dot/Holographic setting in this model.');
  }
  if (weapon.category === 'smg' && (scopeSet.has('x4') || scopeSet.has('x6') || scopeSet.has('x8'))) {
    errors.push('SMGs cannot expose 4x, 6x, or 8x scopes in this model.');
  }

  return errors;
}

function scopeToId(label: string): ScopeId | null {
  const normalizedLabel = label.toLowerCase().replace(/\s+/g, '');
  if (normalizedLabel.includes('holo')) return 'redDot';
  if (normalizedLabel.includes('reddot')) return 'redDot';
  if (normalizedLabel.includes('noscope')) return 'noScope';
  if (normalizedLabel.includes('8x')) return 'x8';
  if (normalizedLabel.includes('6x')) return 'x6';
  if (normalizedLabel.includes('4x')) return 'x4';
  if (normalizedLabel.includes('3x')) return 'x3';
  if (normalizedLabel.includes('2x')) return 'x2';
  return null;
}

export function isScopeSupported(weapon: Weapon, scope: ScopeId): boolean {
  return validateWeapon(weapon).length === 0 && weapon.scopeCompatibility.includes(scope);
}

function calculatePair(
  weapon: Weapon,
  scope: ScopeId,
  device: Device,
  settings: PlayerSettings,
  baseSensitivity: SensitivityCategory
): WeaponScopeSensitivity {
  const profile = SCOPE_PROFILES[scope];
  const deviceFactors = calculateDeviceFactors(device, settings);
  const telemetry = getWeaponTelemetry(weapon);
  const rangeFit = calculateRangeFit(weapon, scope);
  const styleFactors = SCOPE_PLAYSTYLE_FACTORS[settings.playStyle]?.[scope] ?? { camera: 1, ads: 1, gyro: 1, headshotFocus: 1 };
  const headshotFocus = profile.headshotFocus * styleFactors.headshotFocus;

  // Device and player settings are already applied by the canonical global
  // result. Only weapon telemetry and scope mechanics are applied here.
  const camera = boundedValue(
    baseSensitivity.camera[scope]
      * telemetry.cameraFactor
      * profile.cameraSpeed
      * styleFactors.camera
      * rangeFit,
    'camera'
  );

  const ads = boundedValue(
    baseSensitivity.ads[scope]
      * telemetry.adsFactor
      * profile.adsPrecision
      * profile.acquisition
      * styleFactors.ads
      * headshotFocus
      * rangeFit,
    'ads'
  );

  const gyro = boundedValue(
    baseSensitivity.gyroscope[scope]
      * telemetry.gyroFactor
      * profile.gyroControl
      * styleFactors.gyro,
    'gyroscope'
  );

  const adsGyroscope = boundedValue(
    baseSensitivity.adsGyroscope[scope]
      * telemetry.gyroFactor
      * profile.gyroControl
      * profile.adsPrecision
      * styleFactors.gyro
      * headshotFocus,
    'adsGyroscope'
  );

  const factors: WeaponScopeFactors = {
    recoilLoad: telemetry.recoilLoad,
    fireRateLoad: telemetry.fireRateLoad,
    stability: telemetry.stability,
    deviceNormalFactor: deviceFactors.normal,
    deviceGyroFactor: deviceFactors.gyro,
    attachmentSupport: telemetry.attachmentSupport,
    scopeZoom: profile.zoom,
    headshotFocus,
    spreadLoad: telemetry.spreadLoad,
    firstShotLoad: telemetry.firstShotLoad
  };

  const initial: WeaponScopeSensitivity = {
    scope,
    camera,
    ads,
    gyroscope: gyro,
    adsGyroscope,
    factors,
    reason: buildReason(scope, telemetry),
    headshotTip: buildHeadshotTip(weapon, scope)
  };
  const optimized = optimizeSensitivity(initial, {
    settings,
    skillProfile: createPlayerSkillProfile(settings),
    weaponProfile: getWeaponProfile(weapon.id),
    weaponId: weapon.id,
    scope,
    experiments: settings.sensitivityExperiments ?? []
  });
  const activeGyroFloor = Math.max(2, Math.round((18 + weapon.recoil.vertical * 1.2) / (1 + profile.zoom * 0.45)));
  return {
    ...optimized.value,
    gyroscope: settings.gyroscopeMode === 'off' ? 0 : Math.max(activeGyroFloor, optimized.value.gyroscope),
    adsGyroscope: settings.gyroscopeMode === 'off' ? 0 : Math.max(activeGyroFloor, optimized.value.adsGyroscope),
    factors,
    optimization: {
      score: optimized.score,
      evidence: optimized.evidence,
      target: optimized.target,
      iterations: optimized.iterations,
      candidatesEvaluated: optimized.candidatesEvaluated
    },
    reason: {
      en: `${initial.reason.en} Optimized by bounded grid search and coordinate descent; ${optimized.reason.en}`,
      ar: `${initial.reason.ar} تم تحسينها ببحث شبكي محدود وهبوط إحداثي؛ ${optimized.reason.ar}`
    },
    headshotTip: buildHeadshotTip(weapon, scope)
  };
}

const EMPTY_AIM_FEATURES: WeaponAimSensitivity = {
  camera: { aimTPP: 0, aimFPP: 0 },
  ads: { aimTPP: 0, aimFPP: 0 },
  gyroscope: { aimTPP: 0, aimFPP: 0 },
  adsGyroscope: { aimTPP: 0, aimFPP: 0 }
};

function calculateAimFeatures(weapon: Weapon, baseSensitivity: SensitivityCategory): WeaponAimSensitivity {
  const telemetry = getWeaponTelemetry(weapon);
  return {
    camera: {
      aimTPP: boundedValue(baseSensitivity.camera.aimTPP * telemetry.cameraFactor, 'camera'),
      aimFPP: boundedValue(baseSensitivity.camera.aimFPP * telemetry.cameraFactor, 'camera')
    },
    ads: {
      aimTPP: boundedValue(baseSensitivity.ads.aimTPP * telemetry.adsFactor, 'ads'),
      aimFPP: boundedValue(baseSensitivity.ads.aimFPP * telemetry.adsFactor, 'ads')
    },
    gyroscope: {
      aimTPP: boundedValue(baseSensitivity.gyroscope.aimTPP * telemetry.gyroFactor, 'gyroscope'),
      aimFPP: boundedValue(baseSensitivity.gyroscope.aimFPP * telemetry.gyroFactor, 'gyroscope')
    },
    adsGyroscope: {
      aimTPP: boundedValue(baseSensitivity.adsGyroscope.aimTPP * telemetry.gyroFactor, 'adsGyroscope'),
      aimFPP: boundedValue(baseSensitivity.adsGyroscope.aimFPP * telemetry.gyroFactor, 'adsGyroscope')
    }
  };
}

/**
 * Generate one result for every valid weapon/scope pair. Unsupported pairs
 * are omitted rather than rendered with a misleading fallback value.
 */
export function calculateWeaponSensitivity(
  weapon: Weapon,
  device: Device,
  settings: PlayerSettings,
  baseSensitivity: SensitivityCategory
): WeaponSensitivityResult {
  const validationErrors = validateWeapon(weapon);
  if (validationErrors.length > 0) {
    return { weapon, valid: false, validationErrors, values: [], aimFeatures: EMPTY_AIM_FEATURES };
  }

  const aimFeatures = calculateAimFeatures(weapon, baseSensitivity);
  const values = SCOPE_KEYS
    .filter((scope) => weapon.scopeCompatibility.includes(scope))
    .map((scope) => calculatePair(weapon, scope, device, settings, baseSensitivity));

  return {
    weapon,
    valid: values.length > 0,
    validationErrors: [],
    values,
    aimFeatures
  };
}

export function calculateAllWeaponSensitivities(
  weapons: Weapon[],
  device: Device,
  settings: PlayerSettings,
  baseSensitivity: SensitivityCategory
): WeaponSensitivityResult[] {
  return weapons.map((weapon) => calculateWeaponSensitivity(weapon, device, settings, baseSensitivity));
}

export { SCOPE_LABELS };
