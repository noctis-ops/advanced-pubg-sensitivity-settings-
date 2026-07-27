import { 
  Device, 
  PlayerSettings, 
  SensitivityCategory, 
  SensitivitySet,
  ExplanationFactor,
  GeneratedSensitivity,
  AdditionalSettings
} from '../types';
import {
  BASE_SENSITIVITY,
  SENSITIVITY_RANGES,
  SCREEN_SIZE_MULTIPLIERS,
  FPS_MULTIPLIERS,
  GYRO_QUALITY_MULTIPLIERS,
  GRIP_MULTIPLIERS,
  GYRO_MODE_MULTIPLIERS,
  PLAYSTYLE_MULTIPLIERS,
  getClosestMultiplier
} from '../data/constants';

/**
 * Main function to calculate sensitivity
 */
export function calculateSensitivity(
  device: Device,
  settings: PlayerSettings
): SensitivityCategory {
  // Calculate all multipliers
  const screenMultNormal = getClosestMultiplier(device.specs.screenSize, SCREEN_SIZE_MULTIPLIERS.normal);
  const screenMultGyro = getClosestMultiplier(device.specs.screenSize, SCREEN_SIZE_MULTIPLIERS.gyroscope);
  
  const fpsMultNormal = FPS_MULTIPLIERS.normal[settings.preferredFPS] || 1.0;
  const fpsMultGyro = FPS_MULTIPLIERS.gyroscope[settings.preferredFPS] || 1.0;
  
  const gyroQualityMult = GYRO_QUALITY_MULTIPLIERS[device.specs.gyroscopeQuality] || 1.0;
  
  const gripMultNormal = GRIP_MULTIPLIERS.normal[settings.gripStyle] || 1.0;
  const gripMultGyro = GRIP_MULTIPLIERS.gyroscope[settings.gripStyle] || 1.0;
  
  const gyroModeMultCamera = GYRO_MODE_MULTIPLIERS.camera[settings.gyroscopeMode] || 1.0;
  const gyroModeMultAds = GYRO_MODE_MULTIPLIERS.ads[settings.gyroscopeMode] || 1.0;
  const gyroModeMultGyro = GYRO_MODE_MULTIPLIERS.gyroscope[settings.gyroscopeMode] || 1.0;
  
  const playstyleMultCamera = PLAYSTYLE_MULTIPLIERS.camera[settings.playStyle] || 1.0;
  const playstyleMultAds = PLAYSTYLE_MULTIPLIERS.ads[settings.playStyle] || 1.0;
  const playstyleMultGyro = PLAYSTYLE_MULTIPLIERS.gyroscope[settings.playStyle] || 1.0;
  const playstyleMultAdsGyro = PLAYSTYLE_MULTIPLIERS.adsGyroscope[settings.playStyle] || 1.0;

  // Calculate each category
  const camera = calculateCategoryValues(
    BASE_SENSITIVITY.camera,
    [screenMultNormal, fpsMultNormal, gripMultNormal, gyroModeMultCamera, playstyleMultCamera],
    'camera'
  );

  const ads = calculateCategoryValues(
    BASE_SENSITIVITY.ads,
    [screenMultNormal, fpsMultNormal, gripMultNormal, gyroModeMultAds, playstyleMultAds],
    'ads'
  );

  const gyroscope = calculateCategoryValues(
    BASE_SENSITIVITY.gyroscope,
    [screenMultGyro, fpsMultGyro, gyroQualityMult, gripMultGyro, gyroModeMultGyro, playstyleMultGyro],
    'gyroscope'
  );

  const adsGyroscope = calculateCategoryValues(
    BASE_SENSITIVITY.adsGyroscope,
    [screenMultGyro, fpsMultGyro, gyroQualityMult, gripMultGyro, gyroModeMultGyro, playstyleMultAdsGyro],
    'adsGyroscope'
  );

  return { camera, ads, gyroscope, adsGyroscope };
}

/**
 * Calculate values for a single category
 */
function calculateCategoryValues(
  base: SensitivitySet,
  multipliers: number[],
  category: keyof typeof SENSITIVITY_RANGES
): SensitivitySet {
  const range = SENSITIVITY_RANGES[category];
  
  const calculateValue = (baseValue: number): number => {
    let value = baseValue;
    for (const mult of multipliers) {
      value *= mult;
    }
    value = Math.round(value);
    return Math.max(range.min, Math.min(range.max, value));
  };

  return {
    noScope: calculateValue(base.noScope),
    redDot: calculateValue(base.redDot),
    x2: calculateValue(base.x2),
    x3: calculateValue(base.x3),
    x4: calculateValue(base.x4),
    x6: calculateValue(base.x6),
    x8: calculateValue(base.x8),
    aimTPP: calculateValue(base.aimTPP),
    aimFPP: calculateValue(base.aimFPP)
  };
}

/**
 * Calculate movement button size
 */
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

/**
 * Generate explanation factors
 */
