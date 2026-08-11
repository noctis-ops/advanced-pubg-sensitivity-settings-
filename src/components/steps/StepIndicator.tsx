import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useApp } from '../../context/AppContext';

const steps = [1, 2, 3, 4, 5, 6] as const;

export function StepIndicator() {
  const { state, t } = useApp();
  const currentStep = state.currentStep;

  if (currentStep === 'results') return null;

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, index) => {
          const isActive = step === currentStep;
          const isCompleted = typeof currentStep === 'number' && step < currentStep;

          return (
            <div key={step} className="flex items-center">
              {/* Step circle */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                  isCompleted && 'bg-green-500 text-white',
                  isActive && 'bg-amber-500 text-white ring-4 ring-amber-500/30',
                  !isCompleted && !isActive && 'bg-white/10 text-gray-500'
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step}
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-8 sm:w-12 h-1 mx-1 rounded-full transition-all duration-300',
                    isCompleted ? 'bg-green-500' : 'bg-white/10'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step label */}
      <p className="text-center text-sm text-gray-400">
        {t.step} {currentStep} {t.stepOf} 6
      </p>
    </div>
  );
}
