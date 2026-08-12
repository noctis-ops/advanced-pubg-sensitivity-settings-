import type {
  Device,
  FingerAssignment,
  MeasurementSource,
  PlayerModel,
  PlayerSettings,
  PlayerSkillMetricName,
  PlayerSkillProfile,
  SensitivityExperiment,
  SkillMetricValue
} from '../types';
import { getEffectiveFPS } from './sensitivity-engine';

const clamp = (value: number, min = 0, max = 1): number => Math.min(max, Math.max(min, value));

const SKILL_KEYS: PlayerSkillMetricName[] = [
  'aimAcquisition', 'tracking', 'flickControl', 'microAdjustment', 'recoilControl',
  'headshotControl', 'closeRangeCombat', 'midRangeTracking', 'longRangePrecision',
  'gyroControl', 'adsControl', 'fingerControl', 'touchPrecision', 'reactionTime', 'correctionStability'
];

const PROFILE_KEYS = {
  tracking: 'trackingScore',
  flickControl: 'flickScore',
  microAdjustment: 'microAdjustmentScore',
  recoilControl: 'recoilControlScore',
  headshotControl: 'headshotScore',
  gyroControl: 'gyroControlScore',
  reactionTime: 'reactionScore',
  touchPrecision: 'touchPrecisionScore',
  closeRangeCombat: 'closeRangeScore',
  midRangeTracking: 'midRangeScore',
  longRangePrecision: 'longRangeScore'
} as const;

const SKILL_PRIORS: Record<PlayerSettings['skillLevel'], Record<PlayerSkillMetricName, number>> = {
  beginner: {
    aimAcquisition: 0.42, tracking: 0.38, flickControl: 0.34, microAdjustment: 0.35, recoilControl: 0.32,
    headshotControl: 0.30, closeRangeCombat: 0.38, midRangeTracking: 0.34, longRangePrecision: 0.28,
    gyroControl: 0.30, adsControl: 0.34, fingerControl: 0.38, touchPrecision: 0.42, reactionTime: 0.38, correctionStability: 0.32
  },
  intermediate: {
    aimAcquisition: 0.56, tracking: 0.54, flickControl: 0.50, microAdjustment: 0.52, recoilControl: 0.50,
    headshotControl: 0.47, closeRangeCombat: 0.56, midRangeTracking: 0.52, longRangePrecision: 0.46,
    gyroControl: 0.48, adsControl: 0.51, fingerControl: 0.55, touchPrecision: 0.58, reactionTime: 0.54, correctionStability: 0.48
  },
  advanced: {
    aimAcquisition: 0.70, tracking: 0.70, flickControl: 0.67, microAdjustment: 0.68, recoilControl: 0.66,
    headshotControl: 0.64, closeRangeCombat: 0.71, midRangeTracking: 0.69, longRangePrecision: 0.65,
    gyroControl: 0.66, adsControl: 0.68, fingerControl: 0.70, touchPrecision: 0.72, reactionTime: 0.69, correctionStability: 0.65
  },
  pro: {
    aimAcquisition: 0.84, tracking: 0.86, flickControl: 0.84, microAdjustment: 0.85, recoilControl: 0.84,
    headshotControl: 0.84, closeRangeCombat: 0.87, midRangeTracking: 0.86, longRangePrecision: 0.84,
    gyroControl: 0.84, adsControl: 0.85, fingerControl: 0.86, touchPrecision: 0.87, reactionTime: 0.86, correctionStability: 0.84
  }
};

function metric(score: number, source: MeasurementSource, sampleCount: number, confidence: number, lastMeasuredAt?: string): SkillMetricValue {
  return { score: clamp(score), source, sampleCount, confidence: clamp(confidence), ...(lastMeasuredAt ? { lastMeasuredAt } : {}) };
}

function readScore(profile: PlayerSkillProfile | undefined, key: PlayerSkillMetricName): SkillMetricValue | undefined {
  if (!profile) return undefined;
  const mappedKey = (PROFILE_KEYS as Partial<Record<PlayerSkillMetricName, keyof PlayerSkillProfile>>)[key];
  if (mappedKey) return profile[mappedKey] as SkillMetricValue;
  const direct = profile[key as keyof PlayerSkillProfile];
  return typeof direct === 'object' && direct !== null && 'score' in direct ? direct as SkillMetricValue : undefined;
}

