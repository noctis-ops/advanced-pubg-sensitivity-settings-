# 🎮 PUBG Mobile Sensitivity Generator
## الوثيقة الرسمية والمرجع الوحيد للمشروع
### النسخة 1.0.0 | تاريخ الإنشاء: 2025

---

# 📑 فهرس الوثيقة

1. [نظرة عامة على المشروع](#1-نظرة-عامة-على-المشروع)
2. [المتطلبات التقنية](#2-المتطلبات-التقنية)
3. [بنية المشروع والملفات](#3-بنية-المشروع-والملفات)
4. [قاعدة البيانات](#4-قاعدة-البيانات)
5. [الخوارزميات الأساسية](#5-الخوارزميات-الأساسية)
6. [واجهة المستخدم UI/UX](#6-واجهة-المستخدم-uiux)
7. [نظام الترجمة](#7-نظام-الترجمة)
8. [مراحل التطوير](#8-مراحل-التطوير)
9. [معايير الكود](#9-معايير-الكود)
10. [دليل الاستخدام للمطورين](#10-دليل-الاستخدام-للمطورين)

---

# 1. نظرة عامة على المشروع

## 1.1 وصف المشروع

**PUBG Mobile Sensitivity Generator** هو تطبيق ويب متقدم يقوم بتوليد حساسية مخصصة واحترافية لكل لاعب بناءً على:
- مواصفات جهازه (الموديل، حجم الشاشة، المعالج، جودة الجايروسكوب)
- إعدادات اللعبة (الفريمات، FOV)
- أسلوب اللعب (عدد الأصابع، طريقة المسك، نوع الجايروسكوب)
- التفضيلات الشخصية (أسلوب اللعب: هجومي/متوازن/قناص)

## 1.2 المشكلة التي يحلها

| المشكلة | الحل |
|---------|------|
| اللاعبون ينسخون حساسيات من يوتيوب لا تناسب أجهزتهم | حساسية مبنية خصيصاً لجهاز المستخدم |
| لا يفهمون كيف تعمل الحساسية | شرح لكل قيمة ولماذا تم اختيارها |
| يقضون ساعات في التجربة والخطأ | نتيجة فورية في أقل من دقيقة |
| الحساسيات العامة لا تراعي الفروقات | خوارزمية تحسب كل العوامل |

## 1.3 الجمهور المستهدف

- لاعبو PUBG Mobile على جميع المستويات
- المنطقة الأساسية: الشرق الأوسط والعالم العربي
- المنطقة الثانوية: العالم (دعم إنجليزي)

## 1.4 اللغات المدعومة

- العربية (RTL) - اللغة الأساسية
- الإنجليزية (LTR) - اللغة الثانوية

## 1.5 الأجهزة المدعومة

- iPhone (جميع الموديلات من iPhone 8 وأحدث)
- iPad (جميع الموديلات من iPad 6th Gen وأحدث)
- Android (أكثر من 200 جهاز شائع)
- Android Tablets

---

# 2. المتطلبات التقنية

## 2.1 التقنيات المستخدمة

```
Frontend Framework: React 18+ with TypeScript
Build Tool: Vite
Styling: Tailwind CSS 4+
Icons: Lucide React
State Management: React Context + useReducer
Routing: React Router v6 (اختياري للمراحل المتقدمة)
Storage: LocalStorage (للحفظ المحلي)
```

## 2.2 هيكل package.json

```json
{
  "name": "pubg-sensitivity-generator",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.x أو ^19.x",
    "react-dom": "^18.x أو ^19.x",
    "lucide-react": "latest",
    "clsx": "^2.x",
    "tailwind-merge": "^3.x"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.x",
    "tailwindcss": "^4.x",
    "typescript": "^5.x",
    "vite": "^5.x أو أحدث"
  }
}
```

## 2.3 متطلبات المتصفح

- Chrome 90+
- Safari 14+
- Firefox 90+
- Edge 90+
- Samsung Internet 15+

---

# 3. بنية المشروع والملفات

## 3.1 هيكل الملفات الكامل

```
pubg-sensitivity-generator/
│
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts (إذا لزم)
│
├── public/
│   ├── favicon.ico
│   ├── og-image.png (صورة المشاركة)
│   └── manifest.json
│
└── src/
    │
    ├── main.tsx                    # نقطة الدخول
    ├── App.tsx                     # المكون الرئيسي
    ├── index.css                   # الأنماط العامة
    │
    ├── types/                      # تعريفات TypeScript
    │   ├── index.ts                # تصدير جميع الأنواع
    │   ├── device.ts               # أنواع الأجهزة
    │   ├── sensitivity.ts          # أنواع الحساسية
    │   ├── player.ts               # أنواع اللاعب
    │   └── weapon.ts               # أنواع الأسلحة
    │
    ├── data/                       # البيانات الثابتة
    │   ├── devices/
    │   │   ├── index.ts            # تصدير جميع الأجهزة
    │   │   ├── iphones.ts          # بيانات أجهزة iPhone
    │   │   ├── ipads.ts            # بيانات أجهزة iPad
    │   │   ├── samsung.ts          # بيانات أجهزة Samsung
    │   │   ├── xiaomi.ts           # بيانات أجهزة Xiaomi
    │   │   ├── oneplus.ts          # بيانات أجهزة OnePlus
    │   │   ├── oppo.ts             # بيانات أجهزة Oppo/Realme
    │   │   ├── huawei.ts           # بيانات أجهزة Huawei
    │   │   ├── poco.ts             # بيانات أجهزة Poco
    │   │   ├── rog.ts              # بيانات أجهزة ROG/Gaming
    │   │   ├── redmagic.ts         # بيانات أجهزة Red Magic
    │   │   └── other.ts            # أجهزة أخرى
    │   │
    │   ├── weapons/
    │   │   ├── index.ts            # تصدير جميع الأسلحة
    │   │   ├── assault-rifles.ts   # بنادق هجومية
    │   │   ├── smgs.ts             # رشاشات خفيفة
    │   │   ├── snipers.ts          # قناصات
    │   │   ├── dmrs.ts             # بنادق DMR
    │   │   ├── shotguns.ts         # شوتقن
    │   │   └── lmgs.ts             # رشاشات ثقيلة
    │   │
    │   ├── constants/
    │   │   ├── index.ts            # تصدير الثوابت
    │   │   ├── sensitivity-ranges.ts   # نطاقات الحساسية
    │   │   ├── multipliers.ts      # معاملات الضرب
    │   │   └── scopes.ts           # بيانات السكوبات
    │   │
    │   └── base-sensitivity.ts     # الحساسية الأساسية المرجعية
    │
    ├── hooks/                      # React Hooks مخصصة
    │   ├── useLanguage.ts          # إدارة اللغة
    │   ├── useSensitivityGenerator.ts  # توليد الحساسية
    │   ├── useDeviceSearch.ts      # البحث في الأجهزة
    │   └── useLocalStorage.ts      # التخزين المحلي
    │
    ├── context/                    # React Context
    │   ├── LanguageContext.tsx     # سياق اللغة
    │   ├── GeneratorContext.tsx    # سياق المولّد
    │   └── ThemeContext.tsx        # سياق الثيم (اختياري)
    │
    ├── utils/                      # وظائف مساعدة
    │   ├── cn.ts                   # دمج الـ classes
    │   ├── sensitivity-calculator.ts   # حساب الحساسية
    │   ├── device-analyzer.ts      # تحليل الجهاز
    │   ├── export-helpers.ts       # وظائف التصدير
    │   └── validators.ts           # التحقق من البيانات
    │
    ├── components/                 # المكونات
    │   │
    │   ├── ui/                     # مكونات UI أساسية
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   ├── Input.tsx
    │   │   ├── Select.tsx
    │   │   ├── Slider.tsx
    │   │   ├── Toggle.tsx
    │   │   ├── Modal.tsx
    │   │   ├── Tooltip.tsx
    │   │   ├── ProgressBar.tsx
    │   │   ├── Badge.tsx
    │   │   ├── Tabs.tsx
    │   │   └── Accordion.tsx
    │   │
    │   ├── layout/                 # مكونات التخطيط
    │   │   ├── Header.tsx
    │   │   ├── Footer.tsx
    │   │   ├── Container.tsx
    │   │   ├── Section.tsx
    │   │   └── LanguageSwitcher.tsx
    │   │
    │   ├── steps/                  # خطوات المولّد
    │   │   ├── StepIndicator.tsx       # مؤشر الخطوات
    │   │   ├── Step1DeviceSelect.tsx   # اختيار الجهاز
    │   │   ├── Step2FrameRate.tsx      # اختيار الفريمات
    │   │   ├── Step3Fingers.tsx        # عدد الأصابع وطريقة المسك
    │   │   ├── Step4Gyroscope.tsx      # نوع الجايروسكوب
    │   │   ├── Step5Playstyle.tsx      # أسلوب اللعب
    │   │   ├── Step6Advanced.tsx       # إعدادات متقدمة (اختياري)
    │   │   └── StepNavigation.tsx      # أزرار التنقل
    │   │
    │   ├── results/                # عرض النتائج
    │   │   ├── ResultsPage.tsx         # صفحة النتائج الرئيسية
    │   │   ├── SensitivityCard.tsx     # بطاقة نوع حساسية
    │   │   ├── SensitivityTable.tsx    # جدول القيم
    │   │   ├── WeaponSensitivity.tsx   # حساسية الأسلحة
    │   │   ├── ExplanationPanel.tsx    # شرح القيم
    │   │   ├── ComparisonPanel.tsx     # مقارنة مع المحترفين
    │   │   ├── ExportOptions.tsx       # خيارات التصدير
    │   │   └── CopyButton.tsx          # زر النسخ
    │   │
    │   ├── device/                 # مكونات الجهاز
    │   │   ├── DeviceSearch.tsx        # البحث
    │   │   ├── DeviceCard.tsx          # بطاقة الجهاز
    │   │   ├── DeviceList.tsx          # قائمة الأجهزة
    │   │   ├── BrandFilter.tsx         # فلتر العلامات التجارية
    │   │   └── DeviceSpecs.tsx         # مواصفات الجهاز
    │   │
    │   └── shared/                 # مكونات مشتركة
    │       ├── Logo.tsx
    │       ├── LoadingSpinner.tsx
    │       ├── ErrorMessage.tsx
    │       ├── EmptyState.tsx
    │       └── IconWrapper.tsx
    │
    ├── i18n/                       # الترجمة
    │   ├── index.ts                # إدارة الترجمة
    │   ├── ar.ts                   # النصوص العربية
    │   └── en.ts                   # النصوص الإنجليزية
    │
    └── styles/                     # أنماط إضافية (اختياري)
        └── animations.css          # الحركات
```

## 3.2 وصف كل مجلد

| المجلد | الوظيفة |
|--------|---------|
| `types/` | تعريفات TypeScript لجميع الكائنات |
| `data/` | البيانات الثابتة (الأجهزة، الأسلحة، الثوابت) |
| `hooks/` | React Hooks مخصصة للمنطق المشترك |
| `context/` | React Context للحالة العامة |
| `utils/` | وظائف مساعدة بدون UI |
| `components/ui/` | مكونات UI أساسية قابلة لإعادة الاستخدام |
| `components/layout/` | مكونات هيكل الصفحة |
| `components/steps/` | مكونات خطوات المولّد |
| `components/results/` | مكونات عرض النتائج |
| `i18n/` | ملفات الترجمة |

---

# 4. قاعدة البيانات

## 4.1 تعريف أنواع البيانات (TypeScript)

### 4.1.1 نوع الجهاز (Device)

```typescript
// src/types/device.ts

export type DeviceBrand = 
  | 'apple' 
  | 'samsung' 
  | 'xiaomi' 
  | 'oneplus' 
  | 'oppo' 
  | 'realme'
  | 'huawei' 
  | 'honor'
  | 'poco' 
  | 'redmi'
  | 'rog' 
  | 'redmagic' 
  | 'blackshark'
  | 'sony'
  | 'google'
  | 'zte'
  | 'lenovo'
  | 'other';

export type DeviceType = 'phone' | 'tablet';

export type DeviceOS = 'ios' | 'android';

export interface DeviceSpecs {
  screenSize: number;          // بالإنش (مثال: 6.7)
  screenWidth: number;         // بالبكسل
  screenHeight: number;        // بالبكسل
  ppi: number;                 // كثافة البكسلات
  refreshRate: number;         // معدل تحديث الشاشة (60/90/120/144)
  touchSamplingRate: number;   // معدل استجابة اللمس (120/240/480/720)
  maxFPS: number;              // أقصى فريمات مدعومة في PUBG
  gyroscopeQuality: number;    // جودة الجايروسكوب (1-10)
  processorTier: 'flagship' | 'high' | 'mid' | 'low';  // فئة المعالج
}

export interface Device {
  id: string;                  // معرف فريد
  brand: DeviceBrand;          // العلامة التجارية
  name: string;                // اسم الجهاز بالإنجليزية
  nameAr: string;              // اسم الجهاز بالعربية
  type: DeviceType;            // هاتف أو تابلت
  os: DeviceOS;                // نظام التشغيل
  releaseYear: number;         // سنة الإصدار
  specs: DeviceSpecs;          // المواصفات
  imageUrl?: string;           // صورة الجهاز (اختياري)
  popularityRank?: number;     // ترتيب الشعبية (اختياري)
}
```

### 4.1.2 نوع اللاعب (Player Settings)

```typescript
// src/types/player.ts

export type FingerCount = 2 | 3 | 4 | 5 | 6;

export type GripStyle = 
  | 'thumbs'      // إبهامين فقط
  | 'three-finger' // 3 أصابع
  | 'claw'        // 4 أصابع مخلب
  | 'five-claw'   // 5 أصابع
  | 'full-claw';  // 6 أصابع

export type GyroscopeMode = 
  | 'off'         // مغلق
  | 'scope-only'  // عند التصويب فقط
  | 'always-on';  // دائماً مفعل

export type PlayStyle = 
  | 'aggressive'  // هجومي (rusher)
  | 'balanced'    // متوازن
  | 'passive';    // دفاعي/قناص

export type SkillLevel = 
  | 'beginner'    // مبتدئ
  | 'intermediate' // متوسط
  | 'advanced'    // متقدم
  | 'pro';        // محترف

export interface PlayerSettings {
  fingerCount: FingerCount;
  gripStyle: GripStyle;
  gyroscopeMode: GyroscopeMode;
  playStyle: PlayStyle;
  skillLevel: SkillLevel;
  preferredFPS: 30 | 60 | 90 | 120;
  fov: number;                    // 80-90
  adsMode: 'hold' | 'tap';        // طريقة التصويب
  peekMode: 'hold' | 'tap';       // طريقة الطلعة
}
```

### 4.1.3 نوع الحساسية (Sensitivity)

```typescript
// src/types/sensitivity.ts

export interface ScopeValues {
  noScope: number;     // TPP/FPP بدون سكوب
  redDot: number;      // Red Dot / Holographic
  x2: number;          // 2x Scope
  x3: number;          // 3x Scope
  x4: number;          // 4x Scope
  x6: number;          // 6x Scope
  x8: number;          // 8x Scope
}

export interface AimAssistValues {
  aimTPP: number;      // Aim Assist TPP
  aimFPP: number;      // Aim Assist FPP
}

export interface SensitivityCategory {
  camera: ScopeValues & AimAssistValues;
  ads: ScopeValues & AimAssistValues;
  gyroscope: ScopeValues & AimAssistValues;
  adsGyroscope: ScopeValues & AimAssistValues;
}

export interface AdditionalSensitivity {
  freeLook: number;           // النظرة الحرة
  cameraTPP: number;          // كاميرا الشخص الثالث
  cameraFPP: number;          // كاميرا الشخص الأول
  cameraDriving: number;      // كاميرا القيادة
  cameraParachuting: number;  // كاميرا المظلة
}

export interface ControlSettings {
  movementButtonSize: number;  // حجم زر الحركة (50-200)
  fireButtonSize: number;      // حجم زر الإطلاق
  peekButtonSize: number;      // حجم زر الطلعة
}

export interface GeneratedSensitivity {
  id: string;                  // معرف فريد للحفظ
  createdAt: Date;             // تاريخ الإنشاء
  device: Device;              // الجهاز
  playerSettings: PlayerSettings;  // إعدادات اللاعب
  sensitivity: SensitivityCategory;  // الحساسية الأساسية
  additional: AdditionalSensitivity; // حساسيات إضافية
  controls: ControlSettings;   // إعدادات التحكم
  explanation: SensitivityExplanation;  // الشرح
}

export interface SensitivityExplanation {
  overall: string;             // شرح عام
  factors: {
    factor: string;            // اسم العامل
    impact: string;            // التأثير
    adjustment: number;        // نسبة التعديل
  }[];
}
```

### 4.1.4 نوع السلاح (Weapon)

```typescript
// src/types/weapon.ts

export type WeaponCategory = 
  | 'assault-rifle'
  | 'smg'
  | 'sniper'
  | 'dmr'
  | 'shotgun'
  | 'lmg'
  | 'pistol';

export interface WeaponRecoilPattern {
  vertical: number;          // الارتداد العمودي (1-10)
  horizontal: number;        // الارتداد الأفقي (1-10)
  pattern: 'straight' | 'left' | 'right' | 'zigzag';  // نمط الارتداد
  firstShotMultiplier: number;  // معامل الرصاصة الأولى
  recoveryTime: number;      // وقت التعافي
}

export interface Weapon {
  id: string;
  name: string;              // الاسم بالإنجليزية
  nameAr: string;            // الاسم بالعربية
  category: WeaponCategory;
  damage: number;            // الضرر
  fireRate: number;          // معدل النار (رصاصة/دقيقة)
  recoil: WeaponRecoilPattern;
  bestScopes: string[];      // أفضل السكوبات
  effectiveRange: 'close' | 'mid' | 'long' | 'all';
  difficulty: 'easy' | 'medium' | 'hard';  // صعوبة التحكم
  icon: string;              // إيموجي أو أيقونة
}

export interface WeaponSensitivityAdjustment {
  weapon: Weapon;
  adsMultiplier: number;     // معامل ضرب ADS
  gyroMultiplier: number;    // معامل ضرب الجايرو
  recommendedScopes: string[];
  tips: {
    en: string;
    ar: string;
  };
}
```

## 4.2 بيانات الأجهزة (نماذج)

### 4.2.1 أجهزة iPhone

```typescript
// src/data/devices/iphones.ts

import { Device } from '../../types/device';

export const iPhones: Device[] = [
  // ========== iPhone 15 Series ==========
  {
    id: 'iphone-15-pro-max',
    brand: 'apple',
    name: 'iPhone 15 Pro Max',
    nameAr: 'آيفون 15 برو ماكس',
    type: 'phone',
    os: 'ios',
    releaseYear: 2023,
    specs: {
      screenSize: 6.7,
      screenWidth: 1290,
      screenHeight: 2796,
      ppi: 460,
      refreshRate: 120,
      touchSamplingRate: 240,
      maxFPS: 120,
      gyroscopeQuality: 10,
      processorTier: 'flagship'
    },
    popularityRank: 1
  },
  {
    id: 'iphone-15-pro',
    brand: 'apple',
    name: 'iPhone 15 Pro',
    nameAr: 'آيفون 15 برو',
    type: 'phone',
    os: 'ios',
    releaseYear: 2023,
    specs: {
      screenSize: 6.1,
      screenWidth: 1179,
      screenHeight: 2556,
      ppi: 460,
      refreshRate: 120,
      touchSamplingRate: 240,
      maxFPS: 120,
      gyroscopeQuality: 10,
      processorTier: 'flagship'
    },
    popularityRank: 2
  },
  {
    id: 'iphone-15-plus',
    brand: 'apple',
    name: 'iPhone 15 Plus',
    nameAr: 'آيفون 15 بلس',
    type: 'phone',
    os: 'ios',
    releaseYear: 2023,
    specs: {
      screenSize: 6.7,
      screenWidth: 1290,
      screenHeight: 2796,
      ppi: 460,
      refreshRate: 60,
      touchSamplingRate: 120,
      maxFPS: 90,
      gyroscopeQuality: 9,
      processorTier: 'flagship'
    },
    popularityRank: 5
  },
  {
    id: 'iphone-15',
    brand: 'apple',
    name: 'iPhone 15',
    nameAr: 'آيفون 15',
    type: 'phone',
    os: 'ios',
    releaseYear: 2023,
    specs: {
      screenSize: 6.1,
      screenWidth: 1179,
      screenHeight: 2556,
      ppi: 460,
      refreshRate: 60,
      touchSamplingRate: 120,
      maxFPS: 90,
      gyroscopeQuality: 9,
      processorTier: 'flagship'
    },
    popularityRank: 6
  },
  
  // ========== iPhone 14 Series ==========
  {
    id: 'iphone-14-pro-max',
    brand: 'apple',
    name: 'iPhone 14 Pro Max',
    nameAr: 'آيفون 14 برو ماكس',
    type: 'phone',
    os: 'ios',
    releaseYear: 2022,
    specs: {
      screenSize: 6.7,
      screenWidth: 1290,
      screenHeight: 2796,
      ppi: 460,
      refreshRate: 120,
      touchSamplingRate: 240,
      maxFPS: 120,
      gyroscopeQuality: 10,
      processorTier: 'flagship'
    },
    popularityRank: 3
  },
  {
    id: 'iphone-14-pro',
    brand: 'apple',
    name: 'iPhone 14 Pro',
    nameAr: 'آيفون 14 برو',
    type: 'phone',
    os: 'ios',
    releaseYear: 2022,
    specs: {
      screenSize: 6.1,
      screenWidth: 1179,
      screenHeight: 2556,
      ppi: 460,
      refreshRate: 120,
      touchSamplingRate: 240,
      maxFPS: 120,
      gyroscopeQuality: 10,
      processorTier: 'flagship'
    },
    popularityRank: 4
  },
  {
    id: 'iphone-14-plus',
    brand: 'apple',
    name: 'iPhone 14 Plus',
    nameAr: 'آيفون 14 بلس',
    type: 'phone',
    os: 'ios',
    releaseYear: 2022,
    specs: {
      screenSize: 6.7,
      screenWidth: 1284,
      screenHeight: 2778,
      ppi: 458,
      refreshRate: 60,
      touchSamplingRate: 120,
      maxFPS: 90,
      gyroscopeQuality: 9,
      processorTier: 'flagship'
    }
  },
  {
    id: 'iphone-14',
    brand: 'apple',
    name: 'iPhone 14',
    nameAr: 'آيفون 14',
    type: 'phone',
    os: 'ios',
    releaseYear: 2022,
    specs: {
      screenSize: 6.1,
      screenWidth: 1170,
      screenHeight: 2532,
      ppi: 460,
      refreshRate: 60,
      touchSamplingRate: 120,
      maxFPS: 90,
      gyroscopeQuality: 9,
      processorTier: 'flagship'
    }
  },

  // ========== iPhone 13 Series ==========
  {
    id: 'iphone-13-pro-max',
    brand: 'apple',
    name: 'iPhone 13 Pro Max',
    nameAr: 'آيفون 13 برو ماكس',
    type: 'phone',
    os: 'ios',
    releaseYear: 2021,
    specs: {
      screenSize: 6.7,
      screenWidth: 1284,
      screenHeight: 2778,
      ppi: 458,
      refreshRate: 120,
      touchSamplingRate: 240,
      maxFPS: 90,
      gyroscopeQuality: 9,
      processorTier: 'flagship'
    }
  },
  {
    id: 'iphone-13-pro',
    brand: 'apple',
    name: 'iPhone 13 Pro',
    nameAr: 'آيفون 13 برو',
    type: 'phone',
    os: 'ios',
    releaseYear: 2021,
    specs: {
      screenSize: 6.1,
      screenWidth: 1170,
      screenHeight: 2532,
      ppi: 460,
      refreshRate: 120,
      touchSamplingRate: 240,
      maxFPS: 90,
      gyroscopeQuality: 9,
      processorTier: 'flagship'
    }
  },
  {
    id: 'iphone-13',
    brand: 'apple',
    name: 'iPhone 13',
    nameAr: 'آيفون 13',
    type: 'phone',
    os: 'ios',
    releaseYear: 2021,
    specs: {
      screenSize: 6.1,
      screenWidth: 1170,
      screenHeight: 2532,
      ppi: 460,
      refreshRate: 60,
      touchSamplingRate: 120,
      maxFPS: 60,
      gyroscopeQuality: 8,
      processorTier: 'flagship'
    }
  },
  {
    id: 'iphone-13-mini',
    brand: 'apple',
    name: 'iPhone 13 Mini',
    nameAr: 'آيفون 13 ميني',
    type: 'phone',
    os: 'ios',
    releaseYear: 2021,
    specs: {
      screenSize: 5.4,
      screenWidth: 1080,
      screenHeight: 2340,
      ppi: 476,
      refreshRate: 60,
      touchSamplingRate: 120,
      maxFPS: 60,
      gyroscopeQuality: 8,
      processorTier: 'flagship'
    }
  },

  // ========== iPhone 12 Series ==========
  {
    id: 'iphone-12-pro-max',
    brand: 'apple',
    name: 'iPhone 12 Pro Max',
    nameAr: 'آيفون 12 برو ماكس',
    type: 'phone',
    os: 'ios',
    releaseYear: 2020,
    specs: {
      screenSize: 6.7,
      screenWidth: 1284,
      screenHeight: 2778,
      ppi: 458,
      refreshRate: 60,
      touchSamplingRate: 120,
      maxFPS: 60,
      gyroscopeQuality: 9,
      processorTier: 'flagship'
    }
  },
  {
    id: 'iphone-12-pro',
    brand: 'apple',
    name: 'iPhone 12 Pro',
    nameAr: 'آيفون 12 برو',
    type: 'phone',
    os: 'ios',
    releaseYear: 2020,
    specs: {
      screenSize: 6.1,
      screenWidth: 1170,
      screenHeight: 2532,
      ppi: 460,
      refreshRate: 60,
      touchSamplingRate: 120,
      maxFPS: 60,
      gyroscopeQuality: 9,
      processorTier: 'flagship'
    }
  },
  {
    id: 'iphone-12',
    brand: 'apple',
    name: 'iPhone 12',
    nameAr: 'آيفون 12',
    type: 'phone',
    os: 'ios',
    releaseYear: 2020,
    specs: {
      screenSize: 6.1,
      screenWidth: 1170,
      screenHeight: 2532,
      ppi: 460,
      refreshRate: 60,
      touchSamplingRate: 120,
      maxFPS: 60,
      gyroscopeQuality: 8,
      processorTier: 'flagship'
    }
  },

  // ========== iPhone 11 Series ==========
  {
    id: 'iphone-11-pro-max',
    brand: 'apple',
    name: 'iPhone 11 Pro Max',
    nameAr: 'آيفون 11 برو ماكس',
    type: 'phone',
    os: 'ios',
    releaseYear: 2019,
    specs: {
      screenSize: 6.5,
      screenWidth: 1242,
      screenHeight: 2688,
      ppi: 458,
      refreshRate: 60,
      touchSamplingRate: 120,
      maxFPS: 60,
      gyroscopeQuality: 8,
      processorTier: 'flagship'
    }
  },
  {
    id: 'iphone-11',
    brand: 'apple',
    name: 'iPhone 11',
    nameAr: 'آيفون 11',
    type: 'phone',
    os: 'ios',
    releaseYear: 2019,
    specs: {
      screenSize: 6.1,
      screenWidth: 828,
      screenHeight: 1792,
      ppi: 326,
      refreshRate: 60,
      touchSamplingRate: 120,
      maxFPS: 60,
      gyroscopeQuality: 8,
      processorTier: 'flagship'
    }
  },

  // ========== Older iPhones ==========
  {
    id: 'iphone-xr',
    brand: 'apple',
    name: 'iPhone XR',
    nameAr: 'آيفون XR',
    type: 'phone',
    os: 'ios',
    releaseYear: 2018,
    specs: {
      screenSize: 6.1,
      screenWidth: 828,
      screenHeight: 1792,
      ppi: 326,
      refreshRate: 60,
      touchSamplingRate: 120,
      maxFPS: 60,
      gyroscopeQuality: 7,
      processorTier: 'high'
    }
  },
  {
    id: 'iphone-xs-max',
    brand: 'apple',
    name: 'iPhone XS Max',
    nameAr: 'آيفون XS ماكس',
    type: 'phone',
    os: 'ios',
    releaseYear: 2018,
    specs: {
      screenSize: 6.5,
      screenWidth: 1242,
      screenHeight: 2688,
      ppi: 458,
      refreshRate: 60,
      touchSamplingRate: 120,
      maxFPS: 60,
      gyroscopeQuality: 8,
      processorTier: 'high'
    }
  },
  {
    id: 'iphone-x',
    brand: 'apple',
    name: 'iPhone X',
    nameAr: 'آيفون X',
    type: 'phone',
    os: 'ios',
    releaseYear: 2017,
    specs: {
      screenSize: 5.8,
      screenWidth: 1125,
      screenHeight: 2436,
      ppi: 458,
      refreshRate: 60,
      touchSamplingRate: 120,
      maxFPS: 60,
      gyroscopeQuality: 7,
      processorTier: 'high'
    }
  },
  {
    id: 'iphone-8-plus',
    brand: 'apple',
    name: 'iPhone 8 Plus',
    nameAr: 'آيفون 8 بلس',
    type: 'phone',
    os: 'ios',
    releaseYear: 2017,
    specs: {
      screenSize: 5.5,
      screenWidth: 1080,
      screenHeight: 1920,
      ppi: 401,
      refreshRate: 60,
      touchSamplingRate: 120,
      maxFPS: 60,
      gyroscopeQuality: 7,
      processorTier: 'high'
    }
  },
  {
    id: 'iphone-8',
    brand: 'apple',
    name: 'iPhone 8',
    nameAr: 'آيفون 8',
    type: 'phone',
    os: 'ios',
    releaseYear: 2017,
    specs: {
      screenSize: 4.7,
      screenWidth: 750,
      screenHeight: 1334,
      ppi: 326,
      refreshRate: 60,
      touchSamplingRate: 120,
      maxFPS: 60,
      gyroscopeQuality: 7,
      processorTier: 'high'
    }
  },
  
  // ========== iPhone SE Series ==========
  {
    id: 'iphone-se-3rd',
    brand: 'apple',
    name: 'iPhone SE (3rd Gen)',
    nameAr: 'آيفون SE (الجيل الثالث)',
    type: 'phone',
    os: 'ios',
    releaseYear: 2022,
    specs: {
      screenSize: 4.7,
      screenWidth: 750,
      screenHeight: 1334,
      ppi: 326,
      refreshRate: 60,
      touchSamplingRate: 120,
      maxFPS: 60,
      gyroscopeQuality: 8,
      processorTier: 'flagship'
    }
  },
  {
    id: 'iphone-se-2nd',
    brand: 'apple',
    name: 'iPhone SE (2nd Gen)',
    nameAr: 'آيفون SE (الجيل الثاني)',
    type: 'phone',
    os: 'ios',
    releaseYear: 2020,
    specs: {
      screenSize: 4.7,
      screenWidth: 750,
      screenHeight: 1334,
      ppi: 326,
      refreshRate: 60,
      touchSamplingRate: 120,
      maxFPS: 60,
      gyroscopeQuality: 7,
      processorTier: 'high'
    }
  }
];
```

### 4.2.2 أجهزة iPad

```typescript
// src/data/devices/ipads.ts

import { Device } from '../../types/device';

export const iPads: Device[] = [
  // ========== iPad Pro Series ==========
  {
    id: 'ipad-pro-12.9-m4',
    brand: 'apple',
    name: 'iPad Pro 12.9" (M4, 2024)',
    nameAr: 'آيباد برو 12.9 بوصة (M4)',
    type: 'tablet',
    os: 'ios',
    releaseYear: 2024,
    specs: {
      screenSize: 12.9,
      screenWidth: 2048,
      screenHeight: 2732,
      ppi: 264,
      refreshRate: 120,
      touchSamplingRate: 240,
      maxFPS: 120,
      gyroscopeQuality: 10,
      processorTier: 'flagship'
    },
    popularityRank: 1
  },
  {
    id: 'ipad-pro-11-m4',
    brand: 'apple',
    name: 'iPad Pro 11" (M4, 2024)',
    nameAr: 'آيباد برو 11 بوصة (M4)',
    type: 'tablet',
    os: 'ios',
    releaseYear: 2024,
    specs: {
      screenSize: 11.0,
      screenWidth: 1668,
      screenHeight: 2388,
      ppi: 264,
      refreshRate: 120,
      touchSamplingRate: 240,
      maxFPS: 120,
      gyroscopeQuality: 10,
      processorTier: 'flagship'
    },
    popularityRank: 2
  },
  {
    id: 'ipad-pro-12.9-m2',
    brand: 'apple',
    name: 'iPad Pro 12.9" (M2, 2022)',
    nameAr: 'آيباد برو 12.9 بوصة (M2)',
    type: 'tablet',
    os: 'ios',
    releaseYear: 2022,
    specs: {
      screenSize: 12.9,
      screenWidth: 2048,
      screenHeight: 2732,
      ppi: 264,
      refreshRate: 120,
      touchSamplingRate: 240,
      maxFPS: 120,
      gyroscopeQuality: 10,
      processorTier: 'flagship'
    }
  },
  {
    id: 'ipad-pro-11-m2',
    brand: 'apple',
    name: 'iPad Pro 11" (M2, 2022)',
    nameAr: 'آيباد برو 11 بوصة (M2)',
    type: 'tablet',
    os: 'ios',
    releaseYear: 2022,
    specs: {
      screenSize: 11.0,
      screenWidth: 1668,
      screenHeight: 2388,
      ppi: 264,
      refreshRate: 120,
      touchSamplingRate: 240,
      maxFPS: 120,
      gyroscopeQuality: 10,
      processorTier: 'flagship'
    }
  },
  {
    id: 'ipad-pro-12.9-m1',
    brand: 'apple',
    name: 'iPad Pro 12.9" (M1, 2021)',
    nameAr: 'آيباد برو 12.9 بوصة (M1)',
    type: 'tablet',
    os: 'ios',
    releaseYear: 2021,
    specs: {
      screenSize: 12.9,
      screenWidth: 2048,
      screenHeight: 2732,
      ppi: 264,
      refreshRate: 120,
      touchSamplingRate: 240,
      maxFPS: 120,
      gyroscopeQuality: 10,
      processorTier: 'flagship'
    }
  },
  {
    id: 'ipad-pro-11-m1',
    brand: 'apple',
    name: 'iPad Pro 11" (M1, 2021)',
    nameAr: 'آيباد برو 11 بوصة (M1)',
    type: 'tablet',
    os: 'ios',
    releaseYear: 2021,
    specs: {
      screenSize: 11.0,
      screenWidth: 1668,
      screenHeight: 2388,
      ppi: 264,
      refreshRate: 120,
      touchSamplingRate: 240,
      maxFPS: 120,
      gyroscopeQuality: 10,
      processorTier: 'flagship'
    }
  },
  
  // ========== iPad Air Series ==========
  {
    id: 'ipad-air-m2',
    brand: 'apple',
    name: 'iPad Air (M2, 2024)',
    nameAr: 'آيباد إير (M2)',
    type: 'tablet',
    os: 'ios',
    releaseYear: 2024,
    specs: {
      screenSize: 11.0,
      screenWidth: 1640,
      screenHeight: 2360,
      ppi: 264,
      refreshRate: 60,
      touchSamplingRate: 120,
      maxFPS: 120,
      gyroscopeQuality: 9,
      processorTier: 'flagship'
    }
  },
  {
    id: 'ipad-air-5',
    brand: 'apple',
    name: 'iPad Air (5th Gen, M1)',
    nameAr: 'آيباد إير (الجيل الخامس)',
    type: 'tablet',
    os: 'ios',
    releaseYear: 2022,
    specs: {
      screenSize: 10.9,
      screenWidth: 1640,
      screenHeight: 2360,
      ppi: 264,
      refreshRate: 60,
      touchSamplingRate: 120,
      maxFPS: 90,
      gyroscopeQuality: 9,
      processorTier: 'flagship'
    }
  },
  {
    id: 'ipad-air-4',
    brand: 'apple',
    name: 'iPad Air (4th Gen)',
    nameAr: 'آيباد إير (الجيل الرابع)',
    type: 'tablet',
    os: 'ios',
    releaseYear: 2020,
    specs: {
      screenSize: 10.9,
      screenWidth: 1640,
      screenHeight: 2360,
      ppi: 264,
      refreshRate: 60,
      touchSamplingRate: 120,
      maxFPS: 60,
      gyroscopeQuality: 8,
      processorTier: 'high'
    }
  },

  // ========== iPad Standard Series ==========
  {
    id: 'ipad-10th',
    brand: 'apple',
    name: 'iPad (10th Gen, 2022)',
    nameAr: 'آيباد (الجيل العاشر)',
    type: 'tablet',
    os: 'ios',
    releaseYear: 2022,
    specs: {
      screenSize: 10.9,
      screenWidth: 1640,
      screenHeight: 2360,
      ppi: 264,
      refreshRate: 60,
      touchSamplingRate: 120,
      maxFPS: 60,
      gyroscopeQuality: 8,
      processorTier: 'high'
    }
  },
  {
    id: 'ipad-9th',
    brand: 'apple',
    name: 'iPad (9th Gen, 2021)',
    nameAr: 'آيباد (الجيل التاسع)',
    type: 'tablet',
    os: 'ios',
    releaseYear: 2021,
    specs: {
      screenSize: 10.2,
      screenWidth: 1620,
      screenHeight: 2160,
      ppi: 264,
      refreshRate: 60,
      touchSamplingRate: 120,
      maxFPS: 60,
      gyroscopeQuality: 7,
      processorTier: 'mid'
    }
  },
  
  // ========== iPad Mini Series ==========
  {
    id: 'ipad-mini-6',
    brand: 'apple',
    name: 'iPad Mini (6th Gen)',
    nameAr: 'آيباد ميني (الجيل السادس)',
    type: 'tablet',
    os: 'ios',
    releaseYear: 2021,
    specs: {
      screenSize: 8.3,
      screenWidth: 1488,
      screenHeight: 2266,
      ppi: 326,
      refreshRate: 60,
      touchSamplingRate: 120,
      maxFPS: 60,
      gyroscopeQuality: 9,
      processorTier: 'flagship'
    }
  }
];
```

### 4.2.3 أجهزة Samsung (نموذج)

```typescript
// src/data/devices/samsung.ts

import { Device } from '../../types/device';

export const samsungDevices: Device[] = [
  // ========== Galaxy S24 Series ==========
  {
    id: 'samsung-s24-ultra',
    brand: 'samsung',
    name: 'Samsung Galaxy S24 Ultra',
    nameAr: 'سامسونج جالكسي S24 ألترا',
    type: 'phone',
    os: 'android',
    releaseYear: 2024,
    specs: {
      screenSize: 6.8,
      screenWidth: 1440,
      screenHeight: 3120,
      ppi: 505,
      refreshRate: 120,
      touchSamplingRate: 240,
      maxFPS: 120,
      gyroscopeQuality: 9,
      processorTier: 'flagship'
    },
    popularityRank: 1
  },
  {
    id: 'samsung-s24-plus',
    brand: 'samsung',
    name: 'Samsung Galaxy S24+',
    nameAr: 'سامسونج جالكسي S24+',
    type: 'phone',
    os: 'android',
    releaseYear: 2024,
    specs: {
      screenSize: 6.7,
      screenWidth: 1440,
      screenHeight: 3120,
      ppi: 513,
      refreshRate: 120,
      touchSamplingRate: 240,
      maxFPS: 120,
      gyroscopeQuality: 9,
      processorTier: 'flagship'
    }
  },
  {
    id: 'samsung-s24',
    brand: 'samsung',
    name: 'Samsung Galaxy S24',
    nameAr: 'سامسونج جالكسي S24',
    type: 'phone',
    os: 'android',
    releaseYear: 2024,
    specs: {
      screenSize: 6.2,
      screenWidth: 1080,
      screenHeight: 2340,
      ppi: 416,
      refreshRate: 120,
      touchSamplingRate: 240,
      maxFPS: 120,
      gyroscopeQuality: 8,
      processorTier: 'flagship'
    }
  },

  // ========== Galaxy S23 Series ==========
  {
    id: 'samsung-s23-ultra',
    brand: 'samsung',
    name: 'Samsung Galaxy S23 Ultra',
    nameAr: 'سامسونج جالكسي S23 ألترا',
    type: 'phone',
    os: 'android',
    releaseYear: 2023,
    specs: {
      screenSize: 6.8,
      screenWidth: 1440,
      screenHeight: 3088,
      ppi: 500,
      refreshRate: 120,
      touchSamplingRate: 240,
      maxFPS: 120,
      gyroscopeQuality: 9,
      processorTier: 'flagship'
    },
    popularityRank: 2
  },
  {
    id: 'samsung-s23-plus',
    brand: 'samsung',
    name: 'Samsung Galaxy S23+',
    nameAr: 'سامسونج جالكسي S23+',
    type: 'phone',
    os: 'android',
    releaseYear: 2023,
    specs: {
      screenSize: 6.6,
      screenWidth: 1080,
      screenHeight: 2340,
      ppi: 393,
      refreshRate: 120,
      touchSamplingRate: 240,
      maxFPS: 120,
      gyroscopeQuality: 8,
      processorTier: 'flagship'
    }
  },
  {
    id: 'samsung-s23',
    brand: 'samsung',
    name: 'Samsung Galaxy S23',
    nameAr: 'سامسونج جالكسي S23',
    type: 'phone',
    os: 'android',
    releaseYear: 2023,
    specs: {
      screenSize: 6.1,
      screenWidth: 1080,
      screenHeight: 2340,
      ppi: 425,
      refreshRate: 120,
      touchSamplingRate: 240,
      maxFPS: 90,
      gyroscopeQuality: 8,
      processorTier: 'flagship'
    }
  },

  // ========== Galaxy A Series (شائعة جداً) ==========
  {
    id: 'samsung-a54',
    brand: 'samsung',
    name: 'Samsung Galaxy A54 5G',
    nameAr: 'سامسونج جالكسي A54',
    type: 'phone',
    os: 'android',
    releaseYear: 2023,
    specs: {
      screenSize: 6.4,
      screenWidth: 1080,
      screenHeight: 2340,
      ppi: 403,
      refreshRate: 120,
      touchSamplingRate: 240,
      maxFPS: 60,
      gyroscopeQuality: 7,
      processorTier: 'mid'
    },
    popularityRank: 3
  },
  {
    id: 'samsung-a34',
    brand: 'samsung',
    name: 'Samsung Galaxy A34',
    nameAr: 'سامسونج جالكسي A34',
    type: 'phone',
    os: 'android',
    releaseYear: 2023,
    specs: {
      screenSize: 6.6,
      screenWidth: 1080,
      screenHeight: 2340,
      ppi: 390,
      refreshRate: 120,
      touchSamplingRate: 120,
      maxFPS: 60,
      gyroscopeQuality: 6,
      processorTier: 'mid'
    }
  },
  {
    id: 'samsung-a14',
    brand: 'samsung',
    name: 'Samsung Galaxy A14',
    nameAr: 'سامسونج جالكسي A14',
    type: 'phone',
    os: 'android',
    releaseYear: 2023,
    specs: {
      screenSize: 6.6,
      screenWidth: 1080,
      screenHeight: 2408,
      ppi: 400,
      refreshRate: 90,
      touchSamplingRate: 120,
      maxFPS: 30,
      gyroscopeQuality: 5,
      processorTier: 'low'
    }
  },

  // ========== Galaxy Tab Series ==========
  {
    id: 'samsung-tab-s9-ultra',
    brand: 'samsung',
    name: 'Samsung Galaxy Tab S9 Ultra',
    nameAr: 'سامسونج جالكسي تاب S9 ألترا',
    type: 'tablet',
    os: 'android',
    releaseYear: 2023,
    specs: {
      screenSize: 14.6,
      screenWidth: 1848,
      screenHeight: 2960,
      ppi: 240,
      refreshRate: 120,
      touchSamplingRate: 240,
      maxFPS: 120,
      gyroscopeQuality: 8,
      processorTier: 'flagship'
    }
  },
  {
    id: 'samsung-tab-s9-plus',
    brand: 'samsung',
    name: 'Samsung Galaxy Tab S9+',
    nameAr: 'سامسونج جالكسي تاب S9+',
    type: 'tablet',
    os: 'android',
    releaseYear: 2023,
    specs: {
      screenSize: 12.4,
      screenWidth: 1752,
      screenHeight: 2800,
      ppi: 266,
      refreshRate: 120,
      touchSamplingRate: 240,
      maxFPS: 120,
      gyroscopeQuality: 8,
      processorTier: 'flagship'
    }
  },
  {
    id: 'samsung-tab-s9',
    brand: 'samsung',
    name: 'Samsung Galaxy Tab S9',
    nameAr: 'سامسونج جالكسي تاب S9',
    type: 'tablet',
    os: 'android',
    releaseYear: 2023,
    specs: {
      screenSize: 11.0,
      screenWidth: 1600,
      screenHeight: 2560,
      ppi: 274,
      refreshRate: 120,
      touchSamplingRate: 240,
      maxFPS: 120,
      gyroscopeQuality: 8,
      processorTier: 'flagship'
    }
  }
];
```

## 4.3 الحساسية الأساسية المرجعية

```typescript
// src/data/base-sensitivity.ts

import { SensitivityCategory } from '../types/sensitivity';

/**
 * الحساسية الأساسية المرجعية
 * تم بناؤها لـ:
 * - جهاز متوسط (شاشة 6.5 إنش)
 * - 60 FPS
 * - 4 أصابع Claw
 * - Full Gyroscope
 * - أسلوب متوازن
 * 
 * جميع الأجهزة الأخرى تُحسب كتعديل على هذه القيم
 */
export const BASE_SENSITIVITY: SensitivityCategory = {
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

/**
 * نطاقات الحساسية المسموح بها
 */
export const SENSITIVITY_RANGES = {
  camera: { min: 1, max: 200 },
  ads: { min: 1, max: 200 },
  gyroscope: { min: 1, max: 400 },
  adsGyroscope: { min: 1, max: 400 }
};
```

## 4.4 معاملات الضرب (Multipliers)

```typescript
// src/data/constants/multipliers.ts

/**
 * معاملات تعديل الحساسية بناءً على مختلف العوامل
 * 
 * القيمة 1.0 = لا تغيير
 * القيمة > 1.0 = زيادة الحساسية
 * القيمة < 1.0 = تقليل الحساسية
 */

// ==========================================
// معاملات حجم الشاشة
// ==========================================
export const SCREEN_SIZE_MULTIPLIERS = {
  // الحساسية العادية (كاميرا + ADS)
  normal: {
    // حجم الشاشة بالإنش: معامل الضرب
    4.7: 1.15,   // شاشة صغيرة جداً - نرفع الحساسية
    5.0: 1.12,
    5.4: 1.08,
    5.5: 1.06,
    5.8: 1.04,
    6.0: 1.02,
    6.1: 1.00,   // الحجم المرجعي
    6.2: 0.99,
    6.4: 0.97,
    6.5: 0.96,   // متوسط
    6.7: 0.94,
    6.8: 0.92,
    7.0: 0.90,
    // تابلت
    8.3: 0.82,
    10.2: 0.72,
    10.9: 0.68,
    11.0: 0.67,
    12.4: 0.60,
    12.9: 0.55,
    14.6: 0.48
  },
  // معاملات الجايروسكوب (تتأثر بحجم الشاشة بشكل مختلف)
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
    7.0: 0.94,
    8.3: 0.90,
    10.2: 0.85,
    10.9: 0.82,
    11.0: 0.81,
    12.4: 0.75,
    12.9: 0.70,
    14.6: 0.62
  }
};

// ==========================================
// معاملات الفريمات (FPS)
// ==========================================
export const FPS_MULTIPLIERS = {
  normal: {
    30: 0.92,   // فريمات منخفضة - نقلل قليلاً للتعويض
    60: 1.00,   // المرجع
    90: 1.04,   // استجابة أعلى
    120: 1.08   // أعلى استجابة
  },
  gyroscope: {
    30: 0.85,   // الجايرو يتأثر أكثر بالفريمات
    60: 1.00,
    90: 1.08,
    120: 1.15
  }
};

// ==========================================
// معاملات جودة الجايروسكوب
// ==========================================
export const GYROSCOPE_QUALITY_MULTIPLIERS = {
  // تقييم 1-10: معامل الضرب
  1: 0.70,   // جايرو سيء جداً
  2: 0.75,
  3: 0.80,
  4: 0.85,
  5: 0.90,
  6: 0.94,
  7: 0.97,
  8: 1.00,   // جيد (المرجع)
  9: 1.03,
  10: 1.06  // ممتاز
};

// ==========================================
// معاملات عدد الأصابع وطريقة المسك
// ==========================================
export const GRIP_MULTIPLIERS = {
  normal: {
    'thumbs': 0.95,        // إبهامين - يحتاج حساسية أقل (يعتمد على الجايرو)
    'three-finger': 0.98,
    'claw': 1.00,          // المرجع
    'five-claw': 1.02,
    'full-claw': 1.04
  },
  gyroscope: {
    'thumbs': 1.12,        // إبهامين - يحتاج جايرو أعلى للتعويض
    'three-finger': 1.06,
    'claw': 1.00,
    'five-claw': 0.97,
    'full-claw': 0.94
  }
};

// ==========================================
// معاملات نوع الجايروسكوب
// ==========================================
export const GYROSCOPE_MODE_MULTIPLIERS = {
  camera: {
    'off': 1.15,           // بدون جايرو - يحتاج كاميرا أعلى
    'scope-only': 1.05,
    'always-on': 1.00
  },
  ads: {
    'off': 1.12,
    'scope-only': 1.03,
    'always-on': 1.00
  },
  gyroscope: {
    'off': 0,              // الجايرو مغلق = صفر
    'scope-only': 0.85,    // جايرو أقل (يُستخدم فقط في السكوب)
    'always-on': 1.00
  }
};

// ==========================================
// معاملات أسلوب اللعب
// ==========================================
export const PLAYSTYLE_MULTIPLIERS = {
  camera: {
    'aggressive': 1.08,    // يحتاج دوران سريع
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

// ==========================================
// معاملات مستوى المهارة
// ==========================================
export const SKILL_LEVEL_MULTIPLIERS = {
  'beginner': 0.90,      // حساسية أقل للمبتدئين
  'intermediate': 0.96,
  'advanced': 1.00,
  'pro': 1.05
};

// ==========================================
// معاملات FOV
// ==========================================
export const FOV_MULTIPLIERS = {
  // FOV: معامل الضرب
  80: 1.04,
  82: 1.03,
  84: 1.02,
  86: 1.01,
  88: 1.00,
  90: 0.98  // FOV عالي = أهداف أصغر = حساسية أقل للدقة
};

// ==========================================
// دالة مساعدة للحصول على أقرب قيمة
// ==========================================
export function getClosestMultiplier(
  value: number, 
  multiplierMap: Record<number, number>
): number {
  const keys = Object.keys(multiplierMap).map(Number).sort((a, b) => a - b);
  
  // إذا كانت القيمة أقل من أصغر مفتاح
  if (value <= keys[0]) return multiplierMap[keys[0]];
  
  // إذا كانت القيمة أكبر من أكبر مفتاح
  if (value >= keys[keys.length - 1]) return multiplierMap[keys[keys.length - 1]];
  
  // البحث عن أقرب قيمتين والتقريب
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
```

---

# 5. الخوارزميات الأساسية

## 5.1 خوارزمية توليد الحساسية الرئيسية

```typescript
// src/utils/sensitivity-calculator.ts

import { Device } from '../types/device';
import { PlayerSettings } from '../types/player';
import { SensitivityCategory, ScopeValues, GeneratedSensitivity } from '../types/sensitivity';
import { BASE_SENSITIVITY, SENSITIVITY_RANGES } from '../data/base-sensitivity';
import {
  SCREEN_SIZE_MULTIPLIERS,
  FPS_MULTIPLIERS,
  GYROSCOPE_QUALITY_MULTIPLIERS,
  GRIP_MULTIPLIERS,
  GYROSCOPE_MODE_MULTIPLIERS,
  PLAYSTYLE_MULTIPLIERS,
  SKILL_LEVEL_MULTIPLIERS,
  FOV_MULTIPLIERS,
  getClosestMultiplier
} from '../data/constants/multipliers';

/**
 * الخوارزمية الرئيسية لحساب الحساسية
 */
export function calculateSensitivity(
  device: Device,
  settings: PlayerSettings
): SensitivityCategory {
  
  // 1. حساب جميع المعاملات
  const screenMultiplierNormal = getClosestMultiplier(
    device.specs.screenSize, 
    SCREEN_SIZE_MULTIPLIERS.normal
  );
  const screenMultiplierGyro = getClosestMultiplier(
    device.specs.screenSize, 
    SCREEN_SIZE_MULTIPLIERS.gyroscope
  );
  
  const fpsMultiplierNormal = FPS_MULTIPLIERS.normal[settings.preferredFPS] || 1.0;
  const fpsMultiplierGyro = FPS_MULTIPLIERS.gyroscope[settings.preferredFPS] || 1.0;
  
  const gyroQualityMultiplier = GYROSCOPE_QUALITY_MULTIPLIERS[device.specs.gyroscopeQuality] || 1.0;
  
  const gripMultiplierNormal = GRIP_MULTIPLIERS.normal[settings.gripStyle] || 1.0;
  const gripMultiplierGyro = GRIP_MULTIPLIERS.gyroscope[settings.gripStyle] || 1.0;
  
  const gyroModeMultiplierCamera = GYROSCOPE_MODE_MULTIPLIERS.camera[settings.gyroscopeMode];
  const gyroModeMultiplierAds = GYROSCOPE_MODE_MULTIPLIERS.ads[settings.gyroscopeMode];
  const gyroModeMultiplierGyro = GYROSCOPE_MODE_MULTIPLIERS.gyroscope[settings.gyroscopeMode];
  
  const playstyleMultipliers = PLAYSTYLE_MULTIPLIERS;
  const skillMultiplier = SKILL_LEVEL_MULTIPLIERS[settings.skillLevel] || 1.0;
  const fovMultiplier = getClosestMultiplier(settings.fov, FOV_MULTIPLIERS);

  // 2. حساب كل نوع من أنواع الحساسية
  const camera = calculateCategoryValues(
    BASE_SENSITIVITY.camera,
    screenMultiplierNormal,
    fpsMultiplierNormal,
    1.0, // جودة الجايرو لا تؤثر على الكاميرا
    gripMultiplierNormal,
    gyroModeMultiplierCamera,
    playstyleMultipliers.camera[settings.playStyle],
    skillMultiplier,
    fovMultiplier,
    'camera'
  );

  const ads = calculateCategoryValues(
    BASE_SENSITIVITY.ads,
    screenMultiplierNormal,
    fpsMultiplierNormal,
    1.0,
    gripMultiplierNormal,
    gyroModeMultiplierAds,
    playstyleMultipliers.ads[settings.playStyle],
    skillMultiplier,
    fovMultiplier,
    'ads'
  );

  const gyroscope = calculateCategoryValues(
    BASE_SENSITIVITY.gyroscope,
    screenMultiplierGyro,
    fpsMultiplierGyro,
    gyroQualityMultiplier,
    gripMultiplierGyro,
    gyroModeMultiplierGyro,
    playstyleMultipliers.gyroscope[settings.playStyle],
    skillMultiplier,
    1.0, // FOV لا يؤثر كثيراً على الجايرو
    'gyroscope'
  );

  const adsGyroscope = calculateCategoryValues(
    BASE_SENSITIVITY.adsGyroscope,
    screenMultiplierGyro,
    fpsMultiplierGyro,
    gyroQualityMultiplier,
    gripMultiplierGyro,
    gyroModeMultiplierGyro,
    playstyleMultipliers.adsGyroscope[settings.playStyle],
    skillMultiplier,
    1.0,
    'adsGyroscope'
  );

  return { camera, ads, gyroscope, adsGyroscope };
}

/**
 * حساب قيم فئة واحدة من الحساسية
 */
function calculateCategoryValues(
  base: ScopeValues & { aimTPP: number; aimFPP: number },
  screenMult: number,
  fpsMult: number,
  gyroQualityMult: number,
  gripMult: number,
  gyroModeMult: number,
  playstyleMult: number,
  skillMult: number,
  fovMult: number,
  category: 'camera' | 'ads' | 'gyroscope' | 'adsGyroscope'
): ScopeValues & { aimTPP: number; aimFPP: number } {
  
  const range = SENSITIVITY_RANGES[category];
  
  const calculateValue = (baseValue: number): number => {
    let value = baseValue;
    value *= screenMult;
    value *= fpsMult;
    value *= gyroQualityMult;
    value *= gripMult;
    value *= gyroModeMult;
    value *= playstyleMult;
    value *= skillMult;
    value *= fovMult;
    
    // التقريب والحد ضمن النطاق
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
 * حساب حجم زر الحركة المناسب
 */
export function calculateMovementButtonSize(
  screenSize: number,
  fingerCount: number
): number {
  // شاشة أكبر = زر أصغر نسبياً
  // أصابع أكثر = زر أكبر (لسهولة الوصول)
  
  let baseSize = 100;
  
  // تعديل حسب حجم الشاشة
  if (screenSize < 5.5) baseSize = 130;
  else if (screenSize < 6.0) baseSize = 120;
  else if (screenSize < 6.5) baseSize = 110;
  else if (screenSize < 7.0) baseSize = 100;
  else if (screenSize < 10) baseSize = 90;
  else baseSize = 75; // تابلت
  
  // تعديل حسب عدد الأصابع
  if (fingerCount >= 5) baseSize += 20;
  else if (fingerCount >= 4) baseSize += 10;
  
  return Math.min(200, Math.max(50, baseSize));
}

/**
 * توليد شرح للحساسية
 */
export function generateExplanation(
  device: Device,
  settings: PlayerSettings
): { factor: string; factorAr: string; impact: string; impactAr: string; adjustment: number }[] {
  const explanations = [];

  // شرح حجم الشاشة
  const screenMult = getClosestMultiplier(device.specs.screenSize, SCREEN_SIZE_MULTIPLIERS.normal);
  if (screenMult !== 1.0) {
    explanations.push({
      factor: 'Screen Size',
      factorAr: 'حجم الشاشة',
      impact: screenMult > 1 ? 'Increased (smaller screen)' : 'Decreased (larger screen)',
      impactAr: screenMult > 1 ? 'زيادة (شاشة صغيرة)' : 'تقليل (شاشة كبيرة)',
      adjustment: Math.round((screenMult - 1) * 100)
    });
  }

  // شرح الفريمات
  const fpsMult = FPS_MULTIPLIERS.normal[settings.preferredFPS];
  if (fpsMult !== 1.0) {
    explanations.push({
      factor: 'Frame Rate',
      factorAr: 'معدل الإطارات',
      impact: fpsMult > 1 ? 'Increased (higher FPS = faster response)' : 'Decreased (lower FPS)',
      impactAr: fpsMult > 1 ? 'زيادة (فريمات أعلى = استجابة أسرع)' : 'تقليل (فريمات أقل)',
      adjustment: Math.round((fpsMult - 1) * 100)
    });
  }

  // شرح جودة الجايروسكوب
  const gyroQualityMult = GYROSCOPE_QUALITY_MULTIPLIERS[device.specs.gyroscopeQuality];
  if (gyroQualityMult !== 1.0 && settings.gyroscopeMode !== 'off') {
    explanations.push({
      factor: 'Gyroscope Quality',
      factorAr: 'جودة الجايروسكوب',
      impact: gyroQualityMult > 1 ? 'Increased (excellent gyro)' : 'Decreased (compensating for gyro)',
      impactAr: gyroQualityMult > 1 ? 'زيادة (جايرو ممتاز)' : 'تقليل (تعويض جودة الجايرو)',
      adjustment: Math.round((gyroQualityMult - 1) * 100)
    });
  }

  // شرح طريقة المسك
  const gripMult = GRIP_MULTIPLIERS.normal[settings.gripStyle];
  if (gripMult !== 1.0) {
    explanations.push({
      factor: 'Grip Style',
      factorAr: 'طريقة المسك',
      impact: `Adjusted for ${settings.fingerCount} fingers ${settings.gripStyle}`,
      impactAr: `معدّل لـ ${settings.fingerCount} أصابع`,
      adjustment: Math.round((gripMult - 1) * 100)
    });
  }

  // شرح أسلوب اللعب
  const playstyleMult = PLAYSTYLE_MULTIPLIERS.camera[settings.playStyle];
  if (playstyleMult !== 1.0) {
    explanations.push({
      factor: 'Playstyle',
      factorAr: 'أسلوب اللعب',
      impact: settings.playStyle === 'aggressive' ? 'Increased for fast rotations' : 'Decreased for precision',
      impactAr: settings.playStyle === 'aggressive' ? 'زيادة للدوران السريع' : 'تقليل للدقة',
      adjustment: Math.round((playstyleMult - 1) * 100)
    });
  }

  return explanations;
}
```

## 5.2 خوارزمية حساسية الأسلحة

```typescript
// src/utils/weapon-sensitivity.ts

import { Weapon, WeaponSensitivityAdjustment } from '../types/weapon';
import { SensitivityCategory, ScopeValues } from '../types/sensitivity';

/**
 * حساب حساسية سلاح معين بناءً على الحساسية الأساسية
 */
export function calculateWeaponSensitivity(
  baseSensitivity: SensitivityCategory,
  weapon: Weapon
): WeaponSensitivityAdjustment {
  
  // معامل ADS يعتمد على صعوبة الارتداد
  let adsMultiplier = 1.0;
  let gyroMultiplier = 1.0;
  
  // تعديل حسب الارتداد العمودي
  if (weapon.recoil.vertical >= 8) {
    adsMultiplier *= 0.92;  // ارتداد عالي = حساسية أقل
    gyroMultiplier *= 0.95;
  } else if (weapon.recoil.vertical >= 6) {
    adsMultiplier *= 0.96;
    gyroMultiplier *= 0.98;
  } else if (weapon.recoil.vertical <= 3) {
    adsMultiplier *= 1.04;  // ارتداد منخفض = يمكن رفع الحساسية
    gyroMultiplier *= 1.02;
  }
  
  // تعديل حسب الارتداد الأفقي
  if (weapon.recoil.horizontal >= 6) {
    adsMultiplier *= 0.95;
    gyroMultiplier *= 0.97;
  }
  
  // تعديل حسب معدل النار
  if (weapon.fireRate >= 800) {
    // معدل نار عالي جداً (مثل MG3)
    adsMultiplier *= 0.94;
    gyroMultiplier *= 0.92;
  } else if (weapon.fireRate >= 700) {
    adsMultiplier *= 0.97;
    gyroMultiplier *= 0.96;
  }
  
  // تعديل حسب نوع السلاح
  switch (weapon.category) {
    case 'sniper':
      adsMultiplier *= 0.85;  // القناصات تحتاج حساسية أقل للدقة
      gyroMultiplier *= 0.88;
      break;
    case 'dmr':
      adsMultiplier *= 0.90;
      gyroMultiplier *= 0.92;
      break;
    case 'shotgun':
      adsMultiplier *= 1.08;  // الشوتقن يحتاج حساسية عالية للسرعة
      gyroMultiplier *= 1.05;
      break;
    case 'smg':
      adsMultiplier *= 1.03;
      gyroMultiplier *= 1.02;
      break;
  }

  return {
    weapon,
    adsMultiplier: Math.round(adsMultiplier * 100) / 100,
    gyroMultiplier: Math.round(gyroMultiplier * 100) / 100,
    recommendedScopes: weapon.bestScopes,
    tips: generateWeaponTips(weapon)
  };
}

/**
 * توليد نصائح للسلاح
 */
function generateWeaponTips(weapon: Weapon): { en: string; ar: string } {
  const tips: { en: string; ar: string }[] = [];
  
  if (weapon.recoil.vertical >= 8) {
    tips.push({
      en: 'High vertical recoil - pull down firmly while spraying',
      ar: 'ارتداد عمودي عالي - اسحب للأسفل بقوة أثناء الرش'
    });
  }
  
  if (weapon.recoil.pattern === 'left') {
    tips.push({
      en: 'Recoil pulls left - compensate by pulling right',
      ar: 'الارتداد يميل لليسار - عوّض بالسحب لليمين'
    });
  } else if (weapon.recoil.pattern === 'right') {
    tips.push({
      en: 'Recoil pulls right - compensate by pulling left',
      ar: 'الارتداد يميل لليمين - عوّض بالسحب لليسار'
    });
  }
  
  if (weapon.category === 'sniper') {
    tips.push({
      en: 'Pre-aim head level for quick headshots',
      ar: 'صوّب على مستوى الرأس مسبقاً للهيدشوت السريع'
    });
  }
  
  // إرجاع أول نصيحة أو نصيحة افتراضية
  return tips[0] || {
    en: 'Practice spray control in training mode',
    ar: 'تدرب على التحكم بالرش في وضع التدريب'
  };
}

/**
 * حساب حساسية جميع الأسلحة
 */
export function calculateAllWeaponSensitivities(
  baseSensitivity: SensitivityCategory,
  weapons: Weapon[]
): WeaponSensitivityAdjustment[] {
  return weapons.map(weapon => calculateWeaponSensitivity(baseSensitivity, weapon));
}
```

---

# 6. واجهة المستخدم UI/UX

## 6.1 تدفق المستخدم (User Flow)

```
┌─────────────────────────────────────────────────────────────────┐
│                        الصفحة الرئيسية                          │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │          🎮 PUBG Sensitivity Generator                  │   │
│   │          مولّد الحساسية الاحترافية                       │   │
│   │                                                         │   │
│   │   احصل على حساسية مخصصة لجهازك وأسلوب لعبك             │   │
│   │                                                         │   │
│   │              [ ابدأ الآن | Start Now ]                  │   │
│   └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  الخطوة 1/5: اختر جهازك                                        │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │  Apple  │ │ Samsung │ │ Xiaomi  │ │  أخرى  │               │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
│                                                                 │
│  🔍 [ابحث عن جهازك...]                                         │
│                                                                 │
│  الأجهزة الشائعة:                                               │
│  ┌──────────────────┐ ┌──────────────────┐                     │
│  │ iPhone 15 Pro Max│ │ Samsung S24 Ultra│                     │
│  │ ⭐ الأكثر شعبية  │ │ ⭐ الأكثر شعبية  │                     │
│  └──────────────────┘ └──────────────────┘                     │
│                                                                 │
│                              [ التالي ← ]                       │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  الخطوة 2/5: الفريمات والجرافيكس                                │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│  📱 iPhone 15 Pro Max                                           │
│  يدعم حتى: 120 FPS                                              │
│                                                                 │
│  اختر الفريمات التي تلعب عليها:                                 │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                   │
│  │   30   │ │   60   │ │   90   │ │  120 ✓ │                   │
│  │  Smooth│ │  High  │ │ Ultra  │ │Extreme │                   │
│  └────────┘ └────────┘ └────────┘ └────────┘                   │
│                                                                 │
│  💡 نصيحة: الفريمات الأعلى = استجابة أسرع = حساسية مختلفة       │
│                                                                 │
│                    [ → السابق ]  [ التالي ← ]                   │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  الخطوة 3/5: طريقة اللعب                                       │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│  كم إصبع تستخدم؟                                                │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                            │
│  │ 2  │ │ 3  │ │ 4 ✓│ │ 5  │ │ 6  │                            │
│  └────┘ └────┘ └────┘ └────┘ └────┘                            │
│                                                                 │
│  طريقة المسك:                                                   │
│  ┌────────────────┐ ┌────────────────┐                         │
│  │    إبهامين    │ │   مخلب (Claw)✓ │                         │
│  │    Thumbs     │ │     4 Finger   │                         │
│  └────────────────┘ └────────────────┘                         │
│                                                                 │
│  [صورة توضيحية لطريقة المسك]                                   │
│                                                                 │
│                    [ → السابق ]  [ التالي ← ]                   │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  الخطوة 4/5: الجايروسكوب                                       │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│  هل تستخدم الجايروسكوب؟                                         │
│                                                                 │
│  ┌──────────────────┐                                          │
│  │      مغلق       │  لا أستخدم الجايروسكوب                    │
│  │       OFF       │                                           │
│  └──────────────────┘                                          │
│  ┌──────────────────┐                                          │
│  │   عند السكوب    │  فقط عند التصويب بالسكوب                  │
│  │   Scope Only    │                                           │
│  └──────────────────┘                                          │
│  ┌──────────────────┐                                          │
│  │   دائماً مفعّل ✓ │  الجايرو يعمل طوال الوقت                 │
│  │   Always On     │  ⭐ الأفضل للمحترفين                      │
│  └──────────────────┘                                          │
│                                                                 │
│                    [ → السابق ]  [ التالي ← ]                   │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  الخطوة 5/5: أسلوب اللعب                                       │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│  ما هو أسلوبك في اللعب؟                                         │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  🔥 هجومي (Aggressive)                                 │    │
│  │  أحب الاندفاع والقتال القريب، سرعة الدوران مهمة        │    │
│  └────────────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  ⚖️ متوازن (Balanced) ✓                               │    │
│  │  أجمع بين الهجوم والدفاع حسب الموقف                   │    │
│  └────────────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  🎯 قناص (Sniper/Passive)                              │    │
│  │  أفضل القتال من بعيد، الدقة أهم من السرعة             │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│                    [ → السابق ]  [ توليد الحساسية 🎮 ]          │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  ⚡ جاري توليد حساسيتك المخصصة...                               │
│                                                                 │
│  ████████████████████████░░░░░░░░ 65%                          │
│                                                                 │
│  ✓ تحليل مواصفات iPhone 15 Pro Max                             │
│  ✓ حساب معامل الشاشة (6.7 بوصة)                                │
│  ✓ ضبط للـ 120 FPS                                             │
│  ⟳ حساب معاملات 4 أصابع Claw...                                │
│  ○ تحسين الجايروسكوب                                           │
│  ○ توليد حساسية الأسلحة                                        │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  🎉 حساسيتك جاهزة!                                              │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│  📱 iPhone 15 Pro Max | 120 FPS | 4 Fingers Claw | Full Gyro   │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │   الكاميرا  │ │  التصويب   │ │  الجايرو   │ │ جايرو ADS │ │
│  │   Camera    │ │    ADS     │ │    Gyro    │ │  ADS Gyro │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
│       [Tab selected shows detailed values below]               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ السكوب          │ القيمة    │ السبب                    │   │
│  │─────────────────│───────────│──────────────────────────│   │
│  │ بدون سكوب       │   108     │ شاشة كبيرة (-4%)        │   │
│  │ Red Dot         │    72     │ 120FPS (+5%)            │   │
│  │ 2x              │    41     │                          │   │
│  │ 3x              │    29     │                          │   │
│  │ 4x              │    21     │                          │   │
│  │ 6x              │    15     │                          │   │
│  │ 8x              │    11     │                          │   │
│  │─────────────────│───────────│──────────────────────────│   │
│  │ Aim TPP         │    82     │                          │   │
│  │ Aim FPP         │    80     │                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │ 📋 نسخ   │ │ 📤 مشاركة│ │ 💾 حفظ  │ │ ⚙️ تعديل يدوي   │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘   │
│                                                                 │
│  ═══════════════════════════════════════════════════════════    │
│  📊 حساسية الأسلحة (اضغط للتوسيع)                              │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│  [ 🔄 بدء من جديد ]                                            │
└─────────────────────────────────────────────────────────────────┘
```

## 6.2 نظام الألوان والتصميم

```typescript
// src/styles/design-system.ts

export const DESIGN_SYSTEM = {
  colors: {
    // الألوان الأساسية
    primary: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',   // اللون الرئيسي - ذهبي/برتقالي
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f'
    },
    // ألوان الخلفية (الثيم الداكن)
    background: {
      primary: '#0a0a0f',     // خلفية رئيسية
      secondary: '#0d1117',   // خلفية ثانوية
      tertiary: '#161b22',    // خلفية ثالثية
      elevated: '#1c2128',    // عناصر مرتفعة
      overlay: 'rgba(0,0,0,0.8)'
    },
    // ألوان النص
    text: {
      primary: '#ffffff',
      secondary: '#8b949e',
      tertiary: '#6e7681',
      inverse: '#0a0a0f'
    },
    // ألوان الحدود
    border: {
      default: 'rgba(255,255,255,0.1)',
      subtle: 'rgba(255,255,255,0.05)',
      strong: 'rgba(255,255,255,0.2)'
    },
    // ألوان الحالة
    status: {
      success: '#22c55e',
      warning: '#eab308',
      error: '#ef4444',
      info: '#3b82f6'
    },
    // ألوان الفئات (للحساسيات)
    categories: {
      camera: '#f59e0b',      // برتقالي/ذهبي
      ads: '#3b82f6',         // أزرق
      gyroscope: '#22c55e',   // أخضر
      adsGyroscope: '#ef4444' // أحمر
    },
    // ألوان العلامات التجارية
    brands: {
      apple: '#555555',
      samsung: '#1428a0',
      xiaomi: '#ff6900',
      oneplus: '#eb0028'
    }
  },
  
  // التباعد
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem'    // 64px
  },
  
  // الزوايا المستديرة
  borderRadius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px'
  },
  
  // الظلال
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.3)',
    md: '0 4px 6px rgba(0,0,0,0.4)',
    lg: '0 10px 15px rgba(0,0,0,0.5)',
    glow: {
      primary: '0 0 20px rgba(245, 158, 11, 0.3)',
      success: '0 0 20px rgba(34, 197, 94, 0.3)'
    }
  },
  
  // الخطوط
  typography: {
    fontFamily: {
      ar: '"IBM Plex Sans Arabic", "Noto Sans Arabic", sans-serif',
      en: '"Inter", "SF Pro Display", sans-serif'
    },
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '2rem',    // 32px
      '4xl': '2.5rem',  // 40px
      '5xl': '3rem'     // 48px
    }
  },
  
  // الحركات
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)'
    }
  }
};
```

---

# 7. نظام الترجمة

## 7.1 هيكل ملفات الترجمة

```typescript
// src/i18n/index.ts

export type Language = 'ar' | 'en';

export interface Translations {
  // عام
  common: {
    appName: string;
    tagline: string;
    startButton: string;
    nextButton: string;
    prevButton: string;
    generateButton: string;
    copyButton: string;
    copiedButton: string;
    shareButton: string;
    saveButton: string;
    resetButton: string;
    loading: string;
  };
  
  // الخطوات
  steps: {
    step1Title: string;
    step1Subtitle: string;
    step2Title: string;
    step2Subtitle: string;
    step3Title: string;
    step3Subtitle: string;
    step4Title: string;
    step4Subtitle: string;
    step5Title: string;
    step5Subtitle: string;
  };
  
  // الأجهزة
  devices: {
    searchPlaceholder: string;
    popularDevices: string;
    allDevices: string;
    phone: string;
    tablet: string;
    supportedFPS: string;
    screenSize: string;
    gyroQuality: string;
  };
  
  // الفريمات
  fps: {
    title: string;
    subtitle: string;
    yourDevice: string;
    supportsUpTo: string;
    tip: string;
  };
  
  // الأصابع
  fingers: {
    title: string;
    fingerCount: string;
    gripStyle: string;
    thumbs: string;
    threeFinger: string;
    claw: string;
    fiveClaw: string;
    fullClaw: string;
  };
  
  // الجايروسكوب
  gyroscope: {
    title: string;
    off: string;
    offDesc: string;
    scopeOnly: string;
    scopeOnlyDesc: string;
    alwaysOn: string;
    alwaysOnDesc: string;
    recommended: string;
  };
  
  // أسلوب اللعب
  playstyle: {
    title: string;
    aggressive: string;
    aggressiveDesc: string;
    balanced: string;
    balancedDesc: string;
    passive: string;
    passiveDesc: string;
  };
  
  // النتائج
  results: {
    title: string;
    subtitle: string;
    camera: string;
    ads: string;
    gyroscope: string;
    adsGyroscope: string;
    scope: string;
    value: string;
    reason: string;
    noScope: string;
    redDot: string;
    x2: string;
    x3: string;
    x4: string;
    x6: string;
    x8: string;
    aimTPP: string;
    aimFPP: string;
    weaponSensitivity: string;
    additionalSettings: string;
    movementButtonSize: string;
    explanation: string;
  };
  
  // التفسيرات
  explanations: {
    screenSize: string;
    frameRate: string;
    gyroQuality: string;
    gripStyle: string;
    playstyle: string;
    increased: string;
    decreased: string;
    noChange: string;
  };
  
  // الأسلحة
  weapons: {
    assaultRifles: string;
    smgs: string;
    snipers: string;
    dmrs: string;
    shotguns: string;
    lmgs: string;
  };
}
```

## 7.2 الترجمة العربية

```typescript
// src/i18n/ar.ts

import { Translations } from './index';

export const ar: Translations = {
  common: {
    appName: 'مولّد حساسية PUBG',
    tagline: 'احصل على حساسية احترافية مخصصة لجهازك',
    startButton: 'ابدأ الآن',
    nextButton: 'التالي',
    prevButton: 'السابق',
    generateButton: 'توليد الحساسية',
    copyButton: 'نسخ',
    copiedButton: 'تم النسخ!',
    shareButton: 'مشاركة',
    saveButton: 'حفظ',
    resetButton: 'بدء من جديد',
    loading: 'جاري التحميل...'
  },
  
  steps: {
    step1Title: 'اختر جهازك',
    step1Subtitle: 'ابحث عن جهازك أو اختره من القائمة',
    step2Title: 'الفريمات',
    step2Subtitle: 'اختر معدل الإطارات الذي تلعب عليه',
    step3Title: 'طريقة اللعب',
    step3Subtitle: 'كم إصبع تستخدم وما طريقة مسكك للجهاز؟',
    step4Title: 'الجايروسكوب',
    step4Subtitle: 'هل تستخدم الجايروسكوب؟',
    step5Title: 'أسلوب اللعب',
    step5Subtitle: 'ما هو أسلوبك المفضل في اللعب؟'
  },
  
  devices: {
    searchPlaceholder: 'ابحث عن جهازك...',
    popularDevices: 'الأجهزة الشائعة',
    allDevices: 'جميع الأجهزة',
    phone: 'هاتف',
    tablet: 'تابلت',
    supportedFPS: 'الفريمات المدعومة',
    screenSize: 'حجم الشاشة',
    gyroQuality: 'جودة الجايرو'
  },
  
  fps: {
    title: 'معدل الإطارات (FPS)',
    subtitle: 'اختر الفريمات التي تلعب عليها فعلياً',
    yourDevice: 'جهازك',
    supportsUpTo: 'يدعم حتى',
    tip: '💡 الفريمات الأعلى تعني استجابة أسرع وحساسية مختلفة'
  },
  
  fingers: {
    title: 'عدد الأصابع وطريقة المسك',
    fingerCount: 'كم إصبع تستخدم؟',
    gripStyle: 'طريقة المسك',
    thumbs: 'إبهامين فقط',
    threeFinger: '3 أصابع',
    claw: 'مخلب (4 أصابع)',
    fiveClaw: '5 أصابع',
    fullClaw: 'مخلب كامل (6 أصابع)'
  },
  
  gyroscope: {
    title: 'إعدادات الجايروسكوب',
    off: 'مغلق',
    offDesc: 'لا أستخدم الجايروسكوب',
    scopeOnly: 'عند التصويب فقط',
    scopeOnlyDesc: 'يعمل فقط عند فتح السكوب',
    alwaysOn: 'دائماً مفعّل',
    alwaysOnDesc: 'الجايرو يعمل طوال الوقت',
    recommended: '⭐ الأفضل للمحترفين'
  },
  
  playstyle: {
    title: 'أسلوب اللعب',
    aggressive: 'هجومي',
    aggressiveDesc: 'أحب الاندفاع والقتال القريب، سرعة الدوران مهمة لي',
    balanced: 'متوازن',
    balancedDesc: 'أجمع بين الهجوم والدفاع حسب الموقف',
    passive: 'قناص / دفاعي',
    passiveDesc: 'أفضل القتال من بعيد، الدقة أهم من السرعة'
  },
  
  results: {
    title: 'حساسيتك جاهزة!',
    subtitle: 'مخصصة لجهازك وأسلوب لعبك',
    camera: 'حساسية الكاميرا',
    ads: 'حساسية التصويب',
    gyroscope: 'حساسية الجايرو',
    adsGyroscope: 'جايرو التصويب',
    scope: 'السكوب',
    value: 'القيمة',
    reason: 'السبب',
    noScope: 'بدون سكوب',
    redDot: 'ريد دوت / هولو',
    x2: '2x',
    x3: '3x',
    x4: '4x',
    x6: '6x',
    x8: '8x',
    aimTPP: 'Aim TPP',
    aimFPP: 'Aim FPP',
    weaponSensitivity: 'حساسية الأسلحة',
    additionalSettings: 'إعدادات إضافية',
    movementButtonSize: 'حجم زر الحركة',
    explanation: 'لماذا هذه القيم؟'
  },
  
  explanations: {
    screenSize: 'حجم الشاشة',
    frameRate: 'معدل الإطارات',
    gyroQuality: 'جودة الجايروسكوب',
    gripStyle: 'طريقة المسك',
    playstyle: 'أسلوب اللعب',
    increased: 'زيادة',
    decreased: 'تقليل',
    noChange: 'بدون تغيير'
  },
  
  weapons: {
    assaultRifles: 'بنادق هجومية',
    smgs: 'رشاشات خفيفة',
    snipers: 'قناصات',
    dmrs: 'بنادق DMR',
    shotguns: 'شوتقن',
    lmgs: 'رشاشات ثقيلة'
  }
};
```

## 7.3 الترجمة الإنجليزية

```typescript
// src/i18n/en.ts

import { Translations } from './index';

export const en: Translations = {
  common: {
    appName: 'PUBG Sensitivity Generator',
    tagline: 'Get a pro sensitivity customized for your device',
    startButton: 'Start Now',
    nextButton: 'Next',
    prevButton: 'Back',
    generateButton: 'Generate Sensitivity',
    copyButton: 'Copy',
    copiedButton: 'Copied!',
    shareButton: 'Share',
    saveButton: 'Save',
    resetButton: 'Start Over',
    loading: 'Loading...'
  },
  
  steps: {
    step1Title: 'Select Your Device',
    step1Subtitle: 'Search for your device or pick from the list',
    step2Title: 'Frame Rate',
    step2Subtitle: 'Choose the FPS you actually play on',
    step3Title: 'Play Style',
    step3Subtitle: 'How many fingers do you use and what\'s your grip?',
    step4Title: 'Gyroscope',
    step4Subtitle: 'Do you use gyroscope?',
    step5Title: 'Playstyle',
    step5Subtitle: 'What\'s your preferred playstyle?'
  },
  
  devices: {
    searchPlaceholder: 'Search for your device...',
    popularDevices: 'Popular Devices',
    allDevices: 'All Devices',
    phone: 'Phone',
    tablet: 'Tablet',
    supportedFPS: 'Supported FPS',
    screenSize: 'Screen Size',
    gyroQuality: 'Gyro Quality'
  },
  
  fps: {
    title: 'Frame Rate (FPS)',
    subtitle: 'Select the FPS you actually play on',
    yourDevice: 'Your device',
    supportsUpTo: 'supports up to',
    tip: '💡 Higher FPS means faster response and different sensitivity'
  },
  
  fingers: {
    title: 'Fingers & Grip Style',
    fingerCount: 'How many fingers do you use?',
    gripStyle: 'Grip Style',
    thumbs: 'Thumbs Only',
    threeFinger: '3 Fingers',
    claw: 'Claw (4 Fingers)',
    fiveClaw: '5 Fingers',
    fullClaw: 'Full Claw (6 Fingers)'
  },
  
  gyroscope: {
    title: 'Gyroscope Settings',
    off: 'Off',
    offDesc: 'I don\'t use gyroscope',
    scopeOnly: 'Scope Only',
    scopeOnlyDesc: 'Only active when aiming down sights',
    alwaysOn: 'Always On',
    alwaysOnDesc: 'Gyro is active all the time',
    recommended: '⭐ Recommended for pros'
  },
  
  playstyle: {
    title: 'Playstyle',
    aggressive: 'Aggressive',
    aggressiveDesc: 'I love rushing and close combat, fast rotation is key',
    balanced: 'Balanced',
    balancedDesc: 'I adapt between aggressive and passive based on situation',
    passive: 'Sniper / Passive',
    passiveDesc: 'I prefer long-range fights, precision over speed'
  },
  
  results: {
    title: 'Your Sensitivity is Ready!',
    subtitle: 'Customized for your device and playstyle',
    camera: 'Camera Sensitivity',
    ads: 'ADS Sensitivity',
    gyroscope: 'Gyroscope Sensitivity',
    adsGyroscope: 'ADS Gyroscope',
    scope: 'Scope',
    value: 'Value',
    reason: 'Reason',
    noScope: 'No Scope',
    redDot: 'Red Dot / Holo',
    x2: '2x',
    x3: '3x',
    x4: '4x',
    x6: '6x',
    x8: '8x',
    aimTPP: 'Aim TPP',
    aimFPP: 'Aim FPP',
    weaponSensitivity: 'Weapon Sensitivity',
    additionalSettings: 'Additional Settings',
    movementButtonSize: 'Movement Button Size',
    explanation: 'Why these values?'
  },
  
  explanations: {
    screenSize: 'Screen Size',
    frameRate: 'Frame Rate',
    gyroQuality: 'Gyroscope Quality',
    gripStyle: 'Grip Style',
    playstyle: 'Playstyle',
    increased: 'Increased',
    decreased: 'Decreased',
    noChange: 'No change'
  },
  
  weapons: {
    assaultRifles: 'Assault Rifles',
    smgs: 'SMGs',
    snipers: 'Snipers',
    dmrs: 'DMRs',
    shotguns: 'Shotguns',
    lmgs: 'LMGs'
  }
};
```

---

# 8. مراحل التطوير

## 8.1 نظرة عامة على المراحل

```
┌─────────────────────────────────────────────────────────────────┐
│                     خارطة طريق التطوير                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  المرحلة 1: الأساسيات (MVP)                    ⏱️ 2-3 أيام      │
│  ─────────────────────────────                                  │
│  ✓ إعداد المشروع                                               │
│  ✓ أنواع TypeScript                                            │
│  ✓ قاعدة بيانات الأجهزة (iPhone + iPad + Samsung)             │
│  ✓ الخوارزمية الأساسية                                        │
│  ✓ واجهة المستخدم الأساسية (5 خطوات)                          │
│  ✓ صفحة النتائج                                                │
│  ✓ نسخ الحساسية                                                │
│                                                                 │
│  المرحلة 2: التوسع                              ⏱️ 2-3 أيام      │
│  ──────────────────                                             │
│  □ إضافة المزيد من الأجهزة (Xiaomi, OnePlus, etc.)            │
│  □ الترجمة الكاملة (عربي + إنجليزي)                            │
│  □ حساسية الأسلحة                                              │
│  □ شرح مفصل للقيم                                              │
│  □ تحسين UI/UX                                                 │
│                                                                 │
│  المرحلة 3: الميزات المتقدمة                   ⏱️ 3-4 أيام      │
│  ──────────────────────────                                     │
│  □ حفظ الحساسيات محلياً                                        │
│  □ مشاركة عبر رابط                                             │
│  □ مقارنة مع المحترفين                                         │
│  □ تعديل يدوي للقيم                                            │
│  □ إعدادات متقدمة (FOV, حجم الأزرار)                          │
│                                                                 │
│  المرحلة 4: التحسينات                          ⏱️ 2-3 أيام      │
│  ─────────────────────                                          │
│  □ PWA (تثبيت كتطبيق)                                          │
│  □ تحسين الأداء                                                │
│  □ SEO                                                         │
│  □ Analytics                                                   │
│  □ اختبار المستخدمين                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 8.2 المرحلة 1: الأساسيات (MVP) - التفاصيل

### المهام:

```
1.1 إعداد المشروع
    ├── إنشاء مشروع React + Vite + TypeScript
    ├── تثبيت Tailwind CSS
    ├── تثبيت lucide-react
    ├── إعداد بنية الملفات
    └── إعداد index.html مع العنوان والوصف

1.2 الأنواع (Types)
    ├── تعريف Device type
    ├── تعريف PlayerSettings type
    ├── تعريف Sensitivity types
    └── تعريف Weapon type (أساسي)

1.3 قاعدة البيانات
    ├── بيانات iPhone (15+ جهاز)
    ├── بيانات iPad (10+ جهاز)
    ├── بيانات Samsung (15+ جهاز)
    ├── الحساسية الأساسية
    └── معاملات الضرب

1.4 الخوارزمية
    ├── calculateSensitivity()
    ├── calculateMovementButtonSize()
    └── generateExplanation()

1.5 المكونات
    ├── App.tsx (الهيكل الرئيسي)
    ├── Header.tsx
    ├── StepIndicator.tsx
    ├── Step1DeviceSelect.tsx
    ├── Step2FrameRate.tsx
    ├── Step3Fingers.tsx
    ├── Step4Gyroscope.tsx
    ├── Step5Playstyle.tsx
    ├── ResultsPage.tsx
    ├── SensitivityTable.tsx
    └── CopyButton.tsx

1.6 الوظائف الأساسية
    ├── التنقل بين الخطوات
    ├── اختيار الجهاز (مع بحث)
    ├── توليد الحساسية
    └── نسخ النتائج
```

### معايير الإنجاز:

- [ ] يمكن اختيار جهاز من القائمة
- [ ] يمكن اختيار الفريمات
- [ ] يمكن اختيار عدد الأصابع وطريقة المسك
- [ ] يمكن اختيار نوع الجايروسكوب
- [ ] يمكن اختيار أسلوب اللعب
- [ ] يتم توليد حساسية مخصصة
- [ ] يمكن نسخ الحساسية
- [ ] التصميم يعمل على الجوال

## 8.3 المرحلة 2: التوسع - التفاصيل

### المهام:

```
2.1 المزيد من الأجهزة
    ├── Xiaomi (20+ جهاز)
    ├── OnePlus (10+ جهاز)
    ├── Oppo/Realme (15+ جهاز)
    ├── Poco (10+ جهاز)
    ├── Gaming phones (ROG, Red Magic, Black Shark)
    └── Huawei/Honor (10+ جهاز)

2.2 الترجمة
    ├── إنشاء LanguageContext
    ├── ملف الترجمة العربية
    ├── ملف الترجمة الإنجليزية
    ├── LanguageSwitcher component
    └── RTL support

2.3 حساسية الأسلحة
    ├── بيانات جميع الأسلحة (20+ سلاح)
    ├── خوارزمية حساسية السلاح
    ├── WeaponSensitivityCard component
    └── عرض حساسية الأسلحة في النتائج

2.4 الشرح المفصل
    ├── ExplanationPanel component
    ├── عرض تأثير كل عامل
    └── نصائح مخصصة

2.5 تحسين UI/UX
    ├── Animations و transitions
    ├── Loading states
    ├── Error handling
    └── Mobile-first improvements
```

## 8.4 المرحلة 3: الميزات المتقدمة - التفاصيل

### المهام:

```
3.1 الحفظ المحلي
    ├── useLocalStorage hook
    ├── حفظ الحساسيات المُولّدة
    ├── عرض السجل
    └── حذف الحساسيات المحفوظة

3.2 المشاركة
    ├── توليد رابط مشاركة
    ├── قراءة الحساسية من الرابط
    └── Open Graph meta tags

3.3 مقارنة المحترفين
    ├── بيانات حساسيات اللاعبين المشهورين
    ├── ComparisonPanel component
    └── عرض نسبة التطابق

3.4 التعديل اليدوي
    ├── ManualAdjustment component
    ├── Sliders للقيم
    └── إعادة حساب مع التعديلات

3.5 إعدادات متقدمة
    ├── FOV selector
    ├── أحجام الأزرار
    ├── إعدادات إضافية
    └── SkillLevel selector
```

## 8.5 المرحلة 4: التحسينات - التفاصيل

### المهام:

```
4.1 PWA
    ├── manifest.json
    ├── Service Worker
    ├── Icons
    └── Offline support

4.2 الأداء
    ├── Code splitting
    ├── Lazy loading للأجهزة
    ├── تحسين البحث
    └── Memoization

4.3 SEO
    ├── Meta tags
    ├── Structured data
    ├── sitemap.xml
    └── robots.txt

4.4 Analytics
    ├── تتبع الأحداث
    ├── معدل التحويل
    └── الأجهزة الشائعة
```

---

# 9. معايير الكود

## 9.1 تنظيم الكود

### قواعد التسمية:

```typescript
// الملفات: kebab-case
sensitivity-calculator.ts
device-search.tsx

// المكونات: PascalCase
DeviceCard.tsx
SensitivityTable.tsx

// الدوال والمتغيرات: camelCase
calculateSensitivity()
const deviceList = []

// الثوابت: SCREAMING_SNAKE_CASE
const MAX_SENSITIVITY = 400
const BASE_SENSITIVITY = {}

// الأنواع والواجهات: PascalCase
interface Device {}
type SensitivityCategory = {}

// الـ Props: PascalCase + Props suffix
interface DeviceCardProps {}
```

### هيكل المكون:

```typescript
// src/components/example/ExampleComponent.tsx

import { useState, useEffect } from 'react';
import { SomeIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useLanguage } from '../../hooks/useLanguage';
import type { ExampleType } from '../../types';

interface ExampleComponentProps {
  // Props مرتبة: required أولاً، ثم optional
  data: ExampleType;
  onAction: (id: string) => void;
  className?: string;
  disabled?: boolean;
}

export default function ExampleComponent({
  data,
  onAction,
  className,
  disabled = false,
}: ExampleComponentProps) {
  // 1. Hooks
  const { t, isRTL } = useLanguage();
  const [state, setState] = useState(false);
  
  // 2. Derived state
  const isActive = data.status === 'active';
  
  // 3. Effects
  useEffect(() => {
    // Effect logic
  }, [data]);
  
  // 4. Handlers
  const handleClick = () => {
    onAction(data.id);
  };
  
  // 5. Render helpers (إذا لزم)
  const renderContent = () => {
    return <div>{data.content}</div>;
  };
  
  // 6. Main render
  return (
    <div className={cn('base-classes', className)}>
      {renderContent()}
    </div>
  );
}
```

## 9.2 استخدام Tailwind CSS

```typescript
// استخدام cn() لدمج الـ classes
import { cn } from '../utils/cn';

// مثال
<div
  className={cn(
    // Base classes
    'rounded-xl border p-4',
    // Conditional classes
    isActive && 'border-green-500 bg-green-500/10',
    !isActive && 'border-gray-700 bg-gray-800',
    // RTL support
    isRTL ? 'text-right' : 'text-left',
    // External className
    className
  )}
/>

// الترتيب المفضل للـ classes:
// 1. Layout (flex, grid, position)
// 2. Spacing (p, m, gap)
// 3. Sizing (w, h)
// 4. Typography (text, font)
// 5. Colors (bg, text, border)
// 6. Effects (shadow, opacity)
// 7. Transitions (transition, duration)
// 8. States (hover, focus, active)
```

## 9.3 التعامل مع الحالة (State Management)

```typescript
// للحالة المحلية: useState
const [device, setDevice] = useState<Device | null>(null);

// للحالة المعقدة: useReducer
const [state, dispatch] = useReducer(generatorReducer, initialState);

// للحالة العامة: Context
const GeneratorContext = createContext<GeneratorContextType | null>(null);

// مثال على Reducer
type GeneratorAction =
  | { type: 'SET_DEVICE'; payload: Device }
  | { type: 'SET_FPS'; payload: number }
  | { type: 'SET_FINGERS'; payload: FingerCount }
  | { type: 'RESET' };

function generatorReducer(
  state: GeneratorState,
  action: GeneratorAction
): GeneratorState {
  switch (action.type) {
    case 'SET_DEVICE':
      return { ...state, device: action.payload };
    case 'SET_FPS':
      return { ...state, fps: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}
```

---

# 10. دليل الاستخدام للمطورين

## 10.1 كيفية بدء التطوير

```bash
# 1. استنساخ المشروع (إذا كان في repo)
git clone <repo-url>
cd pubg-sensitivity-generator

# 2. تثبيت الاعتماديات
npm install

# 3. تشغيل خادم التطوير
npm run dev

# 4. البناء للإنتاج
npm run build
```

## 10.2 كيفية إضافة جهاز جديد

```typescript
// 1. افتح الملف المناسب في src/data/devices/
// مثال: src/data/devices/xiaomi.ts

// 2. أضف الجهاز الجديد
{
  id: 'xiaomi-14-ultra',              // معرف فريد
  brand: 'xiaomi',                     // العلامة التجارية
  name: 'Xiaomi 14 Ultra',             // الاسم بالإنجليزية
  nameAr: 'شاومي 14 ألترا',           // الاسم بالعربية
  type: 'phone',                       // phone أو tablet
  os: 'android',                       // ios أو android
  releaseYear: 2024,                   // سنة الإصدار
  specs: {
    screenSize: 6.73,                  // حجم الشاشة بالإنش
    screenWidth: 1440,                 // عرض الشاشة بالبكسل
    screenHeight: 3200,                // ارتفاع الشاشة بالبكسل
    ppi: 522,                          // كثافة البكسلات
    refreshRate: 120,                  // معدل تحديث الشاشة
    touchSamplingRate: 240,            // معدل استجابة اللمس
    maxFPS: 120,                       // أقصى فريمات في PUBG
    gyroscopeQuality: 9,               // جودة الجايرو (1-10)
    processorTier: 'flagship'          // فئة المعالج
  }
}

// 3. تأكد من تصدير الجهاز في src/data/devices/index.ts
```

## 10.3 كيفية تعديل الخوارزمية

```typescript
// 1. افتح src/data/constants/multipliers.ts

// 2. عدّل المعاملات حسب الحاجة
// مثال: تعديل معامل حجم الشاشة
export const SCREEN_SIZE_MULTIPLIERS = {
  normal: {
    6.7: 0.94,  // عدّل هذه القيمة
    // ...
  }
};

// 3. أو افتح src/utils/sensitivity-calculator.ts
// لتعديل منطق الحساب الأساسي
```

## 10.4 كيفية إضافة ترجمة جديدة

```typescript
// 1. أضف المفتاح في src/i18n/index.ts
interface Translations {
  // ...
  newSection: {
    newKey: string;
  };
}

// 2. أضف الترجمة العربية في src/i18n/ar.ts
newSection: {
  newKey: 'النص بالعربية',
}

// 3. أضف الترجمة الإنجليزية في src/i18n/en.ts
newSection: {
  newKey: 'English text',
}

// 4. استخدم في المكون
const { t } = useLanguage();
<span>{t.newSection.newKey}</span>
```

## 10.5 كيفية معرفة المرحلة الحالية

```
اسأل: "ما هي المرحلة الحالية في المشروع؟"

أجب بـ:
- المرحلة: [1/2/3/4]
- آخر مهمة مكتملة: [وصف المهمة]
- المهمة التالية: [وصف المهمة]
- الملفات المُنشأة: [قائمة الملفات]
```

---

# 📋 ملخص سريع

| العنصر | الوصف |
|--------|-------|
| **اسم المشروع** | PUBG Mobile Sensitivity Generator |
| **الهدف** | توليد حساسية مخصصة لكل لاعب بناءً على جهازه وأسلوبه |
| **التقنيات** | React + TypeScript + Vite + Tailwind CSS |
| **اللغات** | عربي + إنجليزي |
| **الأجهزة** | iPhone, iPad, Samsung, Xiaomi, OnePlus, وغيرها |
| **عدد المراحل** | 4 مراحل |
| **الحد الأقصى للحساسية** | Camera/ADS: 200 | Gyro: 400 |

---

# ⚠️ ملاحظات مهمة

1. **الحد الأقصى للجايروسكوب هو 400 وليس 300**
2. **يجب دعم RTL بالكامل للعربية**
3. **التصميم Mobile-First**
4. **الألوان الأساسية: ذهبي/برتقالي على خلفية داكنة**
5. **كل الحسابات تتم في الـ Frontend (لا Backend)**

---

**نهاية الوثيقة**

*آخر تحديث: 2025*
*النسخة: 1.0.0*
