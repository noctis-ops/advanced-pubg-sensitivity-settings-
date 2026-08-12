import type {
  AdditionalSettings,
  Device,
  ExplanationFactor,
  GeneratedSensitivity,
  PlayerSettings,
  SensitivityCategory,
  SensitivitySet
} from '../types';
import {
  BASE_SENSITIVITY,
  FOV_MULTIPLIERS,
  FPP_VIEW_MULTIPLIERS,
  GRIP_MULTIPLIERS,
  GYRO_MODE_MULTIPLIERS,
  PLAYSTYLE_MULTIPLIERS,
  SENSITIVITY_RANGES,
  SKILL_LEVEL_MULTIPLIERS
} from '../data/constants';
import { weapons } from '../data/weapons';
import { calculateAllWeaponSensitivities } from './weapon-sensitivity-calculator';
import { calculateDeviceFactors } from './sensitivity-engine';
import { calculateSensitivityConfidence } from './confidence';
import { buildPlayerModel, createPlayerSkillProfile } from './player-model';
import { optimizeSensitivityVector } from './sensitivity-optimizer';

/**
 * Canonical sensitivity pipeline.
 *
 * This is the only function that applies device/player calibration to the
 * global scope baseline. Weapon/scope recommendations consume its output and
 * never apply device/player factors a second time.
 */
export function calculateRuleBasedSensitivity(
  device: Device,
  settings: PlayerSettings
): SensitivityCategory {
  const deviceFactors = calculateDeviceFactors(device, settings);
  const gripNormal = GRIP_MULTIPLIERS.normal[settings.gripStyle] ?? 1;
  const gripGyro = GRIP_MULTIPLIERS.gyroscope[settings.gripStyle] ?? 1;
  const cameraMode = GYRO_MODE_MULTIPLIERS.camera[settings.gyroscopeMode] ?? 1;
  const adsMode = GYRO_MODE_MULTIPLIERS.ads[settings.gyroscopeMode] ?? 1;
  const gyroMode = GYRO_MODE_MULTIPLIERS.gyroscope[settings.gyroscopeMode] ?? 0;
  const fovFactor = FOV_MULTIPLIERS[settings.fov] ?? 1;
  const fppViewFactor = FPP_VIEW_MULTIPLIERS[settings.fppView] ?? 1;
  const skillFactor = SKILL_LEVEL_MULTIPLIERS[settings.skillLevel] ?? 1;

  const base: SensitivityCategory = {
    camera: calculateCategoryValues(
      BASE_SENSITIVITY.camera,
      [deviceFactors.normal, gripNormal, cameraMode, fovFactor, skillFactor, PLAYSTYLE_MULTIPLIERS.camera[settings.playStyle] ?? 1],
      'camera',
      1,
      fppViewFactor
    ),
    ads: calculateCategoryValues(
      BASE_SENSITIVITY.ads,
      [deviceFactors.normal, gripNormal, adsMode, fovFactor, skillFactor, PLAYSTYLE_MULTIPLIERS.ads[settings.playStyle] ?? 1],
      'ads',
      1,
      fppViewFactor
    ),
    gyroscope: calculateCategoryValues(
      BASE_SENSITIVITY.gyroscope,
      [deviceFactors.gyro, gripGyro, gyroMode, skillFactor, PLAYSTYLE_MULTIPLIERS.gyroscope[settings.playStyle] ?? 1],
      'gyroscope',
      1,
      fppViewFactor
    ),
    adsGyroscope: calculateCategoryValues(
      BASE_SENSITIVITY.adsGyroscope,
      [deviceFactors.gyro, gripGyro, gyroMode, skillFactor, PLAYSTYLE_MULTIPLIERS.adsGyroscope[settings.playStyle] ?? 1],
      'adsGyroscope',
      1,
      fppViewFactor
    )
  };

  return base;
}

/** Rules are the expert prior; this public function adds the measured-data optimizer stage. */
export function calculateSensitivity(
  device: Device,
  settings: PlayerSettings
): SensitivityCategory {
  const base = calculateRuleBasedSensitivity(device, settings);
  const skillProfile = createPlayerSkillProfile(settings);
  const optimized = optimizeSensitivityVector(base, {
    settings,
    skillProfile,
    experiments: settings.sensitivityExperiments ?? []
  }).sensitivity;
  if (settings.gyroscopeMode === 'off') return optimized;
  // Gyro control is a measured/user-provided skill dimension, not a global
  // preset. It changes gyro authority only, leaving camera and ADS independent.
  const gyroAuthority = Math.min(1.05, Math.max(0.86, 0.93 + (skillProfile.gyroControlScore.score - 0.50) * 0.20));
  const adjust = (values: SensitivitySet): SensitivitySet => ({
    ...values,
    noScope: Math.min(400, Math.max(0, Math.round(values.noScope * gyroAuthority))),
    redDot: Math.min(400, Math.max(0, Math.round(values.redDot * gyroAuthority))),
    x2: Math.min(400, Math.max(0, Math.round(values.x2 * gyroAuthority))),
    x3: Math.min(400, Math.max(0, Math.round(values.x3 * gyroAuthority))),
    x4: Math.min(400, Math.max(0, Math.round(values.x4 * gyroAuthority))),
    x6: Math.min(400, Math.max(0, Math.round(values.x6 * gyroAuthority))),
    x8: Math.min(400, Math.max(0, Math.round(values.x8 * gyroAuthority))),
    aimTPP: Math.min(400, Math.max(0, Math.round(values.aimTPP * gyroAuthority))),
    aimFPP: Math.min(400, Math.max(0, Math.round(values.aimFPP * gyroAuthority)))
  });
  return { ...optimized, gyroscope: adjust(optimized.gyroscope), adsGyroscope: adjust(optimized.adsGyroscope) };
}

