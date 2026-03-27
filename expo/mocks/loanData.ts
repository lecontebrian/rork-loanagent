import { LoanCategory, Lender, LoanOffer, LoanType } from '@/types';

export const loanCategories: LoanCategory[] = [
  {
    id: 'auto',
    name: 'Auto Loan',
    description: 'Finance your dream car with competitive rates',
    icon: 'car',
    minAmount: 5000,
    maxAmount: 100000,
  },
  {
    id: 'home',
    name: 'Home Loan',
    description: 'Buy or refinance your home',
    icon: 'home',
    minAmount: 50000,
    maxAmount: 1000000,
  },
  {
    id: 'personal',
    name: 'Personal Loan',
    description: 'For any personal expense',
    icon: 'wallet',
    minAmount: 1000,
    maxAmount: 50000,
  },
  {
    id: 'business',
    name: 'Business Loan',
    description: 'Grow your business with capital',
    icon: 'briefcase',
    minAmount: 10000,
    maxAmount: 500000,
  },
  {
    id: 'education',
    name: 'Education Loan',
    description: 'Invest in your future',
    icon: 'graduation-cap',
    minAmount: 5000,
    maxAmount: 150000,
  },
  {
    id: 'debt',
    name: 'Debt Consolidation',
    description: 'Simplify and save on multiple debts',
    icon: 'repeat',
    minAmount: 5000,
    maxAmount: 100000,
  },
];

