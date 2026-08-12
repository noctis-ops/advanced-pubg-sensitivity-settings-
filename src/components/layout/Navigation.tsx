import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

export function Navigation() {
  const { state, t, isRTL, nextStep, prevStep, canGoNext, setStep } = useApp();
  const { currentStep } = state;

  // Don't show navigation on results page
  if (currentStep === 'results') return null;

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 6;

  const handleNext = () => {
    if (isLastStep) {
      setStep('results');
    } else {
      nextStep();
    }
  };

  const NextIcon = isRTL ? ChevronLeft : ChevronRight;
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;

  return (
    <div className="flex gap-3 mt-8">
      {/* Back button */}
      {!isFirstStep && (
        <Button
          onClick={prevStep}
          variant="secondary"
          size="lg"
          className="flex-1 sm:flex-none"
        >
          <PrevIcon className="w-5 h-5" />
          {t.back}
        </Button>
      )}

      {/* Next/Generate button */}
      <Button
        onClick={handleNext}
        disabled={!canGoNext()}
        variant="primary"
        size="lg"
        className={cn(
          'flex-1',
          isLastStep && 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/25 hover:shadow-green-500/40'
        )}
      >
        {isLastStep ? (
          <>
            <Sparkles className="w-5 h-5" />
            {t.generate}
          </>
        ) : (
          <>
            {t.next}
            <NextIcon className="w-5 h-5" />
          </>
        )}
      </Button>
    </div>
  );
}
