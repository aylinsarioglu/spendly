export type ThemeColors = {
  background: string;
  card: string;
  cardElevated: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  overlay: string;
  input: string;
  danger: string;
};

export const darkColors: ThemeColors = {
  background: '#0A0A0C',
  card: '#16161A',
  cardElevated: '#1E1E24',
  border: '#2A2A32',
  textPrimary: '#F5F5F7',
  textSecondary: '#8E8E93',
  textMuted: '#636366',
  accent: '#6C5CE7',
  accentSoft: 'rgba(108, 92, 231, 0.15)',
  overlay: 'rgba(0, 0, 0, 0.65)',
  input: '#121216',
  danger: '#FF6B6B',
};

export const lightColors: ThemeColors = {
  background: '#F2F2F7',
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  border: '#E5E5EA',
  textPrimary: '#1C1C1E',
  textSecondary: '#6C6C70',
  textMuted: '#8E8E93',
  accent: '#6C5CE7',
  accentSoft: 'rgba(108, 92, 231, 0.12)',
  overlay: 'rgba(0, 0, 0, 0.45)',
  input: '#F2F2F7',
  danger: '#FF3B30',
};

export function getThemeColors(theme: 'dark' | 'light'): ThemeColors {
  return theme === 'light' ? lightColors : darkColors;
}

export const colors = darkColors;
