import { useMemo } from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { runSyntheticValidation } from '../../utils/synthetic-validation';

export function SyntheticValidationPanel() {
  const { t, isRTL } = useApp();
  const report = useMemo(() => runSyntheticValidation(), []);
  const passed = report.checks.filter((check) => check.passed).length;

  return (
    <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-300 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-white">{t.syntheticTitle}</h3>
            <span className="text-2xl font-black text-emerald-300">{report.score}/100</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">{t.syntheticDescription}</p>
          <p className="text-[11px] text-emerald-300 mt-2">{passed}/{report.checks.length} {t.syntheticPassed}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
        {report.checks.map((check) => (
          <div key={check.name} className="flex items-start gap-2 text-[11px] text-gray-400">
            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${check.passed ? 'text-emerald-400' : 'text-red-400'}`} />
            <span>{check.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
