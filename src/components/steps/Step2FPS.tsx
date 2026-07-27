import { cn } from '../../utils/cn';
import { useApp } from '../../context/AppContext';
import { FPSOption } from '../../types';
import { Zap, AlertCircle } from 'lucide-react';

const fpsOptions: { value: FPSOption; label: string; labelAr: string }[] = [
  { value: 30, label: 'Smooth', labelAr: 'سلس' },
  { value: 60, label: 'High', labelAr: 'عالي' },
  { value: 90, label: 'Ultra', labelAr: 'ألترا' },
  { value: 120, label: 'Extreme', labelAr: 'إكستريم' }
];

export function Step2FPS() {
  const { state, t, isRTL, setFPS } = useApp();
  const maxFPS = state.selectedDevice?.specs.maxFPS || 60;
  const currentFPS = state.playerSettings.preferredFPS;
  
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t.step2Title}</h2>
        <p className="text-gray-400">{t.step2Subtitle}</p>
      </div>
      
      {/* Device info */}
      {state.selectedDevice && (
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="text-gray-400">{t.yourDevice}</span>
          <span className="text-white font-semibold">{isRTL ? state.selectedDevice.nameAr : state.selectedDevice.name}</span>
          <span className="text-gray-400">{t.supportsUpTo}</span>
          <span className="text-amber-400 font-bold">{maxFPS} FPS</span>
        </div>
      )}
      
      {/* FPS options */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {fpsOptions.map(option => {
          const isDisabled = option.value > maxFPS;
          const isSelected = option.value === currentFPS;
          
          return (
            <button
              key={option.value}
              onClick={() => !isDisabled && setFPS(option.value)}
              disabled={isDisabled}
              className={cn(
                'relative p-4 rounded-2xl border transition-all duration-200',
                isSelected && 'bg-amber-500/10 border-amber-500/30 ring-2 ring-amber-500/30',
                !isSelected && !isDisabled && 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20',
                isDisabled && 'opacity-40 cursor-not-allowed bg-white/[0.02] border-white/5'
              )}
            >
              {/* FPS number */}
              <div className={cn(
                'text-3xl font-black mb-1 tabular-nums',
                isSelected ? 'text-amber-400' : 'text-white'
              )}>
                {option.value}
              </div>
              
              {/* Label */}
              <div className={cn(
                'text-sm font-medium',
                isSelected ? 'text-amber-400' : 'text-gray-400'
              )}>
                {isRTL ? option.labelAr : option.label}
              </div>
              
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-2 left-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
              )}
              
              {/* Disabled indicator */}
              {isDisabled && (
                <div className="absolute top-2 left-2">
                  <AlertCircle className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Tip */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <p className="text-sm text-blue-400">
          {t.fpsTip}
        </p>
      </div>
      
      {/* Current selection summary */}
      <div className="text-center">
        <p className="text-gray-400 text-sm">
          {isRTL ? 'اخترت' : 'Selected'}:{' '}
          <span className="text-amber-400 font-bold text-lg">{currentFPS} FPS</span>
        </p>
      </div>
    </div>
  );
}
