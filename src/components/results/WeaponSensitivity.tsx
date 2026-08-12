import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useApp } from '../../context/AppContext';
import { weapons, weaponCategories, type WeaponCategory } from '../../data/weapons';
import type { WeaponSensitivityResult } from '../../types';
import { WeaponSensitivityCard } from './WeaponSensitivityCard';

export function WeaponSensitivity() {
  const { state, t, isRTL } = useApp();
  const [expandedCategory, setExpandedCategory] = useState<WeaponCategory | null>('ar');
  const [expandedWeapon, setExpandedWeapon] = useState<string | null>(null);

  const results = state.generatedSensitivity?.weaponSensitivities ?? [];

  const resultById = useMemo(
    () => new Map(results.map((result) => [result.weapon.id, result])),
    [results]
  );

  const getDifficultyColor = (difficulty: WeaponSensitivityResult['weapon']['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/10';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10';
      case 'hard': return 'text-red-400 bg-red-500/10';
    }
  };

  const getDifficultyLabel = (difficulty: WeaponSensitivityResult['weapon']['difficulty']) => {
    if (isRTL) {
      return { easy: 'سهل', medium: 'متوسط', hard: 'صعب' }[difficulty];
    }
    return { easy: t.easy, medium: t.medium, hard: t.hard }[difficulty];
  };

  if (!state.selectedDevice) return null;

  return (
    <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>🔫</span>
          {t.weaponSensitivity}
        </h3>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
          {t.weaponSensitivityDesc}
        </p>
        <p className="text-[11px] text-amber-400/80 mt-2 leading-relaxed">
          {t.weaponScopeNote}
        </p>
      </div>

      <div className="space-y-3">
        {weaponCategories.map((category) => {
          const categoryWeapons = weapons.filter((weapon) => weapon.category === category.id);
          const isCategoryExpanded = expandedCategory === category.id;

          return (
            <div
              key={category.id}
              className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setExpandedCategory(isCategoryExpanded ? null : category.id)}
                className="w-full flex items-center gap-3 p-4 hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-xl">{category.icon}</span>
                <span className="flex-1 text-start font-semibold text-white">
                  {isRTL ? category.nameAr : category.name}
                </span>
                <span className="text-xs text-gray-500">
                  {categoryWeapons.length} {t.weaponsCount}
                </span>
                <ChevronDown className={cn(
                  'w-4 h-4 text-gray-500 transition-transform',
                  isCategoryExpanded && 'rotate-180'
                )} />
              </button>

              {isCategoryExpanded && (
                <div className="border-t border-white/5">
                  {categoryWeapons.map((weapon) => {
                    const result = resultById.get(weapon.id);
                    const isWeaponExpanded = expandedWeapon === weapon.id;

                    return (
                      <div key={weapon.id} className="border-b border-white/5 last:border-0">
                        <button
                          type="button"
                          onClick={() => setExpandedWeapon(isWeaponExpanded ? null : weapon.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                        >
                          <span className="text-lg">{weapon.icon}</span>
                          <div className="flex-1 text-start min-w-0">
                            <p className="font-medium text-white">{isRTL ? weapon.nameAr : weapon.name}</p>
                            <p className="text-xs text-gray-500 truncate">
                              {weapon.bestScopes.join(' • ')}
                            </p>
                          </div>
                          <span className={cn(
                            'text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0',
                            getDifficultyColor(weapon.difficulty)
                          )}>
                            {getDifficultyLabel(weapon.difficulty)}
                          </span>
                          <span className="text-[10px] text-gray-500 shrink-0">
                            {result?.values.length ?? 0} {t.scopesCount}
                          </span>
                          <ChevronDown className={cn(
                            'w-3 h-3 text-gray-500 transition-transform shrink-0',
                            isWeaponExpanded && 'rotate-180'
                          )} />
                        </button>

                        {isWeaponExpanded && result && (
                          <WeaponSensitivityCard result={result} isRTL={isRTL} />
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
