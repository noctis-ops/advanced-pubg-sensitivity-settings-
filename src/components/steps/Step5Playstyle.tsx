import { cn } from '../../utils/cn';
import { useApp } from '../../context/AppContext';
import { PlayStyle } from '../../types';
import { Zap, Scale, Target } from 'lucide-react';

const playstyleOptions: { 
  value: PlayStyle; 
  icon: typeof Zap;
  color: string;
  bgColor: string;
  borderColor: string;
}[] = [
  { value: 'aggressive', icon: Zap, color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20' },
  { value: 'balanced', icon: Scale, color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/20' },
  { value: 'passive', icon: Target, color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' }
];

export function Step5Playstyle() {
  const { state, t, setPlaystyle } = useApp();
  const currentStyle = state.playerSettings.playStyle;
  
  const getLabels = (style: PlayStyle) => {
    const labels: Record<PlayStyle, { title: string; desc: string; emoji: string }> = {
      'aggressive': { title: t.aggressive, desc: t.aggressiveDesc, emoji: '🔥' },
      'balanced': { title: t.balanced, desc: t.balancedDesc, emoji: '⚖️' },
      'passive': { title: t.passive, desc: t.passiveDesc, emoji: '🎯' }
    };
    return labels[style];
  };
  
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t.step5Title}</h2>
        <p className="text-gray-400">{t.step5Subtitle}</p>
      </div>
      
      {/* Options */}
      <div className="space-y-3">
        {playstyleOptions.map(option => {
          const isSelected = currentStyle === option.value;
          const labels = getLabels(option.value);
          
          return (
            <button
              key={option.value}
              onClick={() => setPlaystyle(option.value)}
              className={cn(
                'w-full p-5 rounded-2xl border transition-all duration-200 text-right',
                isSelected
                  ? 'bg-gradient-to-l from-amber-500/10 to-transparent border-amber-500/30 ring-2 ring-amber-500/30'
                  : `${option.bgColor} ${option.borderColor} hover:ring-1 hover:ring-white/10`
              )}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center shrink-0',
                  isSelected ? 'bg-amber-500/20' : option.bgColor
                )}>
                  <span className="text-2xl">{labels.emoji}</span>
                </div>
                
                {/* Text */}
                <div className="flex-1 text-right">
                  <p className={cn(
                    'text-lg font-bold mb-1',
                    isSelected ? 'text-amber-400' : option.color
                  )}>
                    {labels.title}
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {labels.desc}
                  </p>
                </div>
                
                {/* Radio indicator */}
                <div className={cn(
                  'w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center mt-1',
                  isSelected ? 'border-amber-500 bg-amber-500' : 'border-gray-600'
                )}>
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Summary */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <p className="text-sm text-gray-400 text-center">
          {state.language === 'ar' ? 'اخترت أسلوب' : 'You selected'}{' '}
          <span className="text-amber-400 font-bold">{getLabels(currentStyle).emoji} {getLabels(currentStyle).title}</span>
        </p>
      </div>
    </div>
  );
}
