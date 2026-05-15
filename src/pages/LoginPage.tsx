import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, Zap, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/lib/constants';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, signInWithDiscord } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [discordLoading, setDiscordLoading] = useState(false);
  const [error, setError] = useState('');

  const anyLoading = loading || googleLoading || discordLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError('');
    try {
      if (mode === 'signup') {
        const { error: err } = await signUp(email, password, '');
        if (err) throw err;
        navigate(ROUTES.ONBOARDING);
      } else {
        const { error: err } = await signIn(email, password);
        if (err) throw err;
        navigate(ROUTES.DASHBOARD);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError('');
    const { error: err } = await signInWithGoogle?.() || { error: null };
    if (err) { setError(err.message); setGoogleLoading(false); }
  };

  const handleDiscord = async () => {
    setDiscordLoading(true);
    setError('');
    const { error: err } = await signInWithDiscord?.() || { error: null };
    if (err) { setError(err.message); setDiscordLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #faf5ff 100%)' }}>

      {/* Ambient blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full"
             style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] rounded-full"
             style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-3xl p-8 shadow-2xl"
             style={{
               background: 'rgba(255,255,255,0.85)',
               backdropFilter: 'blur(40px)',
               border: '1px solid rgba(255,255,255,0.9)',
               boxShadow: '0 24px 80px rgba(79,70,229,0.12), 0 8px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.95)',
             }}>

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                 style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 8px 24px rgba(79,70,229,0.3)' }}>
              <Zap size={26} className="text-white fill-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: '#1e1b4b' }}>
              Student<span style={{ color: '#4f46e5' }}>Bytes</span>
            </h1>
            <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
              {mode === 'signin' ? 'Welcome back. Keep learning.' : 'Join the community.'}
            </p>
          </div>

          {/* Social buttons */}
          <div className="space-y-3 mb-6">
            {/* Google — full width */}
            <button
              onClick={handleGoogle}
              disabled={anyLoading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-2xl font-semibold text-sm transition-all disabled:opacity-50"
              style={{
                background: 'rgba(255,255,255,0.9)',
                border: '1.5px solid rgba(0,0,0,0.1)',
                color: '#374151',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(79,70,229,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)')}
            >
              {googleLoading ? <Loader2 size={18} className="animate-spin" /> : (
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {googleLoading ? 'Redirecting...' : 'Continue with Google'}
            </button>

            {/* Discord + Twitter row */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDiscord}
                disabled={anyLoading}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-semibold text-sm transition-all disabled:opacity-50"
                style={{
                  background: 'rgba(88,101,242,0.08)',
                  border: '1.5px solid rgba(88,101,242,0.2)',
                  color: '#5865F2',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(88,101,242,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(88,101,242,0.08)')}
              >
                {discordLoading ? <Loader2 size={15} className="animate-spin" /> : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#5865F2">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                  </svg>
                )}
                {discordLoading ? '...' : 'Discord'}
              </button>

              <button
                disabled={anyLoading}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-semibold text-sm transition-all disabled:opacity-50 cursor-not-allowed"
                style={{
                  background: 'rgba(0,0,0,0.04)',
                  border: '1.5px solid rgba(0,0,0,0.08)',
                  color: '#374151',
                }}
                title="Twitter/X coming soon"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#374151">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                X (Soon)
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(0,0,0,0.08)' }} />
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(0,0,0,0.08)' }} />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2"
                     style={{ color: '#6b7280' }}>
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2"
                      style={{ color: '#9ca3af' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(0,0,0,0.03)',
                    border: '1.5px solid rgba(0,0,0,0.08)',
                    color: '#1e1b4b',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(79,70,229,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)')}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2"
                     style={{ color: '#6b7280' }}>
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2"
                      style={{ color: '#9ca3af' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(0,0,0,0.03)',
                    border: '1.5px solid rgba(0,0,0,0.08)',
                    color: '#1e1b4b',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(79,70,229,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#9ca3af' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 p-3 rounded-xl text-xs"
                style={{
                  background: error.includes('Check your email')
                    ? 'rgba(5,150,105,0.08)' : 'rgba(220,38,38,0.08)',
                  border: `1px solid ${error.includes('Check your email')
                    ? 'rgba(5,150,105,0.2)' : 'rgba(220,38,38,0.2)'}`,
                  color: error.includes('Check your email') ? '#059669' : '#dc2626',
                }}
              >
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={anyLoading}
              className="w-full py-4 rounded-2xl font-black text-sm text-white transition-all disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                boxShadow: '0 8px 24px rgba(79,70,229,0.3)',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin mx-auto" />
              ) : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Mode toggle */}
          <p className="text-center text-xs mt-6" style={{ color: '#9ca3af' }}>
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError(''); }}
              className="font-bold transition-colors"
              style={{ color: '#4f46e5' }}
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          <p className="text-center text-[10px] mt-3" style={{ color: '#d1d5db' }}>
            Personal instance for private use.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
