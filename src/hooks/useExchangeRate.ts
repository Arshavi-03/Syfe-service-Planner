'use client';

import { useState, useEffect, useCallback } from 'react';
import { ExchangeRate } from '@/lib/types';

export function useExchangeRate() {
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchExchangeRate = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch exchange rates from the API
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_API_KEY}/latest/USD`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Fixed: Added the missing 'base' property
      const newExchangeRate: ExchangeRate = {
        base: 'USD', // Added the required base property
        rates: {
          INR: data.conversion_rates.INR,
          USD: data.conversion_rates.USD || 1
        },
        lastUpdated: new Date()
      };

      setExchangeRate(newExchangeRate);
      setLastUpdated(new Date());
      
      // Cache the rate
      localStorage.setItem('exchangeRate', JSON.stringify(newExchangeRate));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch exchange rate';
      setError(errorMessage);
      console.error('Exchange rate fetch error:', err);
      
      // Try to use cached data if API fails
      const cached = localStorage.getItem('exchangeRate');
      if (cached) {
        try {
          const cachedData = JSON.parse(cached);
          setExchangeRate(cachedData);
          setError('Using cached exchange rate data');
        } catch (parseError) {
          console.error('Failed to parse cached exchange rate:', parseError);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshRate = useCallback(() => {
    fetchExchangeRate();
  }, [fetchExchangeRate]);

  useEffect(() => {
    // Load cached data first, then fetch fresh data
    const cached = localStorage.getItem('exchangeRate');
    if (cached) {
      try {
        const cachedData = JSON.parse(cached);
        // Ensure cached data has the base property for backwards compatibility
        if (!cachedData.base) {
          cachedData.base = 'USD';
        }
        setExchangeRate(cachedData);
      } catch (e) {
        console.error('Failed to parse cached exchange rate:', e);
      }
    }
    
    fetchExchangeRate();
  }, [fetchExchangeRate]);

  return {
    exchangeRate,
    loading,
    error,
    lastUpdated,
    refreshRate
  };
}