function experimentEvidence(experiments: SensitivityExperiment[], field: PlayerSkillMetricName): { score: number; samples: number; confidence: number; lastMeasuredAt?: string } | null {
  const valid = experiments.filter((item) => item.sampleCount > 0 && item.confidence > 0 && item.source !== 'estimated');
  if (valid.length === 0) return null;
  const values = valid.map((item) => {
    switch (field) {
      case 'tracking': return item.trackingAccuracy;
      case 'aimAcquisition': return item.targetAcquisitionTime === undefined ? undefined : clamp(1 - item.targetAcquisitionTime / 1200);
      case 'flickControl': return item.overshootRate === undefined ? undefined : clamp(1 - item.overshootRate);
      case 'microAdjustment': return item.correctionCount === undefined ? undefined : clamp(1 - item.correctionCount / Math.max(item.sampleCount, 1));
      case 'recoilControl': return item.recoilDeviation === undefined ? undefined : clamp(1 - item.recoilDeviation);
      case 'headshotControl': return item.headshotRate;
      case 'gyroControl': return item.testType === 'gyro-control' ? (item.recoilDeviation === undefined ? undefined : clamp(1 - item.recoilDeviation)) : undefined;
      case 'adsControl': return item.testType === 'ads-control' ? (item.headshotRate ?? item.trackingAccuracy) : undefined;
      case 'closeRangeCombat': return item.scope === 'noScope' || item.scope === 'redDot' ? (item.trackingAccuracy ?? item.headshotRate) : undefined;
      case 'midRangeTracking': return item.scope === 'x2' || item.scope === 'x3' || item.scope === 'x4' ? item.trackingAccuracy : undefined;
      case 'longRangePrecision': return item.scope === 'x6' || item.scope === 'x8' ? (item.headshotRate ?? item.trackingAccuracy) : undefined;
      case 'fingerControl': return item.correctionCount === undefined ? undefined : clamp(1 - item.correctionCount / Math.max(item.sampleCount, 1));
      case 'touchPrecision': return item.headshotRate ?? item.trackingAccuracy;
      case 'reactionTime': return item.targetAcquisitionTime === undefined ? undefined : clamp(1 - item.targetAcquisitionTime / 1200);
      case 'correctionStability': return item.correctionCount === undefined ? undefined : clamp(1 - item.correctionCount / Math.max(item.sampleCount, 1));
    }
  }).filter((value): value is number => value !== undefined && Number.isFinite(value));
  if (values.length === 0) return null;
  const weighted = valid.filter((item) => {
    const value = (() => {
      switch (field) {
        case 'tracking': return item.trackingAccuracy;
        case 'aimAcquisition': return item.targetAcquisitionTime;
        case 'flickControl': return item.overshootRate;
        case 'microAdjustment': return item.correctionCount;
        case 'recoilControl': return item.recoilDeviation;
        case 'headshotControl': return item.headshotRate;
        case 'gyroControl': return item.testType === 'gyro-control' ? item.recoilDeviation : undefined;
        case 'adsControl': return item.testType === 'ads-control' ? (item.headshotRate ?? item.trackingAccuracy) : undefined;
        case 'closeRangeCombat': return item.scope === 'noScope' || item.scope === 'redDot' ? item.trackingAccuracy : undefined;
        case 'midRangeTracking': return item.scope === 'x2' || item.scope === 'x3' || item.scope === 'x4' ? item.trackingAccuracy : undefined;
        case 'longRangePrecision': return item.scope === 'x6' || item.scope === 'x8' ? item.headshotRate : undefined;
        case 'fingerControl': return item.correctionCount;
        case 'touchPrecision': return item.headshotRate ?? item.trackingAccuracy;
        case 'reactionTime': return item.targetAcquisitionTime;
        case 'correctionStability': return item.correctionCount;
      }
    })();
    return value !== undefined;
  });
  const totalWeight = weighted.reduce((sum, item) => sum + item.sampleCount * item.confidence, 0);
  const weightedScore = weighted.reduce((sum, item) => {
    const itemValue = (() => {
      switch (field) {
        case 'tracking': return item.trackingAccuracy ?? 0;
        case 'aimAcquisition': return clamp(1 - (item.targetAcquisitionTime ?? 1200) / 1200);
        case 'flickControl': return clamp(1 - (item.overshootRate ?? 1));
        case 'microAdjustment': return clamp(1 - (item.correctionCount ?? item.sampleCount) / Math.max(item.sampleCount, 1));
        case 'recoilControl': return clamp(1 - (item.recoilDeviation ?? 1));
        case 'headshotControl': return item.headshotRate ?? 0;
        case 'gyroControl': return clamp(1 - (item.recoilDeviation ?? 1));
        case 'adsControl': return item.headshotRate ?? item.trackingAccuracy ?? 0;
        case 'closeRangeCombat': return item.trackingAccuracy ?? item.headshotRate ?? 0;
        case 'midRangeTracking': return item.trackingAccuracy ?? 0;
        case 'longRangePrecision': return item.headshotRate ?? item.trackingAccuracy ?? 0;
        case 'fingerControl': return clamp(1 - (item.correctionCount ?? item.sampleCount) / Math.max(item.sampleCount, 1));
        case 'touchPrecision': return item.headshotRate ?? item.trackingAccuracy ?? 0;
        case 'reactionTime': return clamp(1 - (item.targetAcquisitionTime ?? 1200) / 1200);
        case 'correctionStability': return clamp(1 - (item.correctionCount ?? item.sampleCount) / Math.max(item.sampleCount, 1));
      }
    })();
    return sum + itemValue * item.sampleCount * item.confidence;
  }, 0);
  return {
    score: totalWeight > 0 ? clamp(weightedScore / totalWeight) : clamp(values.reduce((sum, value) => sum + value, 0) / values.length),
    samples: weighted.reduce((sum, item) => sum + item.sampleCount, 0),
    confidence: clamp(Math.min(0.96, 0.45 + weighted.length * 0.08)),
    lastMeasuredAt: weighted.map((item) => item.recordedAt).filter((value): value is string => Boolean(value)).sort().at(-1)
  };
}

