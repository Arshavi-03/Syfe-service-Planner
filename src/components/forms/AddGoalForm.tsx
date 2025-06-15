'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Target, DollarSign, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Currency } from '@/lib/types';

interface AddGoalFormProps {
  onSubmit: (name: string, targetAmount: number, currency: Currency) => void;
  onCancel: () => void;
}

const AddGoalForm: React.FC<AddGoalFormProps> = ({ onSubmit, onCancel }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [errors, setErrors] = useState<Record<string, string>>({});

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
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-28"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-11 bg-gray-200 rounded flex-1"></div>
          <div className="h-11 bg-gray-200 rounded flex-1"></div>
        </div>
      </div>
    );
  }

  const isDark = theme === 'dark';

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Goal name is required';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Goal name must be at least 3 characters';
    }

    const amount = parseFloat(targetAmount);
    if (!targetAmount || isNaN(amount) || amount <= 0) {
      newErrors.targetAmount = 'Please enter a valid target amount greater than 0';
    } else if (amount > 100000000) {
      newErrors.targetAmount = 'Target amount is too large';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(name.trim(), parseFloat(targetAmount), currency);
    }
  };

  const formatAmount = () => {
    const amount = parseFloat(targetAmount);
    if (isNaN(amount)) return '₹0';
    
    return currency === 'INR' 
      ? `₹${amount.toLocaleString('en-IN')}`
      : `$${amount.toLocaleString('en-US')}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        {/* Icon */}
        <div 
          className={cn(
            "w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg",
            isDark
              ? "bg-gradient-to-br from-blue-600 to-purple-600"
              : "bg-gradient-to-br from-blue-500 to-purple-600"
          )}
          suppressHydrationWarning
        >
          <Target className="w-8 h-8 text-white" />
        </div>
        
        {/* Title & Description */}
        <div className="space-y-2">
          <h2 
            className={cn(
              "text-2xl font-bold",
              isDark ? "text-white" : "text-gray-900"
            )}
            suppressHydrationWarning
          >
            Create New Goal
          </h2>
          <p 
            className={cn(
              "text-sm",
              isDark ? "text-gray-300" : "text-gray-600"
            )}
            suppressHydrationWarning
          >
            Set a financial target and start saving towards it
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-5">
        {/* Goal Name */}
        <div className="space-y-2">
          <label 
            htmlFor="goalName" 
            className={cn(
              "block text-sm font-semibold",
              isDark ? "text-gray-200" : "text-gray-700"
            )}
            suppressHydrationWarning
          >
            Goal Name
          </label>
          <div className="relative">
            <Target 
              className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5",
                isDark ? "text-gray-400" : "text-gray-500"
              )}
              suppressHydrationWarning
            />
            <input
              id="goalName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Emergency Fund, Trip to Japan"
              className={cn(
                "w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                errors.name
                  ? "border-red-400 focus:border-red-500 bg-white text-gray-900 placeholder:text-gray-500"
                  : isDark
                    ? "bg-white border-slate-600 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 hover:border-slate-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 hover:border-gray-400"
              )}
              suppressHydrationWarning
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs font-medium">{errors.name}</p>
          )}
          <p 
            className={cn(
              "text-xs",
              isDark ? "text-gray-400" : "text-gray-500"
            )}
            suppressHydrationWarning
          >
            Give your goal a meaningful name
          </p>
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <label 
            htmlFor="currency" 
            className={cn(
              "block text-sm font-semibold",
              isDark ? "text-gray-200" : "text-gray-700"
            )}
            suppressHydrationWarning
          >
            Currency
          </label>
          <div className="relative">
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className={cn(
                "w-full pl-4 pr-10 py-3 rounded-xl border-2 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer",
                isDark
                  ? "bg-white border-slate-600 text-gray-900 focus:border-blue-500 hover:border-slate-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 hover:border-gray-400"
              )}
              suppressHydrationWarning
            >
              <option value="INR">₹ INR (Indian Rupee)</option>
              <option value="USD">$ USD (US Dollar)</option>
            </select>
            <ChevronDown 
              className={cn(
                "absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none",
                isDark ? "text-gray-400" : "text-gray-500"
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
            Choose your preferred currency for this goal
          </p>
        </div>

        {/* Target Amount */}
        <div className="space-y-2">
          <label 
            htmlFor="targetAmount" 
            className={cn(
              "block text-sm font-semibold",
              isDark ? "text-gray-200" : "text-gray-700"
            )}
            suppressHydrationWarning
          >
            Target Amount
          </label>
          <div className="relative">
            <DollarSign 
              className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5",
                isDark ? "text-gray-400" : "text-gray-500"
              )}
              suppressHydrationWarning
            />
            <input
              id="targetAmount"
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="Enter amount (e.g., 10000, 50000)"
              min="1"
              step="1"
              className={cn(
                "w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                errors.targetAmount
                  ? "border-red-400 focus:border-red-500 bg-white text-gray-900 placeholder:text-gray-500"
                  : isDark
                    ? "bg-white border-slate-600 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 hover:border-slate-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 hover:border-gray-400"
              )}
              suppressHydrationWarning
            />
          </div>
          {errors.targetAmount && (
            <p className="text-red-500 text-xs font-medium">{errors.targetAmount}</p>
          )}
          <p 
            className={cn(
              "text-xs",
              isDark ? "text-gray-400" : "text-gray-500"
            )}
            suppressHydrationWarning
          >
            You want to save {formatAmount()}
          </p>
        </div>
      </div>

      {/* Goal Preview */}
      {name.trim() && targetAmount && parseFloat(targetAmount) > 0 && (
        <div 
          className={cn(
            "rounded-xl p-4 border",
            isDark 
              ? "bg-blue-900/20 border-blue-700/30" 
              : "bg-blue-50 border-blue-200"
          )}
          suppressHydrationWarning
        >
          <h3 
            className={cn(
              "font-semibold mb-3 flex items-center gap-2",
              isDark ? "text-blue-300" : "text-blue-800"
            )}
            suppressHydrationWarning
          >
            <Target className="w-4 h-4" />
            Goal Preview
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span 
                className={cn(
                  "text-sm font-medium",
                  isDark ? "text-blue-200" : "text-blue-700"
                )}
                suppressHydrationWarning
              >
                Name:
              </span>
              <span 
                className={cn(
                  "text-sm font-bold",
                  isDark ? "text-white" : "text-blue-900"
                )}
                suppressHydrationWarning
              >
                {name.trim()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span 
                className={cn(
                  "text-sm font-medium",
                  isDark ? "text-blue-200" : "text-blue-700"
                )}
                suppressHydrationWarning
              >
                Target:
              </span>
              <span 
                className={cn(
                  "text-sm font-bold",
                  isDark ? "text-white" : "text-blue-900"
                )}
                suppressHydrationWarning
              >
                {formatAmount()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span 
                className={cn(
                  "text-sm font-medium",
                  isDark ? "text-blue-200" : "text-blue-700"
                )}
                suppressHydrationWarning
              >
                Progress:
              </span>
              <span 
                className={cn(
                  "text-sm font-bold",
                  isDark ? "text-green-400" : "text-green-600"
                )}
                suppressHydrationWarning
              >
                0% (Just getting started! 🚀)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className={cn(
            "flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200",
            "border-2 hover:scale-[1.02] active:scale-[0.98]",
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
          disabled={!name.trim() || !targetAmount || parseFloat(targetAmount) <= 0}
          className={cn(
            "flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200",
            "hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
            "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg",
            "hover:from-blue-700 hover:to-purple-700 hover:shadow-xl",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          )}
        >
          Create Goal
        </button>
      </div>
    </form>
  );
};

export default AddGoalForm;