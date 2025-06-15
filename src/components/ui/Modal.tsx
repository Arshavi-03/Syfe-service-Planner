'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { X, Target } from 'lucide-react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
}) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const isDark = theme === 'dark';

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 transition-all duration-300 backdrop-blur-lg",
          isDark 
            ? "bg-black/70" 
            : "bg-black/50"
        )}
        onClick={handleOverlayClick}
        suppressHydrationWarning
      />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={cn(
            'relative w-full transform transition-all duration-300',
            'animate-modal-scale rounded-2xl overflow-hidden shadow-2xl',
            sizeClasses[size],
            className
          )}
          style={{
            background: isDark 
              ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            border: isDark 
              ? '1px solid rgba(71, 85, 105, 0.5)'
              : '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: isDark
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 20px rgba(59, 130, 246, 0.2)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 20px rgba(139, 92, 246, 0.15)'
          }}
          onClick={(e) => e.stopPropagation()}
          suppressHydrationWarning
        >
          {/* Header */}
          <div 
            className={cn(
              "relative flex items-center justify-between p-6 border-b",
              isDark 
                ? "bg-slate-800/80 border-slate-700" 
                : "bg-white/80 border-gray-200"
            )}
            suppressHydrationWarning
          >
            {title && (
              <div className="flex items-center space-x-3">
                {/* Icon */}
                <div 
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    isDark
                      ? "bg-blue-600/20 border border-blue-500/30"
                      : "bg-blue-100 border border-blue-200"
                  )}
                  suppressHydrationWarning
                >
                  <Target 
                    className={cn(
                      "w-5 h-5",
                      isDark ? "text-blue-400" : "text-blue-600"
                    )} 
                    suppressHydrationWarning
                  />
                </div>
                
                <div>
                  <h3 
                    className={cn(
                      "text-xl font-semibold",
                      isDark ? "text-white" : "text-gray-900"
                    )}
                    suppressHydrationWarning
                  >
                    {title}
                  </h3>
                  {/* Accent line */}
                  <div 
                    className="mt-1 h-0.5 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                  />
                </div>
              </div>
            )}
            
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className={cn(
                  "rounded-lg p-2 transition-all duration-200",
                  isDark
                    ? "hover:bg-slate-700 text-slate-400 hover:text-white"
                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
                )}
                suppressHydrationWarning
              >
                <X className="w-5 h-5" />
                <span className="sr-only">Close</span>
              </Button>
            )}
          </div>
          
          {/* Content with PROPER CONTRAST */}
          <div 
            className={cn(
              "p-6",
              isDark 
                ? "bg-slate-900" 
                : "bg-white"
            )}
            suppressHydrationWarning
          >
            {/* Content wrapper with excellent readability */}
            <div 
              className={cn(
                "space-y-6",
                // Ensure all text inside has proper contrast
                isDark 
                  ? "text-white [&_label]:text-gray-200 [&_p]:text-gray-300 [&_input]:text-gray-900 [&_select]:text-gray-900" 
                  : "text-gray-900 [&_label]:text-gray-700 [&_p]:text-gray-600 [&_input]:text-gray-900 [&_select]:text-gray-900"
              )}
              suppressHydrationWarning
            >
              {children}
            </div>
          </div>

          {/* Bottom accent */}
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-500" />
        </div>
      </div>

      {/* Simple, clean animations */}
      <style jsx global>{`
        @keyframes modal-scale {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-modal-scale {
          animation: modal-scale 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default Modal;