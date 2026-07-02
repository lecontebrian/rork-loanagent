export type LoanType = 'auto' | 'home' | 'personal' | 'business' | 'education' | 'debt';

export interface LoanCategory {
  id: LoanType;
  name: string;
  description: string;
  icon: string;
  minAmount: number;
  maxAmount: number;
}

export interface Lender {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  trustScore: number;
}

export interface LoanOffer {
  id: string;
  lender: Lender;
  loanType: LoanType;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  totalPayment: number;
  amount: number;
  approvalLikelihood: number;
  features: string[];
  processingTime: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ssn?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  employment: {
    status: 'employed' | 'self-employed' | 'unemployed';
    employer?: string;
    annualIncome: number;
    monthsEmployed?: number;
  };
  faceVerified: boolean;
  idVerified: boolean;
}

export interface CreditInfo {
  score: number;
  rating: 'excellent' | 'good' | 'fair' | 'poor';
  lastUpdated: string;
  factors: {
    paymentHistory: number;
    creditUtilization: number;
    creditAge: number;
    creditMix: number;
    newCredit: number;
  };
}

export interface LoanApplication {
  id: string;
  loanType: LoanType;
  lender: Lender;
  amount: number;
  status: 'submitted' | 'processing' | 'approved' | 'funded' | 'rejected';
  submittedDate: string;
  updatedDate: string;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  faceVerified?: boolean;
  statusHistory: {
    status: LoanApplication['status'];
    date: string;
    note?: string;
  }[];
}

export interface ActiveLoan {
  id: string;
  loanType: LoanType;
  lender: Lender;
  originalAmount: number;
  currentBalance: number;
  interestRate: number;
  monthlyPayment: number;
  nextPaymentDate: string;
  paymentsRemaining: number;
  totalPayments: number;
  startDate: string;
}

export interface EmploymentInfo {
  currentEmployer: string;
  currentPosition: string;
  currentEmploymentStartDate: string;
  currentEmploymentMonths: number;
  currentAnnualIncome: number;
  previousEmployer?: string;
  previousPosition?: string;
  previousEmploymentStartDate?: string;
  previousEmploymentEndDate?: string;
  employmentType: 'full-time' | 'part-time' | 'self-employed' | 'contract' | 'unemployed';
}

export interface FinancialInfo {
  monthlyIncome: number;
  monthlyExpenses: number;
  otherIncomeSource?: string;
  otherMonthlyIncome?: number;
  hasExistingDebts: boolean;
  totalMonthlyDebtPayments?: number;
  rentOrMortgagePayment?: number;
  socialSecurityNumber?: string;
}

export interface PersonalReferences {
  reference1Name: string;
  reference1Phone: string;
  reference1Relationship: string;
  reference2Name?: string;
  reference2Phone?: string;
  reference2Relationship?: string;
}

export interface DriversLicenseInfo {
  licenseNumber: string;
  state: string;
  expirationDate: string;
  dateOfBirth: string;
  scannedImageUri?: string;
}

export interface ApplicationFormData {
  loanOfferId: string;
  personalInfo: UserProfile;
  employmentInfo: EmploymentInfo;
  financialInfo: FinancialInfo;
  references: PersonalReferences;
  driversLicense?: DriversLicenseInfo;
  ndaAccepted: boolean;
  ndaAcceptedDate?: string;
  signatureDataUrl?: string;
  signatureDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface P2PLoanListing {
  id: string;
  borrower: {
    id: string;
    name: string;
    creditScore: number;
    verified: boolean;
  };
  amount: number;
  interestRate: number;
  termMonths: number;
  purpose: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  fundingProgress: number;
  fundingGoal: number;
  remainingTime: string;
  createdDate: string;
  status: 'open' | 'funding' | 'funded' | 'active' | 'completed';
}

export interface P2PInvestment {
  id: string;
  loanId: string;
  investorId: string;
  amount: number;
  expectedReturn: number;
  startDate: string;
  status: 'active' | 'completed' | 'defaulted';
  monthlyReturn: number;
}

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  budgeted: number;
  spent: number;
  color: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

export interface CreditDispute {
  id: string;
  bureau: 'experian' | 'equifax' | 'transunion';
  accountName: string;
  reason: string;
  status: 'submitted' | 'investigating' | 'resolved' | 'rejected';
  submittedDate: string;
  updatedDate: string;
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  icon: string;
  color: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'id' | 'income' | 'tax' | 'loan' | 'other';
  fileUrl: string;
  uploadDate: string;
  expiryDate?: string;
  size: number;
  encrypted: boolean;
}

export interface LoanSimulationInput {
  income: number;
  creditScore: number;
  existingDebts: number;
  employmentMonths: number;
  loanAmount: number;
  loanType: LoanType;
  customInterestRate?: number;
  customTaxRate?: number;
  customFees?: number;
}

export interface LoanSimulationResult {
  approvalLikelihood: number;
  estimatedRate: number;
  monthlyPayment: number;
  affordabilityScore: number;
  recommendations: string[];
}

export interface AffiliateProfile {
  id: string;
  userId: string;
  referralCode: string;
  tier: 'starter' | 'pro' | 'elite' | 'platinum';
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  lifetimeEarnings: number;
  joinedDate: string;
  specialization?: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface Referral {
  id: string;
  affiliateId: string;
  referredUserId: string;
  referredUserName: string;
  status: 'pending' | 'registered' | 'applied' | 'approved' | 'funded';
  commission: number;
  commissionStatus: 'pending' | 'earned' | 'paid';
  loanAmount?: number;
  loanType?: LoanType;
  registeredDate: string;
  fundedDate?: string;
  lastActivityDate: string;
}

export interface AffiliateCommission {
  id: string;
  affiliateId: string;
  referralId: string;
  amount: number;
  type: 'registration' | 'application' | 'funding' | 'bonus';
  status: 'pending' | 'approved' | 'paid';
  earnedDate: string;
  paidDate?: string;
  description: string;
}

export interface AffiliateTier {
  tier: 'starter' | 'pro' | 'elite' | 'platinum';
  name: string;
  minReferrals: number;
  registrationBonus: number;
  applicationCommission: number;
  fundingCommission: number;
  monthlyBonus: number;
  benefits: string[];
  color: string;
}

export interface AffiliateAnalytics {
  period: 'today' | 'week' | 'month' | 'year';
  clicks: number;
  registrations: number;
  applications: number;
  funded: number;
  earnings: number;
  conversionRate: number;
  avgLoanAmount: number;
  topPerformingChannel?: string;
}

export interface AffiliatePayout {
  id: string;
  affiliateId: string;
  amount: number;
  method: 'bank' | 'paypal' | 'venmo' | 'check';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedDate: string;
  processedDate?: string;
  commissionIds: string[];
}
