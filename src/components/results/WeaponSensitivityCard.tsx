import { Info, RotateCw, Crosshair, Camera, Target } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useApp } from '../../context/AppContext';
import { SCOPE_LABELS } from '../../data/constants';
import type { WeaponSensitivityResult } from '../../types';

export function WeaponSensitivityCard({
  result,
  isRTL
}: {
  result: WeaponSensitivityResult;
  isRTL: boolean;
}) {
  const { t } = useApp();

  if (!result.valid) {
    return (
      <div className="px-4 pb-4 text-sm text-red-300">
        {t.invalidWeapon}:
        <ul className="list-disc list-inside mt-1 text-xs text-red-400/80">
          {result.validationErrors.map((error) => <li key={error}>{error}</li>)}
        </ul>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4 space-y-3">
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500">
        <span>{t.optimalRange}: {result.weapon.effectiveRange.optimalMeters}m</span>
        <span>{t.sprayStability}: {result.weapon.sprayStability}/10</span>
        <span>{t.verticalHorizontalRecoil}: {result.weapon.recoil.vertical}/{result.weapon.recoil.horizontal}</span>
        <span>{t.fireRate}: {result.weapon.fireRate} RPM</span>
      </div>
      <p className="text-[10px] text-gray-600">
        {t.compatibleAttachments}: {result.weapon.attachmentCompatibility.join(' • ')}
      </p>
      {result.weapon.provenance && (
        <p className="text-[10px] text-gray-600">
          Data: {result.weapon.provenance.dataVersion} · {result.weapon.provenance.verificationStatus}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-[145px_70px_70px_70px_78px_1fr] gap-2 px-3 py-2 bg-white/[0.04] text-[10px] uppercase tracking-wide text-gray-500">
            <span>{t.supportedScope}</span>
            <span className="flex items-center gap-1"><Camera className="w-3 h-3" /> {t.cameraColumn}</span>
            <span className="flex items-center gap-1"><Crosshair className="w-3 h-3" /> {t.adsColumn}</span>
            <span className="flex items-center gap-1"><RotateCw className="w-3 h-3" /> {t.gyroColumn}</span>
            <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {t.adsGyroColumn}</span>
            <span>{t.reason}</span>
          </div>

          {result.values.map((value) => {
            const label = SCOPE_LABELS[value.scope];
            return (
              <div key={value.scope} className="grid grid-cols-[145px_70px_70px_70px_78px_1fr] gap-2 px-3 py-3 border-t border-white/5 items-start">
                <div>
                  <p className="text-xs font-semibold text-white">
                    {isRTL ? label.ar : label.en}
                  </p>
                  <p className="text-[10px] text-gray-600">×{value.factors.scopeZoom} · {t.headshotFocus} {value.factors.headshotFocus.toFixed(2)}</p>
                </div>
                <ValueCell value={value.camera} color="text-amber-400" />
                <ValueCell value={value.ads} color="text-blue-400" />
                <ValueCell value={value.gyroscope} color="text-green-400" />
                <ValueCell value={value.adsGyroscope} color="text-red-400" />
                <div className="text-[10px] leading-relaxed text-gray-400">
                  <p>{isRTL ? value.reason.ar : value.reason.en}</p>
                  <p className="mt-1 text-amber-400/80">
                    <Target className="inline w-3 h-3 me-1" />
                    {isRTL ? value.headshotTip.ar : value.headshotTip.en}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-purple-500/15 bg-purple-500/[0.04] p-3">
        <p className="text-xs font-semibold text-purple-200 mb-2">{t.aimFeatures}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['camera', 'ads', 'gyroscope', 'adsGyroscope'] as const).map((category) => (
            <div key={category} className="rounded-lg bg-white/[0.03] p-2 text-center">
              <p className="text-[10px] text-gray-500">{category}</p>
              <p className="text-xs text-purple-200">{t.aimTPPLabel}: {result.aimFeatures[category].aimTPP}</p>
              <p className="text-xs text-purple-200">{t.aimFPPLabel}: {result.aimFeatures[category].aimFPP}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-amber-500/5 border border-amber-500/10 p-3">
        <div className="flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-300 leading-relaxed">
            {isRTL ? result.weapon.tips.ar : result.weapon.tips.en}
          </p>
        </div>
      </div>
    </div>
  );
}

function ValueCell({ value, color }: { value: number; color: string }) {
  return (
    <span className={cn('text-lg font-black tabular-nums', color)}>
      {value === 0 ? '—' : value}
    </span>
  );
}
