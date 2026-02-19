export interface PortfolioData {
  id: string;
  name: string;
  minInvestment: number;
  expectedReturn: string;
  risk: 'low' | 'medium' | 'high';
  duration: string;
  iconName: string;
  color: string;
  gradient: [string, string];
  description: string;
  longDescription: string;
  features: string[];
  benefits: { title: string; description: string; iconName: string }[];
  riskFactors: string[];
  howItWorks: string[];
  idealFor: string[];
  stats: { label: string; value: string; change?: string }[];
}

export const portfolioDataMap: Record<string, PortfolioData> = {
  diversified: {
    id: 'diversified',
    name: 'Diversified Portfolio',
    minInvestment: 100,
    expectedReturn: '6-10%',
    risk: 'low',
    duration: '12-36 months',
    iconName: 'PieChart',
    color: '#00D66F',
    gradient: ['#00D66F', '#00B85D'],
    description: 'Spread your investment across multiple loans to minimize risk',
    longDescription: 'Our Diversified Portfolio automatically distributes your investment across 10+ carefully vetted loans from various sectors, credit tiers, and loan types.',
    features: ['Auto-invest across 10+ loans', 'Balanced risk exposure', 'Monthly returns', 'Automatic rebalancing'],
    benefits: [
      { title: 'Risk Mitigation', description: 'Spread investments across multiple borrowers', iconName: 'Shield' },
      { title: 'Steady Returns', description: 'Monthly income from performing loans', iconName: 'TrendingUp' },
      { title: 'Automated Management', description: 'AI handles rebalancing for you', iconName: 'Award' },
    ],
    riskFactors: ['Individual loan defaults may occur', 'Returns not guaranteed', 'Market conditions may affect performance'],
    howItWorks: ['Deposit minimum $100', 'AI analyzes loan applications', 'Funds split across 10+ loans', 'Receive monthly interest payments', 'Reinvest or withdraw anytime'],
    idealFor: ['First-time P2P investors', 'Those seeking passive income', 'Risk-averse investors'],
    stats: [{ label: 'Avg. Annual Return', value: '8.2%', change: '+1.3%' }, { label: 'Default Rate', value: '2.1%' }, { label: 'Active Investors', value: '4.2K' }, { label: 'Loans Funded', value: '12.5K' }],
  },
  'high-yield': {
    id: 'high-yield',
    name: 'High-Yield Focus',
    minInvestment: 500,
    expectedReturn: '10-15%',
    risk: 'medium',
    duration: '12-48 months',
    iconName: 'TrendingUp',
    color: '#1D9BF0',
    gradient: ['#1D9BF0', '#0D7AC7'],
    description: 'Target higher returns with carefully selected medium-risk loans',
    longDescription: 'High-Yield Focus targets borrowers with good credit (650-720) seeking larger loans with higher interest rates.',
    features: ['Curated high-yield loans', 'Credit-score filtering', 'Monthly or quarterly returns', 'Advanced analytics'],
    benefits: [
      { title: 'Higher Returns', description: '10-15% expected annual returns', iconName: 'TrendingUp' },
      { title: 'Curated Selection', description: 'Hand-picked loans vetted by experts', iconName: 'Award' },
      { title: 'Flexibility', description: 'Choose distribution schedule', iconName: 'Calendar' },
    ],
    riskFactors: ['Higher default risk', 'Credit score variations', 'Economic downturns can impact performance'],
    howItWorks: ['Minimum $500 investment', 'Browse curated listings', 'Select loans or use auto-invest', 'Track with real-time analytics'],
    idealFor: ['Experienced P2P investors', 'Those comfortable with moderate risk', 'Active portfolio managers'],
    stats: [{ label: 'Avg. Annual Return', value: '12.4%', change: '+2.1%' }, { label: 'Default Rate', value: '4.2%' }, { label: 'Active Investors', value: '2.8K' }, { label: 'Avg. Investment', value: '$2.4K' }],
  },
  premium: {
    id: 'premium',
    name: 'Premium Investor',
    minInvestment: 2000,
    expectedReturn: '12-18%',
    risk: 'medium',
    duration: '24-60 months',
    iconName: 'Sparkles',
    color: '#FFD400',
    gradient: ['#FFD400', '#E6BE00'],
    description: 'Exclusive access to premium loan listings with higher returns',
    longDescription: 'Premium Investor tier provides early access to high-quality borrowers with excellent credit profiles.',
    features: ['Early access to listings', 'Dedicated account manager', 'Tax optimization guidance', 'VIP events'],
    benefits: [
      { title: 'Exclusive Access', description: 'First look at premium borrowers', iconName: 'Sparkles' },
      { title: 'Personal Support', description: 'Dedicated account manager', iconName: 'Users' },
      { title: 'Tax Guidance', description: 'Tax-efficient investing strategies', iconName: 'Award' },
    ],
    riskFactors: ['Larger minimum investment', 'Returns dependent on borrower performance', 'Longer horizon recommended'],
    howItWorks: ['Minimum $2,000 investment', 'Get matched with account manager', 'Receive early access to listings', 'Quarterly portfolio reviews'],
    idealFor: ['High net worth individuals', 'Serious P2P investors', 'Those seeking personalized service'],
    stats: [{ label: 'Avg. Annual Return', value: '14.8%', change: '+3.2%' }, { label: 'Default Rate', value: '1.8%' }, { label: 'Active Investors', value: '892' }, { label: 'Avg. Investment', value: '$12.5K' }],
  },
  conservative: {
    id: 'conservative',
    name: 'Conservative Growth',
    minInvestment: 50,
    expectedReturn: '4-7%',
    risk: 'low',
    duration: '6-24 months',
    iconName: 'Shield',
    color: '#00B85D',
    gradient: ['#00B85D', '#008F4A'],
    description: 'Safe and steady returns with low-risk, verified borrowers',
    longDescription: 'Conservative Growth focuses on borrowers with excellent credit (720+), stable employment, and low debt-to-income ratios.',
    features: ['Verified borrowers only', 'Credit score 720+', 'Shorter loan terms', 'Principal protection'],
    benefits: [
      { title: 'Maximum Safety', description: 'Lowest default rates with verified borrowers', iconName: 'Shield' },
      { title: 'Short Terms', description: '6-24 month loans for faster capital return', iconName: 'Clock' },
      { title: 'Protected Principal', description: 'Insurance coverage for qualified defaults', iconName: 'CheckCircle2' },
    ],
    riskFactors: ['Lower returns', 'Inflation may exceed returns', 'Limited growth potential'],
    howItWorks: ['Start with as little as $50', 'Funds allocated to top-tier borrowers', 'Short 6-24 month terms', 'Monthly interest payments'],
    idealFor: ['Conservative investors', 'Retirees seeking income', 'Those new to P2P lending'],
    stats: [{ label: 'Avg. Annual Return', value: '5.6%', change: '+0.8%' }, { label: 'Default Rate', value: '0.6%' }, { label: 'Active Investors', value: '6.7K' }, { label: 'Avg. Loan Term', value: '18 mo' }],
  },
  rapid: {
    id: 'rapid',
    name: 'Rapid Returns',
    minInvestment: 1000,
    expectedReturn: '8-12%',
    risk: 'medium',
    duration: '3-12 months',
    iconName: 'Zap',
    color: '#F4212E',
    gradient: ['#F4212E', '#C0192A'],
    description: 'Quick turnaround investments for active investors',
    longDescription: 'Rapid Returns specializes in short-term loans (3-12 months) for borrowers needing bridge financing or seasonal capital.',
    features: ['Short-term loans only', 'Fast capital turnover', 'Monthly reinvestment', 'Instant withdrawals'],
    benefits: [
      { title: 'Fast Turnover', description: '3-12 month loans for quick returns', iconName: 'Zap' },
      { title: 'High Liquidity', description: 'Easy access to your funds', iconName: 'DollarSign' },
      { title: 'Active Trading', description: 'Frequent portfolio changes', iconName: 'BarChart3' },
    ],
    riskFactors: ['Higher default risk on shorter terms', 'Requires active management', 'Frequent reinvestment needed'],
    howItWorks: ['Invest minimum $1,000', 'Select 3-12 month loans', 'Receive payments as loans mature', 'Auto-reinvest or withdraw'],
    idealFor: ['Active investors', 'Those needing liquidity', 'Experienced traders'],
    stats: [{ label: 'Avg. Annual Return', value: '10.2%', change: '+1.8%' }, { label: 'Default Rate', value: '3.4%' }, { label: 'Active Investors', value: '1.9K' }, { label: 'Avg. Loan Term', value: '8 mo' }],
  },
  custom: {
    id: 'custom',
    name: 'Custom Strategy',
    minInvestment: 5000,
    expectedReturn: 'Variable',
    risk: 'low',
    duration: 'Flexible',
    iconName: 'Target',
    color: '#9E5AF2',
    gradient: ['#9E5AF2', '#7E42D2'],
    description: 'Work with our team to create a personalized investment strategy',
    longDescription: 'Custom Strategy is designed for sophisticated investors who want a tailored approach with dedicated account management.',
    features: ['Custom portfolio design', '1-on-1 strategy sessions', 'Risk profiling', 'VIP support'],
    benefits: [
      { title: 'Fully Customized', description: 'Portfolio built for your goals', iconName: 'Target' },
      { title: 'Expert Guidance', description: 'Direct access to strategy team', iconName: 'Users' },
      { title: 'Flexible Terms', description: 'Choose your own mix', iconName: 'Award' },
    ],
    riskFactors: ['Significant minimum investment', 'Returns vary by strategy', 'May require longer commitment'],
    howItWorks: ['Minimum $5,000 investment', 'Schedule consultation', 'Complete risk profile', 'Receive custom proposal'],
    idealFor: ['High net worth investors', 'Those with specific goals', 'Sophisticated portfolio managers'],
    stats: [{ label: 'Min. Investment', value: '$5K' }, { label: 'Active Investors', value: '324' }, { label: 'Avg. Investment', value: '$28K' }, { label: 'Satisfaction', value: '98%' }],
  },
};
