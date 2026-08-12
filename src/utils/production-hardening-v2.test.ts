import { describe, expect, it, vi } from 'vitest';
import { allDevices } from '../data/devices';
import { buildControlSpecs, buildReachZones, DEFAULT_OPTIMIZER_WEIGHTS, generateControlCandidatesFor, generateControlLayout, getLandscapeCoordinateSystem, getSafeArea, optimizeControlLayout, validateControls } from './control-layout';
import { createPlayerSkillProfile, buildPlayerModel } from './player-model';
import { calculateSensitivity, generateFullSensitivity } from './sensitivity-calculator';
import { evaluateCandidate, generateCandidates, optimizeSensitivity, rankCandidates } from './sensitivity-optimizer';
import { measurementToSensitivityExperiment, validateSensitivityExperiment } from './measurement-validator';
import { getWeaponProfile } from '../data/weapon-profiles';
import type { ControlButtonLayout, FingerAssignment, PlayerSettings, PlayerSkillProfile, SensitivityExperiment, WeaponProfile } from '../types';

vi.setConfig({ testTimeout: 30000 });

const device = allDevices.find((item) => item.id === 'iphone-15-pro-max')!;
const settings: PlayerSettings = {
  fingerCount: 5,
  gripStyle: 'five-claw',
  gyroscopeMode: 'always-on',
  playStyle: 'aggressive',
  skillLevel: 'advanced',
  preferredFPS: 120,
  fov: 90,
  fppView: 103
};
const assignment: FingerAssignment = { left: ['thumb', 'index'], right: ['thumb', 'index', 'middle'] };

function pair(profile: ReturnType<typeof generateFullSensitivity>, weaponId: string, scope: 'redDot' | 'x3' | 'x4' | 'x6' | 'x8') {
  return profile.weaponSensitivities.find((result) => result.weapon.id === weaponId)!.values.find((value) => value.scope === scope)!;
}

function metric(score: number, source: 'user-provided' | 'measured' = 'user-provided') {
  return { score, source, sampleCount: 20, confidence: 0.9 } as const;
}

function skillSettings(changes: Partial<Record<keyof PlayerSkillProfile, number>>): PlayerSettings {
  const original = createPlayerSkillProfile(settings);
  const skill = { ...original } as PlayerSkillProfile;
  for (const [key, score] of Object.entries(changes)) {
    const current = skill[key as keyof PlayerSkillProfile];
    if (typeof current === 'object' && current !== null && 'score' in current) {
      (skill as any)[key] = { ...current, ...metric(score) };
    }
  }
  return { ...settings, skillProfile: skill };
}

function layoutContext(currentSettings: PlayerSettings, sensitivity: ReturnType<typeof calculateSensitivity>, currentAssignment = assignment, reachCalibration: any[] = []): any {
  const model = buildPlayerModel(device, currentSettings, currentAssignment);
  return {
    device,
    settings: currentSettings,
    assignment: currentAssignment,
    sensitivity,
    playerModel: model,
    coordinateSystem: getLandscapeCoordinateSystem(device),
    safeArea: getSafeArea(device),
    reachZones: buildReachZones(device, currentAssignment, reachCalibration),
    specs: buildControlSpecs(currentSettings, sensitivity),
    weights: DEFAULT_OPTIMIZER_WEIGHTS,
    seed: 91
  };
}

function layoutButton(id: ControlButtonLayout['id'], hand: 'left' | 'right', finger: ControlButtonLayout['assignedFinger'], priority: ControlButtonLayout['priority'], x = 40, y = 40, size = 90): ControlButtonLayout {
  return { id, label: id, labelAr: id, assignedHand: hand, assignedFinger: finger, priority, x, y, size, reason: { en: '', ar: '' } };
}

