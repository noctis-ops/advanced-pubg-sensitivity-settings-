import { useState } from 'react';
import { Bookmark, Download, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { GeneratedSensitivity, SavedSensitivityProfile } from '../../types';
import { trackEvent } from '../../utils/analytics';

const STORAGE_KEY = 'pubg-sensitivity-saved-profiles-v1';

function reviveProfile(profile: GeneratedSensitivity): GeneratedSensitivity {
  return {
    ...profile,
    createdAt: new Date(profile.createdAt)
  };
}

export function SavedProfilesPanel() {
  const { state, t, isRTL, setDevice, setSensitivity, setStep } = useApp();
  const [profiles, setProfiles] = useLocalStorage<SavedSensitivityProfile[]>(STORAGE_KEY, []);
  const [name, setName] = useState('');

  if (!state.generatedSensitivity) return null;

  const profile = state.generatedSensitivity;
  const defaultName = `${isRTL ? profile.device.nameAr : profile.device.name} - ${profile.playerSettings.preferredFPS} FPS`;

  const save = () => {
    const next: SavedSensitivityProfile = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `profile-${Date.now()}`,
      name: name.trim() || defaultName,
      savedAt: new Date().toISOString(),
      profile
    };
    setProfiles([next, ...profiles.filter((item) => item.name !== next.name)].slice(0, 20));
    trackEvent('profile_saved');
    setName('');
  };

  const load = (saved: SavedSensitivityProfile) => {
    const restored = reviveProfile(saved.profile);
    setDevice(restored.device);
    setSensitivity(restored);
    trackEvent('profile_loaded');
    setStep('results');
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-2">
        <Bookmark className="w-5 h-5 text-amber-400" />
        <h3 className="font-bold text-white">{t.savedProfiles}</h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <label className="sr-only" htmlFor="profile-name">{t.profileName}</label>
        <input
          id="profile-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={t.profileNamePlaceholder}
          className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-gray-600"
        />
        <button
          type="button"
          onClick={save}
          className="rounded-xl bg-amber-500/20 border border-amber-400/30 px-4 py-2 text-sm font-semibold text-amber-200 hover:bg-amber-500/30"
        >
          {t.saveProfile}
        </button>
      </div>

      {profiles.length === 0 ? (
        <p className="text-xs text-gray-500">{t.noSavedProfiles}</p>
      ) : (
        <div className="space-y-2">
          {profiles.map((saved) => (
            <div key={saved.id} className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{saved.name}</p>
                <p className="text-[10px] text-gray-600">{new Date(saved.savedAt).toLocaleString(isRTL ? 'ar' : 'en')}</p>
              </div>
              <button type="button" onClick={() => load(saved)} className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg" aria-label={t.load}>
                <Download className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setProfiles(profiles.filter((item) => item.id !== saved.id))} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg" aria-label={t.delete}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
