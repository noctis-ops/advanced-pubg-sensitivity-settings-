import type { ScopeId } from '../types';

export const TRAINING_DISTANCES = [10, 30, 50, 100, 200] as const;
export const TRAINING_SHOT_COUNTS = [10, 20, 30] as const;

export const TRAINING_PROTOCOL_STEPS = {
  en: [
    'Use the same device, FPS, graphics, attachments, and stance for every run.',
    'Warm the device for one minute, then record the actual FPS.',
    'Run 10/20/30 bullet sprays at the selected distance.',
    'Record hits, headshots, vertical/horizontal error, acquisition time, and overshoots.',
    'Repeat each setup at least five times before changing sensitivity.'
  ],
  ar: [
    'استخدم الجهاز وFPS والجرافيكس والملحقات والوقفة نفسها في كل تجربة.',
    'شغّل الجهاز دقيقة ثم سجّل FPS الفعلي.',
    'نفّذ رشقات 10/20/30 رصاصة على المسافة المحددة.',
    'سجّل الإصابات والهيدشوت وخطأ الارتداد وزمن الالتقاط والتجاوزات.',
    'كرر كل إعداد خمس مرات على الأقل قبل تغيير الحساسية.'
  ]
};

export function isSupportedMeasurementScope(scope: ScopeId): boolean {
  return typeof scope === 'string' && scope.length > 0;
}
