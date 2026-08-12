import { describe, expect, it } from 'vitest';
import { allDevices } from '../data/devices';
import { calculateSprintSensitivity, generateFullSensitivity } from './sensitivity-calculator';
import { applyManualOverride, resetManualOverrides } from './manual-adjustments';

const device = allDevices.find((item) => item.id === 'iphone-15-pro-max')!;
const settings = {
  fingerCount: 4 as const,
  gripStyle: 'claw' as const,
  gyroscopeMode: 'always-on' as const,
  playStyle: 'balanced' as const,
  skillLevel: 'advanced' as const,
  preferredFPS: 120 as const,
  fov: 90 as const,
  fppView: 103 as const
};

describe('manual profile overrides', () => {
  it('updates the global value and preserves weapon offsets for the same scope', () => {
    const profile = generateFullSensitivity(device, settings);
    const before = profile.weaponSensitivities.find((result) => result.weapon.id === 'qbz')!.values.find((value) => value.scope === 'redDot')!;
    const updated = applyManualOverride(profile, 'ads', 'redDot', profile.sensitivity.ads.redDot + 5);
    const after = updated.weaponSensitivities.find((result) => result.weapon.id === 'qbz')!.values.find((value) => value.scope === 'redDot')!;

    expect(updated.sensitivity.ads.redDot).toBe(profile.sensitivity.ads.redDot + 5);
    expect(after.ads - before.ads).toBe(5);
  });

  it('keeps Sprint Sensitivity within PUBG Mobile limits', () => {
    expect(calculateSprintSensitivity(device, settings)).toBeLessThanOrEqual(100);
  });

  it('uses TPP/FPP camera view as separate sensitivity inputs', () => {
    const standard = generateFullSensitivity(device, settings);
    const narrowTPP = generateFullSensitivity(device, { ...settings, fov: 80 as const, fppView: 103 as const });
    expect(narrowTPP.sensitivity.camera.redDot).not.toBe(standard.sensitivity.camera.redDot);
    expect(narrowTPP.playerSettings.fppView).toBe(103);
  });

  it('can restore the canonical baseline', () => {
    const profile = generateFullSensitivity(device, settings);
    const updated = applyManualOverride(profile, 'camera', 'x3', 1);
    const restored = resetManualOverrides(updated);
    expect(restored.sensitivity).toEqual(profile.baselineSensitivity);
  });
});
