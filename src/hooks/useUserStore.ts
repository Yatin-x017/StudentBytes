import { useState, useEffect } from 'react';

export interface UserHistory {
  id: string;
  query: string;
  topic: string;
  timestamp: number;
}

export interface TopicProgress {
  id: string;
  name: string;
  completion: number; // 0-100
  mastery: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface UserStore {
  xp: number;
  level: string;
  history: UserHistory[];
  topics: TopicProgress[];
  completedQuestions: string[];
}

const INITIAL_TOPICS: TopicProgress[] = [
  { id: 'arrays', name: 'Arrays', completion: 0, mastery: 'Beginner' },
  { id: 'linked-lists', name: 'Linked Lists', completion: 0, mastery: 'Beginner' },
  { id: 'stacks-queues', name: 'Stacks & Queues', completion: 0, mastery: 'Beginner' },
  { id: 'trees', name: 'Trees', completion: 0, mastery: 'Beginner' },
  { id: 'graphs', name: 'Graphs', completion: 0, mastery: 'Beginner' },
  { id: 'recursion', name: 'Recursion', completion: 0, mastery: 'Beginner' },
  { id: 'dp', name: 'Dynamic Programming', completion: 0, mastery: 'Beginner' },
];

export const useUserStore = () => {
  const [store, setStore] = useState<UserStore>(() => {
    const saved = localStorage.getItem('sb_user_store');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      xp: 0,
      level: 'Beginner',
      history: [],
      topics: INITIAL_TOPICS,
      completedQuestions: [],
    };
  });

  useEffect(() => {
    localStorage.setItem('sb_user_store', JSON.stringify(store));
  }, [store]);

  const addXP = (amount: number) => {
    setStore(prev => {
      const newXP = prev.xp + amount;
      let newLevel = prev.level;
      if (newXP >= 150) newLevel = 'Advanced';
      else if (newXP >= 50) newLevel = 'Intermediate';
      else newLevel = 'Beginner';

      return { ...prev, xp: newXP, level: newLevel };
    });
  };

  const addToHistory = (query: string, topic: string) => {
    setStore(prev => ({
      ...prev,
      history: [
        { id: Math.random().toString(36).substr(2, 9), query, topic, timestamp: Date.now() },
        ...prev.history.slice(0, 19) // Keep last 20
      ]
    }));
  };

  const updateTopicProgress = (topicId: string, progressDelta: number) => {
    setStore(prev => ({
      ...prev,
      topics: prev.topics.map(t => {
        if (t.id === topicId) {
          const newCompletion = Math.min(100, t.completion + progressDelta);
          let newMastery = t.mastery;
          if (newCompletion >= 80) newMastery = 'Advanced';
          else if (newCompletion >= 40) newMastery = 'Intermediate';
          return { ...t, completion: newCompletion, mastery: newMastery };
        }
        return t;
      })
    }));
  };

  const markQuestionCompleted = (questionId: string) => {
    setStore(prev => ({
      ...prev,
      completedQuestions: [...prev.completedQuestions, questionId]
    }));
  };

  return {
    store,
    addXP,
    addToHistory,
    updateTopicProgress,
    markQuestionCompleted,
  };
};
