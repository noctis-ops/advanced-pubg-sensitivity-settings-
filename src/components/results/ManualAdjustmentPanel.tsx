import { useMemo, useState } from 'react';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SCOPE_KEYS, SCOPE_LABELS, SENSITIVITY_RANGES } from '../../data/constants';
import { applyManualOverride, resetManualOverrides, type SensitivityCategoryKey } from '../../utils/manual-adjustments';
import type { ScopeId } from '../../types';

const categories: SensitivityCategoryKey[] = ['camera', 'ads', 'gyroscope', 'adsGyroscope'];

export function ManualAdjustmentPanel() {
  const { state, t, isRTL, setSensitivity } = useApp();
  const profile = state.generatedSensitivity;
  const [category, setCategory] = useState<SensitivityCategoryKey>('camera');
  const [scope, setScope] = useState<ScopeId>('redDot');

  const categoryLabels = useMemo(() => ({
    camera: t.camera,
    ads: t.ads,
    gyroscope: t.gyroscope,
    adsGyroscope: t.adsGyroscope
  }), [t]);

  if (!profile) return null;

  const range = SENSITIVITY_RANGES[category];
  const currentValue = profile.sensitivity[category][scope];
  const isGyroscope = category === 'gyroscope' || category === 'adsGyroscope';

  const updateValue = (value: number) => {
    setSensitivity(applyManualOverride(profile, category, scope, value));
  };

  return (
    <section className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.04] p-4 space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
          <SlidersHorizontal className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-white">{t.manualAdjustments}</h3>
          <p className="text-xs text-gray-400 mt-1">{t.manualDescription}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="text-xs text-gray-400">
          <span className="block mb-1">{t.chooseCategory}</span>
          <select value={category} onChange={(event) => setCategory(event.target.value as SensitivityCategoryKey)} className="w-full rounded-xl border border-white/10 bg-[#11131a] px-3 py-2 text-sm text-white">
            {categories.map((item) => <option key={item} value={item}>{categoryLabels[item]}</option>)}
          </select>
        </label>
        <label className="text-xs text-gray-400">
          <span className="block mb-1">{t.chooseScopeManual}</span>
          <select value={scope} onChange={(event) => setScope(event.target.value as ScopeId)} className="w-full rounded-xl border border-white/10 bg-[#11131a] px-3 py-2 text-sm text-white">
            {SCOPE_KEYS.map((item) => <option key={item} value={item}>{isRTL ? SCOPE_LABELS[item].ar : SCOPE_LABELS[item].en}</option>)}
          </select>
        </label>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>{t.manualValue}</span>
          <strong className={isGyroscope ? 'text-green-400' : 'text-orange-400'}>{currentValue}</strong>
        </div>
        <input
          type="range"
          min={range.min}
          max={range.max}
          value={currentValue}
          onChange={(event) => updateValue(Number(event.target.value))}
          className="w-full accent-orange-500"
        />
        <div className="flex justify-between text-[10px] text-gray-600 mt-1">
          <span>{range.min}</span><span>{range.max}</span>
        </div>
      </div>

      <button type="button" onClick={() => setSensitivity(resetManualOverrides(profile))} className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white">
        <RotateCcw className="w-3.5 h-3.5" />
        {t.resetManual}
      </button>
    </section>
  );
}
