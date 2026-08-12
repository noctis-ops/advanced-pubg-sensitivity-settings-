import { SCOPE_PROFILES, SENSITIVITY_RANGES } from '../data/constants';
import type {
  OptimizationGoal,
  PlayerSettings,
  PlayerSkillProfile,
  ScopeId,
  SensitivityCandidateEvaluation,
  SensitivityCategory,
  SensitivityExperiment,
  SensitivitySet,
  WeaponProfile,
  WeaponScopeSensitivity,
  WeaponSensitivityResult
} from '../types';

export const OPTIMIZATION_GOALS: OptimizationGoal[] = [
  { id: 'close', weights: { recoil: 0.15, headshot: 0.30, acquisition: 0.30, microControl: 0.10, overshoot: 0.15 } },
  { id: 'mid', weights: { recoil: 0.30, headshot: 0.25, acquisition: 0.15, microControl: 0.20, overshoot: 0.20 } },
  { id: 'long', weights: { recoil: 0.35, headshot: 0.20, acquisition: 0.05, microControl: 0.30, overshoot: 0.20 } },
  { id: 'tournament', weights: { recoil: 0.25, headshot: 0.25, acquisition: 0.20, microControl: 0.20, overshoot: 0.10 } }
];

export interface SensitivityOptimizationContext {
  settings?: PlayerSettings;
  skillProfile?: PlayerSkillProfile;
  weaponProfile?: WeaponProfile;
  weaponId?: string;
  scope?: ScopeId;
  experiments?: SensitivityExperiment[];
  goal?: OptimizationGoal;
  seed?: number;
}

export interface SensitivityOptimizationResult {
  value: WeaponScopeSensitivity;
  score: number;
  loss: number;
  iterations: number;
  candidatesEvaluated: number;
  confidence: number;
  target: { camera: number; ads: number; gyroscope: number; adsGyroscope: number };
  reason: { en: string; ar: string };
  evidence: 'measured' | 'user-provided' | 'estimated';
}

export interface SensitivityVectorOptimizationResult {
  sensitivity: SensitivityCategory;
  score: number;
  iterations: number;
  candidatesEvaluated: number;
  confidence: number;
  evidence: 'measured' | 'user-provided' | 'estimated';
}

const clamp = (value: number, min = 0, max = 1): number => Math.min(max, Math.max(min, value));
const bounded = (value: number, category: keyof typeof SENSITIVITY_RANGES): number => {
  const range = SENSITIVITY_RANGES[category];
  return Math.round(clamp(value, range.min, range.max));
};
const average = (values: number[]): number => values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;
const hash = (value: string): number => {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) result = Math.imul(result ^ value.charCodeAt(index), 16777619);
  return result >>> 0;
};

const defaultSkill = (value: number): PlayerSkillProfile['trackingScore'] => ({ score: value, source: 'estimated', sampleCount: 0, confidence: 0.22 });
const fallbackSkill: PlayerSkillProfile = {
  trackingScore: defaultSkill(0.65), flickScore: defaultSkill(0.62), microAdjustmentScore: defaultSkill(0.64), recoilControlScore: defaultSkill(0.62),
  headshotScore: defaultSkill(0.60), gyroControlScore: defaultSkill(0.62), reactionScore: defaultSkill(0.64), touchPrecisionScore: defaultSkill(0.66),
  closeRangeScore: defaultSkill(0.65), midRangeScore: defaultSkill(0.63), longRangeScore: defaultSkill(0.60), aimAcquisition: defaultSkill(0.64),
  headshotControl: defaultSkill(0.60), adsControl: defaultSkill(0.63), fingerControl: defaultSkill(0.65), correctionStability: defaultSkill(0.61), confidence: 0.22, sampleCount: 0
};

function skillValue(profile: PlayerSkillProfile | undefined, key: keyof PlayerSkillProfile): number {
  const value = profile?.[key];
  return typeof value === 'object' && value !== null && 'score' in value ? clamp(value.score) : 0.62;
}

