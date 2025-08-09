import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/utils/toast';
import { track, peopleSet } from '@/lib/analytics/mixpanel';

interface SubscriptionState {
  loading: boolean;
  subscribed: boolean;
  tier: string | null;
  currentUsage: number;
  limit: number | null; // null = unlimited
}

interface SubscriptionContextValue extends SubscriptionState {
  refreshAll: () => Promise<void>;
  refreshUsage: () => Promise<void>;
  checkout: () => Promise<void>;
  managePortal: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SubscriptionState>({
    loading: true,
    subscribed: false,
    tier: null,
    currentUsage: 0,
    limit: 10, // sensible default for UI until fetched
  });
  // Simple retry wrapper for edge functions
  const invokeWithRetry = async (fnName: string, options?: any, retries = 1) => {
    let attempt = 0;
    let lastError: any = null;
    while (attempt <= retries) {
      const { data, error } = await supabase.functions.invoke(fnName, options);
      if (!error) return { data, error: null } as const;
      lastError = error;
      attempt++;
      if (attempt <= retries) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }
    return { data: null, error: lastError } as const;
  };

  const fetchUsage = useCallback(async () => {
    const { data, error } = await invokeWithRetry('usage-status');
    if (error) {
      console.warn('usage-status error:', error);
      return;
    }
    if (data) {
      setState(prev => ({
        ...prev,
        currentUsage: data.currentUsage ?? 0,
        limit: data.limit ?? null,
      }));
      try {
        peopleSet({
          usage_current: data.currentUsage ?? 0,
          usage_limit: data.limit ?? null,
        });
      } catch {}
    }
  }, []);

  const fetchSubscription = useCallback(async () => {
    const { data, error } = await invokeWithRetry('check-subscription');
    if (error) {
      console.warn('check-subscription error:', error);
      return;
    }
    if (data) {
      setState(prev => ({
        ...prev,
        subscribed: Boolean(data.subscribed),
        tier: data.subscription_tier ?? null,
      }));
      try {
        peopleSet({
          plan_tier: data.subscription_tier ?? null,
          subscribed: Boolean(data.subscribed),
        });
      } catch {}
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    await Promise.allSettled([fetchUsage(), fetchSubscription()]);
    setState(prev => ({ ...prev, loading: false }));
  }, [fetchUsage, fetchSubscription]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const refreshUsage = useCallback(async () => {
    await fetchUsage();
  }, [fetchUsage]);

  const checkout = useCallback(async () => {
    const { data, error } = await supabase.functions.invoke('create-checkout');
    if (error || !data?.url) {
      toast.error('Unable to start checkout right now. Please try again.');
      return;
    }
    track('Checkout Opened', { tier: state.tier, subscribed: state.subscribed });
    window.open(data.url, '_blank');
  }, []);

  const managePortal = useCallback(async () => {
    const { data, error } = await supabase.functions.invoke('customer-portal');
    if (error || !data?.url) {
      toast.error('Unable to open customer portal right now.');
      return;
    }
    window.open(data.url, '_blank');
  }, []);

  const value = useMemo<SubscriptionContextValue>(() => ({
    ...state,
    refreshAll,
    refreshUsage,
    checkout,
    managePortal,
  }), [state, refreshAll, refreshUsage, checkout, managePortal]);

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
};
