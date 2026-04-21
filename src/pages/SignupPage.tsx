import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 selection:bg-indigo-100 selection:text-indigo-700 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full" />

      <div className="w-full max-w-lg relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 justify-center mb-16 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20">
            <span className="material-symbols-outlined text-white text-3xl">terminal</span>
          </div>
          <div>
            <span className="text-3xl font-black tracking-tighter block leading-none">Student Bytes</span>
            <span className="text-xs uppercase tracking-[0.2em] text-primary/60 font-bold">Premium</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-2xl rounded-[3.5rem] p-12 md:p-16 border border-white/40 shadow-[0_40px_100px_rgba(0,0,0,0.06)]"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black tracking-tight text-neutral-900 mb-4">Create Account</h1>
            <p className="text-neutral-500 font-medium text-lg leading-relaxed">Join 5,000+ students mastering CS today.</p>
          </div>

          <div className="space-y-4">
             <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center justify-center gap-4 bg-white border border-neutral-100 py-5 rounded-[2rem] font-bold text-slate-700 hover:bg-slate-50 transition-premium shadow-sm"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Sign up with Google
            </motion.button>
          </div>

          <div className="relative my-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-100"></div>
            </div>
            <div className="relative flex justify-center text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400">
              <span className="bg-white/10 px-6 backdrop-blur-md">Or use email</span>
            </div>
          </div>

          <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
             <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-6">Full Name</label>
                <input
                    type="text"
                    placeholder="Alex Rivera"
                    className="w-full bg-white border border-neutral-100 rounded-[2rem] py-6 px-10 outline-none focus:border-primary/30 transition-premium font-bold text-lg placeholder:text-neutral-200"
                    required
                />
            </div>
            <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-6">University Email</label>
                <input
                    type="email"
                    placeholder="name@university.edu"
                    className="w-full bg-white border border-neutral-100 rounded-[2rem] py-6 px-10 outline-none focus:border-primary/30 transition-premium font-bold text-lg placeholder:text-neutral-200"
                    required
                />
            </div>
             <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-6">Password</label>
                <input
                    type="password"
                    placeholder="Minimum 8 characters"
                    className="w-full bg-white border border-neutral-100 rounded-[2rem] py-6 px-10 outline-none focus:border-primary/30 transition-premium font-bold text-lg placeholder:text-neutral-200"
                    required
                />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-primary text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-primary/20 hover:bg-indigo-600 transition-premium mt-6"
            >
              Create Account
            </motion.button>
          </form>

          <p className="mt-12 text-center font-bold text-slate-500">
            Already have an account? <button onClick={() => navigate('/login')} className="text-primary font-black hover:underline uppercase tracking-widest text-xs ml-2">Log In</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
