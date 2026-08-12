import type { GeneratedSensitivity } from '../types';

export const PROFILE_SCHEMA_VERSION = 1;

export function serializeProfile(profile: GeneratedSensitivity): string {
  return JSON.stringify({ schemaVersion: PROFILE_SCHEMA_VERSION, exportedAt: new Date().toISOString(), profile }, null, 2);
}

export function parseProfile(raw: string): GeneratedSensitivity {
  const payload = JSON.parse(raw) as { schemaVersion?: number; profile?: GeneratedSensitivity };
  const profile = payload.profile ?? (payload as unknown as GeneratedSensitivity);
  if (!profile?.device?.id || !profile?.playerSettings || !profile?.sensitivity) {
    throw new Error('Invalid sensitivity profile');
  }
  return { ...profile, createdAt: new Date(profile.createdAt) };
}

export function downloadProfile(profile: GeneratedSensitivity, fileName = 'pubg-sensitivity-profile.json') {
  const blob = new Blob([serializeProfile(profile)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
