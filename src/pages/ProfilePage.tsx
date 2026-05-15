import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getProfile, upsertProfile, checkUsernameAvailable } from '@/lib/profile';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  CheckCircle2, XCircle, ExternalLink,
  GraduationCap, Code2, Loader2
} from 'lucide-react';
import { LANGUAGES } from '@/lib/constants';
import { useAppContext } from '@/context/AppContext';

const GithubIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
);

const LinkedinIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

const TwitterIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { state } = useAppContext();
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<
    'idle' | 'checking' | 'available' | 'taken'
  >('idle');

  const [form, setForm] = useState({
    username: '',
    display_name: '',
    bio: '',
    age: '',
    college: '',
    course: '',
    year: '',
    branch: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
    preferred_language: 'Python',
    is_public: true,
  });

  useEffect(() => {
    if (!user) return;
    getProfile(user.id).then(p => {
      if (p) {
        setProfile(p);
        setForm({
          username: p.username || '',
          display_name: p.display_name || user.user_metadata?.full_name || '',
          bio: p.bio || '',
          age: p.age?.toString() || '',
          college: p.college || '',
          course: p.course || '',
          year: p.year?.toString() || '',
          branch: p.branch || '',
          github_url: p.github_url || '',
          linkedin_url: p.linkedin_url || '',
          twitter_url: p.twitter_url || '',
          preferred_language: p.preferred_language || 'Python',
          is_public: p.is_public ?? true,
        });
      } else {
        setForm(f => ({
          ...f,
          display_name: user.user_metadata?.full_name || '',
        }));
      }
    });
  }, [user]);

  // Username availability check (debounced)
  useEffect(() => {
    if (!form.username || form.username === profile?.username) {
      setUsernameStatus('idle');
      return;
    }
    if (form.username.length < 3) return;

    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      const available = await checkUsernameAvailable(form.username);
      setUsernameStatus(available ? 'available' : 'taken');
    }, 600);
    return () => clearTimeout(timer);
  }, [form.username, profile?.username]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await upsertProfile(user.id, {
        ...form,
        age: form.age ? parseInt(form.age) : null,
        year: form.year ? parseInt(form.year) : null,
        avatar_url: user.user_metadata?.avatar_url || null,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const publicUrl = form.username
    ? `${window.location.origin}/u/${form.username}`
    : null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-black gradient-text">
            Your Profile
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Customize how others see you on Student Bytes
          </p>
        </div>
        {publicUrl && (
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl
                       bg-primary/10 border border-primary/20 text-primary
                       text-sm font-bold hover:bg-primary/20 transition-all"
          >
            <ExternalLink size={14} />
            View Public Profile
          </a>
        )}
      </div>

      {/* Avatar + basic info */}
      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt=""
                className="w-20 h-20 rounded-3xl object-cover ring-2
                           ring-primary/20"
              />
            ) : (
              <div className="w-20 h-20 rounded-3xl bg-primary/20 flex
                              items-center justify-center text-primary
                              text-3xl font-black">
                {form.display_name[0]?.toUpperCase() || 'S'}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full
                            bg-success flex items-center justify-center
                            ring-2 ring-surface">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </div>
          <div>
            <p className="font-black text-lg">
              {form.display_name || 'Student'}
            </p>
            <p className="text-text-muted text-sm">
              {user?.email}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10
                               text-primary font-bold border border-primary/20">
                Level {state.user.level}
              </span>
              <span className="text-xs text-text-muted">
                {state.user.xp} XP
              </span>
            </div>
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="text-xs font-black uppercase tracking-widest
                            text-text-muted mb-2 block">
            Username *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2
                             text-text-muted text-sm font-bold">
              @
            </span>
            <input
              value={form.username}
              onChange={e => setForm(f => ({
                ...f,
                username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
              }))}
              placeholder="yourname"
              maxLength={20}
              className="w-full pl-8 pr-10 py-3 rounded-xl bg-surface-2
                         border border-border focus:border-primary/50
                         focus:outline-none text-sm transition-all"
            />
            {usernameStatus !== 'idle' && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {usernameStatus === 'checking' && (
                  <Loader2 size={16} className="text-text-muted animate-spin" />
                )}
                {usernameStatus === 'available' && (
                  <CheckCircle2 size={16} className="text-success" />
                )}
                {usernameStatus === 'taken' && (
                  <XCircle size={16} className="text-error" />
                )}
              </div>
            )}
          </div>
          {publicUrl && (
            <p className="text-[11px] text-text-muted mt-1.5">
              Your profile: {publicUrl}
            </p>
          )}
        </div>

        {/* Display name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-black uppercase tracking-widest
                              text-text-muted mb-2 block">
              Display Name
            </label>
            <input
              value={form.display_name}
              onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
              placeholder="Yatin Sharma"
              className="w-full px-4 py-3 rounded-xl bg-surface-2 border
                         border-border focus:border-primary/50 focus:outline-none
                         text-sm transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-widest
                              text-text-muted mb-2 block">
              Age
            </label>
            <input
              type="number"
              value={form.age}
              onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
              placeholder="20"
              className="w-full px-4 py-3 rounded-xl bg-surface-2 border
                         border-border focus:border-primary/50 focus:outline-none
                         text-sm transition-all"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="text-xs font-black uppercase tracking-widest
                            text-text-muted mb-2 block">
            Bio
          </label>
          <textarea
            value={form.bio}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            placeholder="CS student @ Rishihood | DSA | Game Dev | Building cool stuff"
            rows={2}
            maxLength={160}
            className="w-full px-4 py-3 rounded-xl bg-surface-2 border
                       border-border focus:border-primary/50 focus:outline-none
                       text-sm resize-none transition-all"
          />
          <p className="text-[10px] text-text-faint mt-1 text-right">
            {form.bio.length}/160
          </p>
        </div>
      </Card>

      {/* Academic info */}
      <Card className="p-6 space-y-4">
        <h3 className="font-black text-sm flex items-center gap-2">
          <GraduationCap size={16} className="text-primary" />
          Academic Info
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-text-muted mb-2 block">
              College / University
            </label>
            <input
              value={form.college}
              onChange={e => setForm(f => ({ ...f, college: e.target.value }))}
              placeholder="Rishihood University"
              className="w-full px-4 py-3 rounded-xl bg-surface-2 border
                         border-border focus:border-primary/50 focus:outline-none
                         text-sm transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-text-muted mb-2 block">
              Course / Major
            </label>
            <input
              value={form.course}
              onChange={e => setForm(f => ({ ...f, course: e.target.value }))}
              placeholder="B.Tech CS & AI"
              className="w-full px-4 py-3 rounded-xl bg-surface-2 border
                         border-border focus:border-primary/50 focus:outline-none
                         text-sm transition-all"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-text-muted mb-2 block">
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
      </Card>

      {/* Preferred language */}
      <Card className="p-6 space-y-4">
        <h3 className="font-black text-sm flex items-center gap-2">
          <Code2 size={16} className="text-primary" />
          Preferred Language
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {LANGUAGES.map(lang => (
            <button
              key={lang.id}
              onClick={() => setForm(f => ({ ...f, preferred_language: lang.id }))}
              className={`p-3 rounded-xl border text-left transition-all ${
                form.preferred_language === lang.id
                  ? 'border-primary/40 bg-primary/10'
                  : 'border-border bg-surface-2 hover:border-border-hover'
              }`}
            >
              <span className="text-lg">{lang.emoji}</span>
              <p className="font-bold text-xs mt-1">{lang.label}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Social links */}
      <Card className="p-6 space-y-4">
        <h3 className="font-black text-sm">Social Links</h3>
        {[
          { key: 'github_url', icon: GithubIcon, placeholder: 'github.com/username' },
          { key: 'linkedin_url', icon: LinkedinIcon, placeholder: 'linkedin.com/in/username' },
          { key: 'twitter_url', icon: TwitterIcon, placeholder: 'twitter.com/username' },
        ].map(({ key, icon: Icon, placeholder }) => (
          <div key={key} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-surface-2 flex items-center
                            justify-center border border-border shrink-0">
              <Icon size={16} className="text-text-muted" />
            </div>
            <input
              value={(form as any)[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              placeholder={placeholder}
              className="flex-1 px-4 py-2.5 rounded-xl bg-surface-2 border
                         border-border focus:border-primary/50 focus:outline-none
                         text-sm transition-all"
            />
          </div>
        ))}
      </Card>

      {/* Privacy + Save */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setForm(f => ({ ...f, is_public: !f.is_public }))}
            className={`w-11 h-6 rounded-full transition-all ${
              form.is_public ? 'bg-primary' : 'bg-surface-3'
            } relative`}
          >
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1
                             transition-all ${
              form.is_public ? 'left-6' : 'left-1'
            }`} />
          </div>
          <span className="text-sm font-medium">
            Public profile
          </span>
        </label>
        <Button
          onClick={handleSave}
          loading={saving}
          className="min-w-32"
        >
          {saved ? '✓ Saved!' : 'Save Profile'}
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
