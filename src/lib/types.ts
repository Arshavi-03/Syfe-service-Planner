export type Currency = 'INR' | 'USD';

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currency: Currency;
  currentAmount: number;
  contributions: Contribution[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Contribution {
  id: string;
  amount: number;
  date: Date;
  note?: string;
}

export interface ExchangeRate {
  base: Currency;
  rates: {
    INR: number;
    USD: number;
  };
  lastUpdated: Date;
}

export interface DashboardStats {
  totalTargetINR: number;
  totalTargetUSD: number;
  totalSavedINR: number;
  totalSavedUSD: number;
  overallProgress: number;
  goalCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ExchangeApiResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: {
    [key: string]: number;
  };
}