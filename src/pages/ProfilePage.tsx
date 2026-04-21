import React, { useState } from 'react';
import {
  Settings,
  Key,
  Shield,
  Mail,
  Camera,
  CheckCircle2,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const ProfilePage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [showKey, setShowKey] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(state.user.name);

  const handleUpdateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_API_KEY', payload: newApiKey });
    setNewApiKey('');
    alert('API Key updated successfully!');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'UPDATE_USER',
      payload: { name: username }
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <header className="flex flex-col md:flex-row items-center gap-8 p-8 glass-card border-white/5 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-success" />

        <div className="relative">
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-primary to-accent p-1 shadow-2xl shadow-primary/20">
            <div className="w-full h-full rounded-[20px] bg-black flex items-center justify-center text-4xl font-black">
              {state.user.name.charAt(0)}
            </div>
          </div>
          <button className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-white text-black hover:bg-primary hover:text-white transition-all shadow-lg">
            <Camera size={18} />
          </button>
        </div>

        <div className="text-center md:text-left flex-1 space-y-3">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <h1 className="text-3xl font-black">{state.user.name}</h1>
            <Badge variant="primary" className="bg-primary/20 text-primary border-primary/20 px-3 py-1">Level {state.user.level} Coder</Badge>
          </div>
          <p className="text-text-muted flex items-center justify-center md:justify-start gap-2">
            <Mail size={16} /> student@university.edu
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
            <Badge variant="outline" className="border-white/10 text-text-muted">React</Badge>
            <Badge variant="outline" className="border-white/10 text-text-muted">TypeScript</Badge>
            <Badge variant="outline" className="border-white/10 text-text-muted">Algorithms</Badge>
          </div>
        </div>

        <div className="flex flex-col gap-2 min-w-[140px]">
          <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full">Edit Profile</Button>
          <Button variant="ghost" className="w-full text-error hover:bg-error/10">Log Out</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Settings size={20} className="text-primary" />
              Account Settings
            </h2>
            <Card className="p-6 border-white/5 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm">Study Reminders</h4>
                    <p className="text-xs text-text-muted">Get notifications for your daily streak</p>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div>
                    <h4 className="font-bold text-sm">Public Profile</h4>
                    <p className="text-xs text-text-muted">Show your achievements in the community</p>
                  </div>
                  <div className="w-12 h-6 bg-white/10 rounded-full relative p-1 cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
                  </div>
                </div>
              </div>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Key size={20} className="text-primary" />
              AI Integration
            </h2>
            <Card className="p-6 border-white/5 space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <Shield className="text-amber-500 shrink-0" size={20} />
                <div>
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Security Note</h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Your Anthropic API key is stored locally in your browser and never touches our servers.
                  </p>
                </div>
              </div>

              <form onSubmit={handleUpdateApiKey} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Anthropic API Key</label>
                  <div className="relative">
                    <input
                      type={showKey ? "text" : "password"}
                      value={state.apiKey || ''}
                      readOnly
                      placeholder="sk-ant-..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 pr-12 text-sm font-mono focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-all"
                    >
                      {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Update Key</label>
                  <input
                    type="password"
                    value={newApiKey}
                    onChange={(e) => setNewApiKey(e.target.value)}
                    placeholder="Paste new key here..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm font-mono focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={!newApiKey}>Save Key</Button>
              </form>
            </Card>
          </section>
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 size={20} className="text-primary" />
              Achievements
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <AchievementCard icon="🔥" title="7 Day Streak" desc="Active every day this week" completed />
              <AchievementCard icon="🧠" title="Concept Master" desc="Completed 50 quizzes" completed />
              <AchievementCard icon="⚡" title="Quick Thinker" desc="Answered 10 questions in 1 min" />
              <AchievementCard icon="🚀" title="Early Adopter" desc="Joined Student Bytes Beta" completed />
            </div>
          </section>

          <Card className="p-6 border-error/10 bg-error/5 space-y-4">
            <h4 className="text-sm font-bold text-error flex items-center gap-2">
              <Trash2 size={16} /> Danger Zone
            </h4>
            <p className="text-xs text-text-muted">Deleting your account will erase all study sessions, XP, and saved notes. This cannot be undone.</p>
            <Button variant="outline" className="w-full border-error/20 text-error hover:bg-error/10">Delete Account</Button>
          </Card>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-8 border-white/10 glass-card">
            <h3 className="text-2xl font-black mb-6">Edit Profile</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Display Name</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div className="flex gap-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Save Changes</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

const AchievementCard = ({ icon, title, desc, completed }: { icon: string, title: string, desc: string, completed?: boolean }) => (
  <Card className={`p-4 border-white/5 flex items-center gap-4 transition-all ${!completed ? 'opacity-40 grayscale' : 'hover:border-primary/30'}`}>
    <div className="text-2xl">{icon}</div>
    <div>
      <h4 className="text-xs font-bold">{title}</h4>
      <p className="text-[10px] text-text-muted">{desc}</p>
    </div>
  </Card>
);

export default ProfilePage;
