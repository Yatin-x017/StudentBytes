import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '../hooks/useUserStore';
import { queryAI, simulateStreaming, type StructuredResponse } from '../lib/ai-engine';

const StudentDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { store, addXP, addToHistory, updateTopicProgress } = useUserStore();

  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [streamingText, setStreamingText] = useState('');
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    setStreamingText('');

    const response = await queryAI(text);
    addToHistory(text, response.topicId);
    addXP(2); // XP for asking

    // Artificial "thinking" delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);

    // Stream the explanation part
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
        updateTopicProgress('arrays', 10); // Simplified topic update
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 pb-48">
      {/* Header with Stats */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <h1 className="text-3xl font-black tracking-tighter">Mastery Overview</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <StatCard label="Total XP" value={store.xp} icon="bolt" color="text-primary" />
                <StatCard label="Level" value={store.level} icon="military_tech" color="text-secondary" />
                <StatCard label="Rank" value="#142" icon="trophy" color="text-amber-500" />
                <StatCard label="Streak" value="14" icon="local_fire_department" color="text-rose-500" />
            </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-outline-variant/20 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-outline">Next Milestone</h3>
                <span className="text-xs font-black text-primary">{store.xp} / 150 XP</span>
            </div>
            <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div
                    className="h-full ai-pulse-gradient rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, (store.xp / 150) * 100)}%` }}
                ></div>
            </div>
            <p className="text-[10px] text-outline font-bold mt-4 uppercase tracking-widest text-center">
                {store.xp >= 150 ? 'Advanced Level Reached!' : `${150 - store.xp} XP to reach Advanced`}
            </p>
        </div>
      </section>

      {/* Main Learning Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chat Interface */}
        <div className="lg:col-span-8 space-y-6">
            {messages.length === 0 && !isLoading && !streamingText && (
                <div className="bg-surface-container-low rounded-[3rem] p-12 text-center border border-dashed border-outline-variant/30">
                    <div className="w-20 h-20 ai-pulse-gradient rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/20">
                        <span className="material-symbols-outlined text-white text-4xl">psychology</span>
                    </div>
                    <h2 className="text-2xl font-black tracking-tighter mb-4">Start your learning loop</h2>
                    <p className="text-on-surface-variant font-medium max-w-sm mx-auto mb-8 text-sm">Ask about any CS concept to get a structured explanation, examples, and practice quizzes.</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {['Big O notation', 'Quick Sort', 'Linked Lists', 'Binary Search'].map(s => (
                            <button
                                key={s}
                                onClick={() => handleQuery(s)}
                                className="px-4 py-2 bg-white border border-outline-variant/20 rounded-xl text-xs font-bold hover:border-primary/40 transition-colors"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-8 min-h-[400px]">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                        <div className={`max-w-[95%] md:max-w-[90%] ${msg.role === 'user' ? 'bg-on-background text-white p-6 rounded-[2rem] rounded-tr-none' : ''}`}>
                            {msg.role === 'user' ? (
                                <p className="font-bold">{msg.content}</p>
                            ) : (
                                <StructuredAIResponse response={msg.structured} onQuizAnswer={handleQuizAnswer} />
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                     <div className="flex justify-start">
                        <div className="bg-white border border-outline-variant/20 p-6 rounded-[2rem] rounded-tl-none flex items-center gap-4">
                            <div className="w-8 h-8 ai-pulse-gradient rounded-full flex items-center justify-center animate-spin">
                                <span className="material-symbols-outlined text-white text-sm">refresh</span>
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-primary animate-pulse">Thinking...</span>
                        </div>
                    </div>
                )}

                {streamingText && (
                    <div className="flex justify-start">
                        <div className="max-w-[90%]">
                             <StructuredAIResponse
                                isStreaming
                                response={{ explanation: streamingText, keyPoints: [], example: '', practiceQuestions: [], quiz: { question: '', options: [] }, topicId: '' }}
                                onQuizAnswer={() => {}}
                            />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>

        {/* Sidebar Panel */}
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">history</span>
                    Recent History
                </h3>
                <div className="space-y-4">
                    {store.history.length > 0 ? store.history.map(h => (
                        <button
                            key={h.id}
                            onClick={() => handleQuery(h.query)}
                            className="w-full text-left p-4 rounded-2xl hover:bg-surface-container-low transition-colors group"
                        >
                            <p className="text-xs font-black line-clamp-1 group-hover:text-primary transition-colors">{h.query}</p>
                            <p className="text-[10px] text-outline font-bold mt-1 uppercase tracking-widest">{h.topic}</p>
                        </button>
                    )) : (
                        <p className="text-[10px] text-outline font-bold uppercase tracking-widest text-center py-4">No history yet</p>
                    )}
                </div>
            </div>

            <div className="bg-on-background text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <h3 className="text-sm font-black uppercase tracking-widest mb-4 relative z-10">Continue Learning</h3>
                <p className="text-white/60 text-xs font-medium mb-6 relative z-10">You were last studying <strong>Linked Lists</strong>. Resume where you left off?</p>
                <button
                    onClick={() => navigate('/dashboard/practice')}
                    className="w-full bg-white text-on-background py-4 rounded-2xl font-black text-sm hover:scale-105 transition-transform relative z-10"
                >
                    Resume Lab
                </button>
            </div>
        </div>
      </div>

      {/* Persistent Input Bar */}
      <div className="fixed bottom-8 left-4 right-4 lg:left-72 lg:right-8 z-50">
          <div className="max-w-5xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <div className="relative bg-white/80 backdrop-blur-2xl border border-outline-variant/30 rounded-[2.5rem] shadow-2xl p-2 flex items-center gap-2">
                  <button className="w-12 h-12 flex items-center justify-center text-outline hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">add_circle</span>
                  </button>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleQuery(query)}
                    placeholder="Ask about DSA, Coding, or CS..."
                    className="flex-1 bg-transparent border-none outline-none font-bold text-lg px-2"
                  />
                  <button
                    onClick={() => handleQuery(query)}
                    disabled={!query.trim() || isLoading}
                    className="w-12 h-12 ai-pulse-gradient text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
                  >
                    <span className="material-symbols-outlined">arrow_upward</span>
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }: { label: string, value: string | number, icon: string, color: string }) => (
    <div className="bg-white p-5 rounded-3xl border border-outline-variant/10 shadow-sm">
        <div className={`w-8 h-8 rounded-xl bg-surface-container-low flex items-center justify-center mb-3 ${color}`}>
            <span className="material-symbols-outlined text-sm">{icon}</span>
        </div>
        <p className="text-[10px] text-outline font-black uppercase tracking-widest">{label}</p>
        <p className="text-xl font-black tracking-tight">{value}</p>
    </div>
);

const StructuredAIResponse = ({ response, onQuizAnswer, isStreaming = false }: { response: StructuredResponse, onQuizAnswer: (correct: boolean, id: string) => void, isStreaming?: boolean }) => {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="bg-white border border-outline-variant/20 p-8 rounded-[2.5rem] shadow-sm rounded-tl-none">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 ai-pulse-gradient rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-sm">bolt</span>
                    </div>
                    <span className="text-xs font-black text-primary uppercase tracking-widest">Student Bytes AI</span>
                </div>

                <div className="prose prose-sm max-w-none">
                    <p className="text-lg font-medium leading-relaxed text-on-surface mb-8">
                        {response.explanation}
                    </p>

                    {!isStreaming && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-outline">📌 Key Takeaways</h4>
                                    <ul className="space-y-2">
                                        {response.keyPoints.map((kp, i) => (
                                            <li key={i} className="flex gap-3 text-sm font-bold">
                                                <span className="text-primary">•</span> {kp}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-outline">💡 Real-world Example</h4>
                                    <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 text-xs font-medium italic">
                                        {response.example}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 bg-primary/5 p-8 rounded-[2rem] border border-primary/10">
                                <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">quiz</span>
                                    Quick Quiz (+10 XP)
                                </h4>
                                <p className="text-sm font-black mb-6">{response.quiz.question}</p>
                                <div className="space-y-3">
                                    {response.quiz.options.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => {
                                                setSelectedOption(opt.id);
                                                onQuizAnswer(opt.isCorrect, response.explanation);
                                            }}
                                            className={`w-full text-left p-4 rounded-xl text-sm font-bold border transition-all ${
                                                selectedOption === opt.id
                                                    ? (opt.isCorrect ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-rose-50 border-rose-500 text-rose-700')
                                                    : 'bg-white border-outline-variant/20 hover:border-primary/40'
                                            }`}
                                        >
                                            {opt.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {!isStreaming && (
                <div className="flex flex-wrap gap-3 animate-fade-in" style={{ animationDelay: '500ms' }}>
                    <button
                        onClick={() => navigate('/dashboard/practice')}
                        className="bg-on-background text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                        <span className="material-symbols-outlined text-sm">fitness_center</span>
                        Practice this topic
                    </button>
                    <button className="bg-white border border-outline-variant/20 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-surface-container-low transition-colors">
                        Try harder question
                    </button>
                    <button className="bg-white border border-outline-variant/20 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-surface-container-low transition-colors">
                        Revise basics
                    </button>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
