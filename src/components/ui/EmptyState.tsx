import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionPath?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionPath,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
      <div className="bg-surface-2 p-6 rounded-3xl mb-6 border border-border">
        <Icon size={48} className="text-text-muted" />
      </div>
      <h3 className="text-2xl font-black mb-2">{title}</h3>
      <p className="text-text-muted max-w-sm mb-8 leading-relaxed">
        {description}
      </p>
      {actionLabel && actionPath && (
        <Button onClick={() => navigate(actionPath)} className="px-8 py-4 rounded-2xl shadow-lg shadow-primary/20">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
