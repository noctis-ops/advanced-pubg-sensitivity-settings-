import type { GeneratedSensitivity } from '../types';

const HASH_KEY = 'profile';

function encodeBase64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeBase64(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function createProfileShareUrl(profile: GeneratedSensitivity): string {
  const url = new URL(window.location.href);
  url.hash = `${HASH_KEY}=${encodeBase64(JSON.stringify(profile))}`;
  return url.toString();
}

export function readProfileFromLocation(): GeneratedSensitivity | null {
  if (typeof window === 'undefined') return null;
  const match = window.location.hash.match(new RegExp(`${HASH_KEY}=([^&]+)`));
  if (!match) return null;

  try {
    const profile = JSON.parse(decodeBase64(match[1])) as GeneratedSensitivity;
    if (!profile?.device?.id || !profile?.sensitivity || !profile?.playerSettings) return null;
    return { ...profile, createdAt: new Date(profile.createdAt) };
  } catch {
    return null;
  }
}

export function clearProfileShareHash() {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.hash = '';
  window.history.replaceState({}, document.title, url.toString());
}