function evidenceFor(context: SensitivityOptimizationContext): { overshoot: number; undershoot: number; recoil: number; horizontal: number; acquisition: number; corrections: number; headshot: number; tracking: number; source: 'measured' | 'user-provided' | 'estimated'; confidence: number } {
  const matches = (context.experiments ?? []).filter((item) =>
    item.scope === context.scope &&
    (!context.weaponId || item.weapon === context.weaponId) &&
    item.source !== 'estimated'
  );
  if (matches.length === 0) return { overshoot: 0, undershoot: 0, recoil: 0, horizontal: 0, acquisition: 0, corrections: 0, headshot: 0, tracking: 0, source: 'estimated', confidence: 0.18 };
  const weighted = (read: (item: SensitivityExperiment) => number | undefined): number => {
    const values = matches.map((item) => ({ value: read(item), weight: item.sampleCount * item.confidence })).filter((item): item is { value: number; weight: number } => item.value !== undefined && Number.isFinite(item.value));
    const weight = values.reduce((sum, item) => sum + item.weight, 0);
    return weight === 0 ? 0 : values.reduce((sum, item) => sum + item.value * item.weight, 0) / weight;
  };
  const source = matches.some((item) => item.source === 'measured') ? 'measured' : 'user-provided';
  return {
    overshoot: clamp(weighted((item) => item.overshootRate)),
    undershoot: clamp(weighted((item) => item.undershootRate)),
    recoil: clamp(weighted((item) => item.recoilDeviation)),
    horizontal: clamp(weighted((item) => item.horizontalDeviation)),
    acquisition: clamp(weighted((item) => item.targetAcquisitionTime) / 1200),
    corrections: clamp(weighted((item) => item.correctionCount) / 20),
    headshot: clamp(weighted((item) => item.headshotRate)),
    tracking: clamp(weighted((item) => item.trackingAccuracy)),
    source,
    confidence: clamp(0.35 + matches.length * 0.10)
  };
}

function defaultWeaponProfile(): WeaponProfile {
  return {
    id: 'generic', category: 'ar', recoilPatternCharacteristics: 'straight', verticalRecoilTendency: 0.5, horizontalRecoilTendency: 0.35,
    fireRate: 0.55, burstCharacteristics: { mode: 'auto', burstLength: 30, cadence: 0.55, recoveryDemand: 0.45 },
    effectiveEngagementRange: { minMeters: 0, optimalMeters: 80, maxMeters: 280 }, scopeUsage: {}, trackingDemand: 0.6, flickDemand: 0.5,
    stabilityDemand: 0.6, precisionDemand: 0.6, source: 'expert-defined-normalized', measured: false, confidence: 0.2,
    notes: { en: 'Generic estimated weapon prior.', ar: 'تقدير مبدئي لسلاح عام.' }
  };
}

