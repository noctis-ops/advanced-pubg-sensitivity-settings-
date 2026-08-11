import { useEffect, useMemo, useState } from 'react';
import { Crosshair, FlaskConical } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SCOPE_LABELS } from '../../data/constants';
import { calculateCalibrationAdjustment, applyCalibrationToPair } from '../../utils/calibration';
import type { CalibrationIssue, WeaponScopeSensitivity, WeaponSensitivityResult } from '../../types';
import { cn } from '../../utils/cn';

interface CalibrationPanelProps {
  results: WeaponSensitivityResult[];
  onApplied?: () => void;
}

const issueKeys: { value: CalibrationIssue; translation: 'issueOvershoot' | 'issueUndershoot' | 'issueVertical' | 'issueLeft' | 'issueRight' | 'issueSlow' | 'issueStable' }[] = [
  { value: 'overshoot', translation: 'issueOvershoot' },
  { value: 'undershoot', translation: 'issueUndershoot' },
  { value: 'vertical-recoil', translation: 'issueVertical' },
  { value: 'horizontal-left', translation: 'issueLeft' },
  { value: 'horizontal-right', translation: 'issueRight' },
  { value: 'slow-acquisition', translation: 'issueSlow' },
  { value: 'stable', translation: 'issueStable' }
];

export function CalibrationPanel({ results, onApplied }: CalibrationPanelProps) {
  const { t, isRTL } = useApp();
  const validResults = results.filter((result) => result.valid && result.values.length > 0);
  const [weaponId, setWeaponId] = useState(validResults[0]?.weapon.id ?? '');
  const [scope, setScope] = useState(validResults[0]?.values[0]?.scope ?? 'redDot');
  const [issue, setIssue] = useState<CalibrationIssue>('stable');
  const [severity, setSeverity] = useState<1 | 2 | 3>(1);
  const [appliedPair, setAppliedPair] = useState<WeaponScopeSensitivity | null>(null);

  const selectedResult = validResults.find((result) => result.weapon.id === weaponId) ?? validResults[0];
  const supportedScopes = selectedResult?.values ?? [];
  const selectedPair = supportedScopes.find((value) => value.scope === scope) ?? supportedScopes[0];

  useEffect(() => {
    if (!selectedResult) return;
    const isSupported = selectedResult.values.some((value) => value.scope === scope);
    if (!isSupported) setScope(selectedResult.values[0]?.scope ?? 'redDot');
    setAppliedPair(null);
  }, [selectedResult, scope]);

  const adjustment = useMemo(() => {
    if (!selectedResult || !selectedPair) return null;
    return calculateCalibrationAdjustment({
      weaponId: selectedResult.weapon.id,
      scope: selectedPair.scope,
      issue,
      severity
    });
  }, [issue, selectedPair, selectedResult, severity]);

  if (!selectedResult || !selectedPair || !adjustment) return null;

  const previewPair = appliedPair ?? applyCalibrationToPair(selectedPair, adjustment);
  const label = SCOPE_LABELS[selectedPair.scope];

  const apply = () => {
    setAppliedPair(previewPair);
    onApplied?.();
  };

  return (
    <section className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.04] p-4 space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
          <FlaskConical className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-white">{t.calibrationTitle}</h3>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">{t.calibrationDescription}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="text-xs text-gray-400">
          <span className="block mb-1">{t.chooseWeapon}</span>
          <select
            value={selectedResult.weapon.id}
            onChange={(event) => {
              setWeaponId(event.target.value);
              setAppliedPair(null);
            }}
            className="w-full rounded-lg border border-white/10 bg-[#11131a] px-3 py-2 text-sm text-white"
          >
            {validResults.map((result) => (
              <option key={result.weapon.id} value={result.weapon.id}>
                {isRTL ? result.weapon.nameAr : result.weapon.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-gray-400">
          <span className="block mb-1">{t.chooseScope}</span>
          <select
            value={selectedPair.scope}
            onChange={(event) => {
              setScope(event.target.value as typeof selectedPair.scope);
              setAppliedPair(null);
            }}
            className="w-full rounded-lg border border-white/10 bg-[#11131a] px-3 py-2 text-sm text-white"
          >
            {supportedScopes.map((value) => (
              <option key={value.scope} value={value.scope}>
                {isRTL ? SCOPE_LABELS[value.scope].ar : SCOPE_LABELS[value.scope].en}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-2">{t.observation}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {issueKeys.map((item) => (
            <button
              type="button"
              key={item.value}
              onClick={() => {
                setIssue(item.value);
                setAppliedPair(null);
              }}
              className={cn(
                'rounded-lg border px-3 py-2 text-xs text-start transition-colors',
                issue === item.value
                  ? 'border-purple-400/50 bg-purple-500/15 text-purple-200'
                  : 'border-white/10 bg-white/[0.02] text-gray-400 hover:bg-white/[0.05]'
              )}
            >
              {t[item.translation]}
            </button>
          ))}
        </div>
      </div>

      <label className="block text-xs text-gray-400">
        <span className="block mb-1">{t.severity}: {severity}/3</span>
        <input
          type="range"
          min="1"
          max="3"
          step="1"
          value={severity}
          onChange={(event) => {
            setSeverity(Number(event.target.value) as 1 | 2 | 3);
            setAppliedPair(null);
          }}
          className="w-full accent-purple-500"
        />
      </label>

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <div className="min-w-[420px] grid grid-cols-[1fr_90px_90px] gap-2 px-3 py-2 text-xs">
          <span className="text-gray-500">{isRTL ? label.ar : label.en}</span>
          <span className="text-gray-500">{t.currentValue}</span>
          <span className="text-purple-300">{t.adjustedValue}</span>
          {[
            ['Camera', selectedPair.camera, previewPair.camera],
            ['ADS', selectedPair.ads, previewPair.ads],
            ['Gyro', selectedPair.gyroscope, previewPair.gyroscope],
            ['ADS Gyro', selectedPair.adsGyroscope, previewPair.adsGyroscope]
          ].map(([name, current, adjusted]) => (
            <div key={name as string} className="contents">
              <span className="text-gray-400">{name}</span>
              <span className="text-white font-bold">{current}</span>
              <span className="text-purple-300 font-bold">{adjusted}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 text-xs text-gray-400">
        <Crosshair className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <p>{isRTL ? adjustment.rationale.ar : adjustment.rationale.en}</p>
      </div>

      <button
        type="button"
        onClick={apply}
        className="w-full rounded-xl bg-purple-500/20 border border-purple-400/30 px-4 py-3 text-sm font-semibold text-purple-200 hover:bg-purple-500/30 transition-colors"
      >
        {appliedPair ? t.calibrationApplied : t.applyCalibration}
      </button>
    </section>
  );
}
