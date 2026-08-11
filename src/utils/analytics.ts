export type AnalyticsEvent =
  | 'generation_completed'
  | 'profile_saved'
  | 'profile_loaded'
  | 'profile_shared'
  | 'calibration_applied'
  | 'manual_override'
  | 'feedback_submitted';

const STORAGE_KEY = 'pubg-sensitivity-local-analytics-v1';

type EventCounts = Partial<Record<AnalyticsEvent, number>>;

/** Privacy-first analytics: aggregate counters stay in the user's browser. */
export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return;
  try {
    const current = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') as EventCounts;
    current[event] = (current[event] ?? 0) + 1;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // Analytics must never interfere with generation or navigation.
  }
}

export function getLocalAnalytics(): EventCounts {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') as EventCounts;
  } catch {
    return {};
  }
}