function targetForPair(pair: WeaponScopeSensitivity, context: SensitivityOptimizationContext): { camera: number; ads: number; gyroscope: number; adsGyroscope: number } {
  const skill = context.skillProfile ?? fallbackSkill;
  const weapon = context.weaponProfile ?? defaultWeaponProfile();
  const scope = context.scope ?? pair.scope;
  const scopeProfile = SCOPE_PROFILES[scope];
  const evidence = evidenceFor({ ...context, scope });
  const tracking = skillValue(skill, 'trackingScore');
  const flick = skillValue(skill, 'flickScore');
  const micro = skillValue(skill, 'microAdjustmentScore');
  const recoilControl = skillValue(skill, 'recoilControlScore');
  const headshot = skillValue(skill, 'headshotScore');
  const gyroControl = skillValue(skill, 'gyroControlScore');
  const correctionStability = skillValue(skill, 'correctionStability');
  const gyroEnabled = context.settings?.gyroscopeMode !== 'off';
  const measuredOvershoot = evidence.overshoot;
  const measuredUndershoot = evidence.undershoot;
  const measuredRecoil = evidence.recoil;
  const magnificationDrag = Math.max(0, scopeProfile.zoom - 1) * 0.018;

  // Each system has a different objective. Camera favours acquisition/flick,
  // ADS favours tracking/micro-control, gyro favours recoil authority, and
  // ADS gyro combines recoil authority with high-zoom precision.
  const cameraFactor = clamp(
    scopeProfile.cameraSpeed
      * (0.94 + tracking * 0.08 + flick * 0.08)
      * (0.96 + weapon.flickDemand * 0.08)
      * (1 - measuredOvershoot * 0.12 + measuredUndershoot * 0.10)
      * (1 - magnificationDrag),
    0.55,
    1.20
  );
  const adsFactor = clamp(
    scopeProfile.adsPrecision
      * (0.92 + micro * 0.10 + headshot * 0.06)
      * (0.96 + weapon.stabilityDemand * 0.06 - weapon.verticalRecoilTendency * 0.04)
      * (1 - measuredOvershoot * 0.08 + measuredUndershoot * 0.08)
      * (1 - magnificationDrag * 0.75),
    0.48,
    1.16
  );
  const gyroFactor = gyroEnabled ? clamp(
    scopeProfile.gyroControl
      * (0.88 + weapon.verticalRecoilTendency * 0.24 + weapon.horizontalRecoilTendency * 0.10 + weapon.fireRate * 0.07)
      * (0.95 + gyroControl * 0.10)
      * (1 + measuredRecoil * 0.20 + measuredUndershoot * 0.04 - measuredOvershoot * 0.06)
      * (1 - weapon.precisionDemand * 0.025),
    0.38,
    1.24
  ) : 0;
  const adsGyroFactor = gyroEnabled ? clamp(
    scopeProfile.gyroControl
      * scopeProfile.adsPrecision
      * (0.98 + weapon.verticalRecoilTendency * 0.27 + weapon.horizontalRecoilTendency * 0.08)
      * (0.96 + gyroControl * 0.09 + micro * 0.08 + headshot * 0.04)
      * (1 + measuredRecoil * 0.22 - measuredOvershoot * 0.08)
      * (1 - weapon.precisionDemand * 0.02),
    0.28,
    1.22
  ) : 0;

  // A low correction-stability score should calm thumb systems; a high recoil
  // demand should be moved to gyro systems rather than blindly raising all four.
  const stabilityCorrection = 1 - correctionStability;
  const recoilSkillCorrection = (0.5 - recoilControl) * 0.06;
  return {
    camera: bounded(pair.camera * cameraFactor * (1 - stabilityCorrection * 0.06), 'camera'),
    ads: bounded(pair.ads * adsFactor * (1 - stabilityCorrection * 0.04), 'ads'),
    gyroscope: bounded(pair.gyroscope * (gyroFactor + recoilSkillCorrection), 'gyroscope'),
    adsGyroscope: bounded(pair.adsGyroscope * (adsGyroFactor + recoilSkillCorrection), 'adsGyroscope')
  };
}

