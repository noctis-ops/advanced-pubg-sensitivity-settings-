import { Gamepad2, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Header() {
  const { state, t, setLanguage } = useApp();
  
  const toggleLanguage = () => {
    setLanguage(state.language === 'ar' ? 'en' : 'ar');
  };
  
  return (
    <header className="relative py-6 px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 rounded-full blur-[100px]" />
      </div>
      
      <div className="relative max-w-2xl mx-auto">
        {/* Language toggle */}
        <div className="absolute top-0 left-0">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <Globe className="w-4 h-4" />
            <span>{state.language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>
        </div>
        
        {/* Logo and title */}
        <div className="text-center pt-8 sm:pt-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30 mb-4">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              {t.appName}
            </span>
          </h1>
          
          <p className="text-sm sm:text-base text-gray-400 max-w-md mx-auto">
            {t.tagline}
          </p>
        </div>
      </div>
    </header>
  );
}
