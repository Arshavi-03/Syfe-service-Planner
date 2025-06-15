'use client';

import React, { useState } from 'react';
import { Plus, Target, TrendingUp, RefreshCw, DollarSign } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card, { CardContent } from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import GoalCard from '@/components/dashboard/GoalCard';
import AddGoalForm from '@/components/forms/AddGoalForm';
import AddContributionForm from '@/components/forms/AddContributionForm';
import DeleteGoalModal from '@/components/ui/DeleteGoalModal';
import { useGoals } from '@/hooks/useGoals';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { Goal, Currency } from '@/lib/types';
import { formatCompactCurrency, formatRelativeTime, cn } from '@/lib/utils';

const GoalsPage: React.FC = () => {
  const { goals, addGoal, addContribution, getDashboardStats, deleteGoal } = useGoals();
  const { exchangeRate, loading: exchangeLoading, lastUpdated, refreshRate, error } = useExchangeRate();
  
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const dashboardStats = getDashboardStats(exchangeRate?.rates);

  // Handle adding a new goal
  const handleAddGoal = (name: string, targetAmount: number, currency: Currency) => {
    addGoal(name, targetAmount, currency);
    setShowAddGoalModal(false);
  };

  // Handle adding contribution to a goal
  const handleAddContribution = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      setSelectedGoal(goal);
      setShowContributionModal(true);
    }
  };

  // Handle contribution submission
  const handleContributionSubmit = (amount: number, date: Date, note?: string) => {
    if (selectedGoal) {
      addContribution(selectedGoal.id, amount, date, note);
      setShowContributionModal(false);
      setSelectedGoal(null);
    }
  };

  // THIS IS THE CRITICAL FUNCTION - NO CONFIRM() CALLS
  const handleDeleteGoal = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      setGoalToDelete(goal);
      setShowDeleteModal(true);
    }
  };

  // Handle delete confirmation from custom modal
  const handleDeleteConfirm = async () => {
    if (goalToDelete) {
      setIsDeleting(true);
      try {
        // Add a small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
        // CALL THE ACTUAL DELETE FUNCTION WITHOUT ANY CONFIRMATION
        deleteGoal(goalToDelete.id);
        setShowDeleteModal(false);
        setGoalToDelete(null);
      } catch (error) {
        console.error('Error deleting goal:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Handle delete cancellation
  const handleDeleteCancel = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
      setGoalToDelete(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Financial Goals
          </h1>
          <p className="text-[var(--muted-foreground)]">
            Track your progress towards financial milestones
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={refreshRate}
            loading={exchangeLoading}
            className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)]"
            icon={<RefreshCw className={cn("w-4 h-4", exchangeLoading && "animate-spin")} />}
          >
            Refresh Rates
          </Button>
          <Button
            onClick={() => setShowAddGoalModal(true)}
            className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90"
            icon={<Plus className="w-4 h-4" />}
          >
            Add New Goal
          </Button>
        </div>
      </div>

      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Target */}
        <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 dark:from-blue-950/30 dark:to-blue-950/50 border-0 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/30 dark:bg-white/20 rounded-lg flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="px-3 py-1 bg-white/30 dark:bg-white/20 rounded-full shadow-sm">
                <span className="text-xs font-bold text-white">+8.2%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-white/90 dark:text-white/80 mb-1 uppercase tracking-wider">TOTAL TARGETS</p>
              <p className="text-3xl font-black text-white mb-1 drop-shadow-sm">
                {formatCompactCurrency(dashboardStats.totalTargetINR, 'INR')}
              </p>
              <p className="text-sm font-semibold text-white/80 dark:text-white/70">
                ≈ {formatCompactCurrency(dashboardStats.totalTargetUSD, 'USD')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total Saved */}
        <Card className="group relative overflow-hidden bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 dark:from-emerald-950/30 dark:to-emerald-950/50 border-0 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/30 dark:bg-white/20 rounded-lg flex items-center justify-center shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="px-3 py-1 bg-white/30 dark:bg-white/20 rounded-full shadow-sm">
                <span className="text-xs font-bold text-white">+12.5%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-white/90 dark:text-white/80 mb-1 uppercase tracking-wider">TOTAL SAVINGS</p>
              <p className="text-3xl font-black text-white mb-1 drop-shadow-sm">
                {formatCompactCurrency(dashboardStats.totalSavedINR, 'INR')}
              </p>
              <p className="text-sm font-semibold text-white/80 dark:text-white/70">
                ≈ {formatCompactCurrency(dashboardStats.totalSavedUSD, 'USD')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Overall Progress */}
        <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-400 via-purple-500 to-violet-600 dark:from-purple-950/30 dark:to-purple-950/50 border-0 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/30 dark:bg-white/20 rounded-lg flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="px-3 py-1 bg-white/30 dark:bg-white/20 rounded-full shadow-sm">
                <span className="text-xs font-bold text-white">+5.4%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-white/90 dark:text-white/80 mb-1 uppercase tracking-wider">OVERALL PROGRESS</p>
              <p className="text-3xl font-black text-white mb-1 drop-shadow-sm">
                {dashboardStats.overallProgress.toFixed(1)}%
              </p>
              <p className="text-sm font-semibold text-white/80 dark:text-white/70">
                {dashboardStats.goalCount} active goals
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Exchange Rate */}
        <Card className="group relative overflow-hidden bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 dark:from-orange-950/30 dark:to-orange-950/50 border-0 shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/30 dark:bg-white/20 rounded-lg flex items-center justify-center shadow-lg">
                <RefreshCw className={cn("w-6 h-6 text-white", exchangeLoading && "animate-spin")} />
              </div>
              <div className="px-3 py-1 bg-white/30 dark:bg-white/20 rounded-full shadow-sm">
                <span className="text-xs font-bold text-white">Live</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-white/90 dark:text-white/80 mb-1 uppercase tracking-wider">EXCHANGE RATE</p>
              <p className="text-2xl font-black text-white mb-1 drop-shadow-sm">
                1 USD = ₹{exchangeRate?.rates?.INR?.toFixed(2) || '83.00'}
              </p>
              <p className="text-sm font-semibold text-white/80 dark:text-white/70">
                {lastUpdated ? `Updated ${formatRelativeTime(lastUpdated)}` : 'Loading...'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {error && (
        <Card className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
          <CardContent className="p-4">
            <p className="text-sm text-red-600 dark:text-red-400 text-center">
              Failed to fetch exchange rates: {error}. Using cached rates.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Goals Section */}
      {goals.length === 0 ? (
        <Card className="text-center py-16 bg-[var(--card)] border border-[var(--border)]">
          <CardContent>
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                <Target className="w-12 h-12 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-[var(--foreground)]">
                  No goals yet
                </h3>
                <p className="text-[var(--muted-foreground)]">
                  Start your financial journey by creating your first savings goal.
                </p>
              </div>
              <Button
                onClick={() => setShowAddGoalModal(true)}
                className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90"
                icon={<Plus className="w-4 h-4" />}
              >
                Create Your First Goal
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              Your Goals ({goals.length})
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal, index) => (
              <div 
                key={goal.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <GoalCard
                  goal={goal}
                  exchangeRates={exchangeRate?.rates}
                  onAddContribution={handleAddContribution}
                  onDeleteGoal={handleDeleteGoal}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={showAddGoalModal}
        onClose={() => setShowAddGoalModal(false)}
        title="Create New Goal"
        size="md"
      >
        <AddGoalForm
          onSubmit={handleAddGoal}
          onCancel={() => setShowAddGoalModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showContributionModal}
        onClose={() => {
          setShowContributionModal(false);
          setSelectedGoal(null);
        }}
        title={selectedGoal ? `Add Contribution to ${selectedGoal.name}` : 'Add Contribution'}
        size="md"
      >
        {selectedGoal && (
          <AddContributionForm
            goal={selectedGoal}
            onSubmit={handleContributionSubmit}
            onCancel={() => {
              setShowContributionModal(false);
              setSelectedGoal(null);
            }}
          />
        )}
      </Modal>

      {/* Custom Delete Goal Modal - THIS REPLACES THE BROWSER CONFIRM */}
      <DeleteGoalModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        goal={goalToDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default GoalsPage;