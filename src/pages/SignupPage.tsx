import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
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
            <h1 className="text-3xl font-black tracking-tighter mb-2">Create Account</h1>
            <p className="text-on-surface-variant font-medium">Join 5,000+ students today</p>
          </div>

          <div className="space-y-4">
             <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center justify-center gap-4 bg-white border border-outline-variant/30 py-4 rounded-2xl font-bold hover:bg-surface-container-low transition-all active:scale-95"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Sign up with Google
            </button>
          </div>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/20"></div>
            </div>
            <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest text-outline">
              <span className="bg-white px-4">Or use email</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
             <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-outline ml-4">Full Name</label>
                <input
                    type="text"
                    placeholder="Alex Rivera"
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl py-4 px-6 outline-none focus:border-primary/40 transition-colors font-medium"
                    required
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-outline ml-4">University Email</label>
                <input
                    type="email"
                    placeholder="name@university.edu"
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl py-4 px-6 outline-none focus:border-primary/40 transition-colors font-medium"
                    required
                />
            </div>
             <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-outline ml-4">Password</label>
                <input
                    type="password"
                    placeholder="Minimum 8 characters"
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl py-4 px-6 outline-none focus:border-primary/40 transition-colors font-medium"
                    required
                />
            </div>

            <button
              type="submit"
              className="w-full ai-pulse-gradient text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 mt-4"
            >
              Create Account
            </button>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-on-surface-variant">
            Already have an account? <button onClick={() => navigate('/login')} className="text-primary font-black hover:underline">Log In</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
