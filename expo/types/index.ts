export type LoanType = 'mortgage' | 'auto' | 'personal' | 'student' | 'business';

export type LoanStatus = 'active' | 'paid_off' | 'delinquent' | 'in_review';

export interface Payment {
  id: string;
  date: string;
  amount: number;
  type: 'scheduled' | 'completed' | 'extra';
  status: 'paid' | 'pending' | 'failed';
}

export interface Loan {
  id: string;
  type: LoanType;
  name: string;
  lender: string;
  originalAmount: number;
  remainingBalance: number;
  apr: number;
  monthlyPayment: number;
  nextPaymentDate: string;
  nextPaymentAmount: number;
  payoffProgress: number;
  termMonths: number;
  monthsRemaining: number;
  startDate: string;
  status: LoanStatus;
  autoPayEnabled: boolean;
  payments: Payment[];
  iconColor: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIInsight {
  title: string;
  body: string;
  savingAmount: number;
  timeSaved: string;
  type: 'savings' | 'refinance' | 'warning' | 'tip';
}

export interface DocumentItem {
  id: string;
  name: string;
  type: 'mortgage' | 'auto' | 'insurance' | 'tax' | 'agreement' | 'other';
  date: string;
  size: string;
  status: 'verified' | 'pending' | 'processing';
  fileType: 'pdf' | 'image' | 'doc';
}

export interface UserProfile {
  name: string;
  email: string;
  avatarColor: string;
  initials: string;
  creditScore: number;
  memberSince: string;
  plan: 'free' | 'premium';
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  route: string;
}

export interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  illustration: 'orb' | 'chart' | 'savings';
}

export interface TabConfig {
  name: string;
  label: string;
  icon: string;
  route: string;
}
