import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { getThemeColors, type ThemeColors } from '../theme/colors';
import type { AppSettings, CurrencyCode, ThemeMode } from '../types/settings';
import { formatCurrency } from '../utils/currency';
import {
  defaultAppSettings,
  loadAppSettings,
  saveAppSettings,
} from '../utils/settingsStorage';

type AppSettingsContextValue = {
  ready: boolean;
  currency: CurrencyCode;
  theme: ThemeMode;
  colors: ThemeColors;
  setCurrency: (currency: CurrencyCode) => void;
  setTheme: (theme: ThemeMode) => void;
  formatMoney: (amount: number) => string;
};

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultAppSettings);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const hydrateSettings = async () => {
      const stored = await loadAppSettings();

      if (isMounted) {
        setSettings(stored);
        setReady(true);
      }
    };

    hydrateSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const setCurrency = useCallback((currency: CurrencyCode) => {
    setSettings((prev) => {
      const next = { ...prev, currency };
      saveAppSettings(next).catch((error) => {
        console.error('Failed to save settings:', error);
      });
      return next;
    });
  }, []);

  const setTheme = useCallback((theme: ThemeMode) => {
    setSettings((prev) => {
      const next = { ...prev, theme };
      saveAppSettings(next).catch((error) => {
        console.error('Failed to save settings:', error);
      });
      return next;
    });
  }, []);

  const value = useMemo<AppSettingsContextValue>(() => {
    const colors = getThemeColors(settings.theme);

    return {
      ready,
      currency: settings.currency,
      theme: settings.theme,
      colors,
      setCurrency,
      setTheme,
      formatMoney: (amount: number) => formatCurrency(amount, settings.currency),
    };
  }, [ready, settings, setCurrency, setTheme]);

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings(): AppSettingsContextValue {
  const context = useContext(AppSettingsContext);

  if (!context) {
    throw new Error('useAppSettings must be used within AppSettingsProvider');
  }

  return context;
}
