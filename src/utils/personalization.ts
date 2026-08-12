import type { BayesianPosterior, CalibrationIssue, PlayerPersonalization } from '../types';

const PRIOR: BayesianPosterior = { mean: 1, variance: 0.04, observations: 0 };

function update(prior: BayesianPosterior, observation: number, observationVariance = 0.02): BayesianPosterior {
  const priorPrecision = 1 / Math.max(prior.variance, 0.0001);
  const observationPrecision = 1 / observationVariance;
  const variance = 1 / (priorPrecision + observationPrecision);
  const mean = variance * (prior.mean * priorPrecision + observation * observationPrecision);
  return { mean, variance, observations: prior.observations + 1 };
}

export function createDefaultPersonalization(): PlayerPersonalization {
  return { ads: { ...PRIOR }, gyroscope: { ...PRIOR }, camera: { ...PRIOR }, lastUpdated: new Date().toISOString() };
}

export function updatePersonalization(
  personalization: PlayerPersonalization,
  issue: CalibrationIssue,
  severity: 1 | 2 | 3
): PlayerPersonalization {
  const direction = issue === 'overshoot' ? -1 : issue === 'undershoot' || issue === 'slow-acquisition' || issue === 'vertical-recoil' ? 1 : 0;
  const observation = 1 + direction * severity * 0.02;
  const next = { ...personalization, lastUpdated: new Date().toISOString() };
  if (direction === 0) return next;
  next.camera = update(personalization.camera, observation);
  next.ads = update(personalization.ads, observation);
  next.gyroscope = update(personalization.gyroscope, observation);
  return next;
}

export function personalizationAdjustment(personalization: PlayerPersonalization): number {
  return Math.min(1.08, Math.max(0.92, personalization.ads.mean));
}
