import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { UserProfile, CreditInfo, LoanApplication, ActiveLoan, LoanOffer } from '@/types';
import { lenders } from '@/mocks/loanData';

export type SubscriptionTier = 'basic' | 'plus' | 'pro';

interface AppState {
  userProfile: UserProfile | null;
  creditInfo: CreditInfo | null;
  applications: LoanApplication[];
  activeLoans: ActiveLoan[];
  isOnboarded: boolean;
  isLoading: boolean;
  
  subscriptionTier: SubscriptionTier;
  tokens: number;
  tokensRefreshDate: string | null;
  isPremium: boolean;
  hasConnectedBank: boolean;
  hasConnectedExperian: boolean;
  hasRatedApp: boolean;
  lastRatingPromptDate: string | null;
  bankConnectionDismissed: boolean;
  notificationsEnabled: boolean;

  setUserProfile: (profile: UserProfile) => void;
  setCreditInfo: (credit: CreditInfo) => void;
  addApplication: (application: LoanApplication) => void;
  updateApplication: (id: string, updates: Partial<LoanApplication>) => void;
  completeOnboarding: () => void;
  applyForLoan: (offer: LoanOffer) => void;
  reset: () => void;

  upgradeToPremium: () => void;
  upgradeTier: (tier: SubscriptionTier) => void;
  consumeToken: () => boolean;
  addTokens: (count: number) => void;
  connectBank: () => void;
  connectExperian: () => void;
  dismissBankConnection: () => void;
  rateApp: () => void;
  snoozeRating: () => void;
  toggleNotifications: (enabled: boolean) => void;
}

const STORAGE_KEY = '@loanagent_app_state';

const safeJSONParse = (str: string | null | undefined): any => {
  if (!str || typeof str !== 'string') {
    return null;
  }
  const trimmed = str.trim();
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null' || trimmed === '[object Object]') {
    return null;
  }
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
    return null;
  }
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }
    return parsed;
  } catch (err) {
    console.log('[AppContext] JSON parse error:', err);
    return null;
  }
};

