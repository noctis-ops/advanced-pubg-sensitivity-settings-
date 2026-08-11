import type { OptimizationGoal, WeaponScopeSensitivity, WeaponSensitivityResult } from '../types';
import { SCOPE_PROFILES } from '../data/constants';

export const OPTIMIZATION_GOALS: OptimizationGoal[] = [
  { id: 'close', weights: { recoil: 0.15, headshot: 0.30, acquisition: 0.30, microControl: 0.10, overshoot: 0.15 } },
  { id: 'mid', weights: { recoil: 0.30, headshot: 0.25, acquisition: 0.15, microControl: 0.20, overshoot: 0.20 } },
  { id: 'long', weights: { recoil: 0.35, headshot: 0.20, acquisition: 0.05, microControl: 0.30, overshoot: 0.20 } },
  { id: 'tournament', weights: { recoil: 0.25, headshot: 0.25, acquisition: 0.20, microControl: 0.20, overshoot: 0.10 } }
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function desiredScopeSpeed(scope: WeaponScopeSensitivity['scope'], goal: OptimizationGoal['id']): number {
  const zoom = SCOPE_PROFILES[scope].zoom;
  if (goal === 'close') return zoom <= 2 ? 1.08 : 0.94;
  if (goal === 'mid') return zoom <= 2 ? 1.03 : zoom <= 4 ? 1 : 0.94;
  if (goal === 'long') return zoom <= 2 ? 0.96 : 1 - Math.min(0.12, zoom * 0.012);
  return zoom <= 2 ? 1.02 : 0.97;
}

export function evaluateSensitivityLoss(pair: WeaponScopeSensitivity, goal: OptimizationGoal): number {
  const speed = (pair.camera + pair.ads) / 2 / 100;
  const speedError = Math.abs(speed - desiredScopeSpeed(pair.scope, goal.id));
  const recoilError = pair.factors.recoilLoad * Math.max(pair.ads / 200, 0.1);
  const headshotError = Math.max(0, 1.08 - pair.factors.headshotFocus);
  const microError = pair.factors.scopeZoom >= 3 ? Math.max(0, pair.ads / 100 - 0.35) : 0;
  const overshootError = pair.factors.scopeZoom <= 2 ? Math.max(0, speed - 1.08) : Math.max(0, speed - 0.95);
  return (
    goal.weights.recoil * recoilError
    + goal.weights.headshot * headshotError
    + goal.weights.acquisition * speedError
    + goal.weights.microControl * microError
    + goal.weights.overshoot * overshootError
  );
}

/** Deterministic coordinate search over a bounded ±6 candidate window. */
export function optimizeWeaponPair(pair: WeaponScopeSensitivity, goal: OptimizationGoal): WeaponScopeSensitivity {
  const direction = desiredScopeSpeed(pair.scope, goal.id) > (pair.camera + pair.ads) / 2 / 100 ? 1 : -1;
  const candidates = [0, 1, 2, 3, 4, 5, 6].map((step) => step * direction);
  let best = pair;
  let bestLoss = evaluateSensitivityLoss(pair, goal);

  for (const delta of candidates) {
    const candidate: WeaponScopeSensitivity = {
      ...pair,
      camera: Math.round(clamp(pair.camera + delta, 1, 200)),
      ads: Math.round(clamp(pair.ads + delta, 1, 200)),
      gyroscope: Math.round(clamp(pair.gyroscope + delta * 2, 0, 400)),
      adsGyroscope: Math.round(clamp(pair.adsGyroscope + delta * 2, 0, 400))
    };
    const loss = evaluateSensitivityLoss(candidate, goal);
    if (loss < bestLoss) {
      best = candidate;
      bestLoss = loss;
    }
  }
  return best;
}

export function optimizeWeaponResult(result: WeaponSensitivityResult, goal: OptimizationGoal): WeaponSensitivityResult {
  return {
    ...result,
    values: result.values.map((pair) => optimizeWeaponPair(pair, goal))
  };
}