function calculateCategoryValues(
  base: SensitivitySet,
  multipliers: number[],
  category: keyof typeof SENSITIVITY_RANGES,
  aimTPPFactor = 1,
  aimFPPFactor = 1
): SensitivitySet {
  const range = SENSITIVITY_RANGES[category];
  const calculateValue = (baseValue: number): number => {
    const value = multipliers.reduce((result, multiplier) => result * multiplier, baseValue);
    return Math.max(range.min, Math.min(range.max, Math.round(value)));
  };

  return {
    noScope: calculateValue(base.noScope),
    redDot: calculateValue(base.redDot),
    x2: calculateValue(base.x2),
    x3: calculateValue(base.x3),
    x4: calculateValue(base.x4),
    x6: calculateValue(base.x6),
    x8: calculateValue(base.x8),
    aimTPP: calculateValue(base.aimTPP * aimTPPFactor),
    aimFPP: calculateValue(base.aimFPP * aimFPPFactor)
  };
}

export function calculateMovementButtonSize(
  screenSize: number,
  fingerCount: number
): number {
  let baseSize = 100;

  if (screenSize < 5.5) baseSize = 130;
  else if (screenSize < 6.0) baseSize = 120;
  else if (screenSize < 6.5) baseSize = 110;
  else if (screenSize < 7.0) baseSize = 100;
  else if (screenSize < 10) baseSize = 90;
  else baseSize = 75;

  if (fingerCount >= 5) baseSize += 20;
  else if (fingerCount >= 4) baseSize += 10;

  return Math.min(200, Math.max(50, baseSize));
}

function addExplanation(
  explanations: ExplanationFactor[],
  factor: string,
  factorAr: string,
  adjustment: number,
  impact: string,
  impactAr: string
) {
  if (Math.abs(adjustment) <= 1) return;
  explanations.push({ factor, factorAr, impact, impactAr, adjustment });
}

export function calculateFireButtonSize(screenSize: number, fingerCount: number): number {
  const base = screenSize < 6 ? 125 : screenSize < 7 ? 115 : screenSize < 10 ? 105 : 95;
  const fingerAdjustment = fingerCount >= 5 ? 10 : fingerCount >= 4 ? 5 : 0;
  return Math.min(200, Math.max(70, base + fingerAdjustment));
}

export function calculatePeekButtonSize(fingerCount: number, playStyle: PlayerSettings['playStyle']): number {
  const base = playStyle === 'aggressive' ? 110 : playStyle === 'passive' ? 90 : 100;
  return Math.min(180, Math.max(70, base + (fingerCount >= 5 ? 8 : fingerCount >= 4 ? 4 : 0)));
}

export function calculateSprintSensitivity(device: Device, settings: PlayerSettings): number {
  const movementButton = calculateMovementButtonSize(device.specs.screenSize, settings.fingerCount);
  const deviceFactors = calculateDeviceFactors(device, settings);
  const playstyle = settings.playStyle === 'aggressive' || settings.playStyle === 'close-aggressive' || settings.playStyle === 'tournament-elite' ? 1.04 : settings.playStyle === 'passive' ? 0.92 : 1;
  const buttonFactor = 1 - (movementButton - 100) * 0.001;
  // PUBG Mobile's Sprint Sensitivity slider is capped at 100.
  return Math.round(Math.min(100, Math.max(70, 100 * deviceFactors.normal * 0.96 * playstyle * buttonFactor)));
}

