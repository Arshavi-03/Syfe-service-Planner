'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Plus, Calendar, DollarSign, MessageCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Goal } from '@/lib/types';

interface AddContributionFormProps {
  goal: Goal;
  onSubmit: (amount: number, date: Date, note?: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

const AddContributionForm: React.FC<AddContributionFormProps> = ({
  goal,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });
  
  const [errors, setErrors] = useState<{
    amount?: string;
    date?: string;
  }>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto"></div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-48 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-20 bg-gray-200 rounded-xl"></div>
          <div className="h-16 bg-gray-200 rounded-xl"></div>
          <div className="h-16 bg-gray-200 rounded-xl"></div>
          <div className="h-16 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-11 bg-gray-200 rounded flex-1"></div>
          <div className="h-11 bg-gray-200 rounded flex-1"></div>
        </div>
      </div>
    );
  }

  const isDark = theme === 'dark';

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount) || amount < 1) {
      newErrors.amount = 'Please enter a valid amount of at least 1';
    } else if (amount > 10000000) {
      newErrors.amount = 'Amount is too large (max: 10,000,000)';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      if (selectedDate > today) {
        newErrors.date = 'Date cannot be in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const amount = parseFloat(formData.amount);
    const date = new Date(formData.date);
    const note = formData.note.trim() || undefined;
    
    onSubmit(amount, date, note);
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currency === 'USD' ? '$' : '₹';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const calculateProgress = (current: number, target: number) => {
    if (target <= 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const contributionAmount = parseFloat(formData.amount) || 0;
  const newTotal = goal.currentAmount + contributionAmount;
  const newProgress = calculateProgress(newTotal, goal.targetAmount);
  const remaining = Math.max(goal.targetAmount - newTotal, 0);
  const currentProgress = calculateProgress(goal.currentAmount, goal.targetAmount);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div 
          className={cn(
            "w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg",
            isDark
              ? "bg-gradient-to-br from-green-600 to-emerald-600"
              : "bg-gradient-to-br from-green-500 to-emerald-600"
          )}
          suppressHydrationWarning
        >
          <Plus className="w-8 h-8 text-white" />
        </div>
        
        <div className="space-y-2">
          <h2 
            className={cn(
              "text-2xl font-bold",
              isDark ? "text-white" : "text-gray-900"
            )}
            suppressHydrationWarning
          >
            Add Contribution
          </h2>
          <p 
            className={cn(
              "text-sm",
              isDark ? "text-gray-300" : "text-gray-600"
            )}
            suppressHydrationWarning
          >
            Contributing to: <span className="font-semibold">{goal.name}</span>
          </p>
        </div>
      </div>

      {/* Current Goal Progress */}
      <div 
        className={cn(
          "rounded-xl p-4 border",
          isDark 
            ? "bg-slate-800/50 border-blue-700/30" 
            : "bg-blue-50 border-blue-200"
        )}
        suppressHydrationWarning
      >
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span 
              className={cn(
                "text-sm font-medium",
                isDark ? "text-blue-300" : "text-blue-700"
              )}
              suppressHydrationWarning
            >
              Current Progress
            </span>
            <span 
              className={cn(
                "font-bold",
                isDark ? "text-blue-200" : "text-blue-900"
              )}
              suppressHydrationWarning
            >
              {formatCurrency(goal.currentAmount, goal.currency)} / {formatCurrency(goal.targetAmount, goal.currency)}
            </span>
          </div>
          
          <div 
            className={cn(
              "w-full rounded-full h-3 shadow-inner",
              isDark ? "bg-slate-700" : "bg-blue-200"
            )}
            suppressHydrationWarning
          >
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(currentProgress, 100)}%` }}
            />
          </div>
          
          <p 
            className={cn(
              "text-xs font-medium",
              isDark ? "text-blue-400" : "text-blue-600"
            )}
            suppressHydrationWarning
          >
            {currentProgress.toFixed(1)}% completed
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-5">
        {/* Contribution Amount */}
        <div className="space-y-2">
          <label 
            htmlFor="amount" 
            className={cn(
              "block text-sm font-semibold",
              isDark ? "text-gray-200" : "text-gray-700"
            )}
            suppressHydrationWarning
          >
            Contribution Amount
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
            <input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder="Enter amount (e.g., 1000, 5000)"
              min="1"
              step="1"
              className={cn(
                "w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-green-500/20",
                "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                errors.amount
                  ? "border-red-400 focus:border-red-500 bg-white text-gray-900 placeholder:text-gray-500"
                  : isDark
                    ? "bg-white border-slate-600 text-gray-900 placeholder:text-gray-500 focus:border-green-500 hover:border-slate-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 hover:border-gray-400"
              )}
              autoFocus
              suppressHydrationWarning
            />
          </div>
          {errors.amount && (
            <p className="text-red-500 text-xs font-medium">{errors.amount}</p>
          )}
          {contributionAmount > 0 && (
            <p 
              className={cn(
                "text-xs",
                isDark ? "text-green-400" : "text-green-600"
              )}
              suppressHydrationWarning
            >
              Adding {formatCurrency(contributionAmount, goal.currency)}
            </p>
          )}
        </div>

        {/* Date - PROPERLY FIXED CALENDAR ICON */}
        <div className="space-y-2">
          <label 
            htmlFor="date" 
            className={cn(
              "block text-sm font-semibold",
              isDark ? "text-gray-200" : "text-gray-700"
            )}
            suppressHydrationWarning
          >
            Contribution Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-800 z-20 pointer-events-none" />
            <input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className={cn(
                "w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-green-500/20",
                "[&::-webkit-calendar-picker-indicator]:opacity-0",
                "[&::-webkit-calendar-picker-indicator]:absolute",
                "[&::-webkit-calendar-picker-indicator]:right-3",
                "[&::-webkit-calendar-picker-indicator]:w-5",
                "[&::-webkit-calendar-picker-indicator]:h-5",
                "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
                errors.date
                  ? "border-red-400 focus:border-red-500 bg-white text-gray-900"
                  : isDark
                    ? "bg-white border-slate-600 text-gray-900 focus:border-green-500 hover:border-slate-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-green-500 hover:border-gray-400"
              )}
              suppressHydrationWarning
            />
            {/* Right side calendar indicator */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.date && (
            <p className="text-red-500 text-xs font-medium">{errors.date}</p>
          )}
          <p 
            className={cn(
              "text-xs",
              isDark ? "text-gray-400" : "text-gray-500"
            )}
            suppressHydrationWarning
          >
            When did you make this contribution?
          </p>
        </div>

        {/* Optional Note */}
        <div className="space-y-2">
          <label 
            htmlFor="note" 
            className={cn(
              "block text-sm font-semibold",
              isDark ? "text-gray-200" : "text-gray-700"
            )}
            suppressHydrationWarning
          >
            Note (Optional)
          </label>
          <div className="relative">
            <MessageCircle className="absolute left-3 top-3 w-5 h-5 text-gray-600" />
            <textarea
              id="note"
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
              placeholder="e.g., Monthly savings, bonus money, gift"
              rows={3}
              maxLength={100}
              className={cn(
                "w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-200 resize-none",
                "focus:outline-none focus:ring-2 focus:ring-green-500/20",
                isDark
                  ? "bg-white border-slate-600 text-gray-900 placeholder:text-gray-500 focus:border-green-500 hover:border-slate-500"
                  : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 hover:border-gray-400"
              )}
              suppressHydrationWarning
            />
          </div>
          <p 
            className={cn(
              "text-xs",
              isDark ? "text-gray-400" : "text-gray-500"
            )}
            suppressHydrationWarning
          >
            Add a note to remember this contribution ({formData.note.length}/100)
          </p>
        </div>
      </div>

      {/* Preview After Contribution */}
      {contributionAmount > 0 && (
        <div 
          className={cn(
            "rounded-xl p-4 border",
            newTotal > goal.targetAmount
              ? isDark 
                ? "bg-amber-900/20 border-amber-700/30" 
                : "bg-amber-50 border-amber-200"
              : isDark 
                ? "bg-green-900/20 border-green-700/30" 
                : "bg-green-50 border-green-200"
          )}
          suppressHydrationWarning
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp 
              className={cn(
                "w-5 h-5",
                newTotal > goal.targetAmount
                  ? isDark ? "text-amber-400" : "text-amber-600"
                  : isDark ? "text-green-400" : "text-green-600"
              )}
              suppressHydrationWarning
            />
            <h3 
              className={cn(
                "font-semibold",
                newTotal > goal.targetAmount
                  ? isDark ? "text-amber-300" : "text-amber-800"
                  : isDark ? "text-green-300" : "text-green-800"
              )}
              suppressHydrationWarning
            >
              {newTotal > goal.targetAmount ? "Exceeding Target!" : "After This Contribution"}
            </h3>
          </div>
          
          {newTotal > goal.targetAmount && (
            <div 
              className={cn(
                "mb-3 p-3 rounded-lg border",
                isDark 
                  ? "bg-amber-800/30 border-amber-600/30 text-amber-200" 
                  : "bg-amber-100 border-amber-300 text-amber-800"
              )}
              suppressHydrationWarning
            >
              <p className="text-sm font-medium">
                💡 This contribution will exceed your target by {formatCurrency(newTotal - goal.targetAmount, goal.currency)}. 
                You&apos;ll have extra savings - that&apos;s great! 🎉
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span 
                className={cn(
                  newTotal > goal.targetAmount
                    ? isDark ? "text-amber-400" : "text-amber-700"
                    : isDark ? "text-green-400" : "text-green-700"
                )}
                suppressHydrationWarning
              >
                New Total
              </span>
              <span 
                className={cn(
                  "font-bold",
                  newTotal > goal.targetAmount
                    ? isDark ? "text-amber-300" : "text-amber-800"
                    : isDark ? "text-green-300" : "text-green-800"
                )}
                suppressHydrationWarning
              >
                {formatCurrency(newTotal, goal.currency)}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span 
                className={cn(
                  newTotal > goal.targetAmount
                    ? isDark ? "text-amber-400" : "text-amber-700"
                    : isDark ? "text-green-400" : "text-green-700"
                )}
                suppressHydrationWarning
              >
                Progress
              </span>
              <span 
                className={cn(
                  "font-bold",
                  newTotal > goal.targetAmount
                    ? isDark ? "text-amber-300" : "text-amber-800"
                    : isDark ? "text-green-300" : "text-green-800"
                )}
                suppressHydrationWarning
              >
                {newProgress.toFixed(1)}%
              </span>
            </div>
            
            {remaining > 0 ? (
              <div className="flex justify-between text-sm">
                <span 
                  className={cn(
                    isDark ? "text-green-400" : "text-green-700"
                  )}
                  suppressHydrationWarning
                >
                  Still Needed
                </span>
                <span 
                  className={cn(
                    "font-bold",
                    isDark ? "text-green-300" : "text-green-800"
                  )}
                  suppressHydrationWarning
                >
                  {formatCurrency(remaining, goal.currency)}
                </span>
              </div>
            ) : (
              <div 
                className={cn(
                  "flex items-center gap-2",
                  isDark ? "text-green-400" : "text-green-700"
                )}
                suppressHydrationWarning
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">
                  {newTotal > goal.targetAmount ? 'Goal exceeded! 🚀' : 'Goal will be completed! 🎉'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className={cn(
            "flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200",
            "border-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50",
            isDark
              ? "bg-slate-800 border-slate-700 text-gray-300 hover:bg-slate-700 hover:border-slate-600"
              : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 hover:border-gray-400"
          )}
          suppressHydrationWarning
        >
          Cancel
        </button>
        
        <button
          type="submit"
          disabled={!formData.amount || !formData.date || loading}
          className={cn(
            "flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200",
            "hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
            "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg",
            "hover:from-green-700 hover:to-emerald-700 hover:shadow-xl",
            "focus:outline-none focus:ring-2 focus:ring-green-500/20"
          )}
        >
          {loading ? 'Adding...' : 'Add Contribution'}
        </button>
      </div>
    </form>
  );
};

export default AddContributionForm;