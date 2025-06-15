'use client';

import React, { useState, useEffect, CSSProperties } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { useTheme } from 'next-themes';
import { TrendingUp, Target, Award, BarChart3 } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';
import { Goal } from '@/lib/types';

// Empty state data for charts
const emptyAreaData = [
  { month: 'Jan', saved: 0, target: 0 },
  { month: 'Feb', saved: 0, target: 0 },
  { month: 'Mar', saved: 0, target: 0 },
  { month: 'Apr', saved: 0, target: 0 },
  { month: 'May', saved: 0, target: 0 },
  { month: 'Jun', saved: 0, target: 0 },
];

const emptyBarData = [
  { month: 'Jan', amount: 0 },
  { month: 'Feb', amount: 0 },
  { month: 'Mar', amount: 0 },
  { month: 'Apr', amount: 0 },
  { month: 'May', amount: 0 },
  { month: 'Jun', amount: 0 },
];

const emptyPieData = [
  { 
    name: 'No goals yet', 
    value: 100, 
    color: '#6b7280', 
    lightColor: '#9ca3af',
    amount: 0,
    current: 0,
    progress: 0
  }
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    dataKey: string;
    value: number | string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const tooltipStyle: CSSProperties = {
      background: 'rgba(30, 41, 59, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
    };

    return (
      <div 
        className="rounded-xl p-4 shadow-2xl border"
        style={tooltipStyle}
      >
        <p className="text-sm font-semibold text-white mb-3 border-b border-white/30 pb-2">
          {label}
        </p>
        {payload.map((pld, index) => {
          const dotStyle: CSSProperties = {
            backgroundColor: pld.color,
            boxShadow: `0 0 10px ${pld.color}40`
          };

          return (
            <div key={index} className="flex items-center gap-3 text-sm mb-2 last:mb-0">
              <div 
                className="w-4 h-4 rounded-full shadow-lg"
                style={dotStyle}
              />
              <span className="text-slate-300 capitalize font-medium">
                {pld.dataKey}:
              </span>
              <span className="font-bold text-white">
                {typeof pld.value === 'number' ? `₹${pld.value.toLocaleString()}` : pld.value}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

// Helper function to generate goal distribution data from real goals
const generateGoalDistributionData = (goals: Goal[]) => {
  if (!goals || goals.length === 0) {
    return emptyPieData;
  }

  const colors = [
    { color: '#8b5cf6', lightColor: '#c4b5fd' }, // Purple
    { color: '#06b6d4', lightColor: '#67e8f9' }, // Cyan
    { color: '#10b981', lightColor: '#6ee7b7' }, // Emerald
    { color: '#f59e0b', lightColor: '#fbbf24' }, // Amber
    { color: '#ef4444', lightColor: '#fca5a5' }, // Red
    { color: '#3b82f6', lightColor: '#93c5fd' }, // Blue
    { color: '#ec4899', lightColor: '#f9a8d4' }, // Pink
    { color: '#84cc16', lightColor: '#bef264' }, // Lime
  ];

  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  
  return goals.map((goal, index) => ({
    name: goal.name,
    value: totalTarget > 0 ? Number(((goal.targetAmount / totalTarget) * 100).toFixed(1)) : 0,
    amount: goal.targetAmount,
    current: goal.currentAmount,
    progress: goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0,
    color: colors[index % colors.length].color,
    lightColor: colors[index % colors.length].lightColor,
  }));
};

// Helper function to calculate goal completion data
const generateGoalCompletionData = (goals: Goal[]) => {
  if (!goals || goals.length === 0) {
    return [];
  }

  const colors = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#84cc16'];
  
  return goals.map((goal, index) => ({
    goal: goal.name,
    completion: goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0,
    color: colors[index % colors.length],
    current: goal.currentAmount,
    target: goal.targetAmount,
  }));
};

export const SavingsProgressChart: React.FC = () => {
  const { theme } = useTheme();
  const { goals } = useGoals();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isDark = mounted ? theme === 'dark' : false;
  
  // Use only real data or empty data
  const savingsProgressData = goals && goals.length > 0 ? 
    (() => {
      const totalCurrent = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
      const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
      
      if (totalCurrent === 0 && totalTarget === 0) {
        return emptyAreaData;
      }

      // Show current state as final month only
      return [
        { month: 'Jan', saved: 0, target: 0 },
        { month: 'Feb', saved: 0, target: 0 },
        { month: 'Mar', saved: 0, target: 0 },
        { month: 'Apr', saved: 0, target: 0 },
        { month: 'May', saved: 0, target: 0 },
        { month: 'Jun', saved: totalCurrent, target: totalTarget },
      ];
    })() : emptyAreaData;

  const hasData = goals && goals.length > 0 && goals.some(goal => goal.currentAmount > 0 || goal.targetAmount > 0);

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={savingsProgressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="savedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={hasData ? 0.8 : 0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={hasData ? 0.1 : 0.05}/>
            </linearGradient>
            <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={hasData ? 0.8 : 0.3}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={hasData ? 0.1 : 0.05}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isDark ? '#374151' : '#e2e8f0'} 
            strokeOpacity={0.6}
            strokeWidth={1}
          />
          
          <XAxis 
            dataKey="month" 
            stroke={isDark ? '#10b981' : '#8b5cf6'}
            fontSize={13}
            fontWeight={700}
            tickLine={{ stroke: isDark ? '#06b6d4' : '#f59e0b', strokeWidth: 2 }}
            axisLine={{ stroke: isDark ? '#8b5cf6' : '#10b981', strokeWidth: 2 }}
            tick={{ 
              fill: isDark ? '#10b981' : '#8b5cf6',
              fontWeight: 'bold',
              fontSize: 13
            }}
          />
          
          <YAxis 
            stroke={isDark ? '#06b6d4' : '#f59e0b'}
            fontSize={13}
            fontWeight={700}
            tickLine={{ stroke: isDark ? '#10b981' : '#8b5cf6', strokeWidth: 2 }}
            axisLine={{ stroke: isDark ? '#06b6d4' : '#f59e0b', strokeWidth: 2 }}
            tick={{ 
              fill: isDark ? '#06b6d4' : '#f59e0b',
              fontWeight: 'bold',
              fontSize: 13
            }}
            tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
          />
          
          <Tooltip content={hasData ? <CustomTooltip /> : undefined} />
          
          <Area
            type="monotone"
            dataKey="target"
            stackId="1"
            stroke="#06b6d4"
            fill="url(#targetGradient)"
            strokeWidth={hasData ? 3 : 1}
            strokeOpacity={hasData ? 1 : 0.5}
            dot={hasData ? { fill: '#06b6d4', strokeWidth: 2, r: 6 } : false}
            activeDot={hasData ? { r: 8, fill: '#06b6d4', strokeWidth: 3, stroke: '#ffffff' } : false}
          />
          <Area
            type="monotone"
            dataKey="saved"
            stackId="2"
            stroke="#8b5cf6"
            fill="url(#savedGradient)"
            strokeWidth={hasData ? 3 : 1}
            strokeOpacity={hasData ? 1 : 0.5}
            dot={hasData ? { fill: '#8b5cf6', strokeWidth: 2, r: 6 } : false}
            activeDot={hasData ? { r: 8, fill: '#8b5cf6', strokeWidth: 3, stroke: '#ffffff' } : false}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Overlay message when no data */}
      {!hasData && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-sm rounded-lg">
          <div className="text-center space-y-3 p-6">
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <TrendingUp className={`w-8 h-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
            <div className="space-y-1">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Savings Progress
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Chart will populate after adding goals and contributions
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const GoalDistributionChart: React.FC = () => {
  const { theme } = useTheme();
  const { goals } = useGoals();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === 'dark' : false;
  const goalDistributionData = generateGoalDistributionData(goals);
  const hasGoals = goals && goals.length > 0;

  return (
    <div className="space-y-6">
      <div className="relative">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <defs>
              {goalDistributionData.map((entry, index) => (
                <linearGradient key={index} id={`pieGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={entry.color} stopOpacity={hasGoals ? 1 : 0.3}/>
                  <stop offset="100%" stopColor={entry.lightColor} stopOpacity={hasGoals ? 0.8 : 0.2}/>
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={goalDistributionData}
              cx="50%"
              cy="50%"
              outerRadius={110}
              innerRadius={65}
              paddingAngle={hasGoals ? 3 : 0}
              dataKey="value"
              strokeWidth={2}
              stroke="#ffffff"
            >
              {goalDistributionData.map((entry, index) => {
                const cellStyle: CSSProperties = {
                  filter: hasGoals ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' : 'none',
                };

                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#pieGradient${index})`}
                    style={cellStyle}
                  />
                );
              })}
            </Pie>
            {hasGoals && (
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const tooltipStyle: CSSProperties = {
                      background: 'rgba(30, 41, 59, 0.95)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                    };

                    const colorStyle: CSSProperties = {
                      backgroundColor: data.color,
                      boxShadow: `0 0 10px ${data.color}40`
                    };

                    return (
                      <div 
                        className="rounded-xl p-4 shadow-2xl border"
                        style={tooltipStyle}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={colorStyle}
                          />
                          <span className="font-semibold text-white">
                            {data.name}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-slate-300">
                            <span className="font-bold text-lg text-white">
                              {data.value}%
                            </span> of total targets
                          </p>
                          <p className="text-xs text-slate-400">
                            Target: ₹{data.amount?.toLocaleString() || '0'}
                          </p>
                          <p className="text-xs text-slate-400">
                            Progress: {data.progress?.toFixed(1) || '0'}%
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            )}
          </PieChart>
        </ResponsiveContainer>

        {/* Overlay message when no goals */}
        {!hasGoals && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                isDark ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <Target className={`w-8 h-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <div className="space-y-1">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Goal Distribution
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  Chart will show distribution after creating goals
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ONLY show real goal details when goals exist and have valid data */}
      {hasGoals && goalDistributionData.length > 0 && goalDistributionData[0].name !== 'No goals yet' && (
        <div className="space-y-4">
          {/* Real Goal List with Progress */}
          <div className="space-y-3">
            {goalDistributionData
              .filter(item => item.name !== 'No goals yet')
              .map((item, index) => {
                const colorStyle: CSSProperties = {
                  backgroundColor: item.color
                };

                const progressBarStyle: CSSProperties = {
                  width: `${Math.min(item.progress || 0, 100)}%`,
                  backgroundColor: item.color,
                  boxShadow: `0 0 8px ${item.color}40`
                };

                const textColorStyle: CSSProperties = {
                  color: item.color
                };

                return (
                  <div key={`real-goal-${item.name}-${index}`} className={`p-3 rounded-lg border transition-all hover:shadow-md ${
                    isDark ? 'bg-gray-800/30 border-gray-700 hover:bg-gray-800/50' : 'bg-gray-50/50 border-gray-200 hover:bg-gray-100/50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={colorStyle}
                        />
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.value}%
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold" style={textColorStyle}>
                            {item.progress?.toFixed(0) || '0'}%
                          </span>
                          {(item.progress || 0) >= 100 && (
                            <Award className="w-3 h-3 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Mini Progress Bar */}
                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={progressBarStyle}
                      />
                    </div>
                    
                    {/* Amount Details */}
                    <div className="mt-2 flex justify-between text-xs">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                        ₹{(item.current || 0).toLocaleString()} saved
                      </span>
                      <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                        ₹{(item.amount || 0).toLocaleString()} target
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Summary Stats */}
          <div className={`grid grid-cols-3 gap-3 p-4 rounded-xl border ${
            isDark ? 'bg-gray-800/20 border-gray-700' : 'bg-blue-50/50 border-blue-200'
          }`}>
            <div className="text-center">
              <div className={`text-lg font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                {goals.length}
              </div>
              <div className={`text-xs font-medium ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                Goals
              </div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                {goals.filter(goal => (goal.currentAmount / goal.targetAmount) >= 1).length}
              </div>
              <div className={`text-xs font-medium ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                Completed
              </div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                {goals.length > 0 ? (goals.reduce((sum, goal) => sum + (goal.currentAmount / goal.targetAmount), 0) / goals.length * 100).toFixed(0) : 0}%
              </div>
              <div className={`text-xs font-medium ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                Avg Progress
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const MonthlyContributionsChart: React.FC = () => {
  const { theme } = useTheme();
  const { goals } = useGoals();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isDark = mounted ? theme === 'dark' : false;
  
  // Use only real data or empty data - no sample data
  const monthlyContributionsData = goals && goals.length > 0 ? 
    (() => {
      const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
      
      if (totalSaved === 0) {
        return emptyBarData;
      }

      // Show current total in the last month only
      return [
        { month: 'Jan', amount: 0 },
        { month: 'Feb', amount: 0 },
        { month: 'Mar', amount: 0 },
        { month: 'Apr', amount: 0 },
        { month: 'May', amount: 0 },
        { month: 'Jun', amount: totalSaved },
      ];
    })() : emptyBarData;

  const hasData = goals && goals.length > 0 && goals.some(goal => goal.currentAmount > 0);
  
  return (
    <div className="space-y-6">
      <div className="relative">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyContributionsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={hasData ? 1 : 0.3}/>
                <stop offset="50%" stopColor="#059669" stopOpacity={hasData ? 0.9 : 0.2}/>
                <stop offset="100%" stopColor="#34d399" stopOpacity={hasData ? 0.7 : 0.1}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? '#374151' : '#e2e8f0'} 
              strokeOpacity={0.6}
            />
            
            <XAxis 
              dataKey="month" 
              stroke={isDark ? '#f59e0b' : '#06b6d4'}
              fontSize={13}
              fontWeight={700}
              tickLine={{ stroke: isDark ? '#10b981' : '#8b5cf6', strokeWidth: 2 }}
              axisLine={{ stroke: isDark ? '#f59e0b' : '#06b6d4', strokeWidth: 2 }}
              tick={{ 
                fill: isDark ? '#f59e0b' : '#06b6d4',
                fontWeight: 'bold',
                fontSize: 13
              }}
            />
            
            <YAxis 
              stroke={isDark ? '#8b5cf6' : '#10b981'}
              fontSize={13}
              fontWeight={700}
              tickLine={{ stroke: isDark ? '#f59e0b' : '#06b6d4', strokeWidth: 2 }}
              axisLine={{ stroke: isDark ? '#8b5cf6' : '#10b981', strokeWidth: 2 }}
              tick={{ 
                fill: isDark ? '#8b5cf6' : '#10b981',
                fontWeight: 'bold',
                fontSize: 13
              }}
              tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
            />
            
            <Tooltip content={hasData ? <CustomTooltip /> : undefined} />
            
            <Bar 
              dataKey="amount" 
              fill="url(#barGradient)" 
              radius={[8, 8, 0, 0]}
              stroke="none"
              strokeWidth={0}
              className={hasData ? 'drop-shadow-lg hover:cursor-pointer' : ''}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Overlay message when no data */}
        {!hasData && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-sm rounded-lg">
            <div className="text-center space-y-3 p-6">
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                isDark ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <BarChart3 className={`w-8 h-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <div className="space-y-1">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Monthly Contributions
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  Chart will populate after adding contributions to goals
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div 
        className="border-t pt-6" 
        style={{ borderColor: isDark ? '#374151' : '#e2e8f0' }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`text-center p-4 rounded-xl border ${
            mounted && isDark 
              ? 'bg-gray-800/50 border-green-700/30' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className={`text-2xl font-bold ${mounted && isDark ? 'text-green-400' : 'text-green-600'}`}>
              ₹{hasData ? Math.round((goals?.reduce((sum, goal) => sum + goal.currentAmount, 0) || 0) / 1000) : 0}K
            </div>
            <div className={`text-sm font-medium ${mounted && isDark ? 'text-green-300' : 'text-green-700'}`}>
              Total Saved
            </div>
          </div>
          
          <div className={`text-center p-4 rounded-xl border ${
            mounted && isDark 
              ? 'bg-gray-800/50 border-blue-700/30' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className={`text-2xl font-bold ${mounted && isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              ₹{hasData ? Math.round((goals?.reduce((sum, goal) => sum + goal.currentAmount, 0) || 0) / 6 / 1000) : 0}K
            </div>
            <div className={`text-sm font-medium ${mounted && isDark ? 'text-blue-300' : 'text-blue-700'}`}>
              Avg/Month
            </div>
          </div>
          
          <div className={`text-center p-4 rounded-xl border ${
            mounted && isDark 
              ? 'bg-gray-800/50 border-purple-700/30' 
              : 'bg-purple-50 border-purple-200'
          }`}>
            <div className={`text-2xl font-bold ${mounted && isDark ? 'text-purple-400' : 'text-purple-600'}`}>
              ₹{hasData ? Math.round((goals?.reduce((sum, goal) => sum + goal.currentAmount, 0) || 0) / 1000) : 0}K
            </div>
            <div className={`text-sm font-medium ${mounted && isDark ? 'text-purple-300' : 'text-purple-700'}`}>
              Best Month
            </div>
          </div>
          
          <div className={`text-center p-4 rounded-xl border ${
            mounted && isDark 
              ? 'bg-gray-800/50 border-orange-700/30' 
              : 'bg-orange-50 border-orange-200'
          }`}>
            <div className={`text-2xl font-bold ${mounted && isDark ? 'text-orange-400' : 'text-orange-600'}`}>
              {hasData && goals && goals.length > 0 ? 
                Math.round((goals.reduce((sum, goal) => sum + (goal.currentAmount / goal.targetAmount), 0) / goals.length) * 100) : 0}%
            </div>
            <div className={`text-sm font-medium ${mounted && isDark ? 'text-orange-300' : 'text-orange-700'}`}>
              Avg Progress
            </div>
          </div>
        </div>
        
        <div className={`mt-6 relative overflow-hidden rounded-2xl p-6 ${
          mounted && isDark 
            ? 'bg-gradient-to-br from-indigo-900/60 to-purple-900/40 border border-indigo-700/40' 
            : 'bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200'
        }`}>
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/5 rounded-full translate-y-12 -translate-x-12" />
          
          <div className="relative flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <h4 className={`text-lg font-bold ${mounted && isDark ? 'text-indigo-100' : 'text-indigo-900'}`}>
                  💡 Monthly Insight
                </h4>
                {hasData && (
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    mounted && isDark 
                      ? 'bg-green-400/20 text-green-300 border border-green-400/30' 
                      : 'bg-green-100 text-green-700 border border-green-200'
                  }`}>
                    ✨ Active
                  </div>
                )}
              </div>
              
              <div className={`prose prose-sm max-w-none ${
                mounted && isDark ? 'prose-invert' : ''
              }`}>
                <p className={`text-base leading-relaxed mb-0 ${mounted && isDark ? 'text-indigo-200' : 'text-indigo-700'}`}>
                  {hasData ? (
                    <>
                      🎯 You have successfully saved{' '}
                      <span className={`font-bold px-2 py-1 rounded-lg ${
                        mounted && isDark 
                          ? 'bg-indigo-400/20 text-indigo-100 border border-indigo-400/30' 
                          : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      }`}>
                        ₹{Math.round((goals?.reduce((sum, goal) => sum + goal.currentAmount, 0) || 0) / 1000)}K
                      </span>{' '}
                      towards your financial goals! Keep adding contributions to track your monthly progress and achieve your targets faster.
                    </>
                  ) : (
                    <>
                      🚀 Start adding contributions to your goals to unlock detailed insights, track your monthly progress, and watch your savings grow over time. Your financial journey begins with the first step!
                    </>
                  )}
                </p>
              </div>
              
              {hasData && (
                <div className={`mt-4 pt-4 border-t ${
                  mounted && isDark ? 'border-indigo-400/20' : 'border-indigo-200'
                }`}>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${mounted && isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
                      Next milestone in sight 🎖️
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-md ${
                      mounted && isDark 
                        ? 'bg-purple-400/20 text-purple-200' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      Keep saving!
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Savings Tips Section */}
        <div className={`mt-4 p-4 rounded-xl border ${
          mounted && isDark 
            ? 'bg-gradient-to-r from-emerald-900/40 to-teal-900/30 border border-emerald-700/40' 
            : 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200'
        }`}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h5 className={`font-semibold text-sm mb-2 ${mounted && isDark ? 'text-emerald-200' : 'text-emerald-800'}`}>
                💰 Smart Saving Tip
              </h5>
              <p className={`text-sm leading-relaxed ${mounted && isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                {hasData ? (
                  <>
                    Consider the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings. 
                    You&apos;re already on track with ₹{Math.round((goals?.reduce((sum, goal) => sum + goal.currentAmount, 0) || 0) / 1000)}K saved! 
                    Try increasing your contributions by just ₹500 monthly to accelerate your progress.
                  </>
                ) : (
                  <>
                    The secret to successful saving is consistency, not the amount. Start with just ₹100 per week - 
                    that&apos;s about the cost of two cups of coffee! Small amounts add up to big results over time.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const GoalCompletionChart: React.FC = () => {
  const { theme } = useTheme();
  const { goals } = useGoals();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isDark = mounted ? theme === 'dark' : false;
  const goalCompletionData = generateGoalCompletionData(goals);
  const hasGoals = goals && goals.length > 0;

  if (!hasGoals) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-4 p-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
          isDark ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <TrendingUp className={`w-8 h-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
        </div>
        <div className="space-y-2">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Goal Progress
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Progress bars will appear after creating and funding goals
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {goalCompletionData.map((goal, index) => {
        const progressBarStyle: CSSProperties = {
          width: `${Math.min(goal.completion, 100)}%`,
          background: `linear-gradient(90deg, ${goal.color} 0%, ${goal.color}dd 100%)`,
          boxShadow: `0 0 10px ${goal.color}40`
        };

        const progressColorStyle: CSSProperties = {
          color: goal.color
        };

        return (
          <div key={index} className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {goal.goal}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={progressColorStyle}>
                  {goal.completion.toFixed(0)}%
                </span>
                {goal.completion >= 100 && (
                  <Award className="w-4 h-4 text-yellow-500" />
                )}
              </div>
            </div>
            
            <div className={`w-full rounded-full h-3 shadow-inner ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div
                className="h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={progressBarStyle}
              />
            </div>
            
            {/* Progress Details */}
            <div className="flex justify-between items-center text-xs">
              <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                ₹{goal.current.toLocaleString()} of ₹{goal.target.toLocaleString()}
              </span>
              <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                ₹{(goal.target - goal.current).toLocaleString()} remaining
              </span>
            </div>
          </div>
        );
      })}
      
      {/* Summary section for completed goals */}
      {goalCompletionData.some(goal => goal.completion >= 100) && (
        <div className={`mt-6 p-4 rounded-xl border ${
          isDark ? 'bg-green-900/20 border-green-700/30' : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center gap-3">
            <Award className={`w-8 h-8 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            <div>
              <h4 className={`font-semibold ${isDark ? 'text-green-200' : 'text-green-800'}`}>
                🎉 Congratulations!
              </h4>
              <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                You&apos;ve completed {goalCompletionData.filter(goal => goal.completion >= 100).length} of your savings goals. 
                Keep up the excellent work!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};