import type { RecoilSample, SensitivityCategory, SensitivityExperiment, TrainingGroundMeasurement } from '../types';

export function validateMeasurement(measurement: TrainingGroundMeasurement): string[] {
  const errors: string[] = [];
  if (measurement.distanceMeters <= 0) errors.push('Distance must be positive.');
  if (measurement.shotsHit < 0 || measurement.shotsHit > measurement.shots) errors.push('Hits must be within shot count.');
  if (measurement.headshots < 0 || measurement.headshots > measurement.shotsHit) errors.push('Headshots must be within hits.');
  if (measurement.verticalError < 0 || measurement.horizontalError < 0) errors.push('Recoil errors cannot be negative.');
  if (measurement.overshoots < 0 || measurement.overshoots > measurement.shots) errors.push('Overshoots must be within shot count.');
  if (measurement.targetAcquisitionMs !== undefined && measurement.targetAcquisitionMs <= 0) errors.push('Acquisition time must be positive.');
  return errors;
}

export function validateMeasurementDataset(measurements: TrainingGroundMeasurement[]): string[] {
  return measurements.flatMap((measurement) => validateMeasurement(measurement).map((error) => `${measurement.id}: ${error}`));
}

/** Aggregates repeated observations into a normalized summary for later calibration. */
export function summarizeMeasurements(measurements: TrainingGroundMeasurement[]) {
  const valid = measurements.filter((measurement) => validateMeasurement(measurement).length === 0);
  if (valid.length === 0) return null;
  const average = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
  return {
    samples: valid.length,
    hitRate: average(valid.map((measurement) => measurement.shotsHit / measurement.shots)),
    headshotRate: average(valid.map((measurement) => measurement.headshots / Math.max(measurement.shotsHit, 1))),
    verticalError: average(valid.map((measurement) => measurement.verticalError)),
    horizontalError: average(valid.map((measurement) => measurement.horizontalError)),
    overshootRate: average(valid.map((measurement) => measurement.overshoots / measurement.shots)),
    acquisitionMs: average(valid.map((measurement) => measurement.targetAcquisitionMs ?? 0))
  };
}

/**
 * Creates a measured-looking curve only from recorded samples; it never
 * silently replaces the modelled weapon curve.
 */
export function measurementToRecoilSample(measurement: TrainingGroundMeasurement): RecoilSample {
  return {
    bullet: measurement.shots,
    horizontal: Math.min(1, measurement.horizontalError / 100),
    vertical: Math.min(1, measurement.verticalError / 100),
    recovery: Math.max(0, 1 - measurement.overshoots / measurement.shots)
  };
}

/** Converts an accepted Training Ground row into optimizer evidence. */
export function measurementToSensitivityExperiment(
  measurement: TrainingGroundMeasurement,
  sensitivityVector: SensitivityCategory
): SensitivityExperiment {
  const hitRate = measurement.shotsHit / Math.max(measurement.shots, 1);
  const headshotRate = measurement.headshots / Math.max(measurement.shotsHit, 1);
  return {
    id: `measurement-experiment-${measurement.id}`,
    sensitivityVector,
    weapon: measurement.weaponId,
    scope: measurement.scope,
    testType: measurement.targetAcquisitionMs !== undefined ? 'aim-acquisition' : 'recoil-control',
    trackingAccuracy: hitRate,
    targetAcquisitionTime: measurement.targetAcquisitionMs,
    overshootRate: measurement.overshoots / Math.max(measurement.shots, 1),
    undershootRate: Math.max(0, 1 - hitRate),
    recoilDeviation: Math.min(1, measurement.verticalError / 100),
    horizontalDeviation: Math.min(1, measurement.horizontalError / 100),
    headshotRate,
    correctionCount: measurement.overshoots,
    sampleCount: measurement.shots,
    confidence: Math.min(0.95, 0.45 + measurement.shots / 100),
    source: 'measured',
    recordedAt: measurement.recordedAt,
    notes: measurement.notes
  };
}
