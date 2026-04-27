import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { ROUTES } from '@/lib/constants';

export const ApiKeyBanner: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();

  const hasKey = state.settings.provider === 'gemini'
    ? !!state.settings.geminiApiKey
    : !!state.apiKey;

  if (hasKey) return null;

  return (
    <div className="mx-3 mb-3 p-3 rounded-xl bg-white/5 border border-white/5">
      <p className="text-[10px] text-text-muted leading-relaxed">
        ✦ Using built-in AI. Add your own key in{' '}
        <button
          onClick={() => navigate(ROUTES.SETTINGS)}
          className="text-primary hover:underline font-bold"
        >
          Settings
        </button>{' '}
        for unlimited usage.
      </p>
    </div>
  );
};
