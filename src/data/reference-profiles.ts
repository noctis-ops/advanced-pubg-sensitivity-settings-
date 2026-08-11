import { BASE_SENSITIVITY } from './constants';
import type { SensitivityCategory, SensitivitySet } from '../types';

export interface ReferenceProfile {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  source: 'reference-model';
  sensitivity: SensitivityCategory;
}

function scaleSet(set: SensitivitySet, factor: number): SensitivitySet {
  const scale = (value: number) => Math.round(value * factor);
  return {
    noScope: scale(set.noScope),
    redDot: scale(set.redDot),
    x2: scale(set.x2),
    x3: scale(set.x3),
    x4: scale(set.x4),
    x6: scale(set.x6),
    x8: scale(set.x8),
    aimTPP: scale(set.aimTPP),
    aimFPP: scale(set.aimFPP)
  };
}

function createProfile(
  id: string,
  name: string,
  nameAr: string,
  description: string,
  descriptionAr: string,
  factors: { camera: number; ads: number; gyroscope: number; adsGyroscope: number }
): ReferenceProfile {
  return {
    id,
    name,
    nameAr,
    description,
    descriptionAr,
    source: 'reference-model',
    sensitivity: {
      camera: scaleSet(BASE_SENSITIVITY.camera, factors.camera),
      ads: scaleSet(BASE_SENSITIVITY.ads, factors.ads),
      gyroscope: scaleSet(BASE_SENSITIVITY.gyroscope, factors.gyroscope),
      adsGyroscope: scaleSet(BASE_SENSITIVITY.adsGyroscope, factors.adsGyroscope)
    }
  };
}

/** Reference models, not fake named-player settings. They are comparison baselines only. */
export const referenceProfiles: ReferenceProfile[] = [
  createProfile(
    'tournament-balanced',
    'Tournament Balanced Reference',
    'مرجع البطولات المتوازن',
    'A stable reference for mixed close, mid, and long-range fights.',
    'مرجع ثابت للقتال القريب والمتوسط والبعيد.',
    { camera: 1.00, ads: 1.00, gyroscope: 1.00, adsGyroscope: 1.00 }
  ),
  createProfile(
    'aggressive-entry',
    'Aggressive Entry Reference',
    'مرجع الدخول الهجومي',
    'Prioritizes fast target acquisition and close-range transitions.',
    'يعطي أولوية لسرعة التقاط الهدف والانتقال في القتال القريب.',
    { camera: 1.08, ads: 1.05, gyroscope: 1.06, adsGyroscope: 1.04 }
  ),
  createProfile(
    'precision-control',
    'Precision Control Reference',
    'مرجع التحكم الدقيق',
    'Prioritizes micro-control, DMR taps, and long-range stability.',
    'يعطي أولوية للتحكم الميكروي وثبات DMR والمدى البعيد.',
    { camera: 0.94, ads: 0.92, gyroscope: 0.95, adsGyroscope: 0.92 }
  )
];
