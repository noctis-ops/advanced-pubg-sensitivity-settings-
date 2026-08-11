import { useApp } from '../../context/AppContext';

export function Footer() {
  const { t } = useApp();

  return (
    <footer className="py-6 px-4 mt-8 border-t border-white/5">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs text-gray-600">
          PUBG Sensitivity Generator v1.0
        </p>
        <p className="text-xs text-gray-600 mt-1">
          {t.madeFor} PUBG Mobile Players 🎮
        </p>
      </div>
    </footer>
  );
}
