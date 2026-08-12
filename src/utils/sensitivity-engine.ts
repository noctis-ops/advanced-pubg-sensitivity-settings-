import type { Device, PlayerSettings } from '../types';

const PROCESSOR_FACTORS: Record<Device['specs']['processorTier'], number> = {
  flagship: 1.02,
  high: 1.00,
  mid: 0.98,
  low: 0.94
};

export interface DeviceFactors {
  screenNormal: number;
  screenGyro: number;
  fpsNormal: number;
  fpsGyro: number;
  refresh: number;
  touch: number;
  gyroQuality: number;
  processor: number;
  normal: number;
  gyro: number;
}

export function getEffectiveFPS(device: Device, settings: PlayerSettings): number {
  return Math.min(settings.preferredFPS, device.specs.maxFPS);
}

/**
 * The single device calibration used by both the global and weapon layers.
 * The output is intentionally continuous so two nearby devices do not jump
 * between arbitrary lookup-table values.
 */
export function calculateDeviceFactors(device: Device, settings: PlayerSettings): DeviceFactors {
  const effectiveFPS = getEffectiveFPS(device, settings);
  const quality = Math.min(10, Math.max(1, device.specs.gyroscopeQuality));
  const screenNormal = Math.min(1.12, Math.max(0.82, 1 + (6.5 - device.specs.screenSize) * 0.035));
  const screenGyro = Math.min(1.10, Math.max(0.86, 1 + (6.5 - device.specs.screenSize) * 0.025));
  const fpsNormal = Math.min(1.08, Math.max(0.94, 1 + (effectiveFPS - 60) / 900));
  const fpsGyro = Math.min(1.06, Math.max(0.96, 1 + (effectiveFPS - 60) / 1200));
  const refresh = Math.min(1.06, Math.max(0.98, 1 + (device.specs.refreshRate - 60) / 2400));
  const touch = Math.min(1.08, Math.max(0.96, 1 + (device.specs.touchSamplingRate - 240) / 3000));
  const gyroQuality = Math.min(1.02, Math.max(0.94, 0.94 + quality * 0.0075));
  const processor = PROCESSOR_FACTORS[device.specs.processorTier];

  return {
    screenNormal,
    screenGyro,
    fpsNormal,
    fpsGyro,
    refresh,
    touch,
    gyroQuality,
    processor,
    normal: screenNormal * fpsNormal * touch * processor,
    gyro: screenGyro * fpsGyro * refresh * touch * gyroQuality * processor
  };
}
