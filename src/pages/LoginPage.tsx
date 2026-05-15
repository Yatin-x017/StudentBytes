import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Zap,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/lib/constants';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    signIn,
    signUp,
    signInWithGoogle,
    signInWithDiscord,
  } = useAuth() as any;

  const [mode, setMode] = useState<'signin' | 'signup'>(
    'signin'
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);

  const [discordLoading, setDiscordLoading] =
    useState(false);

  const [error, setError] = useState('');

  const anyLoading =
    loading || googleLoading || discordLoading;

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!email || !password) return;

    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        const { error: err } = await signUp(
          email,
          password,
          ''
        );

        if (err) throw err;

        // Keep email verification message
        setError(
          '✓ Check your email to confirm your account.'
        );

        // Optional onboarding redirect
        setTimeout(() => {
          navigate(ROUTES.ONBOARDING);
        }, 1200);
      } else {
        const { error: err } = await signIn(
          email,
          password
        );

        if (err) throw err;

        navigate(ROUTES.DASHBOARD);
      }
    } catch (err: any) {
      setError(
        err.message || 'Authentication failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      const { error: err } =
        await signInWithGoogle?.();

      if (err) throw err;
    } catch (err: any) {
      setError(err.message);
      setGoogleLoading(false);
    }
  };

  const handleDiscord = async () => {
    setDiscordLoading(true);
    setError('');

    try {
      const { error: err } =
        await signInWithDiscord?.();

      if (err) throw err;
    } catch (err: any) {
      setError(err.message);
      setDiscordLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)',
      }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full opacity-30"
          style={{
            background:
              'radial-gradient(circle, rgba(129,140,248,0.4) 0%, transparent 70%)',
          }}
        />

        <div
          className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] rounded-full opacity-20"
          style={{
            background:
              'radial-gradient(circle, rgba(167,139,250,0.5) 0%, transparent 70%)',
          }}
        />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 24,
          scale: 0.97,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.5,
          ease: 'easeOut',
        }}
        className="relative w-full max-w-md"
      >
        <div
          className="rounded-3xl p-8"
          style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter:
              'blur(40px) saturate(1.5)',

            WebkitBackdropFilter:
              'blur(40px) saturate(1.5)',

            border:
              '1px solid rgba(255,255,255,0.15)',

            boxShadow:
              '0 24px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{
                background:
                  'linear-gradient(135deg, #6366f1, #8b5cf6)',

                boxShadow:
                  '0 8px 32px rgba(99,102,241,0.4)',
              }}
            >
              <Zap
                size={26}
                className="text-white fill-white"
              />
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white">
              Student
              <span style={{ color: '#a5b4fc' }}>
                Bytes
              </span>
            </h1>

            <p
              className="text-sm mt-1"
              style={{
                color:
                  'rgba(255,255,255,0.55)',
              }}
            >
              {mode === 'signin'
                ? 'Welcome back. Keep learning.'
                : 'Join the community.'}
            </p>
          </div>

          {/* Social buttons */}
          <div className="space-y-3 mb-6">
            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={anyLoading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-2xl font-semibold text-sm transition-all disabled:opacity-50"
              style={{
                background:
                  'rgba(255,255,255,0.92)',

                border:
                  '1px solid rgba(255,255,255,0.2)',

                color: '#1f2937',

                boxShadow:
                  '0 2px 12px rgba(0,0,0,0.2)',
              }}
            >
              {googleLoading ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                  style={{ color: '#6366f1' }}
                />
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                </svg>
              )}

              {googleLoading
                ? 'Redirecting...'
                : 'Continue with Google'}
            </button>

            {/* Rest of your component stays identical */}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;