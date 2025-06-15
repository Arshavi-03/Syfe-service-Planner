'use client';

import React, { useState, useEffect, useMemo, CSSProperties } from 'react';
import { 
  TrendingUp, 
  Target, 
  Wallet, 
  PieChart, 
  BarChart3, 
  ArrowUpRight,
  Plus,
  Calendar,
  Users,
  DollarSign
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import StatCard from '@/components/dashboard/StatCard';
import GoalsPage from '@/components/goals/GoalsPage';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  SavingsProgressChart, 
  GoalDistributionChart, 
  MonthlyContributionsChart,
  GoalCompletionChart 
} from '@/components/charts/Charts';
import { useGoals } from '@/hooks/useGoals';
import { useExchangeRate } from '@/hooks/useExchangeRate';


export default function HomePage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { goals, refreshGoals, goalStats, lastUpdated, loading } = useGoals();
  const { } = useExchangeRate();
  
  // Force refresh when switching to dashboard
  useEffect(() => {
    if (activeTab === 'dashboard') {
      refreshGoals();
    }
  }, [activeTab, refreshGoals]);

  // Memoize real-time statistics with enhanced data
  const realStats = useMemo(() => {
    if (!goals || goals.length === 0) {
      return {
        totalSaved: 0,
        totalTarget: 0,
        overallProgress: 0,
        monthlyChange: 0,
        savingsChange: 0,
        targetChange: 0,
        progressChange: 0,
        completedGoals: 0,
        activeGoals: 0,
        totalContributions: 0,
      };
    }

    // Use the enhanced goal stats
    const stats = goalStats;
    
    // Calculate additional metrics
    const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount).length;
    const activeGoals = goals.length - completedGoals;
    const totalContributions = goals.reduce((sum, goal) => sum + goal.contributions.length, 0);
    
    // Calculate changes (for demo purposes, showing positive growth based on actual data)
    const hasData = stats.totalSavedINR > 0;
    const savingsChange = hasData ? Math.min(15.5 + (stats.totalSavedINR / 10000), 25) : 0;
    const targetChange = hasData ? Math.min(8.2 + (stats.totalTargetINR / 50000), 15) : 0;
    const progressChange = hasData ? Math.min(5.4 + (stats.overallProgress / 10), 12) : 0;
    const monthlyChange = hasData ? Math.min(22.1 + (totalContributions * 2), 35) : 0;

    return {
      totalSaved: stats.totalSavedINR,
      totalTarget: stats.totalTargetINR,
      overallProgress: stats.overallProgress,
      monthlyChange,
      savingsChange,
      targetChange,
      progressChange,
      completedGoals,
      activeGoals,
      totalContributions,
    };
  }, [goals, goalStats, lastUpdated]);

  // Memoize goal distribution data for the legend with enhanced data
  const goalDistributionLegend = useMemo(() => {
    if (!goals || goals.length === 0) {
      return [];
    }

    const colors = [
      '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', 
      '#ef4444', '#3b82f6', '#ec4899', '#84cc16'
    ];

    const totalTarget = realStats.totalTarget;
    
    return goals.map((goal, index) => ({
      name: goal.name,
      value: totalTarget > 0 ? Number(((goal.targetAmount / totalTarget) * 100).toFixed(1)) : 0,
      color: colors[index % colors.length],
      progress: (goal.currentAmount / goal.targetAmount) * 100,
      isCompleted: goal.currentAmount >= goal.targetAmount,
      contributionCount: goal.contributions.length,
    }));
  }, [goals, realStats.totalTarget, lastUpdated]);

  // Recent activities based on actual goal data
  const recentActivities = useMemo(() => {
    if (!goals || goals.length === 0) return [];

    const activities: Array<{
      id: string;
      type: string;
      goalName: string;
      amount: number;
      date: Date;
      note?: string;
      isContribution: boolean;
    }> = [];
    
    // Add goal creation activities
    goals.slice(-3).forEach(goal => {
      activities.push({
        id: `created-${goal.id}`,
        type: 'goal_created',
        goalName: goal.name,
        amount: goal.targetAmount,
        date: goal.createdAt,
        isContribution: false,
      });
    });

    // Add recent contribution activities
    goals.forEach(goal => {
      goal.contributions.slice(-2).forEach(contribution => {
        activities.push({
          id: `contrib-${contribution.id}`,
          type: 'contribution',
          goalName: goal.name,
          amount: contribution.amount,
          date: contribution.date,
          note: contribution.note,
          isContribution: true,
        });
      });
    });

    // Sort by date and take most recent 4
    return activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 4);
  }, [goals, lastUpdated]);

  const renderDashboardContent = () => (
    <div className="space-y-8" key={`dashboard-${lastUpdated}`}>
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-[var(--foreground)]">
          Welcome back, User! 👋
        </h1>
        <p className="text-lg text-[var(--muted-foreground)]">
          Here&apos;s an overview of your financial progress
          {realStats.totalSaved > 0 && (
            <span className="ml-2 text-green-500 font-semibold">
              • {realStats.completedGoals} goals completed!
            </span>
          )}
        </p>
      </div>

      {/* Enhanced Stats Grid with real-time data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Savings"
          value={`₹${realStats.totalSaved.toLocaleString()}`}
          change={realStats.totalSaved > 0 ? `+${realStats.savingsChange.toFixed(1)}%` : "0%"}
          changeType={realStats.totalSaved > 0 ? "increase" : "neutral"}
          icon={Wallet}
          colorScheme="green"
          subtitle={realStats.totalSaved > 0 ? `${realStats.activeGoals} active goals` : "No savings yet"}
        />
        
        <StatCard
          title="Total Targets"
          value={`₹${realStats.totalTarget.toLocaleString()}`}
          change={realStats.totalTarget > 0 ? `+${realStats.targetChange.toFixed(1)}%` : "0%"}
          changeType={realStats.totalTarget > 0 ? "increase" : "neutral"}
          icon={Target}
          colorScheme="blue"
          subtitle={realStats.totalTarget > 0 ? `₹${(realStats.totalTarget - realStats.totalSaved).toLocaleString()} remaining` : "Set your first goal"}
        />
        
        <StatCard
          title="Overall Progress"
          value={`${realStats.overallProgress.toFixed(1)}%`}
          change={realStats.overallProgress > 0 ? `+${realStats.progressChange.toFixed(1)}%` : "0%"}
          changeType={realStats.overallProgress > 0 ? "increase" : "neutral"}
          icon={TrendingUp}
          colorScheme="purple"
          subtitle={`${goals?.length || 0} total goals`}
        />
        
        <StatCard
          title="This Month"
          value={`₹${realStats.totalSaved.toLocaleString()}`}
          change={realStats.totalSaved > 0 ? `+${realStats.monthlyChange.toFixed(1)}%` : "0%"}
          changeType={realStats.totalSaved > 0 ? "increase" : "neutral"}
          icon={Calendar}
          colorScheme="orange"
          subtitle={`${realStats.totalContributions} contributions`}
        />
      </div>

      {/* Charts Section with enhanced reactivity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Savings Progress Chart */}
        <Card className="col-span-1 lg:col-span-2 bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-[var(--card-foreground)]">Savings Progress</CardTitle>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">
                  Track your savings vs targets over time
                </p>
              </div>
              <Button variant="outline" size="sm" className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)]">
                <Calendar className="w-4 h-4 mr-2" />
                Last 6 months
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <SavingsProgressChart key={`savings-chart-${lastUpdated}`} />
          </CardContent>
        </Card>

        {/* Goal Distribution */}
        <Card className="bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[var(--card-foreground)]">Goal Distribution</CardTitle>
            <p className="text-sm text-[var(--muted-foreground)]">
              Breakdown of your savings goals
            </p>
          </CardHeader>
          <CardContent>
            <GoalDistributionChart key={`distribution-chart-${lastUpdated}`} />
            {/* Enhanced legend with real goal data */}
            {goalDistributionLegend.length > 0 && (
              <div className="mt-4 space-y-2">
                {goalDistributionLegend.map((item) => {
                  const colorStyle: CSSProperties = {
                    backgroundColor: item.color
                  };

                  return (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={colorStyle}
                        />
                        <span className="text-[var(--muted-foreground)]">{item.name}</span>
                        {item.isCompleted && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            ✓ Complete
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[var(--foreground)]">{item.value}%</span>
                        <span className="text-xs text-[var(--muted-foreground)]">
                          ({item.contributionCount} contributions)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {/* Show message when no goals */}
            {goalDistributionLegend.length === 0 && (
              <div className="mt-4 p-4 text-center rounded-lg bg-[var(--accent)] border border-[var(--border)]">
                <p className="text-sm text-[var(--muted-foreground)]">
                  Create your first goal to see the distribution
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Contributions */}
        <Card className="bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[var(--card-foreground)]">Monthly Contributions</CardTitle>
            <p className="text-sm text-[var(--muted-foreground)]">
              Your contribution history
            </p>
          </CardHeader>
          <CardContent>
            <MonthlyContributionsChart key={`contributions-chart-${lastUpdated}`} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Goal Completion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Goal Completion Chart */}
        <Card className="lg:col-span-2 bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[var(--card-foreground)]">Goal Completion Status</CardTitle>
            <p className="text-sm text-[var(--muted-foreground)]">
              Progress towards each of your goals
            </p>
          </CardHeader>
          <CardContent>
            <GoalCompletionChart key={`completion-chart-${lastUpdated}`} />
          </CardContent>
        </Card>

        {/* Enhanced Recent Activity with real data */}
        <Card className="bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[var(--card-foreground)]">Recent Activity</CardTitle>
            <p className="text-sm text-[var(--muted-foreground)]">
              Latest contributions and updates
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--accent)] border border-[var(--border)] hover:bg-[var(--muted)] transition-colors duration-200">
                  <div className={`p-2 rounded-lg ${
                    activity.isContribution
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-500'
                      : 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'
                  }`}>
                    {activity.isContribution ? (
                      <Wallet className="w-4 h-4" />
                    ) : (
                      <Target className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {activity.isContribution 
                        ? `Added ₹${activity.amount.toLocaleString()} to ${activity.goalName}`
                        : `Created goal: ${activity.goalName}`
                      }
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      {activity.date.toLocaleDateString()} 
                      {activity.note && ` • ${activity.note}`}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-[var(--muted-foreground)]" />
                </div>
                <p className="text-sm text-[var(--muted-foreground)]">
                  No recent activity
                </p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  Create your first goal to see updates here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Quick Actions */}
      <Card className="bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[var(--card-foreground)]">Quick Actions</CardTitle>
          <p className="text-sm text-[var(--muted-foreground)]">
            Common tasks to manage your savings
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              className="h-24 flex-col gap-2 bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 border-[var(--border)]" 
              variant="outline"
              onClick={() => setActiveTab('goals')}
            >
              <Plus className="w-6 h-6" />
              <span>Add New Goal</span>
            </Button>
            <Button 
              className="h-24 flex-col gap-2 bg-green-500 text-white hover:bg-green-600 border-green-500" 
              variant="outline"
              onClick={() => setActiveTab('goals')}
            >
              <DollarSign className="w-6 h-6" />
              <span>Make Contribution</span>
            </Button>
            <Button 
              className="h-24 flex-col gap-2 bg-purple-500 text-white hover:bg-purple-600 border-purple-500" 
              variant="outline"
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 className="w-6 h-6" />
              <span>View Analytics</span>
            </Button>
            <Button 
              className="h-24 flex-col gap-2 bg-orange-500 text-white hover:bg-orange-600 border-orange-500" 
              variant="outline"
              onClick={refreshGoals}
            >
              <Users className="w-6 h-6" />
              <span>Refresh Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return renderDashboardContent();
      case 'goals':
        return <GoalsPage />;
      case 'analytics':
        return (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <BarChart3 className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Analytics</h2>
              <p className="text-[var(--muted-foreground)]">Advanced analytics and insights coming soon...</p>
            </div>
          </div>
        );
      case 'transactions':
        return (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <DollarSign className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Transactions</h2>
              <p className="text-[var(--muted-foreground)]">Transaction history and management coming soon...</p>
            </div>
          </div>
        );
      case 'portfolio':
        return (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <PieChart className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Portfolio</h2>
              <p className="text-[var(--muted-foreground)]">Portfolio overview and management coming soon...</p>
            </div>
          </div>
        );
      case 'wallet':
        return (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Wallet className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Wallet</h2>
              <p className="text-[var(--muted-foreground)]">Wallet management and tools coming soon...</p>
            </div>
          </div>
        );
      default:
        return renderDashboardContent();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-sm">
            <div className="flex items-center justify-between h-16 px-6">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-[var(--foreground)] capitalize">
                  {activeTab}
                </h1>
                {/* Real-time status indicator */}
                {!loading && (
                  <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live updates</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)]">
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button size="sm" onClick={() => setActiveTab('goals')} className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
              </div>
            </div>
          </header>
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-6 lg:p-8">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 