import { describe, expect, it } from 'vitest';
import { calculateCalibrationAdjustment, applyCalibrationToPair } from './calibration';
import type { WeaponScopeSensitivity } from '../types';

describe('training-ground calibration', () => {
  const pair: WeaponScopeSensitivity = {
    scope: 'redDot',
    camera: 70,
    ads: 55,
    gyroscope: 350,
    adsGyroscope: 340,
    factors: {
      recoilLoad: 0.5,
      fireRateLoad: 0.5,
      stability: 0.6,
      deviceNormalFactor: 1,
      deviceGyroFactor: 1,
      attachmentSupport: 1,
      scopeZoom: 1,
      headshotFocus: 1,
      spreadLoad: 0,
      firstShotLoad: 0
    },
    reason: { en: '', ar: '' },
    headshotTip: { en: '', ar: '' }
  };

  it('creates small deterministic corrections', () => {
    const adjustment = calculateCalibrationAdjustment({
      weaponId: 'm416',
      scope: 'redDot',
      issue: 'vertical-recoil',
      severity: 2
    });

    expect(adjustment.gyroscopeDelta).toBeGreaterThan(0);
    expect(adjustment.adsDelta).toBeLessThan(0);
    expect(calculateCalibrationAdjustment({
      weaponId: 'm416', scope: 'redDot', issue: 'vertical-recoil', severity: 2
    })).toEqual(adjustment);
  });

  it('preserves bounds when applying a correction', () => {
    const adjustment = calculateCalibrationAdjustment({
      weaponId: 'm416',
      scope: 'redDot',
      issue: 'undershoot',
      severity: 3
    });
    const adjusted = applyCalibrationToPair({ ...pair, camera: 200, ads: 200, gyroscope: 400, adsGyroscope: 400 }, adjustment);

    expect(adjusted.camera).toBe(200);
    expect(adjusted.ads).toBe(200);
    expect(adjusted.gyroscope).toBe(400);
    expect(adjusted.adsGyroscope).toBe(400);
  });
});
