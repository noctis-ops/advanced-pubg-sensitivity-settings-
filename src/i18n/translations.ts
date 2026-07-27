export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    // App
    appName: 'مولّد حساسية PUBG',
    tagline: 'احصل على حساسية احترافية مخصصة لجهازك في أقل من دقيقة',
    
    // Common
    next: 'التالي',
    back: 'السابق',
    generate: 'توليد الحساسية',
    copy: 'نسخ',
    copied: 'تم النسخ!',
    copyAll: 'نسخ الكل',
    share: 'مشاركة',
    startOver: 'بدء من جديد',
    loading: 'جاري التحميل...',
    
    // Steps
    step: 'خطوة',
    stepOf: 'من',
    
    // Step 1 - Device
    step1Title: 'اختر جهازك',
    step1Subtitle: 'ابحث عن جهازك أو اختره من القائمة',
    searchDevice: 'ابحث عن جهازك...',
    popularDevices: 'الأجهزة الشائعة',
    allDevices: 'جميع الأجهزة',
    phone: 'هاتف',
    tablet: 'تابلت',
    maxFPS: 'أقصى فريمات',
    gyroQuality: 'جودة الجايرو',
    screenSize: 'حجم الشاشة',
    
    // Step 2 - FPS
    step2Title: 'الفريمات',
    step2Subtitle: 'اختر معدل الإطارات الذي تلعب عليه',
    yourDevice: 'جهازك',
    supportsUpTo: 'يدعم حتى',
    fps: 'FPS',
    fpsTip: '💡 الفريمات الأعلى = استجابة أسرع = حساسية مختلفة',
    smooth: 'سلس',
    high: 'عالي',
    ultra: 'ألترا',
    extreme: 'إكستريم',
    
    // Step 3 - Fingers
    step3Title: 'طريقة اللعب',
    step3Subtitle: 'كم إصبع تستخدم وما طريقة مسكك؟',
    fingerCount: 'عدد الأصابع',
    fingers: 'أصابع',
    gripStyle: 'طريقة المسك',
    thumbs: 'إبهامين فقط',
    threeFinger: '3 أصابع',
    claw: 'مخلب (4 أصابع)',
    fiveClaw: '5 أصابع',
    fullClaw: 'مخلب كامل (6 أصابع)',
    
    // Step 4 - Gyroscope
    step4Title: 'الجايروسكوب',
    step4Subtitle: 'هل تستخدم الجايروسكوب؟',
    gyroOff: 'مغلق',
    gyroOffDesc: 'لا أستخدم الجايروسكوب',
    gyroScopeOnly: 'عند التصويب فقط',
    gyroScopeOnlyDesc: 'يعمل فقط عند فتح السكوب',
    gyroAlwaysOn: 'دائماً مفعّل',
    gyroAlwaysOnDesc: 'الجايرو يعمل طوال الوقت',
    recommended: '⭐ الأفضل للمحترفين',
    
    // Step 5 - Playstyle
    step5Title: 'أسلوب اللعب',
    step5Subtitle: 'ما هو أسلوبك المفضل؟',
    aggressive: 'هجومي',
    aggressiveDesc: 'أحب الاندفاع والقتال القريب، سرعة الدوران مهمة',
    balanced: 'متوازن',
    balancedDesc: 'أجمع بين الهجوم والدفاع حسب الموقف',
    passive: 'قناص / دفاعي',
    passiveDesc: 'أفضل القتال من بعيد، الدقة أهم من السرعة',
    
    // Results
    resultsTitle: '🎉 حساسيتك جاهزة!',
    resultsSubtitle: 'مخصصة لجهازك وأسلوب لعبك',
    camera: 'حساسية الكاميرا',
    ads: 'حساسية التصويب',
    gyroscope: 'حساسية الجايرو',
    adsGyroscope: 'جايرو التصويب',
    scope: 'السكوب',
    value: 'القيمة',
    noScope: 'بدون سكوب',
    redDot: 'ريد دوت / هولو',
    additionalSettings: 'إعدادات إضافية',
    movementButtonSize: 'حجم زر الحركة',
    freeLook: 'النظرة الحرة',
    
    // Explanation
    whyTheseValues: 'لماذا هذه القيم؟',
    factor: 'العامل',
    impact: 'التأثير',
    adjustment: 'التعديل',
    
    // Categories
    cameraSensitivity: 'Camera Sensitivity',
    adsSensitivity: 'ADS Sensitivity',
    gyroscopeSensitivity: 'Gyroscope Sensitivity',
    adsGyroscopeSensitivity: 'ADS Gyroscope Sensitivity',
    
    // Footer
    madeFor: 'مُصمم لـ',
    
    // Generating
    generating: 'جاري توليد حساسيتك المخصصة...',
    analyzingDevice: 'تحليل مواصفات جهازك',
    calculatingScreen: 'حساب معامل الشاشة',
    adjustingFPS: 'ضبط للفريمات',
    optimizingGyro: 'تحسين الجايروسكوب',
    finalizing: 'إنهاء الحساسية',
    
    // Tips
    tipAimFeatures: '⚠️ تأكد من تفعيل Aim Features في إعدادات اللعبة المتقدمة',
    
    // Weapons
    weaponSensitivity: 'حساسية الأسلحة',
    weaponSensitivityDesc: 'حساسية مخصصة لكل سلاح بناءً على الارتداد',
    assaultRifles: 'بنادق هجومية',
    smgs: 'رشاشات خفيفة',
    snipers: 'قناصات',
    dmrs: 'بنادق قناصة',
    shotguns: 'شوتقن',
    lmgs: 'رشاشات ثقيلة',
    easy: 'سهل',
    medium: 'متوسط',
    hard: 'صعب',
    verticalRecoil: 'ارتداد عمودي',
    horizontalRecoil: 'ارتداد أفقي',
    
    // Device count
    devicesCount: 'جهاز',
    
    // Gaming devices
    gamingDevices: 'أجهزة الألعاب',
  },
  
  en: {
    // App
    appName: 'PUBG Sensitivity Generator',
    tagline: 'Get a pro sensitivity customized for your device in under a minute',
    
    // Common
    next: 'Next',
    back: 'Back',
    generate: 'Generate Sensitivity',
    copy: 'Copy',
    copied: 'Copied!',
    copyAll: 'Copy All',
    share: 'Share',
    startOver: 'Start Over',
    loading: 'Loading...',
    
    // Steps
    step: 'Step',
    stepOf: 'of',
    
    // Step 1 - Device
    step1Title: 'Select Your Device',
    step1Subtitle: 'Search for your device or pick from the list',
    searchDevice: 'Search for your device...',
    popularDevices: 'Popular Devices',
    allDevices: 'All Devices',
    phone: 'Phone',
    tablet: 'Tablet',
    maxFPS: 'Max FPS',
    gyroQuality: 'Gyro Quality',
    screenSize: 'Screen Size',
    
    // Step 2 - FPS
    step2Title: 'Frame Rate',
    step2Subtitle: 'Choose the FPS you actually play on',
    yourDevice: 'Your device',
    supportsUpTo: 'supports up to',
    fps: 'FPS',
    fpsTip: '💡 Higher FPS = faster response = different sensitivity',
    smooth: 'Smooth',
    high: 'High',
    ultra: 'Ultra',
    extreme: 'Extreme',
    
    // Step 3 - Fingers
    step3Title: 'Play Style',
    step3Subtitle: 'How many fingers and what grip do you use?',
    fingerCount: 'Finger Count',
    fingers: 'Fingers',
    gripStyle: 'Grip Style',
    thumbs: 'Thumbs Only',
    threeFinger: '3 Fingers',
    claw: 'Claw (4 Fingers)',
    fiveClaw: '5 Fingers',
    fullClaw: 'Full Claw (6 Fingers)',
    
    // Step 4 - Gyroscope
    step4Title: 'Gyroscope',
    step4Subtitle: 'Do you use gyroscope?',
    gyroOff: 'Off',
    gyroOffDesc: "I don't use gyroscope",
    gyroScopeOnly: 'Scope Only',
    gyroScopeOnlyDesc: 'Only active when aiming down sights',
    gyroAlwaysOn: 'Always On',
    gyroAlwaysOnDesc: 'Gyro is active all the time',
    recommended: '⭐ Recommended for pros',
    
    // Step 5 - Playstyle
    step5Title: 'Playstyle',
    step5Subtitle: "What's your preferred playstyle?",
    aggressive: 'Aggressive',
    aggressiveDesc: 'I love rushing and close combat, fast rotation is key',
    balanced: 'Balanced',
    balancedDesc: 'I adapt between aggressive and passive based on situation',
    passive: 'Sniper / Passive',
    passiveDesc: 'I prefer long-range fights, precision over speed',
    
    // Results
    resultsTitle: '🎉 Your Sensitivity is Ready!',
    resultsSubtitle: 'Customized for your device and playstyle',
    camera: 'Camera Sensitivity',
    ads: 'ADS Sensitivity',
    gyroscope: 'Gyroscope Sensitivity',
    adsGyroscope: 'ADS Gyroscope',
    scope: 'Scope',
    value: 'Value',
    noScope: 'No Scope',
    redDot: 'Red Dot / Holo',
    additionalSettings: 'Additional Settings',
    movementButtonSize: 'Movement Button Size',
    freeLook: 'Free Look',
    
    // Explanation
    whyTheseValues: 'Why these values?',
    factor: 'Factor',
    impact: 'Impact',
    adjustment: 'Adjustment',
    
    // Categories
    cameraSensitivity: 'Camera Sensitivity',
    adsSensitivity: 'ADS Sensitivity',
    gyroscopeSensitivity: 'Gyroscope Sensitivity',
    adsGyroscopeSensitivity: 'ADS Gyroscope Sensitivity',
    
    // Footer
    madeFor: 'Made for',
    
    // Generating
    generating: 'Generating your custom sensitivity...',
    analyzingDevice: 'Analyzing device specs',
    calculatingScreen: 'Calculating screen factor',
    adjustingFPS: 'Adjusting for FPS',
    optimizingGyro: 'Optimizing gyroscope',
    finalizing: 'Finalizing sensitivity',
    
    // Tips
    tipAimFeatures: '⚠️ Make sure to enable Aim Features in advanced game settings',
    
    // Weapons
    weaponSensitivity: 'Weapon Sensitivity',
    weaponSensitivityDesc: 'Custom sensitivity for each weapon based on recoil',
    assaultRifles: 'Assault Rifles',
    smgs: 'SMGs',
    snipers: 'Snipers',
    dmrs: 'DMRs',
    shotguns: 'Shotguns',
    lmgs: 'LMGs',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    verticalRecoil: 'Vertical Recoil',
    horizontalRecoil: 'Horizontal Recoil',
    
    // Device count
    devicesCount: 'devices',
    
    // Gaming devices
    gamingDevices: 'Gaming Devices',
  }
};

export type TranslationKey = keyof typeof translations.ar;

export function getTranslation(lang: Language) {
  return translations[lang];
}
