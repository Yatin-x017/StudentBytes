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
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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
          <p className="text-text-muted text-sm">Welcome back. Enter your credentials to continue.</p>
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
            disabled={loading}
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
