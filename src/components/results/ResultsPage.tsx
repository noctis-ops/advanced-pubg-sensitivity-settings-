import { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { useApp } from '../../context/AppContext';
import { generateFullSensitivity } from '../../utils/sensitivity-calculator';
import { SCOPE_KEYS, SCOPE_LABELS } from '../../data/constants';
import { SensitivitySet } from '../../types';
import { 
  Camera, 
  Crosshair, 
  RotateCw, 
  Target, 
  Copy, 
  Check, 
  RefreshCw,
  ChevronDown,
  Info,
  Move,
  Eye
} from 'lucide-react';
import { Button } from '../ui/Button';
import { WeaponSensitivity } from './WeaponSensitivity';

type TabId = 'camera' | 'ads' | 'gyroscope' | 'adsGyroscope';

const tabs: { id: TabId; icon: typeof Camera; color: string }[] = [
  { id: 'camera', icon: Camera, color: 'text-amber-400' },
  { id: 'ads', icon: Crosshair, color: 'text-blue-400' },
  { id: 'gyroscope', icon: RotateCw, color: 'text-green-400' },
  { id: 'adsGyroscope', icon: Target, color: 'text-red-400' }
];

export function ResultsPage() {
  const { state, t, isRTL, setSensitivity, reset, setStep } = useApp();
  const [activeTab, setActiveTab] = useState<TabId>('camera');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  
  // Generate sensitivity on mount
  useEffect(() => {
    if (state.selectedDevice && !state.generatedSensitivity) {
      setIsGenerating(true);
      // Simulate loading for UX
      const timer = setTimeout(() => {
        const result = generateFullSensitivity(state.selectedDevice!, state.playerSettings);
        setSensitivity(result);
        setIsGenerating(false);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setIsGenerating(false);
    }
  }, [state.selectedDevice, state.playerSettings]);
  
  const sensitivity = state.generatedSensitivity?.sensitivity;
  const explanations = state.generatedSensitivity?.explanations || [];
  const additional = state.generatedSensitivity?.additional;
  
  // Copy function
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };
  
  // Format sensitivity for copying
  const formatSensitivityText = (category: TabId, data: SensitivitySet): string => {
    const labels: Record<TabId, string> = {
      camera: 'Camera Sensitivity',
      ads: 'ADS Sensitivity',
      gyroscope: 'Gyroscope Sensitivity',
      adsGyroscope: 'ADS Gyroscope Sensitivity'
    };
    
    let text = `【 ${labels[category]} 】\n`;
    SCOPE_KEYS.forEach(key => {
      text += `${SCOPE_LABELS[key].en}: ${data[key]}\n`;
    });
    text += `Aim TPP: ${data.aimTPP}\n`;
    text += `Aim FPP: ${data.aimFPP}\n`;
    return text;
  };
  
  const formatAllSensitivity = (): string => {
    if (!sensitivity) return '';
    let text = `🎮 PUBG Mobile Sensitivity\n`;
    text += `📱 ${state.selectedDevice?.name}\n\n`;
    text += formatSensitivityText('camera', sensitivity.camera);
    text += '\n';
    text += formatSensitivityText('ads', sensitivity.ads);
    text += '\n';
    text += formatSensitivityText('gyroscope', sensitivity.gyroscope);
    text += '\n';
    text += formatSensitivityText('adsGyroscope', sensitivity.adsGyroscope);
    return text;
  };
  
  // Loading state
  if (isGenerating) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-amber-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-xl font-bold text-white mb-2">{t.generating}</p>
        <div className="space-y-2 text-sm text-gray-400">
          <p className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" /> {t.analyzingDevice}
          </p>
          <p className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" /> {t.calculatingScreen}
          </p>
          <p className="flex items-center gap-2 animate-pulse">
            <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            {t.optimizingGyro}
          </p>
        </div>
      </div>
    );
  }
  
  if (!sensitivity || !state.selectedDevice) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Something went wrong. Please try again.</p>
        <Button onClick={() => setStep(1)} className="mt-4">
          {t.startOver}
        </Button>
      </div>
    );
  }
  
  const currentData = sensitivity[activeTab];
  const currentTab = tabs.find(tab => tab.id === activeTab)!;
  
  const tabLabels: Record<TabId, string> = {
    camera: t.camera,
    ads: t.ads,
    gyroscope: t.gyroscope,
    adsGyroscope: t.adsGyroscope
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t.resultsTitle}</h2>
        <p className="text-gray-400">{t.resultsSubtitle}</p>
      </div>
      
      {/* Device summary */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="text-white font-semibold">{isRTL ? state.selectedDevice.nameAr : state.selectedDevice.name}</span>
          <span className="text-gray-500">|</span>
          <span className="text-amber-400">{state.playerSettings.preferredFPS} FPS</span>
          <span className="text-gray-500">|</span>
          <span className="text-green-400">{state.playerSettings.fingerCount} {t.fingers}</span>
          <span className="text-gray-500">|</span>
          <span className="text-blue-400">
            {state.playerSettings.gyroscopeMode === 'always-on' ? 'Full Gyro' : 
             state.playerSettings.gyroscopeMode === 'scope-only' ? 'Scope Gyro' : 'No Gyro'}
          </span>
        </div>
      </div>
      
      {/* Copy all button */}
      <div className="flex justify-center">
        <Button
          onClick={() => copyToClipboard(formatAllSensitivity(), 'all')}
          variant={copiedId === 'all' ? 'primary' : 'outline'}
          size="lg"
        >
          {copiedId === 'all' ? (
            <><Check className="w-5 h-5" /> {t.copied}</>
          ) : (
            <><Copy className="w-5 h-5" /> {t.copyAll}</>
          )}
        </Button>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/5 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-gray-300'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive && tab.color)} />
              <span className="hidden sm:inline">{tabLabels[tab.id]}</span>
            </button>
          );
        })}
      </div>
      
      {/* Sensitivity table */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <currentTab.icon className={cn('w-5 h-5', currentTab.color)} />
            <span className="font-bold text-white">{tabLabels[activeTab]}</span>
          </div>
          <button
            onClick={() => copyToClipboard(formatSensitivityText(activeTab, currentData), activeTab)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            {copiedId === activeTab ? (
              <><Check className="w-3.5 h-3.5 text-green-400" /> {t.copied}</>
            ) : (
              <><Copy className="w-3.5 h-3.5" /> {t.copy}</>
            )}
          </button>
        </div>
        
        {/* Values */}
        <div className="divide-y divide-white/5">
          {SCOPE_KEYS.map(key => (
            <div key={key} className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.02]">
              <div>
                <span className="text-gray-300">{SCOPE_LABELS[key].ar}</span>
                <span className="text-gray-600 text-xs mr-2">({SCOPE_LABELS[key].en})</span>
              </div>
              <span className={cn('text-xl font-black tabular-nums', currentTab.color)}>
                {currentData[key]}
              </span>
            </div>
          ))}
          {/* Aim Features */}
          <div className="px-4 py-3 bg-amber-500/5">
            <p className="text-xs text-amber-400 font-semibold mb-2">Aim Features</p>
            <div className="flex gap-4">
              <div className="flex-1 text-center p-2 rounded-lg bg-white/[0.03]">
                <p className="text-xs text-gray-500">Aim TPP</p>
                <p className={cn('text-lg font-black', currentTab.color)}>{currentData.aimTPP}</p>
              </div>
              <div className="flex-1 text-center p-2 rounded-lg bg-white/[0.03]">
                <p className="text-xs text-gray-500">Aim FPP</p>
                <p className={cn('text-lg font-black', currentTab.color)}>{currentData.aimFPP}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional settings */}
      {additional && (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Move className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-400">{t.movementButtonSize}</span>
            </div>
            <p className="text-2xl font-black text-purple-400">{additional.movementButtonSize}%</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-gray-400">{t.freeLook}</span>
            </div>
            <p className="text-2xl font-black text-cyan-400">{additional.freeLook}</p>
          </div>
        </div>
      )}
      
      {/* Explanation toggle */}
      <button
        onClick={() => setShowExplanation(!showExplanation)}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-400" />
          <span className="font-medium text-white">{t.whyTheseValues}</span>
        </div>
        <ChevronDown className={cn('w-5 h-5 text-gray-400 transition-transform', showExplanation && 'rotate-180')} />
      </button>
      
      {/* Explanation content */}
      {showExplanation && explanations.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <div className="divide-y divide-white/5">
            {explanations.map((exp, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-white font-medium">{exp.factorAr}</p>
                  <p className="text-xs text-gray-500">{exp.impactAr}</p>
                </div>
                <span className={cn(
                  'text-sm font-bold px-2 py-0.5 rounded',
                  exp.adjustment > 0 ? 'text-green-400 bg-green-500/10' : 
                  exp.adjustment < 0 ? 'text-red-400 bg-red-500/10' : 'text-gray-400'
                )}>
                  {exp.adjustment > 0 ? '+' : ''}{exp.adjustment}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Tip */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <p className="text-sm text-amber-400">{t.tipAimFeatures}</p>
      </div>
      
      {/* Weapon Sensitivity */}
      {state.playerSettings.gyroscopeMode !== 'off' && (
        <WeaponSensitivity 
          baseSensitivity={{
            ads: sensitivity.ads,
            adsGyroscope: sensitivity.adsGyroscope
          }}
        />
      )}
      
      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={reset} variant="secondary" className="flex-1">
          <RefreshCw className="w-4 h-4" />
          {t.startOver}
        </Button>
      </div>
    </div>
  );
}
