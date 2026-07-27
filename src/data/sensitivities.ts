// ============================================================
// PUBG Mobile Pro Sensitivity System
// Device: iPhone 15 Pro Max | 120FPS | Full Gyro | 5 Fingers
// Server: Middle East | FOV: 90 (iPad View)
// ============================================================

export interface ScopeSet {
  noScope: number;
  redDot: number;
  x2: number;
  x3: number;
  x4: number;
  x6: number;
  x8: number;
}

export interface AimFeatures {
  aimTPP: number;
  aimFPP: number;
}

export interface SensitivityCategory {
  label: string;
  labelAr: string;
  scopes: ScopeSet;
  aimFeatures: AimFeatures;
}

export interface WeaponSensitivity {
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  icon: string;
  ads: ScopeSet;
  adsGyro: ScopeSet;
  recoilTip: string;
  recoilTipAr: string;
  bestScope: string;
  bestScopeAr: string;
}

// ============================================================
// BASE SENSITIVITY SYSTEM
// ============================================================

export const cameraSensitivity: SensitivityCategory = {
  label: "Camera Sensitivity",
  labelAr: "حساسية الكاميرا",
  scopes: {
    noScope: 115,
    redDot: 78,
    x2: 42,
    x3: 30,
    x4: 22,
    x6: 15,
    x8: 10,
  },
  aimFeatures: {
    aimTPP: 85,
    aimFPP: 82,
  },
};

export const adsSensitivity: SensitivityCategory = {
  label: "ADS Sensitivity",
  labelAr: "حساسية التصويب",
  scopes: {
    noScope: 95,
    redDot: 62,
    x2: 35,
    x3: 25,
    x4: 18,
    x6: 12,
    x8: 8,
  },
  aimFeatures: {
    aimTPP: 78,
    aimFPP: 75,
  },
};

export const gyroscopeSensitivity: SensitivityCategory = {
  label: "Gyroscope Sensitivity",
  labelAr: "حساسية الجايروسكوب",
  scopes: {
    noScope: 400,
    redDot: 400,
    x2: 380,
    x3: 330,
    x4: 290,
    x6: 210,
    x8: 160,
  },
  aimFeatures: {
    aimTPP: 390,
    aimFPP: 385,
  },
};

export const adsGyroscopeSensitivity: SensitivityCategory = {
  label: "ADS Gyroscope Sensitivity",
  labelAr: "حساسية جايروسكوب التصويب",
  scopes: {
    noScope: 400,
    redDot: 390,
    x2: 370,
    x3: 340,
    x4: 300,
    x6: 220,
    x8: 170,
  },
  aimFeatures: {
    aimTPP: 395,
    aimFPP: 390,
  },
};

// ============================================================
// WEAPON-SPECIFIC SENSITIVITIES
// ============================================================

