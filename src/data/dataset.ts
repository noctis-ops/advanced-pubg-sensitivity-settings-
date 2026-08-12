import type { DatasetInfo } from '../types';

/** Single source of truth for freshness labels shown to users and QA. */
export const DATASET_INFO: DatasetInfo = {
  version: '1.2.0-modelled',
  gamePatch: 'PUBG Mobile profile-compatible',
  lastUpdated: '2026-08-04',
  status: 'modelled'
};

export function getDataFreshnessLabel(locale: 'ar' | 'en'): string {
  const date = new Date(DATASET_INFO.lastUpdated).toLocaleDateString(locale === 'ar' ? 'ar' : 'en');
  return locale === 'ar'
    ? `بيانات ${DATASET_INFO.version} · آخر تحديث ${date}`
    : `Dataset ${DATASET_INFO.version} · updated ${date}`;
}
