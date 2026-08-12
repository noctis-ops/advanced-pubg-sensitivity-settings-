import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Gamepad2, RotateCcw, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ControlButtonLayout, ControlLayoutAnalysis, FingerAssignment, FingerId, HandSide, ReachCalibrationInput } from '../../types';
import { analyzeControlInputs, countAssignedFingers, generateControlLayout, suggestFingerAssignment, validateFingerAssignment } from '../../utils/control-layout';
import { cn } from '../../utils/cn';

const fingerOrder: FingerId[] = ['thumb', 'index', 'middle', 'ring', 'pinky'];
const fingerTranslation: Record<FingerId, 'fingerThumb' | 'fingerIndex' | 'fingerMiddle' | 'fingerRing' | 'fingerPinky'> = {
  thumb: 'fingerThumb', index: 'fingerIndex', middle: 'fingerMiddle', ring: 'fingerRing', pinky: 'fingerPinky'
};
const fingerPositions: Record<FingerId, { left: number; top: number }> = {
  thumb: { left: 8, top: 66 }, index: { left: 30, top: 11 }, middle: { left: 49, top: 3 }, ring: { left: 67, top: 10 }, pinky: { left: 82, top: 23 }
};

function HandSelector({ side, selected, onToggle }: { side: HandSide; selected: FingerId[]; onToggle: (finger: FingerId) => void }) {
  const { t, isRTL } = useApp();
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3" dir={isRTL ? 'rtl' : 'ltr'}>
      <p className="text-sm font-bold text-white mb-2">{side === 'right' ? t.rightHand : t.leftHand}</p>
      <div className="relative mx-auto h-44 max-w-[260px] overflow-hidden rounded-2xl bg-gradient-to-b from-white/[0.03] to-white/[0.01]">
        <svg viewBox="0 0 260 180" className="absolute inset-0 h-full w-full opacity-40" aria-hidden="true">
          <path d={side === 'right' ? 'M74 145c12-22 16-42 19-70l4-46c1-8 13-8 14 0l3 39 5-55c1-9 14-9 15 0l2 53 6-46c1-8 14-8 15 1l-2 48 8-34c2-8 14-6 14 2l-4 49c-2 20-12 43-32 59l-15 10H74Z' : 'M186 145c-12-22-16-42-19-70l-4-46c-1-8-13-8-14 0l-3 39-5-55c-1-9-14-9-15 0l-2 53-6-46c-1-8-14-8-15 1l2 48-8-34c-2-8-14-6-14 2l4 49c2 20 12 43 32 59l15 10h52Z'} fill="currentColor" className="text-cyan-400" />
        </svg>
        {fingerOrder.map((finger) => {
          const position = fingerPositions[finger];
          const x = side === 'right' ? position.left : 100 - position.left - 13;
          const active = selected.includes(finger);
          return (
            <button type="button" key={finger} onClick={() => onToggle(finger)} title={t[fingerTranslation[finger]]} className={cn('absolute z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border text-[9px] font-bold transition-all', active ? 'border-amber-300 bg-amber-400 text-black shadow-lg shadow-amber-500/30' : 'border-white/20 bg-[#10131b]/90 text-gray-400 hover:border-cyan-300 hover:text-cyan-200')} style={{ left: `${x}%`, top: `${position.top}%` }}>
              {t[fingerTranslation[finger]]}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-center text-[11px] text-gray-500">{t.selectedFingers}: {selected.map((finger) => t[fingerTranslation[finger]]).join('، ') || '—'}</p>
    </div>
  );
}

function ReachCalibrationForm({ assignment }: { assignment: FingerAssignment }) {
  const { t, isRTL, state, setReachCalibration } = useApp();
  const active = [
    ...assignment.left.map((finger) => ({ hand: 'left' as const, finger })),
    ...assignment.right.map((finger) => ({ hand: 'right' as const, finger }))
  ];
  const existing = state.playerSettings.reachCalibration ?? [];
  const [values, setValues] = useState<Record<string, { x: number; y: number }>>(() => Object.fromEntries(active.map(({ hand, finger }) => {
    const saved = existing.find((item) => item.hand === hand && item.finger === finger);
    return [`${hand}-${finger}`, saved?.maximumComfortableReach ?? { x: hand === 'left' ? 20 : 80, y: finger === 'thumb' ? 78 : 30 }];
  })));

  const save = () => {
    const calibration: ReachCalibrationInput[] = active.map(({ hand, finger }) => ({
      hand,
      finger,
      maximumComfortableReach: values[`${hand}-${finger}`] ?? { x: hand === 'left' ? 20 : 80, y: 30 },
      source: 'user-provided',
      sampleCount: 1
    }));
    setReachCalibration(calibration);
  };

  return (
    <details className="rounded-xl border border-cyan-500/20 bg-cyan-500/[0.04] p-3" dir={isRTL ? 'rtl' : 'ltr'}>
      <summary className="cursor-pointer text-xs font-semibold text-cyan-200">{isRTL ? 'معايرة مدى الوصول لكل إصبع' : 'Calibrate comfortable reach per finger'}</summary>
      <p className="mt-2 text-[10px] leading-relaxed text-gray-500">{isRTL ? 'أدخل نقطة أقصى وصول مريحة على معاينة Landscape. هذه بيانات مدخلة من اللاعب وليست قياساً تلقائياً.' : 'Enter the farthest comfortable point in the landscape preview. This is user-provided evidence, not automatic telemetry.'}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {active.map(({ hand, finger }) => {
          const key = `${hand}-${finger}`;
          const point = values[key] ?? { x: hand === 'left' ? 20 : 80, y: 30 };
          return <label key={key} className="text-[10px] text-gray-500">{hand}/{t[fingerTranslation[finger]]}
            <div className="mt-1 flex gap-1">
              <input type="number" min="0" max="100" value={point.x} aria-label={`${key} x`} onChange={(event) => setValues((current) => ({ ...current, [key]: { ...point, x: Number(event.target.value) } }))} className="w-full rounded bg-white/[0.04] border border-white/10 px-2 py-1 text-xs text-white" />
              <input type="number" min="0" max="100" value={point.y} aria-label={`${key} y`} onChange={(event) => setValues((current) => ({ ...current, [key]: { ...point, y: Number(event.target.value) } }))} className="w-full rounded bg-white/[0.04] border border-white/10 px-2 py-1 text-xs text-white" />
            </div>
          </label>;
        })}
      </div>
      <button type="button" onClick={save} className="mt-3 rounded-lg border border-cyan-300/30 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-100">{isRTL ? 'حفظ المعايرة وإعادة التحسين' : 'Save calibration and re-optimize'}</button>
    </details>
  );
}

function GripHand({ side, assignment }: { side: HandSide; assignment: FingerAssignment }) {
  const { t } = useApp();
  const active = assignment[side];
  return (
    <div className={cn('absolute top-1/2 z-20 w-[18%] -translate-y-1/2 text-cyan-300', side === 'left' ? 'left-0' : 'right-0')} aria-label={side === 'left' ? t.leftHand : t.rightHand}>
      <svg viewBox="0 0 160 250" className={cn('w-full drop-shadow-[0_0_12px_rgba(34,211,238,0.25)]', side === 'right' ? '-scale-x-100' : '')} aria-hidden="true">
        <path d="M70 238c-23-18-37-42-38-76l3-72c1-11 17-12 20-1l8 45 1-111c0-12 18-13 19-1l3 89 6-105c1-11 18-11 19 1l-1 105 8-86c1-11 18-10 18 2l-4 88 11-56c2-10 18-7 17 4l-8 77c-3 36-21 72-54 96H70Z" fill="currentColor" opacity="0.24" stroke="currentColor" strokeWidth="4" />
        {active.map((finger, index) => <circle key={finger} cx={66 + index * 15} cy={25 + (finger === 'thumb' ? 150 : 0)} r="7" fill="#fbbf24" stroke="#11131a" strokeWidth="3" />)}
      </svg>
      <div className="-mt-3 text-center text-[9px] font-semibold text-cyan-200">{side === 'left' ? t.leftHand : t.rightHand}</div>
    </div>
  );
}

function LandscapePreview({ controls, assignment, device, selectedButtonId, onSelect }: { controls: ControlButtonLayout[]; assignment: FingerAssignment; device: NonNullable<ReturnType<typeof useApp>['state']['selectedDevice']>; selectedButtonId?: string; onSelect: (button: ControlButtonLayout) => void }) {
  const { t, isRTL } = useApp();
  const landscapeRatio = `${Math.max(device.specs.screenWidth, device.specs.screenHeight)}/${Math.min(device.specs.screenWidth, device.specs.screenHeight)}`;
  return (
    <div className="relative mx-auto w-full max-w-[980px] px-[12%] py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <GripHand side="left" assignment={assignment} />
      <div className="relative z-10 w-full overflow-hidden rounded-[1.6rem] border-[5px] border-gray-600 bg-[#080a10] shadow-2xl" style={{ aspectRatio: landscapeRatio }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.08),transparent_60%)]">
          {controls.map((control) => (
            <button type="button" key={control.id} onClick={() => onSelect(control)} title={`${isRTL ? control.labelAr : control.label} · ${control.assignedHand} ${control.assignedFinger}`} className={cn('absolute -translate-x-1/2 -translate-y-1/2 rounded-full border flex items-center justify-center text-center font-semibold leading-none transition-all focus:ring-2 focus:ring-white', selectedButtonId === control.id ? 'z-30 border-white bg-white/30 text-white scale-110' : control.priority === 'core' ? 'border-lime-300/70 bg-lime-400/25 text-lime-100' : control.priority === 'combat' ? 'border-amber-300/60 bg-amber-400/20 text-amber-100' : 'border-white/20 bg-white/10 text-gray-300')} style={{ left: `${control.x}%`, top: `${control.y}%`, width: `${Math.max(4.5, Math.min(14, control.size / 9))}%`, aspectRatio: '1' }}>
              <span className="text-[7px] sm:text-[9px]">{isRTL ? control.labelAr : control.label}</span>
            </button>
          ))}
        </div>
      </div>
      <GripHand side="right" assignment={assignment} />
      <p className="mt-3 text-center text-xs text-gray-500">{t.landscapePreview} · {device.specs.screenWidth}×{device.specs.screenHeight}</p>
    </div>
  );
}

export function ControlsLayoutPanel() {
  const { state, t, isRTL, setFingerAssignment, setSensitivity } = useApp();
  const profile = state.generatedSensitivity;
  const device = state.selectedDevice;
  const initialAssignment = state.playerSettings.fingerAssignment ?? suggestFingerAssignment(state.playerSettings.fingerCount);
  const [assignment, setAssignment] = useState<FingerAssignment>(initialAssignment);
  const [analysis, setAnalysis] = useState<ControlLayoutAnalysis | null>(profile?.controlLayout?.analysis ?? null);
  const [layout, setLayout] = useState(profile?.controlLayout);
  const [selectedButton, setSelectedButton] = useState<ControlButtonLayout | null>(null);

  useEffect(() => {
    if (countAssignedFingers(assignment) !== state.playerSettings.fingerCount) {
      const suggested = suggestFingerAssignment(state.playerSettings.fingerCount);
      setAssignment(suggested);
      setFingerAssignment(suggested);
      setAnalysis(null);
      setLayout(undefined);
    }
  }, [state.playerSettings.fingerCount]);

  const errors = useMemo(() => validateFingerAssignment(assignment, state.playerSettings.fingerCount), [assignment, state.playerSettings.fingerCount]);
  if (!profile || !device) return null;

  const toggle = (side: HandSide, finger: FingerId) => {
    const next = assignment[side].includes(finger) ? assignment[side].filter((item) => item !== finger) : [...assignment[side], finger];
    const updated = { ...assignment, [side]: next } as FingerAssignment;
    setAssignment(updated);
    setFingerAssignment(updated);
    setAnalysis(null);
    setLayout(undefined);
    setSelectedButton(null);
  };

  const analyze = () => {
    setAnalysis(analyzeControlInputs(device, { ...state.playerSettings, fingerAssignment: assignment }, assignment));
    setLayout(undefined);
    setSelectedButton(null);
  };

  const generate = () => {
    if (!analysis?.passed || errors.length) return;
    const generated = generateControlLayout(device, { ...state.playerSettings, fingerAssignment: assignment }, profile.sensitivity, assignment);
    if (!generated.analysis.passed) {
      setAnalysis(generated.analysis);
      return;
    }
    setLayout(generated);
    setSensitivity({ ...profile, controlLayout: generated, playerSettings: { ...profile.playerSettings, fingerAssignment: assignment } });
  };

  const reset = () => {
    const suggested = suggestFingerAssignment(state.playerSettings.fingerCount);
    setAssignment(suggested);
    setFingerAssignment(suggested);
    setAnalysis(null);
    setLayout(undefined);
    setSelectedButton(null);
  };

  return (
    <section className="rounded-2xl border border-lime-500/20 bg-lime-500/[0.04] p-4 space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-start gap-3"><Gamepad2 className="w-6 h-6 text-lime-300 mt-0.5" /><div><h3 className="text-lg font-bold text-white">{t.controlsTitle}</h3><p className="text-xs text-gray-400 mt-1 leading-relaxed">{t.controlsDescription}</p></div></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <HandSelector side="right" selected={assignment.right} onToggle={(finger) => toggle('right', finger)} />
        <HandSelector side="left" selected={assignment.left} onToggle={(finger) => toggle('left', finger)} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs"><span className="text-gray-400">{t.totalFingers}: <strong className="text-white">{countAssignedFingers(assignment)}/{state.playerSettings.fingerCount}</strong></span><button type="button" onClick={reset} className="inline-flex items-center gap-1 text-gray-400 hover:text-white"><RotateCcw className="w-3.5 h-3.5" />{t.resetFingerAssignment}</button></div>
      {errors.length === 0 && <ReachCalibrationForm assignment={assignment} />}
      {errors.length > 0 && <p className="text-xs text-red-400">{isRTL ? `حدد ${state.playerSettings.fingerCount} أصابع بالضبط، مع الإبهام الأيسر للحركة.` : `Select exactly ${state.playerSettings.fingerCount} fingers, including the left thumb for movement.`}</p>}

      <button type="button" disabled={errors.length > 0} onClick={analyze} className="w-full rounded-xl bg-blue-500/20 border border-blue-300/30 px-4 py-3 text-sm font-semibold text-blue-200 hover:bg-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed">{t.analyzeLayout}</button>
      {!analysis && <p className="text-center text-[11px] text-gray-500">{t.analysisFirst}</p>}

      {analysis && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-3 text-xs">
          <p className="font-semibold text-white">{t.layoutChecks}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-gray-400"><span>{t.leftHand}: {analysis.player.leftCount}</span><span>{t.rightHand}: {analysis.player.rightCount}</span><span>{device.specs.screenWidth}×{device.specs.screenHeight}</span><span>{Math.round(analysis.device.aspectRatio * 100) / 100}:1</span></div>
          <div className="space-y-1"><p className={analysis.passed ? 'text-lime-300' : 'text-red-300'}>{analysis.passed ? <CheckCircle2 className="inline w-4 h-4 me-1" /> : <ShieldAlert className="inline w-4 h-4 me-1" />}{analysis.passed ? t.analysisComplete : t.conflicts}</p>{analysis.conflicts.slice(0, 5).map((conflict, index) => <p key={`${conflict.type}-${index}`} className={conflict.severity === 'error' ? 'text-red-400' : 'text-amber-400'}>• {isRTL ? conflict.reason.ar : conflict.reason.en}</p>)}</div>
          <div className="flex flex-wrap gap-2">{analysis.responsibilities.filter((item) => ['movement', 'fire', 'aim', 'scope'].includes(item.buttonId)).map((item) => <span key={item.buttonId} className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] text-gray-400">{item.buttonId} → {item.hand}/{item.finger}</span>)}</div>
        </div>
      )}

      {analysis?.passed && !layout && <button type="button" onClick={generate} className="w-full rounded-xl bg-lime-500/20 border border-lime-300/30 px-4 py-3 text-sm font-semibold text-lime-200 hover:bg-lime-500/30">{t.generateControls}</button>}

      {layout && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400"><span>{t.controlConfidence}: <strong className="text-lime-300">{layout.confidence}%</strong></span><span>{isRTL ? 'النتيجة' : 'Score'}: <strong className="text-cyan-200">{layout.score?.toFixed(1) ?? '—'}</strong></span><span>{isRTL ? 'المرشحون' : 'Candidates'}: {layout.optimization?.candidatesEvaluated ?? 0}</span><span>{t.analysisComplete}</span></div>
          <LandscapePreview controls={layout.buttons} assignment={assignment} device={device} selectedButtonId={selectedButton?.id} onSelect={setSelectedButton} />
          {selectedButton && <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-gray-400"><p className="font-semibold text-white">{t.buttonDetails}: {isRTL ? selectedButton.labelAr : selectedButton.label}</p><p>{t.layoutButtonSize}: {selectedButton.size}% · {isRTL ? 'الموقع' : 'Position'}: {selectedButton.x.toFixed(1)}%, {selectedButton.y.toFixed(1)}%</p><p>{t.assignedHand}: {selectedButton.assignedHand === 'left' ? t.leftHand : t.rightHand}</p><p>{t.assignedFinger}: {selectedButton.assignedFinger}</p><p>{isRTL ? selectedButton.reason.ar : selectedButton.reason.en}</p><p>{isRTL ? 'لماذا الإصبع' : 'Why this finger'}: {selectedButton.explainability?.finger}</p><p>{isRTL ? 'لماذا الموقع' : 'Why this position'}: {selectedButton.explainability?.position}</p><p>{isRTL ? 'لماذا الحجم' : 'Why this size'}: {selectedButton.explainability?.size}</p></div>}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-1 text-xs text-gray-400"><p className="font-semibold text-white">{t.layoutRationale}</p>{layout.rationale.map((reason) => <p key={reason.en}>• {isRTL ? reason.ar : reason.en}</p>)}{(layout.optimization?.warnings.length ?? 0) > 0 && <p className="mt-2 text-amber-300">{isRTL ? 'تحذيرات منخفضة الخطورة:' : 'Soft warnings:'} {layout.optimization?.warnings.length}</p>}</div>
          <div className="flex flex-wrap gap-2 text-[10px] text-gray-500">{layout.buttons.filter((button) => button.priority === 'core').map((button) => <span key={button.id} className="rounded-full border border-lime-300/20 bg-lime-500/10 px-2 py-1">{isRTL ? button.labelAr : button.label} · {button.assignedHand}/{button.assignedFinger}</span>)}</div>
        </div>
      )}
    </section>
  );
}
