import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface QuizCardProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  selectedOption: number | null;
  onSelect: (index: number) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  options,
  correctIndex,
  explanation,
  selectedOption,
  onSelect,
}) => {
  const isAnswered = selectedOption !== null;

  return (
    <Card className="p-8 space-y-8 animate-fade-in border-white/5">
      <h3 className="text-xl font-bold leading-tight">{question}</h3>

      <div className="grid grid-cols-1 gap-3">
        {options.map((option, idx) => {
          const isCorrect = idx === correctIndex;
          const isSelected = idx === selectedOption;

          let buttonClass = 'border-white/5 hover:border-primary/40 hover:bg-surface-2';
          if (isAnswered) {
            if (isCorrect) buttonClass = 'border-success bg-success/10 text-success';
            else if (isSelected) buttonClass = 'border-error bg-error/10 text-error';
            else buttonClass = 'opacity-50 grayscale border-white/5';
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => onSelect(idx)}
              className={cn(
                'flex items-center justify-between p-4 rounded-xl border text-left transition-all font-medium focus-ring',
                buttonClass
              )}
            >
              <span>{option}</span>
              {isAnswered && isCorrect && <Check size={18} />}
              {isAnswered && isSelected && !isCorrect && <X size={18} />}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="pt-6 border-t border-white/5 animate-fade-in">
          <Badge variant={selectedOption === correctIndex ? 'success' : 'error'} className="mb-3">
            {selectedOption === correctIndex ? 'Correct!' : 'Incorrect'}
          </Badge>
          <p className="text-sm text-text-muted leading-relaxed">
            <span className="font-bold text-text">Explanation:</span> {explanation}
          </p>
        </div>
      )}
    </Card>
  );
};
