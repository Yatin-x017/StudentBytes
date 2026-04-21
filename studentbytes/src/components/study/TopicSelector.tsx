import React from 'react';
import { CS_SUBJECTS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { BookOpen } from 'lucide-react';

interface TopicSelectorProps {
  selectedTopic: string;
  onSelect: (topic: string) => void;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({ selectedTopic, onSelect }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Subjects</h3>
      </div>
      <div className="flex flex-col gap-1">
        {CS_SUBJECTS.map((subject) => (
          <button
            key={subject}
            onClick={() => onSelect(subject)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all focus-ring",
              selectedTopic === subject
                ? "bg-primary/10 text-primary"
                : "text-text-muted hover:text-text hover:bg-white/5"
            )}
          >
            <BookOpen size={16} />
            {subject}
          </button>
        ))}
      </div>
    </div>
  );
};
