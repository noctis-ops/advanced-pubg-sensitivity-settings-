import { useState } from 'react';
import { Beaker } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { weapons } from '../../data/weapons';
import { SCOPE_KEYS, SCOPE_LABELS } from '../../data/constants';
import { TRAINING_DISTANCES, TRAINING_PROTOCOL_STEPS, TRAINING_SHOT_COUNTS } from '../../data/measurement-protocol';
import { measurementToSensitivityExperiment, validateMeasurement } from '../../utils/measurement-validator';
import { calculateSensitivity } from '../../utils/sensitivity-calculator';
import type { TrainingGroundMeasurement } from '../../types';

const STORAGE_KEY = 'pubg-sensitivity-measurements-v1';

export function MeasurementLabPanel() {
  const { t, isRTL, state, setSensitivityExperiments } = useApp();
  const [measurements, setMeasurements] = useLocalStorage<TrainingGroundMeasurement[]>(STORAGE_KEY, []);
  const [weaponId, setWeaponId] = useState('qbz');
  const [scope, setScope] = useState<(typeof SCOPE_KEYS)[number]>('redDot');
  const [distance, setDistance] = useState<(typeof TRAINING_DISTANCES)[number]>(50);
  const [shots, setShots] = useState<(typeof TRAINING_SHOT_COUNTS)[number]>(20);
  const [verticalError, setVerticalError] = useState(0);
  const [horizontalError, setHorizontalError] = useState(0);
  const [headshots, setHeadshots] = useState(0);
  const [shotsHit, setShotsHit] = useState(0);
  const [targetTime, setTargetTime] = useState(0);
  const [overshoots, setOvershoots] = useState(0);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const save = () => {
    const measurement: TrainingGroundMeasurement = {
      id: `measurement-${Date.now()}`,
      weaponId,
      scope,
      distanceMeters: distance,
      shots,
      verticalError,
      horizontalError,
      headshots,
      shotsHit,
      targetAcquisitionMs: targetTime || undefined,
      overshoots,
      recordedAt: new Date().toISOString(),
      notes: notes.trim() || undefined
    };
    const errors = validateMeasurement(measurement);
    if (errors.length) {
      setError(errors[0]);
      return;
    }
    setMeasurements([measurement, ...measurements].slice(0, 100));
    if (state.selectedDevice) {
      const vector = state.generatedSensitivity?.sensitivity ?? calculateSensitivity(state.selectedDevice, state.playerSettings);
      const experiment = measurementToSensitivityExperiment(measurement, vector);
      setSensitivityExperiments([experiment, ...(state.playerSettings.sensitivityExperiments ?? [])].slice(0, 100));
    }
    setError('');
    setNotes('');
  };

  return (
    <section className="rounded-2xl border border-teal-500/20 bg-teal-500/[0.04] p-4 space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-start gap-3">
        <Beaker className="w-5 h-5 text-teal-300 mt-0.5" />
        <div>
          <h3 className="font-bold text-white">{t.measurementLab}</h3>
          <p className="text-xs text-gray-400 mt-1">{t.measurementDescription}</p>
        </div>
      </div>
      <details className="text-xs text-gray-500">
        <summary className="cursor-pointer text-teal-300">{t.protocol}</summary>
        <ol className="list-decimal list-inside space-y-1 mt-2">
          {(isRTL ? TRAINING_PROTOCOL_STEPS.ar : TRAINING_PROTOCOL_STEPS.en).map((step) => <li key={step}>{step}</li>)}
        </ol>
      </details>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <select value={weaponId} onChange={(event) => setWeaponId(event.target.value)} className="rounded-lg bg-[#11131a] border border-white/10 px-2 py-2 text-xs text-white">
          {weapons.map((weapon) => <option key={weapon.id} value={weapon.id}>{isRTL ? weapon.nameAr : weapon.name}</option>)}
        </select>
        <select value={scope} onChange={(event) => setScope(event.target.value as typeof scope)} className="rounded-lg bg-[#11131a] border border-white/10 px-2 py-2 text-xs text-white">
          {SCOPE_KEYS.map((item) => <option key={item} value={item}>{SCOPE_LABELS[item].en}</option>)}
        </select>
        <select value={distance} onChange={(event) => setDistance(Number(event.target.value) as typeof distance)} className="rounded-lg bg-[#11131a] border border-white/10 px-2 py-2 text-xs text-white">
          {TRAINING_DISTANCES.map((item) => <option key={item} value={item}>{item}m</option>)}
        </select>
        <select value={shots} onChange={(event) => setShots(Number(event.target.value) as typeof shots)} className="rounded-lg bg-[#11131a] border border-white/10 px-2 py-2 text-xs text-white">
          {TRAINING_SHOT_COUNTS.map((item) => <option key={item} value={item}>{item} {t.shots}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {([
          [t.verticalError, verticalError, setVerticalError],
          [t.horizontalError, horizontalError, setHorizontalError],
          [t.headshots, headshots, setHeadshots],
          [t.shotsHit, shotsHit, setShotsHit],
          [t.overshoots, overshoots, setOvershoots]
        ] as const).map(([label, value, setter]) => (
          <label key={label} className="text-[10px] text-gray-500">{label}
            <input type="number" min="0" value={value} onChange={(event) => setter(Number(event.target.value))} className="mt-1 w-full rounded-lg bg-white/[0.03] border border-white/10 px-2 py-2 text-sm text-white" />
          </label>
        ))}
      </div>
      <label className="block text-[10px] text-gray-500">{t.targetTime}
        <input type="number" min="0" value={targetTime} onChange={(event) => setTargetTime(Number(event.target.value))} className="mt-1 w-full rounded-lg bg-white/[0.03] border border-white/10 px-2 py-2 text-sm text-white" />
      </label>
      <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={2} placeholder={t.notes} className="w-full rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-600" />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button type="button" onClick={save} className="rounded-xl border border-teal-400/30 bg-teal-500/10 px-4 py-2 text-sm font-semibold text-teal-200 hover:bg-teal-500/20">{t.recordMeasurement}</button>
      <p className="text-[11px] text-gray-500">{measurements.length} {t.measurementsSaved}</p>
    </section>
  );
}
