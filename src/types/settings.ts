export type CurrencyCode = 'TRY' | 'USD' | 'EUR';

export type ThemeMode = 'dark' | 'light';

export type AppSettings = {
  currency: CurrencyCode;
  theme: ThemeMode;
};

export type CurrencyOption = {
  code: CurrencyCode;
  label: string;
  symbol: string;
};

export type ThemeOption = {
  value: ThemeMode;
  label: string;
};
