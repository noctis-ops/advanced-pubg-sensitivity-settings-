import { useMemo, useState } from 'react';
import { WandSparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SCOPE_LABELS } from '../../data/constants';
import { OPTIMIZATION_GOALS, optimizeWeaponPair } from '../../utils/sensitivity-optimizer';
import type { OptimizationGoal } from '../../types';

const goalLabels = {
  close: 'goalClose',
  mid: 'goalMid',
  long: 'goalLong',
  tournament: 'goalTournament'
} as const;

export function OptimizationPanel() {
  const { state, t, isRTL, setSensitivity } = useApp();
  const results = state.generatedSensitivity?.weaponSensitivities ?? [];
  const valid = results.filter((result) => result.valid && result.values.length);
  const [goalId, setGoalId] = useState<OptimizationGoal['id']>('tournament');
  const [weaponId, setWeaponId] = useState(valid[0]?.weapon.id ?? '');
  const selectedResult = valid.find((result) => result.weapon.id === weaponId) ?? valid[0];
  const [scope, setScope] = useState(selectedResult?.values[0]?.scope ?? 'redDot');
  const goal = OPTIMIZATION_GOALS.find((item) => item.id === goalId)!;
  const pair = selectedResult?.values.find((item) => item.scope === scope) ?? selectedResult?.values[0];
  const optimized = useMemo(() => pair ? optimizeWeaponPair(pair, goal) : null, [goal, pair]);

  if (!state.generatedSensitivity || !selectedResult || !pair || !optimized) return null;

  const apply = () => {
    const updated = state.generatedSensitivity!.weaponSensitivities.map((result) => result.weapon.id !== selectedResult.weapon.id
      ? result
      : { ...result, values: result.values.map((item) => item.scope === pair.scope ? optimized : item) });
    setSensitivity({ ...state.generatedSensitivity!, weaponSensitivities: updated });
  };

  return (
    <section className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] p-4 space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-start gap-3">
        <WandSparkles className="w-5 h-5 text-violet-300 mt-0.5" />
        <div><h3 className="font-bold text-white">{t.optimizationTitle}</h3><p className="text-xs text-gray-400 mt-1">{t.optimizationDescription}</p></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <select value={goalId} onChange={(event) => setGoalId(event.target.value as OptimizationGoal['id'])} className="rounded-lg bg-[#11131a] border border-white/10 px-2 py-2 text-xs text-white">
          {OPTIMIZATION_GOALS.map((item) => <option key={item.id} value={item.id}>{t[goalLabels[item.id]]}</option>)}
        </select>
        <select value={selectedResult.weapon.id} onChange={(event) => { setWeaponId(event.target.value); setScope('redDot'); }} className="rounded-lg bg-[#11131a] border border-white/10 px-2 py-2 text-xs text-white">
          {valid.map((result) => <option key={result.weapon.id} value={result.weapon.id}>{isRTL ? result.weapon.nameAr : result.weapon.name}</option>)}
        </select>
        <select value={pair.scope} onChange={(event) => setScope(event.target.value as typeof pair.scope)} className="rounded-lg bg-[#11131a] border border-white/10 px-2 py-2 text-xs text-white">
          {selectedResult.values.map((item) => <option key={item.scope} value={item.scope}>{SCOPE_LABELS[item.scope].en}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        {([['Camera', pair.camera, optimized.camera], ['ADS', pair.ads, optimized.ads], ['Gyro', pair.gyroscope, optimized.gyroscope], ['ADS Gyro', pair.adsGyroscope, optimized.adsGyroscope] ] as const).map(([label, current, next]) => (
          <div key={label} className="rounded-lg bg-white/[0.03] p-2"><p className="text-[10px] text-gray-500">{label}</p><p className="text-sm text-white">{current}</p><p className="text-xs text-violet-300">→ {next}</p></div>
        ))}
      </div>
      <button type="button" onClick={apply} className="rounded-xl border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-200 hover:bg-violet-500/20">{t.applyOptimization}</button>
    </section>
  );
}
