import { Target } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useApp } from '../../context/AppContext';
import type { FOVOption, FPPViewOption, SkillLevel } from '../../types';

const fovOptions: FOVOption[] = [80, 82, 84, 86, 88, 90];
const fppViewOptions: FPPViewOption[] = [90, 93, 95, 98, 100, 103];
const skillOptions: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'pro'];

export function Step6Advanced() {
  const { state, t, isRTL, setFov, setFppView, setSkillLevel } = useApp();

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t.step6Title}</h2>
        <p className="text-gray-400">{t.step6Subtitle}</p>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
          <Target className="w-4 h-4" />
          {t.cameraView}
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {fovOptions.map((fov) => (
            <button
              type="button"
              key={fov}
              onClick={() => setFov(fov)}
              className={cn(
                'rounded-xl border px-3 py-3 text-sm font-bold transition-colors',
                state.playerSettings.fov === fov
                  ? 'border-amber-400/50 bg-amber-500/15 text-amber-300'
                  : 'border-white/10 bg-white/[0.03] text-gray-400 hover:bg-white/[0.06]'
              )}
            >
              {fov}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
          <Target className="w-4 h-4" />
          {t.fppCameraView}
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {fppViewOptions.map((view) => (
            <button type="button" key={view} onClick={() => setFppView(view)} className={cn(
              'rounded-xl border px-3 py-3 text-sm font-bold transition-colors',
              state.playerSettings.fppView === view ? 'border-blue-400/50 bg-blue-500/15 text-blue-300' : 'border-white/10 bg-white/[0.03] text-gray-400 hover:bg-white/[0.06]'
            )}>{view}</button>
          ))}
        </div>
      </div>

      <label className="block text-sm font-medium text-gray-400">
        <span className="block mb-2">{t.skillLevel}</span>
        <select value={state.playerSettings.skillLevel} onChange={(event) => setSkillLevel(event.target.value as SkillLevel)} className="w-full rounded-xl border border-white/10 bg-[#11131a] px-3 py-3 text-sm text-white">
          {skillOptions.map((level) => <option key={level} value={level}>{t[level]}</option>)}
        </select>
      </label>

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-300">
        {t.viewModeNote}
      </div>
    </div>
  );
}