export function createPlayerSkillProfile(settings: PlayerSettings, experiments: SensitivityExperiment[] = settings.sensitivityExperiments ?? []): PlayerSkillProfile {
  const priors = SKILL_PRIORS[settings.skillLevel];
  const values = new Map<PlayerSkillMetricName, SkillMetricValue>();
  for (const key of SKILL_KEYS) {
    const evidence = experimentEvidence(experiments, key);
    const provided = readScore(settings.skillProfile, key);
    if (provided && provided.source === 'user-provided') {
      values.set(key, metric(provided.score, 'user-provided', provided.sampleCount, provided.confidence, provided.lastMeasuredAt));
    } else if (evidence) {
      values.set(key, metric(evidence.score, 'measured', evidence.samples, evidence.confidence, evidence.lastMeasuredAt));
    } else if (provided) {
      values.set(key, metric(provided.score, provided.source, provided.sampleCount, provided.confidence, provided.lastMeasuredAt));
    } else {
      values.set(key, metric(priors[key], 'estimated', 0, 0.22));
    }
  }
  const get = (key: PlayerSkillMetricName): SkillMetricValue => values.get(key) ?? metric(priors[key], 'estimated', 0, 0.22);
  const aggregate = Array.from(values.values());
  const measured = aggregate.filter((item) => item.source === 'measured' || item.source === 'user-provided');
  return {
    trackingScore: get('tracking'),
    flickScore: get('flickControl'),
    microAdjustmentScore: get('microAdjustment'),
    recoilControlScore: get('recoilControl'),
    headshotScore: get('headshotControl'),
    gyroControlScore: get('gyroControl'),
    reactionScore: get('reactionTime'),
    touchPrecisionScore: get('touchPrecision'),
    closeRangeScore: get('closeRangeCombat'),
    midRangeScore: get('midRangeTracking'),
    longRangeScore: get('longRangePrecision'),
    aimAcquisition: get('aimAcquisition'),
    headshotControl: get('headshotControl'),
    adsControl: get('adsControl'),
    fingerControl: get('fingerControl'),
    correctionStability: get('correctionStability'),
    confidence: aggregate.length === 0 ? 0 : measured.length === 0 ? 0.22 : clamp(measured.reduce((sum, item) => sum + item.confidence, 0) / aggregate.length),
    sampleCount: measured.reduce((sum, item) => sum + item.sampleCount, 0)
  };
}

function defaultFingerAssignment(fingerCount: PlayerSettings['fingerCount']): FingerAssignment {
  if (fingerCount === 2) return { left: ['thumb'], right: ['thumb'] };
  if (fingerCount === 3) return { left: ['thumb'], right: ['thumb', 'index'] };
  if (fingerCount === 4) return { left: ['thumb', 'index'], right: ['thumb', 'index'] };
  if (fingerCount === 5) return { left: ['thumb', 'index'], right: ['thumb', 'index', 'middle'] };
  return { left: ['thumb', 'index', 'middle'], right: ['thumb', 'index', 'middle'] };
}

export function buildPlayerModel(device: Device, settings: PlayerSettings, assignment: FingerAssignment = settings.fingerAssignment ?? defaultFingerAssignment(settings.fingerCount)): PlayerModel {
  const skillProfile = createPlayerSkillProfile(settings);
  const landscapeWidth = Math.max(device.specs.screenWidth, device.specs.screenHeight);
  const landscapeHeight = Math.min(device.specs.screenWidth, device.specs.screenHeight);
  const measuredExperimentCount = (settings.sensitivityExperiments ?? []).filter((item) => item.source !== 'estimated').length;
  return {
    deviceId: device.id,
    fingerAssignment: assignment,
    fingerCount: settings.fingerCount,
    gripStyle: settings.gripStyle,
    gyroscopeMode: settings.gyroscopeMode,
    playStyle: settings.playStyle,
    skillProfile,
    deviceMetrics: {
      landscapeWidth,
      landscapeHeight,
      aspectRatio: landscapeWidth / landscapeHeight,
      touchSamplingRate: device.specs.touchSamplingRate,
      refreshRate: device.specs.refreshRate,
      effectiveFPS: getEffectiveFPS(device, settings)
    },
    measuredExperimentCount,
    estimated: skillProfile.confidence < 0.5
  };
}

export function metricSourceLabel(source: MeasurementSource): { en: string; ar: string } {
  switch (source) {
    case 'measured': return { en: 'Measured', ar: 'مقاس فعلياً' };
    case 'user-provided': return { en: 'User provided', ar: 'مدخل من اللاعب' };
    case 'estimated': return { en: 'Estimated prior', ar: 'تقدير مبدئي' };
  }
}