export function generateExplanations(
  device: Device,
  settings: PlayerSettings
): ExplanationFactor[] {
  const explanations: ExplanationFactor[] = [];

  // Screen size
  const screenMult = getClosestMultiplier(device.specs.screenSize, SCREEN_SIZE_MULTIPLIERS.normal);
  if (Math.abs(screenMult - 1) > 0.01) {
    const adj = Math.round((screenMult - 1) * 100);
    explanations.push({
      factor: 'Screen Size',
      factorAr: 'حجم الشاشة',
      impact: screenMult > 1 ? `Increased (smaller ${device.specs.screenSize}" screen)` : `Decreased (larger ${device.specs.screenSize}" screen)`,
      impactAr: screenMult > 1 ? `زيادة (شاشة صغيرة ${device.specs.screenSize} بوصة)` : `تقليل (شاشة كبيرة ${device.specs.screenSize} بوصة)`,
      adjustment: adj
    });
  }

  // FPS
  const fpsMult = FPS_MULTIPLIERS.normal[settings.preferredFPS];
  if (Math.abs(fpsMult - 1) > 0.01) {
    const adj = Math.round((fpsMult - 1) * 100);
    explanations.push({
      factor: 'Frame Rate',
      factorAr: 'معدل الإطارات',
      impact: fpsMult > 1 ? `Increased (${settings.preferredFPS} FPS = faster response)` : `Decreased (${settings.preferredFPS} FPS)`,
      impactAr: fpsMult > 1 ? `زيادة (${settings.preferredFPS} FPS = استجابة أسرع)` : `تقليل (${settings.preferredFPS} FPS)`,
      adjustment: adj
    });
  }

  // Gyroscope quality
  if (settings.gyroscopeMode !== 'off') {
    const gyroQualityMult = GYRO_QUALITY_MULTIPLIERS[device.specs.gyroscopeQuality];
    if (Math.abs(gyroQualityMult - 1) > 0.01) {
      const adj = Math.round((gyroQualityMult - 1) * 100);
      explanations.push({
        factor: 'Gyroscope Quality',
        factorAr: 'جودة الجايروسكوب',
        impact: gyroQualityMult > 1 ? 'Increased (excellent gyro sensor)' : 'Decreased (compensating for gyro)',
        impactAr: gyroQualityMult > 1 ? 'زيادة (مستشعر جايرو ممتاز)' : 'تقليل (تعويض جودة الجايرو)',
        adjustment: adj
      });
    }
  }

  // Grip style
  const gripMult = GRIP_MULTIPLIERS.normal[settings.gripStyle];
  if (Math.abs(gripMult - 1) > 0.01) {
    const adj = Math.round((gripMult - 1) * 100);
    const gripNames: Record<string, { en: string; ar: string }> = {
      'thumbs': { en: 'Thumbs', ar: 'إبهامين' },
      'three-finger': { en: '3 Fingers', ar: '3 أصابع' },
      'claw': { en: '4 Finger Claw', ar: '4 أصابع مخلب' },
      'five-claw': { en: '5 Fingers', ar: '5 أصابع' },
      'full-claw': { en: '6 Finger Claw', ar: '6 أصابع مخلب' }
    };
    explanations.push({
      factor: 'Grip Style',
      factorAr: 'طريقة المسك',
      impact: `Adjusted for ${gripNames[settings.gripStyle]?.en || settings.gripStyle}`,
      impactAr: `معدّل لـ ${gripNames[settings.gripStyle]?.ar || settings.gripStyle}`,
      adjustment: adj
    });
  }

  // Playstyle
  const playstyleMult = PLAYSTYLE_MULTIPLIERS.camera[settings.playStyle];
  if (Math.abs(playstyleMult - 1) > 0.01) {
    const adj = Math.round((playstyleMult - 1) * 100);
    const playstyleNames: Record<string, { en: string; ar: string }> = {
      'aggressive': { en: 'Aggressive (fast rotations)', ar: 'هجومي (دوران سريع)' },
      'balanced': { en: 'Balanced', ar: 'متوازن' },
      'passive': { en: 'Passive/Sniper (precision)', ar: 'قناص (دقة عالية)' }
    };
    explanations.push({
      factor: 'Playstyle',
      factorAr: 'أسلوب اللعب',
      impact: playstyleNames[settings.playStyle]?.en || settings.playStyle,
      impactAr: playstyleNames[settings.playStyle]?.ar || settings.playStyle,
      adjustment: adj
    });
  }

  // Gyroscope mode
  if (settings.gyroscopeMode === 'off') {
    explanations.push({
      factor: 'Gyroscope Mode',
      factorAr: 'وضع الجايروسكوب',
      impact: 'Gyro OFF - camera sensitivity increased to compensate',
      impactAr: 'الجايرو مغلق - زيادة حساسية الكاميرا للتعويض',
      adjustment: 15
    });
  }

  return explanations;
}

/**
 * Generate full sensitivity result
 */
export function generateFullSensitivity(
  device: Device,
  settings: PlayerSettings
): GeneratedSensitivity {
  const sensitivity = calculateSensitivity(device, settings);
  const explanations = generateExplanations(device, settings);
  
  const additional: AdditionalSettings = {
    movementButtonSize: calculateMovementButtonSize(device.specs.screenSize, settings.fingerCount),
    freeLook: device.type === 'tablet' ? 95 : 110
  };

  return {
    id: `sens-${Date.now()}`,
    createdAt: new Date(),
    device,
    playerSettings: settings,
    sensitivity,
    additional,
    explanations
  };
}