export const weaponSensitivities: WeaponSensitivity[] = [
  // === ASSAULT RIFLES ===
  {
    name: "AKM",
    nameAr: "AKM",
    category: "Assault Rifle",
    categoryAr: "بندقية هجومية",
    icon: "🔫",
    ads: {
      noScope: 90,
      redDot: 58,
      x2: 32,
      x3: 23,
      x4: 16,
      x6: 11,
      x8: 7,
    },
    adsGyro: {
      noScope: 395,
      redDot: 385,
      x2: 365,
      x3: 330,
      x4: 290,
      x6: 215,
      x8: 165,
    },
    recoilTip: "Pull down firmly + slight left correction. Burst fire at 50m+",
    recoilTipAr: "اسحب للأسفل بقوة + تصحيح خفيف لليسار. رش متقطع على 50 متر+",
    bestScope: "Red Dot / 2x",
    bestScopeAr: "ريد دوت / 2x",
  },
  {
    name: "M416",
    nameAr: "M416",
    category: "Assault Rifle",
    categoryAr: "بندقية هجومية",
    icon: "🔫",
    ads: {
      noScope: 95,
      redDot: 62,
      x2: 35,
      x3: 25,
      x4: 18,
      x6: 12,
      x8: 8,
    },
    adsGyro: {
      noScope: 400,
      redDot: 395,
      x2: 375,
      x3: 345,
      x4: 305,
      x6: 225,
      x8: 175,
    },
    recoilTip: "Smooth vertical pull. Most stable AR — spray full mag confidently",
    recoilTipAr: "سحب عمودي سلس. أثبت بندقية — رش المخزن كامل بثقة",
    bestScope: "Red Dot / 3x / 6x",
    bestScopeAr: "ريد دوت / 3x / 6x",
  },
  {
    name: "SCAR-L",
    nameAr: "SCAR-L",
    category: "Assault Rifle",
    categoryAr: "بندقية هجومية",
    icon: "🔫",
    ads: {
      noScope: 93,
      redDot: 61,
      x2: 34,
      x3: 24,
      x4: 17,
      x6: 12,
      x8: 8,
    },
    adsGyro: {
      noScope: 398,
      redDot: 392,
      x2: 372,
      x3: 340,
      x4: 300,
      x6: 222,
      x8: 170,
    },
    recoilTip: "Very low recoil. Steady vertical pull only. Great for beginners transitioning to pro",
    recoilTipAr: "ارتداد منخفض جداً. سحب عمودي ثابت فقط. ممتاز للانتقال للاحتراف",
    bestScope: "Red Dot / 3x / 4x",
    bestScopeAr: "ريد دوت / 3x / 4x",
  },
  {
    name: "GROZA",
    nameAr: "GROZA",
    category: "Assault Rifle",
    categoryAr: "بندقية هجومية",
    icon: "💥",
    ads: {
      noScope: 88,
      redDot: 56,
      x2: 30,
      x3: 21,
      x4: 15,
      x6: 10,
      x8: 7,
    },
    adsGyro: {
      noScope: 392,
      redDot: 382,
      x2: 360,
      x3: 325,
      x4: 285,
      x6: 210,
      x8: 160,
    },
    recoilTip: "High fire rate = aggressive pull down. Short bursts at range. Deadly close-mid range",
    recoilTipAr: "معدل نار عالي = سحب قوي للأسفل. رش قصير على المسافات. قاتل قريب-متوسط",
    bestScope: "Red Dot / 2x",
    bestScopeAr: "ريد دوت / 2x",
  },
  {
    name: "AUG",
    nameAr: "AUG",
    category: "Assault Rifle",
    categoryAr: "بندقية هجومية",
    icon: "🔫",
    ads: {
      noScope: 96,
      redDot: 63,
      x2: 36,
      x3: 26,
      x4: 19,
      x6: 13,
      x8: 9,
    },
    adsGyro: {
      noScope: 400,
      redDot: 400,
      x2: 380,
      x3: 348,
      x4: 310,
      x6: 228,
      x8: 178,
    },
    recoilTip: "Lowest recoil AR. Laser beam — full spray any range. Push gyro higher for tracking",
    recoilTipAr: "أقل ارتداد في البنادق. ليزر — رش كامل أي مسافة. ارفع الجايرو للتتبع",
    bestScope: "Red Dot / 3x / 6x",
    bestScopeAr: "ريد دوت / 3x / 6x",
  },
  {
    name: "M762",
    nameAr: "M762",
    category: "Assault Rifle",
    categoryAr: "بندقية هجومية",
    icon: "🔫",
    ads: {
      noScope: 87,
      redDot: 55,
      x2: 30,
      x3: 21,
      x4: 15,
      x6: 10,
      x8: 7,
    },
    adsGyro: {
      noScope: 390,
      redDot: 380,
      x2: 358,
      x3: 320,
      x4: 280,
      x6: 208,
      x8: 155,
    },
    recoilTip: "Hardest AR recoil — aggressive pull + right correction after 10 bullets. Master = dominate",
    recoilTipAr: "أصعب ارتداد بندقية — سحب قوي + تصحيح يمين بعد 10 رصاصات. إتقانها = سيطرة",
    bestScope: "Red Dot / 2x",
    bestScopeAr: "ريد دوت / 2x",
  },
  // === SNIPERS ===
  {
    name: "M24",
    nameAr: "M24",
    category: "Sniper",
    categoryAr: "قنص",
    icon: "🎯",
    ads: {
      noScope: 70,
      redDot: 45,
      x2: 28,
      x3: 20,
      x4: 14,
      x6: 9,
      x8: 6,
    },
    adsGyro: {
      noScope: 370,
      redDot: 345,
      x2: 320,
      x3: 280,
      x4: 245,
      x6: 185,
      x8: 140,
    },
    recoilTip: "Quick-scope headshots. Pre-aim head level. Flick with gyro for fast kills",
    recoilTipAr: "هيدشوت سريع. صوّب مستوى الرأس مسبقاً. استخدم الجايرو للفليك",
    bestScope: "6x / 8x",
    bestScopeAr: "6x / 8x",
  },
  {
    name: "AWM",
    nameAr: "AWM",
    category: "Sniper",
    categoryAr: "قنص",
    icon: "🎯",
    ads: {
      noScope: 65,
      redDot: 42,
      x2: 26,
      x3: 18,
      x4: 13,
      x6: 8,
      x8: 5,
    },
    adsGyro: {
      noScope: 355,
      redDot: 330,
      x2: 305,
      x3: 265,
      x4: 230,
      x6: 172,
      x8: 128,
    },
    recoilTip: "One shot one kill. Patience + precision. Lower sens for pixel-perfect headshots",
    recoilTipAr: "رصاصة واحدة = قتلة. صبر + دقة. حساسية أقل لهيدشوت مثالي",
    bestScope: "8x / 6x",
    bestScopeAr: "8x / 6x",
  },
  // === SHOTGUNS ===
  {
    name: "S1897",
    nameAr: "S1897",
    category: "Shotgun",
    categoryAr: "شوتقن",
    icon: "💀",
    ads: {
      noScope: 100,
      redDot: 70,
      x2: 40,
      x3: 28,
      x4: 20,
      x6: 14,
      x8: 9,
    },
    adsGyro: {
      noScope: 400,
      redDot: 400,
      x2: 385,
      x3: 350,
      x4: 310,
      x6: 230,
      x8: 180,
    },
    recoilTip: "Hip-fire close range. Aim upper chest — recoil carries to head. Quick peek shots",
    recoilTipAr: "رش من الورك قريب. صوّب أعلى الصدر — الارتداد يوصل للرأس. طلعات سريعة",
    bestScope: "No Scope / Red Dot",
    bestScopeAr: "بدون سكوب / ريد دوت",
  },
  {
    name: "S12K",
    nameAr: "S12K",
    category: "Shotgun",
    categoryAr: "شوتقن",
    icon: "💀",
    ads: {
      noScope: 98,
      redDot: 68,
      x2: 38,
      x3: 27,
      x4: 19,
      x6: 13,
      x8: 9,
    },
    adsGyro: {
      noScope: 400,
      redDot: 398,
      x2: 382,
      x3: 348,
      x4: 308,
      x6: 228,
      x8: 178,
    },
    recoilTip: "Semi-auto — spam fire close range. Great building clearer. Aim center mass",
    recoilTipAr: "نصف أوتوماتيك — رش سريع قريب. ممتاز لتنظيف المباني. صوّب وسط الجسم",
    bestScope: "Red Dot",
    bestScopeAr: "ريد دوت",
  },
  {
    name: "DBS",
    nameAr: "DBS",
    category: "Shotgun",
    categoryAr: "شوتقن",
    icon: "💀",
    ads: {
      noScope: 100,
      redDot: 70,
      x2: 40,
      x3: 28,
      x4: 20,
      x6: 14,
      x8: 9,
    },
    adsGyro: {
      noScope: 400,
      redDot: 400,
      x2: 388,
      x3: 352,
      x4: 312,
      x6: 232,
      x8: 182,
    },
    recoilTip: "Double barrel burst — devastating close. Pre-aim doorways. Two quick shots = kill",
    recoilTipAr: "رشقة مزدوجة — مدمرة قريب. صوّب الأبواب مسبقاً. رصاصتين سريعة = قتلة",
    bestScope: "No Scope / Red Dot",
    bestScopeAr: "بدون سكوب / ريد دوت",
  },
  // === LMGs ===
  {
    name: "DP-28",
    nameAr: "DP-28",
    category: "LMG",
    categoryAr: "رشاش خفيف",
    icon: "⚡",
    ads: {
      noScope: 88,
      redDot: 57,
      x2: 31,
      x3: 22,
      x4: 16,
      x6: 11,
      x8: 7,
    },
    adsGyro: {
      noScope: 388,
      redDot: 378,
      x2: 355,
      x3: 318,
      x4: 278,
      x6: 205,
      x8: 155,
    },
    recoilTip: "Prone = zero recoil laser. Standing: moderate pull down. Great for 6x sprays",
    recoilTipAr: "زحف = ليزر بدون ارتداد. وقوف: سحب معتدل للأسفل. ممتاز لرش 6x",
    bestScope: "3x / 4x / 6x",
    bestScopeAr: "3x / 4x / 6x",
  },
  {
    name: "M249",
    nameAr: "M249",
    category: "LMG",
    categoryAr: "رشاش خفيف",
    icon: "⚡",
    ads: {
      noScope: 90,
      redDot: 59,
      x2: 33,
      x3: 23,
      x4: 17,
      x6: 11,
      x8: 7,
    },
    adsGyro: {
      noScope: 392,
      redDot: 385,
      x2: 362,
      x3: 325,
      x4: 285,
      x6: 212,
      x8: 160,
    },
    recoilTip: "100 round mag — suppress everything. Steady pull. Great vehicle destroyer",
    recoilTipAr: "100 رصاصة — اكبت كل شيء. سحب ثابت. ممتاز لتدمير المركبات",
    bestScope: "Red Dot / 3x / 4x",
    bestScopeAr: "ريد دوت / 3x / 4x",
  },
  {
    name: "MG3",
    nameAr: "MG3",
    category: "LMG",
    categoryAr: "رشاش خفيف",
    icon: "⚡",
    ads: {
      noScope: 85,
      redDot: 54,
      x2: 29,
      x3: 20,
      x4: 14,
      x6: 10,
      x8: 6,
    },
    adsGyro: {
      noScope: 385,
      redDot: 375,
      x2: 352,
      x3: 315,
      x4: 275,
      x6: 202,
      x8: 152,
    },
    recoilTip: "Fastest fire rate LMG. Use 660RPM mode for control, 990RPM for CQC shredding",
    recoilTipAr: "أسرع رشاش. استخدم 660RPM للتحكم، 990RPM للقتال القريب المدمر",
    bestScope: "Red Dot / 2x / 3x",
    bestScopeAr: "ريد دوت / 2x / 3x",
  },
];

