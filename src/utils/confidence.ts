import type {
  DataConfidence,
  Device,
  SensitivityConfidence,
  WeaponSensitivityResult
} from '../types';

const confidenceValue: Record<DataConfidence, number> = {
  measured: 100,
  'spec-sheet': 90,
  community: 78,
  modelled: 55
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const average = (values: number[]) =>
  values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;

/**
 * Confidence is deliberately not presented as accuracy. It describes how
 * complete, reproducible, and empirically calibrated the inputs are.
 */
export function calculateSensitivityConfidence(
  device: Device,
  results: WeaponSensitivityResult[],
  calibrationCount = 0
): SensitivityConfidence {
  const validResults = results.filter((result) => result.valid);
  const dataCoverage = results.length === 0
    ? 0
    : (validResults.length / results.length) * 100;

  const deviceFields = [
    device.specs.screenSize,
    device.specs.screenWidth,
    device.specs.screenHeight,
    device.specs.ppi,
    device.specs.refreshRate,
    device.specs.touchSamplingRate,
    device.specs.maxFPS,
    device.specs.gyroscopeQuality
  ];
  const completeFields = deviceFields.filter((value) => Number.isFinite(value)).length;
  const declaredDeviceConfidence = confidenceValue[device.dataConfidence ?? 'modelled'];
  const deviceSpecificity = clamp(
    (completeFields / deviceFields.length) * 70 + declaredDeviceConfidence * 0.30,
    0,
    100
  );

  const modelStability = average(validResults.map((result) => {
    const dataScore = confidenceValue[result.weapon.recoilDataConfidence];
    const scopeCoverage = clamp(result.values.length / 8, 0, 1) * 100;
    return dataScore * 0.70 + scopeCoverage * 0.30;
  }));

  const empiricalCalibration = clamp(25 + calibrationCount * 8, 0, 100);
  const reproducibility = 100;
  const breakdown = {
    dataCoverage: Math.round(dataCoverage),
    deviceSpecificity: Math.round(deviceSpecificity),
    modelStability: Math.round(modelStability),
    empiricalCalibration: Math.round(empiricalCalibration),
    reproducibility
  };

  const score = Math.round(
    breakdown.dataCoverage * 0.20
    + breakdown.deviceSpecificity * 0.20
    + breakdown.modelStability * 0.25
    + breakdown.empiricalCalibration * 0.20
    + breakdown.reproducibility * 0.15
  );

  return {
    score,
    level: score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low',
    breakdown,
    caveats: [
      {
        en: 'Recoil curves are currently modelled and should be calibrated against Training Ground observations.',
        ar: 'منحنيات الارتداد الحالية نموذجية ويجب معايرتها بملاحظات ميدان التدريب.'
      },
      {
        en: 'PUBG Mobile stores sensitivity globally by scope; weapon values are profile recommendations.',
        ar: 'تحفظ PUBG Mobile الحساسية بشكل عام حسب السكوب؛ قيم الأسلحة توصيات للملف.'
      },
      calibrationCount === 0
        ? {
            en: 'No player calibration session has been completed yet.',
            ar: 'لم تكتمل أي جلسة معايرة للاعب بعد.'
          }
        : {
            en: `${calibrationCount} calibration observation(s) have been applied.`,
            ar: `تم تطبيق ${calibrationCount} ملاحظة معايرة.`
          }
    ]
  };
}
