'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { 
  Home, 
  Target, 
  Settings, 
  User,
  PieChart,
  Wallet,
  CreditCard,
  BarChart3,
  Sun,
  Moon,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'goals', label: 'My Goals', icon: Target },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'transactions', label: 'Transactions', icon: CreditCard },
  { id: 'portfolio', label: 'Portfolio', icon: PieChart },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Get icon colors
  const getIconColor = (iconName: string, isActive: boolean, isDark: boolean) => {
    if (isActive) return 'text-white';
    
    if (isDark) {
      return 'text-slate-400 group-hover/item:text-blue-400';
    } else {
      // Light mode colorful icons
      switch (iconName) {
        case 'Home':
          return 'text-gray-500 group-hover/item:text-green-500';
        case 'Target':
          return 'text-gray-500 group-hover/item:text-red-500';
        case 'BarChart3':
          return 'text-gray-500 group-hover/item:text-purple-500';
        case 'CreditCard':
          return 'text-gray-500 group-hover/item:text-blue-500';
        case 'PieChart':
          return 'text-gray-500 group-hover/item:text-orange-500';
        case 'Wallet':
          return 'text-gray-500 group-hover/item:text-cyan-500';
        default:
          return 'text-gray-500 group-hover/item:text-blue-500';
      }
    }
  };

  const SidebarContent = () => {
    // Show loading state until mounted to prevent hydration mismatch
    if (!mounted) {
      return (
        <div className="flex flex-col h-full bg-white border-r shadow-xl w-full animate-pulse">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gray-200 rounded-xl"></div>
              {!isCollapsed && (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 space-y-2 flex-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200 space-y-2">
            <div className="h-12 bg-gray-200 rounded-xl"></div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
            <div className="h-16 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      );
    }

    const isDark = theme === 'dark';
    
    return (
      <div className={cn(
        "flex flex-col h-full transition-all duration-300 relative",
        isDark 
          ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900' 
          : 'bg-gradient-to-b from-white via-gray-50 to-white',
        "border-r shadow-xl backdrop-blur-sm",
        isDark ? 'border-slate-700/50' : 'border-gray-200/80'
      )}>
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br",
            isDark 
              ? 'from-blue-600/10 via-purple-600/5 to-cyan-600/10' 
              : 'from-blue-500/5 via-purple-500/5 to-cyan-500/5'
          )} />
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-500/10 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-purple-500/10 to-transparent" />
        </div>

        {/* Header */}
        <div className={cn(
          "relative z-10 flex items-center justify-between p-6 border-b",
          isDark ? 'border-slate-700/30' : 'border-gray-200/50'
        )}>
          <div className={cn(
            "flex items-center gap-3 transition-all duration-300",
            isCollapsed && "justify-center"
          )}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-11 h-11 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-lg">💰</span>
              </div>
            </div>
            {!isCollapsed && (
              <div className="transition-all duration-300 opacity-100">
                <h1 className={cn(
                  "text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent",
                  isDark 
                    ? 'from-white to-blue-200' 
                    : 'from-gray-900 to-blue-600'
                )} suppressHydrationWarning>
                  Syfe Planner
                </h1>
                <p className={cn(
                  "text-xs font-medium",
                  isDark ? 'text-slate-400' : 'text-gray-500'
                )} suppressHydrationWarning>
                  Financial Goals
                </p>
              </div>
            )}
          </div>
          
          {/* Toggle Button - FIXED ACCESSIBILITY */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "hidden lg:flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 group",
              "backdrop-blur-sm border shadow-lg transform hover:scale-105",
              isDark 
                ? 'bg-slate-800/80 border-slate-600/50 hover:bg-slate-700/80 text-slate-300 hover:text-white' 
                : 'bg-white/80 border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900'
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            ) : (
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            )}
          </button>
        </div>

        {/* Navigation - FIXED ICON ALIGNMENT */}
        <nav className="relative z-10 flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <div key={item.id} className="relative group">
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full" />
                )}
                
                <button
                  onClick={() => {
                    onTabChange(item.id);
                    setIsMobileOpen(false);
                  }}
                  aria-label={item.label}
                  title={item.label}
                  className={cn(
                    'w-full flex items-center text-left transition-all duration-300 group/item relative overflow-hidden',
                    'transform hover:scale-[1.02] active:scale-[0.98] rounded-xl',
                    // FIXED: Proper alignment for both states
                    isCollapsed 
                      ? 'justify-center px-3 py-3.5' 
                      : 'justify-start gap-3 px-4 py-3.5',
                    isActive 
                      ? cn(
                          'shadow-lg backdrop-blur-sm border',
                          isDark
                            ? 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white border-blue-500/30'
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-200'
                        )
                      : cn(
                          'backdrop-blur-sm border border-transparent',
                          isDark
                            ? 'hover:bg-slate-800/60 hover:border-slate-600/30 text-slate-300 hover:text-white'
                            : 'hover:bg-white/60 hover:border-gray-200/50 text-gray-600 hover:text-gray-900'
                        )
                  )}
                >
                  {/* Hover glow effect */}
                  <div className={cn(
                    "absolute inset-0 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300",
                    !isActive && (isDark 
                      ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20' 
                      : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10')
                  )} />
                  
                  {/* Icon - CENTERED when collapsed */}
                  <Icon className={cn(
                    "w-5 h-5 transition-all duration-300 flex-shrink-0 relative z-10",
                    getIconColor(Icon.name, isActive, isDark),
                    "group-hover/item:scale-110"
                  )} />
                  
                  {/* Label - only show when not collapsed */}
                  {!isCollapsed && (
                    <span className={cn(
                      "font-medium transition-all duration-300 text-sm relative z-10",
                      isActive 
                        ? 'text-white' 
                        : isDark
                          ? 'text-slate-300 group-hover/item:text-white'
                          : 'text-gray-600 group-hover/item:text-gray-900'
                    )} suppressHydrationWarning>
                      {item.label}
                    </span>
                  )}
                  
                  {/* Active dot */}
                  {isActive && !isCollapsed && (
                    <div className="absolute right-4 w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </button>
              </div>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className={cn(
          "relative z-10 p-4 border-t space-y-2",
          isDark ? 'border-slate-700/50' : 'border-gray-200/50'
        )}>
          {/* Theme Toggle - FIXED ACCESSIBILITY */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={cn(
              'w-full flex items-center rounded-xl text-left transition-all duration-300 group/theme',
              'backdrop-blur-sm border border-transparent transform hover:scale-[1.02]',
              isDark
                ? 'hover:bg-slate-800/60 hover:border-slate-600/30 text-slate-300 hover:text-white'
                : 'hover:bg-white/60 hover:border-gray-200/50 text-gray-600 hover:text-gray-900',
              isCollapsed ? 'justify-center px-3 py-3' : 'justify-start gap-3 px-4 py-3'
            )}
          >
            <div className="relative">
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400 flex-shrink-0 transition-transform group-hover/theme:rotate-12" />
              ) : (
                <Moon className="w-5 h-5 text-blue-500 flex-shrink-0 transition-transform group-hover/theme:-rotate-12" />
              )}
            </div>
            {!isCollapsed && (
              <span className="font-medium text-sm transition-colors duration-300" suppressHydrationWarning>
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </button>

          {/* Settings - FIXED ACCESSIBILITY */}
          <button
            aria-label="Open settings"
            title="Settings"
            className={cn(
              'w-full flex items-center rounded-xl text-left transition-all duration-300 group/settings',
              'backdrop-blur-sm border border-transparent transform hover:scale-[1.02]',
              isDark
                ? 'hover:bg-slate-800/60 hover:border-slate-600/30 text-slate-300 hover:text-white'
                : 'hover:bg-white/60 hover:border-gray-200/50 text-gray-600 hover:text-gray-900',
              isCollapsed ? 'justify-center px-3 py-3' : 'justify-start gap-3 px-4 py-3'
            )}
          >
            <Settings className="w-5 h-5 flex-shrink-0 transition-transform group-hover/settings:rotate-90" />
            {!isCollapsed && (
              <span className="font-medium text-sm" suppressHydrationWarning>Settings</span>
            )}
          </button>

          {/* User Profile */}
          <div
            className={cn(
              'w-full flex items-center rounded-xl border transition-all duration-300',
              'backdrop-blur-sm shadow-lg',
              isDark
                ? 'bg-slate-800/60 border-slate-600/50'
                : 'bg-white/60 border-gray-200/50',
              isCollapsed ? 'justify-center px-3 py-3' : 'justify-start gap-3 px-4 py-3'
            )}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 transform group-hover:scale-105 transition-transform duration-200">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex-1 text-left min-w-0">
                <p className={cn(
                  "font-semibold text-sm truncate",
                  isDark ? 'text-white' : 'text-gray-900'
                )} suppressHydrationWarning>
                  User
                </p>
                <p className={cn(
                  "text-xs font-medium",
                  isDark ? 'text-slate-400' : 'text-gray-500'
                )} suppressHydrationWarning>
                  Premium User
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        'hidden lg:flex flex-col h-full transition-all duration-300 relative z-20',
        isCollapsed ? 'w-20' : 'w-72'
      )}>
        <SidebarContent />
      </div>

      {/* Mobile Menu Button - FIXED ACCESSIBILITY */}
      <button
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open navigation menu"
        title="Open menu"
        className={cn(
          "lg:hidden fixed top-4 left-4 z-50 rounded-xl p-3 shadow-xl backdrop-blur-sm border transition-all duration-200",
          "transform hover:scale-105 active:scale-95",
          mounted && theme === 'dark'
            ? 'bg-slate-800/90 border-slate-600/50 text-white'
            : 'bg-white/90 border-gray-200 text-gray-900'
        )}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        'lg:hidden fixed left-0 top-0 h-full w-72 z-50 transform transition-transform duration-300',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close navigation menu"
            title="Close menu"
            className={cn(
              "p-2 rounded-xl shadow-xl backdrop-blur-sm border transition-all duration-200",
              "transform hover:scale-105 active:scale-95",
              mounted && theme === 'dark'
                ? 'bg-slate-800/90 border-slate-600/50 text-white'
                : 'bg-white/90 border-gray-200 text-gray-900'
            )}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;