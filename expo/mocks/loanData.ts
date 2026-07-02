import type { Loan, UserProfile, AIInsight, DocumentItem, OnboardingSlide } from '@/types';

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Meet your AI Loan Agent',
    subtitle: 'Your personal financial co-pilot that analyzes loans, flags risks, and saves you money — instantly.',
    illustration: 'orb',
  },
  {
    id: '2',
    title: 'Understand your loans instantly',
    subtitle: 'Track balances, payments, and payoff progress across all your loans in one beautiful dashboard.',
    illustration: 'chart',
  },
  {
    id: '3',
    title: 'Save money with smarter recommendations',
    subtitle: 'AI-powered insights find hidden savings — lower rates, extra payment strategies, and refinance opportunities.',
    illustration: 'savings',
  },
];

export const userProfile: UserProfile = {
  name: 'Brian',
  email: 'brian.kelly@email.com',
  avatarColor: '#16C784',
  initials: 'BK',
  creditScore: 742,
  memberSince: 'Jan 2025',
  plan: 'premium',
};

export const loans: Loan[] = [
  {
    id: 'mortgage-1',
    type: 'mortgage',
    name: 'Home Mortgage',
    lender: 'Wells Fargo',
    originalAmount: 475000,
    remainingBalance: 342500,
    apr: 4.25,
    monthlyPayment: 2380,
    nextPaymentDate: 'Jul 10, 2026',
    nextPaymentAmount: 2380,
    payoffProgress: 72,
    termMonths: 360,
    monthsRemaining: 216,
    startDate: '2019-03-15',
    status: 'active',
    autoPayEnabled: true,
    iconColor: '#16C784',
    payments: [
      { id: 'p1', date: 'Jun 10, 2026', amount: 2380, type: 'completed', status: 'paid' },
      { id: 'p2', date: 'May 10, 2026', amount: 2380, type: 'completed', status: 'paid' },
      { id: 'p3', date: 'Apr 10, 2026', amount: 2380, type: 'completed', status: 'paid' },
      { id: 'p4', date: 'Mar 10, 2026', amount: 2500, type: 'extra', status: 'paid' },
      { id: 'p5', date: 'Feb 10, 2026', amount: 2380, type: 'completed', status: 'paid' },
    ],
  },
  {
    id: 'auto-1',
    type: 'auto',
    name: 'Auto Loan',
    lender: 'Chase Bank',
    originalAmount: 42000,
    remainingBalance: 18750,
    apr: 3.99,
    monthlyPayment: 580,
    nextPaymentDate: 'Jul 14, 2026',
    nextPaymentAmount: 580,
    payoffProgress: 55,
    termMonths: 72,
    monthsRemaining: 32,
    startDate: '2022-11-01',
    status: 'active',
    autoPayEnabled: true,
    iconColor: '#3B9EFF',
    payments: [
      { id: 'a1', date: 'Jun 14, 2026', amount: 580, type: 'completed', status: 'paid' },
      { id: 'a2', date: 'May 14, 2026', amount: 580, type: 'completed', status: 'paid' },
      { id: 'a3', date: 'Apr 14, 2026', amount: 580, type: 'completed', status: 'paid' },
      { id: 'a4', date: 'Mar 14, 2026', amount: 580, type: 'completed', status: 'paid' },
    ],
  },
  {
    id: 'personal-1',
    type: 'personal',
    name: 'Personal Loan',
    lender: 'Marcus by Goldman',
    originalAmount: 15000,
    remainingBalance: 6250,
    apr: 7.5,
    monthlyPayment: 450,
    nextPaymentDate: 'Jul 20, 2026',
    nextPaymentAmount: 450,
    payoffProgress: 35,
    termMonths: 36,
    monthsRemaining: 14,
    startDate: '2024-08-01',
    status: 'active',
    autoPayEnabled: false,
    iconColor: '#F5A623',
    payments: [
      { id: 'pe1', date: 'Jun 20, 2026', amount: 450, type: 'completed', status: 'paid' },
      { id: 'pe2', date: 'May 20, 2026', amount: 450, type: 'completed', status: 'paid' },
      { id: 'pe3', date: 'Apr 20, 2026', amount: 450, type: 'completed', status: 'paid' },
    ],
  },
];

