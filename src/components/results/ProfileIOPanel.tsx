import { useRef, useState } from 'react';
import { Download, FileUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { downloadProfile, parseProfile } from '../../utils/profile-io';

export function ProfileIOPanel() {
  const { state, t, isRTL, setDevice, setSensitivity, setStep } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  if (!state.generatedSensitivity) return null;

  const importFile = async (file: File) => {
    try {
      const profile = parseProfile(await file.text());
      setDevice(profile.device);
      setSensitivity(profile);
      setStep('results');
      setMessage(t.profileImported);
    } catch {
      setMessage(t.profileImportError);
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => downloadProfile(state.generatedSensitivity!)} className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200 hover:bg-cyan-500/20">
          <Download className="w-4 h-4" />{t.exportProfile}
        </button>
        <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-gray-300 hover:bg-white/[0.08]">
          <FileUp className="w-4 h-4" />{t.importProfile}
        </button>
        <input ref={inputRef} type="file" accept="application/json" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importFile(file); event.currentTarget.value = ''; }} />
      </div>
      {message && <p className="text-xs text-gray-400 mt-2">{message}</p>}
    </section>
  );
}
