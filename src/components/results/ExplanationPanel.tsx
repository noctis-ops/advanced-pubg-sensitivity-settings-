import { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useApp } from '../../context/AppContext';
import type { ExplanationFactor } from '../../types';

interface ExplanationPanelProps {
  explanations: ExplanationFactor[];
}

export function ExplanationPanel({ explanations }: ExplanationPanelProps) {
  const { t, isRTL } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-400" />
          <span className="font-medium text-white">{t.whyTheseValues}</span>
        </div>
        <ChevronDown className={cn('w-5 h-5 text-gray-400 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
          {explanations.length === 0 ? (
            <p className="p-4 text-sm text-gray-400">{t.noAdjustments}</p>
          ) : (
            <div className="divide-y divide-white/5">
              {explanations.map((explanation, index) => (
                <div key={`${explanation.factor}-${index}`} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-white font-medium">{isRTL ? explanation.factorAr : explanation.factor}</p>
                    <p className="text-xs text-gray-500">{isRTL ? explanation.impactAr : explanation.impact}</p>
                  </div>
                  <span className={cn(
                    'text-sm font-bold px-2 py-0.5 rounded',
                    explanation.adjustment > 0 ? 'text-green-400 bg-green-500/10' :
                      explanation.adjustment < 0 ? 'text-red-400 bg-red-500/10' : 'text-gray-400'
                  )}>
                    {explanation.adjustment > 0 ? '+' : ''}{explanation.adjustment}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
