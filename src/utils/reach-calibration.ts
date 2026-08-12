import type { CalibratedReachZone, Device, FingerAssignment, ReachCalibrationInput } from '../types';
import { buildReachZones } from './control-layout';

/**
 * Public calibration boundary. Coordinates may be supplied as normalized 0..1
 * values or preview percentages 0..100; the layout engine normalizes them in
 * one landscape coordinate system.
 */
export function createCalibratedReachZones(
  device: Device,
  assignment: FingerAssignment,
  inputs: ReachCalibrationInput[] = []
): CalibratedReachZone[] {
  return buildReachZones(device, assignment, inputs);
}

export function isReachCalibrationMeasured(zone: CalibratedReachZone): boolean {
  return zone.source === 'measured' && zone.sampleCount > 0 && zone.confidence >= 0.5;
}
