import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../hooks/useUserStore';
import { queryAI, simulateStreaming, type StructuredResponse } from '../lib/ai-engine';
import { cn, animations } from '../lib/utils';

const StudentDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { store, addXP, addToHistory, updateTopicProgress } = useUserStore();

  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Analyzing your question...');
  const [messages, setMessages] = useState<any[]>([]);
  const [streamingText, setStreamingText] = useState('');
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const placeholders = ["Explain Binary Search", "What is a stack?", "Help me with recursion", "Explain Big O", "What is DP?"];

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText, isLoading]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('demo') === 'true') {
      handleQuery('Can you explain the difference between a Hash Map and a Tree Map?');
    }
  }, [location]);

  const handleQuery = async (text: string) => {
    if (!text.trim()) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);
    setLoadingText('Analyzing your question...');
    setStreamingText('');

    const thinkingPhrases = ['Analyzing your question...', 'Breaking it down...', 'Retrieving CS concepts...', 'Preparing your lesson...'];
    let phraseIdx = 0;
    const thinkingInterval = setInterval(() => {
      phraseIdx = (phraseIdx + 1) % thinkingPhrases.length;
      setLoadingText(thinkingPhrases[phraseIdx]);
    }, 800);

    const response = await queryAI(text);
    addToHistory(text, response.topicId);
    addXP(2);

    await new Promise(resolve => setTimeout(resolve, 2000));
    clearInterval(thinkingInterval);
    setIsLoading(false);

    await simulateStreaming(response.explanation, (token) => {
      setStreamingText(token);
    });

    const assistantMsg = {
        role: 'assistant',
        content: response.explanation,
        structured: response
    };

    setMessages(prev => [...prev, assistantMsg]);
    setStreamingText('');
    updateTopicProgress(response.topicId, 5);
  };

  const handleQuizAnswer = (isCorrect: boolean, quizId: string) => {
    if (activeQuiz === quizId) return;
    setActiveQuiz(quizId);
    if (isCorrect) {
        addXP(10);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 md:p-10 max-w-[1600px] mx-auto min-h-screen relative z-10">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-10">

        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl font-black tracking-tight text-neutral-900">
              Hey, ready to learn?
            </h1>
            <p className="text-neutral-500 font-medium mt-1">Master your CS concepts with AI-powered precision.</p>
          </div>

          <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md p-2 pr-6 rounded-full border border-white/40 shadow-sm">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">bolt</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-neutral-900">{store.xp} XP</span>
                <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">Level {store.level}</span>
              </div>
              <div className="w-32 h-1.5 bg-neutral-100 rounded-full mt-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (Number(store.xp) / (Number(store.level) * 100)) * 100)}%` }}
                  className="h-full bg-gradient-to-r from-primary to-indigo-500"
                />
              </div>
            </div>
          </div>
        </motion.header>

        {/* AI Focus Area */}
        <section className="relative">
          <motion.div
            whileFocus={{ scale: 1.01 }}
            className="relative group"
          >
            <motion.div
              animate={isLoading ? {} : {
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.01, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-indigo-500/10 rounded-[3rem] blur-3xl"
            />
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-indigo-500/20 rounded-[2.5rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-white/70 backdrop-blur-2xl rounded-[2.5rem] border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-3 flex items-center gap-4 group-focus-within:border-primary/30 transition-colors duration-500">
              <div className="w-12 h-12 flex items-center justify-center text-neutral-400 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined text-2xl">search</span>
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuery(query)}
                placeholder={placeholders[placeholderIdx]}
                className="flex-1 bg-transparent border-none outline-none font-bold text-xl placeholder:text-neutral-300 transition-all duration-500"
              />
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuery(query)}
                disabled={!query.trim() || isLoading}
                className="h-14 px-8 bg-neutral-900 text-white rounded-[1.75rem] font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-800 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Thinking...' : 'Analyze'}
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </motion.button>
            </div>
          </motion.div>

          <div className="flex flex-wrap gap-2 mt-4 px-4">
            {['Explain Big O', 'What is DP?', 'Merge Sort vs Quick Sort'].map(p => (
              <button
                key={p}
                onClick={() => handleQuery(p)}
                className="text-[11px] font-bold text-neutral-400 hover:text-primary transition-colors border border-neutral-100 rounded-full px-4 py-1.5 hover:bg-primary/5 hover:border-primary/20"
              >
                {p}
              </button>
            ))}
          </div>
        </section>

        {/* Response Area */}
        <div className="space-y-12 pb-24">
          <AnimatePresence mode="popLayout">
            {messages.length === 0 && !isLoading && !streamingText && (
              <motion.div
                {...animations.fadeInUp}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mb-6"
                >
                  <span className="material-symbols-outlined text-4xl text-indigo-300">psychology</span>
                </motion.div>
                <h3 className="text-xl font-black text-neutral-900 tracking-tight">Your knowledge loop starts here</h3>
                <p className="text-neutral-500 font-medium max-w-xs mt-2">Ask a question above to generate structured lessons and practice tasks.</p>
              </motion.div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex flex-col gap-6", msg.role === 'user' ? 'items-end' : 'items-start')}>
                {msg.role === 'user' ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-neutral-900 text-white px-8 py-5 rounded-[2rem] rounded-tr-none font-bold text-lg shadow-lg"
                  >
                    {msg.content}
                  </motion.div>
                ) : (
                  <StructuredAIResponse response={msg.structured} onQuizAnswer={handleQuizAnswer} />
                )}
              </div>
            ))}

            {isLoading && (
              <motion.div
                {...animations.fadeInUp}
                className="w-full flex flex-col gap-8"
              >
                <div className="bg-white/80 backdrop-blur-md border border-white/40 p-10 rounded-[3rem] shadow-sm flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="material-symbols-outlined text-primary text-xl"
                      >autorenew</motion.div>
                    </div>
                    <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em] animate-pulse">{loadingText}</span>
                  </div>
                  <div className="space-y-4">
                    <div className="h-6 w-3/4 bg-neutral-100 rounded-full animate-pulse" />
                    <div className="h-6 w-1/2 bg-neutral-100 rounded-full animate-pulse" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="h-48 bg-neutral-50 rounded-[2.5rem] animate-pulse" />
                  <div className="h-48 bg-neutral-50 rounded-[2.5rem] animate-pulse" />
                </div>
              </motion.div>
            )}

            {streamingText && (
              <motion.div {...animations.fadeInUp} className="w-full">
                 <StructuredAIResponse
                    isStreaming
                    response={{ explanation: streamingText, keyPoints: [], example: '', practiceQuestions: [], quiz: { question: '', options: [] }, topicId: '' }}
                    onQuizAnswer={() => {}}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="w-full lg:w-80 flex flex-col gap-8">
        <motion.div
          {...animations.fadeInUp}
          whileHover={{ y: -5 }}
          className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-premium"
        >
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary">analytics</span>
            Your Mastery
          </h4>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px] font-black uppercase">
                <span className="text-neutral-400">Arrays</span>
                <span className="text-primary">85%</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px] font-black uppercase">
                <span className="text-neutral-400">Dynamic Programming</span>
                <span className="text-primary">12%</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '12%' }}
                  className="h-full bg-indigo-400"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          {...animations.fadeInUp}
          whileHover={{ y: -5 }}
          className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-premium"
        >
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">history</span>
            Recent Topics
          </h4>
          <div className="space-y-4">
            {store.history.slice(0, 3).map(h => (
              <button
                key={h.id}
                onClick={() => handleQuery(h.query)}
                className="w-full text-left p-4 rounded-2xl hover:bg-neutral-50 transition-colors group border border-transparent hover:border-neutral-100"
              >
                <p className="text-[13px] font-bold text-neutral-900 line-clamp-1 group-hover:text-primary transition-colors">{h.query}</p>
                <p className="text-[10px] text-neutral-400 font-bold mt-1 uppercase tracking-widest">{h.topic}</p>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-indigo-600 to-primary p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-4 relative z-10">Continue Learning</h4>
          <p className="text-sm font-medium mb-8 relative z-10">Ready to put your skills to the test in the Practice Lab?</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard/practice')}
            className="w-full bg-white text-neutral-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg relative z-10"
          >
            Open Practice Lab
          </motion.button>
        </motion.div>
      </aside>
    </div>
  );
};

const StructuredAIResponse = ({ response, onQuizAnswer, isStreaming = false }: { response: StructuredResponse, onQuizAnswer: (correct: boolean, id: string) => void, isStreaming?: boolean }) => {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const cardVariants = animations.stagger;

    return (
        <div className="w-full space-y-10">
            {/* Primary Explanation Card */}
            <motion.div
              {...cardVariants(0)}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white/80 backdrop-blur-xl border border-white/40 p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden"
            >
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-xl">psychology</span>
                        </div>
                        <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Conceptual Insight</span>
                    </div>
                    {response.difficulty && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-full">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{response.difficulty}</span>
                        </div>
                    )}
                </div>

                <p className="text-xl md:text-2xl font-medium leading-relaxed text-neutral-900 tracking-tight">
                    {response.explanation}
                </p>

                {response.confidence && (
                    <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-between">
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">AI Confidence</span>
                        <div className="flex items-center gap-2">
                             <div className="w-24 h-1 bg-neutral-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400" style={{ width: `${response.confidence * 100}%` }}></div>
                             </div>
                             <span className="text-[10px] font-black text-emerald-500">{Math.round(response.confidence * 100)}%</span>
                        </div>
                    </div>
                )}
            </motion.div>

            {!isStreaming && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Key Points Card */}
                        <motion.div
                          {...cardVariants(1)}
                          whileHover={{ y: -5, transition: { duration: 0.2 } }}
                          className="bg-neutral-50/70 backdrop-blur-sm border border-white/40 p-8 rounded-[2.5rem]"
                        >
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-6">📌 Key Takeaways</h4>
                            <ul className="space-y-4">
                                {response.keyPoints.map((kp, i) => (
                                    <li key={i} className="flex gap-4 text-[15px] font-bold text-neutral-700">
                                        <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center mt-0.5 shrink-0">
                                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                        </div>
                                        {kp}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Example Card */}
                        <motion.div
                          {...cardVariants(2)}
                          whileHover={{ y: -5, transition: { duration: 0.2 } }}
                          className="bg-white/80 backdrop-blur-md border border-white/40 p-8 rounded-[2.5rem] shadow-sm flex flex-col"
                        >
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-6">💡 Example Case</h4>
                            <div className="flex-1 flex items-center justify-center bg-neutral-50 rounded-2xl p-6 text-sm font-bold text-neutral-600 italic leading-relaxed border border-white/10">
                                "{response.example}"
                            </div>
                        </motion.div>
                    </div>

                    {/* Quiz Card */}
                    <motion.div
                      {...cardVariants(3)}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className="bg-primary/[0.02] border border-primary/10 p-10 rounded-[3rem]"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary">quiz</span>
                            </div>
                            <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Knowledge Check</span>
                        </div>
                        <h3 className="text-xl font-black text-neutral-900 mb-8">{response.quiz.question}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {response.quiz.options.map(opt => (
                                <motion.button
                                    key={opt.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setSelectedOption(opt.id);
                                        onQuizAnswer(opt.isCorrect, response.explanation);
                                    }}
                                    className={cn(
                                      "w-full text-left p-6 rounded-2xl text-[15px] font-bold border transition-all duration-300",
                                      selectedOption === opt.id
                                          ? (opt.isCorrect ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-lg shadow-emerald-500/10' : 'bg-rose-50 border-rose-500 text-rose-700 shadow-lg shadow-rose-500/10')
                                          : 'bg-white border-neutral-100 text-neutral-600 hover:border-primary/40 hover:shadow-md'
                                    )}
                                >
                                    {opt.text}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Smart CTAs */}
                    <motion.div
                      {...cardVariants(4)}
                      className="flex flex-wrap gap-4 pt-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/dashboard/practice')}
                            className="bg-neutral-900 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl shadow-neutral-900/20"
                        >
                            <span className="material-symbols-outlined text-lg">fitness_center</span>
                            Practice this
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white/70 backdrop-blur-md border border-white/40 text-neutral-500 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:text-neutral-900 transition-premium shadow-sm"
                        >
                            Explain Simpler
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white/70 backdrop-blur-md border border-white/40 text-neutral-500 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:text-neutral-900 transition-premium shadow-sm"
                        >
                            Try Harder
                        </motion.button>
                    </motion.div>
                </>
            )}
        </div>
    );
};

export default StudentDashboard;