export function generateCandidates(pair: WeaponScopeSensitivity, context: SensitivityOptimizationContext = {}): WeaponScopeSensitivity[] {
  const target = targetForPair(pair, context);
  const normalSteps = [-10, -5, 0, 5, 10];
  const gyroSteps = [-24, -12, 0, 12, 24];
  const candidates: WeaponScopeSensitivity[] = [pair];
  for (const delta of normalSteps) {
    candidates.push({ ...pair, camera: bounded(target.camera + delta, 'camera') });
    candidates.push({ ...pair, ads: bounded(target.ads + delta, 'ads') });
  }
  for (const delta of gyroSteps) {
    candidates.push({ ...pair, gyroscope: bounded(target.gyroscope + delta, 'gyroscope') });
    candidates.push({ ...pair, adsGyroscope: bounded(target.adsGyroscope + delta, 'adsGyroscope') });
  }
  for (const delta of [-5, 5]) {
    candidates.push({
      ...pair,
      camera: bounded(target.camera + delta, 'camera'),
      ads: bounded(target.ads + delta, 'ads')
    });
    candidates.push({
      ...pair,
      gyroscope: bounded(target.gyroscope + delta * 2, 'gyroscope'),
      adsGyroscope: bounded(target.adsGyroscope + delta * 2, 'adsGyroscope')
    });
  }
  const seen = new Set<string>();
  return candidates.filter((candidate) => {
    const key = `${candidate.camera}:${candidate.ads}:${candidate.gyroscope}:${candidate.adsGyroscope}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function evaluateCandidate(candidate: WeaponScopeSensitivity, context: SensitivityOptimizationContext = {}): SensitivityCandidateEvaluation {
  const target = targetForPair(candidate, context);
  const evidence = evidenceFor(context);
  const skill = context.skillProfile ?? fallbackSkill;
  const weapon = context.weaponProfile ?? defaultWeaponProfile();
  const acquisition = Math.abs(candidate.camera - target.camera) / 200;
  const tracking = Math.abs(candidate.ads - target.ads) / 200;
  const flick = Math.abs(candidate.camera - target.camera) / 200;
  const microAdjustment = Math.abs(candidate.ads - target.ads) / 200;
  const recoil = Math.abs(candidate.gyroscope - target.gyroscope) / 400 + Math.abs(candidate.adsGyroscope - target.adsGyroscope) / 400;
  const overshoot = Math.max(0, (candidate.camera - target.camera) / 200) * (1 - skillValue(skill, 'flickScore')) + Math.max(0, (candidate.ads - target.ads) / 200) * (1 - skillValue(skill, 'correctionStability'));
  const smoothness = Math.abs(candidate.camera - candidate.ads) / 200 + Math.abs(candidate.gyroscope - candidate.adsGyroscope) / 400;
  const evidenceLoss = evidence.source === 'estimated'
    ? 0
    : Math.abs(evidence.tracking - (1 - tracking)) * 0.25
      + Math.abs(evidence.headshot - (1 - microAdjustment)) * 0.20
      + Math.abs(evidence.recoil - (1 - recoil / 2)) * 0.35
      + evidence.overshoot * Math.max(0, (candidate.camera - target.camera) / 200) * 0.30;
  const loss = acquisition * 0.18 + tracking * 0.20 + flick * 0.14 + microAdjustment * 0.16 + recoil * 0.20 + overshoot * 0.08 + smoothness * 0.04 + evidenceLoss * (0.5 + evidence.confidence);
  const score = clamp(100 - loss * 100, 0, 100);
  const reason = {
    en: `${context.scope ?? candidate.scope}: camera targets acquisition/flick (${Math.round(target.camera)}), ADS targets tracking/micro-control (${Math.round(target.ads)}), gyro targets ${Math.round(weapon.verticalRecoilTendency * 100)}% vertical recoil demand (${Math.round(target.gyroscope)}). Evidence: ${evidence.source}.`,
    ar: `${context.scope ?? candidate.scope}: الكاميرا تستهدف سرعة الالتقاط والفلك (${Math.round(target.camera)})، وADS للتتبع والتحكم الميكروي (${Math.round(target.ads)})، والجايرو لتعويض ارتداد عمودي مقداره ${Math.round(weapon.verticalRecoilTendency * 100)}% (${Math.round(target.gyroscope)}). مصدر الدليل: ${evidence.source}.`
  };
  return {
    loss,
    score,
    target,
    breakdown: { acquisition, tracking, flick, microAdjustment, recoil, overshoot, smoothness, evidence: evidenceLoss },
    reason
  };
}

export function rankCandidates(candidates: WeaponScopeSensitivity[], context: SensitivityOptimizationContext = {}): Array<{ candidate: WeaponScopeSensitivity; evaluation: SensitivityCandidateEvaluation }> {
  return candidates.map((candidate) => ({ candidate, evaluation: evaluateCandidate(candidate, context) })).sort((left, right) => left.evaluation.loss - right.evaluation.loss);
}

export function optimizeSensitivity(pair: WeaponScopeSensitivity, context: SensitivityOptimizationContext = {}): SensitivityOptimizationResult {
  let current = pair;
  let bestEvaluation = evaluateCandidate(current, context);
  let iterations = 0;
  let candidatesEvaluated = 1;
  for (let iteration = 0; iteration < 4; iteration += 1) {
    const ranked = rankCandidates(generateCandidates(current, context), context);
    candidatesEvaluated += ranked.length;
    const next = ranked[0];
    iterations += 1;
    if (next.evaluation.loss + 0.000001 >= bestEvaluation.loss) break;
    current = next.candidate;
    bestEvaluation = next.evaluation;
  }
  const evidence = evidenceFor(context);
  return {
    value: current,
    score: bestEvaluation.score,
    loss: bestEvaluation.loss,
    iterations,
    candidatesEvaluated,
    confidence: evidence.source === 'estimated' ? 0.32 : evidence.confidence,
    target: bestEvaluation.target,
    reason: bestEvaluation.reason,
    evidence: evidence.source
  };
}

/** Backwards-compatible weapon-pair entry point, now backed by grid search + coordinate descent. */
export function optimizeWeaponPair(pair: WeaponScopeSensitivity, goal: OptimizationGoal): WeaponScopeSensitivity {
  const result = optimizeSensitivity(pair, { goal, scope: pair.scope, seed: hash(`${goal.id}:${pair.scope}`) });
  return result.value;
}

export function optimizeWeaponResult(result: WeaponSensitivityResult, goal: OptimizationGoal): WeaponSensitivityResult {
  return {
    ...result,
    values: result.values.map((pair) => optimizeWeaponPair(pair, goal))
  };
}

function cloneCategory(category: SensitivityCategory): SensitivityCategory {
  return {
    camera: { ...category.camera },
    ads: { ...category.ads },
    gyroscope: { ...category.gyroscope },
    adsGyroscope: { ...category.adsGyroscope }
  };
}

function vectorLoss(candidate: SensitivityCategory, base: SensitivityCategory, context: SensitivityOptimizationContext): number {
  const skill = context.skillProfile ?? fallbackSkill;
  const tracking = skillValue(skill, 'trackingScore');
  const flick = skillValue(skill, 'flickScore');
  const micro = skillValue(skill, 'microAdjustmentScore');
  const recoil = skillValue(skill, 'recoilControlScore');
  const gyroControl = skillValue(skill, 'gyroControlScore');
  const targetCamera = 0.94 + tracking * 0.08 + flick * 0.08;
  const targetAds = 0.94 + tracking * 0.06 + micro * 0.08;
  const targetGyro = context.settings?.gyroscopeMode === 'off' ? 0 : 0.94 + gyroControl * 0.10 + (1 - recoil) * 0.08;
  const targetAdsGyro = context.settings?.gyroscopeMode === 'off' ? 0 : 0.91 + gyroControl * 0.08 + (1 - recoil) * 0.10;
  const loss = [
    ['camera', targetCamera], ['ads', targetAds], ['gyroscope', targetGyro], ['adsGyroscope', targetAdsGyro]
  ].reduce((sum, [category, target]) => {
    const values = candidate[category as keyof SensitivityCategory] as SensitivitySet;
    const baseValues = base[category as keyof SensitivityCategory] as SensitivitySet;
    const ratio = average([values.noScope / Math.max(baseValues.noScope, 1), values.redDot / Math.max(baseValues.redDot, 1), values.x2 / Math.max(baseValues.x2, 1)]);
    return sum + Math.abs(ratio - Number(target));
  }, 0);
  const smoothness = Math.abs(candidate.camera.redDot - candidate.camera.x2) / 200 + Math.abs(candidate.ads.redDot - candidate.ads.x2) / 200;
  return loss + smoothness * 0.02;
}

/** Generate a bounded grid around each category/scope coordinate for global calibration. */
export function generateSensitivityCandidates(base: SensitivityCategory, context: SensitivityOptimizationContext = {}): SensitivityCategory[] {
  // Context is accepted here so future Bayesian/evolutionary generators can
  // narrow the grid using device and evidence without changing the API.
  void context;
  const candidates: SensitivityCategory[] = [cloneCategory(base)];
  const coordinates: Array<[keyof SensitivityCategory, keyof SensitivitySet, number]> = [
    ['camera', 'noScope', 6], ['camera', 'redDot', 5], ['camera', 'x2', 4], ['camera', 'x3', 3], ['camera', 'x4', 3], ['camera', 'x6', 2], ['camera', 'x8', 2],
    ['ads', 'noScope', 5], ['ads', 'redDot', 4], ['ads', 'x2', 3], ['ads', 'x3', 3], ['ads', 'x4', 2], ['ads', 'x6', 2], ['ads', 'x8', 1],
    ['gyroscope', 'noScope', 12], ['gyroscope', 'redDot', 10], ['gyroscope', 'x2', 8], ['gyroscope', 'x3', 7], ['gyroscope', 'x4', 6], ['gyroscope', 'x6', 5], ['gyroscope', 'x8', 4],
    ['adsGyroscope', 'noScope', 12], ['adsGyroscope', 'redDot', 10], ['adsGyroscope', 'x2', 8], ['adsGyroscope', 'x3', 7], ['adsGyroscope', 'x4', 6], ['adsGyroscope', 'x6', 5], ['adsGyroscope', 'x8', 4]
  ];
  for (const [category, scope, step] of coordinates) {
    for (const direction of [-1, 1]) {
      const candidate = cloneCategory(base);
      const range = SENSITIVITY_RANGES[category];
      candidate[category][scope] = Math.round(clamp(candidate[category][scope] + direction * step, range.min, range.max));
      candidates.push(candidate);
    }
  }
  return candidates;
}

export function evaluateSensitivityVector(candidate: SensitivityCategory, base: SensitivityCategory, context: SensitivityOptimizationContext = {}): number {
  return vectorLoss(candidate, base, context);
}

/** Coordinate descent for the global player vector; evidence is optional and explicitly weighted by confidence. */
export function optimizeSensitivityVector(base: SensitivityCategory, context: SensitivityOptimizationContext = {}): SensitivityVectorOptimizationResult {
  let current = cloneCategory(base);
  let currentLoss = vectorLoss(current, base, context);
  let candidatesEvaluated = 1;
  let iterations = 0;
  for (let iteration = 0; iteration < 4; iteration += 1) {
    const ranked = generateSensitivityCandidates(current, context)
      .map((candidate) => ({ candidate, loss: vectorLoss(candidate, base, context) }))
      .sort((left, right) => left.loss - right.loss);
    candidatesEvaluated += ranked.length;
    iterations += 1;
    if (!ranked[0] || ranked[0].loss + 0.000001 >= currentLoss) break;
    current = ranked[0].candidate;
    currentLoss = ranked[0].loss;
  }
  const experiments = context.experiments ?? [];
  const evidence = experiments.some((item) => item.source === 'measured') ? 'measured' : experiments.some((item) => item.source === 'user-provided') ? 'user-provided' : 'estimated';
  const confidence = evidence === 'estimated' ? 0.24 : clamp(0.42 + experiments.length * 0.04);
  return { sensitivity: current, score: clamp(100 - currentLoss * 100, 0, 100), iterations, candidatesEvaluated, confidence, evidence };
}

export function evaluateSensitivityLoss(pair: WeaponScopeSensitivity, goal: OptimizationGoal): number {
  return evaluateCandidate(pair, { goal, scope: pair.scope }).loss;
}
