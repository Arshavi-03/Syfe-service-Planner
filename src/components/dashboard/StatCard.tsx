import React, { useState, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: LucideIcon;
  subtitle?: string;
  className?: string;
  variant?: 'default' | 'colored';
  colorScheme?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  gradient?: string; // For backward compatibility
  clickable?: boolean;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  subtitle,
  className,
  variant = 'default',
  colorScheme = 'blue',
  gradient,
  clickable = true,
  onClick
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme detection using the same method as your ThemeProvider
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    if (clickable) {
      setIsClicked(!isClicked);
    }
    onClick?.();
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase': 
        return 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-600 font-semibold';
      case 'decrease': 
        return 'text-red-800 dark:text-red-300 bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-600 font-semibold';
      default: 
        return 'text-slate-800 dark:text-gray-300 bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-600 font-semibold';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase': return '↗';
      case 'decrease': return '↘';
      default: return '→';
    }
  };

  const getColorSchemeStyles = () => {
    const schemes = {
      blue: {
        gradient: 'from-blue-500 to-blue-600',
        clickedGradient: 'from-blue-600 to-blue-700'
      },
      green: {
        gradient: 'from-emerald-500 to-emerald-600',
        clickedGradient: 'from-emerald-600 to-emerald-700'
      },
      purple: {
        gradient: 'from-purple-500 to-purple-600',
        clickedGradient: 'from-purple-600 to-purple-700'
      },
      orange: {
        gradient: 'from-orange-500 to-orange-600',
        clickedGradient: 'from-orange-600 to-orange-700'
      },
      red: {
        gradient: 'from-red-500 to-red-600',
        clickedGradient: 'from-red-600 to-red-700'
      }
    };
    return schemes[colorScheme];
  };

  const colorStyles = getColorSchemeStyles();

  // Show colored variant if: variant='colored' OR in light mode (default behavior)
  // In dark mode, only show colored if explicitly set to 'colored'
  const shouldShowColored = variant === 'colored' || !isDarkMode;

  if (shouldShowColored) {
    return (
      <div 
        className={cn(
          'relative overflow-hidden rounded-xl p-6 text-white cursor-pointer group',
          'transition-all duration-300 ease-out',
          'hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]',
          'active:scale-[0.98] active:translate-y-0',
          `bg-gradient-to-br ${isClicked && !isDarkMode ? colorStyles.clickedGradient : colorStyles.gradient}`,
          gradient || '', // Backward compatibility with your existing gradient prop
          className
        )}
        onClick={handleClick}
      >
        {/* Clean background pattern */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12 group-hover:scale-110 transition-transform duration-500" />
        
        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
        
        {/* Click indicator for light mode */}
        {clickable && !isDarkMode && isClicked && (
          <div className="absolute top-4 right-4 w-2 h-2 bg-white/60 rounded-full animate-pulse" />
        )}
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            {Icon && (
              <div className="p-3 bg-white/15 rounded-lg backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                <Icon className="w-6 h-6" />
              </div>
            )}
            {change && (
              <div className="flex items-center gap-1.5 text-sm font-medium bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
                <span className="text-base">{getChangeIcon()}</span>
                <span>{change}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <p className="text-white/80 text-sm font-medium uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-white/70 text-sm">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-xl p-6 border-0 cursor-pointer group',
        'transition-all duration-300 ease-out',
        'hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.01]',
        'active:scale-[0.99] active:translate-y-0',
        'shadow-sm',
        // Using CSS variables like your original code
        'bg-[var(--card)]',
        clickable && !isDarkMode && 'hover:bg-[var(--accent)]',
        className
      )}
      onClick={handleClick}
      style={{
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px var(--border)'
      }}
    >
      {/* Clean background effect using CSS variables */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, var(--accent) 0%, transparent 100%)'
        }}
      />
      
      {/* Subtle shine effect */}
      <div 
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--accent), transparent)'
        }}
      />
      
      {/* Click indicator for light mode */}
      {clickable && !isDarkMode && (
        <div 
          className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-300"
          style={{ backgroundColor: 'var(--muted-foreground)' }}
        />
      )}
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          {Icon && (
            <div 
              className="p-3 rounded-lg border group-hover:scale-105 transition-transform duration-300"
              style={{ 
                backgroundColor: 'var(--accent)', 
                borderColor: 'var(--border)',
                color: 'var(--primary)'
              }}
            >
              <Icon className="w-6 h-6" />
            </div>
          )}
          {change && (
            <div className={cn(
              'flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg',
              getChangeColor()
            )}>
              <span className="text-base">{getChangeIcon()}</span>
              <span>{change}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p 
            className="text-sm font-medium uppercase tracking-wide"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {title}
          </p>
          <p 
            className="text-3xl font-bold tracking-tight"
            style={{ color: 'var(--card-foreground)' }}
          >
            {value}
          </p>
          {subtitle && (
            <p 
              className="text-sm"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;