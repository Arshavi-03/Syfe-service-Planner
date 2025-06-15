'use client';

import React, { useEffect, useState } from 'react';
import { X, Trash2, AlertTriangle, Target } from 'lucide-react';
import { Goal } from '@/lib/types';
import { formatCompactCurrency, cn } from '@/lib/utils';

interface DeleteGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  goal: Goal | null;
  isDeleting?: boolean;
}

const DeleteGoalModal: React.FC<DeleteGoalModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  goal,
  isDeleting = false
}) => {
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

  if (!mounted || !isOpen || !goal) return null;

  const progress = ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className={cn(
            "relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl",
            "border border-gray-200 dark:border-gray-700",
            "max-w-md w-full mx-auto transform transition-all duration-300",
            "animate-in fade-in-0 zoom-in-95"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient background */}
          <div className="relative overflow-hidden rounded-t-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/5 to-red-600/10" />
            <div className="relative p-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500 rounded-xl blur-sm opacity-20" />
                    <div className="relative w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Delete Goal
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  disabled={isDeleting}
                  aria-label="Close delete goal dialog"
                  className={cn(
                    "p-2 rounded-xl transition-all duration-200",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200",
                    isDeleting && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Goal Details Section */}
          <div className="px-6 py-4">
            <div className={cn(
              "p-4 rounded-xl border-2 border-dashed transition-all duration-300",
              "border-red-200 dark:border-red-800/30 bg-red-50/50 dark:bg-red-950/20"
            )}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
                    {goal.name}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <div className="text-gray-500 dark:text-gray-400">Target</div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {formatCompactCurrency(goal.targetAmount, goal.currency)}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-gray-500 dark:text-gray-400">Saved</div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {formatCompactCurrency(goal.currentAmount, goal.currency)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-red-400 to-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(parseFloat(progress), 100)}%` }}
                      />
                    </div>
                  </div>

                  {goal.contributions && goal.contributions.length > 0 && (
                    <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800/30 rounded-lg">
                      <div className="text-xs text-yellow-700 dark:text-yellow-300">
                        ⚠️ This goal has <span className="font-semibold">{goal.contributions.length}</span> contribution{goal.contributions.length !== 1 ? 's' : ''} that will be permanently lost.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="px-6 py-2">
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">
                <span className="font-semibold">Warning:</span> Deleting this goal will permanently remove all associated data including contributions, notes, and progress history.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 pt-4">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className={cn(
                  "flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                  "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
                  "hover:bg-gray-200 dark:hover:bg-gray-700",
                  "border border-gray-200 dark:border-gray-600",
                  "transform hover:scale-[1.02] active:scale-[0.98]",
                  isDeleting && "opacity-50 cursor-not-allowed"
                )}
              >
                Cancel
              </button>
              
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className={cn(
                  "flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                  "bg-gradient-to-r from-red-500 to-red-600 text-white",
                  "hover:from-red-600 hover:to-red-700",
                  "shadow-lg hover:shadow-xl",
                  "transform hover:scale-[1.02] active:scale-[0.98]",
                  "flex items-center justify-center gap-2",
                  isDeleting && "opacity-75 cursor-not-allowed"
                )}
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Goal</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteGoalModal;