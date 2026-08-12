import { describe, expect, it } from 'vitest';
import { allDevices } from '../data/devices';
import { weapons } from '../data/weapons';
import type { ControlLayoutCandidate, FingerAssignment, PlayerSettings, ReachCalibrationInput } from '../types';
import { buildControlSpecs, generateControlLayout, generateControlCandidatesFor, optimizeControlLayout } from './control-layout';
import { createPlayerSkillProfile } from './player-model';
import { calculateSensitivity, generateFullSensitivity } from './sensitivity-calculator';
import { getRequiredWeaponProfiles, getWeaponProfile, validateWeaponProfiles } from '../data/weapon-profiles';

const device = allDevices.find((item) => item.id === 'iphone-15-pro-max')!;
const baseSettings: PlayerSettings = {
  fingerCount: 5,
  gripStyle: 'five-claw',
  gyroscopeMode: 'always-on',
  playStyle: 'aggressive',
  skillLevel: 'advanced',
  preferredFPS: 120,
  fov: 90,
  fppView: 103
};

const assignment5: FingerAssignment = { left: ['thumb', 'index'], right: ['thumb', 'index', 'middle'] };
const assignment4: FingerAssignment = { left: ['thumb', 'index'], right: ['thumb', 'index'] };
const assignment6: FingerAssignment = { left: ['thumb', 'index', 'middle'], right: ['thumb', 'index', 'middle'] };

function geometry(layout: ReturnType<typeof generateControlLayout>): string {
  return JSON.stringify(layout.buttons.map((button) => [button.id, button.x, button.y, button.size, button.assignedHand, button.assignedFinger]));
}

function overlapCount(layout: ReturnType<typeof generateControlLayout>): number {
  let count = 0;
  for (let index = 0; index < layout.buttons.length; index += 1) {
    for (let other = index + 1; other < layout.buttons.length; other += 1) {
      const first = layout.buttons[index];
      const second = layout.buttons[other];
      const distance = Math.hypot(first.x - second.x, first.y - second.y);
      if (first.priority === 'core' && second.priority === 'core' && distance < first.size / 18 + second.size / 18) count += 1;
    }
  }
  return count;
}