export function generateExplanations(
  device: Device,
  settings: PlayerSettings
): ExplanationFactor[] {
  const factors = calculateDeviceFactors(device, settings);
  const explanations: ExplanationFactor[] = [];

  addExplanation(
    explanations,
    'Screen Size',
    'حجم الشاشة',
    Math.round((factors.screenNormal - 1) * 100),
    factors.screenNormal > 1 ? 'Increased for a smaller screen' : 'Decreased for a larger screen',
    factors.screenNormal > 1 ? 'زيادة لأن الشاشة أصغر' : 'تقليل لأن الشاشة أكبر'
  );
  addExplanation(
    explanations,
    'Frame Rate',
    'معدل الإطارات',
    Math.round((factors.fpsNormal - 1) * 100),
    `${Math.min(settings.preferredFPS, device.specs.maxFPS)} FPS response calibration`,
    `معايرة استجابة ${Math.min(settings.preferredFPS, device.specs.maxFPS)} FPS`
  );
  addExplanation(
    explanations,
    'Touch Response',
    'استجابة اللمس',
    Math.round((factors.touch - 1) * 100),
    'Touch sampling calibration',
    'معايرة معدل أخذ اللمس'
  );
  addExplanation(
    explanations,
    'Gyroscope Quality',
    'جودة الجايروسكوب',
    Math.round((factors.gyroQuality - 1) * 100),
    'Sensor quality calibration',
    'معايرة جودة المستشعر'
  );
  addExplanation(
    explanations,
    'Processor Tier',
    'فئة المعالج',
    Math.round((factors.processor - 1) * 100),
    'Frame pacing calibration',
    'معايرة انتظام الفريمات'
  );

  const grip = GRIP_MULTIPLIERS.normal[settings.gripStyle] ?? 1;
  addExplanation(
    explanations,
    'Grip Style',
    'طريقة المسك',
    Math.round((grip - 1) * 100),
    `Adjusted for ${settings.fingerCount} fingers`,
    `معدّل لـ ${settings.fingerCount} أصابع`
  );

  const playstyle = PLAYSTYLE_MULTIPLIERS.camera[settings.playStyle] ?? 1;
  addExplanation(
    explanations,
    'Playstyle',
    'أسلوب اللعب',
    Math.round((playstyle - 1) * 100),
    `${settings.playStyle} rotation/precision profile`,
    `ملف ${settings.playStyle === 'aggressive' ? 'هجومي' : settings.playStyle === 'close-aggressive' ? 'هجومي قريب' : settings.playStyle === 'tournament-elite' ? 'بطولات هجومي' : settings.playStyle === 'passive' ? 'قناص' : 'متوازن'}`
  );

  addExplanation(
    explanations,
    'FOV',
    'مجال الرؤية',
    Math.round(((FOV_MULTIPLIERS[settings.fov] ?? 1) - 1) * 100),
    `FOV ${settings.fov} calibration`,
    `معايرة FOV ${settings.fov}`
  );
  addExplanation(
    explanations,
    'FPP Camera View',
    'منظور FPP',
    Math.round(((FPP_VIEW_MULTIPLIERS[settings.fppView] ?? 1) - 1) * 100),
    `FPP Camera View ${settings.fppView} calibration`,
    `معايرة منظور FPP على ${settings.fppView}`
  );
  addExplanation(
    explanations,
    'Skill Level',
    'مستوى المهارة',
    Math.round(((SKILL_LEVEL_MULTIPLIERS[settings.skillLevel] ?? 1) - 1) * 100),
    `${settings.skillLevel} control profile`,
    `ملف تحكم ${settings.skillLevel}`
  );

  if (settings.gyroscopeMode === 'off') {
    explanations.push({
      factor: 'Gyroscope Mode',
      factorAr: 'وضع الجايروسكوب',
      impact: 'Gyro disabled; camera compensation enabled',
      impactAr: 'الجايرو مغلق؛ تم تفعيل تعويض الكاميرا',
      adjustment: 15
    });
  }

  return explanations;
}

function stableProfileId(device: Device, settings: PlayerSettings): string {
  const input = JSON.stringify({ device: device.id, settings });
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) hash = Math.imul(hash ^ input.charCodeAt(index), 16777619);
  return `sens-${(hash >>> 0).toString(16)}`;
}

export function generateFullSensitivity(
  device: Device,
  settings: PlayerSettings
): GeneratedSensitivity {
  const baselineSensitivity = calculateRuleBasedSensitivity(device, settings);
  const playerModel = buildPlayerModel(device, settings);
  const optimization = optimizeSensitivityVector(baselineSensitivity, {
    settings,
    skillProfile: playerModel.skillProfile,
    experiments: settings.sensitivityExperiments ?? []
  });
  const sensitivity = optimization.sensitivity;
  const weaponSensitivities = calculateAllWeaponSensitivities(
    weapons,
    device,
    settings,
    sensitivity
  );
  const confidence = calculateSensitivityConfidence(device, weaponSensitivities);
  const explanations = generateExplanations(device, settings);
  const additional: AdditionalSettings = {
    movementButtonSize: calculateMovementButtonSize(device.specs.screenSize, settings.fingerCount),
    fireButtonSize: calculateFireButtonSize(device.specs.screenSize, settings.fingerCount),
    peekButtonSize: calculatePeekButtonSize(settings.fingerCount, settings.playStyle),
    freeLook: device.type === 'tablet' ? 95 : 110,
    sprintSensitivity: calculateSprintSensitivity(device, settings),
    fov: settings.fov,
    fppView: settings.fppView
  };

  return {
    id: stableProfileId(device, settings),
    createdAt: new Date(),
    device,
    playerSettings: settings,
    baselineSensitivity,
    sensitivity,
    weaponSensitivities,
    confidence,
    playerModel,
    sensitivityOptimization: optimization,
    additional,
    explanations
  };
}
