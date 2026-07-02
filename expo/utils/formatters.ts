export function formatCurrency(amount: number, compact = false): string {
  if (compact && amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (compact && amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}K`;
  }
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatCurrencyWithDecimals(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

export function getLoanTypeIcon(type: string): string {
  switch (type) {
    case 'mortgage': return 'Home';
    case 'auto': return 'Car';
    case 'personal': return 'User';
    case 'student': return 'GraduationCap';
    case 'business': return 'Briefcase';
    default: return 'FileText';
  }
}

export function getLoanTypeLabel(type: string): string {
  switch (type) {
    case 'mortgage': return 'Mortgage';
    case 'auto': return 'Auto Loan';
    case 'personal': return 'Personal Loan';
    case 'student': return 'Student Loan';
    case 'business': return 'Business Loan';
    default: return 'Loan';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active': return '#16C784';
    case 'paid_off': return '#7A8A85';
    case 'delinquent': return '#FF4D6D';
    case 'in_review': return '#F5A623';
    default: return '#7A8A85';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'active': return 'Active';
    case 'paid_off': return 'Paid Off';
    case 'delinquent': return 'Delinquent';
    case 'in_review': return 'In Review';
    default: return status;
  }
}
