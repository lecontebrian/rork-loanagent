import { LoanOffer, ActiveLoan } from '@/types';

export interface AdvisorSummaryInput {
  bestOffer: LoanOffer;
  alternativeOffers?: LoanOffer[];
  existingLoans?: ActiveLoan[];
  userCreditScore?: number;
}

export interface AdvisorSummary {
  paragraph1: string;
  paragraph2: string;
  fullSummary: string;
  keyBenefits: string[];
  savingsHighlight?: string;
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`;
  }
  return `$${amount.toLocaleString()}`;
}

function formatExactCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function calculateTotalInterest(offer: LoanOffer): number {
  return offer.totalPayment - offer.amount;
}

export function generateAdvisorSummary(input: AdvisorSummaryInput): AdvisorSummary {
  const { bestOffer, alternativeOffers = [], existingLoans = [] } = input;
  
  const totalInterest = calculateTotalInterest(bestOffer);
  const monthlyFormatted = formatCurrency(bestOffer.monthlyPayment);
  const totalInterestFormatted = formatCurrency(totalInterest);
  const totalPaymentFormatted = formatExactCurrency(bestOffer.totalPayment);
  const aprFormatted = `${bestOffer.interestRate}%`;
  
  let potentialSavings = 0;
  if (alternativeOffers.length > 0) {
    const avgAlternativeInterest = alternativeOffers
      .slice(0, 3)
      .reduce((sum, offer) => sum + calculateTotalInterest(offer), 0) / Math.min(3, alternativeOffers.length);
    potentialSavings = avgAlternativeInterest - totalInterest;
  }
  
  const hasExistingLoans = existingLoans.length > 0;
  const existingLoanType = existingLoans[0]?.loanType;
  
  let paragraph1: string;
  let paragraph2: string;
  
  if (hasExistingLoans && (bestOffer.loanType === 'debt' || alternativeOffers.length > 0)) {
    paragraph1 = `Your best match offers ${monthlyFormatted} monthly payments at ${aprFormatted} APR. ${bestOffer.lender.name} provides exceptional ${bestOffer.approvalLikelihood}% approval odds with immediate financial relief.`;
    paragraph2 = `Consolidating your ${existingLoanType || 'existing'} debt saves ${totalInterestFormatted} in total interest over ${Math.round(bestOffer.termMonths / 12)} years. Total repayment: ${totalPaymentFormatted}.`;
  } else if (potentialSavings > 1000) {
    paragraph1 = `${bestOffer.lender.name} delivers ${monthlyFormatted} monthly at ${aprFormatted} APR—the market's lowest rate. This option maximizes affordability while minimizing long-term cost.`;
    paragraph2 = `You'll save ${formatCurrency(potentialSavings)} vs. alternatives, paying ${totalInterestFormatted} total interest. Complete repayment: ${totalPaymentFormatted} over ${Math.round(bestOffer.termMonths / 12)} years.`;
  } else {
    paragraph1 = `This ${aprFormatted} APR offer from ${bestOffer.lender.name} gives you ${monthlyFormatted} monthly payments with ${bestOffer.approvalLikelihood}% approval likelihood—optimized for your ${input.userCreditScore || 720} credit score.`;
    paragraph2 = `Total interest of ${totalInterestFormatted} keeps costs low. Your complete ${bestOffer.termMonths}-month obligation: ${totalPaymentFormatted}, balancing affordability and smart financial planning.`;
  }
  
  const fullSummary = `${paragraph1} ${paragraph2}`;
  
  const keyBenefits: string[] = [
    `Lowest ${aprFormatted} APR among offers`,
    `Affordable ${monthlyFormatted}/month payment`,
    `${bestOffer.approvalLikelihood}% approval likelihood`,
    `Save ${totalInterestFormatted} vs alternatives`,
  ];
  
  if (hasExistingLoans) {
    keyBenefits.push('Consolidates existing debt');
  }
  
  if (bestOffer.features.some(f => f.toLowerCase().includes('prepayment'))) {
    keyBenefits.push('No prepayment penalties');
  }
  
  return {
    paragraph1,
    paragraph2,
    fullSummary,
    keyBenefits: keyBenefits.slice(0, 5),
    savingsHighlight: potentialSavings > 1000 ? formatCurrency(potentialSavings) : undefined,
  };
}

export function validateSummaryLength(summary: string): boolean {
  const words = summary.trim().split(/\s+/);
  return words.length <= 60;
}

export function generateCompactSummary(input: AdvisorSummaryInput): string {
  const { bestOffer, existingLoans = [] } = input;
  
  const totalInterest = calculateTotalInterest(bestOffer);
  const hasExistingLoans = existingLoans.length > 0;
  
  const monthly = formatCurrency(bestOffer.monthlyPayment);
  const interest = formatCurrency(totalInterest);
  const apr = `${bestOffer.interestRate}%`;
  const total = formatExactCurrency(bestOffer.totalPayment);
  
  if (hasExistingLoans) {
    return `Best match: ${monthly}/month at ${apr} APR from ${bestOffer.lender.name}. Consolidate debt and save ${interest} in interest. Total: ${total}.`;
  } else {
    return `${bestOffer.lender.name} offers ${monthly} monthly at ${apr} APR with ${interest} total interest. Your complete ${bestOffer.termMonths}-month obligation: ${total}.`;
  }
}
