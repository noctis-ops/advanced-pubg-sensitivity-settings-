import { useMemo, useState } from 'react';
import { GitCompareArrows } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { referenceProfiles } from '../../data/reference-profiles';
import { SCOPE_KEYS } from '../../data/constants';
import type { SensitivityCategory, SensitivitySet } from '../../types';

function similarity(current: SensitivityCategory, reference: SensitivityCategory): number {
  const differences: number[] = [];
  (['camera', 'ads', 'gyroscope', 'adsGyroscope'] as const).forEach((category) => {
    SCOPE_KEYS.forEach((scope) => {
      const currentValue = current[category][scope];
      const referenceValue = reference[category][scope];
      differences.push(Math.abs(currentValue - referenceValue) / Math.max(referenceValue, 1));
    });
  });
  const averageDifference = differences.reduce((sum, value) => sum + value, 0) / differences.length;
  return Math.max(0, Math.min(100, Math.round((1 - averageDifference) * 100)));
}

function averageSet(set: SensitivitySet): number {
  return Math.round(SCOPE_KEYS.reduce((sum, scope) => sum + set[scope], 0) / SCOPE_KEYS.length);
}

export function ComparisonPanel({ current }: { current: SensitivityCategory }) {
  const { t, isRTL } = useApp();
  const [selectedId, setSelectedId] = useState(referenceProfiles[0].id);
  const selected = referenceProfiles.find((profile) => profile.id === selectedId) ?? referenceProfiles[0];
  const selectedSimilarity = useMemo(() => similarity(current, selected.sensitivity), [current, selected]);

  return (
    <section className="rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.04] p-4 space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-300">
          <GitCompareArrows className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-white">{t.comparisonTitle}</h3>
          <p className="text-xs text-gray-400 mt-1">{t.comparisonDescription}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {referenceProfiles.map((profile) => {
          const score = similarity(current, profile.sensitivity);
          return (
            <button
              type="button"
              key={profile.id}
              onClick={() => setSelectedId(profile.id)}
              className={`rounded-xl border p-3 text-start transition-colors ${profile.id === selectedId ? 'border-indigo-400/50 bg-indigo-500/15' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'}`}
            >
              <p className="text-sm font-semibold text-white">{isRTL ? profile.nameAr : profile.name}</p>
              <p className="text-[10px] text-gray-500 mt-1">{t.match}: {score}%</p>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-indigo-200">{isRTL ? selected.nameAr : selected.name}</p>
            <p className="text-xs text-gray-500 mt-1">{isRTL ? selected.descriptionAr : selected.description}</p>
          </div>
          <strong className="text-2xl text-indigo-300 tabular-nums">{selectedSimilarity}%</strong>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-center">
          {(['camera', 'ads', 'gyroscope', 'adsGyroscope'] as const).map((category) => (
            <div key={category} className="rounded-lg bg-white/[0.03] p-2">
              <p className="text-[10px] text-gray-500">{category}</p>
              <p className="text-sm font-bold text-white">{averageSet(current[category])}</p>
              <p className="text-[10px] text-indigo-300">{averageSet(selected.sensitivity[category])}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-gray-500">{t.comparisonDisclaimer}</p>
    </section>
  );
}
