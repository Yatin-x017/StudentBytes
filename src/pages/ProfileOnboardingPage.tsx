import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { upsertProfile } from '@/lib/profile';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader2, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTES } from '@/lib/constants';

const ProfileOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    age: '',
    college: '',
    branch: '', // Renamed from 'course' to match existing schema 'branch'
    year: '',
  });

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN);
      return;
    }
    // If profile already exists and has required fields, redirect to dashboard
    if (profile && profile.age && profile.college && profile.branch && profile.year) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [user, profile, navigate]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await upsertProfile(user.id, {
        age: form.age ? parseInt(form.age) : null,
        college: form.college,
        branch: form.branch,
        year: form.year ? parseInt(form.year) : null,
      });
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      console.error('Error saving profile:', error);
      // Optionally, display an error message to the user
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #faf5ff 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        <Card className="p-8 space-y-6">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                 style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 8px 24px rgba(79,70,229,0.3)' }}>
              <GraduationCap size={26} className="text-white fill-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: '#1e1b4b' }}>
              Complete Your Profile
            </h1>
            <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
              Tell us a bit about your academic background to personalize your experience.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2"
                     style={{ color: '#6b7280' }}>
                Age
              </label>
              <input
                type="number"
                value={form.age}
                onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                placeholder="18"
                className="w-full px-4 py-3 rounded-xl bg-surface-2 border
                           border-border focus:border-primary/50 focus:outline-none
                           text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2"
                     style={{ color: '#6b7280' }}>
                College / University
              </label>
              <input
                type="text"
                value={form.college}
                onChange={e => setForm(f => ({ ...f, college: e.target.value }))}
                placeholder="Rishihood University"
                className="w-full px-4 py-3 rounded-xl bg-surface-2 border
                           border-border focus:border-primary/50 focus:outline-none
                           text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2"
                     style={{ color: '#6b7280' }}>
                Branch / Major
              </label>
              <input
                type="text"
                value={form.branch}
                onChange={e => setForm(f => ({ ...f, branch: e.target.value }))}
                placeholder="B.Tech CS & AI"
                className="w-full px-4 py-3 rounded-xl bg-surface-2 border
                           border-border focus:border-primary/50 focus:outline-none
                           text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2"
                     style={{ color: '#6b7280' }}>
                Year
              </label>
              <div className="flex gap-2">
                {['1', '2', '3', '4'].map(y => (
                  <button
                    key={y}
                    onClick={() => setForm(f => ({ ...f, year: y }))}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold
                                border transition-all ${
                      form.year === y
                        ? 'bg-primary/10 border-primary/40 text-primary'
                        : 'bg-surface-2 border-border text-text-muted hover:border-border-hover'
                    }`}
                  >
                    Year {y}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving || !form.age || !form.college || !form.branch || !form.year}
            className="w-full py-4 rounded-2xl font-black text-sm text-white transition-all disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              boxShadow: '0 8px 24px rgba(79,70,229,0.3)',
            }}
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin mx-auto" />
            ) : (
              'Complete Profile'
            )}
          </Button>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfileOnboardingPage;
