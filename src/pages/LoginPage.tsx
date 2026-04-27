import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Lock, Mail, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/lib/constants';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) throw signInError;
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      setError(err.message || 'Sign in failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const { error: googleError } = await signInWithGoogle();
      if (googleError) throw googleError;
    } catch (err: any) {
      setError(err.message || 'Google sign in failed.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-bg p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/3" />

      <Card className="w-full max-w-md p-8 border-white/10 shadow-2xl bg-surface/80 backdrop-blur-xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-primary rounded-2xl p-3 shadow-lg shadow-primary/20 mb-4">
            <Terminal size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter mb-2">Student Bytes</h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="px-2 py-0.5 rounded-full bg-success/10 border border-success/20 text-[10px] font-black text-success uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck size={10} /> Secure Supabase Auth
            </div>
          </div>
          <p className="text-text-muted text-sm">Welcome back. Start your learning journey.</p>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-6
                    rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8
                    transition-all font-semibold text-sm disabled:opacity-50
                    hover:border-white/15"
        >
          {googleLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          {googleLoading ? 'Redirecting...' : 'Continue with Google'}
        </button>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-[11px] text-text-muted font-black tracking-widest uppercase">OR</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                <Mail size={18} />
              </div>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 bg-black/40 border-white/10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Password</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                <Lock size={18} />
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 bg-black/40 border-white/10"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-xs text-error flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-7 text-base font-black shadow-xl shadow-primary/20"
            disabled={loading || googleLoading}
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
            Sign In
          </Button>
        </form>

        <p className="text-[10px] text-center text-text-muted mt-8 font-medium">
          Personal instance for private use only.
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
