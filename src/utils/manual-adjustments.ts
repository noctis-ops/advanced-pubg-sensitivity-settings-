import { SENSITIVITY_RANGES } from '../data/constants';
import { weapons } from '../data/weapons';
import type { GeneratedSensitivity, ScopeId, SensitivityCategory } from '../types';
import { calculateAllWeaponSensitivities } from './weapon-sensitivity-calculator';

export type SensitivityCategoryKey = keyof SensitivityCategory;

const clampValue = (value: number, category: SensitivityCategoryKey) => {
  const range = SENSITIVITY_RANGES[category];
  return Math.round(Math.min(range.max, Math.max(range.min, value)));
};

function cloneSensitivity(sensitivity: SensitivityCategory): SensitivityCategory {
  return {
    camera: { ...sensitivity.camera },
    ads: { ...sensitivity.ads },
    gyroscope: { ...sensitivity.gyroscope },
    adsGyroscope: { ...sensitivity.adsGyroscope }
  };
}

/** Apply a manual override while preserving each weapon's calculated offset. */
export function applyManualOverride(
  profile: GeneratedSensitivity,
  category: SensitivityCategoryKey,
  scope: ScopeId,
  value: number
): GeneratedSensitivity {
  const current = profile.sensitivity[category][scope];
  const nextValue = clampValue(value, category);
  const delta = nextValue - current;
  const sensitivity = cloneSensitivity(profile.sensitivity);
  sensitivity[category][scope] = nextValue;

  const weaponSensitivities = profile.weaponSensitivities.map((result) => ({
    ...result,
    values: result.values.map((pair) => pair.scope === scope
      ? {
          ...pair,
          [category]: clampValue(pair[category] + delta, category)
        }
      : pair)
  }));

  return { ...profile, sensitivity, weaponSensitivities };
}

export function resetManualOverrides(profile: GeneratedSensitivity): GeneratedSensitivity {
  const sensitivity = cloneSensitivity(profile.baselineSensitivity);
  const weaponSensitivities = calculateAllWeaponSensitivities(
    weapons,
    profile.device,
    profile.playerSettings,
    sensitivity
  );
  return { ...profile, sensitivity, weaponSensitivities };
}