// ============================================================
// ADDITIONAL SETTINGS
// ============================================================

export interface AdditionalSettings {
  movementButtonSize: number;
  movementButtonSizeNote: string;
  movementButtonSizeNoteAr: string;
  sprintSensitivity: number;
  sprintNote: string;
  sprintNoteAr: string;
  fov: number;
  fovNote: string;
  fovNoteAr: string;
  peekSensitivity: number;
  peekNote: string;
  peekNoteAr: string;
  freeLookSensitivity: number;
  freeLookNote: string;
  freeLookNoteAr: string;
}

export const additionalSettings: AdditionalSettings = {
  movementButtonSize: 140,
  movementButtonSizeNote: "140% — Optimal for 5-finger claw. Maximizes movement precision without obstructing fire buttons",
  movementButtonSizeNoteAr: "140% — الأمثل لقبضة 5 أصابع. يزيد دقة الحركة بدون إعاقة أزرار الإطلاق",
  sprintSensitivity: 100,
  sprintNote: "Maximum sprint sensitivity for instant directional changes during combat",
  sprintNoteAr: "أقصى حساسية ركض لتغيير الاتجاه الفوري أثناء القتال",
  fov: 90,
  fovNote: "Keep at 90 FOV (iPad View). Maximum field of view for competitive advantage. Do NOT change.",
  fovNoteAr: "أبقِ على 90 FOV (منظور iPad). أقصى مجال رؤية للميزة التنافسية. لا تغيّر.",
  peekSensitivity: 85,
  peekNote: "High peek sensitivity for aggressive peek-and-fire combat style",
  peekNoteAr: "حساسية طلعة عالية لأسلوب القتال الهجومي بالطلعات",
  freeLookSensitivity: 110,
  freeLookNote: "High free look for fast environment scanning while moving",
  freeLookNoteAr: "نظرة حرة عالية لمسح البيئة بسرعة أثناء الحركة",
};