export const lenders: Record<string, Lender> = {
  wellsFargo: {
    id: 'wells-fargo',
    name: 'Wells Fargo',
    logo: 'https://cdn.brandfetch.io/wellsfargo.com/w/400/h/400',
    rating: 4.5,
    reviewCount: 12453,
    trustScore: 95,
  },
  chaseBank: {
    id: 'chase-bank',
    name: 'Chase',
    logo: 'https://cdn.brandfetch.io/chase.com/w/400/h/400',
    rating: 4.6,
    reviewCount: 18234,
    trustScore: 97,
  },
  bankOfAmerica: {
    id: 'bank-of-america',
    name: 'Bank of America',
    logo: 'https://cdn.brandfetch.io/bankofamerica.com/w/400/h/400',
    rating: 4.4,
    reviewCount: 15432,
    trustScore: 96,
  },
  pnc: {
    id: 'pnc',
    name: 'PNC Bank',
    logo: 'https://cdn.brandfetch.io/pnc.com/w/400/h/400',
    rating: 4.5,
    reviewCount: 14234,
    trustScore: 96,
  },
  truist: {
    id: 'truist',
    name: 'Truist',
    logo: 'https://cdn.brandfetch.io/truist.com/w/400/h/400',
    rating: 4.4,
    reviewCount: 13456,
    trustScore: 95,
  },
  citiBank: {
    id: 'citi-bank',
    name: 'Citi',
    logo: 'https://cdn.brandfetch.io/citi.com/w/400/h/400',
    rating: 4.5,
    reviewCount: 13245,
    trustScore: 95,
  },
  usBank: {
    id: 'us-bank',
    name: 'U.S. Bank',
    logo: 'https://cdn.brandfetch.io/usbank.com/w/400/h/400',
    rating: 4.3,
    reviewCount: 11234,
    trustScore: 94,
  },
  capitalOne: {
    id: 'capital-one',
    name: 'Capital One',
    logo: 'https://cdn.brandfetch.io/capitalone.com/w/400/h/400',
    rating: 4.4,
    reviewCount: 16543,
    trustScore: 94,
  },
  discover: {
    id: 'discover',
    name: 'Discover',
    logo: 'https://cdn.brandfetch.io/discover.com/w/400/h/400',
    rating: 4.6,
    reviewCount: 14321,
    trustScore: 95,
  },
  tdBank: {
    id: 'td-bank',
    name: 'TD Bank',
    logo: 'https://cdn.brandfetch.io/td.com/w/400/h/400',
    rating: 4.3,
    reviewCount: 11567,
    trustScore: 93,
  },
  regions: {
    id: 'regions',
    name: 'Regions Bank',
    logo: 'https://cdn.brandfetch.io/regions.com/w/400/h/400',
    rating: 4.2,
    reviewCount: 9876,
    trustScore: 92,
  },
  fifthThird: {
    id: 'fifth-third',
    name: 'Fifth Third Bank',
    logo: 'https://cdn.brandfetch.io/53.com/w/400/h/400',
    rating: 4.2,
    reviewCount: 8765,
    trustScore: 91,
  },
  ally: {
    id: 'ally',
    name: 'Ally Bank',
    logo: 'https://cdn.brandfetch.io/ally.com/w/400/h/400',
    rating: 4.7,
    reviewCount: 12456,
    trustScore: 94,
  },
  marcus: {
    id: 'marcus',
    name: 'Marcus by Goldman Sachs',
    logo: 'https://cdn.brandfetch.io/marcus.com/w/400/h/400',
    rating: 4.8,
    reviewCount: 10234,
    trustScore: 95,
  },
  synchrony: {
    id: 'synchrony',
    name: 'Synchrony Bank',
    logo: 'https://cdn.brandfetch.io/synchrony.com/w/400/h/400',
    rating: 4.1,
    reviewCount: 8543,
    trustScore: 90,
  },
  citizensBank: {
    id: 'citizens-bank',
    name: 'Citizens Bank',
    logo: 'https://cdn.brandfetch.io/citizensbank.com/w/400/h/400',
    rating: 4.3,
    reviewCount: 10456,
    trustScore: 93,
  },
  keyBank: {
    id: 'key-bank',
    name: 'KeyBank',
    logo: 'https://cdn.brandfetch.io/key.com/w/400/h/400',
    rating: 4.2,
    reviewCount: 9234,
    trustScore: 92,
  },
  huntington: {
    id: 'huntington',
    name: 'Huntington Bank',
    logo: 'https://cdn.brandfetch.io/huntington.com/w/400/h/400',
    rating: 4.3,
    reviewCount: 9567,
    trustScore: 92,
  },
  sofi: {
    id: 'sofi',
    name: 'SoFi',
    logo: 'https://cdn.brandfetch.io/sofi.com/w/400/h/400',
    rating: 4.8,
    reviewCount: 9876,
    trustScore: 93,
  },
  upstart: {
    id: 'upstart',
    name: 'Upstart',
    logo: 'https://cdn.brandfetch.io/upstart.com/w/400/h/400',
    rating: 4.4,
    reviewCount: 5432,
    trustScore: 89,
  },
  lendingClub: {
    id: 'lending-club',
    name: 'LendingClub',
    logo: 'https://cdn.brandfetch.io/lendingclub.com/w/400/h/400',
    rating: 4.3,
    reviewCount: 7654,
    trustScore: 88,
  },
  prosper: {
    id: 'prosper',
    name: 'Prosper',
    logo: 'https://cdn.brandfetch.io/prosper.com/w/400/h/400',
    rating: 4.2,
    reviewCount: 6543,
    trustScore: 87,
  },
  rocketMortgage: {
    id: 'rocket-mortgage',
    name: 'Rocket Mortgage',
    logo: 'https://cdn.brandfetch.io/rocketmortgage.com/w/400/h/400',
    rating: 4.7,
    reviewCount: 15678,
    trustScore: 96,
  },
  betterMortgage: {
    id: 'better-mortgage',
    name: 'Better.com',
    logo: 'https://cdn.brandfetch.io/better.com/w/400/h/400',
    rating: 4.5,
    reviewCount: 11234,
    trustScore: 91,
  },
  loanDepot: {
    id: 'loan-depot',
    name: 'loanDepot',
    logo: 'https://cdn.brandfetch.io/loandepot.com/w/400/h/400',
    rating: 4.3,
    reviewCount: 9876,
    trustScore: 90,
  },
  affirm: {
    id: 'affirm',
    name: 'Affirm',
    logo: 'https://cdn.brandfetch.io/affirm.com/w/400/h/400',
    rating: 4.7,
    reviewCount: 14321,
    trustScore: 92,
  },
  afterpay: {
    id: 'afterpay',
    name: 'Afterpay',
    logo: 'https://cdn.brandfetch.io/afterpay.com/w/400/h/400',
    rating: 4.6,
    reviewCount: 13456,
    trustScore: 91,
  },
  klarna: {
    id: 'klarna',
    name: 'Klarna',
    logo: 'https://cdn.brandfetch.io/klarna.com/w/400/h/400',
    rating: 4.5,
    reviewCount: 12765,
    trustScore: 90,
  },
  navyFederal: {
    id: 'navy-federal',
    name: 'Navy Federal Credit Union',
    logo: 'https://cdn.brandfetch.io/navyfederal.org/w/400/h/400',
    rating: 4.9,
    reviewCount: 18765,
    trustScore: 98,
  },
  pentagon: {
    id: 'pentagon',
    name: 'Pentagon Federal Credit Union',
    logo: 'https://cdn.brandfetch.io/penfed.org/w/400/h/400',
    rating: 4.7,
    reviewCount: 14567,
    trustScore: 96,
  },
  alliant: {
    id: 'alliant',
    name: 'Alliant Credit Union',
    logo: 'https://cdn.brandfetch.io/alliantcreditunion.org/w/400/h/400',
    rating: 4.8,
    reviewCount: 12345,
    trustScore: 95,
  },
  schwab: {
    id: 'schwab',
    name: 'Charles Schwab Bank',
    logo: 'https://cdn.brandfetch.io/schwab.com/w/400/h/400',
    rating: 4.7,
    reviewCount: 13456,
    trustScore: 96,
  },
  americanExpress: {
    id: 'american-express',
    name: 'American Express',
    logo: 'https://cdn.brandfetch.io/americanexpress.com/w/400/h/400',
    rating: 4.6,
    reviewCount: 15678,
    trustScore: 95,
  },
  barclays: {
    id: 'barclays',
    name: 'Barclays',
    logo: 'https://cdn.brandfetch.io/barclays.com/w/400/h/400',
    rating: 4.4,
    reviewCount: 11234,
    trustScore: 93,
  },
  quickenLoans: {
    id: 'quicken-loans',
    name: 'Quicken Loans',
    logo: 'https://cdn.brandfetch.io/quickenloans.com/w/400/h/400',
    rating: 4.6,
    reviewCount: 14532,
    trustScore: 95,
  },
  guaranteedRate: {
    id: 'guaranteed-rate',
    name: 'Guaranteed Rate',
    logo: 'https://cdn.brandfetch.io/rate.com/w/400/h/400',
    rating: 4.5,
    reviewCount: 11876,
    trustScore: 93,
  },
  caliberHomeLoans: {
    id: 'caliber-home-loans',
    name: 'Caliber Home Loans',
    logo: 'https://cdn.brandfetch.io/caliberhomeloans.com/w/400/h/400',
    rating: 4.4,
    reviewCount: 9234,
    trustScore: 91,
  },
  fairwayIndependent: {
    id: 'fairway-independent',
    name: 'Fairway Independent Mortgage',
    logo: 'https://cdn.brandfetch.io/fairwayindependentmc.com/w/400/h/400',
    rating: 4.6,
    reviewCount: 10543,
    trustScore: 92,
  },
  newAmericanFunding: {
    id: 'new-american-funding',
    name: 'New American Funding',
    logo: 'https://cdn.brandfetch.io/newamericanfunding.com/w/400/h/400',
    rating: 4.5,
    reviewCount: 8765,
    trustScore: 90,
  },
  loanPal: {
    id: 'loan-pal',
    name: 'LoanPal',
    logo: 'https://cdn.brandfetch.io/loanpal.com/w/400/h/400',
    rating: 4.3,
    reviewCount: 7234,
    trustScore: 89,
  },
  lendingTree: {
    id: 'lending-tree',
    name: 'LendingTree',
    logo: 'https://cdn.brandfetch.io/lendingtree.com/w/400/h/400',
    rating: 4.4,
    reviewCount: 12456,
    trustScore: 88,
  },
  freedomMortgage: {
    id: 'freedom-mortgage',
    name: 'Freedom Mortgage',
    logo: 'https://cdn.brandfetch.io/freedommortgage.com/w/400/h/400',
    rating: 4.3,
    reviewCount: 9876,
    trustScore: 90,
  },
};

