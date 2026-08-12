import { cn } from '../../utils/cn';
import { useApp } from '../../context/AppContext';
import { GyroscopeMode } from '../../types';
import { Smartphone, Target, RotateCw, Star } from 'lucide-react';

const gyroOptions: {
  value: GyroscopeMode;
  icon: typeof Smartphone;
  color: string;
  bgColor: string;
}[] = [
  { value: 'off', icon: Smartphone, color: 'text-gray-400', bgColor: 'bg-gray-500/10' },
  { value: 'scope-only', icon: Target, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  { value: 'always-on', icon: RotateCw, color: 'text-green-400', bgColor: 'bg-green-500/10' }
];

export function Step4Gyroscope() {
  const { state, t, setGyroscope } = useApp();
  const currentMode = state.playerSettings.gyroscopeMode;

  const getLabels = (mode: GyroscopeMode) => {
    const labels: Record<GyroscopeMode, { title: string; desc: string }> = {
      'off': { title: t.gyroOff, desc: t.gyroOffDesc },
      'scope-only': { title: t.gyroScopeOnly, desc: t.gyroScopeOnlyDesc },
      'always-on': { title: t.gyroAlwaysOn, desc: t.gyroAlwaysOnDesc }
    };
    return labels[mode];
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t.step4Title}</h2>
        <p className="text-gray-400">{t.step4Subtitle}</p>
      </div>

      {/* Gyroscope quality info */}
      {state.selectedDevice && (
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="text-gray-400">{t.gyroQuality}:</span>
          <div className="flex items-center gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-2 h-4 rounded-sm',
                  i < state.selectedDevice!.specs.gyroscopeQuality
                    ? 'bg-green-500'
                    : 'bg-white/10'
                )}
              />
            ))}
          </div>
          <span className="text-green-400 font-bold">{state.selectedDevice.specs.gyroscopeQuality}/10</span>
        </div>
      )}

      {/* Options */}
      <div className="space-y-3">
        {gyroOptions.map(option => {
          const isSelected = currentMode === option.value;
          const labels = getLabels(option.value);
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              onClick={() => setGyroscope(option.value)}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-right',
                isSelected
                  ? 'bg-amber-500/10 border-amber-500/30 ring-2 ring-amber-500/30'
                  : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
              )}
            >
              {/* Icon */}
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                isSelected ? 'bg-amber-500/20' : option.bgColor
              )}>
                <Icon className={cn('w-6 h-6', isSelected ? 'text-amber-400' : option.color)} />
              </div>

              {/* Text */}
              <div className="flex-1 text-right">
                <div className="flex items-center gap-2 justify-end">
                  <p className={cn('font-bold', isSelected ? 'text-amber-400' : 'text-white')}>
                    {labels.title}
                  </p>
                  {option.value === 'always-on' && (
                    <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3" />
                      {t.recommended}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-0.5">{labels.desc}</p>
              </div>

              {/* Radio indicator */}
              <div className={cn(
                'w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center',
                isSelected ? 'border-amber-500 bg-amber-500' : 'border-gray-600'
              )}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Info box for "off" */}
      {currentMode === 'off' && (
        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-sm text-yellow-400">
            ⚠️ {state.playerSettings.fingerCount === 2
              ? (state.language === 'ar' ? 'بدون جايرو مع إبهامين قد يكون صعباً - سنرفع حساسية الكاميرا للتعويض' : 'No gyro with thumbs can be challenging - we\'ll increase camera sensitivity to compensate')
              : (state.language === 'ar' ? 'سنرفع حساسية الكاميرا للتعويض عن عدم استخدام الجايرو' : 'We\'ll increase camera sensitivity to compensate for no gyro')}
          </p>
        </div>
      )}
    </div>
  );
}
