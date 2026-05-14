import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { upsertProfile } from '@/lib/profile';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/lib/constants';
import { GraduationCap, User as UserIcon, Sparkles } from 'lucide-react';

const ProfileOnboardingPage: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    display_name: user?.user_metadata?.full_name || '',
    age: '',
    college: '',
    course: '',
    year: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await upsertProfile(user.id, {
        ...form,
        age: form.age ? parseInt(form.age) : null,
        year: form.year ? parseInt(form.year) : null,
        avatar_url: user.user_metadata?.avatar_url || null,
        // Default username if not set
        username: profile?.username || user.email?.split('@')[0].replace(/[^a-z0-9_]/g, '') + Math.floor(Math.random() * 1000),
      });
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles size={32} />
          </div>
          <h1 className="text-3xl font-display font-black gradient-text">
            Welcome to StudentBytes!
          </h1>
          <p className="text-text-muted mt-2">
            Let's personalize your learning experience.
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold text-sm mb-2">
                <UserIcon size={16} />
                Basic Information
              </div>
              <Input
                label="Display Name"
                value={form.display_name}
                onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                placeholder="How should we call you?"
                required
              />
              <Input
                label="Age"
                type="number"
                value={form.age}
                onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                placeholder="Your age"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold text-sm mb-2">
                <GraduationCap size={16} />
                Academic Details
              </div>
              <Input
                label="College / University"
                value={form.college}
                onChange={e => setForm(f => ({ ...f, college: e.target.value }))}
                placeholder="e.g. Rishihood University"
                required
              />
              <Input
                label="Course / Branch"
                value={form.course}
                onChange={e => setForm(f => ({ ...f, course: e.target.value }))}
                placeholder="e.g. B.Tech CS & AI"
                required
              />
              <div>
                <label className="text-sm font-medium text-text-muted mb-2 block">
                  Current Year
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['1', '2', '3', '4'].map(y => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, year: y }))}
                      className={`py-2 rounded-lg text-sm font-bold border transition-all ${
                        form.year === y
                          ? 'bg-primary text-white border-primary'
                          : 'bg-surface-2 border-border text-text-muted hover:border-primary/50'
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={!form.display_name || !form.age || !form.college || !form.course || !form.year}
            >
              Complete Profile
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProfileOnboardingPage;
