import { describe, expect, it } from 'vitest';
import { allDevices } from '../data/devices';
import { weapons } from '../data/weapons';
import { validateDeviceDataset, validateWeaponDataset } from './data-validator';

describe('project data validation', () => {
  it('contains the required phase-two device coverage', () => {
    expect(allDevices.filter((device) => device.brand === 'xiaomi')).toHaveLength(20);
    expect(allDevices.filter((device) => device.brand === 'oneplus').length).toBeGreaterThanOrEqual(10);
    expect(allDevices.filter((device) => device.brand === 'poco').length).toBeGreaterThanOrEqual(10);
    expect(allDevices.filter((device) => device.brand === 'oppo').length).toBeGreaterThanOrEqual(15);
    expect(allDevices.filter((device) => device.brand === 'realme').length).toBeGreaterThanOrEqual(15);
    expect(allDevices.filter((device) => device.brand === 'huawei').length).toBeGreaterThanOrEqual(10);
    expect(allDevices.filter((device) => device.brand === 'honor').length).toBeGreaterThanOrEqual(10);
  });

  it('has no invalid or duplicate device records', () => {
    expect(validateDeviceDataset(allDevices)).toEqual([]);
  });

  it('has no invalid or duplicate weapon records', () => {
    expect(validateWeaponDataset(weapons)).toEqual([]);
  });
});
