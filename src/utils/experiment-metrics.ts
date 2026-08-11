import type { ExperimentResult, PerformanceMetrics } from '../types';

export interface MetricSummary {
  hitRate: number;
  headshotRate: number;
  recoilError: number;
  acquisitionMs: number;
  overshootRate: number;
}

export function summarizeMetrics(metrics: PerformanceMetrics): MetricSummary {
  return {
    hitRate: metrics.shotsHit / Math.max(metrics.shots, 1),
    headshotRate: metrics.headshots / Math.max(metrics.shotsHit, 1),
    recoilError: (metrics.verticalError + metrics.horizontalError) / 2,
    acquisitionMs: metrics.targetAcquisitionMs,
    overshootRate: metrics.overshoots / Math.max(metrics.shots, 1)
  };
}

export function compareExperimentResults(
  baseline: ExperimentResult,
  candidate: ExperimentResult
) {
  const before = summarizeMetrics(baseline.metrics);
  const after = summarizeMetrics(candidate.metrics);
  return {
    hitRateDelta: after.hitRate - before.hitRate,
    headshotRateDelta: after.headshotRate - before.headshotRate,
    recoilErrorDelta: after.recoilError - before.recoilError,
    acquisitionDelta: after.acquisitionMs - before.acquisitionMs,
    overshootDelta: after.overshootRate - before.overshootRate,
    improved: after.headshotRate >= before.headshotRate && after.recoilError <= before.recoilError
  };
}
