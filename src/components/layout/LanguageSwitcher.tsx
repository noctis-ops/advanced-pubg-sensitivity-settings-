import { Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function LanguageSwitcher() {
  const { state, setLanguage } = useApp();

  return (
    <button
      type="button"
      onClick={() => setLanguage(state.language === 'ar' ? 'en' : 'ar')}
      aria-label={state.language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all"
    >
      <Globe className="w-4 h-4" />
      <span>{state.language === 'ar' ? 'EN' : 'عربي'}</span>
    </button>
  );
}
