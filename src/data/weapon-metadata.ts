import type { Weapon, WeaponCategory, WeaponPropertySnapshot } from '../types';

const AMMO_BY_CLASS: Record<WeaponCategory, string> = {
  ar: '5.56mm / 7.62mm',
  smg: '9mm / .45 ACP / 5.7mm',
  sniper: '7.62mm / .300 Magnum / 12.7mm',
  dmr: '5.56mm / 7.62mm',
  shotgun: '12 Gauge',
  lmg: '7.62mm'
};

function fireMode(weapon: Weapon): Weapon['fireMode'] {
  if (weapon.category === 'sniper' || weapon.category === 'dmr' || weapon.id === 'mk47') return 'single';
  if (weapon.category === 'shotgun' && weapon.id === 's1897') return 'single';
  return 'auto';
}

function magazineCapacity(weapon: Weapon): number {
  if (weapon.id === 'm249') return 100;
  if (weapon.id === 'mg3') return 75;
  if (weapon.id === 'p90') return 50;
  if (weapon.category === 'sniper') return 5;
  if (weapon.category === 'shotgun') return weapon.id === 'dbs' ? 14 : 5;
  if (weapon.category === 'dmr') return 10;
  return weapon.category === 'smg' ? 30 : 30;
}

function bulletVelocity(weapon: Weapon): number {
  if (weapon.id === 'awm') return 945;
  if (weapon.id === 'lynx') return 1020;
  if (weapon.category === 'sniper') return 760;
  if (weapon.category === 'dmr') return 900;
  if (weapon.category === 'shotgun') return 420;
  return weapon.category === 'smg' ? 400 : 870;
}

function createRecoilStats(weapon: Weapon) {
  const vertical = weapon.recoilCurve.map((sample) => Math.abs(sample.vertical));
  const horizontal = weapon.recoilCurve.map((sample) => Math.abs(sample.horizontal));
  const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
  const verticalMean = mean(vertical);
  const horizontalMean = mean(horizontal);
  const variance = mean(weapon.recoilCurve.map((sample) => Math.abs(sample.horizontal - horizontalMean)));
  const recovery = mean(weapon.recoilCurve.map((sample) => sample.recovery));
  return {
    verticalMean,
    verticalMin: Math.min(...vertical),
    verticalMax: Math.max(...vertical),
    horizontalMean,
    horizontalMin: Math.min(...horizontal),
    horizontalMax: Math.max(...horizontal),
    variance,
    durationMs: Math.round((weapon.recoilCurve.length / weapon.fireRate) * 60000),
    recoveryMs: Math.round((1 - recovery) * 1000)
  };
}

function propertyHistory(weapon: Weapon): WeaponPropertySnapshot[] {
  const common = {
    gameVersion: 'unspecified',
    patchVersion: 'unspecified',
    dataVersion: '1.2.0-modelled',
    dataSource: 'modelled' as const,
    verificationStatus: 'unverified' as const
  };
  return [
    { property: 'fireRate', value: weapon.fireRate, ...common },
    { property: 'recoil', value: weapon.recoil, ...common },
    { property: 'recoilCurve', value: weapon.recoilCurve, ...common },
    { property: 'sprayStability', value: weapon.sprayStability, ...common },
    { property: 'effectiveRange', value: weapon.effectiveRange, ...common },
    { property: 'scopeCompatibility', value: weapon.scopeCompatibility, ...common },
    { property: 'attachmentCompatibility', value: weapon.attachmentCompatibility, ...common }
  ];
}

export function enrichWeaponWithMetadata(weapon: Weapon): Weapon {
  const fire = fireMode(weapon);
  const stability = 1 - weapon.sprayStability / 10;
  return {
    ...weapon,
    ammoType: AMMO_BY_CLASS[weapon.category],
    fireMode: fire,
    burstSize: fire === 'burst' ? 3 : undefined,
    timeBetweenShotsMs: Math.round(60000 / weapon.fireRate),
    bulletVelocityMps: bulletVelocity(weapon),
    reloadTimeMs: weapon.category === 'shotgun' ? 2300 : weapon.category === 'sniper' ? 2100 : 1900,
    magazineCapacity: magazineCapacity(weapon),
    drawTimeMs: weapon.category === 'sniper' ? 850 : 650,
    firstShotMultiplier: Number((1 + weapon.recoil.vertical * 0.02).toFixed(3)),
    recoilStats: createRecoilStats(weapon),
    spreadProfile: {
      hipFire: Number((0.20 + stability * 0.30).toFixed(3)),
      ads: Number((0.08 + stability * 0.18).toFixed(3)),
      movement: Number((0.14 + stability * 0.24).toFixed(3)),
      standing: Number((0.10 + stability * 0.20).toFixed(3)),
      crouch: Number((0.06 + stability * 0.12).toFixed(3)),
      jump: Number((0.22 + stability * 0.30).toFixed(3)),
      variance: Number((stability * 0.10).toFixed(3))
    },
    visualBehavior: {
      screenShake: Number((weapon.recoil.vertical / 10 * 0.8).toFixed(3)),
      muzzleMovement: Number(((weapon.recoil.vertical + weapon.recoil.horizontal) / 20).toFixed(3)),
      weaponMovement: Number(((1 - weapon.sprayStability / 10) * 0.8).toFixed(3))
    },
    propertyHistory: propertyHistory(weapon),
    provenance: {
      gameVersion: 'unspecified',
      patchVersion: 'unspecified',
      dataVersion: '1.2.0-modelled',
      dataCollectedAt: '2026-08-04',
      dataSource: 'modelled',
      verificationStatus: 'unverified',
      confidence: weapon.recoilDataConfidence,
      notes: 'Derived metadata is a modelling scaffold until verified against an official PUBG MOBILE patch or controlled Training Ground measurements.'
    }
  };
}

export function enrichWeaponsWithMetadata(weapons: Weapon[]): Weapon[] {
  return weapons.map(enrichWeaponWithMetadata);
}