function hardLayoutStats(layout: ReturnType<typeof generateControlLayout>) {
  const hard = layout.hardViolations;
  const combatOverlap = layout.analysis.conflicts.filter((item) => item.type === 'overlap' && item.severity === 'error').length;
  return {
    hardViolations: hard.length,
    combatOverlaps: combatOverlap,
    safeAreaViolations: hard.filter((item) => item.type === 'safe-area').length,
    criticalReachViolations: hard.filter((item) => item.type === 'unreachable').length,
    simultaneousConflicts: hard.filter((item) => item.type === 'simultaneous-conflict').length
  };
}

describe('production hardening v2 behavior', () => {
  it('rejects hard interaction violations and returns a valid 4/5/6-finger result only when clean', () => {
    const sensitivity = calculateSensitivity(device, settings);
    for (const [fingerCount, gripStyle, currentAssignment] of [
      [4, 'claw', { left: ['thumb', 'index'], right: ['thumb', 'index'] }],
      [5, 'five-claw', assignment],
      [6, 'full-claw', { left: ['thumb', 'index', 'middle'], right: ['thumb', 'index', 'middle'] }]
    ] as const) {
      const currentSettings = { ...settings, fingerCount, gripStyle } as PlayerSettings;
      const layout = generateControlLayout(device, currentSettings, sensitivity, currentAssignment as FingerAssignment, { seed: 91 });
      const stats = hardLayoutStats(layout);
      expect(layout.valid).toBe(true);
      expect(layout.analysis.passed).toBe(true);
      expect(layout.buttons).toHaveLength(16);
      expect(stats.hardViolations).toBe(0);
      expect(stats.combatOverlaps).toBe(0);
      expect(stats.safeAreaViolations).toBe(0);
      expect(stats.criticalReachViolations).toBe(0);
      expect(stats.simultaneousConflicts).toBe(0);
    }
  });

  it('returns explicit failure and no buttons when no hard-valid layout exists', () => {
    const currentSettings = { ...settings, fingerCount: 2 as const, gripStyle: 'thumbs' as const };
    const layout = generateControlLayout(device, currentSettings, calculateSensitivity(device, currentSettings), { left: ['thumb'], right: ['thumb'] }, { seed: 91 });
    expect(layout.valid).toBe(false);
    expect(layout.analysis.passed).toBe(false);
    expect(layout.buttons).toEqual([]);
    expect(layout.optimization?.failureReason).toBeDefined();
  });

  it('propagates small versus large reach calibration into global optimization', () => {
    const sensitivity = calculateSensitivity(device, settings);
    const small = [{ hand: 'left' as const, finger: 'thumb' as const, maximumComfortableReach: { x: 18, y: 78 }, innerReach: { x: 17, y: 77 }, outerReach: { x: 19, y: 79 }, upperReach: { x: 18, y: 77 }, lowerReach: { x: 18, y: 79 }, source: 'measured' as const, sampleCount: 5 }];
    const large = [{ hand: 'left' as const, finger: 'thumb' as const, maximumComfortableReach: { x: 18, y: 78 }, innerReach: { x: 5, y: 60 }, outerReach: { x: 35, y: 90 }, upperReach: { x: 18, y: 55 }, lowerReach: { x: 18, y: 98 }, source: 'measured' as const, sampleCount: 5 }];
    const smallCandidates = generateControlCandidatesFor('movement', device, settings, sensitivity, assignment, { seed: 91, reachCalibration: small });
    const largeCandidates = generateControlCandidatesFor('movement', device, settings, sensitivity, assignment, { seed: 91, reachCalibration: large });
    const smallLayout = generateControlLayout(device, settings, sensitivity, assignment, { seed: 91, reachCalibration: small });
    const largeLayout = generateControlLayout(device, settings, sensitivity, assignment, { seed: 91, reachCalibration: large });
    expect(smallCandidates[0].x).not.toBe(largeCandidates[0].x);
    expect(smallCandidates[0].y).not.toBe(largeCandidates[0].y);
    expect(smallLayout.score).not.toBe(largeLayout.score);
    expect(smallLayout.optimization?.scoreBreakdown.reachScore).not.toBe(largeLayout.optimization?.scoreBreakdown.reachScore);
  });

  it('makes reaction and acquisition metrics affect Camera/ADS with one-factor changes', () => {
    const baseline = generateFullSensitivity(device, settings);
    const changed = generateFullSensitivity(device, skillSettings({ reactionScore: 0.95, aimAcquisition: 0.95 }));
    const before = pair(baseline, 'm416', 'redDot');
    const after = pair(changed, 'm416', 'redDot');
    expect(after.camera).not.toBe(before.camera);
    expect(after.ads).not.toBe(before.ads);
  });

  it('makes close, mid, and long range metrics affect their scope bands', () => {
    const baseline = generateFullSensitivity(device, settings);
    const close = generateFullSensitivity(device, skillSettings({ closeRangeScore: 0.95 }));
    const mid = generateFullSensitivity(device, skillSettings({ midRangeScore: 0.95 }));
    const long = generateFullSensitivity(device, skillSettings({ longRangeScore: 0.95 }));
    expect(pair(close, 'm416', 'redDot').camera).not.toBe(pair(baseline, 'm416', 'redDot').camera);
    expect(pair(mid, 'm416', 'x3').adsGyroscope).not.toBe(pair(baseline, 'm416', 'x3').adsGyroscope);
    expect(pair(long, 'm416', 'x6').adsGyroscope).not.toBe(pair(baseline, 'm416', 'x6').adsGyroscope);
  });

  it('makes ADS control affect ADS and ADS Gyroscope only', () => {
    const baseline = generateFullSensitivity(device, settings);
    const changed = generateFullSensitivity(device, skillSettings({ adsControl: 0.95 }));
    const before = pair(baseline, 'm416', 'redDot');
    const after = pair(changed, 'm416', 'redDot');
    expect(after.ads).not.toBe(before.ads);
  });

  it('makes Gyro and ADS Gyro sensitivity influence relevant layout controls', () => {
    const sensitivity = calculateSensitivity(device, settings);
    const gyroOnly = { ...sensitivity, gyroscope: { ...sensitivity.gyroscope, noScope: sensitivity.gyroscope.noScope + 70, redDot: sensitivity.gyroscope.redDot + 70 } };
    const adsGyroOnly = { ...sensitivity, adsGyroscope: { ...sensitivity.adsGyroscope, noScope: sensitivity.adsGyroscope.noScope + 70, redDot: sensitivity.adsGyroscope.redDot + 70 } };
    const normal = generateControlLayout(device, settings, sensitivity, assignment, { seed: 91 });
    const gyroLayout = generateControlLayout(device, settings, gyroOnly, assignment, { seed: 91 });
    const adsGyroLayout = generateControlLayout(device, settings, adsGyroOnly, assignment, { seed: 91 });
    const relevant = new Set(['fire', 'aim', 'scope', 'peekLeft', 'peekRight']);
    const gyroRelevantChanged = normal.buttons.some((button, index) => relevant.has(button.id) && button.sensitivityInteractionScore !== gyroLayout.buttons[index].sensitivityInteractionScore);
    const adsGyroRelevantChanged = normal.buttons.some((button, index) => relevant.has(button.id) && button.sensitivityInteractionScore !== adsGyroLayout.buttons[index].sensitivityInteractionScore);
    expect(gyroRelevantChanged).toBe(true);
    expect(adsGyroRelevantChanged).toBe(true);
    const unrelatedChanged = normal.buttons.some((button, index) => !relevant.has(button.id) && (button.sensitivityInteractionScore !== gyroLayout.buttons[index].sensitivityInteractionScore || button.sensitivityInteractionScore !== adsGyroLayout.buttons[index].sensitivityInteractionScore));
    expect(unrelatedChanged).toBe(false);
  });

  it('uses all previously unused Weapon Profile fields in sensitivity optimization', () => {
    const profile = generateFullSensitivity(device, settings);
    const basePair = pair(profile, 'm416', 'redDot');
    const baseProfile = getWeaponProfile('m416')!;
    const context = { settings, skillProfile: createPlayerSkillProfile(settings), weaponId: 'm416', scope: 'redDot' as const, basePair };
    const variants: WeaponProfile[] = [
      { ...baseProfile, trackingDemand: 0.99 },
      { ...baseProfile, scopeUsage: { ...baseProfile.scopeUsage, redDot: 0.50 } },
      { ...baseProfile, burstCharacteristics: { ...baseProfile.burstCharacteristics, recoveryDemand: 0.99 } },
      { ...baseProfile, effectiveEngagementRange: { ...baseProfile.effectiveEngagementRange, optimalMeters: 300 } }
    ];
    for (const variant of variants) {
      const result = optimizeSensitivity(basePair, { ...context, weaponProfile: variant });
      expect(result.value).not.toEqual(optimizeSensitivity(basePair, { ...context, weaponProfile: baseProfile }).value);
    }
  });

  it('enforces required hand/finger while keeping preferred semantics soft', () => {
    const sensitivity = calculateSensitivity(device, settings);
    const specs = buildControlSpecs(settings, sensitivity).map((spec) => spec.id === 'aim' ? { ...spec, requiredHand: 'right' as const, requiredFinger: 'thumb' as const, forbiddenHands: ['left' as const], forbiddenFingers: ['index' as const] } : spec);
    const layout = optimizeControlLayout({ device, settings, assignment, sensitivityProfile: sensitivity, controlSpecs: specs, seed: 91 });
    const aim = layout.buttons.find((button) => button.id === 'aim');
    expect(layout.valid).toBe(true);
    expect(aim?.assignedHand).toBe('right');
    expect(aim?.assignedFinger).toBe('thumb');
  });

  it('exposes bounded global candidate evaluations and rejection reasons', () => {
    const sensitivity = calculateSensitivity(device, settings);
    const layout = generateControlLayout(device, settings, sensitivity, assignment, { seed: 91 });
    expect(layout.optimization?.topCandidates?.length).toBeGreaterThan(0);
    expect(layout.optimization?.topCandidates?.length).toBeLessThanOrEqual(12);
    expect(layout.optimization?.representativeRejectedCandidates?.length).toBeGreaterThan(0);
    expect(Object.keys(layout.optimization?.rejectionStatistics ?? {}).length).toBeGreaterThan(0);
    expect(layout.optimization?.representativeRejectedCandidates?.[0].rejectionReasons.length).toBeGreaterThan(0);
    expect(layout.optimization?.topCandidates?.[0].componentScores).toBeDefined();
    expect(layout.optimization?.bestCandidate?.accepted).toBe(true);
    expect(layout.optimization?.bestCandidate?.totalScore).toBe(layout.score);
  });

  it('ranks sensitivity candidates by different scores', () => {
    const profile = generateFullSensitivity(device, settings);
    const basePair = pair(profile, 'm416', 'redDot');
    const context = { settings, skillProfile: createPlayerSkillProfile(settings), weaponProfile: getWeaponProfile('m416'), weaponId: 'm416', scope: 'redDot' as const, basePair, seed: 1 };
    const candidates = generateCandidates(basePair, context);
    const ranked = rankCandidates(candidates, context);
    expect(candidates.length).toBeGreaterThan(10);
    expect(new Set(ranked.map((item) => item.evaluation.score)).size).toBeGreaterThan(1);
    expect(ranked[0].evaluation.loss).toBeLessThanOrEqual(ranked[ranked.length - 1].evaluation.loss);
    expect(evaluateCandidate(ranked[0].candidate, context).score).toBe(ranked[0].evaluation.score);
  });

  it('uses sensitivity seed in exploration order while preserving same-seed determinism', () => {
    const profile = generateFullSensitivity(device, settings);
    const basePair = pair(profile, 'm416', 'redDot');
    const context = { settings, skillProfile: createPlayerSkillProfile(settings), weaponProfile: getWeaponProfile('m416'), weaponId: 'm416', scope: 'redDot' as const, basePair };
    const seedA = optimizeSensitivity(basePair, { ...context, seed: 1 });
    const seedB = optimizeSensitivity(basePair, { ...context, seed: 2 });
    const seedARepeat = optimizeSensitivity(basePair, { ...context, seed: 1 });
    expect(seedA.explorationOrder).not.toEqual(seedB.explorationOrder);
    expect(seedA.value).toEqual(seedARepeat.value);
    expect(seedA.explorationOrder).toEqual(seedARepeat.explorationOrder);
  });

  it('rejects invalid experiments and weights high confidence more strongly', () => {
    const invalid: SensitivityExperiment = {
      id: 'bad', sensitivityVector: calculateSensitivity(device, settings), weapon: 'm416', scope: 'redDot', testType: 'tracking', trackingAccuracy: 2, sampleCount: 0, confidence: 2, source: 'measured'
    };
    expect(validateSensitivityExperiment(invalid).length).toBeGreaterThan(0);
    const baseline = generateFullSensitivity(device, settings);
    const baseVector = baseline.sensitivity;
    const converted = measurementToSensitivityExperiment({ id: 'valid-conversion', weaponId: 'm416', scope: 'redDot', distanceMeters: 50, shots: 20, verticalError: 10, horizontalError: 8, headshots: 8, shotsHit: 12, targetAcquisitionMs: 400, overshoots: 2, recordedAt: '2026-08-12T00:00:00.000Z' }, baseVector);
    expect(validateSensitivityExperiment(converted)).toEqual([]);
    const make = (confidence: number): SensitivityExperiment => ({ id: `confidence-${confidence}`, sensitivityVector: baseVector, weapon: 'm416', scope: 'redDot', testType: 'tracking', trackingAccuracy: 0.15, targetAcquisitionTime: 1000, overshootRate: 0.5, undershootRate: 0.8, recoilDeviation: 0.7, horizontalDeviation: 0.6, headshotRate: 0.2, correctionCount: 10, sampleCount: 20, confidence, source: 'measured' });
    const low = generateFullSensitivity(device, { ...settings, sensitivityExperiments: [make(0.1)] });
    const high = generateFullSensitivity(device, { ...settings, sensitivityExperiments: [make(0.95)] });
    const before = pair(baseline, 'm416', 'redDot');
    const lowDelta = Math.abs(pair(low, 'm416', 'redDot').ads - before.ads);
    const highDelta = Math.abs(pair(high, 'm416', 'redDot').ads - before.ads);
    expect(highDelta).toBeGreaterThan(lowDelta);
  });

  it('marks optimizer weights as expert-defined and not statistically calibrated', () => {
    const sensitivity = calculateSensitivity(device, settings);
    const layout = generateControlLayout(device, settings, sensitivity, assignment, { seed: 91 });
    expect(layout.optimization?.weightProvenance).toBeDefined();
    expect(Object.values(layout.optimization?.weightProvenance ?? {}).every((item) => item.calibrated === false)).toBe(true);
  });

  it('classifies manual safe-area and simultaneous violations as hard errors', () => {
    const sensitivity = calculateSensitivity(device, settings);
    const analysis = { ...generateControlLayout(device, settings, sensitivity, assignment, { seed: 91 }).analysis };
    const context = layoutContext(settings, sensitivity);
    const specs = buildControlSpecs(settings, sensitivity);
    const outside = layoutButton('movement', 'left', 'thumb', 'core', 0, 0, 120);
    const fire = layoutButton('fire', 'left', 'index', 'core');
    const scope = layoutButton('scope', 'left', 'index', 'combat', 70, 40);
    const outsideViolations = validateControls([outside], analysis, specs, context);
    const simultaneousViolations = validateControls([fire, scope], analysis, specs, context);
    expect(outsideViolations.some((item) => item.type === 'safe-area' && item.severity === 'error')).toBe(true);
    expect(outsideViolations.some((item) => item.type === 'unreachable' && item.severity === 'error')).toBe(true);
    expect(simultaneousViolations.some((item) => item.type === 'simultaneous-conflict' && item.severity === 'error')).toBe(true);
  });
});
