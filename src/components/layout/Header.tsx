import { Gamepad2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const { t } = useApp();

  return (
    <header className="relative py-6 px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-2xl mx-auto">
        {/* Language toggle */}
        <div className="absolute top-0 left-0">
          <LanguageSwitcher />
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
