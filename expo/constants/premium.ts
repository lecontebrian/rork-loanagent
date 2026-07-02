export type SubscriptionTier = 'basic' | 'plus' | 'pro';

export const TIER_CONFIG = {
  basic: {
    name: 'Basic',
    tagline: '7-Day Free Trial',
    price: 9.99,
    displayPrice: '$9.99',
    period: 'month',
    tokens: 5,
    tokensRefill: 5,
    description: 'Start with a 7-day free trial, then $9.99/month',
    trialDays: 7,
    features: [
      'No risk: Try the app with 5 free tokens to test advanced features',
      'Access to core tools: view loan and car offers, simple comparisons, and basic tracking',
      'Great for first-time users who just want to see how the app works',
    ],
    limitations: [
      'Lower token count than Plus or Pro plans',
      'Limited advanced alerts and P2P tools',
      'No priority support',
    ],
    pros: [
      'No risk: Try the app with 5 free tokens to test advanced features',
      'Access to core tools: view loan and car offers, simple comparisons, and basic tracking',
      'Great for first-time users who just want to see how the app works',
    ],
    cons: [
      'Lower token count than Plus or Pro plans',
      'Limited advanced alerts and P2P tools',
      'No priority support',
    ],
    whyChoose: 'You\'re curious and just want to test the app on one or two deals. You don\'t compare offers often and don\'t need ongoing tools yet.',
    cta: '7-day free trial, then $9.99/month.',
    postTrialPrice: 9.99,
  },
  plus: {
    name: 'Plus',
    tagline: 'POPULAR',
    price: 19.99,
    displayPrice: '$19.99',
    period: 'month',
    tokens: 20,
    tokensRefill: 20,
    description: 'Best value for people who regularly check and optimize deals',
    features: [
      'Monthly token refill (20 tokens/month) so you can keep running smart checks',
      'Deep loan comparisons: total cost, payoff date, interest vs principal',
      '"What-if" simulations: see how changing term, payment, or paying extra affects your total cost',
      'Refinance and "you can save $X" alerts across your active loans',
      'Higher limits than Basic for saved cars/loans and tracked scenarios',
    ],
    limitations: [
      'Token cap: heavy users can still run out if they run lots of scans every month',
      'Limited P2P/deal-review actions compared to Pro',
      'No concierge-style human review or business-level tools',
    ],
    pros: [
      'Monthly token refill (20 tokens/month) so you can keep running smart checks',
      'Deep loan comparisons: total cost, payoff date, interest vs principal',
      '"What-if" simulations: see how changing term, payment, or paying extra affects your total cost',
      'Refinance and "you can save $X" alerts across your active loans',
      'Higher limits than Basic for saved cars/loans and tracked scenarios',
    ],
    cons: [
      'Token cap: heavy users can still run out if they run lots of scans every month',
      'Limited P2P/deal-review actions compared to Pro',
      'No concierge-style human review or business-level tools',
    ],
    whyChoose: 'You compare loans or car deals a few times a month and want to avoid bad offers. You want real savings insights (not just rates) without committing to a high-priced plan. Best balance of price vs power for most users.',
    cta: 'Best value for people who regularly check and optimize their deals.',
  },
  pro: {
    name: 'Pro',
    tagline: 'POWER USER',
    price: 29.99,
    displayPrice: '$29.99',
    period: 'month',
    tokens: 80,
    tokensRefill: 80,
    description: 'Built for serious deal hunters and small businesses',
    features: [
      'Large monthly token refill (80 tokens/month) for heavy usage',
      'All Plus features, with much higher limits on comparisons, what-ifs, and refinance scans',
      'More P2P and deal-review actions each month (e.g., multiple loan requests, more reviews)',
      'Extra tools for multiple cars, properties, or business financing in one account',
      'Priority support and faster responses when something is urgent',
    ],
    limitations: [
      'Higher monthly cost than Plus',
      'Overkill if you only run a handful of comparisons per year',
    ],
    pros: [
      'Large monthly token refill (80 tokens/month) for heavy usage',
      'All Plus features, with much higher limits on comparisons, what-ifs, and refinance scans',
      'More P2P and deal-review actions each month (e.g., multiple loan requests, more reviews)',
      'Extra tools for multiple cars, properties, or business financing in one account',
      'Priority support and faster responses when something is urgent',
    ],
    cons: [
      'Higher monthly cost than Plus',
      'Overkill if you only run a handful of comparisons per year',
    ],
    whyChoose: 'You\'re a power user, side-hustler, or small business owner comparing lots of deals. You want to constantly scout better rates and never hit token limits when it matters. You see your borrowing and deals as something to actively manage like a portfolio, not just "set and forget."',
    cta: 'Built for serious deal hunters and small businesses who live in the numbers.',
  },
} as const;

