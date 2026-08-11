import { describe, expect, it } from 'vitest';
import { allDevices } from '../data/devices';
import { weapons } from '../data/weapons';
import { calculateSensitivity, generateFullSensitivity } from './sensitivity-calculator';
import { calculateAllWeaponSensitivities } from './weapon-sensitivity-calculator';
import { calculateSensitivityConfidence } from './confidence';

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

describe('confidence model', () => {
  it('stores global and weapon results in one canonical generated profile', () => {
    const result = generateFullSensitivity(device, settings);
    expect(result.sensitivity.camera.redDot).toBeGreaterThan(0);
    expect(result.weaponSensitivities).toHaveLength(weapons.length);
    expect(result.confidence.score).toBeGreaterThan(0);
  });

  it('is bounded and increases after empirical calibration', () => {
    const base = calculateSensitivity(device, settings);
    const results = calculateAllWeaponSensitivities(weapons, device, settings, base);
    const before = calculateSensitivityConfidence(device, results, 0);
    const after = calculateSensitivityConfidence(device, results, 3);

    expect(before.score).toBeGreaterThanOrEqual(0);
    expect(before.score).toBeLessThanOrEqual(100);
    expect(after.score).toBeGreaterThan(before.score);
    expect(before.caveats.length).toBeGreaterThan(0);
  });
});
