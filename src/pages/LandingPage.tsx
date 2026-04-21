import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-white text-slate-900 font-sans overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-700">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/40 backdrop-blur-xl border-b border-white/40">
        <div className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-2xl">terminal</span>
            </div>
            <div>
              <span className="text-xl font-black tracking-tighter block leading-none">Student Bytes</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary/60 font-bold">Premium</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10 text-sm font-bold text-slate-500">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
            <div className="w-px h-4 bg-slate-200"></div>
            <button onClick={() => navigate('/login')} className="hover:text-primary transition-colors">Log in</button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="bg-neutral-900 text-white px-8 py-3 rounded-2xl shadow-xl shadow-neutral-900/10 hover:bg-neutral-800 transition-colors"
            >
              Get Started
            </motion.button>
          </div>

          <button
            className="md:hidden material-symbols-outlined text-slate-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? 'close' : 'menu'}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-8 space-y-6 shadow-2xl shadow-slate-200/50"
            >
              <a href="#features" className="block text-xl font-black text-slate-900" onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="block text-xl font-black text-slate-900" onClick={() => setIsMenuOpen(false)}>How it Works</a>
              <hr className="border-slate-100" />
              <button onClick={() => navigate('/login')} className="block text-xl font-black text-slate-900">Log in</button>
              <button
                onClick={() => navigate('/signup')}
                className="w-full bg-primary text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-primary/20"
              >
                Get Started
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-48 pb-32 md:pt-64 md:pb-80 px-8 max-w-7xl mx-auto z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-md border border-white/40 px-6 py-2.5 rounded-full mb-12 shadow-sm"
          >
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">The AI Study Assistant for CS Students</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-9xl font-black tracking-tight leading-[0.95] mb-12 max-w-6xl mx-auto text-slate-900"
          >
            Ask anything. Get <span className="text-primary italic">instant</span>, clear explanations.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-3xl text-slate-500 max-w-3xl mx-auto mb-16 font-medium leading-relaxed"
          >
            Master Data Structures, Algorithms, and coding concepts with a personalized AI tutor that adapts to your learning level.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:row items-center justify-center gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto bg-neutral-900 text-white px-14 py-6 rounded-[2.5rem] font-black text-xl shadow-2xl shadow-neutral-900/10 flex items-center justify-center gap-4 hover:bg-neutral-800 transition-premium"
            >
              Try Now <span className="material-symbols-outlined font-black">arrow_forward</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard?demo=true')}
              className="w-full sm:w-auto bg-white border border-slate-100 px-14 py-6 rounded-[2.5rem] font-black text-xl hover:bg-slate-50 transition-premium flex items-center justify-center gap-4 shadow-sm"
            >
              See Demo <span className="material-symbols-outlined font-black">play_circle</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Visual Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-48 relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-[4rem] blur-3xl -z-10" />
          <div className="glass-card rounded-[3.5rem] p-6 shadow-2xl">
            <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-inner">
               {/* UI Mockup Header */}
              <div className="h-16 bg-slate-50/50 border-b border-slate-100 flex items-center px-8 gap-4">
                <div className="flex gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-200" />
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-200" />
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-200" />
                </div>
                <div className="ml-6 flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-100">
                  <span className="material-symbols-outlined text-[14px] text-slate-300">lock</span>
                  <div className="w-48 h-2 bg-slate-100 rounded-full"></div>
                </div>
              </div>
              {/* UI Mockup Content */}
              <div className="grid grid-cols-12 gap-10 p-12">
                <div className="col-span-3 space-y-5">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={cn(
                      "h-14 rounded-2xl w-full",
                      i === 1 ? "bg-primary/5 border border-primary/10" : "bg-slate-50"
                    )}></div>
                  ))}
                </div>
                <div className="col-span-9 space-y-10">
                  <div className="bg-slate-900 text-white p-8 rounded-[2rem] rounded-tr-none shadow-xl max-w-2xl ml-auto">
                    <p className="text-lg font-bold">Can you explain Quick Sort using an analogy?</p>
                  </div>
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm max-w-3xl space-y-6">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">bolt</span>
                      </div>
                      <div>
                        <span className="block text-xs font-black text-primary uppercase tracking-widest">AI Response</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Confidence: 98%</span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h4 className="font-black text-2xl text-slate-900">The "Library Organizer" Analogy</h4>
                      <p className="text-slate-600 font-medium leading-relaxed text-lg">Imagine you're organizing a messy shelf of books. You pick one book as your <strong>pivot</strong>. Every book thinner than the pivot goes to the left, and every book thicker goes to the right...</p>
                      <div className="h-48 bg-slate-50 rounded-[2rem] flex flex-col items-center justify-center gap-4 border border-slate-100 border-dashed">
                         <span className="material-symbols-outlined text-primary/20 text-6xl animate-float">psychology</span>
                         <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Interactive Visualization</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Features Grid */}
      <section id="features" className="py-48 relative">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-3xl mb-32">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-10 leading-[0.95] text-slate-900">Everything you need to master your CS curriculum.</h2>
            <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed">Forget endless searching. Get high-quality, personalized study materials instantly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <FeatureCard
              icon="psychology"
              title="Adaptive Tutoring"
              description="Our AI tracks your progress and adapts explanations. Whether you're a beginner or an expert, we've got you covered."
              accent="primary"
            />
            <FeatureCard
              icon="terminal"
              title="Code Visualizer"
              description="See how algorithms work line-by-line with our interactive execution tool. No more guessing how pointers move."
              accent="secondary"
            />
            <FeatureCard
              icon="history_edu"
              title="Exam Prep Mode"
              description="Generate mock questions based on your specific university syllabus and past papers. Practice until perfect."
              accent="accent"
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-48 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-8 text-center mb-32">
          <h2 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900">From stuck to clear in 3 steps.</h2>
        </div>

        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            <StepCard
              number="1"
              icon="search"
              title="Ask Anything"
              description="Type a question, paste a coding problem, or ask for a concept breakdown."
            />
            <StepCard
              number="2"
              icon="auto_awesome"
              title="AI Generation"
              description="Our engine analyzes your level and generates a structured, easy-to-follow lesson."
            />
            <StepCard
              number="3"
              icon="verified"
              title="Interactive Mastery"
              description="Solve practice questions and earn XP as you master each new concept."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 px-8 border-t border-slate-100 z-10 relative bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-1 md:col-span-2 space-y-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-2xl">terminal</span>
                    </div>
                    <span className="text-2xl font-black tracking-tighter">Student Bytes</span>
                </div>
                <p className="max-w-sm text-slate-500 font-medium leading-relaxed text-lg">
                    Making computer science education personalized, interactive, and accessible for everyone.
                </p>
            </div>
            <div className="space-y-8">
                <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Product</h4>
                <ul className="space-y-4 font-bold text-slate-500">
                    <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Roadmap</a></li>
                </ul>
            </div>
            <div className="space-y-8">
                <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Connect</h4>
                <ul className="space-y-4 font-bold text-slate-500">
                    <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto pt-10 border-t border-slate-100 flex flex-col md:row items-center justify-between gap-6">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">© 2025 Student Bytes. Premium Edition.</p>
            <div className="flex gap-10 font-bold text-xs uppercase tracking-widest text-slate-400">
                <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
            </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, accent }: { icon: string, title: string, description: string, accent: 'primary' | 'secondary' | 'accent' }) => (
  <motion.div
    whileHover={{ y: -8 }}
    className="group bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-premium"
  >
    <div className={cn(
        "w-16 h-16 rounded-2xl flex items-center justify-center mb-10 transition-premium group-hover:scale-110",
        accent === 'primary' ? "bg-primary/10 text-primary" :
        accent === 'secondary' ? "bg-secondary/10 text-secondary" :
        "bg-accent/10 text-accent"
    )}>
      <span className="material-symbols-outlined text-3xl">{icon}</span>
    </div>
    <h3 className="text-3xl font-black mb-6 tracking-tight text-slate-900">{title}</h3>
    <p className="text-slate-500 leading-relaxed font-medium text-lg">{description}</p>
  </motion.div>
);

const StepCard = ({ number, icon, title, description }: { number: string, icon: string, title: string, description: string }) => (
  <div className="text-center group">
    <div className="relative mb-12">
        <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex items-center justify-center mx-auto transition-premium group-hover:scale-110 group-hover:border-primary/20">
            <span className="material-symbols-outlined text-primary text-4xl">{icon}</span>
        </div>
        <div className="absolute -top-3 -right-3 w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-sm z-10 shadow-xl">
            {number}
        </div>
    </div>
    <h4 className="text-3xl font-black mb-6 tracking-tight text-slate-900">{title}</h4>
    <p className="text-slate-500 font-medium leading-relaxed text-lg">{description}</p>
  </div>
);

export default LandingPage;
