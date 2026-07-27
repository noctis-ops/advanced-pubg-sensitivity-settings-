import { cn } from '../../utils/cn';
import { useApp } from '../../context/AppContext';
import { FingerCount, GripStyle } from '../../types';
import { Hand } from 'lucide-react';

const fingerOptions: FingerCount[] = [2, 3, 4, 5, 6];

const gripOptions: { value: GripStyle; minFingers: number; emoji: string }[] = [
  { value: 'thumbs', minFingers: 2, emoji: '👍' },
  { value: 'three-finger', minFingers: 3, emoji: '🤟' },
  { value: 'claw', minFingers: 4, emoji: '🦀' },
  { value: 'five-claw', minFingers: 5, emoji: '🖐️' },
  { value: 'full-claw', minFingers: 6, emoji: '👐' }
];

export function Step3Fingers() {
  const { state, t, setFingers, setGrip } = useApp();
  const currentFingers = state.playerSettings.fingerCount;
  const currentGrip = state.playerSettings.gripStyle;
  
  const getGripLabel = (grip: GripStyle) => {
    const labels: Record<GripStyle, { en: string; ar: string }> = {
      'thumbs': { en: 'Thumbs Only', ar: 'إبهامين فقط' },
      'three-finger': { en: '3 Fingers', ar: '3 أصابع' },
      'claw': { en: 'Claw (4 Fingers)', ar: 'مخلب (4 أصابع)' },
      'five-claw': { en: '5 Fingers', ar: '5 أصابع' },
      'full-claw': { en: 'Full Claw (6)', ar: 'مخلب كامل (6)' }
    };
    return labels[grip];
  };
  
  const availableGrips = gripOptions.filter(g => g.minFingers <= currentFingers);
  
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t.step3Title}</h2>
        <p className="text-gray-400">{t.step3Subtitle}</p>
      </div>
      
      {/* Finger count */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-3">
          <Hand className="inline w-4 h-4 mr-1" />
          {t.fingerCount}
        </label>
        <div className="flex gap-2 justify-center">
          {fingerOptions.map(num => (
            <button
              key={num}
              onClick={() => setFingers(num)}
              className={cn(
                'w-14 h-14 rounded-2xl border text-xl font-bold transition-all duration-200',
                currentFingers === num
                  ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-white/[0.03] border-white/10 text-gray-400 hover:bg-white/[0.06] hover:border-white/20 hover:text-white'
              )}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
      
      {/* Grip style */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-3">
          {t.gripStyle}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableGrips.map(grip => {
            const isSelected = currentGrip === grip.value;
            const label = getGripLabel(grip.value);
            
            return (
              <button
                key={grip.value}
                onClick={() => setGrip(grip.value)}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-right',
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/30 ring-1 ring-amber-500/20'
                    : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                )}
              >
                <span className="text-2xl">{grip.emoji}</span>
                <div className="flex-1">
                  <p className={cn('font-semibold', isSelected ? 'text-amber-400' : 'text-white')}>
                    {label.ar}
                  </p>
                  <p className="text-xs text-gray-500">{label.en}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Visual representation */}
      <div className="flex justify-center">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="flex gap-1 justify-center mb-2">
            {Array.from({ length: currentFingers }).map((_, i) => (
              <div 
                key={i} 
                className="w-6 h-10 rounded-full bg-amber-500/30 border border-amber-500/50"
              />
            ))}
          </div>
          <p className="text-center text-xs text-gray-500">
            {currentFingers} {t.fingers} • {getGripLabel(currentGrip).ar}
          </p>
        </div>
      </div>
    </div>
  );
}
