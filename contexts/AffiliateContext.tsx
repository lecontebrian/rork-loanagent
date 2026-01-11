import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  AffiliateProfile,
  Referral,
  AffiliateCommission,
  AffiliateTier,
  AffiliateAnalytics,
  AffiliatePayout,
} from '@/types';

interface AffiliateState {
  affiliateProfile: AffiliateProfile | null;
  referrals: Referral[];
  commissions: AffiliateCommission[];
  payouts: AffiliatePayout[];
  analytics: AffiliateAnalytics | null;
  isAffiliate: boolean;
  enrollAsAffiliate: (userId: string, email: string) => Promise<void>;
  getReferralLink: () => string;
  loadAffiliateData: () => Promise<void>;
  requestPayout: (amount: number, method: AffiliatePayout['method']) => Promise<void>;
}

const STORAGE_KEY = '@loanagent_affiliate_state';

const safeJSONParse = (str: string): any => {
  if (!str || typeof str !== 'string') return null;
  const trimmed = str.trim();
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null' || trimmed === '[object Object]') return null;
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return null;
  try {
    const parsed = JSON.parse(trimmed);
    return typeof parsed === 'object' && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
};

const affiliateTiers: AffiliateTier[] = [
  {
    tier: 'starter',
    name: 'Starter',
    minReferrals: 0,
    registrationBonus: 10,
    applicationCommission: 25,
    fundingCommission: 100,
    monthlyBonus: 0,
    benefits: [
      '$10 per registration',
      '$25 per loan application',
      '$100 per funded loan',
      'Basic analytics dashboard',
    ],
    color: '#8E8E93',
  },
  {
    tier: 'pro',
    name: 'Pro',
    minReferrals: 10,
    registrationBonus: 15,
    applicationCommission: 35,
    fundingCommission: 150,
    monthlyBonus: 50,
    benefits: [
      '$15 per registration',
      '$35 per loan application',
      '$150 per funded loan',
      '$50 monthly performance bonus',
      'Advanced analytics',
      'Priority support',
    ],
    color: '#0A84FF',
  },
  {
    tier: 'elite',
    name: 'Elite',
    minReferrals: 50,
    registrationBonus: 20,
    applicationCommission: 50,
    fundingCommission: 200,
    monthlyBonus: 200,
    benefits: [
      '$20 per registration',
      '$50 per loan application',
      '$200 per funded loan',
      '$200 monthly performance bonus',
      'Dedicated account manager',
      'Custom marketing materials',
      'Early access to new features',
    ],
    color: '#BF5AF2',
  },
  {
    tier: 'platinum',
    name: 'Platinum',
    minReferrals: 100,
    registrationBonus: 30,
    applicationCommission: 75,
    fundingCommission: 300,
    monthlyBonus: 500,
    benefits: [
      '$30 per registration',
      '$75 per loan application',
      '$300 per funded loan',
      '$500 monthly performance bonus',
      'Exclusive partnership opportunities',
      'Speaking & event opportunities',
      'Revenue sharing on long-term clients',
      'VIP platform features',
    ],
    color: '#FFD700',
  },
];

const generateReferralCode = (email: string): string => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const emailPrefix = email.split('@')[0].substring(0, 4).toUpperCase();
  return `${emailPrefix}${random}`;
};

