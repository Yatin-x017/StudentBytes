import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      // Don't fire when typing in input/textarea
      const tag = (e.target as HTMLElement).tagName;
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable;

      if (ctrl && e.key === 'k') {
        e.preventDefault();
        // Open command palette
        window.dispatchEvent(new CustomEvent('open-command-palette'));
      }

      if (isTyping) return;

      if (ctrl && e.key === 'n') {
        e.preventDefault();
        navigate(ROUTES.STUDY);
        // Trigger new session
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('new-study-session'));
        }, 100);
      }
      if (ctrl && e.key === '1') {
        e.preventDefault();
        navigate(ROUTES.DASHBOARD);
      }
      if (ctrl && e.key === '2') {
        e.preventDefault();
        navigate(ROUTES.STUDY);
      }
      if (ctrl && e.key === '3') {
        e.preventDefault();
        navigate(ROUTES.QUIZ);
      }
      if (ctrl && e.key === '4') {
        e.preventDefault();
        navigate(ROUTES.NOTES);
      }
      if (ctrl && e.key === '5') {
        e.preventDefault();
        navigate(ROUTES.CANVAS);
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [navigate]);
}
