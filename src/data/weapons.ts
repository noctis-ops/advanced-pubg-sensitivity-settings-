export type WeaponCategory = 'ar' | 'smg' | 'sniper' | 'dmr' | 'shotgun' | 'lmg';

export interface Weapon {
  id: string;
  name: string;
  nameAr: string;
  category: WeaponCategory;
  icon: string;
  recoil: {
    vertical: number;   // 1-10
    horizontal: number; // 1-10
    pattern: 'straight' | 'left' | 'right' | 'zigzag';
  };
  fireRate: number;     // RPM
  difficulty: 'easy' | 'medium' | 'hard';
  bestScopes: string[];
  adsMultiplier: number;      // Multiplier for ADS sensitivity
  gyroMultiplier: number;     // Multiplier for Gyro sensitivity
  tips: {
    en: string;
    ar: string;
  };
}

export const weapons: Weapon[] = [
  // ============ ASSAULT RIFLES ============
  {
    id: 'akm',
    name: 'AKM',
    nameAr: 'AKM',
    category: 'ar',
    icon: '🔫',
    recoil: { vertical: 9, horizontal: 5, pattern: 'left' },
    fireRate: 600,
    difficulty: 'hard',
    bestScopes: ['Red Dot', '2x'],
    adsMultiplier: 0.92,
    gyroMultiplier: 0.94,
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
    icon: '🔫',
    recoil: { vertical: 5, horizontal: 3, pattern: 'straight' },
    fireRate: 680,
    difficulty: 'easy',
    bestScopes: ['Red Dot', '3x', '6x'],
    adsMultiplier: 1.0,
    gyroMultiplier: 1.0,
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
    icon: '🔫',
    recoil: { vertical: 4, horizontal: 2, pattern: 'straight' },
    fireRate: 620,
    difficulty: 'easy',
    bestScopes: ['Red Dot', '3x', '4x'],
    adsMultiplier: 1.02,
    gyroMultiplier: 1.01,
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
    icon: '💥',
    recoil: { vertical: 7, horizontal: 4, pattern: 'straight' },
    fireRate: 750,
    difficulty: 'medium',
    bestScopes: ['Red Dot', '2x'],
    adsMultiplier: 0.94,
    gyroMultiplier: 0.95,
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
    icon: '🔫',
    recoil: { vertical: 3, horizontal: 2, pattern: 'straight' },
    fireRate: 680,
    difficulty: 'easy',
    bestScopes: ['Red Dot', '3x', '6x'],
    adsMultiplier: 1.04,
    gyroMultiplier: 1.02,
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
    icon: '🔫',
    recoil: { vertical: 10, horizontal: 6, pattern: 'right' },
    fireRate: 700,
    difficulty: 'hard',
    bestScopes: ['Red Dot', '2x'],
    adsMultiplier: 0.90,
    gyroMultiplier: 0.92,
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
    icon: '🔫',
    recoil: { vertical: 4, horizontal: 3, pattern: 'straight' },
    fireRate: 680,
    difficulty: 'easy',
    bestScopes: ['Red Dot', '3x', '4x'],
    adsMultiplier: 1.02,
    gyroMultiplier: 1.01,
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
    icon: '🔫',
    recoil: { vertical: 6, horizontal: 3, pattern: 'straight' },
    fireRate: 400,
    difficulty: 'medium',
    bestScopes: ['3x', '4x', '6x'],
    adsMultiplier: 0.96,
    gyroMultiplier: 0.98,
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
    icon: '🔫',
    recoil: { vertical: 5, horizontal: 3, pattern: 'straight' },
    fireRate: 660,
    difficulty: 'easy',
    bestScopes: ['Red Dot', '3x', '4x'],
    adsMultiplier: 1.0,
    gyroMultiplier: 1.0,
    tips: {
      en: 'Balanced AR with 7.62mm power. Good alternative to M416',
      ar: 'بندقية متوازنة بقوة 7.62. بديل جيد للـ M416'
    }
  },

  // ============ SMGs ============
  {
    id: 'uzi',
    name: 'Micro UZI',
    nameAr: 'UZI',
    category: 'smg',
    icon: '🔫',
    recoil: { vertical: 6, horizontal: 5, pattern: 'zigzag' },
    fireRate: 1100,
    difficulty: 'medium',
    bestScopes: ['Red Dot'],
    adsMultiplier: 1.08,
    gyroMultiplier: 1.04,
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
    icon: '🔫',
    recoil: { vertical: 3, horizontal: 2, pattern: 'straight' },
    fireRate: 650,
    difficulty: 'easy',
    bestScopes: ['Red Dot', '2x', '3x'],
    adsMultiplier: 1.04,
    gyroMultiplier: 1.02,
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
    icon: '🔫',
    recoil: { vertical: 4, horizontal: 3, pattern: 'straight' },
    fireRate: 1100,
    difficulty: 'medium',
    bestScopes: ['Red Dot'],
    adsMultiplier: 1.05,
    gyroMultiplier: 1.03,
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
    icon: '🔫',
    recoil: { vertical: 3, horizontal: 2, pattern: 'straight' },
    fireRate: 900,
    difficulty: 'easy',
    bestScopes: ['Red Dot', '2x'],
    adsMultiplier: 1.05,
    gyroMultiplier: 1.02,
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
    icon: '🔫',
    recoil: { vertical: 4, horizontal: 4, pattern: 'zigzag' },
    fireRate: 900,
    difficulty: 'medium',
    bestScopes: ['Red Dot', '2x'],
    adsMultiplier: 1.02,
    gyroMultiplier: 1.0,
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
    icon: '🎯',
    recoil: { vertical: 2, horizontal: 1, pattern: 'straight' },
    fireRate: 30,
    difficulty: 'medium',
    bestScopes: ['6x', '8x'],
    adsMultiplier: 0.85,
    gyroMultiplier: 0.88,
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
    icon: '🎯',
    recoil: { vertical: 2, horizontal: 1, pattern: 'straight' },
    fireRate: 30,
    difficulty: 'medium',
    bestScopes: ['6x', '8x'],
    adsMultiplier: 0.85,
    gyroMultiplier: 0.88,
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
    icon: '🎯',
    recoil: { vertical: 3, horizontal: 1, pattern: 'straight' },
    fireRate: 26,
    difficulty: 'medium',
    bestScopes: ['6x', '8x'],
    adsMultiplier: 0.82,
    gyroMultiplier: 0.85,
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
    icon: '🎯',
    recoil: { vertical: 2, horizontal: 1, pattern: 'straight' },
    fireRate: 30,
    difficulty: 'medium',
    bestScopes: ['6x', '8x'],
    adsMultiplier: 0.85,
    gyroMultiplier: 0.88,
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
    icon: '🎯',
    recoil: { vertical: 4, horizontal: 1, pattern: 'straight' },
    fireRate: 22,
    difficulty: 'hard',
    bestScopes: ['6x', '8x'],
    adsMultiplier: 0.80,
    gyroMultiplier: 0.82,
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
    icon: '🔫',
    recoil: { vertical: 3, horizontal: 2, pattern: 'straight' },
    fireRate: 450,
    difficulty: 'easy',
    bestScopes: ['3x', '4x', '6x'],
    adsMultiplier: 0.92,
    gyroMultiplier: 0.94,
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
    icon: '🔫',
    recoil: { vertical: 5, horizontal: 3, pattern: 'straight' },
    fireRate: 400,
    difficulty: 'medium',
    bestScopes: ['3x', '4x', '6x'],
    adsMultiplier: 0.90,
    gyroMultiplier: 0.92,
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
    icon: '🔫',
    recoil: { vertical: 7, horizontal: 4, pattern: 'straight' },
    fireRate: 360,
    difficulty: 'hard',
    bestScopes: ['3x', '4x', '6x'],
    adsMultiplier: 0.88,
    gyroMultiplier: 0.90,
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
    icon: '🔫',
    recoil: { vertical: 8, horizontal: 5, pattern: 'straight' },
    fireRate: 500,
    difficulty: 'hard',
    bestScopes: ['Red Dot', '3x', '4x'],
    adsMultiplier: 0.88,
    gyroMultiplier: 0.90,
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
    icon: '💀',
    recoil: { vertical: 3, horizontal: 2, pattern: 'straight' },
    fireRate: 30,
    difficulty: 'medium',
    bestScopes: ['No Scope', 'Red Dot'],
    adsMultiplier: 1.10,
    gyroMultiplier: 1.06,
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
    icon: '💀',
    recoil: { vertical: 4, horizontal: 3, pattern: 'straight' },
    fireRate: 200,
    difficulty: 'easy',
    bestScopes: ['Red Dot'],
    adsMultiplier: 1.08,
    gyroMultiplier: 1.04,
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
    icon: '💀',
    recoil: { vertical: 5, horizontal: 4, pattern: 'straight' },
    fireRate: 300,
    difficulty: 'medium',
    bestScopes: ['No Scope', 'Red Dot'],
    adsMultiplier: 1.10,
    gyroMultiplier: 1.06,
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
    icon: '⚡',
    recoil: { vertical: 5, horizontal: 3, pattern: 'straight' },
    fireRate: 550,
    difficulty: 'medium',
    bestScopes: ['3x', '4x', '6x'],
    adsMultiplier: 0.94,
    gyroMultiplier: 0.96,
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
    icon: '⚡',
    recoil: { vertical: 6, horizontal: 4, pattern: 'straight' },
    fireRate: 750,
    difficulty: 'medium',
    bestScopes: ['Red Dot', '3x', '4x'],
    adsMultiplier: 0.94,
    gyroMultiplier: 0.96,
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
    icon: '⚡',
    recoil: { vertical: 7, horizontal: 5, pattern: 'zigzag' },
    fireRate: 990,
    difficulty: 'hard',
    bestScopes: ['Red Dot', '2x', '3x'],
    adsMultiplier: 0.90,
    gyroMultiplier: 0.92,
    tips: {
      en: 'Fastest LMG. Use 660RPM for control, 990RPM for CQC shredding',
      ar: 'أسرع رشاش. استخدم 660RPM للتحكم، 990RPM للقتال القريب'
    }
  }
];

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
