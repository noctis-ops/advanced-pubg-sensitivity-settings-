import { Settings2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { FOVOption, FPPViewOption, SkillLevel } from '../../types';

const fovOptions: FOVOption[] = [80, 82, 84, 86, 88, 90];
const fppViewOptions: FPPViewOption[] = [90, 93, 95, 98, 100, 103];
const skillOptions: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'pro'];

export function AdvancedSettingsPanel() {
  const { state, t, isRTL, setFov, setFppView, setSkillLevel } = useApp();

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-2">
        <Settings2 className="w-5 h-5 text-amber-400" />
        <h3 className="font-bold text-white">{t.advancedSettings}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="text-xs text-gray-400">
          <span className="block mb-1">{t.fov}</span>
          <select value={state.playerSettings.fov} onChange={(event) => setFov(Number(event.target.value) as FOVOption)} className="w-full rounded-xl border border-white/10 bg-[#11131a] px-3 py-2 text-sm text-white">
            {fovOptions.map((fov) => <option key={fov} value={fov}>{fov}</option>)}
          </select>
        </label>
        <label className="text-xs text-gray-400">
          <span className="block mb-1">{t.skillLevel}</span>
          <select value={state.playerSettings.skillLevel} onChange={(event) => setSkillLevel(event.target.value as SkillLevel)} className="w-full rounded-xl border border-white/10 bg-[#11131a] px-3 py-2 text-sm text-white">
            {skillOptions.map((level) => <option key={level} value={level}>{t[level]}</option>)}
          </select>
        </label>
      </div>
      <label className="block text-xs text-gray-400">
        <span className="block mb-1">{t.fppCameraView}</span>
        <select value={state.playerSettings.fppView} onChange={(event) => setFppView(Number(event.target.value) as FPPViewOption)} className="w-full rounded-xl border border-white/10 bg-[#11131a] px-3 py-2 text-sm text-white">
          {fppViewOptions.map((view) => <option key={view} value={view}>{view}</option>)}
        </select>
      </label>

    </section>
  );
}
