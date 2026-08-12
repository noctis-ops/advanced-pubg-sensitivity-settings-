import { useState } from 'react';
import { MessageSquare, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { trackEvent } from '../../utils/analytics';

interface FeedbackEntry {
  rating: number;
  note: string;
  createdAt: string;
}

export function FeedbackPanel() {
  const { t, isRTL } = useApp();
  const [, setFeedback] = useLocalStorage<FeedbackEntry[]>('pubg-sensitivity-feedback-v1', []);
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  const submit = () => {
    if (!rating && !note.trim()) return;
    setFeedback((previous) => [...previous, { rating, note: note.trim(), createdAt: new Date().toISOString() }].slice(-50));
    trackEvent('feedback_submitted');
    setSaved(true);
    setNote('');
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-start gap-3">
        <MessageSquare className="w-5 h-5 text-amber-400 mt-0.5" />
        <div>
          <h3 className="font-bold text-white">{t.feedbackTitle}</h3>
          <p className="text-xs text-gray-500 mt-1">{t.feedbackDescription}</p>
        </div>
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-2">{t.feedbackRating}</p>
        <div className="flex gap-1" role="radiogroup" aria-label={t.feedbackRating}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button type="button" key={value} onClick={() => setRating(value)} className="p-1" aria-label={`${value}/5`}>
              <Star className={`w-5 h-5 ${value <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} />
            </button>
          ))}
        </div>
      </div>
      <label className="block text-xs text-gray-400">
        <span className="block mb-1">{t.feedbackNote}</span>
        <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder={t.feedbackPlaceholder} rows={3} className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-gray-600" />
      </label>
      <button type="button" onClick={submit} className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-200 hover:bg-amber-500/20">
        {saved ? t.feedbackSaved : t.submitFeedback}
      </button>
    </section>
  );
}
