import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';

export interface P2PTransaction {
  id: string;
  type: 'sent' | 'received' | 'pending' | 'investment';
  counterparty: string;
  amount: number;
  processorFee: number;
  appFee: number;
  totalFees: number;
  netAmount: number;
  note?: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method: 'wallet' | 'bank' | 'card';
  loanId?: string;
}

export interface P2PLoanRequest {
  id: string;
  borrowerId: string;
  borrowerName: string;
  amount: number;
  termMonths: number;
  purpose: string;
  description: string;
  maxRate: number;
  interestRate: number;
  fundingProgress: number;
  fundingGoal: number;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'funding' | 'funded' | 'active' | 'completed';
  createdDate: string;
  remainingTime: string;
  creditScore: number;
  verified: boolean;
  investors: { investorId: string; amount: number; date: string }[];
}

interface P2PWalletState {
  balance: number;
  totalSent: number;
  totalReceived: number;
  totalInvested: number;
  transactions: P2PTransaction[];
  loanRequests: P2PLoanRequest[];
  myLoanRequests: P2PLoanRequest[];
  myInvestments: P2PLoanRequest[];
  isLoading: boolean;
  linkedCards: LinkedCard[];
  linkedBanks: LinkedBank[];
  
  addFunds: (amount: number, method: 'bank' | 'card') => void;
  sendMoney: (to: string, amount: number, note: string, method: string) => void;
  requestMoney: (from: string, amount: number, note: string) => void;
  withdraw: (amount: number, method: 'bank' | 'instant') => void;
  createLoanRequest: (request: Omit<P2PLoanRequest, 'id' | 'borrowerId' | 'fundingProgress' | 'status' | 'createdDate' | 'remainingTime' | 'investors'>) => void;
  investInLoan: (loanId: string, amount: number, method: 'wallet' | 'bank' | 'card') => boolean;
  linkCard: (card: Omit<LinkedCard, 'id'>) => void;
  linkBank: (bank: Omit<LinkedBank, 'id'>) => void;
  removeCard: (id: string) => void;
  removeBank: (id: string) => void;
}

