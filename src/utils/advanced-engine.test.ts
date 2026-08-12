import { describe, expect, it } from 'vitest';
import { allDevices } from '../data/devices';
import { weapons } from '../data/weapons';
import { generateFullSensitivity } from './sensitivity-calculator';
import { optimizeWeaponPair, OPTIMIZATION_GOALS } from './sensitivity-optimizer';
import { createDefaultPersonalization, updatePersonalization } from './personalization';
import { validateMeasurement, summarizeMeasurements } from './measurement-validator';

const device = allDevices.find((item) => item.id === 'iphone-15-pro-max')!;
const settings = { fingerCount: 4 as const, gripStyle: 'claw' as const, gyroscopeMode: 'always-on' as const, playStyle: 'balanced' as const, skillLevel: 'advanced' as const, preferredFPS: 120 as const, fov: 90 as const, fppView: 103 as const };

describe('phase five to seven engines', () => {
  it('optimizes a pair deterministically inside bounds', () => {
    const profile = generateFullSensitivity(device, settings);
    const pair = profile.weaponSensitivities.find((result) => result.weapon.id === 'qbz')!.values.find((value) => value.scope === 'redDot')!;
    const optimized = optimizeWeaponPair(pair, OPTIMIZATION_GOALS[0]);
    expect(optimized.camera).toBeGreaterThanOrEqual(1);
    expect(optimized.camera).toBeLessThanOrEqual(200);
    expect(optimizeWeaponPair(pair, OPTIMIZATION_GOALS[0])).toEqual(optimized);
  });

  it('updates Bayesian personalization after calibration evidence', () => {
    const before = createDefaultPersonalization();
    const after = updatePersonalization(before, 'undershoot', 3);
    expect(after.ads.observations).toBe(1);
    expect(after.ads.mean).toBeGreaterThan(before.ads.mean);
  });

  it('validates and summarizes Training Ground measurements', () => {
    const measurement = {
      id: 'm1', weaponId: 'qbz', scope: 'redDot' as const, distanceMeters: 50 as const, shots: 20 as const,
      verticalError: 0.2, horizontalError: 0.1, headshots: 8, shotsHit: 15, targetAcquisitionMs: 320, overshoots: 2, recordedAt: new Date().toISOString()
    };
    expect(validateMeasurement(measurement)).toEqual([]);
    expect(summarizeMeasurements([measurement])?.headshotRate).toBeCloseTo(8 / 15);
    expect(weapons.some((weapon) => weapon.id === 'qbz')).toBe(true);
  });
});
