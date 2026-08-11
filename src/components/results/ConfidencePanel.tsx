import { ShieldCheck } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useApp } from '../../context/AppContext';
import type { SensitivityConfidence } from '../../types';

export function ConfidencePanel({ confidence }: { confidence: SensitivityConfidence }) {
  const { t, isRTL } = useApp();
  const levelLabel = confidence.level === 'high'
    ? t.confidenceHigh
    : confidence.level === 'medium'
      ? t.confidenceMedium
      : t.confidenceLow;
  const levelColor = confidence.level === 'high'
    ? 'text-green-400 bg-green-500/10 border-green-500/20'
    : confidence.level === 'medium'
      ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      : 'text-red-400 bg-red-500/10 border-red-500/20';
  const metrics = [
    [t.confidenceDataCoverage, confidence.breakdown.dataCoverage],
    [t.confidenceDevice, confidence.breakdown.deviceSpecificity],
    [t.confidenceModel, confidence.breakdown.modelStability],
    [t.confidenceCalibration, confidence.breakdown.empiricalCalibration],
    [t.confidenceReproducibility, confidence.breakdown.reproducibility]
  ] as const;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold text-white">{t.confidenceTitle}</h3>
            <span className={cn('rounded-full border px-2 py-0.5 text-xs font-semibold', levelColor)}>
              {levelLabel}
            </span>
          </div>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-black text-cyan-400 tabular-nums">{confidence.score}</span>
            <span className="text-sm text-gray-500 mb-1">/100 {t.confidenceScore}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {metrics.map(([label, value]) => (
          <div key={label}>
            <div className="flex justify-between text-[11px] text-gray-500 mb-1">
              <span>{label}</span><span>{value}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-cyan-500" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold text-gray-400 mb-2">{t.caveats}</p>
        <ul className="space-y-1 text-[11px] text-gray-500 list-disc list-inside">
          {confidence.caveats.map((caveat) => (
            <li key={caveat.en}>{isRTL ? caveat.ar : caveat.en}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
