import type { Weapon, WeaponCategory } from '../types';
import { enrichWeaponsWithMetadata } from './weapon-metadata';

export type { Weapon, WeaponCategory } from '../types';

const rawWeapons: Weapon[] = [
  // ============ ASSAULT RIFLES ============
  {
    id: 'akm',
    name: 'AKM',
    nameAr: 'AKM',
    category: 'ar',
    sprayStability: 4,
    effectiveRange: { minMeters: 0, optimalMeters: 70, maxMeters: 250 },
    attachmentCompatibility: ['muzzle', 'grip', 'magazine'],
    scopeCompatibility: ['noScope', 'redDot', 'x2', 'x3', 'x4', 'x6'],
    icon: '🔫',
    recoil: { vertical: 9, horizontal: 5, pattern: 'left' },
    recoilCurve: [
      { bullet: 1, horizontal: -0.258, vertical: 0.661, recovery: 0.271 },
      { bullet: 2, horizontal: -0.275, vertical: 0.693, recovery: 0.283 },
      { bullet: 3, horizontal: -0.292, vertical: 0.724, recovery: 0.295 },
      { bullet: 4, horizontal: -0.31, vertical: 0.756, recovery: 0.307 },
      { bullet: 5, horizontal: -0.328, vertical: 0.787, recovery: 0.319 },
      { bullet: 6, horizontal: -0.345, vertical: 0.819, recovery: 0.331 },
      { bullet: 7, horizontal: -0.362, vertical: 0.85, recovery: 0.343 },
      { bullet: 8, horizontal: -0.38, vertical: 0.882, recovery: 0.355 },
      { bullet: 9, horizontal: -0.398, vertical: 0.914, recovery: 0.367 },
      { bullet: 10, horizontal: -0.415, vertical: 0.945, recovery: 0.379 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 600,
    difficulty: 'hard',
    bestScopes: ['Red Dot', '2x'],
    tips: {
      en: 'Pull down firmly + slight right correction. Burst fire at 50m+',
      ar: 'اسحب للأسفل بقوة + تصحيح خفيف لليمين. رش متقطع على 50 متر+'
    }
  },
  {
    id: 'm416',
    name: 'M416',
    nameAr: 'M416',
    category: 'ar',
    sprayStability: 8,
    effectiveRange: { minMeters: 0, optimalMeters: 90, maxMeters: 300 },
    attachmentCompatibility: ['muzzle', 'grip', 'magazine', 'stock'],
    scopeCompatibility: ['noScope', 'redDot', 'x2', 'x3', 'x4', 'x6'],
    icon: '🔫',
    recoil: { vertical: 5, horizontal: 3, pattern: 'straight' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.018, vertical: 0.367, recovery: 0.413 },
      { bullet: 2, horizontal: -0.02, vertical: 0.385, recovery: 0.425 },
      { bullet: 3, horizontal: 0.021, vertical: 0.402, recovery: 0.437 },
      { bullet: 4, horizontal: -0.022, vertical: 0.42, recovery: 0.449 },
      { bullet: 5, horizontal: 0.024, vertical: 0.438, recovery: 0.461 },
      { bullet: 6, horizontal: -0.025, vertical: 0.455, recovery: 0.473 },
      { bullet: 7, horizontal: 0.026, vertical: 0.472, recovery: 0.485 },
      { bullet: 8, horizontal: -0.027, vertical: 0.49, recovery: 0.497 },
      { bullet: 9, horizontal: 0.029, vertical: 0.508, recovery: 0.509 },
      { bullet: 10, horizontal: -0.03, vertical: 0.525, recovery: 0.521 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 680,
    difficulty: 'easy',
    bestScopes: ['Red Dot', '3x', '6x'],
    tips: {
      en: 'Smooth vertical pull. Most stable AR — spray full mag confidently',
      ar: 'سحب عمودي سلس. أثبت بندقية — رش المخزن كامل بثقة'
    }
  },
  {
    id: 'scarl',
    name: 'SCAR-L',
    nameAr: 'SCAR-L',
    category: 'ar',
    sprayStability: 9,
    effectiveRange: { minMeters: 0, optimalMeters: 85, maxMeters: 300 },
    attachmentCompatibility: ['muzzle', 'grip', 'magazine'],
    scopeCompatibility: ['noScope', 'redDot', 'x2', 'x3', 'x4', 'x6'],
    icon: '🔫',
    recoil: { vertical: 4, horizontal: 2, pattern: 'straight' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.012, vertical: 0.294, recovery: 0.449 },
      { bullet: 2, horizontal: -0.013, vertical: 0.308, recovery: 0.461 },
      { bullet: 3, horizontal: 0.014, vertical: 0.322, recovery: 0.473 },
      { bullet: 4, horizontal: -0.015, vertical: 0.336, recovery: 0.485 },
      { bullet: 5, horizontal: 0.016, vertical: 0.35, recovery: 0.497 },
      { bullet: 6, horizontal: -0.017, vertical: 0.364, recovery: 0.509 },
      { bullet: 7, horizontal: 0.017, vertical: 0.378, recovery: 0.521 },
      { bullet: 8, horizontal: -0.018, vertical: 0.392, recovery: 0.533 },
      { bullet: 9, horizontal: 0.019, vertical: 0.406, recovery: 0.545 },
      { bullet: 10, horizontal: -0.02, vertical: 0.42, recovery: 0.557 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 620,
    difficulty: 'easy',
    bestScopes: ['Red Dot', '3x', '4x'],
    tips: {
      en: 'Very low recoil. Steady vertical pull only. Great for beginners',
      ar: 'ارتداد منخفض جداً. سحب عمودي ثابت فقط. ممتاز للمبتدئين'
    }
  },
  {
    id: 'groza',
    name: 'Groza',
    nameAr: 'Groza',
    category: 'ar',
    sprayStability: 5,
    effectiveRange: { minMeters: 0, optimalMeters: 75, maxMeters: 250 },
    attachmentCompatibility: ['muzzle', 'grip', 'magazine'],
    scopeCompatibility: ['noScope', 'redDot', 'x2', 'x3', 'x4', 'x6'],
    icon: '💥',
    recoil: { vertical: 7, horizontal: 4, pattern: 'straight' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.025, vertical: 0.514, recovery: 0.342 },
      { bullet: 2, horizontal: -0.026, vertical: 0.539, recovery: 0.354 },
      { bullet: 3, horizontal: 0.028, vertical: 0.563, recovery: 0.366 },
      { bullet: 4, horizontal: -0.03, vertical: 0.588, recovery: 0.378 },
      { bullet: 5, horizontal: 0.031, vertical: 0.612, recovery: 0.39 },
      { bullet: 6, horizontal: -0.033, vertical: 0.637, recovery: 0.402 },
      { bullet: 7, horizontal: 0.035, vertical: 0.661, recovery: 0.414 },
      { bullet: 8, horizontal: -0.036, vertical: 0.686, recovery: 0.426 },
      { bullet: 9, horizontal: 0.038, vertical: 0.711, recovery: 0.438 },
      { bullet: 10, horizontal: -0.04, vertical: 0.735, recovery: 0.45 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 750,
    difficulty: 'medium',
    bestScopes: ['Red Dot', '2x'],
    tips: {
      en: 'High fire rate = aggressive pull down. Short bursts at range',
      ar: 'معدل نار عالي = سحب قوي للأسفل. رش قصير على المسافات'
    }
  },
  {
    id: 'aug',
    name: 'AUG A3',
    nameAr: 'AUG A3',
    category: 'ar',
    sprayStability: 9,
    effectiveRange: { minMeters: 0, optimalMeters: 100, maxMeters: 320 },
    attachmentCompatibility: ['muzzle', 'grip', 'magazine'],
    scopeCompatibility: ['noScope', 'redDot', 'x2', 'x3', 'x4', 'x6'],
    icon: '🔫',
    recoil: { vertical: 3, horizontal: 2, pattern: 'straight' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.012, vertical: 0.221, recovery: 0.485 },
      { bullet: 2, horizontal: -0.013, vertical: 0.231, recovery: 0.497 },
      { bullet: 3, horizontal: 0.014, vertical: 0.241, recovery: 0.509 },
      { bullet: 4, horizontal: -0.015, vertical: 0.252, recovery: 0.521 },
      { bullet: 5, horizontal: 0.016, vertical: 0.263, recovery: 0.533 },
      { bullet: 6, horizontal: -0.017, vertical: 0.273, recovery: 0.545 },
      { bullet: 7, horizontal: 0.017, vertical: 0.283, recovery: 0.557 },
      { bullet: 8, horizontal: -0.018, vertical: 0.294, recovery: 0.569 },
      { bullet: 9, horizontal: 0.019, vertical: 0.305, recovery: 0.581 },
      { bullet: 10, horizontal: -0.02, vertical: 0.315, recovery: 0.593 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 680,
    difficulty: 'easy',
    bestScopes: ['Red Dot', '3x', '6x'],
    tips: {
      en: 'Lowest recoil AR. Laser beam — full spray any range',
      ar: 'أقل ارتداد في البنادق. ليزر — رش كامل أي مسافة'
    }
  },
  {
    id: 'm762',
    name: 'M762 (Beryl)',
    nameAr: 'M762',
    category: 'ar',
    sprayStability: 3,
    effectiveRange: { minMeters: 0, optimalMeters: 65, maxMeters: 240 },
    attachmentCompatibility: ['muzzle', 'grip', 'magazine'],
    scopeCompatibility: ['noScope', 'redDot', 'x2', 'x3', 'x4', 'x6'],
    icon: '🔫',
    recoil: { vertical: 10, horizontal: 6, pattern: 'right' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.309, vertical: 0.735, recovery: 0.235 },
      { bullet: 2, horizontal: 0.33, vertical: 0.77, recovery: 0.247 },
      { bullet: 3, horizontal: 0.351, vertical: 0.805, recovery: 0.259 },
      { bullet: 4, horizontal: 0.372, vertical: 0.84, recovery: 0.271 },
      { bullet: 5, horizontal: 0.393, vertical: 0.875, recovery: 0.283 },
      { bullet: 6, horizontal: 0.414, vertical: 0.91, recovery: 0.295 },
      { bullet: 7, horizontal: 0.435, vertical: 0.945, recovery: 0.307 },
      { bullet: 8, horizontal: 0.456, vertical: 0.98, recovery: 0.319 },
      { bullet: 9, horizontal: 0.477, vertical: 0.98, recovery: 0.331 },
      { bullet: 10, horizontal: 0.498, vertical: 0.98, recovery: 0.343 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 700,
    difficulty: 'hard',
    bestScopes: ['Red Dot', '2x'],
    tips: {
      en: 'Hardest AR recoil — aggressive pull + left correction after 10 bullets',
      ar: 'أصعب ارتداد بندقية — سحب قوي + تصحيح يسار بعد 10 رصاصات'
    }
  },
  {
    id: 'g36c',
    name: 'G36C',
    nameAr: 'G36C',
    category: 'ar',
    sprayStability: 8,
    effectiveRange: { minMeters: 0, optimalMeters: 85, maxMeters: 280 },
    attachmentCompatibility: ['muzzle', 'grip', 'magazine'],
    scopeCompatibility: ['noScope', 'redDot', 'x2', 'x3', 'x4', 'x6'],
    icon: '🔫',
    recoil: { vertical: 4, horizontal: 3, pattern: 'straight' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.018, vertical: 0.294, recovery: 0.449 },
      { bullet: 2, horizontal: -0.02, vertical: 0.308, recovery: 0.461 },
      { bullet: 3, horizontal: 0.021, vertical: 0.322, recovery: 0.473 },
      { bullet: 4, horizontal: -0.022, vertical: 0.336, recovery: 0.485 },
      { bullet: 5, horizontal: 0.024, vertical: 0.35, recovery: 0.497 },
      { bullet: 6, horizontal: -0.025, vertical: 0.364, recovery: 0.509 },
      { bullet: 7, horizontal: 0.026, vertical: 0.378, recovery: 0.521 },
      { bullet: 8, horizontal: -0.027, vertical: 0.392, recovery: 0.533 },
      { bullet: 9, horizontal: 0.029, vertical: 0.406, recovery: 0.545 },
      { bullet: 10, horizontal: -0.03, vertical: 0.42, recovery: 0.557 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 680,
    difficulty: 'easy',
    bestScopes: ['Red Dot', '3x', '4x'],
    tips: {
      en: 'Similar to M416. Very controllable with built-in stock',
      ar: 'مشابه لـ M416. سهل التحكم مع المقبض المدمج'
    }
  },
  {
    id: 'mk47',
    name: 'MK47 Mutant',
    nameAr: 'MK47 Mutant',
    category: 'ar',
    sprayStability: 6,
    effectiveRange: { minMeters: 50, optimalMeters: 140, maxMeters: 350 },
    attachmentCompatibility: ['muzzle', 'grip', 'magazine'],
    scopeCompatibility: ['noScope', 'redDot', 'x2', 'x3', 'x4', 'x6'],
    icon: '🔫',
    recoil: { vertical: 6, horizontal: 3, pattern: 'straight' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.018, vertical: 0.441, recovery: 0.378 },
      { bullet: 2, horizontal: -0.02, vertical: 0.462, recovery: 0.39 },
      { bullet: 3, horizontal: 0.021, vertical: 0.483, recovery: 0.402 },
      { bullet: 4, horizontal: -0.022, vertical: 0.504, recovery: 0.414 },
      { bullet: 5, horizontal: 0.024, vertical: 0.525, recovery: 0.426 },
      { bullet: 6, horizontal: -0.025, vertical: 0.546, recovery: 0.438 },
      { bullet: 7, horizontal: 0.026, vertical: 0.567, recovery: 0.45 },
      { bullet: 8, horizontal: -0.027, vertical: 0.588, recovery: 0.462 },
      { bullet: 9, horizontal: 0.029, vertical: 0.609, recovery: 0.474 },
      { bullet: 10, horizontal: -0.03, vertical: 0.63, recovery: 0.486 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 400,
    difficulty: 'medium',
    bestScopes: ['3x', '4x', '6x'],
    tips: {
      en: 'Semi-auto tap fire for range. 2-shot burst can be deadly',
      ar: 'نقرات منفردة للمسافات. رشقة 2 رصاصة مميتة'
    }
  },
  {
    id: 'ace32',
    name: 'ACE32',
    nameAr: 'ACE32',
    category: 'ar',
    sprayStability: 7,
    effectiveRange: { minMeters: 0, optimalMeters: 80, maxMeters: 280 },
    attachmentCompatibility: ['muzzle', 'grip', 'magazine'],
    scopeCompatibility: ['noScope', 'redDot', 'x2', 'x3', 'x4', 'x6'],
    icon: '🔫',
    recoil: { vertical: 5, horizontal: 3, pattern: 'straight' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.018, vertical: 0.367, recovery: 0.413 },
      { bullet: 2, horizontal: -0.02, vertical: 0.385, recovery: 0.425 },
      { bullet: 3, horizontal: 0.021, vertical: 0.402, recovery: 0.437 },
      { bullet: 4, horizontal: -0.022, vertical: 0.42, recovery: 0.449 },
      { bullet: 5, horizontal: 0.024, vertical: 0.438, recovery: 0.461 },
      { bullet: 6, horizontal: -0.025, vertical: 0.455, recovery: 0.473 },
      { bullet: 7, horizontal: 0.026, vertical: 0.472, recovery: 0.485 },
      { bullet: 8, horizontal: -0.027, vertical: 0.49, recovery: 0.497 },
      { bullet: 9, horizontal: 0.029, vertical: 0.508, recovery: 0.509 },
      { bullet: 10, horizontal: -0.03, vertical: 0.525, recovery: 0.521 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 660,
    difficulty: 'easy',
    bestScopes: ['Red Dot', '3x', '4x'],
    tips: {
      en: 'Balanced AR with 7.62mm power. Good alternative to M416',
      ar: 'بندقية متوازنة بقوة 7.62. بديل جيد للـ M416'
    }
  },
  {
    id: 'qbz',
    name: 'QBZ',
    nameAr: 'QBZ',
    category: 'ar',
    sprayStability: 7,
    effectiveRange: { minMeters: 0, optimalMeters: 85, maxMeters: 300 },
    attachmentCompatibility: ['muzzle', 'grip', 'magazine'],
    scopeCompatibility: ['noScope', 'redDot', 'x2', 'x3', 'x4', 'x6'],
    icon: '🔫',
    recoil: { vertical: 5, horizontal: 3, pattern: 'straight' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.018, vertical: 0.367, recovery: 0.413 },
      { bullet: 2, horizontal: -0.020, vertical: 0.385, recovery: 0.425 },
      { bullet: 3, horizontal: 0.021, vertical: 0.402, recovery: 0.437 },
      { bullet: 4, horizontal: -0.022, vertical: 0.420, recovery: 0.449 },
      { bullet: 5, horizontal: 0.024, vertical: 0.438, recovery: 0.461 },
      { bullet: 6, horizontal: -0.025, vertical: 0.455, recovery: 0.473 },
      { bullet: 7, horizontal: 0.026, vertical: 0.472, recovery: 0.485 },
      { bullet: 8, horizontal: -0.027, vertical: 0.490, recovery: 0.497 },
      { bullet: 9, horizontal: 0.029, vertical: 0.508, recovery: 0.509 },
      { bullet: 10, horizontal: -0.030, vertical: 0.525, recovery: 0.521 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 680,
    difficulty: 'medium',
    bestScopes: ['Red Dot', '3x', '4x'],
    tips: {
      en: 'Stable 5.56 AR. Use a smooth vertical pull and keep the crosshair at head level during sprays.',
      ar: 'بندقية 5.56 مستقرة. استخدم سحباً عمودياً سلساً وحافظ على المؤشر عند مستوى الرأس أثناء الرش.'
    }
  },

  {
    id: 'famas',
    name: 'FAMAS',
    nameAr: 'FAMAS',
    category: 'ar',
    sprayStability: 5,
    effectiveRange: { minMeters: 0, optimalMeters: 65, maxMeters: 220 },
    attachmentCompatibility: ['muzzle', 'grip', 'magazine'],
    scopeCompatibility: ['noScope', 'redDot', 'x2', 'x3', 'x4'],
    icon: '🔫',
    recoil: { vertical: 7, horizontal: 4, pattern: 'right' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.025, vertical: 0.47, recovery: 0.35 },
      { bullet: 2, horizontal: 0.029, vertical: 0.50, recovery: 0.36 },
      { bullet: 3, horizontal: 0.033, vertical: 0.53, recovery: 0.37 },
      { bullet: 4, horizontal: 0.037, vertical: 0.56, recovery: 0.38 },
      { bullet: 5, horizontal: 0.041, vertical: 0.59, recovery: 0.39 },
      { bullet: 6, horizontal: 0.045, vertical: 0.62, recovery: 0.40 },
      { bullet: 7, horizontal: 0.049, vertical: 0.65, recovery: 0.41 },
      { bullet: 8, horizontal: 0.053, vertical: 0.68, recovery: 0.42 },
      { bullet: 9, horizontal: 0.057, vertical: 0.71, recovery: 0.43 },
      { bullet: 10, horizontal: 0.061, vertical: 0.74, recovery: 0.44 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 900,
    difficulty: 'hard',
    bestScopes: ['Red Dot', '2x'],
    tips: {
      en: 'Fast burst-like AR profile; prioritize short corrections in close fights.',
      ar: 'بروفايل بندقية سريع شبيه بالرشقات؛ أعطِ الأولوية للتصحيحات القصيرة في القتال القريب.'
    }
  },

  // ============ SMGs ============
  {
    id: 'uzi',
    name: 'Micro UZI',
    nameAr: 'UZI',
    category: 'smg',
    sprayStability: 4,
    effectiveRange: { minMeters: 0, optimalMeters: 25, maxMeters: 80 },
    attachmentCompatibility: ['muzzle', 'magazine'],
    scopeCompatibility: ['noScope', 'redDot', 'x2'],
    icon: '🔫',
    recoil: { vertical: 6, horizontal: 5, pattern: 'zigzag' },
    recoilCurve: [
      { bullet: 1, horizontal: -0.258, vertical: 0.441, recovery: 0.378 },
      { bullet: 2, horizontal: 0.275, vertical: 0.462, recovery: 0.39 },
      { bullet: 3, horizontal: -0.292, vertical: 0.483, recovery: 0.402 },
      { bullet: 4, horizontal: 0.31, vertical: 0.504, recovery: 0.414 },
      { bullet: 5, horizontal: -0.328, vertical: 0.525, recovery: 0.426 },
      { bullet: 6, horizontal: 0.345, vertical: 0.546, recovery: 0.438 },
      { bullet: 7, horizontal: -0.362, vertical: 0.567, recovery: 0.45 },
      { bullet: 8, horizontal: 0.38, vertical: 0.588, recovery: 0.462 },
      { bullet: 9, horizontal: -0.398, vertical: 0.609, recovery: 0.474 },
      { bullet: 10, horizontal: 0.415, vertical: 0.63, recovery: 0.486 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 1100,
    difficulty: 'medium',
    bestScopes: ['Red Dot'],
    tips: {
      en: 'Insane fire rate. Best for hipfire CQC. Control is hard at range',
      ar: 'معدل نار جنوني. الأفضل للقتال القريب. صعب التحكم على المسافات'
    }
  },
  {
    id: 'ump45',
    name: 'UMP45',
    nameAr: 'UMP45',
    category: 'smg',
    sprayStability: 9,
    effectiveRange: { minMeters: 0, optimalMeters: 40, maxMeters: 150 },
    attachmentCompatibility: ['muzzle', 'grip', 'magazine'],
    scopeCompatibility: ['noScope', 'redDot', 'x2', 'x3'],
    icon: '🔫',
    recoil: { vertical: 3, horizontal: 2, pattern: 'straight' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.012, vertical: 0.221, recovery: 0.485 },
      { bullet: 2, horizontal: -0.013, vertical: 0.231, recovery: 0.497 },
      { bullet: 3, horizontal: 0.014, vertical: 0.241, recovery: 0.509 },
      { bullet: 4, horizontal: -0.015, vertical: 0.252, recovery: 0.521 },
      { bullet: 5, horizontal: 0.016, vertical: 0.263, recovery: 0.533 },
      { bullet: 6, horizontal: -0.017, vertical: 0.273, recovery: 0.545 },
      { bullet: 7, horizontal: 0.017, vertical: 0.283, recovery: 0.557 },
      { bullet: 8, horizontal: -0.018, vertical: 0.294, recovery: 0.569 },
      { bullet: 9, horizontal: 0.019, vertical: 0.305, recovery: 0.581 },
      { bullet: 10, horizontal: -0.02, vertical: 0.315, recovery: 0.593 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 650,
    difficulty: 'easy',
    bestScopes: ['Red Dot', '2x', '3x'],
    tips: {
      en: 'Very stable SMG. Great for mid-range fights. Easy to control',
      ar: 'رشاش ثابت جداً. ممتاز للقتال المتوسط. سهل التحكم'
    }
  },
  {
    id: 'vector',
    name: 'Vector',
    nameAr: 'Vector',
    category: 'smg',
    sprayStability: 5,
    effectiveRange: { minMeters: 0, optimalMeters: 25, maxMeters: 90 },
    attachmentCompatibility: ['muzzle', 'grip', 'magazine'],
    scopeCompatibility: ['noScope', 'redDot', 'x2'],
    icon: '🔫',
    recoil: { vertical: 4, horizontal: 3, pattern: 'straight' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.018, vertical: 0.294, recovery: 0.449 },
      { bullet: 2, horizontal: -0.02, vertical: 0.308, recovery: 0.461 },
      { bullet: 3, horizontal: 0.021, vertical: 0.322, recovery: 0.473 },
      { bullet: 4, horizontal: -0.022, vertical: 0.336, recovery: 0.485 },
      { bullet: 5, horizontal: 0.024, vertical: 0.35, recovery: 0.497 },
      { bullet: 6, horizontal: -0.025, vertical: 0.364, recovery: 0.509 },
      { bullet: 7, horizontal: 0.026, vertical: 0.378, recovery: 0.521 },
      { bullet: 8, horizontal: -0.027, vertical: 0.392, recovery: 0.533 },
      { bullet: 9, horizontal: 0.029, vertical: 0.406, recovery: 0.545 },
      { bullet: 10, horizontal: -0.03, vertical: 0.42, recovery: 0.557 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 1100,
    difficulty: 'medium',
    bestScopes: ['Red Dot'],
    tips: {
      en: 'Extremely fast TTK. Small mag — make every bullet count',
      ar: 'قتل سريع جداً. مخزن صغير — كل رصاصة مهمة'
    }
  },
  {
    id: 'mp5k',
    name: 'MP5K',
    nameAr: 'MP5K',
    category: 'smg',
    sprayStability: 8,
    effectiveRange: { minMeters: 0, optimalMeters: 35, maxMeters: 120 },
    attachmentCompatibility: ['muzzle', 'grip', 'magazine'],
    scopeCompatibility: ['noScope', 'redDot', 'x2'],
    icon: '🔫',
    recoil: { vertical: 3, horizontal: 2, pattern: 'straight' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.012, vertical: 0.221, recovery: 0.485 },
      { bullet: 2, horizontal: -0.013, vertical: 0.231, recovery: 0.497 },
      { bullet: 3, horizontal: 0.014, vertical: 0.241, recovery: 0.509 },
      { bullet: 4, horizontal: -0.015, vertical: 0.252, recovery: 0.521 },
      { bullet: 5, horizontal: 0.016, vertical: 0.263, recovery: 0.533 },
      { bullet: 6, horizontal: -0.017, vertical: 0.273, recovery: 0.545 },
      { bullet: 7, horizontal: 0.017, vertical: 0.283, recovery: 0.557 },
      { bullet: 8, horizontal: -0.018, vertical: 0.294, recovery: 0.569 },
      { bullet: 9, horizontal: 0.019, vertical: 0.305, recovery: 0.581 },
      { bullet: 10, horizontal: -0.02, vertical: 0.315, recovery: 0.593 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 900,
    difficulty: 'easy',
    bestScopes: ['Red Dot', '2x'],
    tips: {
      en: 'Very controllable SMG. Great for beginners. Decent damage',
      ar: 'رشاش سهل التحكم جداً. ممتاز للمبتدئين. ضرر جيد'
    }
  },
  {
    id: 'p90',
    name: 'P90',
    nameAr: 'P90',
    category: 'smg',
    sprayStability: 6,
    effectiveRange: { minMeters: 0, optimalMeters: 45, maxMeters: 140 },
    attachmentCompatibility: ['muzzle', 'magazine'],
    scopeCompatibility: ['noScope', 'redDot', 'x2'],
    icon: '🔫',
    recoil: { vertical: 4, horizontal: 4, pattern: 'zigzag' },
    recoilCurve: [
      { bullet: 1, horizontal: -0.206, vertical: 0.294, recovery: 0.449 },
      { bullet: 2, horizontal: 0.22, vertical: 0.308, recovery: 0.461 },
      { bullet: 3, horizontal: -0.234, vertical: 0.322, recovery: 0.473 },
      { bullet: 4, horizontal: 0.248, vertical: 0.336, recovery: 0.485 },
      { bullet: 5, horizontal: -0.262, vertical: 0.35, recovery: 0.497 },
      { bullet: 6, horizontal: 0.276, vertical: 0.364, recovery: 0.509 },
      { bullet: 7, horizontal: -0.29, vertical: 0.378, recovery: 0.521 },
      { bullet: 8, horizontal: 0.304, vertical: 0.392, recovery: 0.533 },
      { bullet: 9, horizontal: -0.318, vertical: 0.406, recovery: 0.545 },
      { bullet: 10, horizontal: 0.332, vertical: 0.42, recovery: 0.557 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 900,
    difficulty: 'medium',
    bestScopes: ['Red Dot', '2x'],
    tips: {
      en: '50 round mag! Spray and pray. Best for suppressing enemies',
      ar: 'مخزن 50 رصاصة! رش مستمر. الأفضل لإكباح الأعداء'
    }
  },

  // ============ SNIPERS ============
  {
    id: 'kar98k',
    name: 'Kar98K',
    nameAr: 'Kar98K',
    category: 'sniper',
    sprayStability: 8,
    effectiveRange: { minMeters: 100, optimalMeters: 250, maxMeters: 600 },
    attachmentCompatibility: ['muzzle', 'stock'],
    scopeCompatibility: ['noScope', 'redDot', 'x2', 'x3', 'x4', 'x6', 'x8'],
    icon: '🎯',
    recoil: { vertical: 2, horizontal: 1, pattern: 'straight' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.006, vertical: 0.147, recovery: 0.521 },
      { bullet: 2, horizontal: -0.007, vertical: 0.154, recovery: 0.533 },
      { bullet: 3, horizontal: 0.007, vertical: 0.161, recovery: 0.545 },
      { bullet: 4, horizontal: -0.007, vertical: 0.168, recovery: 0.557 },
      { bullet: 5, horizontal: 0.008, vertical: 0.175, recovery: 0.569 },
      { bullet: 6, horizontal: -0.008, vertical: 0.182, recovery: 0.581 },
      { bullet: 7, horizontal: 0.009, vertical: 0.189, recovery: 0.593 },
      { bullet: 8, horizontal: -0.009, vertical: 0.196, recovery: 0.605 },
      { bullet: 9, horizontal: 0.01, vertical: 0.203, recovery: 0.617 },
      { bullet: 10, horizontal: -0.01, vertical: 0.21, recovery: 0.629 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 30,
    difficulty: 'medium',
    bestScopes: ['6x', '8x'],
    tips: {
      en: 'One-shot headshot with level 2 helmet. Pre-aim head level',
      ar: 'هيدشوت بخوذة مستوى 2. صوّب على مستوى الرأس مسبقاً'
    }
  },
  {
    id: 'm24',
    name: 'M24',
    nameAr: 'M24',
    category: 'sniper',
    sprayStability: 8,
    effectiveRange: { minMeters: 100, optimalMeters: 280, maxMeters: 650 },
    attachmentCompatibility: ['muzzle', 'stock'],
    scopeCompatibility: ['noScope', 'redDot', 'x2', 'x3', 'x4', 'x6', 'x8'],
    icon: '🎯',
    recoil: { vertical: 2, horizontal: 1, pattern: 'straight' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.006, vertical: 0.147, recovery: 0.521 },
      { bullet: 2, horizontal: -0.007, vertical: 0.154, recovery: 0.533 },
      { bullet: 3, horizontal: 0.007, vertical: 0.161, recovery: 0.545 },
      { bullet: 4, horizontal: -0.007, vertical: 0.168, recovery: 0.557 },
      { bullet: 5, horizontal: 0.008, vertical: 0.175, recovery: 0.569 },
      { bullet: 6, horizontal: -0.008, vertical: 0.182, recovery: 0.581 },
      { bullet: 7, horizontal: 0.009, vertical: 0.189, recovery: 0.593 },
      { bullet: 8, horizontal: -0.009, vertical: 0.196, recovery: 0.605 },
      { bullet: 9, horizontal: 0.01, vertical: 0.203, recovery: 0.617 },
      { bullet: 10, horizontal: -0.01, vertical: 0.21, recovery: 0.629 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 30,
    difficulty: 'medium',
    bestScopes: ['6x', '8x'],
    tips: {
      en: 'Better than Kar98K. Faster bullet velocity. Pre-aim head level',
      ar: 'أفضل من Kar98K. سرعة رصاصة أسرع. صوّب على مستوى الرأس'
    }
  },
  {
    id: 'awm',
    name: 'AWM',
    nameAr: 'AWM',
    category: 'sniper',
    sprayStability: 7,
    effectiveRange: { minMeters: 150, optimalMeters: 350, maxMeters: 800 },
    attachmentCompatibility: ['muzzle', 'stock'],
    scopeCompatibility: ['noScope', 'redDot', 'x2', 'x3', 'x4', 'x6', 'x8'],
    icon: '🎯',
    recoil: { vertical: 3, horizontal: 1, pattern: 'straight' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.006, vertical: 0.221, recovery: 0.485 },
      { bullet: 2, horizontal: -0.007, vertical: 0.231, recovery: 0.497 },
      { bullet: 3, horizontal: 0.007, vertical: 0.241, recovery: 0.509 },
      { bullet: 4, horizontal: -0.007, vertical: 0.252, recovery: 0.521 },
      { bullet: 5, horizontal: 0.008, vertical: 0.263, recovery: 0.533 },
      { bullet: 6, horizontal: -0.008, vertical: 0.273, recovery: 0.545 },
      { bullet: 7, horizontal: 0.009, vertical: 0.283, recovery: 0.557 },
      { bullet: 8, horizontal: -0.009, vertical: 0.294, recovery: 0.569 },
      { bullet: 9, horizontal: 0.01, vertical: 0.305, recovery: 0.581 },
      { bullet: 10, horizontal: -0.01, vertical: 0.315, recovery: 0.593 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 26,
    difficulty: 'medium',
    bestScopes: ['6x', '8x'],
    tips: {
      en: 'One shot any helmet. Be patient, make it count. Rare ammo',
      ar: 'هيدشوت أي خوذة. اصبر، كل رصاصة مهمة. ذخيرة نادرة'
    }
  },
  {
    id: 'mosin',
    name: 'Mosin-Nagant',
    nameAr: 'Mosin',
    category: 'sniper',
    sprayStability: 8,
    effectiveRange: { minMeters: 100, optimalMeters: 250, maxMeters: 600 },
    attachmentCompatibility: ['muzzle', 'stock'],
    scopeCompatibility: ['noScope', 'redDot', 'x2', 'x3', 'x4', 'x6', 'x8'],
    icon: '🎯',
    recoil: { vertical: 2, horizontal: 1, pattern: 'straight' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.006, vertical: 0.147, recovery: 0.521 },
      { bullet: 2, horizontal: -0.007, vertical: 0.154, recovery: 0.533 },
      { bullet: 3, horizontal: 0.007, vertical: 0.161, recovery: 0.545 },
      { bullet: 4, horizontal: -0.007, vertical: 0.168, recovery: 0.557 },
      { bullet: 5, horizontal: 0.008, vertical: 0.175, recovery: 0.569 },
      { bullet: 6, horizontal: -0.008, vertical: 0.182, recovery: 0.581 },
      { bullet: 7, horizontal: 0.009, vertical: 0.189, recovery: 0.593 },
      { bullet: 8, horizontal: -0.009, vertical: 0.196, recovery: 0.605 },
      { bullet: 9, horizontal: 0.01, vertical: 0.203, recovery: 0.617 },
      { bullet: 10, horizontal: -0.01, vertical: 0.21, recovery: 0.629 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 30,
    difficulty: 'medium',
    bestScopes: ['6x', '8x'],
    tips: {
      en: 'Same as Kar98K but with magazine. Great for aggressive sniping',
      ar: 'مثل Kar98K لكن مع مخزن. ممتاز للقنص الهجومي'
    }
  },
  {
    id: 'lynx',
    name: 'Lynx AMR',
    nameAr: 'Lynx',
    category: 'sniper',
    sprayStability: 6,
    effectiveRange: { minMeters: 200, optimalMeters: 400, maxMeters: 1000 },
    attachmentCompatibility: ['muzzle', 'stock'],
    scopeCompatibility: ['noScope', 'redDot', 'x2', 'x3', 'x4', 'x6', 'x8'],
    icon: '🎯',
    recoil: { vertical: 4, horizontal: 1, pattern: 'straight' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.006, vertical: 0.294, recovery: 0.449 },
      { bullet: 2, horizontal: -0.007, vertical: 0.308, recovery: 0.461 },
      { bullet: 3, horizontal: 0.007, vertical: 0.322, recovery: 0.473 },
      { bullet: 4, horizontal: -0.007, vertical: 0.336, recovery: 0.485 },
      { bullet: 5, horizontal: 0.008, vertical: 0.35, recovery: 0.497 },
      { bullet: 6, horizontal: -0.008, vertical: 0.364, recovery: 0.509 },
      { bullet: 7, horizontal: 0.009, vertical: 0.378, recovery: 0.521 },
      { bullet: 8, horizontal: -0.009, vertical: 0.392, recovery: 0.533 },
      { bullet: 9, horizontal: 0.01, vertical: 0.406, recovery: 0.545 },
      { bullet: 10, horizontal: -0.01, vertical: 0.42, recovery: 0.557 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 22,
    difficulty: 'hard',
    bestScopes: ['6x', '8x'],
    tips: {
      en: 'Anti-material rifle. Destroys vehicles and level 3 gear easily',
      ar: 'بندقية مضادة للمواد. تدمر المركبات ومعدات المستوى 3 بسهولة'
    }
  },

  // ============ DMRs ============
  {
    id: 'mini14',
    name: 'Mini 14',
    nameAr: 'Mini 14',
    category: 'dmr',
    sprayStability: 8,
    effectiveRange: { minMeters: 80, optimalMeters: 180, maxMeters: 500 },
    attachmentCompatibility: ['muzzle', 'magazine'],
    scopeCompatibility: ['noScope', 'redDot', 'x2', 'x3', 'x4', 'x6', 'x8'],
    icon: '🔫',
    recoil: { vertical: 3, horizontal: 2, pattern: 'straight' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.012, vertical: 0.221, recovery: 0.485 },
      { bullet: 2, horizontal: -0.013, vertical: 0.231, recovery: 0.497 },
      { bullet: 3, horizontal: 0.014, vertical: 0.241, recovery: 0.509 },
      { bullet: 4, horizontal: -0.015, vertical: 0.252, recovery: 0.521 },
      { bullet: 5, horizontal: 0.016, vertical: 0.263, recovery: 0.533 },
      { bullet: 6, horizontal: -0.017, vertical: 0.273, recovery: 0.545 },
      { bullet: 7, horizontal: 0.017, vertical: 0.283, recovery: 0.557 },
      { bullet: 8, horizontal: -0.018, vertical: 0.294, recovery: 0.569 },
      { bullet: 9, horizontal: 0.019, vertical: 0.305, recovery: 0.581 },
      { bullet: 10, horizontal: -0.02, vertical: 0.315, recovery: 0.593 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 450,
    difficulty: 'easy',
    bestScopes: ['3x', '4x', '6x'],
    tips: {
      en: 'Fast fire rate DMR. Great for spamming at range',
      ar: 'معدل نار سريع. ممتاز للرش على المسافات'
    }
  },
  {
    id: 'sks',
    name: 'SKS',
    nameAr: 'SKS',
    category: 'dmr',
    sprayStability: 6,
    effectiveRange: { minMeters: 80, optimalMeters: 170, maxMeters: 450 },
    attachmentCompatibility: ['muzzle', 'grip', 'magazine'],
    scopeCompatibility: ['noScope', 'redDot', 'x2', 'x3', 'x4', 'x6', 'x8'],
    icon: '🔫',
    recoil: { vertical: 5, horizontal: 3, pattern: 'straight' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.018, vertical: 0.367, recovery: 0.413 },
      { bullet: 2, horizontal: -0.02, vertical: 0.385, recovery: 0.425 },
      { bullet: 3, horizontal: 0.021, vertical: 0.402, recovery: 0.437 },
      { bullet: 4, horizontal: -0.022, vertical: 0.42, recovery: 0.449 },
      { bullet: 5, horizontal: 0.024, vertical: 0.438, recovery: 0.461 },
      { bullet: 6, horizontal: -0.025, vertical: 0.455, recovery: 0.473 },
      { bullet: 7, horizontal: 0.026, vertical: 0.472, recovery: 0.485 },
      { bullet: 8, horizontal: -0.027, vertical: 0.49, recovery: 0.497 },
      { bullet: 9, horizontal: 0.029, vertical: 0.508, recovery: 0.509 },
      { bullet: 10, horizontal: -0.03, vertical: 0.525, recovery: 0.521 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 400,
    difficulty: 'medium',
    bestScopes: ['3x', '4x', '6x'],
    tips: {
      en: 'Higher damage than Mini14. Needs attachments to shine',
      ar: 'ضرر أعلى من Mini14. يحتاج ملحقات ليتألق'
    }
  },
  {
    id: 'slr',
    name: 'SLR',
    nameAr: 'SLR',
    category: 'dmr',
    sprayStability: 4,
    effectiveRange: { minMeters: 100, optimalMeters: 200, maxMeters: 500 },
    attachmentCompatibility: ['muzzle', 'magazine'],
    scopeCompatibility: ['noScope', 'redDot', 'x2', 'x3', 'x4', 'x6', 'x8'],
    icon: '🔫',
    recoil: { vertical: 7, horizontal: 4, pattern: 'straight' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.025, vertical: 0.514, recovery: 0.342 },
      { bullet: 2, horizontal: -0.026, vertical: 0.539, recovery: 0.354 },
      { bullet: 3, horizontal: 0.028, vertical: 0.563, recovery: 0.366 },
      { bullet: 4, horizontal: -0.03, vertical: 0.588, recovery: 0.378 },
      { bullet: 5, horizontal: 0.031, vertical: 0.612, recovery: 0.39 },
      { bullet: 6, horizontal: -0.033, vertical: 0.637, recovery: 0.402 },
      { bullet: 7, horizontal: 0.035, vertical: 0.661, recovery: 0.414 },
      { bullet: 8, horizontal: -0.036, vertical: 0.686, recovery: 0.426 },
      { bullet: 9, horizontal: 0.038, vertical: 0.711, recovery: 0.438 },
      { bullet: 10, horizontal: -0.04, vertical: 0.735, recovery: 0.45 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 360,
    difficulty: 'hard',
    bestScopes: ['3x', '4x', '6x'],
    tips: {
      en: 'Highest damage DMR. Hard recoil but devastating damage',
      ar: 'أعلى ضرر DMR. ارتداد صعب لكن ضرر مدمر'
    }
  },
  {
    id: 'mk14',
    name: 'MK14 EBR',
    nameAr: 'MK14',
    category: 'dmr',
    sprayStability: 3,
    effectiveRange: { minMeters: 80, optimalMeters: 170, maxMeters: 450 },
    attachmentCompatibility: ['muzzle', 'grip', 'magazine'],
    scopeCompatibility: ['noScope', 'redDot', 'x2', 'x3', 'x4', 'x6', 'x8'],
    icon: '🔫',
    recoil: { vertical: 8, horizontal: 5, pattern: 'straight' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.031, vertical: 0.588, recovery: 0.306 },
      { bullet: 2, horizontal: -0.033, vertical: 0.616, recovery: 0.318 },
      { bullet: 3, horizontal: 0.035, vertical: 0.644, recovery: 0.33 },
      { bullet: 4, horizontal: -0.037, vertical: 0.672, recovery: 0.342 },
      { bullet: 5, horizontal: 0.039, vertical: 0.7, recovery: 0.354 },
      { bullet: 6, horizontal: -0.041, vertical: 0.728, recovery: 0.366 },
      { bullet: 7, horizontal: 0.043, vertical: 0.756, recovery: 0.378 },
      { bullet: 8, horizontal: -0.046, vertical: 0.784, recovery: 0.39 },
      { bullet: 9, horizontal: 0.048, vertical: 0.812, recovery: 0.402 },
      { bullet: 10, horizontal: -0.05, vertical: 0.84, recovery: 0.414 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 500,
    difficulty: 'hard',
    bestScopes: ['Red Dot', '3x', '4x'],
    tips: {
      en: 'Can go full-auto! Deadly CQC. Hard recoil in auto mode',
      ar: 'يمكن تحويله لأوتوماتيك! مميت قريب. ارتداد صعب في الأوتو'
    }
  },

  // ============ SHOTGUNS ============
  {
    id: 's1897',
    name: 'S1897',
    nameAr: 'S1897',
    category: 'shotgun',
    sprayStability: 6,
    effectiveRange: { minMeters: 0, optimalMeters: 15, maxMeters: 40 },
    attachmentCompatibility: ['muzzle'],
    scopeCompatibility: ['noScope', 'redDot'],
    icon: '💀',
    recoil: { vertical: 3, horizontal: 2, pattern: 'straight' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.012, vertical: 0.221, recovery: 0.485 },
      { bullet: 2, horizontal: -0.013, vertical: 0.231, recovery: 0.497 },
      { bullet: 3, horizontal: 0.014, vertical: 0.241, recovery: 0.509 },
      { bullet: 4, horizontal: -0.015, vertical: 0.252, recovery: 0.521 },
      { bullet: 5, horizontal: 0.016, vertical: 0.263, recovery: 0.533 },
      { bullet: 6, horizontal: -0.017, vertical: 0.273, recovery: 0.545 },
      { bullet: 7, horizontal: 0.017, vertical: 0.283, recovery: 0.557 },
      { bullet: 8, horizontal: -0.018, vertical: 0.294, recovery: 0.569 },
      { bullet: 9, horizontal: 0.019, vertical: 0.305, recovery: 0.581 },
      { bullet: 10, horizontal: -0.02, vertical: 0.315, recovery: 0.593 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 30,
    difficulty: 'medium',
    bestScopes: ['No Scope', 'Red Dot'],
    tips: {
      en: 'Pump action. Aim upper chest — recoil carries to head',
      ar: 'بمب أكشن. صوّب أعلى الصدر — الارتداد يوصل للرأس'
    }
  },
  {
    id: 's12k',
    name: 'S12K',
    nameAr: 'S12K',
    category: 'shotgun',
    sprayStability: 6,
    effectiveRange: { minMeters: 0, optimalMeters: 25, maxMeters: 60 },
    attachmentCompatibility: ['muzzle', 'magazine'],
    scopeCompatibility: ['noScope', 'redDot'],
    icon: '💀',
    recoil: { vertical: 4, horizontal: 3, pattern: 'straight' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.018, vertical: 0.294, recovery: 0.449 },
      { bullet: 2, horizontal: -0.02, vertical: 0.308, recovery: 0.461 },
      { bullet: 3, horizontal: 0.021, vertical: 0.322, recovery: 0.473 },
      { bullet: 4, horizontal: -0.022, vertical: 0.336, recovery: 0.485 },
      { bullet: 5, horizontal: 0.024, vertical: 0.35, recovery: 0.497 },
      { bullet: 6, horizontal: -0.025, vertical: 0.364, recovery: 0.509 },
      { bullet: 7, horizontal: 0.026, vertical: 0.378, recovery: 0.521 },
      { bullet: 8, horizontal: -0.027, vertical: 0.392, recovery: 0.533 },
      { bullet: 9, horizontal: 0.029, vertical: 0.406, recovery: 0.545 },
      { bullet: 10, horizontal: -0.03, vertical: 0.42, recovery: 0.557 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 200,
    difficulty: 'easy',
    bestScopes: ['Red Dot'],
    tips: {
      en: 'Semi-auto shotgun. Spam fire close range. Great building clearer',
      ar: 'شوتقن نصف أوتو. رش سريع قريب. ممتاز لتنظيف المباني'
    }
  },
  {
    id: 'dbs',
    name: 'DBS',
    nameAr: 'DBS',
    category: 'shotgun',
    sprayStability: 5,
    effectiveRange: { minMeters: 0, optimalMeters: 20, maxMeters: 50 },
    attachmentCompatibility: ['muzzle'],
    scopeCompatibility: ['noScope', 'redDot'],
    icon: '💀',
    recoil: { vertical: 5, horizontal: 4, pattern: 'straight' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.025, vertical: 0.367, recovery: 0.413 },
      { bullet: 2, horizontal: -0.026, vertical: 0.385, recovery: 0.425 },
      { bullet: 3, horizontal: 0.028, vertical: 0.402, recovery: 0.437 },
      { bullet: 4, horizontal: -0.03, vertical: 0.42, recovery: 0.449 },
      { bullet: 5, horizontal: 0.031, vertical: 0.438, recovery: 0.461 },
      { bullet: 6, horizontal: -0.033, vertical: 0.455, recovery: 0.473 },
      { bullet: 7, horizontal: 0.035, vertical: 0.472, recovery: 0.485 },
      { bullet: 8, horizontal: -0.036, vertical: 0.49, recovery: 0.497 },
      { bullet: 9, horizontal: 0.038, vertical: 0.508, recovery: 0.509 },
      { bullet: 10, horizontal: -0.04, vertical: 0.525, recovery: 0.521 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 300,
    difficulty: 'medium',
    bestScopes: ['No Scope', 'Red Dot'],
    tips: {
      en: 'Double barrel burst. Pre-aim doorways. Two quick shots = kill',
      ar: 'رشقة مزدوجة. صوّب الأبواب مسبقاً. رصاصتين = قتلة'
    }
  },

  // ============ LMGs ============
  {
    id: 'dp28',
    name: 'DP-28',
    nameAr: 'DP-28',
    category: 'lmg',
    sprayStability: 6,
    effectiveRange: { minMeters: 0, optimalMeters: 100, maxMeters: 300 },
    attachmentCompatibility: ['muzzle', 'magazine'],
    scopeCompatibility: ['noScope', 'redDot', 'x2', 'x3', 'x4', 'x6'],
    icon: '⚡',
    recoil: { vertical: 5, horizontal: 3, pattern: 'straight' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.018, vertical: 0.367, recovery: 0.413 },
      { bullet: 2, horizontal: -0.02, vertical: 0.385, recovery: 0.425 },
      { bullet: 3, horizontal: 0.021, vertical: 0.402, recovery: 0.437 },
      { bullet: 4, horizontal: -0.022, vertical: 0.42, recovery: 0.449 },
      { bullet: 5, horizontal: 0.024, vertical: 0.438, recovery: 0.461 },
      { bullet: 6, horizontal: -0.025, vertical: 0.455, recovery: 0.473 },
      { bullet: 7, horizontal: 0.026, vertical: 0.472, recovery: 0.485 },
      { bullet: 8, horizontal: -0.027, vertical: 0.49, recovery: 0.497 },
      { bullet: 9, horizontal: 0.029, vertical: 0.508, recovery: 0.509 },
      { bullet: 10, horizontal: -0.03, vertical: 0.525, recovery: 0.521 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 550,
    difficulty: 'medium',
    bestScopes: ['3x', '4x', '6x'],
    tips: {
      en: 'Prone = zero recoil laser. Standing: moderate pull down',
      ar: 'زحف = ليزر بدون ارتداد. وقوف: سحب معتدل للأسفل'
    }
  },
  {
    id: 'm249',
    name: 'M249',
    nameAr: 'M249',
    category: 'lmg',
    sprayStability: 5,
    effectiveRange: { minMeters: 0, optimalMeters: 85, maxMeters: 270 },
    attachmentCompatibility: ['muzzle', 'magazine'],
    scopeCompatibility: ['noScope', 'redDot', 'x2', 'x3', 'x4', 'x6'],
    icon: '⚡',
    recoil: { vertical: 6, horizontal: 4, pattern: 'straight' },
    recoilCurve: [
      { bullet: 1, horizontal: 0.025, vertical: 0.441, recovery: 0.378 },
      { bullet: 2, horizontal: -0.026, vertical: 0.462, recovery: 0.39 },
      { bullet: 3, horizontal: 0.028, vertical: 0.483, recovery: 0.402 },
      { bullet: 4, horizontal: -0.03, vertical: 0.504, recovery: 0.414 },
      { bullet: 5, horizontal: 0.031, vertical: 0.525, recovery: 0.426 },
      { bullet: 6, horizontal: -0.033, vertical: 0.546, recovery: 0.438 },
      { bullet: 7, horizontal: 0.035, vertical: 0.567, recovery: 0.45 },
      { bullet: 8, horizontal: -0.036, vertical: 0.588, recovery: 0.462 },
      { bullet: 9, horizontal: 0.038, vertical: 0.609, recovery: 0.474 },
      { bullet: 10, horizontal: -0.04, vertical: 0.63, recovery: 0.486 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 750,
    difficulty: 'medium',
    bestScopes: ['Red Dot', '3x', '4x'],
    tips: {
      en: '100 round mag. Suppress everything. Great vehicle destroyer',
      ar: 'مخزن 100 رصاصة. اكبت الجميع. مدمر مركبات ممتاز'
    }
  },
  {
    id: 'mg3',
    name: 'MG3',
    nameAr: 'MG3',
    category: 'lmg',
    sprayStability: 4,
    effectiveRange: { minMeters: 0, optimalMeters: 75, maxMeters: 220 },
    attachmentCompatibility: ['muzzle', 'magazine'],
    scopeCompatibility: ['noScope', 'redDot', 'x2', 'x3', 'x4', 'x6'],
    icon: '⚡',
    recoil: { vertical: 7, horizontal: 5, pattern: 'zigzag' },
    recoilCurve: [
      { bullet: 1, horizontal: -0.258, vertical: 0.514, recovery: 0.342 },
      { bullet: 2, horizontal: 0.275, vertical: 0.539, recovery: 0.354 },
      { bullet: 3, horizontal: -0.292, vertical: 0.563, recovery: 0.366 },
      { bullet: 4, horizontal: 0.31, vertical: 0.588, recovery: 0.378 },
      { bullet: 5, horizontal: -0.328, vertical: 0.612, recovery: 0.39 },
      { bullet: 6, horizontal: 0.345, vertical: 0.637, recovery: 0.402 },
      { bullet: 7, horizontal: -0.362, vertical: 0.661, recovery: 0.414 },
      { bullet: 8, horizontal: 0.38, vertical: 0.686, recovery: 0.426 },
      { bullet: 9, horizontal: -0.398, vertical: 0.711, recovery: 0.438 },
      { bullet: 10, horizontal: 0.415, vertical: 0.735, recovery: 0.45 }
    ],
    recoilDataConfidence: 'modelled',
    fireRate: 990,
    difficulty: 'hard',
    bestScopes: ['Red Dot', '2x', '3x'],
    tips: {
      en: 'Fastest LMG. Use 660RPM for control, 990RPM for CQC shredding',
      ar: 'أسرع رشاش. استخدم 660RPM للتحكم، 990RPM للقتال القريب'
    }
  }
];

export const weapons: Weapon[] = enrichWeaponsWithMetadata(rawWeapons);

export const weaponCategories: { id: WeaponCategory; name: string; nameAr: string; icon: string }[] = [
  { id: 'ar', name: 'Assault Rifles', nameAr: 'بنادق هجومية', icon: '🔫' },
  { id: 'smg', name: 'SMGs', nameAr: 'رشاشات خفيفة', icon: '🔫' },
  { id: 'sniper', name: 'Snipers', nameAr: 'قناصات', icon: '🎯' },
  { id: 'dmr', name: 'DMRs', nameAr: 'بنادق قناصة', icon: '🔫' },
  { id: 'shotgun', name: 'Shotguns', nameAr: 'شوتقن', icon: '💀' },
  { id: 'lmg', name: 'LMGs', nameAr: 'رشاشات ثقيلة', icon: '⚡' }
];

export function getWeaponsByCategory(category: WeaponCategory): Weapon[] {
  return weapons.filter(w => w.category === category);
}
