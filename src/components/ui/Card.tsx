import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'interactive' | 'selected';
  onClick?: () => void;
}

export function Card({ children, className, variant = 'default', onClick }: CardProps) {
  const variants = {
    default: 'bg-white/[0.03] border-white/10',
    interactive: 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20 cursor-pointer',
    selected: 'bg-amber-500/10 border-amber-500/30 ring-1 ring-amber-500/20'
  };
  
  return (
    <div
      className={cn(
        'rounded-2xl border p-4 transition-all duration-200',
        variants[variant],
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('mb-3', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-lg font-bold text-white', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('text-sm text-gray-400', className)}>
      {children}
    </p>
  );
}
