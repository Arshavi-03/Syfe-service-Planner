import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outline' | 'glass' | 'gradient' | 'neon';
  glow?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = 'default', glow = false, ...props }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-[var(--card)] border-0 shadow-lg hover:shadow-xl dark:shadow-gray-900/20',
      elevated: 'bg-white dark:bg-[var(--card)] border-0 shadow-xl hover:shadow-2xl dark:shadow-gray-900/30 transition-shadow duration-500',
      outline: 'bg-white/50 dark:bg-transparent border-2 border-gray-200 dark:border-[var(--border)] backdrop-blur-sm',
      glass: 'bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-[var(--border)]/50 backdrop-blur-md shadow-xl',
      gradient: 'bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-[var(--card)] dark:to-[var(--accent)] border-0 shadow-lg',
      neon: 'bg-white dark:bg-[var(--card)] border border-blue-200 dark:border-[var(--primary)] shadow-xl shadow-blue-500/10 dark:shadow-[var(--primary)]/20'
    };

    return (
      <div
        className={cn(
          'rounded-2xl transition-all duration-500 hover-lift relative overflow-hidden',
          'before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-50/20 before:via-purple-50/10 before:to-pink-50/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500',
          'dark:before:from-blue-900/10 dark:before:to-purple-900/10',
          variants[variant],
          glow && 'shadow-2xl shadow-blue-500/20 dark:shadow-[var(--primary)]/30',
          className
        )}
        ref={ref}
        {...props}
      >
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Header Component
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ className, children, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6 pb-4', className)} {...props}>
    {children}
  </div>
);

// Card Title Component
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const CardTitle: React.FC<CardTitleProps> = ({ className, children, size = 'md', ...props }) => {
  const sizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <h3 className={cn(
      'font-semibold leading-none tracking-tight text-[var(--card-foreground)]',
      sizes[size],
      className
    )} {...props}>
      {children}
    </h3>
  );
};

// Card Description Component
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ className, children, ...props }) => (
  <p className={cn('text-sm text-[var(--muted-foreground)]', className)} {...props}>
    {children}
  </p>
);

// Card Content Component
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ className, children, ...props }) => (
  <div className={cn('p-6 pt-0', className)} {...props}>
    {children}
  </div>
);

// Card Footer Component
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ className, children, ...props }) => (
  <div className={cn('flex items-center p-6 pt-0', className)} {...props}>
    {children}
  </div>
);

export default Card;