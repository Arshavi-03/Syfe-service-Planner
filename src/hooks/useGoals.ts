'use client';

import { useState, useEffect, useCallback } from 'react';
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
}

export function useGoals(): UseGoalsReturn {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  // Load goals from localStorage on mount
  useEffect(() => {
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
      }
    } catch (error) {
      console.error('Error loading goals from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save goals to localStorage whenever goals change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.GOALS, JSON.stringify(goals));
      } catch (error) {
        console.error('Error saving goals to localStorage:', error);
      }
    }
  }, [goals, loading]);

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

    setGoals(prev => [...prev, newGoal]);
  }, []);

  const deleteGoal = useCallback((goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  }, []);

  const updateGoal = useCallback((goalId: string, updates: Partial<Omit<Goal, 'id' | 'contributions' | 'createdAt'>>) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, ...updates, updatedAt: new Date() }
        : goal
    ));
  }, []);

  const addContribution = useCallback((goalId: string, amount: number, date: Date, note?: string) => {
    const contribution: Contribution = {
      id: generateId(),
      amount,
      date,
      note,
    };

    setGoals(prev => prev.map(goal => {
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
    }));
  }, []);

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

  return {
    goals,
    loading,
    addGoal,
    deleteGoal,
    addContribution,
    getDashboardStats,
    updateGoal,
  };
}