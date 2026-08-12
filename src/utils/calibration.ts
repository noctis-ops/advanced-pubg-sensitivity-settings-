import { SENSITIVITY_RANGES } from '../data/constants';
import type {
  CalibrationAdjustment,
  CalibrationObservation,
  ScopeId,
  SensitivityCategory,
  WeaponScopeSensitivity
} from '../types';

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const bounded = (value: number, category: keyof typeof SENSITIVITY_RANGES) => {
  const range = SENSITIVITY_RANGES[category];
  return Math.round(clamp(value, range.min, range.max));
};

/**
 * Turns a controlled Training Ground observation into a small, explainable
 * adjustment. It never replaces the canonical model; it is a post-calibration
 * correction for the individual player's hand and device feel.
 */
export function calculateCalibrationAdjustment(
  observation: CalibrationObservation
): CalibrationAdjustment {
  const amount = observation.severity * 2;
  switch (observation.issue) {
    case 'overshoot':
      return {
        cameraDelta: -amount,
        adsDelta: -amount,
        gyroscopeDelta: -Math.max(1, observation.severity),
        adsGyroscopeDelta: -Math.max(1, observation.severity),
        rationale: {
          en: 'Reduced speed to remove overshoot during target acquisition.',
          ar: 'تم تقليل السرعة لمنع تجاوز الهدف أثناء الالتقاط.'
        }
      };
    case 'undershoot':
      return {
        cameraDelta: amount,
        adsDelta: amount,
        gyroscopeDelta: Math.max(1, observation.severity),
        adsGyroscopeDelta: Math.max(1, observation.severity),
        rationale: {
          en: 'Increased response to reach the target with a shorter swipe.',
          ar: 'تمت زيادة الاستجابة للوصول إلى الهدف بسحبة أقصر.'
        }
      };
    case 'vertical-recoil':
      return {
        cameraDelta: 0,
        adsDelta: -Math.max(1, observation.severity),
        gyroscopeDelta: amount + 1,
        adsGyroscopeDelta: amount + 1,
        rationale: {
          en: 'Added vertical correction authority while slightly calming ADS.',
          ar: 'تمت زيادة قدرة التصحيح العمودي مع تهدئة ADS قليلاً.'
        }
      };
    case 'horizontal-left':
      return {
        cameraDelta: 0,
        adsDelta: -Math.max(1, observation.severity),
        gyroscopeDelta: amount,
        adsGyroscopeDelta: amount,
        rationale: {
          en: 'Added controlled response for a left-pulling spray pattern.',
          ar: 'تمت إضافة استجابة مضبوطة لتعويض نمط السحب لليسار.'
        }
      };
    case 'horizontal-right':
      return {
        cameraDelta: 0,
        adsDelta: -Math.max(1, observation.severity),
        gyroscopeDelta: amount,
        adsGyroscopeDelta: amount,
        rationale: {
          en: 'Added controlled response for a right-pulling spray pattern.',
          ar: 'تمت إضافة استجابة مضبوطة لتعويض نمط السحب لليمين.'
        }
      };
    case 'slow-acquisition':
      return {
        cameraDelta: amount + 1,
        adsDelta: amount,
        gyroscopeDelta: Math.max(1, observation.severity),
        adsGyroscopeDelta: Math.max(1, observation.severity),
        rationale: {
          en: 'Increased acquisition speed while preserving scope control.',
          ar: 'تمت زيادة سرعة الالتقاط مع الحفاظ على التحكم بالسكوب.'
        }
      };
    case 'stable':
      return {
        cameraDelta: 0,
        adsDelta: 0,
        gyroscopeDelta: 0,
        adsGyroscopeDelta: 0,
        rationale: {
          en: 'No correction needed; the current profile is stable.',
          ar: 'لا يحتاج الملف إلى تعديل؛ النتيجة الحالية مستقرة.'
        }
      };
  }
}

export function applyCalibrationToPair(
  pair: WeaponScopeSensitivity,
  adjustment: CalibrationAdjustment
): WeaponScopeSensitivity {
  return {
    ...pair,
    camera: bounded(pair.camera + adjustment.cameraDelta, 'camera'),
    ads: bounded(pair.ads + adjustment.adsDelta, 'ads'),
    gyroscope: bounded(pair.gyroscope + adjustment.gyroscopeDelta, 'gyroscope'),
    adsGyroscope: bounded(pair.adsGyroscope + adjustment.adsGyroscopeDelta, 'adsGyroscope')
  };
}

export function applyCalibrationToSensitivity(
  sensitivity: SensitivityCategory,
  scope: ScopeId,
  adjustment: CalibrationAdjustment
): SensitivityCategory {
  const next: SensitivityCategory = {
    camera: { ...sensitivity.camera },
    ads: { ...sensitivity.ads },
    gyroscope: { ...sensitivity.gyroscope },
    adsGyroscope: { ...sensitivity.adsGyroscope }
  };
  next.camera[scope] = bounded(next.camera[scope] + adjustment.cameraDelta, 'camera');
  next.ads[scope] = bounded(next.ads[scope] + adjustment.adsDelta, 'ads');
  next.gyroscope[scope] = bounded(next.gyroscope[scope] + adjustment.gyroscopeDelta, 'gyroscope');
  next.adsGyroscope[scope] = bounded(next.adsGyroscope[scope] + adjustment.adsGyroscopeDelta, 'adsGyroscope');
  return next;
}
