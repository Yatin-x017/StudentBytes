import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-background text-on-surface font-body overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-outline-variant/10">
        <div className="flex items-center justify-between px-6 py-4 md:px-12 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 ai-pulse-gradient rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl">terminal</span>
            </div>
            <span className="text-xl font-black tracking-tighter">Student Bytes</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
            <div className="w-px h-4 bg-outline-variant/30"></div>
            <button onClick={() => navigate('/login')} className="hover:text-primary transition-colors">Log in</button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-on-background text-white px-6 py-2.5 rounded-full hover:scale-105 transition-transform"
            >
              Get Started
            </button>
          </div>

          <button
            className="md:hidden material-symbols-outlined"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? 'close' : 'menu'}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-outline-variant/20 p-6 space-y-4 animate-fade-in">
            <a href="#features" className="block text-lg font-bold" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="block text-lg font-bold" onClick={() => setIsMenuOpen(false)}>How it Works</a>
            <hr className="border-outline-variant/20" />
            <button onClick={() => navigate('/login')} className="block text-lg font-bold">Log in</button>
            <button
              onClick={() => navigate('/signup')}
              className="w-full ai-pulse-gradient text-white py-4 rounded-2xl font-bold"
            >
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-24 md:pt-48 md:pb-64 px-6 max-w-7xl mx-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-primary/10 blur-[150px] rounded-full -z-10 animate-pulse"></div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">The AI Study Assistant for CS Students</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[1] mb-8 max-w-5xl mx-auto">
            Ask anything. Get <span className="ai-pulse-gradient text-gradient">instant, personalized</span> explanations.
          </h1>

          <p className="text-lg md:text-2xl text-on-surface-variant max-w-2xl mx-auto mb-12 font-medium">
            Master Data Structures, Algorithms, and coding concepts with a personalized AI tutor that adapts to your learning level.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
            onClick={() => navigate('/signup')}
              className="w-full sm:w-auto ai-pulse-gradient text-white px-12 py-5 rounded-[2rem] font-black text-xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all flex items-center justify-center gap-3"
            >
              Try Now <span className="material-symbols-outlined font-black">arrow_forward</span>
            </button>
            <button
              onClick={() => navigate('/dashboard?demo=true')}
              className="w-full sm:w-auto bg-white border border-outline-variant/30 px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-surface-container-low transition-all flex items-center justify-center gap-3"
            >
              See Demo <span className="material-symbols-outlined font-black">play_circle</span>
            </button>
          </div>
        </div>

        {/* Visual Mockup */}
        <div className="mt-32 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-tertiary-fixed-dim rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
          <div className="relative glass-panel ambient-shadow rounded-[3rem] overflow-hidden border border-white/40 p-4">
            <div className="bg-surface-container-low rounded-[2rem] overflow-hidden">
               {/* UI Mockup Header */}
              <div className="h-12 bg-white/50 border-b border-outline-variant/20 flex items-center px-6 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="ml-6 flex items-center gap-2 bg-surface-container-highest px-3 py-1 rounded-md">
                  <span className="material-symbols-outlined text-[12px]">lock</span>
                  <div className="w-32 h-2 bg-outline/20 rounded-full"></div>
                </div>
              </div>
              {/* UI Mockup Content */}
              <div className="grid grid-cols-12 gap-6 p-8">
                <div className="col-span-3 space-y-3">
                  {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-white/40 rounded-xl w-full"></div>)}
                </div>
                <div className="col-span-9 space-y-8">
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/10 max-w-2xl">
                    <p className="text-lg font-bold mb-4">Can you explain Quick Sort using an analogy?</p>
                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                      <span className="material-symbols-outlined text-sm">auto_awesome</span>
                      Thinking...
                    </div>
                  </div>
                  <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 ml-auto max-w-2xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 ai-pulse-gradient rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-white">bolt</span>
                      </div>
                      <div>
                        <span className="block text-xs font-black text-primary uppercase">Student Bytes AI</span>
                        <span className="text-[10px] text-outline font-bold">Resonating at 98%</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-bold text-xl">The "Library Organizer" Analogy</h4>
                      <p className="text-on-surface-variant leading-relaxed">Imagine you're organizing a messy shelf of books. You pick one book as your <strong>pivot</strong>. Every book thinner than the pivot goes to the left, and every book thicker goes to the right...</p>
                      <div className="h-40 bg-on-background/5 rounded-2xl flex items-center justify-center">
                         <span className="material-symbols-outlined text-primary/40 text-6xl">animation</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section id="features" className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mb-24">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">Everything you need to master your CS curriculum.</h2>
            <p className="text-xl text-on-surface-variant font-medium">Forget endless searching. Get high-quality, personalized study materials instantly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="psychology"
              title="Adaptive Tutoring"
              description="Our AI tracks your progress and adapts explanations. Whether you're a beginner or an expert, we've got you covered."
              gradient="from-blue-500 to-indigo-600"
            />
            <FeatureCard
              icon="terminal"
              title="Code Visualizer"
              description="See how algorithms work line-by-line with our interactive execution tool. No more guessing how pointers move."
              gradient="from-purple-500 to-pink-600"
            />
            <FeatureCard
              icon="history_edu"
              title="Exam Prep Mode"
              description="Generate mock questions based on your specific university syllabus and past papers. Practice until perfect."
              gradient="from-amber-500 to-orange-600"
            />
             <FeatureCard
              icon="chat_bubble"
              title="Smart Explanations"
              description="Not just code. Get analogies, real-world examples, and Big O complexity analysis for every single topic."
              gradient="from-emerald-500 to-teal-600"
            />
            <FeatureCard
              icon="auto_stories"
              title="Learning Paths"
              description="Structured paths from 'Zero to Hero' in Data Structures, Web Development, and Machine Learning."
              gradient="from-rose-500 to-red-600"
            />
            <FeatureCard
              icon="security"
              title="Privacy First"
              description="Your data is yours. We don't train our models on your private study notes. Your learning is secure."
              gradient="from-slate-700 to-slate-900"
            />
          </div>
        </div>
      </section>

      {/* How it Works - Visualized */}
      <section id="how-it-works" className="py-32 bg-surface-container-low/50">
        <div className="max-w-7xl mx-auto px-6 text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8">From stuck to clear in 3 steps.</h2>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px border-t-2 border-dashed border-outline-variant/30 -z-10"></div>

            <StepCard
              number="1"
              icon="search"
              title="Ask or Upload"
              description="Type a question, paste a coding problem, or upload your lecture slides."
            />
            <StepCard
              number="2"
              icon="temp_preferences_custom"
              title="AI Adaptation"
              description="Our engine analyzes your level and the context to generate the perfect explanation."
            />
            <StepCard
              number="3"
              icon="verified"
              title="Master & Apply"
              description="Review the explanation, save to history, and test your knowledge with auto-generated quizzes."
            />
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-32 overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
            <div className="bg-on-background text-white rounded-[4rem] p-12 md:p-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8">Loved by students worldwide.</h2>
                        <p className="text-xl text-white/60 mb-12">We're on a mission to make world-class education accessible to every student, everywhere.</p>

                        <div className="flex flex-wrap gap-8">
                            <Stat label="Active Students" value="5,000+" />
                            <Stat label="Accuracy Rate" value="99.2%" />
                            <Stat label="Study Hours Saved" value="120k" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <TestimonialCard
                            name="Alex Rivera"
                            role="CS Sophmore @ Georgia Tech"
                            text="Student Bytes literally saved my Data Structures grade. The way it visualizes Heap operations is insane."
                        />
                         <TestimonialCard
                            name="Priya Sharma"
                            role="Final Year @ IIT Delhi"
                            text="The AI tutor understands nuance that GPT-4 often misses. It's tuned specifically for the way we learn."
                        />
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="py-48 text-center px-6">
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-12 leading-[1]">Ready to start your <br/> learning journey?</h2>
          <button
            onClick={() => navigate('/signup')}
            className="ai-pulse-gradient text-white px-16 py-6 rounded-full font-black text-2xl shadow-2xl hover:scale-110 transition-transform active:scale-95"
          >
            Start Learning for Free
          </button>
          <p className="mt-8 text-on-surface-variant font-bold uppercase tracking-widest text-xs">No Credit Card • Cancel Anytime • Student Focused</p>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant/20 py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 ai-pulse-gradient rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xl">terminal</span>
                    </div>
                    <span className="text-2xl font-black tracking-tighter">Student Bytes</span>
                </div>
                <p className="max-w-sm text-on-surface-variant font-medium leading-relaxed">
                    Making computer science education personalized, interactive, and accessible for everyone.
                </p>
            </div>
            <div>
                <h4 className="font-black text-sm uppercase tracking-widest mb-8 text-outline">Product</h4>
                <ul className="space-y-4 font-bold text-on-surface-variant">
                    <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Roadmap</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-black text-sm uppercase tracking-widest mb-8 text-outline">Connect</h4>
                <ul className="space-y-4 font-bold text-on-surface-variant">
                    <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">LinkedIn</a></li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-outline-variant/10 flex flex-col md:row items-center justify-between gap-6">
            <p className="text-outline font-medium text-sm">© 2025 Student Bytes. All rights reserved.</p>
            <div className="flex gap-8 font-bold text-sm text-outline">
                <a href="#" className="hover:text-on-surface transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-on-surface transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-on-surface transition-colors">Cookies</a>
            </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, gradient }: { icon: string, title: string, description: string, gradient: string }) => (
  <div className="group bg-white p-10 rounded-[3rem] border border-outline-variant/20 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2">
    <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-10 shadow-lg group-hover:scale-110 transition-transform`}>
      <span className="material-symbols-outlined text-white text-3xl">{icon}</span>
    </div>
    <h3 className="text-2xl font-black mb-4 tracking-tight">{title}</h3>
    <p className="text-on-surface-variant leading-relaxed font-medium">{description}</p>
  </div>
);

const StepCard = ({ number, icon, title, description }: { number: string, icon: string, title: string, description: string }) => (
  <div className="text-center group">
    <div className="relative mb-10">
        <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl border border-outline-variant/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform relative z-10">
            <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 ai-pulse-gradient rounded-full flex items-center justify-center text-white font-black text-xs z-20 shadow-lg ring-4 ring-background">
            {number}
        </div>
    </div>
    <h4 className="text-2xl font-black mb-4 tracking-tight">{title}</h4>
    <p className="text-on-surface-variant font-medium leading-relaxed">{description}</p>
  </div>
);

const Stat = ({ label, value }: { label: string, value: string }) => (
  <div>
    <div className="text-4xl md:text-5xl font-black mb-2 tracking-tighter">{value}</div>
    <div className="text-white/40 font-bold uppercase tracking-widest text-[10px]">{label}</div>
  </div>
);

const TestimonialCard = ({ name, role, text }: { name: string, role: string, text: string }) => (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors cursor-default">
        <p className="text-lg font-medium mb-6 italic">"{text}"</p>
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-sm">person</span>
            </div>
            <div>
                <div className="font-black text-sm">{name}</div>
                <div className="text-white/40 font-bold uppercase tracking-widest text-[10px]">{role}</div>
            </div>
        </div>
    </div>
)

export default LandingPage;
