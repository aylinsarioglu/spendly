import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useAppSettings } from '../context/AppSettingsContext';
import type { ThemeColors } from '../theme/colors';

export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (colors: ThemeColors) => T,
): T {
  const { colors } = useAppSettings();

  return useMemo(() => factory(colors), [colors, factory]);
}
