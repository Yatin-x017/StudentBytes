import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  GraduationCap,
  FileText,
  ArrowRight,
  Terminal,
  Sparkles,
  ShieldCheck,
  Users,
  CheckCircle2
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col -mt-8">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-8 animate-pulse">
              <Sparkles size={14} className="fill-primary" /> The Future of CS Study
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1] bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
              Your AI Tutor for CS.
            </h1>

            <p className="text-lg md:text-xl text-text-muted max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
              Master DSA, OS, DBMS, and more with Byte — <br className="hidden md:block" />
              an AI tutor that explains, quizzes, and adapts to you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Button size="lg" className="w-full sm:w-auto text-lg h-16 px-10 rounded-2xl shadow-2xl shadow-primary/30" onClick={() => navigate(ROUTES.STUDY)}>
                Start Learning Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto text-lg h-16 px-10 rounded-2xl border-white/10 hover:border-white/20 gap-2"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                See how it works ↓
              </Button>
            </div>

            <div className="flex flex-col items-center gap-4 mb-20">
              <p className="text-xs text-text-muted font-bold tracking-tight">
                No account needed. Your data stays on your device.
              </p>
            </div>

            {/* Mock UI / Hero Image Area */}
            <div className="relative max-w-5xl mx-auto">
               <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-success rounded-[2.5rem] blur-xl opacity-20" />
               <Card className="relative overflow-hidden border-white/10 glass-card p-2 rounded-[2.5rem] shadow-3xl">
                  <div className="rounded-[2rem] overflow-hidden bg-black/40 aspect-video md:aspect-[16/9] relative border border-white/5">
                    {/* Mock Content Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-full h-full p-8 flex flex-col gap-4 text-left">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-3 h-3 rounded-full bg-error/50" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                            <div className="w-3 h-3 rounded-full bg-success/50" />
                          </div>
                          <div className="w-[40%] h-4 bg-white/10 rounded-full" />
                          <div className="w-[60%] h-4 bg-white/5 rounded-full" />
                          <div className="w-[80%] h-24 bg-primary/10 border border-primary/20 rounded-2xl mt-4 flex items-center justify-center">
                             <div className="text-primary font-mono text-xs opacity-50"># Byte: Generating Concept Visualization...</div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-auto">
                             <div className="h-20 bg-white/5 rounded-xl" />
                             <div className="h-20 bg-white/5 rounded-xl" />
                             <div className="h-20 bg-white/5 rounded-xl" />
                          </div>
                       </div>
                    </div>
                  </div>
               </Card>
            </div>
          </motion.div>
        </div>

        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/4 w-full max-w-4xl h-96 bg-primary/10 blur-[150px] rounded-full -z-10" />
        <div className="absolute bottom-0 right-1/4 w-full max-w-4xl h-96 bg-accent/10 blur-[150px] rounded-full -z-10" />
      </section>

      {/* Trust bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-12 relative z-20">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 py-8 px-12 rounded-[2rem] bg-surface/50 border border-white/5 backdrop-blur-xl">
           <div className="flex items-center gap-2 grayscale opacity-50">
              <ShieldCheck size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">End-to-End Encrypted</span>
           </div>
           <div className="flex items-center gap-2 grayscale opacity-50">
              <Users size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">Local-First Privacy</span>
           </div>
           <div className="flex items-center gap-2 grayscale opacity-50">
              <CheckCircle2 size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">Open Source Core</span>
           </div>
        </div>
      </div>

      {/* Features Grid */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Everything you need to excel.</h2>
            <p className="text-text-muted text-lg">We've built a suite of tools that bridge the gap between lecture hall theory and production-ready skills.</p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-8"
          >
            <FeatureCard
              variants={item}
              icon={<MessageSquare className="text-primary" />}
              title="Interactive AI Tutor"
              description="Chat with Byte about any CS topic. From Assembly to Z-buffers, get clear analogies and code."
            />
            <FeatureCard
              variants={item}
              icon={<GraduationCap className="text-primary" />}
              title="Dynamic Quizzes"
              description="Transform any session into a mastery quiz. Test your edge and identify knowledge gaps."
            />
            <FeatureCard
              variants={item}
              icon={<FileText className="text-primary" />}
              title="Knowledge Base"
              description="Automatically format and save key takeaways from your chats into a personal library."
            />
            <FeatureCard
              variants={item}
              icon={<ShieldCheck className="text-primary" />}
              title="Privacy First"
              description="Fully local-first architecture. You own your data and your AI interactions."
            />
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">How it works.</h2>
            <p className="text-text-muted text-lg">Three steps to mastering your curriculum.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-2xl mx-auto border border-primary/20">1</div>
                <h3 className="text-xl font-bold">Pick a Subject</h3>
                <p className="text-text-muted text-sm leading-relaxed">Choose from DSA, OS, DBMS, or any CS topic you're currently struggling with.</p>
             </div>
             <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-2xl mx-auto border border-primary/20">2</div>
                <h3 className="text-xl font-bold">Chat with Byte</h3>
                <p className="text-text-muted text-sm leading-relaxed">Ask questions, get analogies, and see code examples. Byte adapts to your knowledge level.</p>
             </div>
             <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-2xl mx-auto border border-primary/20">3</div>
                <h3 className="text-xl font-bold">Prove Mastery</h3>
                <p className="text-text-muted text-sm leading-relaxed">Generate a quiz based on your conversation to ensure you actually understand the core concepts.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
               <div className="flex items-center gap-3 mb-6">
                 <div className="bg-primary p-2 rounded-xl">
                   <Terminal size={24} className="text-white" />
                 </div>
                 <span className="text-2xl font-black tracking-tighter">Student Bytes</span>
               </div>
               <p className="text-text-muted max-w-sm mb-8 leading-relaxed">
                 Transforming the CS student experience with AI. Built for the next generation of engineers.
               </p>
               <div className="flex items-center gap-4">
                 <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-text-muted hover:text-white">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                 </a>
               </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-primary">Product</h4>
              <ul className="space-y-4 text-sm font-medium text-text-muted">
                <li><button onClick={() => navigate(ROUTES.STUDY)} className="hover:text-white transition-all">AI Tutor</button></li>
                <li><button onClick={() => navigate(ROUTES.QUIZ)} className="hover:text-white transition-all">Quiz Gen</button></li>
                <li><button onClick={() => navigate(ROUTES.COMMUNITY)} className="hover:text-white transition-all">Community</button></li>
                <li><button onClick={() => navigate(ROUTES.ANALYTICS)} className="hover:text-white transition-all">Analytics</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-primary">Legal</h4>
              <ul className="space-y-4 text-sm font-medium text-text-muted">
                <li><a href="#" className="hover:text-white transition-all">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-all">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-all">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-text-muted uppercase tracking-widest">
            <p>© 2024 Student Bytes. All rights reserved.</p>
            <p>Built with ❤️ by students, for students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, variants }: any) => (
  <motion.div variants={variants}>
    <Card className="h-full p-8 bg-surface-2/30 border-white/5 hover:border-primary/20 transition-all group relative overflow-hidden">
      <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
        {React.cloneElement(icon as React.ReactElement)}
      </div>
      <h3 className="text-2xl font-black mb-4">{title}</h3>
      <p className="text-text-muted leading-relaxed font-medium">
        {description}
      </p>
    </Card>
  </motion.div>
);


export default LandingPage;