export const primaryInsight: AIInsight = {
  title: 'Smart Payoff Opportunity',
  body: 'Paying $150 extra each month on your mortgage can save you $21,400 in interest and reduce your loan term by 2 years.',
  savingAmount: 21400,
  timeSaved: '2 years',
  type: 'savings',
};

export const documents: DocumentItem[] = [
  {
    id: 'd1',
    name: 'Mortgage Statement — June 2026',
    type: 'mortgage',
    date: 'Jun 15, 2026',
    size: '2.4 MB',
    status: 'verified',
    fileType: 'pdf',
  },
  {
    id: 'd2',
    name: 'Auto Loan Agreement',
    type: 'agreement',
    date: 'Nov 1, 2022',
    size: '1.8 MB',
    status: 'verified',
    fileType: 'pdf',
  },
  {
    id: 'd3',
    name: 'Insurance Proof — Auto',
    type: 'insurance',
    date: 'Jan 12, 2026',
    size: '0.9 MB',
    status: 'verified',
    fileType: 'image',
  },
  {
    id: 'd4',
    name: 'Tax Document 2025 — W2',
    type: 'tax',
    date: 'Jan 31, 2026',
    size: '1.2 MB',
    status: 'verified',
    fileType: 'pdf',
  },
  {
    id: 'd5',
    name: 'Personal Loan Terms',
    type: 'agreement',
    date: 'Aug 1, 2024',
    size: '0.6 MB',
    status: 'pending',
    fileType: 'doc',
  },
];

export const aiSuggestedPrompts: string[] = [
  'Can I lower my monthly payment?',
  'Should I refinance?',
  'What if I pay $100 extra?',
  'Explain my loan in simple terms',
];

export interface AIResponseRule {
  keywords: string[];
  response: string;
}

export const aiResponseRules: AIResponseRule[] = [
  {
    keywords: ['lower', 'reduce', 'monthly payment'],
    response:
      "Looking at your portfolio, your Personal Loan at 7.50% APR is the highest interest rate. If you refinance that to 5.5%, your monthly payment drops by about $67 — from $450 to ~$383. That's an instant $804/year in freed-up cash flow. Would you like to explore refinance offers?",
  },
  {
    keywords: ['refinance'],
    response:
      "Great question! Your mortgage at 4.25% is already competitive, but current rates around 3.95% could save you ~$98/month. Over your remaining 18-year term, that's approximately $21,000 in total interest savings. Closing costs would be ~$4,200, so you'd break even in about 43 months. I'd recommend checking refinance options once rates dip below 4.0%.",
  },
  {
    keywords: ['extra', 'pay', '100', '150', 'additional'],
    response:
      'Paying an extra $100/month on your mortgage ($342,500 @ 4.25%) reduces your loan term by about 16 months and saves roughly $14,200 in interest. If you bump that to $150/month, you save $21,400 and shave off 24 months. The earlier you start, the bigger the impact — every dollar in the first year saves ~$2.20 over the life of the loan.',
  },
  {
    keywords: ['explain', 'simple', 'understand', 'how'],
    response:
      "Here's the simple version: You have 3 active loans totaling $367,500 in remaining debt. Your mortgage is your biggest ($342K) but has your lowest rate (4.25%). Your auto loan ($18.7K) is mid-range at 3.99%. Your personal loan ($6.2K) is smallest but has your highest rate (7.5%) — that's the one to prioritize paying off first. Think of it like a staircase: knock out the expensive small one, then snowball that payment into the next.",
  },
  {
    keywords: ['health', 'score', 'how am i'],
    response:
      'Your Loan Health Score is 87/100 — Excellent!\n\n• Payment history: Perfect (no missed payments)\n• Credit utilization: Low (good)\n• DTI ratio: 34% (under the 43% threshold)\n• Loan diversity: 3 types (healthy mix)\n\nThe only thing keeping you from 90+ is your personal loan\'s high APR. Paying it off would push you into the 90s.',
  },
];

export function getAIResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  for (const rule of aiResponseRules) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.response;
    }
  }
  return "I'm your AI Loan Agent, here to help with payments, refinancing, payoff strategies, and understanding your loans. Try asking me about lowering your monthly payment, whether you should refinance, or what happens if you pay extra each month. I can also explain any of your loans in plain English!";
}