const mortgageLenders = [
  'rocketMortgage',
  'betterMortgage',
  'loanDepot',
  'quickenLoans',
  'guaranteedRate',
  'caliberHomeLoans',
  'fairwayIndependent',
  'newAmericanFunding',
  'chaseBank',
  'wellsFargo',
  'bankOfAmerica',
  'freedomMortgage',
];

const autoLenders = [
  'chaseBank',
  'wellsFargo',
  'bankOfAmerica',
  'capitalOne',
  'ally',
  'usBank',
  'pnc',
  'truist',
  'tdBank',
  'discover',
];

const personalLenders = [
  'sofi',
  'marcus',
  'discover',
  'lendingClub',
  'upstart',
  'prosper',
  'chaseBank',
  'capitalOne',
  'wellsFargo',
  'synchrony',
  'citiBank',
];

export const generateLoanOffers = (
  loanType: LoanType,
  amount: number,
  creditScore: number
): LoanOffer[] => {
  const baseRate = creditScore > 750 ? 4.5 : creditScore > 700 ? 6.5 : creditScore > 650 ? 9.5 : 12.5;
  
  let lenderIds: string[];
  if (loanType === 'home') {
    lenderIds = mortgageLenders;
  } else if (loanType === 'auto') {
    lenderIds = autoLenders;
  } else {
    lenderIds = personalLenders;
  }
  
  const selectedLenders = lenderIds
    .map(id => lenders[id])
    .filter(Boolean)
    .slice(0, 5 + Math.floor(Math.random() * 3));
  
  return selectedLenders.map((lender, index) => {
    const rateVariation = (Math.random() - 0.5) * 3;
    let interestRate = Math.max(3, baseRate + rateVariation);
    let termMonths = 36;
    
    if (loanType === 'home') {
      termMonths = 360;
      interestRate = Math.max(3, creditScore > 750 ? 6.5 : creditScore > 700 ? 7.2 : creditScore > 650 ? 8.5 : 10.0) + rateVariation;
    } else if (loanType === 'auto') {
      termMonths = 72;
      interestRate = Math.max(2.5, creditScore > 750 ? 4.0 : creditScore > 700 ? 5.5 : creditScore > 650 ? 7.5 : 10.5) + rateVariation;
    } else {
      termMonths = 36;
    }
    
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
      (Math.pow(1 + monthlyRate, termMonths) - 1);
    const totalPayment = monthlyPayment * termMonths;
    
    const approvalLikelihood = Math.max(
      50,
      Math.min(98, 85 + (creditScore - 700) / 10 - index * 5)
    );
    
    let features: string[];
    if (loanType === 'home') {
      features = [
        'No prepayment penalty',
        index % 2 === 0 ? 'Low closing costs' : 'Free home appraisal',
        index % 3 === 0 ? 'First-time buyer programs' : 'Rate lock guarantee',
        'Online document upload',
      ];
    } else if (loanType === 'auto') {
      features = [
        'No prepayment penalty',
        'Fast approval (24-48 hours)',
        index % 2 === 0 ? 'New & used cars' : 'Refinance available',
        index % 3 === 0 ? 'No origination fee' : 'Flexible terms',
      ];
    } else {
      features = [
        'No prepayment penalty',
        'Fast approval',
        index % 2 === 0 ? 'Rate match guarantee' : 'Flexible terms',
        index % 3 === 0 ? 'No origination fee' : 'Low closing costs',
      ];
    }
    
    return {
      id: `${lender.id}-${loanType}-${Date.now()}-${index}`,
      lender,
      loanType,
      interestRate: Number(interestRate.toFixed(2)),
      termMonths,
      monthlyPayment: Number(monthlyPayment.toFixed(2)),
      totalPayment: Number(totalPayment.toFixed(2)),
      amount,
      approvalLikelihood: Number(approvalLikelihood.toFixed(0)),
      features,
      processingTime: loanType === 'home' ? (index === 0 ? '7-14 days' : index === 1 ? '14-21 days' : '21-30 days') : (index === 0 ? '1-2 days' : index === 1 ? '2-3 days' : '3-5 days'),
    };
  }).sort((a, b) => a.interestRate - b.interestRate);
};
