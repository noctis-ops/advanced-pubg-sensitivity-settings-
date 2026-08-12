import type { Device, Weapon } from '../types';
import { validateWeapon } from './weapon-sensitivity-calculator';

export function validateDevice(device: Device): string[] {
  const errors: string[] = [];
  const specs = device.specs;

  if (!device.id || !device.name || !device.nameAr) errors.push('Device identity is incomplete.');
  if (specs.screenSize <= 0 || specs.screenWidth <= 0 || specs.screenHeight <= 0 || specs.ppi <= 0) {
    errors.push('Screen dimensions and PPI must be positive.');
  }
  if (specs.refreshRate <= 0 || specs.touchSamplingRate <= 0) {
    errors.push('Refresh and touch sampling rates must be positive.');
  }
  if (specs.gyroscopeQuality < 1 || specs.gyroscopeQuality > 10) {
    errors.push('Gyroscope quality must be between 1 and 10.');
  }
  if (![30, 60, 90, 120].includes(specs.maxFPS)) {
    errors.push('maxFPS must be a supported PUBG FPS option.');
  }
  if (!specs.processor?.model || !specs.processor.gpuModel || specs.processor.sustainedFPS <= 0) {
    errors.push('Processor metadata is incomplete.');
  }

  return errors;
}

export function validateDeviceDataset(devices: Device[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const device of devices) {
    if (ids.has(device.id)) errors.push(`Duplicate device id: ${device.id}`);
    ids.add(device.id);
    errors.push(...validateDevice(device).map((error) => `${device.id}: ${error}`));
  }

  return errors;
}

export function validateWeaponDataset(weapons: Weapon[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const weapon of weapons) {
    if (ids.has(weapon.id)) errors.push(`Duplicate weapon id: ${weapon.id}`);
    ids.add(weapon.id);
    errors.push(...validateWeapon(weapon).map((error) => `${weapon.id}: ${error}`));
    if (!weapon.provenance?.dataVersion || !weapon.provenance.dataSource || !weapon.provenance.verificationStatus) {
      errors.push(`${weapon.id}: weapon provenance is incomplete.`);
    }
  }

  return errors;
}