describe('measured sensitivity and control optimization engine', () => {
  it('produces a valid deterministic five-finger landscape layout', () => {
    const sensitivity = calculateSensitivity(device, baseSettings);
    const first = generateControlLayout(device, baseSettings, sensitivity, assignment5, { seed: 991 });
    const second = generateControlLayout(device, baseSettings, sensitivity, assignment5, { seed: 991 });
    expect(first.analysis.passed).toBe(true);
    expect(first.buttons).toHaveLength(16);
    expect(first.screenAspectRatio).toBeGreaterThan(1);
    expect(first.optimization?.candidatesEvaluated).toBeGreaterThan(0);
    expect(geometry(first)).toBe(geometry(second));
    expect(first.score).toBe(second.score);
    const objectApi = optimizeControlLayout({ device, settings: baseSettings, assignment: assignment5, sensitivityProfile: sensitivity, seed: 991 });
    expect(objectApi.analysis.passed).toBe(true);
    expect(geometry(objectApi)).toBe(geometry(first));
  });

  it('changes geometry when the same player changes finger assignment and count', () => {
    const settings4 = { ...baseSettings, fingerCount: 4 as const, gripStyle: 'claw' as const };
    const settings6 = { ...baseSettings, fingerCount: 6 as const, gripStyle: 'full-claw' as const };
    const sensitivity5 = calculateSensitivity(device, baseSettings);
    const layout5 = generateControlLayout(device, baseSettings, sensitivity5, assignment5, { seed: 77 });
    const layout4 = generateControlLayout(device, settings4, calculateSensitivity(device, settings4), assignment4, { seed: 77 });
    const layout6 = generateControlLayout(device, settings6, calculateSensitivity(device, settings6), assignment6, { seed: 77 });
    expect(layout4.analysis.passed).toBe(true);
    expect(layout6.analysis.passed).toBe(true);
    expect(geometry(layout5)).not.toBe(geometry(layout4));
    expect(geometry(layout4)).not.toBe(geometry(layout6));
    expect(new Set(layout5.buttons.map((button) => `${button.x}:${button.y}`)).size).toBeGreaterThan(8);
  });

  it('covers the requested asymmetric five-finger and 4/6-finger scenarios', () => {
    const tournament = { ...baseSettings, playStyle: 'tournament-elite' as const };
    const assignmentB: FingerAssignment = { left: ['thumb', 'index', 'middle'], right: ['thumb', 'index'] };
    const tournamentLayout = generateControlLayout(device, tournament, calculateSensitivity(device, tournament), assignment5, { seed: 101 });
    const layoutB = generateControlLayout(device, { ...tournament, fingerCount: 5 as const }, calculateSensitivity(device, tournament), assignmentB, { seed: 101 });
    expect(tournamentLayout.analysis.passed).toBe(true);
    expect(geometry(tournamentLayout)).not.toBe(geometry(layoutB));
    expect(tournamentLayout.buttons.find((button) => button.id === 'movement')?.assignedFinger).toBe('thumb');
  });

  it('uses calibration data to change candidate ordering and final positions', () => {
    const sensitivity = calculateSensitivity(device, baseSettings);
    const specs = buildControlSpecs(baseSettings, sensitivity);
    const jump = specs.find((item) => item.id === 'jump')!;
    const defaultCandidates = generateControlCandidatesFor(jump.id, device, baseSettings, sensitivity, assignment5, { seed: 11 });
    const calibration: ReachCalibrationInput[] = [{
      hand: 'right', finger: 'middle', maximumComfortableReach: { x: 74, y: 42 }, innerReach: { x: 70, y: 38 }, outerReach: { x: 78, y: 46 }, source: 'measured', sampleCount: 6
    }];
    const calibratedCandidates = generateControlCandidatesFor(jump.id, device, baseSettings, sensitivity, assignment5, { seed: 11, reachCalibration: calibration });
    expect(calibratedCandidates[0].x).not.toBe(defaultCandidates[0].x);
    const defaultLayout = generateControlLayout(device, baseSettings, sensitivity, assignment5, { seed: 11 });
    const calibratedLayout = generateControlLayout(device, baseSettings, sensitivity, assignment5, { seed: 11, reachCalibration: calibration });
    expect(geometry(defaultLayout)).not.toBe(geometry(calibratedLayout));
    expect(calibratedLayout.rationale.some((item) => item.en.includes('calibrated'))).toBe(true);
  });

  it('repairs a forced core-button collision instead of accepting it', () => {
    const sensitivity = calculateSensitivity(device, baseSettings);
    const forced = (id: 'fire' | 'movement', hand: 'left' | 'right', finger: 'thumb' | 'index' | 'middle'): ControlLayoutCandidate => ({
      id: `forced-${id}`, buttonId: id, x: 50, y: 50, size: 120, assignedHand: hand, assignedFinger: finger, sourceZone: `${hand}-${finger}`, rank: 0
    });
    const layout = generateControlLayout(device, baseSettings, sensitivity, assignment5, {
      seed: 901,
      candidateOverrides: {
        movement: [forced('movement', 'left', 'thumb')],
        fire: [forced('fire', 'left', 'thumb')]
      }
    });
    expect(layout.analysis.passed).toBe(true);
    expect(overlapCount(layout)).toBe(0);
    expect(layout.optimization?.warnings.some((warning) => warning.type === 'overlap' && warning.severity === 'error')).toBe(false);
  });

  it('separates weapon and system sensitivity for M416, AKM, Beryl, M24, and AWM', () => {
    const profile = generateFullSensitivity(device, baseSettings);
    const ids = ['m416', 'akm', 'm762', 'm24', 'awm'];
    const table = ids.map((id) => {
      const result = profile.weaponSensitivities.find((item) => item.weapon.id === id)!;
      const scopes = ['redDot', 'x4', 'x8'] as const;
      return scopes.flatMap((scope) => {
        const value = result.values.find((item) => item.scope === scope);
        return value ? [value.camera, value.ads, value.gyroscope, value.adsGyroscope] : [];
      });
    });
    expect(table.every((row) => row.length > 0)).toBe(true);
    expect(new Set(table.map((row) => row.join(','))).size).toBeGreaterThan(2);
    const akm = profile.weaponSensitivities.find((item) => item.weapon.id === 'akm')!.values.find((item) => item.scope === 'redDot')!;
    const m416 = profile.weaponSensitivities.find((item) => item.weapon.id === 'm416')!.values.find((item) => item.scope === 'redDot')!;
    const m24 = profile.weaponSensitivities.find((item) => item.weapon.id === 'm24')!.values.find((item) => item.scope === 'x8')!;
    expect(akm.gyroscope).toBeGreaterThan(m416.gyroscope);
    expect(m24.ads).toBeLessThan(akm.ads);
  });

  it('changes the sensitivity model for measured experiments without pretending priors are measured', () => {
    const baseline = generateFullSensitivity(device, baseSettings);
    const measuredSettings: PlayerSettings = {
      ...baseSettings,
      sensitivityExperiments: [{
        id: 'measured-1', sensitivityVector: baseline.sensitivity, weapon: 'm416', scope: 'redDot', testType: 'tracking',
        trackingAccuracy: 0.92, targetAcquisitionTime: 280, overshootRate: 0.04, undershootRate: 0.02, recoilDeviation: 0.16,
        horizontalDeviation: 0.10, headshotRate: 0.88, correctionCount: 2, sampleCount: 30, confidence: 0.9, source: 'measured'
      }]
    };
    const measured = generateFullSensitivity(device, measuredSettings);
    expect(measured.playerModel?.skillProfile.trackingScore.source).toBe('measured');
    expect(measured.playerModel?.skillProfile.sampleCount).toBeGreaterThan(0);
    expect(measured.sensitivityOptimization?.evidence).toBe('measured');
    expect(measured.sensitivity).not.toEqual(baseline.sensitivity);
    expect(measured.playerModel?.skillProfile.gyroControlScore.source).toBe('estimated');
  });

  it('responds to low/high evidence and low/high gyro-control profiles', () => {
    const lowSettings: PlayerSettings = {
      ...baseSettings,
      sensitivityExperiments: [{
        id: 'low-sensitivity', sensitivityVector: calculateSensitivity(device, baseSettings), weapon: 'm416', scope: 'redDot', testType: 'aim-acquisition',
        trackingAccuracy: 0.30, targetAcquisitionTime: 900, overshootRate: 0.02, undershootRate: 0.55, recoilDeviation: 0.40,
        horizontalDeviation: 0.30, headshotRate: 0.25, correctionCount: 6, sampleCount: 20, confidence: 0.85, source: 'measured'
      }]
    };
    const highSettings: PlayerSettings = {
      ...baseSettings,
      sensitivityExperiments: [{
        id: 'high-sensitivity', sensitivityVector: calculateSensitivity(device, baseSettings), weapon: 'm416', scope: 'redDot', testType: 'flick-control',
        trackingAccuracy: 0.86, targetAcquisitionTime: 260, overshootRate: 0.42, undershootRate: 0.03, recoilDeviation: 0.12,
        horizontalDeviation: 0.10, headshotRate: 0.82, correctionCount: 9, sampleCount: 20, confidence: 0.85, source: 'measured'
      }]
    };
    const low = generateFullSensitivity(device, lowSettings);
    const high = generateFullSensitivity(device, highSettings);
    expect(low.sensitivity).not.toEqual(high.sensitivity);
    expect(low.sensitivityOptimization?.evidence).toBe('measured');
    expect(high.sensitivityOptimization?.evidence).toBe('measured');

    const estimated = createPlayerSkillProfile(baseSettings);
    const lowGyro = { ...estimated, gyroControlScore: { ...estimated.gyroControlScore, score: 0.25, source: 'user-provided' as const, sampleCount: 10, confidence: 0.9 } };
    const highGyro = { ...estimated, gyroControlScore: { ...estimated.gyroControlScore, score: 0.90, source: 'user-provided' as const, sampleCount: 10, confidence: 0.9 } };
    const lowGyroSettings = { ...baseSettings, skillProfile: lowGyro };
    const highGyroSettings = { ...baseSettings, skillProfile: highGyro };
    expect(calculateSensitivity(device, lowGyroSettings).gyroscope.redDot).not.toBe(calculateSensitivity(device, highGyroSettings).gyroscope.redDot);
  });

  it('keeps gyro systems distinct and off means zero, while expert profiles remain labelled', () => {
    const sensitivity = calculateSensitivity(device, baseSettings);
    expect(sensitivity.gyroscope.noScope).not.toBe(sensitivity.adsGyroscope.noScope);
    expect(sensitivity.gyroscope.noScope).not.toBe(sensitivity.gyroscope.x8);
    const offSettings = { ...baseSettings, gyroscopeMode: 'off' as const };
    const off = calculateSensitivity(device, offSettings);
    expect(off.gyroscope.noScope).toBe(0);
    expect(off.adsGyroscope.x4).toBe(0);
    expect(validateWeaponProfiles()).toEqual([]);
    expect(getRequiredWeaponProfiles()).toHaveLength(19);
    expect(weapons.some((weapon) => weapon.id === 'famas')).toBe(true);
    expect(getWeaponProfile('m416')?.source).toBe('expert-defined-normalized');
    expect(getWeaponProfile('m416')?.measured).toBe(false);
  });
});
