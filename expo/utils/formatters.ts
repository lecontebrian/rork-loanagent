type NumberInputFormatOptions = {
  allowDecimal?: boolean;
  maxDecimals?: number;
  compactMillions?: boolean;
};

export function parseNumberInput(text: string): number {
  if (!text) return 0;

  const trimmed = text.trim();
  if (!trimmed) return 0;

  const upper = trimmed.toUpperCase();
  const endsWithM = upper.endsWith('M');
  const endsWithK = upper.endsWith('K');
  const multiplier = endsWithM ? 1_000_000 : endsWithK ? 1_000 : 1;

  const core = (endsWithM || endsWithK) ? upper.slice(0, -1) : upper;
  const cleaned = core.replace(/,/g, '').replace(/[^0-9.]/g, '');
  if (!cleaned) return 0;

  const parts = cleaned.split('.');
  const normalized = parts.length <= 2 ? cleaned : `${parts[0]}.${parts.slice(1).join('')}`;

  const n = Number.parseFloat(normalized);
  return Number.isFinite(n) ? n * multiplier : 0;
}

export function formatNumberInputText(text: string, options?: NumberInputFormatOptions): string {
  const allowDecimal = options?.allowDecimal ?? true;
  const maxDecimals = options?.maxDecimals ?? 2;
  const compactMillions = options?.compactMillions ?? true;

  if (!text) return '';

  const raw = text.trim();
  if (!raw) return '';

  const upper = raw.toUpperCase();
  const hasSuffix = upper.endsWith('M') || upper.endsWith('K');
  const suffix = upper.endsWith('M') ? 'M' : upper.endsWith('K') ? 'K' : '';

  const core = hasSuffix ? upper.slice(0, -1) : upper;
  const cleaned = core.replace(/,/g, '').replace(/[^0-9.]/g, '');
  if (!cleaned) return hasSuffix ? suffix : '';

  const parts = cleaned.split('.');
  const integerPart = parts[0] ?? '';
  const decimalPart = parts[1] ?? '';
  const hadDot = cleaned.includes('.');

  const safeInt = integerPart.replace(/^0+(?=\d)/, '');
  const intNum = Number.parseInt(safeInt || '0', 10);
  const formattedInt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(
    Number.isFinite(intNum) ? intNum : 0,
  );

  let formatted = formattedInt;

  if (allowDecimal && hadDot) {
    const trimmedDecimal = decimalPart.slice(0, maxDecimals);
    formatted = trimmedDecimal.length > 0 ? `${formattedInt}.${trimmedDecimal}` : `${formattedInt}.`;
  }

  const value = parseNumberInput(`${formatted}${suffix}`);
  if (compactMillions && value >= 1_000_000) {
    const millions = value / 1_000_000;
    const dec = millions % 1 === 0 ? 0 : millions < 10 ? 1 : 1;
    return `${millions.toFixed(dec)}M`;
  }

  return `${formatted}${suffix}`;
}

export const formatCurrency = (value: number, options?: { decimals?: number; compact?: boolean }): string => {
  if (isNaN(value) || value === null || value === undefined) return '$0';

  const decimals = options?.decimals ?? 0;
  const compact = options?.compact ?? false;

  if (compact) {
    if (value >= 1000000) {
      const millions = value / 1000000;
      return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
    } else if (value >= 1000) {
      const thousands = value / 1000;
      return `${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}K`;
    }
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatNumber = (value: number, decimals: number = 0): string => {
  if (isNaN(value) || value === null || value === undefined) return '0';

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatCompactCurrency = (value: number): string => {
  if (isNaN(value) || value === null || value === undefined) return '$0';

  if (value >= 1000000) {
    const millions = value / 1000000;
    return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  } else if (value >= 1000) {
    const thousands = value / 1000;
    return `${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}K`;
  }
  return `${Math.round(value)}`;
};

export const formatPercent = (value: number, decimals: number = 0): string => {
  if (isNaN(value) || value === null || value === undefined) return '0%';

  return `${value.toFixed(decimals)}%`;
};

export const formatCompactNumber = (value: number): string => {
  if (isNaN(value) || value === null || value === undefined) return '0';

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1_000_000_000) {
    const billions = absValue / 1_000_000_000;
    const formatted = billions % 1 === 0 ? billions.toFixed(0) : billions.toFixed(1).replace(/\.0$/, '');
    return `${sign}${formatted}B`;
  } else if (absValue >= 1_000_000) {
    const millions = absValue / 1_000_000;
    const formatted = millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1).replace(/\.0$/, '');
    return `${sign}${formatted}M`;
  } else if (absValue >= 1_000) {
    const thousands = absValue / 1_000;
    const formatted = thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1).replace(/\.0$/, '');
    return `${sign}${formatted}K`;
  }

  return `${sign}${Math.round(absValue)}`;
};

export const formatSmartCurrency = (value: number): string => {
  if (isNaN(value) || value === null || value === undefined) return '$0';

  if (value >= 1000000) {
    const millions = value / 1000000;
    return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  } else if (value >= 10000) {
    const thousands = value / 1000;
    return `${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}K`;
  } else if (value >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
};
