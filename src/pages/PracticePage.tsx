import React, { useState } from 'react';
import { useUserStore } from '../hooks/useUserStore';

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
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 pb-32">
      <header>
        <h1 className="text-4xl font-black tracking-tighter">Practice Lab</h1>
        <p className="text-on-surface-variant font-medium mt-2">Test your knowledge and earn XP.</p>
      </header>

      <div className="flex flex-wrap gap-4">
        {['all', 'arrays', 'linked-lists', 'dp'].map(t => (
          <button
            key={t}
            onClick={() => { setSelectedTopic(t); setCurrentQuestionIdx(0); setFeedback(null); }}
            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              selectedTopic === t ? 'ai-pulse-gradient text-white shadow-lg' : 'bg-surface-container-low text-outline hover:bg-surface-container-highest'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {currentQuestion ? (
        <div className="glass-panel ambient-shadow rounded-[3rem] p-10 border border-white/40 space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 ${
                currentQuestion.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {currentQuestion.difficulty}
              </div>
              <h2 className="text-3xl font-black tracking-tighter">{currentQuestion.title}</h2>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-black text-outline uppercase tracking-widest">Potential Reward</p>
                <p className="text-2xl font-black text-primary">+{currentQuestion.xpReward} XP</p>
            </div>
          </div>

          <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/10">
            <p className="text-lg font-medium leading-relaxed">{currentQuestion.description}</p>
          </div>

          <div className="space-y-4">
             <label className="text-xs font-black uppercase tracking-widest text-outline ml-4">Your Answer</label>
             <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type result here..."
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl py-5 px-8 outline-none focus:border-primary/40 transition-colors font-black text-xl"
             />
          </div>

          {feedback && (
            <div className={`p-6 rounded-2xl animate-fade-in flex items-center gap-4 ${
                feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
                <span className="material-symbols-outlined">{feedback.type === 'success' ? 'check_circle' : 'error'}</span>
                <p className="font-bold">{feedback.message}</p>
            </div>
          )}

          <div className="flex gap-4">
             <button
                onClick={handleCheck}
                className="flex-1 ai-pulse-gradient text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95"
             >
                Check Answer
             </button>
             {feedback?.type === 'success' && (
                <button
                    onClick={nextQuestion}
                    className="flex-1 bg-on-background text-white py-5 rounded-2xl font-black text-lg hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                    Next Question <span className="material-symbols-outlined">arrow_forward</span>
                </button>
             )}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-surface-container-low rounded-[3rem] border border-dashed border-outline-variant/40">
            <p className="text-outline font-bold">No questions available for this topic yet.</p>
        </div>
      )}
    </div>
  );
};

export default PracticePage;
