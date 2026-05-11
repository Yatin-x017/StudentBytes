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
  Brain,
  Plus,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { useAI } from '@/hooks/useAI';
import { useAuth } from '@/context/AuthContext';
import { useDatabase } from '@/hooks/useDatabase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
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
  code?: string | null;
}

interface QuizState {
  topic: string;
  questions: Question[];
  currentIndex: number;
  answers: number[];
  quizStarted: boolean;
  quizFinished: boolean;
}

const EMPTY_QUIZ_STATE: QuizState = {
  topic: '',
  questions: [],
  currentIndex: 0,
  answers: [],
  quizStarted: false,
  quizFinished: false,
};

const QuizPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { generateQuiz, loading } = useAI();
  const { user } = useAuth();
  const db = useDatabase(user?.id || '');
  const navigate = useNavigate();
  const location = useLocation();

  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [subject, setSubject] = useState(CS_SUBJECTS[0]);
  const [showXP, setShowXP] = useState(false);
  const [answeredCorrect, setAnsweredCorrect] = useState(0);
  const [lastXP, setLastXP] = useState(0);
  const [srCards, setSrCards] = useState<SRCard[]>([]);

  // Handle prefill from learning path / canvas
  useEffect(() => {
    const navState = location.state as { prefillTopic?: string; prefillDifficulty?: string } | null;
    if (navState?.prefillTopic) {
      setTopic(navState.prefillTopic);
      if (navState.prefillDifficulty) setDifficulty(navState.prefillDifficulty);
      window.history.replaceState({}, '');
    }
  }, []);

  // Persisted quiz state (survives navigation)
  const [quizState, setQuizState] = useState<QuizState>(() => {
    const saved = localStorage.getItem('sb_quiz_state');
    return saved ? JSON.parse(saved) : EMPTY_QUIZ_STATE;
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
  }, [user]);

  // ── Reset to the new quiz form ──────────────────────────────────────
  const handleNewQuiz = () => {
    setQuizState(EMPTY_QUIZ_STATE);
    localStorage.removeItem('sb_quiz_state');
    setSelectedOption(null);
    setShowExplanation(false);
    setAnsweredCorrect(0);
    setTopic('');
  };

  // ── Start / generate quiz ───────────────────────────────────────────
  const handleStartQuiz = async (e?: React.FormEvent, overrideTopic?: string, overrideDifficulty?: string) => {
    e?.preventDefault();
    const useTopic = overrideTopic ?? topic;
    const useDifficulty = overrideDifficulty ?? difficulty;
    if (!useTopic.trim()) return;

    const result = await generateQuiz(useTopic, useDifficulty);
    if (result && Array.isArray(result) && result.length > 0) {
      setQuizState({
        topic: useTopic,
        questions: result,
        quizStarted: true,
        currentIndex: 0,
        answers: [],
        quizFinished: false,
      });
      setSelectedOption(null);
      setShowExplanation(false);
      setAnsweredCorrect(0);
    }
  };

  // ── Answer handling ─────────────────────────────────────────────────
  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setShowExplanation(true);
  };

  const handleNext = () => {
    const newAnswers = [...quizState.answers, selectedOption as number];
    const isCorrect = selectedOption === quizState.questions[quizState.currentIndex].correctIndex;
    const newCorrect = isCorrect ? answeredCorrect + 1 : answeredCorrect;
    setAnsweredCorrect(newCorrect);

    if (quizState.currentIndex < quizState.questions.length - 1) {
      setQuizState({ ...quizState, answers: newAnswers, currentIndex: quizState.currentIndex + 1 });
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // Quiz finished
      const score = newAnswers.filter((ans, idx) => ans === quizState.questions[idx].correctIndex).length;
      const xpGained = score * 50;
      const newXp = state.user.xp + xpGained;

      dispatch({
        type: 'UPDATE_USER',
        payload: { xp: newXp, level: Math.floor(newXp / 1000) + 1 },
      });

      if (user?.id) {
        db.insertQuizResult(quizState.topic, score, quizState.questions.length, xpGained).catch(console.error);
        db.upsertSettings({ xp: newXp, level: Math.floor(newXp / 1000) + 1 }).catch(console.error);
      }

      // Spaced repetition update
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
      if (user?.id) db.upsertSRCard(updatedCard).catch(console.error);

      setLastXP(xpGained);
      setShowXP(true);
      setQuizState({ ...quizState, answers: newAnswers, quizFinished: true });
    }
  };

  // ════════════════════════════════════════════════════════════
  // SCORE SCREEN
  // ════════════════════════════════════════════════════════════
  if (quizState.quizFinished) {
    const score = quizState.answers.filter(
      (ans, idx) => ans === quizState.questions[idx].correctIndex
    ).length;
    const percentage = Math.round((score / quizState.questions.length) * 100);
    const suggestedDifficulty =
      percentage >= 80 ? 'advanced' : percentage >= 50 ? 'intermediate' : 'beginner';

    return (
      <div className="max-w-3xl mx-auto py-12 animate-fade-in space-y-8">
        {showXP && <XPToast message={`+${lastXP} XP`} onComplete={() => setShowXP(false)} />}

        {/* Trophy header */}
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
            <p className="text-text-muted">Topic: <span className="font-bold text-text">{quizState.topic}</span></p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Card className="p-6">
              <p className="text-5xl font-black text-primary">{score}/{quizState.questions.length}</p>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mt-2">Correct</p>
            </Card>
            <Card className="p-6">
              <p className="text-5xl font-black text-success">{percentage}%</p>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mt-2">Accuracy</p>
            </Card>
            <Card className="p-6 flex flex-col items-center justify-center gap-3">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Suggested Next</p>
              <span className={`font-black capitalize text-xl ${
                suggestedDifficulty === 'advanced' ? 'text-error' :
                suggestedDifficulty === 'intermediate' ? 'text-primary' : 'text-success'
              }`}>
                {suggestedDifficulty}
              </span>
              <button
                onClick={() => handleStartQuiz(undefined, quizState.topic, suggestedDifficulty)}
                disabled={loading}
                className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Try it →'}
              </button>
            </Card>
          </div>
        </div>

        {/* Question breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-text-muted px-2">
            Question Breakdown
          </h3>
          <div className="space-y-2">
            {quizState.questions.map((q, idx) => {
              const isCorrect = quizState.answers[idx] === q.correctIndex;
              return (
                <div key={idx} className="p-4 rounded-2xl bg-surface-2 border border-border flex items-start gap-4">
                  <div className={`mt-1 shrink-0 ${isCorrect ? 'text-success' : 'text-error'}`}>
                    {isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text mb-1">{q.question}</p>
                    <p className="text-xs text-text-muted leading-relaxed italic">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-border">
          {/* ✅ NEW: Take Another Quiz — resets everything */}
          <Button
            onClick={handleNewQuiz}
            variant="outline"
            className="gap-2 py-5 px-6 rounded-2xl"
          >
            <Plus size={18} /> New Topic
          </Button>

          {/* Retake same quiz */}
          <Button
            onClick={() => handleStartQuiz(undefined, quizState.topic, difficulty)}
            variant="outline"
            className="gap-2 py-5 px-6 rounded-2xl"
            disabled={loading}
          >
            {loading ? <Spinner size={16} /> : <RefreshCcw size={18} />}
            Retake Quiz
          </Button>

          {/* Study this topic */}
          <Button
            onClick={() => navigate(ROUTES.STUDY, { state: { topic: quizState.topic } })}
            className="gap-2 py-5 px-6 rounded-2xl shadow-xl shadow-primary/20"
          >
            <Brain size={18} /> Study Topic
          </Button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // QUIZ IN PROGRESS
  // ════════════════════════════════════════════════════════════
  if (quizState.quizStarted && quizState.questions.length > 0) {
    const current = quizState.questions[quizState.currentIndex];

    return (
      <div className="max-w-3xl mx-auto animate-fade-in space-y-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center font-bold text-primary">
              {quizState.currentIndex + 1}/{quizState.questions.length}
            </div>
            <div>
              <h2 className="font-bold text-sm">Testing: {quizState.topic}</h2>
              <div className="w-48 h-1.5 bg-surface-2 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${((quizState.currentIndex + 1) / quizState.questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 py-1.5 px-3">
              <Zap size={12} className="mr-1.5 fill-amber-500" /> Mastery Quiz
            </Badge>
            {/* Abandon quiz → go back to form */}
            <button
              onClick={handleNewQuiz}
              className="text-[10px] font-bold text-text-faint hover:text-error transition-colors uppercase tracking-widest"
              title="Start a new quiz"
            >
              Quit
            </button>
          </div>
        </header>

        <div className="relative">
          <QuizCard
            question={current.question}
            options={current.options}
            correctIndex={current.correctIndex}
            explanation={current.explanation}
            code={current.code}
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
                  {quizState.currentIndex === quizState.questions.length - 1
                    ? 'Finish Quiz'
                    : 'Next Question'}
                  <ArrowRight size={18} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // QUIZ START FORM
  // ════════════════════════════════════════════════════════════
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
        <Card className="p-8 order-2 md:order-1">
          <form onSubmit={handleStartQuiz} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest">
                Topic to Master
              </label>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. Binary trees, Redux, Deadlock..."
                className="w-full bg-surface-2 border border-border rounded-xl p-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest">
                Difficulty
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['beginner', 'intermediate', 'advanced'].map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      difficulty === lvl
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-surface-2 border-border text-text-muted hover:border-primary/30'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <TopicSelector selectedTopic={subject} onSelect={setSubject} />

            <Button
              type="submit"
              className="w-full py-6 text-base font-black shadow-xl shadow-primary/20"
              disabled={loading || !topic.trim()}
            >
              {loading ? (
                <><Spinner size={16} className="mr-2" /> Byte is generating...</>
              ) : (
                <>Generate Mastery Quiz <Sparkles size={18} className="ml-2" /></>
              )}
            </Button>
          </form>
        </Card>

        <div className="order-1 md:order-2 space-y-6">
          {[
            {
              icon: BrainCircuit,
              color: 'bg-primary/10 text-primary',
              title: 'AI-Powered Questions',
              desc: 'Byte analyzes your topic to create unique, challenging questions every time.',
            },
            {
              icon: Trophy,
              color: 'bg-success/10 text-success',
              title: 'Earn Mastery XP',
              desc: 'Level up your profile as you correctly answer questions.',
            },
            {
              icon: Clock,
              color: 'bg-amber-500/10 text-amber-500',
              title: 'Detailed Explanations',
              desc: 'Get instant feedback and deep-dives into why each answer is correct.',
            },
          ].map(item => (
            <div key={item.title} className="flex items-start gap-4 p-4 rounded-2xl bg-surface-2 border border-border">
              <div className={`${item.color} p-3 rounded-xl shrink-0`}>
                <item.icon size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