export interface LinkedCard {
  id: string;
  last4: string;
  brand: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

export interface LinkedBank {
  id: string;
  bankName: string;
  last4: string;
  accountType: 'checking' | 'savings';
  isDefault: boolean;
}

const STORAGE_KEY = '@loanagent_p2p_wallet';
const USER_ID = 'current-user';

const safeJSONParse = (str: string | null | undefined): any => {
  if (!str || typeof str !== 'string') return null;
  const trimmed = str.trim();
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null' || trimmed === '[object Object]') return null;
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return null;
  try {
    const parsed = JSON.parse(trimmed);
    return typeof parsed === 'object' && parsed !== null ? parsed : null;
  } catch (err) {
    console.log('[P2PWallet] JSON parse error:', err);
    return null;
  }
};

function generateMockTransactions(): P2PTransaction[] {
  return [
    {
      id: 'txn-1',
      type: 'received',
      counterparty: 'John Smith',
      amount: 150.00,
      processorFee: 1.50,
      appFee: 0.75,
      totalFees: 2.25,
      netAmount: 147.75,
      note: 'Dinner split',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      method: 'wallet',
    },
    {
      id: 'txn-2',
      type: 'sent',
      counterparty: 'Sarah Johnson',
      amount: 75.00,
      processorFee: 0.75,
      appFee: 0.38,
      totalFees: 1.13,
      netAmount: 73.87,
      note: 'Movie tickets',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      method: 'card',
    },
  ];
}

function generateMockLoanRequests(): P2PLoanRequest[] {
  return [
    {
      id: 'p2p-1',
      borrowerId: 'b1',
      borrowerName: 'Sarah M.',
      amount: 15000,
      termMonths: 36,
      purpose: 'Debt Consolidation',
      description: 'Consolidating high-interest credit cards to improve financial health',
      maxRate: 12,
      interestRate: 8.5,
      fundingProgress: 12500,
      fundingGoal: 15000,
      riskLevel: 'low',
      status: 'funding',
      createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      remainingTime: '3 days',
      creditScore: 720,
      verified: true,
      investors: [],
    },
    {
      id: 'p2p-2',
      borrowerId: 'b2',
      borrowerName: 'Michael T.',
      amount: 25000,
      termMonths: 48,
      purpose: 'Business Expansion',
      description: 'Expanding my small business with new equipment and inventory',
      maxRate: 15,
      interestRate: 10.2,
      fundingProgress: 18000,
      fundingGoal: 25000,
      riskLevel: 'medium',
      status: 'funding',
      createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      remainingTime: '5 days',
      creditScore: 680,
      verified: true,
      investors: [],
    },
    {
      id: 'p2p-3',
      borrowerId: 'b3',
      borrowerName: 'Jessica R.',
      amount: 10000,
      termMonths: 24,
      purpose: 'Home Improvement',
      description: 'Renovating kitchen and bathroom to increase home value',
      maxRate: 10,
      interestRate: 7.8,
      fundingProgress: 8500,
      fundingGoal: 10000,
      riskLevel: 'low',
      status: 'funding',
      createdDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      remainingTime: '2 days',
      creditScore: 750,
      verified: true,
      investors: [],
    },
  ];
}

function generateMockLinkedAccounts() {
  return {
    cards: [] as LinkedCard[],
    banks: [] as LinkedBank[],
  };
}

export const [P2PWalletProvider, useP2PWallet] = createContextHook((): P2PWalletState => {
  const [balance, setBalance] = useState(325.50);
  const [transactions, setTransactions] = useState<P2PTransaction[]>([]);
  const [loanRequests, setLoanRequests] = useState<P2PLoanRequest[]>([]);
  const [linkedCards, setLinkedCards] = useState<LinkedCard[]>([]);
  const [linkedBanks, setLinkedBanks] = useState<LinkedBank[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadState = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const state = safeJSONParse(stored);
      
      if (state) {
        setBalance(typeof state.balance === 'number' ? state.balance : 325.50);
        setTransactions(Array.isArray(state.transactions) ? state.transactions : generateMockTransactions());
        setLoanRequests(Array.isArray(state.loanRequests) ? state.loanRequests : generateMockLoanRequests());
        setLinkedCards(Array.isArray(state.linkedCards) ? state.linkedCards : []);
        setLinkedBanks(Array.isArray(state.linkedBanks) ? state.linkedBanks : []);
      } else {
        if (stored) {
          console.log('Clearing corrupted P2P wallet storage data');
          await AsyncStorage.removeItem(STORAGE_KEY);
        }
        setTransactions(generateMockTransactions());
        setLoanRequests(generateMockLoanRequests());
        const mockAccounts = generateMockLinkedAccounts();
        setLinkedCards(mockAccounts.cards);
        setLinkedBanks(mockAccounts.banks);
      }
    } catch (error) {
      console.error('Failed to load P2P wallet state:', error);
      await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
      setTransactions(generateMockTransactions());
      setLoanRequests(generateMockLoanRequests());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadState();
  }, [loadState]);

  const saveState = async (newBalance: number, newTransactions: P2PTransaction[], newLoanRequests: P2PLoanRequest[], newCards: LinkedCard[], newBanks: LinkedBank[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        balance: newBalance,
        transactions: newTransactions,
        loanRequests: newLoanRequests,
        linkedCards: newCards,
        linkedBanks: newBanks,
      }));
    } catch (error) {
      console.error('Failed to save P2P wallet state:', error);
    }
  };

  const totalSent = useMemo(() => {
    return transactions
      .filter(t => t.type === 'sent' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalReceived = useMemo(() => {
    return transactions
      .filter(t => t.type === 'received' && t.status === 'completed')
      .reduce((sum, t) => sum + t.netAmount, 0);
  }, [transactions]);

  const totalInvested = useMemo(() => {
    return transactions
      .filter(t => t.type === 'investment' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const myLoanRequests = useMemo(() => {
    return loanRequests.filter(r => r.borrowerId === USER_ID);
  }, [loanRequests]);

  const myInvestments = useMemo(() => {
    return loanRequests.filter(r => 
      r.investors.some(inv => inv.investorId === USER_ID)
    );
  }, [loanRequests]);

  const addFunds = useCallback((amount: number, method: 'bank' | 'card') => {
    const processorFee = method === 'card' ? amount * 0.025 : amount * 0.01;
    const appFee = Math.min(amount * 0.005, 5);
    const totalFees = processorFee + appFee;
    const netAmount = amount - totalFees;

    const newTransaction: P2PTransaction = {
      id: `txn-${Date.now()}`,
      type: 'received',
      counterparty: 'Add Funds',
      amount,
      processorFee,
      appFee,
      totalFees,
      netAmount,
      date: new Date().toISOString(),
      status: 'completed',
      method,
    };

    const newBalance = balance + netAmount;
    const newTransactions = [newTransaction, ...transactions];
    
    setBalance(newBalance);
    setTransactions(newTransactions);
    saveState(newBalance, newTransactions, loanRequests, linkedCards, linkedBanks);
  }, [balance, transactions, loanRequests, linkedCards, linkedBanks]);

  const sendMoney = useCallback((to: string, amount: number, note: string, method: string) => {
    const processorFee = method === 'card' ? amount * 0.025 : amount * 0.015;
    const appFee = Math.min(amount * 0.005, 5);
    const totalFees = processorFee + appFee;
    const totalCharged = amount + totalFees;

    const newTransaction: P2PTransaction = {
      id: `txn-${Date.now()}`,
      type: 'sent',
      counterparty: to,
      amount,
      processorFee,
      appFee,
      totalFees,
      netAmount: amount,
      note,
      date: new Date().toISOString(),
      status: 'completed',
      method: method as any,
    };

    const newBalance = balance - totalCharged;
    const newTransactions = [newTransaction, ...transactions];
    
    setBalance(newBalance);
    setTransactions(newTransactions);
    saveState(newBalance, newTransactions, loanRequests, linkedCards, linkedBanks);
  }, [balance, transactions, loanRequests, linkedCards, linkedBanks]);

  const requestMoney = useCallback((from: string, amount: number, note: string) => {
    const newTransaction: P2PTransaction = {
      id: `txn-${Date.now()}`,
      type: 'pending',
      counterparty: from,
      amount,
      processorFee: 0,
      appFee: 0,
      totalFees: 0,
      netAmount: amount,
      note,
      date: new Date().toISOString(),
      status: 'pending',
      method: 'wallet',
    };

    const newTransactions = [newTransaction, ...transactions];
    setTransactions(newTransactions);
    saveState(balance, newTransactions, loanRequests, linkedCards, linkedBanks);
  }, [balance, transactions, loanRequests, linkedCards, linkedBanks]);

  const withdraw = useCallback((amount: number, method: 'bank' | 'instant') => {
    const processorFee = method === 'instant' ? amount * 0.015 : amount * 0.005;
    const appFee = Math.min(amount * 0.003, 2);
    const totalFees = processorFee + appFee;
    const netAmount = amount - totalFees;

    const newTransaction: P2PTransaction = {
      id: `txn-${Date.now()}`,
      type: 'sent',
      counterparty: `Withdraw (${method})`,
      amount,
      processorFee,
      appFee,
      totalFees,
      netAmount,
      date: new Date().toISOString(),
      status: 'completed',
      method: 'bank',
    };

    const newBalance = balance - amount;
    const newTransactions = [newTransaction, ...transactions];
    
    setBalance(newBalance);
    setTransactions(newTransactions);
    saveState(newBalance, newTransactions, loanRequests, linkedCards, linkedBanks);
  }, [balance, transactions, loanRequests, linkedCards, linkedBanks]);

  const createLoanRequest = useCallback((request: Omit<P2PLoanRequest, 'id' | 'borrowerId' | 'fundingProgress' | 'status' | 'createdDate' | 'remainingTime' | 'investors'>) => {
    const newRequest: P2PLoanRequest = {
      ...request,
      id: `loan-${Date.now()}`,
      borrowerId: USER_ID,
      fundingProgress: 0,
      status: 'funding',
      createdDate: new Date().toISOString(),
      remainingTime: '14 days',
      investors: [],
    };

    const newLoanRequests = [newRequest, ...loanRequests];
    setLoanRequests(newLoanRequests);
    saveState(balance, transactions, newLoanRequests, linkedCards, linkedBanks);
    console.log('Loan request created:', newRequest);
  }, [balance, transactions, loanRequests, linkedCards, linkedBanks]);

  const investInLoan = useCallback((loanId: string, amount: number, method: 'wallet' | 'bank' | 'card'): boolean => {
    const loan = loanRequests.find(r => r.id === loanId);
    if (!loan) {
      console.log('Loan not found:', loanId);
      return false;
    }

    const remainingNeeded = loan.fundingGoal - loan.fundingProgress;
    const investmentAmount = Math.min(amount, remainingNeeded);

    if (method === 'wallet' && balance < investmentAmount) {
      console.log('Insufficient wallet balance');
      return false;
    }

    const processorFee = method === 'card' ? investmentAmount * 0.025 : method === 'bank' ? investmentAmount * 0.01 : 0;
    const appFee = Math.min(investmentAmount * 0.005, 5);
    const totalFees = processorFee + appFee;

    const newTransaction: P2PTransaction = {
      id: `txn-${Date.now()}`,
      type: 'investment',
      counterparty: loan.borrowerName,
      amount: investmentAmount,
      processorFee,
      appFee,
      totalFees,
      netAmount: investmentAmount,
      note: `Investment in ${loan.purpose}`,
      date: new Date().toISOString(),
      status: 'completed',
      method,
      loanId,
    };

    const updatedLoanRequests = loanRequests.map(r => {
      if (r.id === loanId) {
        const newProgress = r.fundingProgress + investmentAmount;
        return {
          ...r,
          fundingProgress: newProgress,
          status: newProgress >= r.fundingGoal ? 'funded' as const : 'funding' as const,
          investors: [...r.investors, { investorId: USER_ID, amount: investmentAmount, date: new Date().toISOString() }],
        };
      }
      return r;
    });

    const newBalance = method === 'wallet' ? balance - investmentAmount : balance;
    const newTransactions = [newTransaction, ...transactions];

    setBalance(newBalance);
    setTransactions(newTransactions);
    setLoanRequests(updatedLoanRequests);
    saveState(newBalance, newTransactions, updatedLoanRequests, linkedCards, linkedBanks);
    
    console.log('Investment successful:', { loanId, amount: investmentAmount, method });
    return true;
  }, [balance, transactions, loanRequests, linkedCards, linkedBanks]);

  const linkCard = useCallback((card: Omit<LinkedCard, 'id'>) => {
    const newCard: LinkedCard = {
      ...card,
      id: `card-${Date.now()}`,
    };
    const newCards = [...linkedCards, newCard];
    setLinkedCards(newCards);
    saveState(balance, transactions, loanRequests, newCards, linkedBanks);
  }, [balance, transactions, loanRequests, linkedCards, linkedBanks]);

  const linkBank = useCallback((bank: Omit<LinkedBank, 'id'>) => {
    const newBank: LinkedBank = {
      ...bank,
      id: `bank-${Date.now()}`,
    };
    const newBanks = [...linkedBanks, newBank];
    setLinkedBanks(newBanks);
    saveState(balance, transactions, loanRequests, linkedCards, newBanks);
  }, [balance, transactions, loanRequests, linkedCards, linkedBanks]);

  const removeCard = useCallback((id: string) => {
    const newCards = linkedCards.filter(c => c.id !== id);
    setLinkedCards(newCards);
    saveState(balance, transactions, loanRequests, newCards, linkedBanks);
  }, [balance, transactions, loanRequests, linkedCards, linkedBanks]);

  const removeBank = useCallback((id: string) => {
    const newBanks = linkedBanks.filter(b => b.id !== id);
    setLinkedBanks(newBanks);
    saveState(balance, transactions, loanRequests, linkedCards, newBanks);
  }, [balance, transactions, loanRequests, linkedCards, linkedBanks]);

  return useMemo(() => ({
    balance,
    totalSent,
    totalReceived,
    totalInvested,
    transactions,
    loanRequests,
    myLoanRequests,
    myInvestments,
    isLoading,
    linkedCards,
    linkedBanks,
    addFunds,
    sendMoney,
    requestMoney,
    withdraw,
    createLoanRequest,
    investInLoan,
    linkCard,
    linkBank,
    removeCard,
    removeBank,
  }), [balance, totalSent, totalReceived, totalInvested, transactions, loanRequests, myLoanRequests, myInvestments, isLoading, linkedCards, linkedBanks, addFunds, sendMoney, requestMoney, withdraw, createLoanRequest, investInLoan, linkCard, linkBank, removeCard, removeBank]);
});
