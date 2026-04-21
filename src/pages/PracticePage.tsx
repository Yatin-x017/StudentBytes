import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../hooks/useUserStore';
import { cn, animations } from '../lib/utils';

interface PracticeQuestion {
  id: string;
  topicId: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  expectedInput: string;
  xpReward: number;
}

const QUESTIONS: PracticeQuestion[] = [
  {
    id: 'q1',
    topicId: 'arrays',
    title: 'Find Max Element',
    difficulty: 'Easy',
    description: 'Write a function to find the maximum number in an array [1, 5, 2, 9, 3]. What is the result?',
    expectedInput: '9',
    xpReward: 10
  },
  {
    id: 'q2',
    topicId: 'arrays',
    title: 'Array Reversal',
    difficulty: 'Medium',
    description: 'If you reverse [1, 2, 3, 4], what is the element at index 1?',
    expectedInput: '3',
    xpReward: 15
  },
  {
    id: 'q3',
    topicId: 'linked-lists',
    title: 'Node Access',
    difficulty: 'Easy',
    description: 'In a singly linked list, which node does the "tail" point to?',
    expectedInput: 'null',
    xpReward: 10
  },
  {
      id: 'q4',
      topicId: 'dp',
      title: 'Fibonacci Step',
      difficulty: 'Medium',
      description: 'What is the 5th Fibonacci number (starting from 0, 1)?',
      expectedInput: '5',
      xpReward: 15
  }
];

const PracticePage: React.FC = () => {
  const { addXP, updateTopicProgress } = useUserStore();
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const filteredQuestions = QUESTIONS.filter(q => selectedTopic === 'all' || q.topicId === selectedTopic);
  const currentQuestion = filteredQuestions[currentQuestionIdx];

  const handleCheck = () => {
    if (userInput.trim().toLowerCase() === currentQuestion.expectedInput.toLowerCase()) {
      setFeedback({ type: 'success', message: `Correct! +${currentQuestion.xpReward} XP earned.` });
      addXP(currentQuestion.xpReward);
      updateTopicProgress(currentQuestion.topicId, 10);
    } else {
      setFeedback({ type: 'error', message: 'Not quite. Try again or check the hint!' });
    }
  };

  const nextQuestion = () => {
    setFeedback(null);
    setUserInput('');
    setCurrentQuestionIdx((prev) => (prev + 1) % filteredQuestions.length);
  };

  return (
    <div className="flex flex-col gap-10 p-6 md:p-10 max-w-[1200px] mx-auto min-h-screen relative z-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight text-neutral-900">Practice Lab</h1>
        <p className="text-neutral-500 font-medium">Challenge yourself and sharpen your CS intuition.</p>
      </header>

      <div className="flex flex-wrap gap-3">
        {['all', 'arrays', 'linked-lists', 'dp'].map(t => (
          <motion.button
            key={t}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setSelectedTopic(t); setCurrentQuestionIdx(0); setFeedback(null); }}
            className={cn(
                "px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-premium",
                selectedTopic === t
                    ? "bg-neutral-900 text-white shadow-xl shadow-neutral-900/10"
                    : "bg-white border border-neutral-100 text-neutral-400 hover:text-neutral-900"
            )}
          >
            {t}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {currentQuestion ? (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] space-y-10"
          >
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="space-y-4">
                <div className={cn(
                  "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  currentQuestion.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                )}>
                  <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", currentQuestion.difficulty === 'Easy' ? 'bg-emerald-500' : 'bg-amber-500')} />
                  {currentQuestion.difficulty}
                </div>
                <h2 className="text-4xl font-black tracking-tight text-neutral-900">{currentQuestion.title}</h2>
              </div>
              <div className="bg-neutral-50 px-6 py-4 rounded-[2rem] border border-neutral-100">
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">XP Reward</p>
                  <p className="text-3xl font-black text-primary">+{currentQuestion.xpReward}</p>
              </div>
            </div>

            <div className="bg-neutral-50/50 p-8 rounded-[2rem] border border-neutral-100 shadow-inner">
              <p className="text-xl font-medium leading-relaxed text-neutral-800 tracking-tight">{currentQuestion.description}</p>
            </div>

            <div className="space-y-4">
               <label className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-4">Your Answer</label>
               <div className="relative group">
                 <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-indigo-500/10 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                 <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                    placeholder="Type result here..."
                    className="relative w-full bg-white border border-neutral-100 rounded-[2rem] py-6 px-10 outline-none focus:border-primary/30 transition-premium font-black text-2xl placeholder:text-neutral-200"
                 />
               </div>
            </div>

            {feedback && (
              <motion.div
                {...animations.fadeInUp}
                className={cn(
                    "p-6 rounded-[2rem] flex items-center gap-4 border",
                    feedback.type === 'success' ? 'bg-emerald-50/50 text-emerald-800 border-emerald-100' : 'bg-rose-50/50 text-rose-800 border-rose-100'
                )}
              >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    feedback.type === 'success' ? 'bg-emerald-100' : 'bg-rose-100'
                  )}>
                    <span className="material-symbols-outlined text-xl">{feedback.type === 'success' ? 'check_circle' : 'error'}</span>
                  </div>
                  <p className="font-bold text-lg">{feedback.message}</p>
              </motion.div>
            )}

            <div className="flex flex-col md:flex-row gap-4 pt-4">
               <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheck}
                  className="flex-1 bg-neutral-900 text-white py-6 rounded-[2rem] font-black text-lg shadow-xl shadow-neutral-900/10 hover:bg-neutral-800 transition-premium"
               >
                  Check Answer
               </motion.button>
               {feedback?.type === 'success' && (
                  <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={nextQuestion}
                      className="flex-1 bg-primary text-white py-6 rounded-[2rem] font-black text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:bg-indigo-600 transition-premium"
                  >
                      Next Challenge <span className="material-symbols-outlined">arrow_forward</span>
                  </motion.button>
               )}
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-24 bg-white/50 backdrop-blur-xl rounded-[3rem] border border-dashed border-neutral-200">
              <span className="material-symbols-outlined text-5xl text-neutral-300 mb-4 block">science</span>
              <p className="text-neutral-400 font-bold text-lg uppercase tracking-widest">More challenges coming soon</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PracticePage;
