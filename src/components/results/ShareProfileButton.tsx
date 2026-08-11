import { useState } from 'react';
import { Check, Link2, Share2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { createProfileShareUrl } from '../../utils/profile-sharing';
import { trackEvent } from '../../utils/analytics';

export function ShareProfileButton() {
  const { state, t } = useApp();
  const [shared, setShared] = useState(false);

  if (!state.generatedSensitivity) return null;

  const canNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;

  const share = async () => {
    const url = createProfileShareUrl(state.generatedSensitivity!);
    try {
      if (canNativeShare) {
        await navigator.share({ title: t.appName, text: t.resultsSubtitle, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
      trackEvent('profile_shared');
      setShared(true);
      window.setTimeout(() => setShared(false), 2500);
    } catch {
      // User cancellation is intentionally silent; clipboard failures are
      // handled by the regular copy action on the results page.
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/20"
    >
      {shared ? <Check className="w-4 h-4" /> : canNativeShare ? <Share2 className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
      {shared ? t.shareReady : t.shareProfile}
    </button>
  );
}