export const PREMIUM_PRICING = {
  monthly: {
    price: 19.99,
    displayPrice: '$19.99',
    period: 'month',
    periodShort: 'mo',
  },
  yearly: {
    price: 99.99,
    displayPrice: '$99.99',
    period: 'year',
    periodShort: 'yr',
    monthlyEquivalent: 8.33,
    savingsPercent: 58,
  },
  trial: {
    days: 7,
    description: '7-Day Free Trial',
  },
} as const;

export const TOKEN_ACTIONS = {
  deepComparison: {
    name: 'Deep Loan Comparison',
    cost: 1,
    description: 'See total cost, payoff dates, and hidden fees',
  },
  whatIfSimulation: {
    name: 'What-If Simulation',
    cost: 1,
    description: 'Test changes to terms, payments, or payoff strategies',
  },
  refinanceScan: {
    name: 'Refinance Scan',
    cost: 1,
    description: 'Scan for better rates across all your loans',
  },
  p2pRequest: {
    name: 'P2P Loan Request',
    cost: 1,
    description: 'Request peer-to-peer loan from marketplace',
  },
} as const;

export function calculateSavings(): number {
  const yearlyMonthly = PREMIUM_PRICING.monthly.price * 12;
  const yearly = PREMIUM_PRICING.yearly.price;
  return Math.round(((yearlyMonthly - yearly) / yearlyMonthly) * 100);
}

export function getPremiumPriceDisplay(plan: 'monthly' | 'yearly'): string {
  const config = PREMIUM_PRICING[plan];
  return `${config.displayPrice}/${config.periodShort}`;
}

export function getTierName(tier: SubscriptionTier): string {
  return TIER_CONFIG[tier].name;
}

export function getTierTokens(tier: SubscriptionTier): number {
  return TIER_CONFIG[tier].tokens;
}

export function getTierPrice(tier: SubscriptionTier): number {
  return TIER_CONFIG[tier].price;
}

export function getNextTier(currentTier: SubscriptionTier): SubscriptionTier | null {
  if (currentTier === 'basic') return 'plus';
  if (currentTier === 'plus') return 'pro';
  return null;
}

export function canPerformAction(tokens: number, actionCost: number = 1): boolean {
  return tokens >= actionCost;
}

export const PREMIUM_FEATURES = {
  core: [
    {
      title: 'Deeper Loan Analysis',
      description: 'See the full picture: lifetime cost, payoff dates, and hidden fees',
    },
    {
      title: 'What-If Simulations',
      description: 'Test changes to income, payoff speed, and refinance timing',
    },
    {
      title: 'Refinance Alerts',
      description: 'Auto-scan daily and get notified when we find better rates',
    },
    {
      title: 'Concierge Support',
      description: 'Priority email + in-app help with real financial advisors',
    },
    {
      title: 'Unlimited Comparisons',
      description: 'Side-by-side view for as many loans as you want',
    },
  ],
  comparison: [
    'Unlimited side-by-side comparisons',
    'Smart highlight of lowest lifetime cost',
    'Export-ready summary PDFs for advisors',
  ],
  simulation: [
    'Unlimited what-if scenarios',
    'AI insights on payoff timeline',
    'Auto alerts when scenario becomes viable',
  ],
  alerts: [
    'Daily Experian + lender scans',
    'Push alerts when savings > $50/mo',
    'Concierge review before notifying',
  ],
} as const;
