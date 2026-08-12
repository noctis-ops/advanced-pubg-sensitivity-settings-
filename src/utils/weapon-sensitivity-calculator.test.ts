import { describe, expect, it } from 'vitest';
import { allDevices } from '../data/devices';
import { weapons } from '../data/weapons';
import { calculateSensitivity } from './sensitivity-calculator';
import type { ScopeId } from '../types';
import {
  calculateAllWeaponSensitivities,
  validateWeapon
} from './weapon-sensitivity-calculator';

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

const device = allDevices.find((item) => item.id === 'iphone-15-pro-max')!;

describe('canonical weapon/scope calculator', () => {
  it('validates every weapon and produces only supported pairs', () => {
    const base = calculateSensitivity(device, settings);
    const results = calculateAllWeaponSensitivities(weapons, device, settings, base);

    expect(results).toHaveLength(weapons.length);
    expect(results.every((result) => result.valid)).toBe(true);
    expect(results.find((result) => result.weapon.id === 'akm')?.values.some((value) => value.scope === 'x8')).toBe(false);
    expect(results.find((result) => result.weapon.id === 's1897')?.values.map((value) => value.scope)).toEqual([
      'noScope', 'redDot'
    ]);
    expect(results.find((result) => result.weapon.id === 'akm')?.aimFeatures.camera.aimTPP).toBeGreaterThan(0);
  });

  it('is deterministic for identical inputs', () => {
    const base = calculateSensitivity(device, settings);
    const first = calculateAllWeaponSensitivities(weapons, device, settings, base);
    const second = calculateAllWeaponSensitivities(weapons, device, settings, base);

    expect(second).toEqual(first);
  });

  it('keeps every generated value in the game limits', () => {
    const base = calculateSensitivity(device, settings);
    const results = calculateAllWeaponSensitivities(weapons, device, settings, base);

    for (const result of results) {
      for (const value of result.values) {
        expect(value.camera).toBeGreaterThanOrEqual(1);
        expect(value.camera).toBeLessThanOrEqual(200);
        expect(value.ads).toBeGreaterThanOrEqual(1);
        expect(value.ads).toBeLessThanOrEqual(200);
        expect(value.gyroscope).toBeGreaterThanOrEqual(0);
        expect(value.gyroscope).toBeLessThanOrEqual(400);
        expect(value.adsGyroscope).toBeGreaterThanOrEqual(0);
        expect(value.adsGyroscope).toBeLessThanOrEqual(400);
      }
    }
  });

  it('keeps scopes meaningfully different and responds to the device', () => {
    const base = calculateSensitivity(device, settings);
    const results = calculateAllWeaponSensitivities(weapons, device, settings, base);
    const akm = results.find((result) => result.weapon.id === 'akm')!;
    const adsValues = akm.values.map((value) => value.ads);
    expect(new Set(adsValues).size).toBeGreaterThan(3);

    const lowDevice = allDevices.find((item) => item.id === 'samsung-a14')!;
    const lowSettings = { ...settings, preferredFPS: 30 as const };
    const lowBase = calculateSensitivity(lowDevice, lowSettings);
    const lowAkm = calculateAllWeaponSensitivities(weapons, lowDevice, lowSettings, lowBase)
      .find((result) => result.weapon.id === 'akm')!;
    expect(lowAkm.values).not.toEqual(akm.values);
  });

  it('makes close-aggressive asymmetric by scope', () => {
    const closeSettings = { ...settings, playStyle: 'close-aggressive' as const };
    const closeBase = calculateSensitivity(device, closeSettings);
    const result = calculateAllWeaponSensitivities(weapons, device, closeSettings, closeBase)
      .find((item) => item.weapon.id === 'qbz')!;
    const noScope = result.values.find((value) => value.scope === 'noScope')!;
    const x6 = result.values.find((value) => value.scope === 'x6')!;
    expect(noScope.factors.headshotFocus).toBeGreaterThan(1);
    expect(noScope.ads).toBeGreaterThan(x6.ads);
    expect(x6.factors.scopeZoom).toBe(6);
  });

  it('keeps the tournament profile fast near and precise at high zoom', () => {
    const tournamentSettings = { ...settings, playStyle: 'tournament-elite' as const };
    const base = calculateSensitivity(device, tournamentSettings);
    const result = calculateAllWeaponSensitivities(weapons, device, tournamentSettings, base)
      .find((item) => item.weapon.id === 'qbz')!;
    const redDot = result.values.find((value) => value.scope === 'redDot')!;
    const x6 = result.values.find((value) => value.scope === 'x6')!;
    expect(redDot.factors.headshotFocus).toBeGreaterThan(1);
    expect(x6.factors.headshotFocus).toBeGreaterThan(1);
    expect(redDot.ads).toBeGreaterThan(x6.ads);
  });

  it('returns zero gyro recommendations when gyro is disabled', () => {
    const noGyroSettings = { ...settings, gyroscopeMode: 'off' as const };
    const base = calculateSensitivity(device, noGyroSettings);
    const akm = calculateAllWeaponSensitivities(weapons, device, noGyroSettings, base)
      .find((result) => result.weapon.id === 'akm')!;

    expect(akm.values.every((value) => value.gyroscope === 0 && value.adsGyroscope === 0)).toBe(true);
  });

  it('rejects an invalid unsupported scope configuration', () => {
    const invalidWeapon = {
      ...weapons.find((weapon) => weapon.id === 's1897')!,
      scopeCompatibility: ['noScope', 'x8'] as ScopeId[]
    };

    expect(validateWeapon(invalidWeapon)).not.toHaveLength(0);
  });
});
