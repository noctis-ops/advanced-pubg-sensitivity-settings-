import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Navigation } from './components/layout/Navigation';
import { StepIndicator } from './components/steps/StepIndicator';
import { Step1Device } from './components/steps/Step1Device';
import { Step2FPS } from './components/steps/Step2FPS';
import { Step3Fingers } from './components/steps/Step3Fingers';
import { Step4Gyroscope } from './components/steps/Step4Gyroscope';
import { Step5Playstyle } from './components/steps/Step5Playstyle';
import { ResultsPage } from './components/results/ResultsPage';
import { cn } from './utils/cn';

function AppContent() {
  const { state, isRTL } = useApp();
  const { currentStep } = state;
  
  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Device />;
      case 2: return <Step2FPS />;
      case 3: return <Step3Fingers />;
      case 4: return <Step4Gyroscope />;
      case 5: return <Step5Playstyle />;
      case 'results': return <ResultsPage />;
      default: return <Step1Device />;
    }
  };
  
  return (
    <div 
      className={cn(
        "min-h-screen bg-[#0a0a0f] text-white",
        isRTL ? "font-arabic" : "font-sans"
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Background pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      <div className="relative z-10">
        <Header />
        
        <main className="max-w-2xl mx-auto px-4 pb-8">
          {/* Step indicator */}
          <StepIndicator />
          
          {/* Current step content */}
          <div className="min-h-[400px]">
            {renderStep()}
          </div>
          
          {/* Navigation */}
          <Navigation />
        </main>
        
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
