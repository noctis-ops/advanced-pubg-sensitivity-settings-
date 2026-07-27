import { useState } from 'react';
import { ChevronDown, Info, Crosshair, RotateCw } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useApp } from '../../context/AppContext';
import { weapons, weaponCategories, Weapon, WeaponCategory } from '../../data/weapons';
import { SensitivitySet } from '../../types';

interface WeaponSensitivityProps {
  baseSensitivity: {
    ads: SensitivitySet;
    adsGyroscope: SensitivitySet;
  };
}

export function WeaponSensitivity({ baseSensitivity }: WeaponSensitivityProps) {
  const { isRTL } = useApp();
  const [expandedCategory, setExpandedCategory] = useState<WeaponCategory | null>('ar');
  const [expandedWeapon, setExpandedWeapon] = useState<string | null>(null);
  
  // Calculate weapon-specific sensitivity
  const calculateWeaponSens = (weapon: Weapon, baseValue: number, isGyro: boolean): number => {
    const multiplier = isGyro ? weapon.gyroMultiplier : weapon.adsMultiplier;
    return Math.round(baseValue * multiplier);
  };
  
  const getDifficultyColor = (difficulty: Weapon['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/10';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10';
      case 'hard': return 'text-red-400 bg-red-500/10';
    }
  };
  
  const getDifficultyLabel = (difficulty: Weapon['difficulty']) => {
    const labels = {
      easy: { en: 'Easy', ar: 'سهل' },
      medium: { en: 'Medium', ar: 'متوسط' },
      hard: { en: 'Hard', ar: 'صعب' }
    };
    return isRTL ? labels[difficulty].ar : labels[difficulty].en;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <span>🔫</span>
        {isRTL ? 'حساسية الأسلحة' : 'Weapon Sensitivity'}
      </h3>
      
      <p className="text-xs text-gray-400">
        {isRTL 
          ? 'حساسية مخصصة لكل سلاح بناءً على الارتداد ومعدل النار'
          : 'Custom sensitivity for each weapon based on recoil and fire rate'}
      </p>

      {/* Categories */}
      <div className="space-y-3">
        {weaponCategories.map(category => {
          const categoryWeapons = weapons.filter(w => w.category === category.id);
          const isExpanded = expandedCategory === category.id;
          
          return (
            <div key={category.id} className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
              {/* Category header */}
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                className="w-full flex items-center gap-3 p-4 hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-xl">{category.icon}</span>
                <span className="flex-1 text-right font-semibold text-white">
                  {isRTL ? category.nameAr : category.name}
                </span>
                <span className="text-xs text-gray-500">
                  {categoryWeapons.length} {isRTL ? 'سلاح' : 'weapons'}
                </span>
                <ChevronDown className={cn(
                  'w-4 h-4 text-gray-500 transition-transform',
                  isExpanded && 'rotate-180'
                )} />
              </button>
              
              {/* Weapons list */}
              {isExpanded && (
                <div className="border-t border-white/5">
                  {categoryWeapons.map(weapon => {
                    const isWeaponExpanded = expandedWeapon === weapon.id;
                    
                    return (
                      <div key={weapon.id} className="border-b border-white/5 last:border-0">
                        {/* Weapon header */}
                        <button
                          onClick={() => setExpandedWeapon(isWeaponExpanded ? null : weapon.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                        >
                          <span className="text-lg">{weapon.icon}</span>
                          <div className="flex-1 text-right">
                            <p className="font-medium text-white">{weapon.name}</p>
                            <p className="text-xs text-gray-500">
                              {weapon.bestScopes.join(' • ')}
                            </p>
                          </div>
                          <span className={cn(
                            'text-[10px] px-2 py-0.5 rounded-full font-medium',
                            getDifficultyColor(weapon.difficulty)
                          )}>
                            {getDifficultyLabel(weapon.difficulty)}
                          </span>
                          <ChevronDown className={cn(
                            'w-3 h-3 text-gray-500 transition-transform',
                            isWeaponExpanded && 'rotate-180'
                          )} />
                        </button>
                        
                        {/* Weapon details */}
                        {isWeaponExpanded && (
                          <div className="px-4 pb-4 space-y-3">
                            {/* Recoil info */}
                            <div className="flex gap-4 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">{isRTL ? 'ارتداد عمودي' : 'V.Recoil'}:</span>
                                <div className="flex gap-0.5">
                                  {Array.from({ length: 10 }).map((_, i) => (
                                    <div
                                      key={i}
                                      className={cn(
                                        'w-2 h-3 rounded-sm',
                                        i < weapon.recoil.vertical ? 'bg-red-500' : 'bg-white/10'
                                      )}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">{isRTL ? 'ارتداد أفقي' : 'H.Recoil'}:</span>
                                <div className="flex gap-0.5">
                                  {Array.from({ length: 10 }).map((_, i) => (
                                    <div
                                      key={i}
                                      className={cn(
                                        'w-2 h-3 rounded-sm',
                                        i < weapon.recoil.horizontal ? 'bg-orange-500' : 'bg-white/10'
                                      )}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            {/* Sensitivity values */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                  <Crosshair className="w-3.5 h-3.5 text-blue-400" />
                                  <span className="text-xs text-blue-400 font-medium">ADS (Red Dot)</span>
                                </div>
                                <p className="text-xl font-black text-blue-400">
                                  {calculateWeaponSens(weapon, baseSensitivity.ads.redDot, false)}
                                </p>
                                <p className="text-[10px] text-gray-500 mt-1">
                                  {weapon.adsMultiplier < 1 ? '↓' : weapon.adsMultiplier > 1 ? '↑' : '='} 
                                  {Math.round((weapon.adsMultiplier - 1) * 100)}%
                                </p>
                              </div>
                              
                              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                  <RotateCw className="w-3.5 h-3.5 text-green-400" />
                                  <span className="text-xs text-green-400 font-medium">Gyro (Red Dot)</span>
                                </div>
                                <p className="text-xl font-black text-green-400">
                                  {calculateWeaponSens(weapon, baseSensitivity.adsGyroscope.redDot, true)}
                                </p>
                                <p className="text-[10px] text-gray-500 mt-1">
                                  {weapon.gyroMultiplier < 1 ? '↓' : weapon.gyroMultiplier > 1 ? '↑' : '='} 
                                  {Math.round((weapon.gyroMultiplier - 1) * 100)}%
                                </p>
                              </div>
                            </div>
                            
                            {/* Tip */}
                            <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                              <div className="flex items-start gap-2">
                                <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-gray-300 leading-relaxed">
                                  {isRTL ? weapon.tips.ar : weapon.tips.en}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
