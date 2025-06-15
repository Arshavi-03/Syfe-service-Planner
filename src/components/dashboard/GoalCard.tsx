'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Calendar, TrendingUp, Coins, Trophy, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { Goal, Currency } from '@/lib/types';
import { formatCurrency, formatCompactCurrency, calculateProgress, convertCurrency, formatDate, cn } from '@/lib/utils';

interface GoalCardProps {
  goal: Goal;
  exchangeRates?: { INR: number; USD: number };
  onAddContribution: (goalId: string) => void;
  onDeleteGoal: (goalId: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  exchangeRates = { INR: 83, USD: 1 },
  onAddContribution,
  onDeleteGoal,
}) => {
  const [showContributions, setShowContributions] = useState(false);
  
  const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
  const isCompleted = progress >= 100;
  
  // Convert to the other currency for display
  const otherCurrency: Currency = goal.currency === 'INR' ? 'USD' : 'INR';
  const convertedTarget = convertCurrency(goal.targetAmount, goal.currency, otherCurrency, exchangeRates);
  const convertedCurrent = convertCurrency(goal.currentAmount, goal.currency, otherCurrency, exchangeRates);
  
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
  const lastContribution = goal.contributions[goal.contributions.length - 1];
  const contributionsWithNotes = goal.contributions?.filter(c => c.note && c.note.trim()) || [];

  // COMPLETELY REMOVE ANY CONFIRM() CALLS - JUST CALL PARENT HANDLER
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // NO CONFIRM() - JUST TRIGGER PARENT'S CUSTOM MODAL
    onDeleteGoal(goal.id);
  };

  return (
    <Card 
      className={cn(
        'relative overflow-hidden transition-all duration-300 hover:shadow-lg group',
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        'hover:scale-[1.02] hover:-translate-y-1',
        isCompleted && 'ring-2 ring-green-500/20 dark:ring-green-400/30'
      )}
    >
      {/* Completion Badge */}
      {isCompleted && (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-600 px-2 py-1 rounded-lg">
            <Trophy className="w-3 h-3 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-700 dark:text-green-300">Complete</span>
          </div>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-3">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {goal.name}
            </CardTitle>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Coins className="w-3 h-3" />
              <span>Created {formatDate(goal.createdAt)}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteClick}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-gray-400 hover:text-red-500 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-4">
        {/* Target and Current Amounts */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800/30">
            <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Target</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCompactCurrency(goal.targetAmount, goal.currency)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              ≈ {formatCompactCurrency(convertedTarget, otherCurrency)}
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 border border-green-200 dark:border-green-800/30">
            <div className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Saved</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCompactCurrency(goal.currentAmount, goal.currency)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              ≈ {formatCompactCurrency(convertedCurrent, otherCurrency)}
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Progress</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{progress.toFixed(1)}%</span>
            </div>
          </div>
          <ProgressBar 
            value={progress} 
            variant={isCompleted ? "success" : progress >= 75 ? "gradient" : "default"}
            showLabel={false}
            size="md"
          />
        </div>

        {/* Remaining Amount */}
        {!isCompleted && (
          <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800/30">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Remaining</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCompactCurrency(remaining, goal.currency)}
              </span>
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">Contributions</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {goal.contributions?.length || 0}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">Last Update</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {lastContribution ? formatDate(lastContribution.date) : 'Never'}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">Status</div>
            <div className={cn(
              "text-sm font-semibold",
              isCompleted ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"
            )}>
              {isCompleted ? 'Complete' : 'Active'}
            </div>
          </div>
        </div>

        {/* Last Contribution */}
        {lastContribution && (
          <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-xs">
            <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">
              Last: <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(lastContribution.amount, goal.currency)}
              </span> on {formatDate(lastContribution.date)}
              {lastContribution.note && (
                <span className="block mt-1 text-gray-500 dark:text-gray-400 italic">
                  `{lastContribution.note}`
                </span>
              )}
            </span>
          </div>
        )}

        {/* Contribution Notes Section */}
        {contributionsWithNotes.length > 0 && (
          <div className="space-y-2">
            <button
              onClick={() => setShowContributions(!showContributions)}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors w-full"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contribution Notes ({contributionsWithNotes.length})</span>
              {showContributions ? (
                <ChevronUp className="w-4 h-4 ml-auto" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-auto" />
              )}
            </button>

            {showContributions && (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {contributionsWithNotes.slice(-3).reverse().map((contribution, index) => (
                  <div
                    key={contribution.id || index}
                    className="p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/30 rounded-lg"
                  >
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                        {formatCurrency(contribution.amount, goal.currency)}
                      </span>
                      <span className="text-xs text-purple-600 dark:text-purple-400">
                        {formatDate(contribution.date)}
                      </span>
                    </div>
                    <p className="text-xs text-purple-600 dark:text-purple-300 italic leading-relaxed">
                      `{contribution.note}`
                    </p>
                  </div>
                ))}
                
                {contributionsWithNotes.length > 3 && (
                  <div className="text-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Showing latest 3 of {contributionsWithNotes.length} notes
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          onClick={() => onAddContribution(goal.id)}
          className={cn(
            "w-full transition-all duration-200",
            isCompleted 
              ? "bg-green-600 hover:bg-green-700 text-white" 
              : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
          )}
          disabled={isCompleted}
          icon={isCompleted ? <Trophy className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        >
          {isCompleted ? 'Goal Achieved! 🎉' : 'Add Contribution'}
        </Button>
      </CardFooter>

      {/* Bottom accent line */}
      <div className={cn(
        "absolute bottom-0 left-0 w-full h-1 transition-opacity duration-300",
        isCompleted 
          ? "bg-gradient-to-r from-green-400 to-emerald-500" 
          : "bg-gradient-to-r from-blue-400 to-purple-500 opacity-30 group-hover:opacity-60"
      )} />
    </Card>
  );
};

export default GoalCard;