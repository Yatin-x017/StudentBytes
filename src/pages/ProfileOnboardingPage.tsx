import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { upsertProfile } from '@/lib/profile';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants';
import { GraduationCap, User as UserIcon, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

const ProfileOnboardingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    display_name: user?.user_metadata?.full_name || '',
    college: '',
    branch: '',
    year: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate(ROUTES.LOGIN); return; }
    if (!form.display_name.trim()) { setError('Display name is required.'); return; }

    setLoading(true);
    setError('');

    try {
      // Generate a safe username from email or display name
      const baseUsername = (
        user.email?.split('@')[0] ||
        form.display_name.toLowerCase()
      )
        .replace(/[^a-z0-9_]/gi, '')
        .toLowerCase()
        .slice(0, 15);
      const username = baseUsername + Math.floor(Math.random() * 900 + 100);

      await upsertProfile(user.id, {
        display_name: form.display_name.trim(),
        college: form.college.trim() || null,
        branch: form.branch.trim() || null,
        year: form.year ? parseInt(form.year) : null,
        avatar_url: user.user_metadata?.avatar_url || null,
        username,
      });

      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err: any) {
      console.error('Profile save error:', err);
      // If profile save fails, just go to dashboard anyway
      // Don't block the user
      if (err?.code === '42P01' || err?.message?.includes('does not exist')) {
        // profiles table doesn't exist — skip silently
        navigate(ROUTES.DASHBOARD, { replace: true });
      } else {
        setError(err.message || 'Failed to save profile. You can update it later in Settings.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate(ROUTES.DASHBOARD, { replace: true });
  };

  const inputClass = `
    w-full px-4 py-3 rounded-xl text-sm outline-none transition-all
    bg-surface-2 border border-border text-text
    focus:border-primary/50 focus:ring-2 focus:ring-primary/10
    placeholder:text-text-faint
  `;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 animate-fade-in">

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4 border border-primary/20">
            <Sparkles size={28} />
          </div>
          <h1 className="text-3xl font-display font-black gradient-text">
            Welcome to StudentBytes!
          </h1>
          <p className="text-text-muted mt-2 text-sm">
            Set up your profile to get started. You can update this anytime.
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Basic Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest">
                <UserIcon size={14} />
                Basic Information
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-widest">
                  Display Name *
                </label>
                <input
                  value={form.display_name}
                  onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                  placeholder="How should we call you?"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Academic Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest">
                <GraduationCap size={14} />
                Academic Details
                <span className="text-text-faint font-medium normal-case tracking-normal">
                  (optional)
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-widest">
                  College / University
                </label>
                <input
                  value={form.college}
                  onChange={e => setForm(f => ({ ...f, college: e.target.value }))}
                  placeholder="e.g. Rishihood University"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-widest">
                  Course / Branch
                </label>
                <input
                  value={form.branch}
                  onChange={e => setForm(f => ({ ...f, branch: e.target.value }))}
                  placeholder="e.g. B.Tech CS & AI"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-widest">
                  Current Year
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['1', '2', '3', '4'].map(y => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, year: f.year === y ? '' : y }))}
                      className={`py-2.5 rounded-xl text-sm font-black border transition-all ${
                        form.year === y
                          ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                          : 'bg-surface-2 border-border text-text-muted hover:border-primary/40 hover:text-primary'
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-error/8 border border-error/20 text-error text-xs">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full py-3.5"
              loading={loading}
              disabled={!form.display_name.trim()}
            >
              Complete Profile
              <ArrowRight size={16} />
            </Button>
          </form>
        </Card>

        {/* Skip */}
        <p className="text-center text-xs text-text-muted">
          Want to explore first?{' '}
          <button
            onClick={handleSkip}
            className="font-bold text-primary hover:underline"
          >
            Skip for now →
          </button>
        </p>
      </div>
    </div>
  );
};

export default ProfileOnboardingPage;
