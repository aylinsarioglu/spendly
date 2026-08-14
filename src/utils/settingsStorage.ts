import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AppSettings, CurrencyCode, ThemeMode } from '../types/settings';
import { defaultCurrency } from './currency';

const SETTINGS_KEY = 'app_settings';
const defaultTheme: ThemeMode = 'dark';

export const defaultAppSettings: AppSettings = {
  currency: defaultCurrency,
  theme: defaultTheme,
};

function isCurrency(value: unknown): value is CurrencyCode {
  return value === 'TRY' || value === 'USD' || value === 'EUR';
}

function isTheme(value: unknown): value is ThemeMode {
  return value === 'dark' || value === 'light';
}

function normalizeSettings(value: unknown): AppSettings {
  if (typeof value !== 'object' || value === null) {
    return defaultAppSettings;
  }

  const settings = value as Record<string, unknown>;

  return {
    currency: isCurrency(settings.currency)
      ? settings.currency
      : defaultAppSettings.currency,
    theme: isTheme(settings.theme) ? settings.theme : defaultAppSettings.theme,
  };
}

export async function loadAppSettings(): Promise<AppSettings> {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);

    if (!data) {
      return defaultAppSettings;
    }

    return normalizeSettings(JSON.parse(data) as unknown);
  } catch {
    return defaultAppSettings;
  }
}

export async function saveAppSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
