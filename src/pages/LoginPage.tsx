import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 selection:bg-primary/20 selection:text-primary">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 justify-center mb-12">
          <div className="w-10 h-10 ai-pulse-gradient rounded-xl flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-white text-2xl">terminal</span>
          </div>
          <span className="text-3xl font-black tracking-tighter">Student Bytes</span>
        </div>

        <div className="glass-panel ambient-shadow rounded-[3rem] p-10 border border-white/40">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black tracking-tighter mb-2">Welcome Back</h1>
            <p className="text-on-surface-variant font-medium">Continue your learning journey</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center justify-center gap-4 bg-white border border-outline-variant/30 py-4 rounded-2xl font-bold hover:bg-surface-container-low transition-all active:scale-95"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Continue with Google
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center justify-center gap-4 bg-white border border-outline-variant/30 py-4 rounded-2xl font-bold hover:bg-surface-container-low transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">terminal</span>
              Continue with GitHub
            </button>
          </div>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/20"></div>
            </div>
            <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest text-outline">
              <span className="bg-white px-4">Or with email</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-outline ml-4">Email Address</label>
                <input
                    type="email"
                    placeholder="name@university.edu"
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl py-4 px-6 outline-none focus:border-primary/40 transition-colors font-medium"
                    required
                />
            </div>
             <div className="space-y-2">
                <div className="flex justify-between items-center px-4">
                    <label className="text-xs font-black uppercase tracking-widest text-outline">Password</label>
                    <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</a>
                </div>
                <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl py-4 px-6 outline-none focus:border-primary/40 transition-colors font-medium"
                    required
                />
            </div>

            <button
              type="submit"
              className="w-full ai-pulse-gradient text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 mt-4"
            >
              Log In
            </button>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-on-surface-variant">
            Don't have an account? <button onClick={() => navigate('/signup')} className="text-primary font-black hover:underline">Sign Up</button>
          </p>
        </div>

        <div className="mt-12 flex justify-center gap-8 text-[10px] font-black text-outline uppercase tracking-widest">
            <a href="#" className="hover:text-on-surface">Privacy Policy</a>
            <a href="#" className="hover:text-on-surface">Terms of Service</a>
            <a href="#" className="hover:text-on-surface">Support</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
