import { allDevices } from '../data/devices';
import { SCOPE_KEYS } from '../data/constants';
import { weapons } from '../data/weapons';
import type { PlayerSettings } from '../types';
import { validateDeviceDataset, validateWeaponDataset } from './data-validator';
import { generateFullSensitivity } from './sensitivity-calculator';

export interface SyntheticCheck {
  name: string;
  passed: boolean;
  detail: string;
}

export interface SyntheticValidationReport {
  score: number;
  checks: SyntheticCheck[];
  generatedAt: string;
}

const settings: PlayerSettings = {
  fingerCount: 4,
  gripStyle: 'claw',
  gyroscopeMode: 'always-on',
  playStyle: 'balanced',
  skillLevel: 'advanced',
  preferredFPS: 120,
  fov: 90,
  fppView: 103
};

export function runSyntheticValidation(): SyntheticValidationReport {
  const device = allDevices.find((item) => item.id === 'iphone-15-pro-max') ?? allDevices[0];
  const lowDevice = allDevices.find((item) => item.id === 'samsung-a14') ?? allDevices[0];
  const profile = generateFullSensitivity(device, settings);
  const repeated = generateFullSensitivity(device, settings);
  const close = generateFullSensitivity(device, { ...settings, playStyle: 'close-aggressive' });
  const low = generateFullSensitivity(lowDevice, { ...settings, preferredFPS: 30 });
  const qbz = profile.weaponSensitivities.find((result) => result.weapon.id === 'qbz');
  const closeQbz = close.weaponSensitivities.find((result) => result.weapon.id === 'qbz');
  const checks: SyntheticCheck[] = [
    {
      name: 'dataset validation',
      passed: validateDeviceDataset(allDevices).length === 0 && validateWeaponDataset(weapons).length === 0,
      detail: `${allDevices.length} devices and ${weapons.length} weapons pass schema validation.`
    },
    {
      name: 'determinism',
      passed: JSON.stringify(profile.sensitivity) === JSON.stringify(repeated.sensitivity),
      detail: 'Identical inputs produce identical global sensitivity.'
    },
    {
      name: 'scope limits',
      passed: Boolean(qbz && qbz.values.every((value) => value.camera <= 200 && value.ads <= 200 && value.gyroscope <= 400 && value.adsGyroscope <= 400)),
      detail: 'All values remain within the PUBG slider limits.'
    },
    {
      name: 'scope semantics',
      passed: SCOPE_KEYS.length === 7 && !SCOPE_KEYS.includes('holographic' as never),
      detail: 'Red Dot/Holographic is represented by one shared game setting.'
    },
    {
      name: 'close-aggressive asymmetry',
      passed: Boolean(closeQbz && closeQbz.values.find((value) => value.scope === 'redDot')!.ads > closeQbz.values.find((value) => value.scope === 'x6')!.ads),
      detail: 'Close aggression is faster at low zoom and calmer at high zoom.'
    },
    {
      name: 'device sensitivity',
      passed: JSON.stringify(profile.sensitivity) !== JSON.stringify(low.sensitivity),
      detail: 'Device and FPS changes produce a different result.'
    },
    {
      name: 'sprint cap',
      passed: profile.additional.sprintSensitivity <= 100 && low.additional.sprintSensitivity <= 100,
      detail: 'Sprint Sensitivity never exceeds 100.'
    },
    {
      name: 'processor coverage',
      passed: allDevices.every((item) => Boolean(item.specs.processor?.model && item.specs.processor?.gpuModel)),
      detail: 'Every enriched device exposes processor and GPU metadata.'
    }
  ];
  const passed = checks.filter((check) => check.passed).length;
  return {
    score: Math.round((passed / checks.length) * 100),
    checks,
    generatedAt: new Date().toISOString()
  };
}
