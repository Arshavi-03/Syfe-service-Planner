'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Goal, Contribution, Currency, DashboardStats } from '@/lib/types';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';
import { generateId, convertCurrency, calculateProgress } from '@/lib/utils';

interface UseGoalsReturn {
  goals: Goal[];
  loading: boolean;
  addGoal: (name: string, targetAmount: number, currency: Currency) => void;
  deleteGoal: (goalId: string) => void;
  addContribution: (goalId: string, amount: number, date: Date, note?: string) => void;
  getDashboardStats: (exchangeRates?: { INR: number; USD: number }) => DashboardStats;
  updateGoal: (goalId: string, updates: Partial<Omit<Goal, 'id' | 'contributions' | 'createdAt'>>) => void;
  refreshGoals: () => void; // New function for force refresh
  lastUpdated: number; // Timestamp for tracking changes
  goalStats: DashboardStats; // Memoized stats for better performance
}

export function useGoals(): UseGoalsReturn {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  // Force update timestamp whenever goals change
  const triggerUpdate = useCallback(() => {
    setLastUpdated(Date.now());
  }, []);

  // Load goals from localStorage
  const loadGoalsFromStorage = useCallback(() => {
    setLoading(true);
    try {
      const savedGoals = localStorage.getItem(LOCAL_STORAGE_KEYS.GOALS);
      if (savedGoals) {
        const parsedGoals = JSON.parse(savedGoals).map((goal: Goal & { 
          createdAt: string; 
          updatedAt: string; 
          contributions: Array<Contribution & { date: string }>;
        }) => ({
          ...goal,
          createdAt: new Date(goal.createdAt),
          updatedAt: new Date(goal.updatedAt),
          contributions: goal.contributions.map((contrib) => ({
            ...contrib,
            date: new Date(contrib.date),
          })),
        }));
        setGoals(parsedGoals);
        triggerUpdate();
      } else {
        setGoals([]);
      }
    } catch (error) {
      console.error('Error loading goals from localStorage:', error);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  }, [triggerUpdate]);

  // Load goals from localStorage on mount
  useEffect(() => {
    loadGoalsFromStorage();
  }, [loadGoalsFromStorage]);

  // Save goals to localStorage whenever goals change
  useEffect(() => {
    if (!loading && goals.length >= 0) { // Allow empty arrays to be saved
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.GOALS, JSON.stringify(goals));
        triggerUpdate();
      } catch (error) {
        console.error('Error saving goals to localStorage:', error);
      }
    }
  }, [goals, loading, triggerUpdate]);

  // Refresh goals function - force reload from localStorage
  const refreshGoals = useCallback(() => {
    // Add small delay to ensure any pending localStorage writes complete
    setTimeout(() => {
      loadGoalsFromStorage();
    }, 50);
  }, [loadGoalsFromStorage]);

  const addGoal = useCallback((name: string, targetAmount: number, currency: Currency) => {
    const newGoal: Goal = {
      id: generateId(),
      name: name.trim(),
      targetAmount,
      currency,
      currentAmount: 0,
      contributions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setGoals(prev => {
      const updated = [...prev, newGoal];
      triggerUpdate();
      return updated;
    });
  }, [triggerUpdate]);

  const deleteGoal = useCallback((goalId: string) => {
    setGoals(prev => {
      const updated = prev.filter(goal => goal.id !== goalId);
      triggerUpdate();
      return updated;
    });
  }, [triggerUpdate]);

  const updateGoal = useCallback((goalId: string, updates: Partial<Omit<Goal, 'id' | 'contributions' | 'createdAt'>>) => {
    setGoals(prev => {
      const updated = prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, ...updates, updatedAt: new Date() }
          : goal
      );
      triggerUpdate();
      return updated;
    });
  }, [triggerUpdate]);

  const addContribution = useCallback((goalId: string, amount: number, date: Date, note?: string) => {
    const contribution: Contribution = {
      id: generateId(),
      amount,
      date,
      note,
    };

    setGoals(prev => {
      const updated = prev.map(goal => {
        if (goal.id === goalId) {
          const newCurrentAmount = goal.currentAmount + amount;
          return {
            ...goal,
            currentAmount: newCurrentAmount,
            contributions: [...goal.contributions, contribution],
            updatedAt: new Date(),
          };
        }
        return goal;
      });
      triggerUpdate();
      return updated;
    });
  }, [triggerUpdate]);

  const getDashboardStats = useCallback((exchangeRates?: { INR: number; USD: number }): DashboardStats => {
    const defaultRates = { INR: 83, USD: 1 };
    const rates = exchangeRates || defaultRates;

    let totalTargetINR = 0;
    let totalTargetUSD = 0;
    let totalSavedINR = 0;
    let totalSavedUSD = 0;
    let totalProgress = 0;

    goals.forEach(goal => {
      // Convert target amounts
      const targetINR = convertCurrency(goal.targetAmount, goal.currency, 'INR', rates);
      const targetUSD = convertCurrency(goal.targetAmount, goal.currency, 'USD', rates);
      
      totalTargetINR += targetINR;
      totalTargetUSD += targetUSD;

      // Convert current amounts
      const currentINR = convertCurrency(goal.currentAmount, goal.currency, 'INR', rates);
      const currentUSD = convertCurrency(goal.currentAmount, goal.currency, 'USD', rates);
      
      totalSavedINR += currentINR;
      totalSavedUSD += currentUSD;

      // Calculate individual goal progress
      const goalProgress = calculateProgress(goal.currentAmount, goal.targetAmount);
      totalProgress += goalProgress;
    });

    // Calculate overall progress as average
    const overallProgress = goals.length > 0 ? totalProgress / goals.length : 0;

    return {
      totalTargetINR,
      totalTargetUSD,
      totalSavedINR,
      totalSavedUSD,
      overallProgress,
      goalCount: goals.length,
    };
  }, [goals]);

  // Memoized dashboard stats for better performance and reactivity
  const goalStats = useMemo(() => {
    return getDashboardStats();
  }, [getDashboardStats, lastUpdated]); // Include lastUpdated to ensure recalculation

  // Enhanced goals with computed properties for better reactivity
  const enhancedGoals = useMemo(() => {
    return goals.map(goal => ({
      ...goal,
      progress: calculateProgress(goal.currentAmount, goal.targetAmount),
      isCompleted: goal.currentAmount >= goal.targetAmount,
      remainingAmount: Math.max(0, goal.targetAmount - goal.currentAmount),
      contributionCount: goal.contributions.length,
      lastContributionDate: goal.contributions.length > 0 
        ? goal.contributions[goal.contributions.length - 1].date
        : null,
    }));
  }, [goals, lastUpdated]);

  return {
    goals: enhancedGoals,
    loading,
    addGoal,
    deleteGoal,
    addContribution,
    getDashboardStats,
    updateGoal,
    refreshGoals,
    lastUpdated,
    goalStats,
  };
}