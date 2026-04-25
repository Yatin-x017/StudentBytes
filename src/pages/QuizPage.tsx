import React, { useState, useEffect } from 'react';
import {
  Zap,
  BrainCircuit,
  Trophy,
  RefreshCcw,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Brain
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { useAI } from '@/hooks/useAI';
import { useAuth } from '@/context/AuthContext';
import { useDatabase } from '@/hooks/useDatabase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { XPToast } from '@/components/ui/XPToast';
import { CS_SUBJECTS, ROUTES } from '@/lib/constants';
import { QuizCard } from '@/components/study/QuizCard';
import { TopicSelector } from '@/components/study/TopicSelector';
import { calculateNextReview, type SRCard } from '@/lib/spacedRepetition';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizState {
  topic: string;
  questions: Question[];
  currentIndex: number;
  answers: number[];
  quizStarted: boolean;
  quizFinished: boolean;
}

const QuizPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { generateQuiz, loading } = useAI();
  const { user } = useAuth();
  const db = useDatabase(user?.id || '');
  const navigate = useNavigate();

  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState(CS_SUBJECTS[0]);
  const [showXP, setShowXP] = useState(false);
  const [lastXP, setLastXP] = useState(0);
  const [srCards, setSrCards] = useState<SRCard[]>([]);

  // Persisted state
  const [quizState, setQuizState] = useState<QuizState>(() => {
    const saved = localStorage.getItem('sb_quiz_state');
    return saved ? JSON.parse(saved) : {
      topic: '',
      questions: [],
      currentIndex: 0,
      answers: [],
      quizStarted: false,
      quizFinished: false
    };
  });

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    localStorage.setItem('sb_quiz_state', JSON.stringify(quizState));
  }, [quizState]);

  useEffect(() => {
    const loadSR = async () => {
      if (user?.id) {
        const cards = await db.fetchSRCards();
        setSrCards(cards);
      }
    };
    loadSR();
  }, [user, db]);

  const handleStartQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !state.apiKey) return;

    const result = await generateQuiz(topic);
    if (result && Array.isArray(result)) {
      setQuizState({
        topic,
        questions: result,
        quizStarted: true,
        currentIndex: 0,
        answers: [],
        quizFinished: false
      });
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setShowExplanation(true);
  };

  const handleNext = () => {
    const newAnswers = [...quizState.answers, selectedOption as number];

    if (quizState.currentIndex < quizState.questions.length - 1) {
      setQuizState({
        ...quizState,
        answers: newAnswers,
        currentIndex: quizState.currentIndex + 1
      });
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      const score = newAnswers.filter((ans, idx) => ans === quizState.questions[idx].correctIndex).length;
      const xpGained = score * 50;

      const newXp = state.user.xp + xpGained;
      dispatch({
        type: 'UPDATE_USER',
        payload: {
          xp: newXp,
          level: Math.floor(newXp / 1000) + 1
        }
      });

      // Save to quiz history
      if (user?.id) {
        db.insertQuizResult(quizState.topic, score, quizState.questions.length, xpGained).catch(console.error);
        db.upsertSettings({ xp: newXp, level: Math.floor(newXp / 1000) + 1 }).catch(console.error);
      }

      // Update/Create Spaced Repetition card
      const existingCard = srCards.find(c => c.topic.toLowerCase() === quizState.topic.toLowerCase());
      const baseCard = existingCard || {
        id: `sr_${Date.now()}`,
        topic: quizState.topic,
        easeFactor: 2.5,
        intervalDays: 1,
        repetitions: 0,
        nextReviewDate: new Date().toISOString().split('T')[0],
        lastScore: 0,
      };

      const updatedCard = calculateNextReview(baseCard, score / quizState.questions.length);
      if (user?.id) {
        db.upsertSRCard(updatedCard).catch(console.error);
      }

      setLastXP(xpGained);
      setShowXP(true);
      setQuizState({
        ...quizState,
        answers: newAnswers,
        quizFinished: true
      });
    }
  };


  const hasHistory = JSON.parse(localStorage.getItem('sb_quiz_history') || '[]').length > 0;

  if (quizState.quizFinished) {
    const score = quizState.answers.filter((ans, idx) => ans === quizState.questions[idx].correctIndex).length;
    const percentage = Math.round((score / quizState.questions.length) * 100);

    return (
      <div className="max-w-3xl mx-auto py-12 animate-fade-in space-y-8">
        {showXP && <XPToast message={`+${lastXP} XP`} onComplete={() => setShowXP(false)} />}

        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Trophy size={64} />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-2 -right-2 bg-success text-white px-4 py-1 rounded-full font-black text-sm shadow-xl"
            >
              +{lastXP} XP
            </motion.div>
          </div>

          <div>
            <h1 className="text-4xl font-black mb-2">Quiz Complete!</h1>
            <p className="text-text-muted">You've mastered some serious concepts today.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <Card className="p-6 border-white/5 bg-surface-2">
              <p className="text-5xl font-black text-primary">{score}/{quizState.questions.length}</p>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mt-2">Correct</p>
            </Card>
            <Card className="p-6 border-white/5 bg-surface-2">
              <p className="text-5xl font-black text-success">{percentage}%</p>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mt-2">Accuracy</p>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-text-muted px-2">Question Breakdown</h3>
          <div className="space-y-2">
            {quizState.questions.map((q, idx) => {
              const isCorrect = quizState.answers[idx] === q.correctIndex;
              return (
                <div key={idx} className="p-4 rounded-2xl bg-surface border border-white/5 flex items-start gap-4">
                  <div className={`mt-1 shrink-0 ${isCorrect ? 'text-success' : 'text-error'}`}>
                    {isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white mb-1">{q.question}</p>
                    <p className="text-xs text-text-muted leading-relaxed italic">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t border-white/5">
          <Button onClick={() => handleStartQuiz({ preventDefault: () => {} } as any)} variant="outline" className="gap-2 py-6 px-8 rounded-2xl border-white/10">
            <RefreshCcw size={18} /> Retake Quiz
          </Button>
          <Button
            onClick={() => navigate(ROUTES.STUDY, { state: { topic: quizState.topic } })}
            className="gap-2 py-6 px-8 rounded-2xl shadow-xl shadow-primary/20"
          >
            <Brain size={18} /> Study This Topic
          </Button>
        </div>
      </div>
    );
  }

  if (quizState.quizStarted && quizState.questions.length > 0) {
    const current = quizState.questions[quizState.currentIndex];

    return (
      <div className="max-w-3xl mx-auto animate-fade-in space-y-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-surface border border-white/5 flex items-center justify-center font-bold text-primary">
              {quizState.currentIndex + 1}/{quizState.questions.length}
            </div>
            <div>
              <h2 className="font-bold text-sm">Testing: {quizState.topic}</h2>
              <div className="w-48 h-1.5 bg-white/5 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${((quizState.currentIndex + 1) / quizState.questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 py-1.5 px-3">
            <Zap size={12} className="mr-1.5 fill-amber-500" /> Mastery Quiz
          </Badge>
        </header>

        <div className="relative">
          <QuizCard
            question={current.question}
            options={current.options}
            correctIndex={current.correctIndex}
            explanation={current.explanation}
            selectedOption={selectedOption}
            onSelect={handleOptionSelect}
          />

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex justify-end"
              >
                <Button onClick={handleNext} className="gap-2 shadow-lg shadow-primary/20">
                  {quizState.currentIndex === quizState.questions.length - 1 ? 'Finish Quiz' : 'Next Question'} <ArrowRight size={18} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-12 py-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 text-xs font-black uppercase tracking-widest border border-amber-500/20 mb-4">
          <Zap size={14} className="fill-amber-500" /> New Challenge
        </div>
        <h1 className="text-5xl font-black tracking-tight">Sharpen your edge.</h1>
        <p className="text-text-muted text-lg max-w-xl mx-auto">
          Choose a topic and let Byte generate a customized quiz to test your mastery levels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <Card className="p-8 border-white/5 glass-card order-2 md:order-1">
          <form onSubmit={handleStartQuiz} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Topic to Master</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Redux state management, Binary trees..."
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                disabled={loading || !state.apiKey}
              />
            </div>

            <TopicSelector
              selectedTopic={subject}
              onSelect={setSubject}
            />

            <Button
              type="submit"
              className="w-full py-6 text-base font-black shadow-xl shadow-primary/20"
              disabled={loading || !topic.trim() || !state.apiKey}
            >
              {loading ? (
                <>
                  <Spinner size={16} className="mr-2" /> Byte is generating...
                </>
              ) : (
                <>
                  Generate Mastery Quiz <Sparkles size={18} className="ml-2" />
                </>
              )}
            </Button>
          </form>
        </Card>

        <div className="order-1 md:order-2 space-y-6">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/2 border border-white/5">
            <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0">
              <BrainCircuit size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm mb-1">AI-Powered Questions</h4>
              <p className="text-xs text-text-muted leading-relaxed">Byte analyzes your requested topic to create unique, challenging questions every time.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/2 border border-white/5">
            <div className="bg-success/10 p-3 rounded-xl text-success shrink-0">
              <Trophy size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm mb-1">Earn Mastery XP</h4>
              <p className="text-xs text-text-muted leading-relaxed">Level up your profile as you correctly answer questions and prove your knowledge.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/2 border border-white/5">
            <div className="bg-amber-500/10 p-3 rounded-xl text-amber-500 shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm mb-1">Detailed Explanations</h4>
              <p className="text-xs text-text-muted leading-relaxed">Get instant feedback and deep-dives into why an answer is correct or incorrect.</p>
            </div>
          </div>
        </div>
      </div>

      {!hasHistory && !quizState.quizStarted && (
        <div className="pt-12 border-t border-white/5">
          <EmptyState
            icon={Brain}
            title="No quizzes yet"
            description="Test your knowledge and earn XP — pick a topic to begin."
            actionLabel="Take Your First Quiz"
            actionPath={ROUTES.QUIZ}
          />
        </div>
      )}
    </div>
  );
};

export default QuizPage;