// ============================================================
// THERMAL / FPS DROP ADJUSTMENTS
// ============================================================

export interface ThermalAdjustment {
  scenario: string;
  scenarioAr: string;
  fps: string;
  cameraMultiplier: number;
  adsMultiplier: number;
  gyroMultiplier: number;
  adsGyroMultiplier: number;
  notes: string;
  notesAr: string;
}

export const thermalAdjustments: ThermalAdjustment[] = [
  {
    scenario: "Normal (Cool Device)",
    scenarioAr: "عادي (جهاز بارد)",
    fps: "120 FPS",
    cameraMultiplier: 1.0,
    adsMultiplier: 1.0,
    gyroMultiplier: 1.0,
    adsGyroMultiplier: 1.0,
    notes: "Use base sensitivity as-is. Optimal performance.",
    notesAr: "استخدم الحساسية الأساسية كما هي. أداء مثالي.",
  },
  {
    scenario: "Warm Device",
    scenarioAr: "جهاز دافئ",
    fps: "105-110 FPS",
    cameraMultiplier: 0.97,
    adsMultiplier: 0.97,
    gyroMultiplier: 0.95,
    adsGyroMultiplier: 0.95,
    notes: "Slight reduction. Gyro becomes less responsive — compensate with 5% lower gyro.",
    notesAr: "تقليل طفيف. الجايرو يصبح أقل استجابة — عوّض بتقليل 5% من الجايرو.",
  },
  {
    scenario: "Hot Device (Throttled)",
    scenarioAr: "جهاز ساخن (خانق)",
    fps: "90 FPS",
    cameraMultiplier: 0.93,
    adsMultiplier: 0.93,
    gyroMultiplier: 0.88,
    adsGyroMultiplier: 0.88,
    notes: "Significant frame drop. Reduce all sens by ~7-12%. Gyro input lag increases — lower gyro more aggressively.",
    notesAr: "انخفاض فريمات كبير. قلل كل الحساسية ~7-12%. تأخر الجايرو يزيد — قلل الجايرو بقوة أكبر.",
  },
];

// ============================================================
// SCOPE LABELS
// ============================================================

export const scopeLabels = {
  noScope: { en: "No Scope (TPP/FPP)", ar: "بدون سكوب" },
  redDot: { en: "Red Dot / Holo", ar: "ريد دوت / هولو" },
  x2: { en: "2x Scope", ar: "سكوب 2x" },
  x3: { en: "3x Scope", ar: "سكوب 3x" },
  x4: { en: "4x Scope", ar: "سكوب 4x" },
  x6: { en: "6x Scope", ar: "سكوب 6x" },
  x8: { en: "8x Scope", ar: "سكوب 8x" },
};