const getSampleReferrals = (): Referral[] => {
  return [
    {
      id: 'ref-1',
      affiliateId: 'aff-1',
      referredUserId: 'user-1',
      referredUserName: 'John Smith',
      status: 'funded',
      commission: 250,
      commissionStatus: 'earned',
      loanAmount: 15000,
      loanType: 'personal',
      registeredDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      fundedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivityDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'ref-2',
      affiliateId: 'aff-1',
      referredUserId: 'user-2',
      referredUserName: 'Sarah Johnson',
      status: 'applied',
      commission: 35,
      commissionStatus: 'earned',
      loanAmount: 8000,
      loanType: 'auto',
      registeredDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivityDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'ref-3',
      affiliateId: 'aff-1',
      referredUserId: 'user-3',
      referredUserName: 'Michael Davis',
      status: 'registered',
      commission: 15,
      commissionStatus: 'earned',
      registeredDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivityDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
};

const getSampleCommissions = (): AffiliateCommission[] => {
  return [
    {
      id: 'comm-1',
      affiliateId: 'aff-1',
      referralId: 'ref-1',
      amount: 15,
      type: 'registration',
      status: 'paid',
      earnedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      paidDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Registration bonus for John Smith',
    },
    {
      id: 'comm-2',
      affiliateId: 'aff-1',
      referralId: 'ref-1',
      amount: 35,
      type: 'application',
      status: 'paid',
      earnedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      paidDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Application commission for John Smith',
    },
    {
      id: 'comm-3',
      affiliateId: 'aff-1',
      referralId: 'ref-1',
      amount: 150,
      type: 'funding',
      status: 'approved',
      earnedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Funding commission for John Smith - $15,000 loan',
    },
    {
      id: 'comm-4',
      affiliateId: 'aff-1',
      referralId: 'ref-2',
      amount: 15,
      type: 'registration',
      status: 'approved',
      earnedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Registration bonus for Sarah Johnson',
    },
    {
      id: 'comm-5',
      affiliateId: 'aff-1',
      referralId: 'ref-2',
      amount: 35,
      type: 'application',
      status: 'approved',
      earnedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Application commission for Sarah Johnson',
    },
    {
      id: 'comm-6',
      affiliateId: 'aff-1',
      referralId: 'ref-3',
      amount: 15,
      type: 'registration',
      status: 'approved',
      earnedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Registration bonus for Michael Davis',
    },
  ];
};

const calculateTier = (totalReferrals: number): AffiliateTier['tier'] => {
  if (totalReferrals >= 100) return 'platinum';
  if (totalReferrals >= 50) return 'elite';
  if (totalReferrals >= 10) return 'pro';
  return 'starter';
};

const getSampleAnalytics = (): AffiliateAnalytics => {
  return {
    period: 'month',
    clicks: 124,
    registrations: 8,
    applications: 5,
    funded: 2,
    earnings: 450,
    conversionRate: 6.45,
    avgLoanAmount: 11500,
    topPerformingChannel: 'Social Media',
  };
};

export const [AffiliateProvider, useAffiliate] = createContextHook((): AffiliateState => {
  const [affiliateProfile, setAffiliateProfile] = useState<AffiliateProfile | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [commissions, setCommissions] = useState<AffiliateCommission[]>([]);
  const [payouts, setPayouts] = useState<AffiliatePayout[]>([]);
  const [analytics, setAnalytics] = useState<AffiliateAnalytics | null>(null);

  useEffect(() => {
    const initState = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        const state = safeJSONParse(stored || '');
        
        if (state) {
          setAffiliateProfile(state.affiliateProfile || null);
          setReferrals(Array.isArray(state.referrals) ? state.referrals : []);
          setCommissions(Array.isArray(state.commissions) ? state.commissions : []);
          setPayouts(Array.isArray(state.payouts) ? state.payouts : []);
          setAnalytics(state.analytics || null);
        } else if (stored) {
          console.log('Clearing corrupted affiliate storage data');
          await AsyncStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error('Failed to load affiliate state:', error);
        await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
      }
    };
    initState();
  }, []);



  const saveState = async (state: Partial<AffiliateState>) => {
    try {
      const current = await AsyncStorage.getItem(STORAGE_KEY);
      const currentState = safeJSONParse(current || '') || {};
      
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
      console.error('Failed to save affiliate state:', error);
    }
  };

  const enrollAsAffiliate = useCallback(async (userId: string, email: string) => {
    const referralCode = generateReferralCode(email);
    const newProfile: AffiliateProfile = {
      id: `aff-${Date.now()}`,
      userId,
      referralCode,
      tier: 'starter',
      totalReferrals: 0,
      activeReferrals: 0,
      totalEarnings: 0,
      pendingEarnings: 0,
      lifetimeEarnings: 0,
      joinedDate: new Date().toISOString(),
    };

    setAffiliateProfile(newProfile);
    const sampleReferrals = getSampleReferrals();
    const sampleCommissions = getSampleCommissions();
    const sampleAnalytics = getSampleAnalytics();

    const totalEarnings = sampleCommissions
      .filter(c => c.status === 'paid')
      .reduce((sum, c) => sum + c.amount, 0);
    const pendingEarnings = sampleCommissions
      .filter(c => c.status === 'approved')
      .reduce((sum, c) => sum + c.amount, 0);

    const updatedProfile: AffiliateProfile = {
      ...newProfile,
      totalReferrals: sampleReferrals.length,
      activeReferrals: sampleReferrals.filter(r => r.status !== 'pending').length,
      totalEarnings,
      pendingEarnings,
      lifetimeEarnings: totalEarnings + pendingEarnings,
      tier: calculateTier(sampleReferrals.length),
    };

    setAffiliateProfile(updatedProfile);
    setReferrals(sampleReferrals);
    setCommissions(sampleCommissions);
    setAnalytics(sampleAnalytics);

    await saveState({
      affiliateProfile: updatedProfile,
      referrals: sampleReferrals,
      commissions: sampleCommissions,
      analytics: sampleAnalytics,
    });
  }, []);

  const getReferralLink = useCallback(() => {
    if (!affiliateProfile) return '';
    return `https://loanagent.app/join?ref=${affiliateProfile.referralCode}`;
  }, [affiliateProfile]);

  const loadAffiliateData = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const state = safeJSONParse(stored || '');
      
      if (state) {
        setAffiliateProfile(state.affiliateProfile || null);
        setReferrals(Array.isArray(state.referrals) ? state.referrals : []);
        setCommissions(Array.isArray(state.commissions) ? state.commissions : []);
        setPayouts(Array.isArray(state.payouts) ? state.payouts : []);
        setAnalytics(state.analytics || null);
      }
    } catch (error) {
      console.error('Failed to load affiliate state:', error);
    }
  }, []);

  const requestPayout = useCallback(
    async (amount: number, method: AffiliatePayout['method']) => {
      if (!affiliateProfile) return;

      const eligibleCommissions = commissions.filter(
        c => c.status === 'approved' && c.affiliateId === affiliateProfile.id
      );
      const eligibleAmount = eligibleCommissions.reduce((sum, c) => sum + c.amount, 0);

      if (amount > eligibleAmount) {
        throw new Error('Insufficient funds for payout');
      }

      const newPayout: AffiliatePayout = {
        id: `payout-${Date.now()}`,
        affiliateId: affiliateProfile.id,
        amount,
        method,
        status: 'pending',
        requestedDate: new Date().toISOString(),
        commissionIds: eligibleCommissions.slice(0, Math.ceil(eligibleCommissions.length * (amount / eligibleAmount))).map(c => c.id),
      };

      const updatedPayouts = [...payouts, newPayout];
      setPayouts(updatedPayouts);
      await saveState({ payouts: updatedPayouts });
    },
    [affiliateProfile, commissions, payouts]
  );

  const isAffiliate = useMemo(() => affiliateProfile !== null, [affiliateProfile]);

  return useMemo(
    () => ({
      affiliateProfile,
      referrals,
      commissions,
      payouts,
      analytics,
      isAffiliate,
      enrollAsAffiliate,
      getReferralLink,
      loadAffiliateData,
      requestPayout,
    }),
    [
      affiliateProfile,
      referrals,
      commissions,
      payouts,
      analytics,
      isAffiliate,
      enrollAsAffiliate,
      getReferralLink,
      loadAffiliateData,
      requestPayout,
    ]
  );
});

export { affiliateTiers };
