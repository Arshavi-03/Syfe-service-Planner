export const CURRENCIES = ['INR', 'USD'] as const;
export type Currency = typeof CURRENCIES[number];

export const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
} as const;

export const CURRENCY_NAMES = {
  INR: 'Indian Rupee',
  USD: 'US Dollar',
} as const;

export const EXCHANGE_API_BASE_URL = process.env.NEXT_PUBLIC_EXCHANGE_API_URL || 'https://v6.exchangerate-api.com/v6';

export const LOCAL_STORAGE_KEYS = {
  GOALS: 'syfe-savings-planner-goals',
  EXCHANGE_RATE: 'syfe-savings-planner-exchange-rate',
} as const;

export const APP_CONFIG = {
  NAME: 'Syfe Savings Planner',
  TAGLINE: 'Track your financial goals and build your future',
  EXCHANGE_CACHE_DURATION: 6 * 60 * 60 * 1000, // 6 hours in milliseconds
  MAX_GOALS: 10,
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 10000000,
} as const;

export const THEME_COLORS = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
  }
} as const;