import { BrainCircuit } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { PlayerSkillProfile, SkillMetricValue } from '../../types';

const metricKeys: Array<keyof Pick<PlayerSkillProfile, 'trackingScore' | 'flickScore' | 'microAdjustmentScore' | 'recoilControlScore' | 'headshotScore' | 'gyroControlScore' | 'reactionScore' | 'touchPrecisionScore' | 'closeRangeScore' | 'midRangeScore' | 'longRangeScore'>> = [
  'trackingScore', 'flickScore', 'microAdjustmentScore', 'recoilControlScore', 'headshotScore', 'gyroControlScore', 'reactionScore', 'touchPrecisionScore', 'closeRangeScore', 'midRangeScore', 'longRangeScore'
];

const labels: Record<typeof metricKeys[number], { en: string; ar: string }> = {
  trackingScore: { en: 'Tracking', ar: 'التتبع' },
  flickScore: { en: 'Flick control', ar: 'تحكم الفلك' },
  microAdjustmentScore: { en: 'Micro adjustment', ar: 'التصحيح الميكروي' },
  recoilControlScore: { en: 'Recoil control', ar: 'التحكم بالارتداد' },
  headshotScore: { en: 'Headshot control', ar: 'تثبيت الهيدشوت' },
  gyroControlScore: { en: 'Gyroscope control', ar: 'تحكم الجايروسكوب' },
  reactionScore: { en: 'Reaction time', ar: 'زمن الاستجابة' },
  touchPrecisionScore: { en: 'Touch precision', ar: 'دقة اللمس' },
  closeRangeScore: { en: 'Close range', ar: 'القتال القريب' },
  midRangeScore: { en: 'Mid range', ar: 'المسافة المتوسطة' },
  longRangeScore: { en: 'Long range', ar: 'المسافة البعيدة' }
};

function sourceLabel(metric: SkillMetricValue, isRTL: boolean): string {
  if (metric.source === 'measured') return isRTL ? 'مقاس' : 'Measured';
  if (metric.source === 'user-provided') return isRTL ? 'مدخل' : 'User provided';
  return isRTL ? 'مقدر' : 'Estimated';
}

export function PlayerModelPanel() {
  const { state, isRTL } = useApp();
  const profile = state.generatedSensitivity?.playerModel?.skillProfile;
  if (!profile) return null;
  return (
    <section className="rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.04] p-4 space-y-3" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-start gap-3">
        <BrainCircuit className="w-5 h-5 text-indigo-300 mt-0.5" />
        <div>
          <h3 className="font-bold text-white">{isRTL ? 'نموذج اللاعب' : 'Player Skill Model'}</h3>
          <p className="text-xs text-gray-400 mt-1">{isRTL ? `الثقة ${Math.round(profile.confidence * 100)}٪ · العينات ${profile.sampleCount}` : `Confidence ${Math.round(profile.confidence * 100)}% · samples ${profile.sampleCount}`}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {metricKeys.map((key) => {
          const metric = profile[key];
          return <div key={key} className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
            <p className="text-[10px] text-gray-500">{isRTL ? labels[key].ar : labels[key].en}</p>
            <p className="text-sm font-black text-indigo-200">{Math.round(metric.score * 100)}%</p>
            <p className="text-[9px] text-gray-600">{sourceLabel(metric, isRTL)} · n={metric.sampleCount}</p>
          </div>;
        })}
      </div>
      {profile.sampleCount === 0 && <p className="text-[10px] text-amber-300/80">{isRTL ? 'لم تُسجل اختبارات بعد؛ القيم الحالية تقديرية وليست قياساً لمهارة اللاعب.' : 'No performance experiments recorded; current skill values are estimated, not measured.'}</p>}
    </section>
  );
}
