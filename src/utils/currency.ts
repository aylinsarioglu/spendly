import type { CurrencyCode, CurrencyOption } from '../types/settings';

const CURRENCY_CONFIG: Record<
  CurrencyCode,
  { symbol: string; locale: string; label: string }
> = {
  TRY: { symbol: '₺', locale: 'tr-TR', label: 'TRY ₺' },
  USD: { symbol: '$', locale: 'en-US', label: 'USD $' },
  EUR: { symbol: '€', locale: 'de-DE', label: 'EUR €' },
};

export const currencyOptions: CurrencyOption[] = (
  Object.keys(CURRENCY_CONFIG) as CurrencyCode[]
).map((code) => ({
  code,
  label: CURRENCY_CONFIG[code].label,
  symbol: CURRENCY_CONFIG[code].symbol,
}));

export const defaultCurrency: CurrencyCode = 'TRY';

export function getCurrencySymbol(currency: CurrencyCode): string {
  return CURRENCY_CONFIG[currency].symbol;
}

export function formatCurrency(
  amount: number,
  currency: CurrencyCode = defaultCurrency,
): string {
  const config = CURRENCY_CONFIG[currency];
  return `${config.symbol}${amount.toLocaleString(config.locale)}`;
}
