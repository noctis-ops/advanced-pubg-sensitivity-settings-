import { useState } from 'react';
import { FlaskConical } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { compareExperimentResults } from '../../utils/experiment-metrics';
import type { ExperimentResult, PerformanceMetrics } from '../../types';

const defaultMetrics: PerformanceMetrics = { shots: 20, shotsHit: 0, headshots: 0, verticalError: 0, horizontalError: 0, targetAcquisitionMs: 0, overshoots: 0 };

export function ExperimentPanel() {
  const { t, isRTL, state } = useApp();
  const [experiments, setExperiments] = useLocalStorage<ExperimentResult[]>('pubg-sensitivity-experiments-v1', []);
  const [weaponId, setWeaponId] = useState('qbz');
  const [scope, setScope] = useState('redDot');
  const [baseline, setBaseline] = useState<PerformanceMetrics>({ ...defaultMetrics });
  const [candidate, setCandidate] = useState<PerformanceMetrics>({ ...defaultMetrics });
  const [comparison, setComparison] = useState<ReturnType<typeof compareExperimentResults> | null>(null);

  const update = (setter: (value: PerformanceMetrics) => void, current: PerformanceMetrics, key: keyof PerformanceMetrics, value: number) => setter({ ...current, [key]: value });
  const compare = () => {
    const now = new Date().toISOString();
    const baselineResult: ExperimentResult = { id: `experiment-baseline-${Date.now()}`, profile: 'baseline', weaponId, scope: scope as ExperimentResult['scope'], metrics: baseline, createdAt: now };
    const candidateResult: ExperimentResult = { id: `experiment-candidate-${Date.now()}`, profile: 'candidate', weaponId, scope: scope as ExperimentResult['scope'], metrics: candidate, createdAt: now };
    setExperiments([...experiments, baselineResult, candidateResult].slice(-100));
    setComparison(compareExperimentResults(baselineResult, candidateResult));
  };

  const metricFields: (keyof PerformanceMetrics)[] = ['shotsHit', 'headshots', 'verticalError', 'horizontalError', 'targetAcquisitionMs', 'overshoots'];
  const metricLabel = (key: keyof PerformanceMetrics) => ({ shots: t.shots, shotsHit: t.shotsHit, headshots: t.headshots, verticalError: t.verticalError, horizontalError: t.horizontalError, targetAcquisitionMs: t.targetTime, overshoots: t.overshoots }[key]);

  return (
    <section className="rounded-2xl border border-sky-500/20 bg-sky-500/[0.04] p-4 space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-start gap-3"><FlaskConical className="w-5 h-5 text-sky-300 mt-0.5" /><div><h3 className="font-bold text-white">{t.experimentTitle}</h3><p className="text-xs text-gray-400 mt-1">{t.experimentDescription}</p></div></div>
      <div className="grid grid-cols-2 gap-2">
        <select value={weaponId} onChange={(event) => setWeaponId(event.target.value)} className="rounded-lg bg-[#11131a] border border-white/10 px-2 py-2 text-xs text-white">{state.generatedSensitivity?.weaponSensitivities.map((result) => <option key={result.weapon.id} value={result.weapon.id}>{result.weapon.name}</option>)}</select>
        <input value={scope} onChange={(event) => setScope(event.target.value)} placeholder={t.chooseScope} className="rounded-lg bg-[#11131a] border border-white/10 px-2 py-2 text-xs text-white" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {([['baseline', baseline, setBaseline], ['candidate', candidate, setCandidate] ] as const).map(([label, values, setter]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 space-y-2">
            <p className="text-sm font-semibold text-white">{label === 'baseline' ? t.baseline : t.candidate}</p>
            {metricFields.map((key) => <label key={key} className="block text-[10px] text-gray-500">{metricLabel(key)}<input type="number" min="0" value={values[key]} onChange={(event) => update(setter, values, key, Number(event.target.value))} className="mt-1 w-full rounded-lg bg-white/[0.03] border border-white/10 px-2 py-1.5 text-sm text-white" /></label>)}
          </div>
        ))}
      </div>
      <button type="button" onClick={compare} className="rounded-xl border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-200 hover:bg-sky-500/20">{t.compare}</button>
      {comparison && <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-gray-300">{comparison.improved ? t.experimentImproved : (isRTL ? 'النتيجة تحتاج مزيداً من الاختبار' : 'The result needs more testing')}<div className="grid grid-cols-2 gap-2 mt-2"><span>Headshot Δ: {Math.round(comparison.headshotRateDelta * 100)}%</span><span>Recoil Δ: {comparison.recoilErrorDelta.toFixed(2)}</span><span>Acquisition Δ: {comparison.acquisitionDelta.toFixed(0)}ms</span><span>Overshoot Δ: {Math.round(comparison.overshootDelta * 100)}%</span></div></div>}
    </section>
  );
}