export const [AppProvider, useApp] = createContextHook((): AppState => {
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [creditInfo, setCreditInfoState] = useState<CreditInfo | null>(null);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [activeLoans, setActiveLoans] = useState<ActiveLoan[]>([]);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // New state initializers
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('basic');
  const [tokens, setTokens] = useState(5);
  const [tokensRefreshDate, setTokensRefreshDate] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [hasConnectedBank, setHasConnectedBank] = useState(false);
  const [hasConnectedExperian, setHasConnectedExperian] = useState(false);
  const [hasRatedApp, setHasRatedApp] = useState(false);
  const [lastRatingPromptDate, setLastRatingPromptDate] = useState<string | null>(null);
  const [bankConnectionDismissed, setBankConnectionDismissed] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const getSampleActiveLoans = useCallback((): ActiveLoan[] => {
    return [
      {
        id: 'loan-1',
        loanType: 'auto',
        lender: lenders.chaseBank,
        originalAmount: 25000,
        currentBalance: 18500,
        interestRate: 4.99,
        monthlyPayment: 467,
        nextPaymentDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        paymentsRemaining: 42,
        totalPayments: 60,
        startDate: new Date(Date.now() - 18 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'loan-2',
        loanType: 'personal',
        lender: lenders.sofi,
        originalAmount: 10000,
        currentBalance: 6200,
        interestRate: 7.25,
        monthlyPayment: 312,
        nextPaymentDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
        paymentsRemaining: 21,
        totalPayments: 36,
        startDate: new Date(Date.now() - 15 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }, []);

  const loadState = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const state = safeJSONParse(stored);
      
      if (state) {
        setUserProfileState(state.userProfile || null);
        setCreditInfoState(state.creditInfo || null);
        setApplications(Array.isArray(state.applications) ? state.applications : []);
        setActiveLoans(Array.isArray(state.activeLoans) && state.activeLoans.length > 0 ? state.activeLoans : getSampleActiveLoans());
        setIsOnboarded(state.isOnboarded === true);
        
        const validTiers = ['basic', 'plus', 'pro'];
        setSubscriptionTier(validTiers.includes(state.subscriptionTier) ? state.subscriptionTier : 'basic');
        setTokens(typeof state.tokens === 'number' ? state.tokens : 5);
        setTokensRefreshDate(typeof state.tokensRefreshDate === 'string' ? state.tokensRefreshDate : null);
        setIsPremium(state.isPremium === true);
        setHasConnectedBank(state.hasConnectedBank === true);
        setHasConnectedExperian(state.hasConnectedExperian === true);
        setHasRatedApp(state.hasRatedApp === true);
        setLastRatingPromptDate(typeof state.lastRatingPromptDate === 'string' ? state.lastRatingPromptDate : null);
        setBankConnectionDismissed(state.bankConnectionDismissed === true);
        setNotificationsEnabled(state.notificationsEnabled !== false);
      } else {
        if (stored) {
          console.log('Clearing corrupted storage data');
          await AsyncStorage.removeItem(STORAGE_KEY);
        }
        setActiveLoans(getSampleActiveLoans());
      }
    } catch (error) {
      console.error('Failed to load app state:', error);
      await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
      setActiveLoans(getSampleActiveLoans());
    } finally {
      setIsLoading(false);
    }
  }, [getSampleActiveLoans]);

  useEffect(() => {
    loadState();
  }, [loadState]);

  const saveState = async (state: Partial<AppState>) => {
    try {
      const current = await AsyncStorage.getItem(STORAGE_KEY);
      const currentState = safeJSONParse(current) || {};
      
      const cleanState: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(state)) {
        if (typeof value !== 'function') {
          cleanState[key] = value;
        }
      }
      
      const newState = { ...currentState, ...cleanState };
      const jsonString = JSON.stringify(newState);
      
      if (typeof jsonString === 'string' && jsonString.startsWith('{')) {
        await AsyncStorage.setItem(STORAGE_KEY, jsonString);
      }
    } catch (error) {
      console.error('Failed to save app state:', error);
    }
  };

  const setUserProfile = useCallback((profile: UserProfile) => {
    setUserProfileState(profile);
    saveState({ userProfile: profile });
  }, []);

  const setCreditInfo = useCallback((credit: CreditInfo) => {
    setCreditInfoState(credit);
    saveState({ creditInfo: credit });
  }, []);

  const addApplication = useCallback((application: LoanApplication) => {
    setApplications(prev => {
      const updated = [...prev, application];
      saveState({ applications: updated });
      return updated;
    });
  }, []);

  const updateApplication = useCallback((id: string, updates: Partial<LoanApplication>) => {
    setApplications(prev => {
      const updated = prev.map((app) =>
        app.id === id ? { ...app, ...updates } : app
      );
      saveState({ applications: updated });
      return updated;
    });
  }, []);

  const completeOnboarding = useCallback(() => {
    setIsOnboarded(true);
    saveState({ isOnboarded: true });
  }, []);

  const applyForLoan = useCallback((offer: LoanOffer) => {
    const application: LoanApplication = {
      id: `app-${Date.now()}`,
      loanType: offer.loanType,
      lender: offer.lender,
      amount: offer.amount,
      status: 'submitted',
      submittedDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      interestRate: offer.interestRate,
      termMonths: offer.termMonths,
      monthlyPayment: offer.monthlyPayment,
      statusHistory: [
        {
          status: 'submitted',
          date: new Date().toISOString(),
          note: 'Application submitted successfully',
        },
      ],
    };
    addApplication(application);
  }, [addApplication]);

  const upgradeToPremium = useCallback(() => {
    setIsPremium(true);
    saveState({ isPremium: true });
  }, []);

  const upgradeTier = useCallback((tier: SubscriptionTier) => {
    setSubscriptionTier(tier);
    const isPremiumUser = tier === 'plus' || tier === 'pro';
    setIsPremium(isPremiumUser);
    
    let newTokens = 5;
    if (tier === 'plus') {
      newTokens = 20;
    } else if (tier === 'pro') {
      newTokens = 80;
    }
    setTokens(newTokens);
    
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    setTokensRefreshDate(nextMonth.toISOString());
    
    saveState({ 
      subscriptionTier: tier, 
      isPremium: isPremiumUser, 
      tokens: newTokens,
      tokensRefreshDate: nextMonth.toISOString()
    });
  }, []);

  const consumeToken = useCallback((): boolean => {
    if (tokens <= 0) {
      return false;
    }
    const newTokens = tokens - 1;
    setTokens(newTokens);
    saveState({ tokens: newTokens });
    return true;
  }, [tokens]);

  const addTokens = useCallback((count: number) => {
    const newTokens = tokens + count;
    setTokens(newTokens);
    saveState({ tokens: newTokens });
  }, [tokens]);

  const connectBank = useCallback(() => {
    setHasConnectedBank(true);
    saveState({ hasConnectedBank: true });
  }, []);

  const connectExperian = useCallback(() => {
    setHasConnectedExperian(true);
    saveState({ hasConnectedExperian: true });
  }, []);

  const dismissBankConnection = useCallback(() => {
    setBankConnectionDismissed(true);
    saveState({ bankConnectionDismissed: true });
  }, []);

  const rateApp = useCallback(() => {
    setHasRatedApp(true);
    saveState({ hasRatedApp: true });
  }, []);

  const snoozeRating = useCallback(() => {
    const now = new Date().toISOString();
    setLastRatingPromptDate(now);
    saveState({ lastRatingPromptDate: now });
  }, []);

  const toggleNotifications = useCallback((enabled: boolean) => {
    setNotificationsEnabled(enabled);
    saveState({ notificationsEnabled: enabled });
  }, []);

  const reset = useCallback(async () => {
    setUserProfileState(null);
    setCreditInfoState(null);
    setApplications([]);
    setActiveLoans([]);
    setIsOnboarded(false);
    setSubscriptionTier('basic');
    setTokens(5);
    setTokensRefreshDate(null);
    setIsPremium(false);
    setHasConnectedBank(false);
    setHasRatedApp(false);
    setLastRatingPromptDate(null);
    setBankConnectionDismissed(false);
    setNotificationsEnabled(true);
    setIsLoading(false);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  return useMemo(() => ({
    userProfile,
    creditInfo,
    applications,
    activeLoans,
    isOnboarded,
    isLoading,
    subscriptionTier,
    tokens,
    tokensRefreshDate,
    isPremium,
    hasConnectedBank,
    hasConnectedExperian,
    hasRatedApp,
    lastRatingPromptDate,
    bankConnectionDismissed,
    notificationsEnabled,
    setUserProfile,
    setCreditInfo,
    addApplication,
    updateApplication,
    completeOnboarding,
    applyForLoan,
    reset,
    upgradeToPremium,
    upgradeTier,
    consumeToken,
    addTokens,
    connectBank,
    connectExperian,
    dismissBankConnection,
    rateApp,
    snoozeRating,
    toggleNotifications,
  }), [
    userProfile, creditInfo, applications, activeLoans, isOnboarded, isLoading,
    subscriptionTier, tokens, tokensRefreshDate,
    isPremium, hasConnectedBank, hasConnectedExperian, hasRatedApp, lastRatingPromptDate, bankConnectionDismissed, notificationsEnabled,
    setUserProfile, setCreditInfo, addApplication, updateApplication, completeOnboarding, applyForLoan, reset,
    upgradeToPremium, upgradeTier, consumeToken, addTokens, connectBank, connectExperian, dismissBankConnection, rateApp, snoozeRating, toggleNotifications
  ]);
});
