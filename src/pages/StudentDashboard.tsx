import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('demo') === 'true') {
      triggerDemo();
    }
  }, [location]);

  const triggerDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMessages([
        {
          role: 'user',
          content: 'Can you explain the difference between a Hash Map and a Tree Map in terms of time complexity?'
        },
        {
          role: 'assistant',
          content: 'Great question! This is a classic DSA interview topic. Here is the breakdown:\n\n### 1. Hash Map (HashMap in Java, dict in Python)\n- **Time Complexity**: Average case O(1) for search, insert, and delete. Worst case is O(n) if many collisions occur.\n- **Ordering**: No guaranteed order.\n- **Under the hood**: Uses an array and a hash function.\n\n### 2. Tree Map (TreeMap in Java, std::map in C++)\n- **Time Complexity**: O(log n) for search, insert, and delete.\n- **Ordering**: Elements are stored in sorted order.\n- **Under the hood**: Usually implemented as a Red-Black Tree (Self-balancing BST).\n\n**Key takeaway**: Use a Hash Map for maximum speed when order doesn\'t matter. Use a Tree Map when you need to iterate over items in sorted order.',
          isDemo: true
        }
      ]);
    }, 1500);
  };

  const handleSend = () => {
    if (!query.trim()) return;
    const newMsg = { role: 'user', content: query };
    setMessages(prev => [...prev, newMsg]);
    setQuery('');
    setIsLoading(true);

    // Mock response
    setTimeout(() => {
      setIsLoading(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `That's an interesting question about "${query}". In a real environment, I would provide a deep dive into the underlying CS principles, but for this demo, I'm showing you the interaction flow. Ready to explore more?`
      }]);
    }, 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 pb-32">
      {/* Hero Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">Welcome back, Alex</h1>
          <p className="text-on-surface-variant font-medium mt-1">What are we mastering today?</p>
        </div>
        <div className="flex items-center gap-3 bg-surface-container-low p-2 rounded-2xl border border-outline-variant/10">
           <div className="flex items-center gap-2 bg-secondary-fixed/30 px-3 py-1.5 rounded-xl">
                <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                <span className="text-sm font-black text-on-secondary-fixed">14 DAY STREAK</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black">
                AR
            </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="space-y-6">
        {messages.length === 0 && !isLoading && (
          <div className="py-20 text-center space-y-8 animate-fade-in">
             <div className="w-24 h-24 ai-pulse-gradient rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-primary/20 mb-8">
                <span className="material-symbols-outlined text-white text-5xl">auto_awesome</span>
             </div>
             <div>
                <h2 className="text-4xl font-black tracking-tighter mb-4">Your personal CS tutor.</h2>
                <p className="text-on-surface-variant max-w-md mx-auto font-medium">Ask about Data Structures, Algorithms, System Design, or even help with a tricky bug.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <PromptSuggestion
                    icon="code"
                    title="Explain Dijkstra's"
                    subtitle="Visualize shortest path logic"
                    onClick={() => { setQuery("Explain Dijkstra's Algorithm with an example"); }}
                />
                <PromptSuggestion
                    icon="terminal"
                    title="Code Review"
                    subtitle="Paste your code for feedback"
                    onClick={() => { setQuery("Can you review this Python function for O(n) efficiency?"); }}
                />
                <PromptSuggestion
                    icon="psychology"
                    title="Mock Interview"
                    subtitle="Practice technical questions"
                    onClick={() => { setQuery("Start a mock interview for a Junior Dev role"); }}
                />
                <PromptSuggestion
                    icon="history_edu"
                    title="Summarize Notes"
                    subtitle="Upload lecture slides"
                    onClick={() => {}}
                />
             </div>
          </div>
        )}

        <div className="space-y-8">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`max-w-[85%] md:max-w-2xl p-6 rounded-[2rem] ${
                msg.role === 'user'
                  ? 'bg-on-background text-white rounded-tr-none'
                  : 'bg-white border border-outline-variant/20 shadow-sm rounded-tl-none'
              }`}>
                {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 ai-pulse-gradient rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-[12px] text-white">auto_awesome</span>
                        </div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Student Bytes AI</span>
                        {msg.isDemo && <span className="bg-secondary/10 text-secondary text-[10px] px-2 py-0.5 rounded-full font-bold">DEMO</span>}
                    </div>
                )}
                <div className="prose prose-sm font-medium leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-pulse">
                <div className="bg-white border border-outline-variant/20 p-6 rounded-[2rem] rounded-tl-none max-w-sm">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 ai-pulse-gradient rounded-full flex items-center justify-center animate-spin">
                            <span className="material-symbols-outlined text-white text-sm">refresh</span>
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 bg-surface-container-highest rounded-full w-32"></div>
                            <div className="h-2 bg-surface-container-highest rounded-full w-24"></div>
                        </div>
                     </div>
                </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Bar */}
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
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask anything about CS..."
                    className="flex-1 bg-transparent border-none outline-none font-bold text-lg px-2"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!query.trim() || isLoading}
                    className="w-12 h-12 ai-pulse-gradient text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
                  >
                    <span className="material-symbols-outlined">arrow_upward</span>
                  </button>
              </div>
              <div className="mt-4 flex justify-center gap-6 text-[10px] font-black text-outline uppercase tracking-widest px-4">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">bolt</span> Instant Explanations</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">verified</span> 99% Accuracy</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">history</span> Syncs with Profile</span>
              </div>
          </div>
      </div>
    </div>
  );
};

const PromptSuggestion = ({ icon, title, subtitle, onClick }: { icon: string, title: string, subtitle: string, onClick: () => void }) => (
    <button
        onClick={onClick}
        className="text-left bg-white p-5 rounded-3xl border border-outline-variant/20 hover:border-primary/40 hover:shadow-lg transition-all group"
    >
        <div className="w-10 h-10 bg-surface-container-low rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/5 transition-colors">
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">{icon}</span>
        </div>
        <h4 className="font-bold text-sm mb-1">{title}</h4>
        <p className="text-[10px] text-outline font-bold uppercase tracking-widest">{subtitle}</p>
    </button>
);

export default StudentDashboard;
